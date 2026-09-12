import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import { useCreator } from '@/lib/useCompany'
import type { ApplicationRow, CampaignRow, CollaborationRow } from '@/lib/database.types'
import { APPLICATION_STATUS_LABEL, COLLAB_STATUS_LABEL, formatCompact, formatDate, formatMoney, parseEuros } from '@/lib/format'
import { Avatar, Badge, Button, Card, EmptyState, ErrorBanner, Field, Input, LinkButton, PageHeader, Pill, Skeleton, Textarea, useToast } from '@/components/app/ui'

type Row = CampaignRow & { companies: { name: string; logo_url: string | null; website: string | null; industry: string | null; description: string | null } | null }

/** /app/campaigns/:id (creator) — the brief with an application form. */
export default function CreatorCampaignDetail() {
  const { id = '' } = useParams()
  const toast = useToast()
  const creator = useCreator()
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const q = useQuery(async () => {
    const campaign = unwrap(await supabase.from('campaigns').select('*, companies(name, logo_url, website, industry, description)').eq('id', id).maybeSingle()) as Row | null
    if (!campaign) return null
    const [application, deal] = await Promise.all([
      unwrap(await supabase.from('campaign_applications').select('*').eq('campaign_id', id).maybeSingle()) as ApplicationRow | null,
      unwrap(await supabase.from('collaborations').select('*').eq('campaign_id', id).maybeSingle()) as CollaborationRow | null,
    ])
    return { campaign, application, deal }
  }, [id])

  const apply = async () => {
    if (!creator.data || pending) return
    if (message.trim().length < 20) return setError('Tell the brand why you are a fit (20+ characters).')
    const cents = price ? parseEuros(price) : null
    if (price && cents === null) return setError('Enter a price in euros.')
    setPending(true)
    setError(null)
    const { error: err } = await supabase.from('campaign_applications').insert({
      campaign_id: id,
      creator_id: creator.data.id,
      message: message.trim(),
      proposed_price_cents: cents ?? creator.data.price_cents ?? q.data?.campaign.price_per_post_cents ?? null,
    })
    setPending(false)
    if (err) return setError(describeError(err))
    toast.push('success', 'Application sent.')
    await q.reload()
  }

  const withdraw = async () => {
    if (!q.data?.application || pending) return
    setPending(true)
    const { error: err } = await supabase.from('campaign_applications').update({ status: 'withdrawn' }).eq('id', q.data.application.id)
    setPending(false)
    if (err) return toast.push('error', describeError(err))
    toast.push('info', 'Application withdrawn.')
    await q.reload()
  }

  if (q.error) return <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
  if (q.loading || creator.loading) return <Skeleton className="h-96" />
  if (!q.data) return <EmptyState title="Campaign not found" body="It may have been closed or unpublished." action={<LinkButton to="/app/campaigns">Back to campaigns</LinkButton>} />
  const { campaign: c, application, deal } = q.data
  const eligible = !c.min_followers || (creator.data?.followers ?? 0) >= c.min_followers
  const open = c.status === 'published'

  return (
    <>
      <PageHeader back={{ to: '/app/campaigns', label: 'Open campaigns' }} title={c.title} subtitle={`${c.companies?.name ?? 'Brand'}${c.companies?.industry ? ` · ${c.companies.industry}` : ''}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={c.companies?.logo_url} name={c.companies?.name} size={44} className="rounded-xl" />
              <div>
                <div className="text-sm font-bold">{c.companies?.name}</div>
                {c.companies?.website && (
                  <a href={c.companies.website} target="_blank" rel="noreferrer" className="text-xs text-[#7C5CFC]">
                    {c.companies.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
            {c.companies?.description && <p className="mb-4 text-sm text-[#6B7280]">{c.companies.description}</p>}
            <h2 className="text-sm font-bold mb-2">About the campaign</h2>
            <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{c.description}</p>
            {c.brief && (
              <>
                <h2 className="text-sm font-bold mt-6 mb-2">Content brief</h2>
                <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{c.brief}</p>
              </>
            )}
            {c.creator_requirements && (
              <>
                <h2 className="text-sm font-bold mt-6 mb-2">Who they're looking for</h2>
                <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{c.creator_requirements}</p>
              </>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.sectors.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <dl className="space-y-3 text-sm">
              {[
                ['Pay per post', c.price_per_post_cents ? formatMoney(c.price_per_post_cents) : 'Propose your price'],
                ['Posts wanted', String(c.posts_wanted)],
                ['Objective', c.objective ?? '—'],
                ['Audience', c.target_audience ?? '—'],
                ['Min. followers', c.min_followers ? formatCompact(c.min_followers) : 'Any'],
                ['Timeline', `${c.start_date ? formatDate(c.start_date) : '—'} → ${c.end_date ? formatDate(c.end_date) : '—'}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-[#6B7280]">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {deal ? (
            <Card>
              <h2 className="text-sm font-bold mb-1">You're booked</h2>
              <p className="text-sm text-[#6B7280] mb-3">
                Status: <Badge status={deal.status}>{COLLAB_STATUS_LABEL[deal.status]}</Badge>
              </p>
              <LinkButton to={`/app/collaborations/${deal.id}`} className="w-full">
                Open the deal
              </LinkButton>
            </Card>
          ) : application ? (
            <Card>
              <h2 className="text-sm font-bold mb-1">Your application</h2>
              <div className="mb-3">
                <Badge status={application.status}>{APPLICATION_STATUS_LABEL[application.status]}</Badge>
              </div>
              <p className="whitespace-pre-line rounded-xl bg-[#FAFBFC] px-3 py-2 text-sm text-[#4B5563]">{application.message}</p>
              {application.proposed_price_cents && <p className="mt-2 text-xs text-[#6B7280]">Proposed price: {formatMoney(application.proposed_price_cents)}</p>}
              {application.status === 'pending' && (
                <Button variant="secondary" className="mt-3 w-full" onClick={() => void withdraw()} loading={pending}>
                  Withdraw
                </Button>
              )}
            </Card>
          ) : !open ? (
            <Card>
              <p className="text-sm text-[#6B7280]">Applications for this campaign are closed.</p>
            </Card>
          ) : !creator.data ? (
            <Card>
              <p className="text-sm text-[#6B7280]">
                Finish your card before applying.{' '}
                <Link to="/app/profile" className="font-semibold text-[#7C5CFC]">
                  Edit card
                </Link>
              </p>
            </Card>
          ) : (
            <Card>
              <h2 className="text-sm font-bold mb-3">Apply</h2>
              {!eligible && <p className="mb-3 rounded-xl bg-[#FFFBEB] px-3 py-2 text-xs text-[#92400E]">This brand asks for {formatCompact(c.min_followers)}+ followers. You can still apply.</p>}
              <div className="space-y-3">
                <Field label="Why you" htmlFor="apply-msg" hint="Mention your audience and how you'd angle the post.">
                  <Textarea id="apply-msg" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} />
                </Field>
                <Field label="Your price per post (€)" htmlFor="apply-price" hint={creator.data.price_cents ? `Your card price: ${formatMoney(creator.data.price_cents)}` : "Leave empty to use the brand's price"}>
                  <Input id="apply-price" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder={creator.data.price_cents ? String(creator.data.price_cents / 100) : ''} />
                </Field>
                {error && <ErrorBanner>{error}</ErrorBanner>}
                <Button className="w-full" onClick={() => void apply()} loading={pending}>
                  Send application
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
