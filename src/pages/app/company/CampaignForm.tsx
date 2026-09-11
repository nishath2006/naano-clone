import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery } from '@/lib/queries'
import { useCompany } from '@/lib/useCompany'
import type { CampaignRow } from '@/lib/database.types'
import { INDUSTRIES, NICHES, OBJECTIVES, parseEuros } from '@/lib/format'
import { Button, Card, ChipSelect, ErrorBanner, Field, Input, PageHeader, Select, Skeleton, Textarea, useToast } from '@/components/app/ui'

type Form = {
  title: string
  description: string
  objective: string
  brief: string
  creator_requirements: string
  target_audience: string
  industry: string
  sectors: string[]
  min_followers: string
  budget: string
  price_per_post: string
  posts_wanted: string
  start_date: string
  end_date: string
}

const EMPTY: Form = {
  title: '',
  description: '',
  objective: 'leads',
  brief: '',
  creator_requirements: '',
  target_audience: '',
  industry: '',
  sectors: [],
  min_followers: '',
  budget: '',
  price_per_post: '',
  posts_wanted: '3',
  start_date: '',
  end_date: '',
}

function fromRow(c: CampaignRow): Form {
  return {
    title: c.title,
    description: c.description,
    objective: c.objective ?? 'leads',
    brief: c.brief ?? '',
    creator_requirements: c.creator_requirements ?? '',
    target_audience: c.target_audience ?? '',
    industry: c.industry ?? '',
    sectors: c.sectors,
    min_followers: c.min_followers ? String(c.min_followers) : '',
    budget: String(c.budget_cents / 100),
    price_per_post: c.price_per_post_cents ? String(c.price_per_post_cents / 100) : '',
    posts_wanted: String(c.posts_wanted),
    start_date: c.start_date ?? '',
    end_date: c.end_date ?? '',
  }
}

