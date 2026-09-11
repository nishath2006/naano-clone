import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import { useCompany } from '@/lib/useCompany'
import { uploadImage } from '@/lib/storage'
import { useLocale } from '@/lib/locale'
import { COMPANY_SIZES, COUNTRIES, INDUSTRIES } from '@/lib/format'
import { Avatar, Button, Card, ErrorBanner, Field, Input, PageHeader, Select, Skeleton, Textarea, useToast } from '@/components/app/ui'
import { UploadIcon } from '@/components/app/icons'

/** /app/settings — account (name, language, password) and, for companies, the company profile. */
export default function Settings() {
  const { user, profile, refreshProfile, signOut } = useAuth()
  const { locale, set: setLocale } = useLocale()
  const navigate = useNavigate()
  const toast = useToast()
  const isCompany = profile?.role === 'company'
  const company = useCompany()

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [savingPw, setSavingPw] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [co, setCo] = useState({ name: '', website: '', industry: '', size: '', country: '', description: '', logo_url: null as string | null })
  const [savingCo, setSavingCo] = useState(false)
  const [coError, setCoError] = useState<string | null>(null)

  useEffect(() => {
    setFullName(profile?.full_name ?? '')
    setAvatarUrl(profile?.avatar_url ?? null)
  }, [profile])
  useEffect(() => {
    const c = company.data
    if (c) setCo({ name: c.name, website: c.website ?? '', industry: c.industry ?? '', size: c.size ?? '', country: c.country ?? '', description: c.description ?? '', logo_url: c.logo_url })
  }, [company.data])

  const onImage = async (bucket: 'avatars' | 'company-logos', file: File) => {
    if (!user) return
    setUploading(true)
    try {
      const url = await uploadImage(bucket, user.id, file)
      if (bucket === 'avatars') setAvatarUrl(url)
      else setCo((c) => ({ ...c, logo_url: url }))
    } catch (e) {
      toast.push('error', describeError(e))
    } finally {
      setUploading(false)
    }
  }

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!fullName.trim()) return toast.push('error', 'Name is required.')
    setSavingProfile(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName.trim(), avatar_url: avatarUrl, locale }).eq('id', user.id)
    setSavingProfile(false)
    if (error) return toast.push('error', describeError(error))
    await refreshProfile()
    toast.push('success', 'Account updated.')
  }

  const savePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPwError(null)
    if (password.length < 8) return setPwError('Password must be at least 8 characters.')
    if (password !== password2) return setPwError('Passwords do not match.')
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSavingPw(false)
    if (error) return setPwError(describeError(error))
    setPassword('')
    setPassword2('')
    toast.push('success', 'Password changed.')
  }

  const saveCompany = async (e: FormEvent) => {
    e.preventDefault()
    if (!company.data) return
    setCoError(null)
    if (co.name.trim().length < 2) return setCoError('Company name is required.')
    if (co.website && !/^https?:\/\/.+\..+/.test(co.website.trim())) return setCoError('Enter a full URL, e.g. https://acme.com')
    setSavingCo(true)
    const { error } = await supabase
      .from('companies')
      .update({ name: co.name.trim(), website: co.website.trim() || null, industry: co.industry || null, size: co.size || null, country: co.country || null, description: co.description.trim() || null, logo_url: co.logo_url })
      .eq('id', company.data.id)
    setSavingCo(false)
    if (error) return setCoError(describeError(error))
    await company.reload()
    toast.push('success', 'Company profile updated.')
  }

  return (
    <>
      <PageHeader title="Settings" subtitle={profile?.email} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-bold">Account</h2>
          <form className="space-y-4" noValidate onSubmit={(e) => void saveProfile(e)}>
            <div className="flex items-center gap-4">
              <Avatar src={avatarUrl} name={fullName} size={56} />
              <label className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 h-9 text-xs font-semibold hover:bg-[#F9FAFB] cursor-pointer">
                <UploadIcon width={16} height={16} /> {uploading ? 'Uploading…' : 'Change photo'}
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => e.target.files?.[0] && void onImage('avatars', e.target.files[0])} />
              </label>
            </div>
            <Field label="Name" htmlFor="st-name">
              <Input id="st-name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Email" htmlFor="st-email" hint="Contact support to change your email.">
              <Input id="st-email" value={profile?.email ?? ''} disabled />
            </Field>
            <Field label="Language" htmlFor="st-locale">
              <Select id="st-locale" value={locale} onChange={(e) => setLocale(e.target.value as 'en' | 'fr')}>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </Select>
            </Field>
            <Field label="Account type" htmlFor="st-role" hint="Roles are fixed at signup and enforced by the database.">
              <Input id="st-role" value={profile?.role === 'company' ? 'Brand / company' : 'Creator'} disabled />
            </Field>
            <Button type="submit" loading={savingProfile} disabled={uploading}>
              Save
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-sm font-bold">Password</h2>
            <form className="space-y-4" noValidate onSubmit={(e) => void savePassword(e)}>
              <Field label="New password" htmlFor="st-pw">
                <Input id="st-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} />
              </Field>
              <Field label="Confirm new password" htmlFor="st-pw2">
                <Input id="st-pw2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" />
              </Field>
              {pwError && <ErrorBanner>{pwError}</ErrorBanner>}
              <Button type="submit" variant="secondary" loading={savingPw} disabled={!password}>
                Change password
              </Button>
            </form>
          </Card>
          <Card>
            <h2 className="mb-1 text-sm font-bold">Session</h2>
            <p className="mb-3 text-sm text-[#6B7280]">Signed in as {profile?.email}. Your session is stored in this browser and restored automatically.</p>
            <Button
              variant="danger"
              onClick={async () => {
                await signOut()
                navigate('/login', { replace: true })
              }}
            >
              Sign out
            </Button>
          </Card>
        </div>

        {isCompany && (
          <Card className="lg:col-span-2">
            <h2 className="mb-4 text-sm font-bold">Company profile</h2>
            {company.loading ? (
              <Skeleton className="h-40" />
            ) : (
              <form className="space-y-4" noValidate onSubmit={(e) => void saveCompany(e)}>
                <div className="flex items-center gap-4">
                  <Avatar src={co.logo_url} name={co.name} size={56} className="rounded-xl" />
                  <label className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 h-9 text-xs font-semibold hover:bg-[#F9FAFB] cursor-pointer">
                    <UploadIcon width={16} height={16} /> {uploading ? 'Uploading…' : 'Change logo'}
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => e.target.files?.[0] && void onImage('company-logos', e.target.files[0])} />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Company name" htmlFor="co-name">
                    <Input id="co-name" value={co.name} onChange={(e) => setCo({ ...co, name: e.target.value })} />
                  </Field>
                  <Field label="Website" htmlFor="co-web">
                    <Input id="co-web" value={co.website} onChange={(e) => setCo({ ...co, website: e.target.value })} inputMode="url" />
                  </Field>
                  <Field label="Industry" htmlFor="co-ind">
                    <Select id="co-ind" value={co.industry} onChange={(e) => setCo({ ...co, industry: e.target.value })}>
                      <option value="">Select…</option>
                      {INDUSTRIES.map((i) => (
                        <option key={i.value} value={i.value}>
                          {i.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Size" htmlFor="co-size">
                    <Select id="co-size" value={co.size} onChange={(e) => setCo({ ...co, size: e.target.value })}>
                      <option value="">Select…</option>
                      {COMPANY_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s} people
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Country" htmlFor="co-country">
                    <Select id="co-country" value={co.country} onChange={(e) => setCo({ ...co, country: e.target.value })}>
                      <option value="">Select…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Description" htmlFor="co-desc">
                  <Textarea id="co-desc" value={co.description} onChange={(e) => setCo({ ...co, description: e.target.value })} maxLength={600} />
                </Field>
                {coError && <ErrorBanner>{coError}</ErrorBanner>}
                <Button type="submit" loading={savingCo} disabled={uploading}>
                  Save company
                </Button>
              </form>
            )}
          </Card>
        )}
      </div>
    </>
  )
}
