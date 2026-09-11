import { Link } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { ApplicationRow } from '@/lib/database.types'
import { APPLICATION_STATUS_LABEL, formatMoney, timeAgo } from '@/lib/format'
import { Badge, EmptyState, ErrorBanner, LinkButton, ListSkeleton, PageHeader } from '@/components/app/ui'
import { InboxIcon } from '@/components/app/icons'

type Row = ApplicationRow & { campaigns: { id: string; title: string; status: string; companies: { name: string } | null } | null }

/** /app/applications (creator) */
export default function Applications() {
  const q = useQuery(async () => unwrap(await supabase.from('campaign_applications').select('*, campaigns(id, title, status, companies(name))').order('created_at', { ascending: false })) as Row[], [])
  return (
    <>
      <PageHeader title="Applications" subtitle="Campaigns you applied to. Accepted applications become deals." />
      {q.error ? (
        <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
      ) : q.loading ? (
        <ListSkeleton />
      ) : (q.data ?? []).length === 0 ? (
        <EmptyState icon={<InboxIcon />} title="No applications yet" body="Browse open campaigns and pitch the ones that fit your audience." action={<LinkButton to="/app/campaigns">Browse campaigns</LinkButton>} />
      ) : (
        <ul className="divide-y divide-[#F3F4F6] rounded-2xl border border-[#E9EBF0] bg-white">
          {q.data?.map((a) => (
            <li key={a.id}>
              <Link to={`/app/campaigns/${a.campaign_id}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#FAFAFA]">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{a.campaigns?.title ?? 'Campaign'}</div>
                  <div className="text-xs text-[#6B7280]">
                    {a.campaigns?.companies?.name} · applied {timeAgo(a.created_at)}
                    {a.proposed_price_cents ? ` · ${formatMoney(a.proposed_price_cents)} proposed` : ''}
                  </div>
                </div>
                <Badge status={a.status}>{APPLICATION_STATUS_LABEL[a.status]}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
