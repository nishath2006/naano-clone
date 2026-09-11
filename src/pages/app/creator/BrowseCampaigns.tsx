import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import { useCreator } from '@/lib/useCompany'
import type { CampaignRow } from '@/lib/database.types'
import { formatCompact, formatMoney, timeAgo } from '@/lib/format'
import { Avatar, Badge, Card, EmptyState, ErrorBanner, Input, PageHeader, Pill, Select, Skeleton } from '@/components/app/ui'
import { MegaphoneIcon, SearchIcon } from '@/components/app/icons'

type Row = CampaignRow & { companies: { name: string; logo_url: string | null; industry: string | null } | null }

/** /app/campaigns (creator) — open briefs from every company, matched against the creator's niches. */
export default function BrowseCampaigns() {
  const creator = useCreator()
  const [q, setQ] = useState('')
  const [only, setOnly] = useState<'all' | 'match'>('all')
  const [applied, setApplied] = useState<Set<string>>(new Set())

  const campaigns = useQuery(async () => {
    const [rows, apps] = await Promise.all([
      unwrap(await supabase.from('campaigns').select('*, companies(name, logo_url, industry)').eq('status', 'published').order('published_at', { ascending: false })) as Row[],
      unwrap(await supabase.from('campaign_applications').select('campaign_id')) as { campaign_id: string }[],
    ])
    setApplied(new Set(apps.map((a) => a.campaign_id)))
    return rows
  }, [])

  const mine = creator.data?.sectors ?? []
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return (campaigns.data ?? []).filter((c) => {
      if (term && !`${c.title} ${c.description} ${c.companies?.name ?? ''}`.toLowerCase().includes(term)) return false
      if (only === 'match' && !c.sectors.some((s) => mine.includes(s))) return false
      return true
    })
  }, [campaigns.data, q, only, mine])

  return (
    <>
      <PageHeader title="Open campaigns" subtitle="Briefs published by B2B brands. Apply with a short pitch; the brand books you and Naano handles the payment." />
      <div className="flex flex-col gap-3 sm:flex-row mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" width={18} height={18} />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns…" className="pl-10" aria-label="Search campaigns" />
        </div>
        <Select value={only} onChange={(e) => setOnly(e.target.value as 'all' | 'match')} className="sm:w-56" aria-label="Filter">
          <option value="all">All open campaigns</option>
          <option value="match">Matching my niches</option>
        </Select>
      </div>
      {campaigns.error ? (
        <ErrorBanner onRetry={() => void campaigns.reload()}>{describeError(campaigns.error)}</ErrorBanner>
      ) : campaigns.loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={<MegaphoneIcon />} title={campaigns.data?.length ? 'No campaigns match' : 'No open campaigns right now'} body="New briefs are published every week. Keep your card up to date — brands also book creators directly from the marketplace." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((c) => {
            const match = c.sectors.filter((s) => mine.includes(s))
            const eligible = !c.min_followers || (creator.data?.followers ?? 0) >= c.min_followers
            return (
              <Link key={c.id} to={`/app/campaigns/${c.id}`} className="block">
                <Card className="h-full hover:border-[#2563eb]/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <Avatar src={c.companies?.logo_url} name={c.companies?.name} size={40} className="rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold leading-5">{c.title}</h3>
                        {applied.has(c.id) ? <Badge tone="blue">Applied</Badge> : match.length > 0 ? <Badge tone="green">Match</Badge> : null}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {c.companies?.name} · published {timeAgo(c.published_at)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#4B5563] line-clamp-2">{c.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.sectors.slice(0, 4).map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#6B7280]">
                    <span>
                      {c.price_per_post_cents ? `${formatMoney(c.price_per_post_cents)} per post` : 'Propose your price'} · {c.posts_wanted} post{c.posts_wanted > 1 ? 's' : ''}
                    </span>
                    <span className={eligible ? '' : 'text-[#B45309]'}>{c.min_followers ? `${formatCompact(c.min_followers)}+ followers` : 'Any audience'}</span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
