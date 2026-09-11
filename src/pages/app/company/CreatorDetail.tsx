import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import { useBookmarks, useCompany } from '@/lib/useCompany'
import type { CollaborationRow, CreatorPostRow, CreatorRow } from '@/lib/database.types'
import { COLLAB_STATUS_LABEL, countryName, formatCompact, formatDate, formatMoney } from '@/lib/format'
import { Avatar, Badge, Button, Card, EmptyState, ErrorBanner, PageHeader, Pill, Skeleton, flag, useToast } from '@/components/app/ui'
import { ExternalIcon, LinkedInBadge, StarIcon } from '@/components/app/icons'
import { BookCreatorModal } from '@/components/app/BookCreatorModal'

/** /app/creators/:id — a creator's card in full, with Book / Save / Message actions. */
export default function CreatorDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const company = useCompany()
  const { bookmarks, toggle } = useBookmarks(company.data?.id)
  const [booking, setBooking] = useState(false)
  const [messaging, setMessaging] = useState(false)

  const q = useQuery(async () => {
    const creator = unwrap(await supabase.from('creators').select('*').eq('id', id).maybeSingle()) as CreatorRow | null
    if (!creator) return null
    const [posts, deals] = await Promise.all([
      unwrap(await supabase.from('creator_posts').select('*').eq('creator_id', id).order('posted_at', { ascending: false, nullsFirst: false }).limit(6)) as CreatorPostRow[],
      unwrap(await supabase.from('collaborations').select('*, campaigns(title)').eq('creator_id', id).order('created_at', { ascending: false })) as (CollaborationRow & { campaigns: { title: string } | null })[],
    ])
    return { creator, posts, deals }
  }, [id])

  const message = async () => {
    if (!company.data) return
    setMessaging(true)
    try {
      const existing = unwrap(await supabase.from('conversations').select('id').eq('company_id', company.data.id).eq('creator_id', id).maybeSingle()) as { id: string } | null
      if (existing) return navigate(`/app/messages/${existing.id}`)
      const created = unwrap(await supabase.from('conversations').insert({ company_id: company.data.id, creator_id: id }).select('id').single()) as { id: string }
      navigate(`/app/messages/${created.id}`)
    } catch (e) {
      toast.push('error', describeError(e))
    } finally {
      setMessaging(false)
    }
  }

  if (q.error) return <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
  if (q.loading) return <Skeleton className="h-96" />
  if (!q.data) return <EmptyState title="Creator not found" body="This profile is private or no longer exists." />
  const { creator, posts, deals } = q.data
  const saved = bookmarks.has(creator.id)

  return (
    <>
      <PageHeader
        back={{ to: '/app/marketplace', label: 'Marketplace' }}
        title={creator.name}
        subtitle={creator.headline}
        actions={
          <>
            <Button variant="secondary" onClick={() => void toggle(creator.id).catch((e) => toast.push('error', describeError(e)))} aria-pressed={saved}>
              <StarIcon width={16} height={16} filled={saved} /> {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => void message()} loading={messaging}>
              Message
            </Button>
            <Button onClick={() => setBooking(true)} disabled={!creator.accepting_bookings || !creator.price_cents}>
              Book
            </Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-4">
              <Avatar src={creator.avatar_url} name={creator.name} size={72} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold">{creator.name}</h2>
                  {creator.linkedin_url && (
                    <a href={creator.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#0a66c2] font-medium">
                      <LinkedInBadge size={18} /> LinkedIn <ExternalIcon width={12} height={12} />
                    </a>
                  )}
                </div>
                {creator.position && <div className="text-sm text-[#4B5563]">{creator.position}</div>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {creator.sectors.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                  {creator.country && (
                    <Pill>
                      {flag(creator.country)} {countryName(creator.country)}
                    </Pill>
                  )}
                  {creator.languages.map((l) => (
                    <Pill key={l}>{l}</Pill>
                  ))}
                </div>
              </div>
            </div>
            {creator.bio && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#4B5563]">{creator.bio}</p>}
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-bold">Audience</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                ['Followers', formatCompact(creator.followers)],
                ['Median views', formatCompact(creator.median_views)],
                ['Avg reactions', formatCompact(creator.avg_reactions)],
                ['Avg comments', formatCompact(creator.avg_comments)],
                ['Engagement', creator.engagement_rate != null ? `${creator.engagement_rate}%` : '—'],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-[#FAFBFC] border border-[#E9EBF0] p-3 text-center">
                  <div className="text-base font-bold">{v}</div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">{l}</div>
                </div>
              ))}
            </div>
            {creator.stats_updated_at && <p className="mt-2 text-xs text-[#9CA3AF]">Stats updated {formatDate(creator.stats_updated_at)}</p>}
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-bold">Recent posts</h2>
            {posts.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">No posts imported yet.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {posts.map((p) => (
                  <li key={p.id} className="rounded-xl border border-[#E9EBF0] p-3">
                    <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                      {p.kind || 'post'} {p.via_naano && <Badge tone="blue">via Naano</Badge>}
                    </div>
                    <p className="text-xs leading-5 text-[#4B5563] line-clamp-5 whitespace-pre-line">{p.body}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>
                        {formatCompact(p.reactions)} reactions · {formatCompact(p.comments)} comments
                      </span>
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer" className="font-medium text-[#2563eb]">
                          Open
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-bold">Pricing</h2>
            {creator.price_cents ? (
              <>
                <div className="text-2xl font-bold">{formatMoney(creator.price_cents)}</div>
                <div className="text-xs text-[#6B7280]">per sponsored post</div>
                {creator.bundle_posts && creator.bundle_price_cents && (
                  <div className="mt-3 rounded-xl bg-[#F5F8FF] px-3 py-2 text-xs text-[#1D4ED8]">
                    Bundle: {creator.bundle_posts} posts for {formatMoney(creator.bundle_price_cents)}
                  </div>
                )}
                <Badge tone={creator.accepting_bookings ? 'green' : 'gray'}>{creator.accepting_bookings ? 'Accepting bookings' : 'Paused'}</Badge>
                <Button className="mt-4 w-full" onClick={() => setBooking(true)} disabled={!creator.accepting_bookings}>
                  Book {creator.name.split(' ')[0]}
                </Button>
              </>
            ) : (
              <p className="text-sm text-[#9CA3AF]">This creator hasn't published a price yet. Send a message to ask.</p>
            )}
          </Card>
          <Card>
            <h2 className="mb-3 text-sm font-bold">Your history</h2>
            {deals.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">You haven't worked together yet.</p>
            ) : (
              <ul className="space-y-2">
                {deals.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate">{d.campaigns?.title}</span>
                    <Badge status={d.status}>{COLLAB_STATUS_LABEL[d.status]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      <BookCreatorModal open={booking} onClose={() => setBooking(false)} creator={creator} companyId={company.data?.id ?? null} onBooked={() => void q.reload()} />
    </>
  )
}
