import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import { useCreator } from '@/lib/useCompany'
import { uploadImage } from '@/lib/storage'
import { COUNTRIES, LANGUAGES, NICHES, parseEuros } from '@/lib/format'
import { Avatar, Button, Card, ChipSelect, ErrorBanner, Field, Input, PageHeader, Select, Skeleton, Textarea, useToast } from '@/components/app/ui'
import { UploadIcon } from '@/components/app/icons'
import { CreatorCardView } from '@/components/app/CreatorCardView'

/** /app/profile (creator) — edit the marketplace card: profile, niches, audience numbers and offer. */
export default function MyCard() {
  const { user, refreshProfile } = useAuth()
  const toast = useToast()
  const creator = useCreator()
  const [form, setForm] = useState({
    name: '',
    headline: '',
    position: '',
    bio: '',
    country: '',
    linkedin_url: '',
    languages: [] as string[],
    sectors: [] as string[],
    followers: '',
    median_views: '',
    avg_reactions: '',
    avg_comments: '',
    engagement_rate: '',
    price: '',
    bundle_posts: '3',
    bundle_price: '',
    accepting_bookings: true,
    is_public: true,
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const c = creator.data
    if (!c) return
    setAvatarUrl(c.avatar_url)
    setForm({
      name: c.name,
      headline: c.headline ?? '',
      position: c.position ?? '',
      bio: c.bio ?? '',
      country: c.country ?? '',
      linkedin_url: c.linkedin_url ?? '',
      languages: c.languages,
      sectors: c.sectors,
      followers: c.followers?.toString() ?? '',
      median_views: c.median_views?.toString() ?? '',
      avg_reactions: c.avg_reactions?.toString() ?? '',
      avg_comments: c.avg_comments?.toString() ?? '',
      engagement_rate: c.engagement_rate?.toString() ?? '',
      price: c.price_cents ? String(c.price_cents / 100) : '',
      bundle_posts: c.bundle_posts?.toString() ?? '3',
      bundle_price: c.bundle_price_cents ? String(c.bundle_price_cents / 100) : '',
      accepting_bookings: c.accepting_bookings,
      is_public: c.is_public,
    })
  }, [creator.data])

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }))

  const onAvatar = async (file: File) => {
    if (!user) return
    setUploading(true)
    try {
      setAvatarUrl(await uploadImage('avatars', user.id, file))
    } catch (e) {
      toast.push('error', describeError(e))
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!creator.data || pending) return
    const errs: Record<string, string> = {}
    if (form.name.trim().length < 2) errs.name = 'Name is required.'
    if (form.sectors.length === 0) errs.sectors = 'Pick at least one niche.'
    for (const k of ['followers', 'median_views', 'avg_reactions', 'avg_comments'] as const) if (form[k] && !/^\d+$/.test(form[k])) errs[k] = 'Numbers only.'
    if (form.engagement_rate && !/^\d+([.,]\d+)?$/.test(form.engagement_rate)) errs.engagement_rate = 'e.g. 3.8'
    if (form.price && parseEuros(form.price) === null) errs.price = 'Enter an amount in euros.'
    if (form.bundle_price && parseEuros(form.bundle_price) === null) errs.bundle_price = 'Enter an amount in euros.'
    if (form.linkedin_url && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(form.linkedin_url.trim())) errs.linkedin_url = 'Enter your LinkedIn profile URL.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setPending(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from('creators')
        .update({
          name: form.name.trim(),
          headline: form.headline.trim() || null,
          position: form.position.trim() || null,
          bio: form.bio.trim() || null,
          avatar_url: avatarUrl,
          country: form.country || null,
          linkedin_url: form.linkedin_url.trim() || null,
          languages: form.languages,
          sectors: form.sectors,
          followers: form.followers ? Number(form.followers) : null,
          median_views: form.median_views ? Number(form.median_views) : null,
          avg_reactions: form.avg_reactions ? Number(form.avg_reactions) : null,
          avg_comments: form.avg_comments ? Number(form.avg_comments) : null,
          engagement_rate: form.engagement_rate ? Number(form.engagement_rate.replace(',', '.')) : null,
          price_cents: form.price ? parseEuros(form.price) : null,
          bundle_posts: form.bundle_price ? Number(form.bundle_posts) || 3 : null,
          bundle_price_cents: form.bundle_price ? parseEuros(form.bundle_price) : null,
          accepting_bookings: form.accepting_bookings,
          is_public: form.is_public,
          stats_updated_at: new Date().toISOString(),
        })
        .eq('id', creator.data.id)
      if (err) throw err
      await supabase.from('profiles').update({ full_name: form.name.trim(), avatar_url: avatarUrl }).eq('id', user!.id)
      await refreshProfile()
      await creator.reload()
      toast.push('success', 'Your card is updated.')
    } catch (err) {
      setError(describeError(err))
    } finally {
      setPending(false)
    }
  }

  if (creator.error) return <ErrorBanner onRetry={() => void creator.reload()}>{describeError(creator.error)}</ErrorBanner>
  if (creator.loading || !creator.data) return <Skeleton className="h-96" />

  const preview = {
    ...creator.data,
    name: form.name || creator.data.name,
    headline: form.headline,
    bio: form.bio,
    avatar_url: avatarUrl,
    country: form.country || null,
    sectors: form.sectors,
    followers: form.followers ? Number(form.followers) : null,
    median_views: form.median_views ? Number(form.median_views) : null,
    engagement_rate: form.engagement_rate ? Number(form.engagement_rate.replace(',', '.')) : null,
    price_cents: form.price ? parseEuros(form.price) : null,
    accepting_bookings: form.accepting_bookings,
    position: form.position,
    linkedin_url: form.linkedin_url,
  }

  return (
    <>
      <PageHeader title="My card" subtitle="This is what brands see on the marketplace. It updates live with your profile, analytics, positioning and price." />
      <form className="grid gap-6 lg:grid-cols-[1fr_360px]" noValidate onSubmit={(e) => void submit(e)}>
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-sm font-bold">Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar src={avatarUrl} name={form.name} size={56} />
                <label className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 h-9 text-xs font-semibold hover:bg-[#F9FAFB] cursor-pointer">
                  <UploadIcon width={16} height={16} /> {uploading ? 'Uploading…' : 'Change photo'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => e.target.files?.[0] && void onAvatar(e.target.files[0])} />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name} htmlFor="mc-name">
                  <Input id="mc-name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                </Field>
                <Field label="Current position" htmlFor="mc-position">
                  <Input id="mc-position" value={form.position} onChange={(e) => set('position', e.target.value)} placeholder="Founder @ Acme" />
                </Field>
              </div>
              <Field label="Headline" htmlFor="mc-headline">
                <Input id="mc-headline" value={form.headline} onChange={(e) => set('headline', e.target.value)} maxLength={160} />
              </Field>
              <Field label="Bio" htmlFor="mc-bio">
                <Textarea id="mc-bio" value={form.bio} onChange={(e) => set('bio', e.target.value)} maxLength={1500} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="LinkedIn URL" error={errors.linkedin_url} htmlFor="mc-li">
                  <Input id="mc-li" value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} inputMode="url" />
                </Field>
                <Field label="Based in" htmlFor="mc-country">
                  <Select id="mc-country" value={form.country} onChange={(e) => set('country', e.target.value)}>
                    <option value="">Select…</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 text-sm font-bold">Niches & languages</h2>
            <div className="space-y-4">
              <Field label="Niches" error={errors.sectors} hint="Up to 3.">
                <ChipSelect options={NICHES} value={form.sectors} onChange={(v) => set('sectors', v)} max={3} />
              </Field>
              <Field label="Languages">
                <ChipSelect options={LANGUAGES} value={form.languages} onChange={(v) => set('languages', v)} />
              </Field>
            </div>
          </Card>
          <Card>
            <h2 className="mb-1 text-sm font-bold">Audience</h2>
            <p className="mb-4 text-xs text-[#9CA3AF]">Your LinkedIn analytics. Brands filter the marketplace by these numbers.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Followers" error={errors.followers} htmlFor="mc-followers">
                <Input id="mc-followers" value={form.followers} onChange={(e) => set('followers', e.target.value)} inputMode="numeric" />
              </Field>
              <Field label="Median views / post" error={errors.median_views} htmlFor="mc-views">
                <Input id="mc-views" value={form.median_views} onChange={(e) => set('median_views', e.target.value)} inputMode="numeric" />
              </Field>
              <Field label="Engagement rate (%)" error={errors.engagement_rate} htmlFor="mc-er">
                <Input id="mc-er" value={form.engagement_rate} onChange={(e) => set('engagement_rate', e.target.value)} inputMode="decimal" placeholder="3.8" />
              </Field>
              <Field label="Avg reactions" error={errors.avg_reactions} htmlFor="mc-react">
                <Input id="mc-react" value={form.avg_reactions} onChange={(e) => set('avg_reactions', e.target.value)} inputMode="numeric" />
              </Field>
              <Field label="Avg comments" error={errors.avg_comments} htmlFor="mc-comments">
                <Input id="mc-comments" value={form.avg_comments} onChange={(e) => set('avg_comments', e.target.value)} inputMode="numeric" />
              </Field>
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 text-sm font-bold">Offer</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price per post (€)" error={errors.price} htmlFor="mc-price">
                <Input id="mc-price" value={form.price} onChange={(e) => set('price', e.target.value)} inputMode="decimal" />
              </Field>
              <Field label="Bundle size" htmlFor="mc-bposts">
                <Select id="mc-bposts" value={form.bundle_posts} onChange={(e) => set('bundle_posts', e.target.value)}>
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} posts
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Bundle price (€)" error={errors.bundle_price} htmlFor="mc-bprice" hint="Leave empty for no bundle.">
                <Input id="mc-bprice" value={form.bundle_price} onChange={(e) => set('bundle_price', e.target.value)} inputMode="decimal" />
              </Field>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-[#4B5563]">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.accepting_bookings} onChange={(e) => set('accepting_bookings', e.target.checked)} className="h-4 w-4 accent-[#7C5CFC]" />
                Accepting bookings
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_public} onChange={(e) => set('is_public', e.target.checked)} className="h-4 w-4 accent-[#7C5CFC]" />
                Show my card on the marketplace
              </label>
            </div>
          </Card>
          {error && <ErrorBanner>{error}</ErrorBanner>}
          <Button type="submit" loading={pending} disabled={uploading}>
            Save card
          </Button>
        </div>
        <div>
          <div className="lg:sticky lg:top-8">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Live preview</div>
            <CreatorCardView creator={preview} bookmarked={false} onBookmark={() => {}} onBook={() => {}} />
          </div>
        </div>
      </form>
    </>
  )
}
