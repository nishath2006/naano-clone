import { Link } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { CreatorDashboard, PaymentRow } from '@/lib/database.types'
import { formatDate, formatMoney } from '@/lib/format'
import { Badge, Card, EmptyState, ErrorBanner, PageHeader, Skeleton, StatCard } from '@/components/app/ui'
import { WalletIcon } from '@/components/app/icons'

type Row = PaymentRow & { collaborations: { campaign_id: string; campaigns: { title: string } | null } | null; companies: { name: string } | null }

/** /app/earnings (creator) — payout ledger. Payments are created by the database when a post goes live and settled when the deal completes. */
export default function Earnings() {
  const q = useQuery(async () => {
    const [stats, payments] = await Promise.all([
      unwrap(await supabase.rpc('creator_dashboard')) as unknown as CreatorDashboard,
      unwrap(await supabase.from('payments').select('*, collaborations(campaign_id, campaigns(title)), companies(name)').order('created_at', { ascending: false })) as Row[],
    ])
    return { stats, payments }
  }, [])
  if (q.error) return <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
  const s = q.data?.stats
  const thisMonth = (q.data?.payments ?? []).filter((p) => p.paid_at && new Date(p.paid_at).getMonth() === new Date().getMonth() && new Date(p.paid_at).getFullYear() === new Date().getFullYear()).reduce((a, p) => a + p.amount_cents, 0)

  return (
    <>
      <PageHeader title="Earnings" subtitle="Naano invoices the brand and pays you within 24h of your post going live. No chasing." />
      {q.loading ? (
        <Skeleton className="h-24" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Paid out" value={formatMoney(s?.earned_cents)} hint="All time" />
          <StatCard label="Scheduled" value={formatMoney(s?.pending_cents)} hint="Posts live, payout on the way" tone="blue" />
          <StatCard label="This month" value={formatMoney(thisMonth)} />
        </div>
      )}
      <Card className="mt-6" padded={false}>
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-sm font-bold">Payouts</h2>
        </div>
        {q.loading ? (
          <div className="p-5">
            <Skeleton className="h-32" />
          </div>
        ) : (q.data?.payments ?? []).length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<WalletIcon />} title="No payouts yet" body="Your first payout is scheduled automatically when a sponsored post goes live." />
          </div>
        ) : (
          <ul className="divide-y divide-[#F3F4F6]">
            {q.data?.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                <div className="min-w-0">
                  <Link to={`/app/collaborations/${p.collaboration_id}`} className="block truncate font-semibold hover:text-[#2563eb]">
                    {p.collaborations?.campaigns?.title ?? 'Sponsored post'}
                  </Link>
                  <div className="text-xs text-[#9CA3AF]">
                    {p.companies?.name} · {p.paid_at ? `paid ${formatDate(p.paid_at)}` : p.scheduled_for ? `scheduled ${formatDate(p.scheduled_for)}` : formatDate(p.created_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatMoney(p.amount_cents, p.currency)}</div>
                  <Badge status={p.status}>{p.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
