import { Link } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import { useCreator } from '@/lib/useCompany'
import type { CollaborationRow, CreatorDashboard, MetricsRow } from '@/lib/database.types'
import { COLLAB_STATUS_LABEL, formatCompact, formatDate, formatMoney } from '@/lib/format'
import { Badge, Card, EmptyState, ErrorBanner, PageHeader, Skeleton, StatCard } from '@/components/app/ui'
import { ChartIcon } from '@/components/app/icons'

type Deal = CollaborationRow & { campaigns: { title: string } | null; companies: { name: string } | null; collaboration_metrics: MetricsRow | null }

/** /app/performance (creator) — audience numbers from the card plus results of sponsored posts. */
export default function Performance() {
  const creator = useCreator()
  const q = useQuery(async () => {
    const [stats, deals] = await Promise.all([
      unwrap(await supabase.rpc('creator_dashboard')) as unknown as CreatorDashboard,
      unwrap(await supabase.from('collaborations').select('*, campaigns(title), companies(name), collaboration_metrics(*)').in('status', ['live', 'completed']).order('published_at', { ascending: false, nullsFirst: false })) as Deal[],
    ])
    return { stats, deals }
  }, [])
  if (q.error) return <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
  const s = q.data?.stats
  const c = creator.data

  return (
    <>
      <PageHeader title="Performance" subtitle="Your audience numbers and the results of every sponsored post." />
      {q.loading || creator.loading ? (
        <Skeleton className="h-24" />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Followers" value={formatCompact(c?.followers)} hint={c?.stats_updated_at ? `Updated ${formatDate(c.stats_updated_at)}` : 'Add your numbers on My card'} />
            <StatCard label="Median views" value={formatCompact(c?.median_views)} hint={c?.engagement_rate != null ? `${c.engagement_rate}% engagement` : undefined} />
            <StatCard label="Sponsored posts live" value={s?.posts_live ?? 0} hint={`${formatCompact(s?.impressions ?? 0)} impressions`} />
            <StatCard label="Leads generated" value={s?.leads ?? 0} hint={`${formatCompact(s?.clicks ?? 0)} clicks`} tone="blue" />
          </div>
          <Card className="mt-6" padded={false}>
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-sm font-bold">Sponsored posts</h2>
            </div>
            {(q.data?.deals ?? []).length === 0 ? (
              <div className="p-5">
                <EmptyState icon={<ChartIcon />} title="No live posts yet" body="Results appear here once the brand records impressions, clicks and leads for a post you published." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-[#FAFBFC] text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    <tr>
                      <th className="px-5 py-2.5 text-left">Campaign</th>
                      <th className="px-4 py-2.5 text-right">Impressions</th>
                      <th className="px-4 py-2.5 text-right">Clicks</th>
                      <th className="px-4 py-2.5 text-right">Leads</th>
                      <th className="px-4 py-2.5 text-right">Fee</th>
                      <th className="px-4 py-2.5 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {q.data?.deals.map((d) => (
                      <tr key={d.id} className="hover:bg-[#FAFAFA]">
                        <td className="px-5 py-3">
                          <Link to={`/app/collaborations/${d.id}`} className="font-semibold hover:text-[#2563eb]">
                            {d.campaigns?.title}
                          </Link>
                          <div className="text-xs text-[#9CA3AF]">
                            {d.companies?.name} · live {formatDate(d.published_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">{formatCompact(d.collaboration_metrics?.impressions ?? 0)}</td>
                        <td className="px-4 py-3 text-right">{formatCompact(d.collaboration_metrics?.clicks ?? 0)}</td>
                        <td className="px-4 py-3 text-right">{d.collaboration_metrics?.leads ?? 0}</td>
                        <td className="px-4 py-3 text-right">{formatMoney(d.agreed_price_cents)}</td>
                        <td className="px-4 py-3">
                          <Badge status={d.status}>{COLLAB_STATUS_LABEL[d.status]}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </>
  )
}
