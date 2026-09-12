import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import { describeError } from '@/lib/supabase'
import type { CampaignRow, CollaborationRow, CompanyDashboard, CreatorDashboard, NotificationRow } from '@/lib/database.types'
import { APPLICATION_STATUS_LABEL, CAMPAIGN_STATUS_LABEL, COLLAB_STATUS_LABEL, formatCompact, formatMoney, timeAgo } from '@/lib/format'
import { Badge, Card, EmptyState, ErrorBanner, LinkButton, PageHeader, Skeleton, StatCard } from '@/components/app/ui'
import { LayersIcon, MegaphoneIcon, PlusIcon } from '@/components/app/icons'

function Stats({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading)
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
}

function RecentNotifications({ items }: { items: NotificationRow[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold">Latest activity</h2>
        <Link to="/app/notifications" className="text-xs font-medium text-[#7C5CFC]">
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[#9CA3AF]">Nothing yet. Activity on your campaigns and deals shows up here.</p>
      ) : (
        <ul className="divide-y divide-[#F3F4F6]">
          {items.map((n) => (
            <li key={n.id} className="py-2.5">
              <Link to={n.href ?? '/app/notifications'} className="block">
                <div className="flex items-start justify-between gap-3">
                  <span className={`text-sm ${n.read_at ? 'text-[#4B5563]' : 'font-semibold text-[#111827]'}`}>{n.title}</span>
                  <span className="shrink-0 text-[11px] text-[#9CA3AF]">{timeAgo(n.created_at)}</span>
                </div>
                {n.body && <p className="mt-0.5 text-xs text-[#6B7280] line-clamp-2">{n.body}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function CompanyOverview() {
  const { profile, user } = useAuth()
  const q = useQuery(async () => {
    const [stats, campaigns, notifications, company] = await Promise.all([
      unwrap(await supabase.rpc('company_dashboard')) as unknown as CompanyDashboard,
      unwrap(await supabase.from('campaigns').select('*').order('created_at', { ascending: false }).limit(5)) as CampaignRow[],
      unwrap(await supabase.from('notifications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(6)) as NotificationRow[],
      unwrap(await supabase.from('companies').select('name').eq('owner_id', user!.id).maybeSingle()) as { name: string } | null,
    ])
    return { stats, campaigns, notifications, company }
  }, [user?.id])

  const s = q.data?.stats
  return (
    <>
      <PageHeader
        title={`Welcome back${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}`}
        subtitle={q.data?.company ? `${q.data.company.name} · company workspace` : 'Company workspace'}
        actions={
          <LinkButton to="/app/campaigns/new">
            <PlusIcon width={16} height={16} /> New campaign
          </LinkButton>
        }
      />
      {q.error && <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>}
      <Stats loading={q.loading}>
        <StatCard label="Open campaigns" value={s?.campaigns_active ?? 0} hint={`${s?.campaigns_total ?? 0} total`} />
        <StatCard label="Pending applications" value={s?.applications_pending ?? 0} hint="Waiting for your decision" tone={s?.applications_pending ? 'blue' : undefined} />
        <StatCard label="Active deals" value={s?.collaborations_active ?? 0} hint={`${s?.posts_live ?? 0} posts live`} />
        <StatCard label="Impressions" value={formatCompact(s?.impressions ?? 0)} hint={`${formatCompact(s?.leads ?? 0)} leads · ${formatMoney(s?.pipeline_cents)} pipeline`} />
      </Stats>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Your campaigns</h2>
            <Link to="/app/campaigns" className="text-xs font-medium text-[#7C5CFC]">
              View all
            </Link>
          </div>
          {q.loading ? (
            <Skeleton className="h-40" />
          ) : q.data?.campaigns.length === 0 ? (
            <EmptyState
              icon={<LayersIcon />}
              title="No campaigns yet"
              body="Create a brief, publish it to the marketplace and book creators from the applications."
              action={<LinkButton to="/app/campaigns/new">Create a campaign</LinkButton>}
            />
          ) : (
            <ul className="divide-y divide-[#F3F4F6]">
              {q.data?.campaigns.map((c) => (
                <li key={c.id}>
                  <Link to={`/app/campaigns/${c.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-[#FAFAFA] -mx-2 px-2 rounded-lg">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{c.title}</div>
                      <div className="text-xs text-[#6B7280]">
                        {formatMoney(c.budget_cents)} budget · {c.posts_wanted} post{c.posts_wanted > 1 ? 's' : ''}
                      </div>
                    </div>
                    <Badge status={c.status}>{CAMPAIGN_STATUS_LABEL[c.status]}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        {q.loading ? <Skeleton className="h-40" /> : <RecentNotifications items={q.data?.notifications ?? []} />}
      </div>
    </>
  )
}

type CollabWithCampaign = CollaborationRow & { campaigns: { title: string } | null }

function CreatorOverview() {
  const { profile, user } = useAuth()
  const q = useQuery(async () => {
    const [stats, deals, notifications, creator, applications] = await Promise.all([
      unwrap(await supabase.rpc('creator_dashboard')) as unknown as CreatorDashboard,
      unwrap(await supabase.from('collaborations').select('*, campaigns(title)').order('created_at', { ascending: false }).limit(5)) as CollabWithCampaign[],
      unwrap(await supabase.from('notifications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(6)) as NotificationRow[],
      unwrap(await supabase.from('creators').select('slug, price_cents, sectors').eq('user_id', user!.id).maybeSingle()) as { slug: string; price_cents: number | null; sectors: string[] } | null,
      unwrap(await supabase.from('campaign_applications').select('id, status, created_at, campaigns(title)').order('created_at', { ascending: false }).limit(4)) as {
        id: string
        status: string
        created_at: string
        campaigns: { title: string } | null
      }[],
    ])
    return { stats, deals, notifications, creator, applications }
  }, [user?.id])

  const s = q.data?.stats
  return (
    <>
      <PageHeader
        title={`Hi${profile?.full_name ? ` ${profile.full_name.split(' ')[0]}` : ''}`}
        subtitle="Your creator workspace"
        actions={
          <LinkButton to="/app/campaigns" variant="secondary">
            <MegaphoneIcon width={16} height={16} /> Browse campaigns
          </LinkButton>
        }
      />
      {q.error && <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>}
      <Stats loading={q.loading}>
        <StatCard label="Invitations" value={s?.invitations_pending ?? 0} hint="Brands waiting for your answer" tone={s?.invitations_pending ? 'blue' : undefined} />
        <StatCard label="Active deals" value={s?.collaborations_active ?? 0} hint={`${s?.posts_live ?? 0} posts live`} />
        <StatCard label="Earned" value={formatMoney(s?.earned_cents)} hint={`${formatMoney(s?.pending_cents)} scheduled`} />
        <StatCard label="Open campaigns" value={s?.open_campaigns ?? 0} hint={`${s?.applications_pending ?? 0} applications pending`} />
      </Stats>
      {!q.loading && q.data?.creator && !q.data.creator.price_cents && (
        <div className="mt-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
          Your card has no price yet — brands can't book you until you set one.{' '}
          <Link to="/app/profile" className="font-semibold underline">
            Set your price
          </Link>
        </div>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold">Deals</h2>
              <Link to="/app/collaborations" className="text-xs font-medium text-[#7C5CFC]">
                View all
              </Link>
            </div>
            {q.loading ? (
              <Skeleton className="h-32" />
            ) : q.data?.deals.length === 0 ? (
              <EmptyState icon={<LayersIcon />} title="No deals yet" body="Apply to open campaigns or wait for a brand to book you from the marketplace." action={<LinkButton to="/app/campaigns">Browse campaigns</LinkButton>} />
            ) : (
              <ul className="divide-y divide-[#F3F4F6]">
                {q.data?.deals.map((d) => (
                  <li key={d.id}>
                    <Link to={`/app/collaborations/${d.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-[#FAFAFA] -mx-2 px-2 rounded-lg">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{d.campaigns?.title ?? 'Campaign'}</div>
                        <div className="text-xs text-[#6B7280]">{formatMoney(d.agreed_price_cents)} per post</div>
                      </div>
                      <Badge status={d.status}>{COLLAB_STATUS_LABEL[d.status]}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold">Applications</h2>
              <Link to="/app/applications" className="text-xs font-medium text-[#7C5CFC]">
                View all
              </Link>
            </div>
            {q.loading ? (
              <Skeleton className="h-20" />
            ) : q.data?.applications.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">You haven't applied to a campaign yet.</p>
            ) : (
              <ul className="divide-y divide-[#F3F4F6]">
                {q.data?.applications.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="truncate text-sm">{a.campaigns?.title ?? 'Campaign'}</span>
                    <Badge status={a.status}>{APPLICATION_STATUS_LABEL[a.status]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        {q.loading ? <Skeleton className="h-40" /> : <RecentNotifications items={q.data?.notifications ?? []} />}
      </div>
    </>
  )
}

export default function Overview() {
  const { profile } = useAuth()
  return profile?.role === 'company' ? <CompanyOverview /> : <CreatorOverview />
}
