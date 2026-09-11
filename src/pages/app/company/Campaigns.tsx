import { useState } from 'react'
import { Link } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { CampaignRow, CampaignStatus } from '@/lib/database.types'
import { CAMPAIGN_STATUS_LABEL, formatDate, formatMoney } from '@/lib/format'
import { Badge, EmptyState, ErrorBanner, LinkButton, ListSkeleton, PageHeader, Tabs } from '@/components/app/ui'
import { LayersIcon, PlusIcon } from '@/components/app/icons'

type Row = CampaignRow & { campaign_applications: { count: number }[]; collaborations: { count: number }[] }
type Filter = 'all' | CampaignStatus

/** /app/campaigns (company) — all briefs with application / participant counts. */
export default function Campaigns() {
  const [filter, setFilter] = useState<Filter>('all')
  const q = useQuery(
    async () =>
      unwrap(
        await supabase
          .from('campaigns')
          .select('*, campaign_applications(count), collaborations(count)')
          .order('created_at', { ascending: false }),
      ) as Row[],
    [],
  )
  const rows = (q.data ?? []).filter((c) => filter === 'all' || c.status === filter)

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="A campaign is a brief creators can apply to. Publish it to the marketplace, review applications, book creators and track every post."
        actions={
          <LinkButton to="/app/campaigns/new">
            <PlusIcon width={16} height={16} /> New campaign
          </LinkButton>
        }
      />
      <div className="mb-4">
        <Tabs<Filter>
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'all', label: `All (${q.data?.length ?? 0})` },
            { value: 'draft', label: 'Drafts' },
            { value: 'published', label: 'Open' },
            { value: 'closed', label: 'Closed' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
      </div>
      {q.error ? (
        <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
      ) : q.loading ? (
        <ListSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<LayersIcon />}
          title={filter === 'all' ? 'No campaigns yet' : `No ${CAMPAIGN_STATUS_LABEL[filter]?.toLowerCase() ?? filter} campaigns`}
          body="Write a brief with your goal, budget and the creator profile you want. Publishing takes a minute."
          action={<LinkButton to="/app/campaigns/new">Create a campaign</LinkButton>}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E9EBF0] bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-[#FAFBFC] text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 text-left">Campaign</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Budget</th>
                <th className="px-4 py-3 text-right">Applications</th>
                <th className="px-4 py-3 text-right">Creators booked</th>
                <th className="px-4 py-3 text-left">Dates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-4 py-3">
                    <Link to={`/app/campaigns/${c.id}`} className="font-semibold text-[#111827] hover:text-[#2563eb]">
                      {c.title}
                    </Link>
                    <div className="text-xs text-[#9CA3AF]">{c.objective ? `${c.objective} · ` : ''}{c.posts_wanted} post{c.posts_wanted > 1 ? 's' : ''} wanted</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={c.status}>{CAMPAIGN_STATUS_LABEL[c.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatMoney(c.budget_cents)}</td>
                  <td className="px-4 py-3 text-right">{c.campaign_applications?.[0]?.count ?? 0}</td>
                  <td className="px-4 py-3 text-right">{c.collaborations?.[0]?.count ?? 0}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">
                    {c.start_date ? formatDate(c.start_date) : '—'} → {c.end_date ? formatDate(c.end_date) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