/** /app/campaigns/new and /app/campaigns/:id/edit */
export default function CampaignForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const company = useCompany()
  const existing = useQuery(async () => (id ? (unwrap(await supabase.from('campaigns').select('*').eq('id', id).maybeSingle()) as CampaignRow | null) : null), [id])
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [pending, setPending] = useState<'draft' | 'publish' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existing.data) setForm(fromRow(existing.data))
  }, [existing.data])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e: Partial<Record<keyof Form, string>> = {}
    if (form.title.trim().length < 3) e.title = 'Give the campaign a title (3+ characters).'
    if (form.description.trim().length < 20) e.description = 'Describe the campaign in at least 20 characters.'
    const budget = parseEuros(form.budget)
    if (budget === null || budget <= 0) e.budget = 'Enter a total budget in euros.'
    if (form.price_per_post && parseEuros(form.price_per_post) === null) e.price_per_post = 'Enter an amount in euros.'
    const posts = Number(form.posts_wanted)
    if (!Number.isInteger(posts) || posts < 1 || posts > 100) e.posts_wanted = 'Between 1 and 100.'
    if (form.min_followers && !/^\d+$/.test(form.min_followers)) e.min_followers = 'Numbers only.'
    if (form.start_date && form.end_date && form.end_date < form.start_date) e.end_date = 'End date must be after the start date.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async (status: CampaignRow['status']) => {
    if (!company.data || pending || !validate()) return
    setPending(status === 'draft' ? 'draft' : 'publish')
    setError(null)
    const payload = {
      company_id: company.data.id,
      title: form.title.trim(),
      description: form.description.trim(),
      objective: form.objective || null,
      brief: form.brief.trim() || null,
      creator_requirements: form.creator_requirements.trim() || null,
      target_audience: form.target_audience.trim() || null,
      industry: form.industry || null,
      sectors: form.sectors,
      min_followers: form.min_followers ? Number(form.min_followers) : null,
      budget_cents: parseEuros(form.budget) ?? 0,
      price_per_post_cents: form.price_per_post ? parseEuros(form.price_per_post) : null,
      posts_wanted: Number(form.posts_wanted),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status,
    }
    try {
      let campaignId = id
      if (id) {
        // Never move a closed/completed campaign back to draft from the form.
        const nextStatus = existing.data && existing.data.status !== 'draft' && status === 'draft' ? existing.data.status : status
        unwrap(await supabase.from('campaigns').update({ ...payload, status: nextStatus }).eq('id', id))
      } else {
        const row = unwrap(await supabase.from('campaigns').insert(payload).select('id').single()) as { id: string }
        campaignId = row.id
      }
      toast.push('success', status === 'published' ? 'Campaign published to the marketplace.' : 'Campaign saved.')
      navigate(`/app/campaigns/${campaignId}`, { replace: true })
    } catch (e) {
      setError(describeError(e))
    } finally {
      setPending(null)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void save(existing.data && existing.data.status !== 'draft' ? existing.data.status : 'published')
  }

  if (id && existing.loading) return <Skeleton className="h-96" />
  if (id && !existing.loading && !existing.data) return <ErrorBanner>Campaign not found.</ErrorBanner>
  const isDraft = !existing.data || existing.data.status === 'draft'

  return (
    <>
      <PageHeader back={{ to: id ? `/app/campaigns/${id}` : '/app/campaigns', label: id ? 'Campaign' : 'Campaigns' }} title={id ? 'Edit campaign' : 'New campaign'} subtitle="Creators see the title, description, brief and requirements. Budget and pricing help them decide whether to apply." />
      <form className="grid gap-6 lg:grid-cols-[1fr_320px]" noValidate onSubmit={onSubmit}>
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-sm font-bold">The basics</h2>
            <div className="space-y-4">
              <Field label="Title" error={errors.title} htmlFor="cf-title">
                <Input id="cf-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Launch of our AI SDR for RevOps teams" maxLength={140} />
              </Field>
              <Field label="Description" error={errors.description} htmlFor="cf-desc" hint="What is the product and why should a creator's audience care?">
                <Textarea id="cf-desc" value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={3000} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Objective" htmlFor="cf-objective">
                  <Select id="cf-objective" value={form.objective} onChange={(e) => set('objective', e.target.value)}>
                    {OBJECTIVES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Your industry" htmlFor="cf-industry">
                  <Select id="cf-industry" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
                    <option value="">Select…</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Target audience" htmlFor="cf-audience">
                <Input id="cf-audience" value={form.target_audience} onChange={(e) => set('target_audience', e.target.value)} placeholder="Heads of Sales at 50–500 person B2B SaaS companies" maxLength={200} />
              </Field>
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 text-sm font-bold">Brief for creators</h2>
            <div className="space-y-4">
              <Field label="Content brief" htmlFor="cf-brief" hint="Key messages, angle, links, do's and don'ts.">
                <Textarea id="cf-brief" value={form.brief} onChange={(e) => set('brief', e.target.value)} maxLength={5000} />
              </Field>
              <Field label="Creator requirements" htmlFor="cf-req">
                <Textarea id="cf-req" value={form.creator_requirements} onChange={(e) => set('creator_requirements', e.target.value)} placeholder="Actually uses the product category, posts in English, audience in sales…" maxLength={2000} />
              </Field>
              <Field label="Wanted niches" hint="Used to match creators (up to 5).">
                <ChipSelect options={NICHES.slice(0, 20)} value={form.sectors} onChange={(v) => set('sectors', v)} max={5} />
              </Field>
              <Field label="Minimum followers" error={errors.min_followers} htmlFor="cf-min">
                <Input id="cf-min" value={form.min_followers} onChange={(e) => set('min_followers', e.target.value)} inputMode="numeric" placeholder="2000" className="sm:w-48" />
              </Field>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-sm font-bold">Budget & timing</h2>
            <div className="space-y-4">
              <Field label="Total budget (€)" error={errors.budget} htmlFor="cf-budget">
                <Input id="cf-budget" value={form.budget} onChange={(e) => set('budget', e.target.value)} inputMode="decimal" placeholder="2000" />
              </Field>
              <Field label="Price per post (€)" error={errors.price_per_post} htmlFor="cf-ppp" hint="Optional. Creators can propose their own price.">
                <Input id="cf-ppp" value={form.price_per_post} onChange={(e) => set('price_per_post', e.target.value)} inputMode="decimal" placeholder="250" />
              </Field>
              <Field label="Posts wanted" error={errors.posts_wanted} htmlFor="cf-posts">
                <Input id="cf-posts" value={form.posts_wanted} onChange={(e) => set('posts_wanted', e.target.value)} inputMode="numeric" />
              </Field>
              <Field label="Start date" htmlFor="cf-start">
                <Input id="cf-start" type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
              </Field>
              <Field label="End date" error={errors.end_date} htmlFor="cf-end">
                <Input id="cf-end" type="date" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} />
              </Field>
            </div>
          </Card>
          {error && <ErrorBanner>{error}</ErrorBanner>}
          <div className="flex flex-col gap-2">
            <Button type="submit" loading={pending === 'publish'} disabled={pending !== null || company.loading}>
              {isDraft ? 'Publish to marketplace' : 'Save changes'}
            </Button>
            {isDraft && (
              <Button variant="secondary" onClick={() => void save('draft')} loading={pending === 'draft'} disabled={pending !== null || company.loading}>
                Save as draft
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  )
}
