import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import { uploadImage } from '@/lib/storage'
import { COMPANY_SIZES, COUNTRIES, INDUSTRIES, LANGUAGES, NICHES, parseEuros } from '@/lib/format'
import { AuthError } from '@/components/auth/AuthShell'
import { Avatar, Button, ChipSelect, Field, Input, Select, Textarea } from '@/components/app/ui'
import { UploadIcon } from '@/components/app/icons'

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Shared frame: logo, step label, title. */
function Frame({ step, title, subtitle, children }: { step: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
      <div className="w-full max-w-xl">
        <img src="/logo.svg" alt="naano" className="h-7 mb-8" />
        <div className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">{step}</div>
        <h1 className="mt-2 text-2xl font-bold text-[#111827]">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-[#6B7280]">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

function ImagePicker({ value, name, onFile, label }: { value: string | null; name: string; onFile: (f: File) => void; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar src={value} name={name} size={56} />
      <label className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 h-9 text-xs font-semibold text-[#111827] hover:bg-[#F9FAFB] cursor-pointer">
        <UploadIcon width={16} height={16} />
        {label}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </label>
    </div>
  )
}

function CompanyOnboarding() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [size, setSize] = useState('')
  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const onLogo = async (file: File) => {
    if (!user) return
    setUploading(true)
    setError(null)
    try {
      setLogoUrl(await uploadImage('company-logos', user.id, file))
    } catch (e) {
      setError(describeError(e))
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || pending) return
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Your name is required.'
    if (name.trim().length < 2) errs.name = 'Company name is required.'
    if (website && !/^https?:\/\/.+\..+/.test(website.trim())) errs.website = 'Enter a full URL, e.g. https://acme.com'
    setFieldErrors(errs)
    if (Object.keys(errs).length) return
    setPending(true)
    setError(null)
    try {
      const { error: e1 } = await supabase.from('companies').upsert(
        {
          owner_id: user.id,
          name: name.trim(),
          website: website.trim() || null,
          industry: industry || null,
          size: size || null,
          country: country || null,
          description: description.trim() || null,
          logo_url: logoUrl,
        },
        { onConflict: 'owner_id' },
      )
      if (e1) throw e1
      const { error: e2 } = await supabase.from('profiles').update({ full_name: fullName.trim(), onboarding_completed: true }).eq('id', user.id)
      if (e2) throw e2
      await refreshProfile()
      navigate('/app', { replace: true })
    } catch (err) {
      setError(describeError(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <Frame step="Step 2 of 2" title="Set up your company" subtitle="Creators see this when you book them or publish a campaign.">
      <form className="space-y-5" noValidate onSubmit={(e) => void submit(e)}>
        <ImagePicker value={logoUrl} name={name} onFile={(f) => void onLogo(f)} label={uploading ? 'Uploading…' : 'Upload logo'} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" error={fieldErrors.fullName} htmlFor="ob-fullname">
            <Input id="ob-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" autoComplete="name" />
          </Field>
          <Field label="Company name" error={fieldErrors.name} htmlFor="ob-name">
            <Input id="ob-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme" autoComplete="organization" />
          </Field>
          <Field label="Website" error={fieldErrors.website} htmlFor="ob-website">
            <Input id="ob-website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://acme.com" inputMode="url" />
          </Field>
          <Field label="Industry" htmlFor="ob-industry">
            <Select id="ob-industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">Select…</option>
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Company size" htmlFor="ob-size">
            <Select id="ob-size" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Select…</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} people
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Country" htmlFor="ob-country">
            <Select id="ob-country" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Select…</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="What do you sell?" hint="One or two sentences creators can use to position your product." htmlFor="ob-desc">
          <Textarea id="ob-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={600} />
        </Field>
        {error && <AuthError>{error}</AuthError>}
        <Button type="submit" loading={pending} disabled={uploading} className="w-full">
          Go to my dashboard
        </Button>
      </form>
    </Frame>
  )
}

function CreatorOnboarding() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<2 | 3 | 4>(2)
  const [name, setName] = useState(profile?.full_name ?? '')
  const [headline, setHeadline] = useState('')
  const [position, setPosition] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null)
  const [languages, setLanguages] = useState<string[]>([])
  const [niches, setNiches] = useState<string[]>([])
  const [followers, setFollowers] = useState('')
  const [medianViews, setMedianViews] = useState('')
  const [price, setPrice] = useState('')
  const [bundlePrice, setBundlePrice] = useState('')
  const [uploading, setUploading] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const onAvatar = async (file: File) => {
    if (!user) return
    setUploading(true)
    setError(null)
    try {
      setAvatarUrl(await uploadImage('avatars', user.id, file))
    } catch (e) {
      setError(describeError(e))
    } finally {
      setUploading(false)
    }
  }

  const validateStep = () => {
    const errs: Record<string, string> = {}
    if (step === 2) {
      if (name.trim().length < 2) errs.name = 'Your name is required.'
      if (!headline.trim()) errs.headline = 'A headline helps brands understand what you post about.'
      if (linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(linkedin.trim())) errs.linkedin = 'Enter your LinkedIn profile URL.'
    }
    if (step === 3) {
      if (niches.length === 0) errs.niches = 'Pick at least one niche.'
      if (followers && !/^\d+$/.test(followers)) errs.followers = 'Numbers only.'
      if (medianViews && !/^\d+$/.test(medianViews)) errs.medianViews = 'Numbers only.'
    }
    if (step === 4) {
      if (price && parseEuros(price) === null) errs.price = 'Enter an amount in euros.'
      if (bundlePrice && parseEuros(bundlePrice) === null) errs.bundlePrice = 'Enter an amount in euros.'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (!validateStep()) return
    setStep((s) => (s === 2 ? 3 : 4))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || pending || !validateStep()) return
    setPending(true)
    setError(null)
    try {
      // A unique slug: <name>-<short id> avoids collisions with imported profiles.
      const slug = `${slugify(name) || 'creator'}-${user.id.slice(0, 6)}`
      const { error: e1 } = await supabase.from('creators').upsert(
        {
          user_id: user.id,
          slug,
          name: name.trim(),
          headline: headline.trim() || null,
          position: position.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl,
          country: country || null,
          languages,
          sectors: niches,
          linkedin_url: linkedin.trim() || null,
          followers: followers ? Number(followers) : null,
          median_views: medianViews ? Number(medianViews) : null,
          price_cents: price ? parseEuros(price) : null,
          bundle_posts: bundlePrice ? 3 : null,
          bundle_price_cents: bundlePrice ? parseEuros(bundlePrice) : null,
          accepting_bookings: true,
          is_public: true,
          stats_updated_at: followers || medianViews ? new Date().toISOString() : null,
        },
        { onConflict: 'user_id' },
      )
      if (e1) throw e1
      const { error: e2 } = await supabase.from('profiles').update({ full_name: name.trim(), avatar_url: avatarUrl, onboarding_completed: true }).eq('id', user.id)
      if (e2) throw e2
      await refreshProfile()
      navigate('/app', { replace: true })
    } catch (err) {
      setError(describeError(err))
    } finally {
      setPending(false)
    }
  }

  const titles = {
    2: ['Build your card', 'Brands see this on the marketplace. You can edit everything later.'],
    3: ['Your niches & audience', 'Pick the topics you post about and share your LinkedIn numbers.'],
    4: ['Your offer', 'Set a flat price per sponsored post. Naano handles invoicing and pays you within 24h of going live.'],
  } as const

  return (
    <Frame step={`Step ${step} of 4`} title={titles[step][0]} subtitle={titles[step][1]}>
      <form className="space-y-5" noValidate onSubmit={(e) => void submit(e)}>
        {step === 2 && (
          <>
            <ImagePicker value={avatarUrl} name={name} onFile={(f) => void onAvatar(f)} label={uploading ? 'Uploading…' : 'Upload photo'} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={fieldErrors.name} htmlFor="ob-name">
                <Input id="ob-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Current position" htmlFor="ob-position">
                <Input id="ob-position" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Founder @ Acme" />
              </Field>
            </div>
            <Field label="Headline" error={fieldErrors.headline} htmlFor="ob-headline" hint="Your LinkedIn headline works well.">
              <Input id="ob-headline" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={160} />
            </Field>
            <Field label="Bio" htmlFor="ob-bio">
              <Textarea id="ob-bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={1500} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="LinkedIn profile URL" error={fieldErrors.linkedin} htmlFor="ob-linkedin">
                <Input id="ob-linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/…" inputMode="url" />
              </Field>
              <Field label="Based in" htmlFor="ob-country">
                <Select id="ob-country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="">Select…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <Field label="Niches" error={fieldErrors.niches} hint="Up to 3.">
              <ChipSelect options={NICHES} value={niches} onChange={setNiches} max={3} />
            </Field>
            <Field label="Languages you post in">
              <ChipSelect options={LANGUAGES} value={languages} onChange={setLanguages} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="LinkedIn followers" error={fieldErrors.followers} htmlFor="ob-followers">
                <Input id="ob-followers" value={followers} onChange={(e) => setFollowers(e.target.value)} inputMode="numeric" placeholder="4200" />
              </Field>
              <Field label="Median views per post" error={fieldErrors.medianViews} htmlFor="ob-views">
                <Input id="ob-views" value={medianViews} onChange={(e) => setMedianViews(e.target.value)} inputMode="numeric" placeholder="7200" />
              </Field>
            </div>
          </>
        )}
        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price per sponsored post (€)" error={fieldErrors.price} htmlFor="ob-price" hint="Most creators charge between €20 and €960.">
              <Input id="ob-price" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="120" />
            </Field>
            <Field label="Bundle of 3 posts (€)" error={fieldErrors.bundlePrice} htmlFor="ob-bundle" hint="Optional discount for repeat bookings.">
              <Input id="ob-bundle" value={bundlePrice} onChange={(e) => setBundlePrice(e.target.value)} inputMode="decimal" placeholder="320" />
            </Field>
          </div>
        )}
        {error && <AuthError>{error}</AuthError>}
        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 2 ? (
            <Button variant="ghost" onClick={() => setStep((s) => (s === 4 ? 3 : 2))}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <Button onClick={next} disabled={uploading}>
              Continue
            </Button>
          ) : (
            <Button type="submit" loading={pending}>
              Publish my card
            </Button>
          )}
        </div>
      </form>
    </Frame>
  )
}

export default function Onboarding() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  if (profile?.onboarding_completed) {
    navigate('/app', { replace: true })
    return null
  }
  return profile?.role === 'company' ? <CompanyOnboarding /> : <CreatorOnboarding />
}
