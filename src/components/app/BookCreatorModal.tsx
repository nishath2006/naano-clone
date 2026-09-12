import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import type { CampaignRow } from '@/lib/database.types'
import { formatMoney, parseEuros } from '@/lib/format'
import { Button, ErrorBanner, Field, Input, Modal, Select, Textarea, useToast } from './ui'

/**
 * "Book" flow: a company invites a creator to one of its campaigns at an
 * agreed price. Inserts a `collaborations` row with status `invited`; the
 * database notifies the creator.
 */
export function BookCreatorModal({
  open,
  onClose,
  creator,
  companyId,
  onBooked,
}: {
  open: boolean
  onClose: () => void
  creator: { id: string; name: string; price_cents: number | null } | null
  companyId: string | null
  onBooked?: () => void
}) {
  const toast = useToast()
  const [campaigns, setCampaigns] = useState<CampaignRow[] | null>(null)
  const [campaignId, setCampaignId] = useState('')
  const [price, setPrice] = useState('')
  const [brief, setBrief] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setPrice(creator?.price_cents ? String(creator.price_cents / 100) : '')
    supabase
      .from('campaigns')
      .select('*')
      .in('status', ['draft', 'published'])
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(describeError(err))
        setCampaigns((data ?? []) as CampaignRow[])
        if (data?.[0]) setCampaignId(data[0].id)
      })
  }, [open, creator])

  const submit = async () => {
    if (!creator || !companyId) return
    const cents = parseEuros(price)
    if (!campaignId) return setError('Pick a campaign.')
    if (cents === null || cents === 0) return setError('Enter the agreed price per post.')
    setPending(true)
    setError(null)
    const { error: err } = await supabase.from('collaborations').insert({
      campaign_id: campaignId,
      company_id: companyId,
      creator_id: creator.id,
      status: 'invited',
      agreed_price_cents: cents,
      brief: brief.trim() || null,
      due_date: dueDate || null,
    })
    setPending(false)
    if (err) {
      setError(/duplicate key|unique/i.test(err.message) ? `${creator.name} is already booked on this campaign.` : describeError(err))
      return
    }
    toast.push('success', `Invitation sent to ${creator.name}.`)
    onBooked?.()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={creator ? `Book ${creator.name}` : 'Book'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} loading={pending} disabled={!campaigns?.length}>
            Send invitation
          </Button>
        </>
      }
    >
      {campaigns && campaigns.length === 0 ? (
        <p className="text-sm text-[#6B7280]">
          You need a campaign first.{' '}
          <Link to="/app/campaigns/new" className="font-semibold text-[#7C5CFC]">
            Create one
          </Link>
          , then come back to book creators.
        </p>
      ) : (
        <>
          <Field label="Campaign" htmlFor="book-campaign">
            <Select id="book-campaign" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} disabled={!campaigns}>
              {(campaigns ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Agreed price per post (€)" htmlFor="book-price" hint={creator?.price_cents ? `Card price: ${formatMoney(creator.price_cents)}` : undefined}>
            <Input id="book-price" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
          </Field>
          <Field label="Due date" htmlFor="book-due">
            <Input id="book-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
          <Field label="Message / brief" htmlFor="book-brief">
            <Textarea id="book-brief" value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="What should the post be about? Key messages, links, do's and don'ts…" maxLength={2000} />
          </Field>
        </>
      )}
      {error && <ErrorBanner>{error}</ErrorBanner>}
    </Modal>
  )
}
