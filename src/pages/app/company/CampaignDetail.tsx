import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import type { ApplicationRow, CampaignRow, CollaborationRow, MetricsRow } from '@/lib/database.types'
import { APPLICATION_STATUS_LABEL, CAMPAIGN_STATUS_LABEL, COLLAB_STATUS_LABEL, formatCompact, formatDate, formatMoney, timeAgo } from '@/lib/format'
import { Avatar, Badge, Button, Card, EmptyState, ErrorBanner, LinkButton, Modal, PageHeader, Skeleton, StatCard, Tabs, useToast } from '@/components/app/ui'
import { InboxIcon } from '@/components/app/icons'

type CreatorLite = { id: string; name: string; avatar_url: string | null; headline: string | null; followers: number | null; median_views: number | null; price_cents: number | null; sectors: string[] }
type App = ApplicationRow & { creators: CreatorLite | null }
type Deal = CollaborationRow & { creators: CreatorLite | null; collaboration_metrics: MetricsRow | null }
type Tab = 'applications' | 'creators' | 'brief'

/** /app/campaigns/:id (company) — applications, booked creators, results and lifecycle actions. */
export default function CampaignDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('applications')
  const [busy, setBusy] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<'close' | 'complete' | 'delete' | null>(null)

  const q = useQuery(async () => {
    const campaign = unwrap(await supabase.from('campaigns').select('*').eq('id', id).maybeSingle()) as CampaignRow | null
    if (!campaign) return null
    const [applications, deals] = await Promise.all([
      unwrap(await supabase.from('campaign_applications').select('*, creators(id, name, avatar_url, headline, followers, median_views, price_cents, sectors)').eq('campaign_id', id).order('created_at', { ascending: false })) as App[],
      unwrap(await supabase.from('collaborations').select('*, creators(id, name, avatar_url, headline, followers, median_views, price_cents, sectors), collaboration_metrics(*)').eq('campaign_id', id).order('created_at', { ascending: false })) as Deal[],
    ])
    return { campaign, applications, deals }
  }, [id])

  const act = async (key: string, fn: () => Promise<unknown>, success: string) => {
    setBusy(key)
    try {
      await fn()
      toast.push('success', success)
      await q.reload()
    } catch (e) {
      toast.push('error', describeError(e))
    } finally {
      setBusy(null)
    }
  }

  const decide = (a: App, status: 'accepted' | 'rejected') =>
    act(a.id, async () => unwrap(await supabase.from('campaign_applications').update({ status }).eq('id', a.id)), status === 'accepted' ? `${a.creators?.name} booked. A deal was created.` : 'Application declined.')

  const setStatus = (status: CampaignRow['status'], msg: string) => act(`status:${status}`, async () => unwrap(await supabase.from('campaigns').update({ status }).eq('id', id)), msg)

  const remove = () =>
    act('delete', async () => {
      unwrap(await supabase.from('campaigns').delete().eq('id', id))
      navigate('/app/campaigns', { replace: true })
    }, 'Campaign deleted.')

  if (q.error) return <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
  if (q.loading) return <Skeleton className="h-96" />
  if (!q.data) return <EmptyState title="Campaign not found" action={<LinkButton to="/app/campaigns">Back to campaigns</LinkButton>} />
  const { campaign: c, applications, deals } = q.data
  const pendingApps = applications.filter((a) => a.status === 'pending')
  const totals = deals.reduce(
    (acc, d) => {
      acc.impressions += d.collaboration_metrics?.impressions ?? 0
      acc.clicks += d.collaboration_metrics?.clicks ?? 0
      acc.leads += d.collaboration_metrics?.leads ?? 0
      acc.spend += ['live', 'completed'].includes(d.status) ? d.agreed_price_cents : 0
      return acc
    },
    { impressions: 0, clicks: 0, leads: 0, spend: 0 },
  )

  return (
    <>
      <PageHeader
        back={{ to: '/app/campaigns', label: 'Campaigns' }}
        title={
          <span className="flex flex-wrap items-center gap-2">
            {c.title} <Badge status={c.status}>{CAMPAIGN_STATUS_LABEL[c.status]}</Badge>
          </span>
        }
        subtitle={`${formatMoney(c.budget_cents)} budget · ${c.posts_wanted} post${c.posts_wanted > 1 ? 's' : ''} wanted${c.published_at ? ` · published ${formatDate(c.published_at)}` : ''}`}
        actions={
          <>
            {c.status !== 'completed' && (
              <LinkButton to={`/app/campaigns/${c.id}/edit`} variant="secondary">
                Edit
              </LinkButton>
            )}
            {c.status === 'draft' && (
              <>
                <Button variant="danger" onClick={() => setConfirm('delete')}>
                  Delete
                </Button>
                <Button onClick={() => void setStatus('published', 'Campaign published.')} loading={busy === 'status:published'}>
                  Publish
                </Button>
              </>
            )}
            {c.status === 'published' && (
              <Button variant="secondary" onClick={() => setConfirm('close')}>
                Close applications
              </Button>
            )}
            {c.status === 'closed' && (
              <>
                <Button variant="secondary" onClick={() => void setStatus('published', 'Campaign reopened.')} loading={busy === 'status:published'}>
                  Reopen
                </Button>
                <Button onClick={() => setConfirm('complete')}>Mark completed</Button>
              </>
            )}
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Applications" value={applications.length} hint={`${pendingApps.length} pending`} tone={pendingApps.length ? 'blue' : undefined} />
        <StatCard label="Creators booked" value={deals.filter((d) => !['declined', 'cancelled'].includes(d.status)).length} hint={`${deals.filter((d) => ['live', 'completed'].includes(d.status)).length} posts live`} />
        <StatCard label="Impressions" value={formatCompact(totals.impressions)} hint={`${formatCompact(totals.clicks)} clicks · ${totals.leads} leads`} />
        <StatCard label="Spent" value={formatMoney(totals.spend)} hint={`of ${formatMoney(c.budget_cents)}`} />
      </div>

      <div className="mb-4">
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'applications', label: `Applications (${applications.length})` },
            { value: 'creators', label: `Booked creators (${deals.length})` },
            { value: 'brief', label: 'Brief' },
          ]}
        />
      </div>

      {tab === 'applications' &&
        (applications.length === 0 ? (
          <EmptyState
            icon={<InboxIcon />}
            title={c.status === 'published' ? 'No applications yet' : 'Publish the campaign to receive applications'}
            body={c.status === 'published' ? 'Creators browse open campaigns from their dashboard. You can also book creators directly from the marketplace.' : undefined}
            action={<LinkButton to="/app/marketplace" variant="secondary">Book from the marketplace</LinkButton>}
          />
        ) : (
          <ul className="space-y-3">
            {applications.map((a) => (
              <li key={a.id}>
                <Card>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <Link to={`/app/creators/${a.creators?.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar src={a.creators?.avatar_url} name={a.creators?.name} size={44} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{a.creators?.name}</div>
                        <div className="truncate text-xs text-[#6B7280]">{a.creators?.headline}</div>
                        <div className="mt-0.5 text-[11px] text-[#9CA3AF]">
                          {formatCompact(a.creators?.followers)} followers · {formatCompact(a.creators?.median_views)} median views · applied {timeAgo(a.created_at)}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <div className="text-sm font-bold">{formatMoney(a.proposed_price_cents ?? a.creators?.price_cents ?? c.price_per_post_cents)}</div>
                      <Badge status={a.status}>{APPLICATION_STATUS_LABEL[a.status]}</Badge>
                    </div>
                  </div>
                  {a.message && <p className="mt-3 rounded-xl bg-[#FAFBFC] px-3 py-2 text-sm text-[#4B5563] whitespace-pre-line">{a.message}</p>}
                  {a.status === 'pending' && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => void decide(a, 'accepted')} loading={busy === a.id}>
                        Accept & book
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => void decide(a, 'rejected')} disabled={busy === a.id}>
                        Decline
                      </Button>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        ))}

      {tab === 'creators' &&
        (deals.length === 0 ? (
          <EmptyState title="No creators booked yet" body="Accept an application or book a creator from the marketplace." action={<LinkButton to="/app/marketplace">Open the marketplace</LinkButton>} />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#E9EBF0] bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-[#FAFBFC] text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 text-left">Creator</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Impressions</th>
                  <th className="px-4 py-3 text-right">Leads</th>
                  <th className="px-4 py-3 text-left">Due</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {deals.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={d.creators?.avatar_url} name={d.creators?.name} size={32} />
                        <span className="font-semibold">{d.creators?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={d.status}>{COLLAB_STATUS_LABEL[d.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">{formatMoney(d.agreed_price_cents)}</td>
                    <td className="px-4 py-3 text-right">{formatCompact(d.collaboration_metrics?.impressions ?? 0)}</td>
                    <td className="px-4 py-3 text-right">{d.collaboration_metrics?.leads ?? 0}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{d.due_date ? formatDate(d.due_date) : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/app/collaborations/${d.id}`} className="text-xs font-semibold text-[#7C5CFC]">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {tab === 'brief' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Card>
            <h2 className="text-sm font-bold mb-2">Description</h2>
            <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{c.description}</p>
            {c.brief && (
              <>
                <h2 className="text-sm font-bold mt-6 mb-2">Content brief</h2>
                <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{c.brief}</p>
              </>
            )}
            {c.creator_requirements && (
              <>
                <h2 className="text-sm font-bold mt-6 mb-2">Creator requirements</h2>
                <p className="whitespace-pre-line text-sm leading-6 text-[#4B5563]">{c.creator_requirements}</p>
              </>
            )}
          </Card>
          <Card>
            <dl className="space-y-3 text-sm">
              {[
                ['Objective', c.objective ?? '—'],
                ['Target audience', c.target_audience ?? '—'],
                ['Niches', c.sectors.join(', ') || '—'],
                ['Min. followers', c.min_followers ? formatCompact(c.min_followers) : '—'],
                ['Price per post', c.price_per_post_cents ? formatMoney(c.price_per_post_cents) : 'Creator proposes'],
                ['Dates', `${c.start_date ? formatDate(c.start_date) : '—'} → ${c.end_date ? formatDate(c.end_date) : '—'}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{k}</dt>
                  <dd className="text-[#111827]">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}

      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === 'delete' ? 'Delete this draft?' : confirm === 'close' ? 'Close applications?' : 'Mark campaign completed?'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm === 'delete' ? 'danger' : 'primary'}
              loading={busy !== null}
              onClick={() => {
                const which = confirm
                setConfirm(null)
                if (which === 'delete') void remove()
                if (which === 'close') void setStatus('closed', 'Applications closed.')
                if (which === 'complete') void setStatus('completed', 'Campaign completed.')
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#4B5563]">
          {confirm === 'delete'
            ? 'The draft and any invitations sent from it will be removed. This cannot be undone.'
            : confirm === 'close'
              ? 'Creators will no longer be able to apply. Existing deals continue as normal; you can reopen later.'
              : 'Use this once every post is live and results are recorded. Completed campaigns are read-only.'}
        </p>
      </Modal>
    </>
  )
}
