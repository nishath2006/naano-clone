import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { NotificationRow } from '@/lib/database.types'
import { timeAgo } from '@/lib/format'
import { Button, EmptyState, ErrorBanner, ListSkeleton, PageHeader, useToast } from '@/components/app/ui'
import { BellIcon } from '@/components/app/icons'

/** /app/notifications — everything the database wrote for this user (RLS: own rows). */
export default function Notifications() {
  const { user } = useAuth()
  const toast = useToast()
  const q = useQuery(async () => unwrap(await supabase.from('notifications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(100)) as NotificationRow[], [user?.id])
  const unread = (q.data ?? []).filter((n) => !n.read_at)

  const markAll = async () => {
    if (!unread.length) return
    const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).in('id', unread.map((n) => n.id))
    if (error) return toast.push('error', describeError(error))
    q.setData((q.data ?? []).map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
  }

  const markOne = async (n: NotificationRow) => {
    if (n.read_at) return
    q.setData((q.data ?? []).map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)))
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', n.id)
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Applications, bookings, drafts, posts going live and payouts."
        actions={
          <Button variant="secondary" size="sm" onClick={() => void markAll()} disabled={unread.length === 0}>
            Mark all as read
          </Button>
        }
      />
      {q.error ? (
        <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
      ) : q.loading ? (
        <ListSkeleton />
      ) : (q.data ?? []).length === 0 ? (
        <EmptyState icon={<BellIcon />} title="You're all caught up" body="Notifications arrive in real time as things happen on your campaigns and deals." />
      ) : (
        <ul className="divide-y divide-[#F3F4F6] rounded-2xl border border-[#E9EBF0] bg-white">
          {q.data?.map((n) => (
            <li key={n.id}>
              <Link to={n.href ?? '#'} onClick={() => void markOne(n)} className={`flex items-start gap-3 px-5 py-3.5 hover:bg-[#FAFAFA] ${n.read_at ? '' : 'bg-[#F8FAFF]'}`}>
                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.read_at ? 'bg-transparent' : 'bg-[#2563eb]'}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm ${n.read_at ? 'text-[#4B5563]' : 'font-semibold text-[#111827]'}`}>{n.title}</div>
                  {n.body && <div className="text-xs text-[#6B7280] line-clamp-2">{n.body}</div>}
                </div>
                <span className="shrink-0 text-[11px] text-[#9CA3AF]">{timeAgo(n.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
