import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { ConversationRow, MessageRow } from '@/lib/database.types'
import { timeAgo } from '@/lib/format'
import { Avatar, Button, EmptyState, ErrorBanner, Input, LinkButton, ListSkeleton, PageHeader, Skeleton } from '@/components/app/ui'
import { ChatIcon } from '@/components/app/icons'

type Conv = ConversationRow & {
  companies: { name: string; logo_url: string | null } | null
  creators: { name: string; avatar_url: string | null } | null
  campaigns: { title: string } | null
}

/** /app/messages and /app/messages/:id — company ↔ creator threads, live via Supabase Realtime. */
export default function Messages() {
  const { id } = useParams()
  const { profile } = useAuth()
  const isCompany = profile?.role === 'company'
  const list = useQuery(async () => unwrap(await supabase.from('conversations').select('*, companies(name, logo_url), creators(name, avatar_url), campaigns(title)').order('last_message_at', { ascending: false, nullsFirst: false })) as Conv[], [])

  const label = (c: Conv): { name: string; image: string | null } | null =>
    isCompany ? (c.creators ? { name: c.creators.name, image: c.creators.avatar_url } : null) : c.companies ? { name: c.companies.name, image: c.companies.logo_url } : null
  const active = list.data?.find((c) => c.id === id) ?? null

  return (
    <>
      <PageHeader title="Messages" subtitle="Direct conversations with the other side of each deal." />
      <div className="grid gap-4 lg:grid-cols-[300px_1fr] min-h-[520px]">
        <div className="rounded-2xl border border-[#E9EBF0] bg-white overflow-hidden">
          {list.error ? (
            <div className="p-4">
              <ErrorBanner onRetry={() => void list.reload()}>{describeError(list.error)}</ErrorBanner>
            </div>
          ) : list.loading ? (
            <div className="p-4">
              <ListSkeleton rows={3} />
            </div>
          ) : (list.data ?? []).length === 0 ? (
            <div className="p-4">
              <EmptyState icon={<ChatIcon />} title="No conversations" body={isCompany ? 'Message a creator from their profile or a deal.' : 'Brands will reach out here about deals.'} action={isCompany ? <LinkButton to="/app/marketplace" variant="secondary">Find creators</LinkButton> : undefined} />
            </div>
          ) : (
            <ul className="divide-y divide-[#F3F4F6]">
              {list.data?.map((c) => {
                const who = label(c)
                return (
                  <li key={c.id}>
                    <Link to={`/app/messages/${c.id}`} className={`flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] ${c.id === id ? 'bg-[#F7F4FF]' : ''}`}>
                      <Avatar src={who?.image} name={who?.name} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{who?.name ?? '—'}</div>
                        <div className="truncate text-xs text-[#9CA3AF]">{c.campaigns?.title ?? 'Direct message'}</div>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF]">{timeAgo(c.last_message_at)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-[#E9EBF0] bg-white flex flex-col min-h-[520px]">
          {id && active ? <Thread conversation={active} title={label(active)?.name ?? ''} /> : id && list.loading ? <Skeleton className="m-4 flex-1" /> : <div className="m-auto text-sm text-[#9CA3AF]">Select a conversation</div>}
        </div>
      </div>
    </>
  )
}

function Thread({ conversation, title }: { conversation: Conv; title: string }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<MessageRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    setMessages(null)
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at')
      .then(({ data, error: err }) => {
        if (!active) return
        if (err) setError(describeError(err))
        else setMessages(data as MessageRow[])
      })
    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` }, (payload) => {
        setMessages((m) => (m && !m.some((x) => x.id === (payload.new as MessageRow).id) ? [...m, payload.new as MessageRow] : m))
      })
      .subscribe()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [conversation.id])

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' })
    // mark the other side's messages as read
    if (messages && user) {
      const unread = messages.filter((m) => m.sender_id !== user.id && !m.read_at).map((m) => m.id)
      if (unread.length) void supabase.from('messages').update({ read_at: new Date().toISOString() }).in('id', unread)
    }
  }, [messages, user])

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const body = text.trim()
    if (!body || !user || sending) return
    setSending(true)
    const { data, error: err } = await supabase.from('messages').insert({ conversation_id: conversation.id, sender_id: user.id, body }).select('*').single()
    setSending(false)
    if (err) return setError(describeError(err))
    setText('')
    setMessages((m) => (m && !m.some((x) => x.id === (data as MessageRow).id) ? [...m, data as MessageRow] : m))
  }

  return (
    <>
      <div className="border-b border-[#F3F4F6] px-5 py-3">
        <div className="text-sm font-bold">{title}</div>
        {conversation.campaigns?.title && <div className="text-xs text-[#9CA3AF]">{conversation.campaigns.title}</div>}
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {error && <ErrorBanner>{error}</ErrorBanner>}
        {messages === null ? (
          <ListSkeleton rows={3} />
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-[#9CA3AF] py-10">Say hello — messages are delivered instantly.</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === user?.id
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line ${mine ? 'bg-[#7C5CFC] text-white rounded-br-md' : 'bg-[#F3F4F6] text-[#111827] rounded-bl-md'}`}>
                  {m.body}
                  <div className={`mt-1 text-[10px] ${mine ? 'text-violet-100' : 'text-[#9CA3AF]'}`}>{timeAgo(m.created_at)}</div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottom} />
      </div>
      <form onSubmit={(e) => void send(e)} className="flex gap-2 border-t border-[#F3F4F6] p-3">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" aria-label="Message" maxLength={4000} />
        <Button type="submit" loading={sending} disabled={!text.trim()}>
          Send
        </Button>
      </form>
    </>
  )
}
