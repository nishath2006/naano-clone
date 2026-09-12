import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import { useCompany } from '@/lib/useCompany'
import type { CollaborationRow, CollaborationStatus, MetricsRow, PaymentRow } from '@/lib/database.types'
import { COLLAB_STATUS_LABEL, formatCompact, formatDate, formatMoney, parseEuros } from '@/lib/format'
import { Avatar, Badge, Button, Card, EmptyState, ErrorBanner, Field, Input, LinkButton, PageHeader, Skeleton, useToast } from '@/components/app/ui'

type Deal = CollaborationRow & {
  campaigns: { id: string; title: string; brief: string | null } | null
  companies: { id: string; name: string; logo_url: string | null; owner_id: string } | null
  creators: { id: string; name: string; avatar_url: string | null; headline: string | null; user_id: string | null } | null
  collaboration_metrics: MetricsRow | null
  payments: PaymentRow | PaymentRow[] | null
}

const STEPS: CollaborationStatus[] = ['invited', 'accepted', 'draft_ready', 'scheduled', 'live', 'completed']

/**
 * /app/collaborations/:id — one deal, shared by both roles. The allowed
 * status transitions are enforced in the database (collaborations_guard);
 * the UI only offers the ones that apply to the current role and state.
 */
export default function CollaborationDetail() {
  const { id = '' } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const company = useCompany()
  const isCompany = profile?.role === 'company'
  const [busy, setBusy] = useState(false)
  const [postUrl, setPostUrl] = useState('')
  const [metrics, setMetrics] = useState({ impressions: '', clicks: '', leads: '', pipeline: '' })
  const [messaging, setMessaging] = useState(false)

  const q = useQuery(async () => unwrap(await supabase.from('collaborations').select('*, campaigns(id, title, brief), companies(id, name, logo_url, owner_id), creators(id, name, avatar_url, headline, user_id), collaboration_metrics(*), payments(*)').eq('id', id).maybeSingle()) as Deal | null, [id])

  useEffect(() => {
    const d = q.data
    if (!d) return
    setPostUrl(d.post_url ?? '')
    const m = d.collaboration_metrics
    setMetrics({ impressions: m?.impressions ? String(m.impressions) : '', clicks: m?.clicks ? String(m.clicks) : '', leads: m?.leads ? String(m.leads) : '', pipeline: m?.pipeline_cents ? String(m.pipeline_cents / 100) : '' })
  }, [q.data])

  const setStatus = async (status: CollaborationStatus, extra: Partial<CollaborationRow> = {}, success = 'Updated.') => {
    setBusy(true)
    try {
      unwrap(await supabase.from('collaborations').update({ status, ...extra }).eq('id', id))
      toast.push('success', success)
      await q.reload()
    } catch (e) {
      toast.push('error', describeError(e))
    } finally {
      setBusy(false)
    }
  }

  const saveMetrics = async () => {
    const nums = [metrics.impressions, metrics.clicks, metrics.leads]
    if (nums.some((v) => v && !/^\d+$/.test(v))) return toast.push('error', 'Impressions, clicks and leads must be whole numbers.')
    const pipeline = metrics.pipeline ? parseEuros(metrics.pipeline) : 0
    if (pipeline === null) return toast.push('error', 'Enter the pipeline value in euros.')
    setBusy(true)
    try {
      unwrap(await supabase.from('collaboration_metrics').update({ impressions: Number(metrics.impressions || 0), clicks: Number(metrics.clicks || 0), leads: Number(metrics.leads || 0), pipeline_cents: pipeline }).eq('collaboration_id', id))
      toast.push('success', 'Results saved.')
      await q.reload()
    } catch (e) {
      toast.push('error', describeError(e))
    } finally {
      setBusy(false)
    }
  }

  const message = async () => {
    const d = q.data
    if (!d) return
    setMessaging(true)
    try {
      const existing = unwrap(await supabase.from('conversations').select('id').eq('company_id', d.company_id).eq('creator_id', d.creator_id).maybeSingle()) as { id: string } | null
      if (existing) return navigate(`/app/messages/${existing.id}`)
      const created = unwrap(await supabase.from('conversations').insert({ company_id: d.company_id, creator_id: d.creator_id, campaign_id: d.campaign_id }).select('id').single()) as { id: string }
      navigate(`/app/messages/${created.id}`)
    } catch (e) {
      toast.push('error', describeError(e))
    } finally {
      setMessaging(false)
    }
  }

  if (q.error) return <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
  if (q.loading || company.loading) return <Skeleton className="h-96" />
  if (!q.data) return <EmptyState title="Deal not found" action={<LinkButton to={isCompany ? '/app/campaigns' : '/app/collaborations'}>Back</LinkButton>} />
  const d = q.data
  const payment = Array.isArray(d.payments) ? d.payments[0] : d.payments
  const stepIndex = STEPS.indexOf(d.status)
  const terminal = ['declined', 'cancelled'].includes(d.status)
  const other = isCompany ? { name: d.creators?.name, avatar: d.creators?.avatar_url, sub: d.creators?.headline, href: `/app/creators/${d.creators?.id}` } : { name: d.companies?.name, avatar: d.companies?.logo_url, sub: d.campaigns?.title, href: `/app/campaigns/${d.campaign_id}` }

  return (
    <>
      <PageHeader
        back={isCompany ? { to: `/app/campaigns/${d.campaign_id}`, label: d.campaigns?.title ?? 'Campaign' } : { to: '/app/collaborations', label: 'Deals' }}
        title={
          <span className="flex flex-wrap items-center gap-2">
            {isCompany ? d.creators?.name : d.campaigns?.title} <Badge status={d.status}>{COLLAB_STATUS_LABEL[d.status]}</Badge>
          </span>
        }
        subtitle={`${formatMoney(d.agreed_price_cents)} per post${d.due_date ? ` · due ${formatDate(d.due_date)}` : ''}`}
        actions={
          <Button variant="secondary" onClick={() => void message()} loading={messaging}>
            Message
          </Button>
        }
      />

      {!terminal && (
        <ol className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((s, i) => (
            <li key={s} className={`rounded-xl border px-3 py-2 text-[11px] font-semibold ${i < stepIndex ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]' : i === stepIndex ? 'border-[#7C5CFC] bg-[#F7F4FF] text-[#6D4EF5]' : 'border-[#E5E7EB] bg-white text-[#9CA3AF]'}`}>
              {i + 1}. {COLLAB_STATUS_LABEL[s]}
            </li>
          ))}
        </ol>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <Link to={other.href} className="flex items-center gap-3">
              <Avatar src={other.avatar} name={other.name} size={44} className={isCompany ? '' : 'rounded-xl'} />
              <div className="min-w-0">
                <div className="text-sm font-bold">{other.name}</div>
                <div className="truncate text-xs text-[#6B7280]">{other.sub}</div>
              </div>
            </Link>
            {(d.brief || d.campaigns?.brief) && (
              <>
                <h2 className="mt-5 mb-2 text-sm font-bold">Brief</h2>
                <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{d.brief ?? d.campaigns?.brief}</p>
              </>
            )}
          </Card>

          {/* Creator actions */}
          {!isCompany && d.status === 'invited' && (
            <Card>
              <h2 className="text-sm font-bold mb-1">You've been booked</h2>
              <p className="text-sm text-[#6B7280] mb-4">
                {d.companies?.name} wants a sponsored post at {formatMoney(d.agreed_price_cents)}. Accept to start, or decline.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => void setStatus('accepted', {}, 'Deal accepted. Time to write!')} loading={busy}>
                  Accept
                </Button>
                <Button variant="secondary" onClick={() => void setStatus('declined', {}, 'Invitation declined.')} disabled={busy}>
                  Decline
                </Button>
              </div>
            </Card>
          )}
          {!isCompany && d.status === 'accepted' && (
            <Card>
              <h2 className="text-sm font-bold mb-1">Submit your draft</h2>
              <p className="text-sm text-[#6B7280] mb-4">Share the draft with the brand (a Google Doc or LinkedIn draft link works). They'll approve and schedule it.</p>
              <Field label="Draft link" htmlFor="cd-draft">
                <Input id="cd-draft" value={postUrl} onChange={(e) => setPostUrl(e.target.value)} placeholder="https://docs.google.com/…" inputMode="url" />
              </Field>
              <Button className="mt-3" onClick={() => void setStatus('draft_ready', { post_url: postUrl.trim() || null }, 'Draft sent for review.')} loading={busy}>
                Send draft for review
              </Button>
            </Card>
          )}
          {!isCompany && d.status === 'scheduled' && (
            <Card>
              <h2 className="text-sm font-bold mb-1">Post approved</h2>
              <p className="text-sm text-[#6B7280] mb-4">Publish it on LinkedIn, paste the post URL and mark it live. Your payout is scheduled the moment it's live.</p>
              <Field label="LinkedIn post URL" htmlFor="cd-url">
                <Input id="cd-url" value={postUrl} onChange={(e) => setPostUrl(e.target.value)} placeholder="https://www.linkedin.com/posts/…" inputMode="url" />
              </Field>
              <Button className="mt-3" onClick={() => (/^https?:\/\/(www\.)?linkedin\.com\//.test(postUrl.trim()) ? void setStatus('live', { post_url: postUrl.trim() }, 'Post marked live. Payout scheduled.') : toast.push('error', 'Paste the LinkedIn post URL first.'))} loading={busy}>
                Mark as live
              </Button>
            </Card>
          )}

          {/* Company actions */}
          {isCompany && d.status === 'draft_ready' && (
            <Card>
              <h2 className="text-sm font-bold mb-1">Review the draft</h2>
              {d.post_url ? (
                <a href={d.post_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#7C5CFC] break-all">
                  {d.post_url}
                </a>
              ) : (
                <p className="text-sm text-[#6B7280]">The creator submitted a draft without a link — check your messages.</p>
              )}
              <div className="mt-4 flex gap-2">
                <Button onClick={() => void setStatus('scheduled', {}, 'Draft approved and scheduled.')} loading={busy}>
                  Approve & schedule
                </Button>
                <Button variant="secondary" onClick={() => void setStatus('accepted', {}, 'Sent back for changes.')} disabled={busy}>
                  Request changes
                </Button>
              </div>
            </Card>
          )}
          {isCompany && ['live', 'completed'].includes(d.status) && (
            <Card>
              <h2 className="text-sm font-bold mb-1">Results</h2>
              <p className="text-sm text-[#6B7280] mb-4">Record what the post delivered. These numbers feed your analytics and the creator's performance page.</p>
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Impressions" htmlFor="m-impr">
                  <Input id="m-impr" value={metrics.impressions} onChange={(e) => setMetrics((m) => ({ ...m, impressions: e.target.value }))} inputMode="numeric" disabled={d.status === 'completed'} />
                </Field>
                <Field label="Clicks" htmlFor="m-clicks">
                  <Input id="m-clicks" value={metrics.clicks} onChange={(e) => setMetrics((m) => ({ ...m, clicks: e.target.value }))} inputMode="numeric" disabled={d.status === 'completed'} />
                </Field>
                <Field label="Leads" htmlFor="m-leads">
                  <Input id="m-leads" value={metrics.leads} onChange={(e) => setMetrics((m) => ({ ...m, leads: e.target.value }))} inputMode="numeric" disabled={d.status === 'completed'} />
                </Field>
                <Field label="Pipeline (€)" htmlFor="m-pipe">
                  <Input id="m-pipe" value={metrics.pipeline} onChange={(e) => setMetrics((m) => ({ ...m, pipeline: e.target.value }))} inputMode="decimal" disabled={d.status === 'completed'} />
                </Field>
              </div>
              {d.status === 'live' && (
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" onClick={() => void saveMetrics()} loading={busy}>
                    Save results
                  </Button>
                  <Button onClick={() => void setStatus('completed', {}, 'Deal completed. Payout released.')} disabled={busy}>
                    Complete & release payout
                  </Button>
                </div>
              )}
            </Card>
          )}
          {isCompany && ['invited', 'accepted', 'draft_ready', 'scheduled'].includes(d.status) && (
            <div className="flex justify-end">
              <Button variant="danger" size="sm" onClick={() => void setStatus('cancelled', {}, 'Deal cancelled.')} disabled={busy}>
                Cancel deal
              </Button>
            </div>
          )}
          {!isCompany && ['live', 'completed'].includes(d.status) && d.collaboration_metrics && (
            <Card>
              <h2 className="text-sm font-bold mb-3">Results recorded by the brand</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Impressions', formatCompact(d.collaboration_metrics.impressions)],
                  ['Clicks', formatCompact(d.collaboration_metrics.clicks)],
                  ['Leads', String(d.collaboration_metrics.leads)],
                  ['Pipeline', formatMoney(d.collaboration_metrics.pipeline_cents)],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-[#FAFBFC] border border-[#E9EBF0] p-3 text-center">
                    <div className="text-base font-bold">{v}</div>
                    <div className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <dl className="space-y-3 text-sm">
              {[
                ['Price', formatMoney(d.agreed_price_cents)],
                ['Due date', d.due_date ? formatDate(d.due_date) : '—'],
                ['Scheduled', formatDate(d.scheduled_at)],
                ['Published', formatDate(d.published_at)],
                ['Completed', formatDate(d.completed_at)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-[#6B7280]">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            {d.post_url && ['scheduled', 'live', 'completed'].includes(d.status) && (
              <a href={d.post_url} target="_blank" rel="noreferrer" className="mt-4 block text-center rounded-xl border border-[#E5E7EB] py-2 text-xs font-semibold hover:bg-[#F9FAFB]">
                Open post ↗
              </a>
            )}
          </Card>
          <Card>
            <h2 className="text-sm font-bold mb-2">Payment</h2>
            {payment ? (
              <>
                <div className="text-xl font-bold">{formatMoney(payment.amount_cents, payment.currency)}</div>
                <div className="mt-1">
                  <Badge status={payment.status}>{payment.status}</Badge>
                </div>
                <p className="mt-2 text-xs text-[#6B7280]">{payment.paid_at ? `Paid ${formatDate(payment.paid_at)}` : payment.scheduled_for ? `Scheduled for ${formatDate(payment.scheduled_for)}` : ''}</p>
              </>
            ) : (
              <p className="text-sm text-[#9CA3AF]">Scheduled automatically when the post goes live; NaanoX invoices the brand and pays the creator within 24h.</p>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
