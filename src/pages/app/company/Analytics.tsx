import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { CollaborationRow, CompanyDashboard, MetricsRow, PaymentRow } from '@/lib/database.types'
import { COLLAB_STATUS_LABEL, formatCompact, formatDate, formatMoney } from '@/lib/format'
import { Badge, Card, EmptyState, ErrorBanner, LinkButton, PageHeader, Skeleton, StatCard } from '@/components/app/ui'
import { ChartIcon } from '@/components/app/icons'
import { Link } from 'react-router-dom'

type Deal = CollaborationRow & { campaigns: { title: string } | null; creators: { name: string } | null; collaboration_metrics: MetricsRow | null }

/** /app/analytics (company) — aggregated results from every live/completed post plus the payment ledger. */
export default function Analytics() {
  const q = useQuery(async () => {
    const [stats, deals, payments] = await Promise.all([
      unwrap(await supabase.rpc('company_dashboard')) as unknown as CompanyDashboard,
      unwrap(await supabase.from('collaborations').select('*, campaigns(title), creators(name), collaboration_metrics(*)').in('status', ['live', 'completed']).order('published_at', { ascending: false, nullsFirst: false })) as Deal[],
      unwrap(await supabase.from('payments').select('*, creators(name)').order('created_at', { ascending: false }).limit(20)) as (PaymentRow & { creators: { name: string } | null })[],
    ])
    return { stats, deals, payments }
  }, [])

  if (q.error) return <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
  const s = q.data?.stats
  const cpl = s && s.leads > 0 ? s.spend_cents / s.leads : null
  const ctr = s && s.impressions > 0 ? (s.clicks / s.impressions) * 100 : null

  return (
    <>
      <PageHeader title="Analytics" subtitle="Every sponsored post, traced back to impressions, clicks, leads and pipeline. Results are recorded per deal." />
      {q.loading ? (
        <Skeleton className="h-24" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Posts live" value={s?.posts_live ?? 0} hint={`${s?.collaborations_active ?? 0} deals in progress`} />
          <StatCard label="Impressions" value={formatCompact(s?.impressions ?? 0)} hint={ctr !== null ? `${ctr.toFixed(2)}% CTR` : `${formatCompact(s?.clicks ?? 0)} clicks`} />
          <StatCard label="Leads" value={s?.leads ?? 0} hint={cpl !== null ? `${formatMoney(cpl)} per lead` : 'No leads recorded yet'} tone="blue" />
          <StatCard label="Pipeline" value={formatMoney(s?.pipeline_cents)} hint={`${formatMoney(s?.spend_cents)} spent`} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card padded={false}>
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold">Posts</h2>
          </div>
          {q.loading ? (
            <div className="p-5">
              <Skeleton className="h-40" />
            </div>
          ) : (q.data?.deals ?? []).length === 0 ? (
            <div className="p-5">
              <EmptyState icon={<ChartIcon />} title="No live posts yet" body="Once a creator's post goes live, record its impressions, clicks and leads from the deal page." action={<LinkButton to="/app/campaigns" variant="secondary">Go to campaigns</LinkButton>} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-[#FAFBFC] text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                  <tr>
                    <th className="px-5 py-2.5 text-left">Creator · campaign</th>
                    <th className="px-4 py-2.5 text-right">Impr.</th>
                    <th className="px-4 py-2.5 text-right">Clicks</th>
                    <th className="px-4 py-2.5 text-right">Leads</th>
                    <th className="px-4 py-2.5 text-right">Cost</th>
                    <th className="px-4 py-2.5 text-left">Live</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {q.data?.deals.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3">
                        <Link to={`/app/collaborations/${d.id}`} className="font-semibold hover:text-[#2563eb]">
                          {d.creators?.name}
                        </Link>
                        <div className="text-xs text-[#9CA3AF]">{d.campaigns?.title}</div>
                      </td>
                      <td className="px-4 py-3 text-right">{formatCompact(d.collaboration_metrics?.impressions ?? 0)}</td>
                      <td className="px-4 py-3 text-right">{formatCompact(d.collaboration_metrics?.clicks ?? 0)}</td>
                      <td className="px-4 py-3 text-right">{d.collaboration_metrics?.leads ?? 0}</td>
                      <td className="px-4 py-3 text-right">{formatMoney(d.agreed_price_cents)}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">
                        {formatDate(d.published_at)} <Badge status={d.status}>{COLLAB_STATUS_LABEL[d.status]}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-bold">Payments</h2>
          {q.loading ? (
            <Skeleton className="h-40" />
          ) : (q.data?.payments ?? []).length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">Payouts are scheduled automatically when a post goes live and settled when the deal is completed.</p>
          ) : (
            <ul className="divide-y divide-[#F3F4F6]">
              {q.data?.payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div>
                    <div className="font-medium">{p.creators?.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{p.paid_at ? `Paid ${formatDate(p.paid_at)}` : p.scheduled_for ? `Scheduled ${formatDate(p.scheduled_for)}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatMoney(p.amount_cents, p.currency)}</div>
                    <Badge status={p.status}>{p.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
