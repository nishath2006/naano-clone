import { useState } from 'react'
import { Link } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { CollaborationRow } from '@/lib/database.types'
import { COLLAB_STATUS_LABEL, formatDate, formatMoney, timeAgo } from '@/lib/format'
import { Avatar, Badge, EmptyState, ErrorBanner, LinkButton, ListSkeleton, PageHeader, Tabs } from '@/components/app/ui'
import { HandshakeIcon } from '@/components/app/icons'

type Row = CollaborationRow & { campaigns: { title: string } | null; companies: { name: string; logo_url: string | null } | null }
type Filter = 'active' | 'invited' | 'done'

/** /app/collaborations (creator) — invitations and booked deals. */
export default function Collaborations() {
  const [filter, setFilter] = useState<Filter>('active')
  const q = useQuery(async () => unwrap(await supabase.from('collaborations').select('*, campaigns(title), companies(name, logo_url)').order('created_at', { ascending: false })) as Row[], [])
  const rows = (q.data ?? []).filter((d) =>
    filter === 'invited' ? d.status === 'invited' : filter === 'active' ? ['accepted', 'draft_ready', 'scheduled', 'live'].includes(d.status) : ['completed', 'declined', 'cancelled'].includes(d.status),
  )
  const invited = (q.data ?? []).filter((d) => d.status === 'invited').length

  return (
    <>
      <PageHeader title="Deals" subtitle="Every booking, from invitation to payout. Accept an invitation, submit your draft, then mark the post live." />
      <div className="mb-4">
        <Tabs<Filter>
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'active', label: 'In progress' },
            { value: 'invited', label: `Invitations${invited ? ` (${invited})` : ''}` },
            { value: 'done', label: 'Past' },
          ]}
        />
      </div>
      {q.error ? (
        <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
      ) : q.loading ? (
        <ListSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState icon={<HandshakeIcon />} title={filter === 'invited' ? 'No pending invitations' : filter === 'active' ? 'No deals in progress' : 'No past deals'} body="Brands book you from the marketplace or accept your applications. Keep your card fresh." action={<LinkButton to="/app/campaigns" variant="secondary">Browse campaigns</LinkButton>} />
      ) : (
        <ul className="divide-y divide-[#F3F4F6] rounded-2xl border border-[#E9EBF0] bg-white">
          {rows.map((d) => (
            <li key={d.id}>
              <Link to={`/app/collaborations/${d.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA]">
                <Avatar src={d.companies?.logo_url} name={d.companies?.name} size={40} className="rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{d.campaigns?.title ?? 'Campaign'}</div>
                  <div className="text-xs text-[#6B7280]">
                    {d.companies?.name} · {formatMoney(d.agreed_price_cents)} per post{d.due_date ? ` · due ${formatDate(d.due_date)}` : ''} · {timeAgo(d.updated_at)}
                  </div>
                </div>
                <Badge status={d.status}>{COLLAB_STATUS_LABEL[d.status]}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
