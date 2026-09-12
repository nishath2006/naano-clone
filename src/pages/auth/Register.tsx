import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLocale, useT } from '@/lib/locale'
import { describeError, supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useAuthSubmit } from '@/lib/useAuthSubmit'
import {
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_SUBMIT_CLASS,
  AUTH_SUBMIT_STYLE,
  AuthError,
  AuthHeader,
  AuthSidePanel,
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  MailIcon,
  OAUTH_BUTTON_STYLE,
  OAuthButton,
  useAppShell,
} from '@/components/auth/AuthShell'
import { MarketplaceCard } from '@/components/auth/MarketplaceCard'

type Role = 'saas' | 'influencer'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMAIL_TOGGLE_CLASS =
  'w-full h-12 rounded-xl text-[15px] font-semibold text-[#111827] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer flex items-center justify-center gap-3'

/**
 * Email + password form revealed by "Sign up with email".
 * UNKNOWN markup on the live site — reuses the /login input styles.
 */
function EmailSignupForm({ role }: { role: Role }) {
  const navigate = useNavigate()
  const { locale } = useLocale()
  const { refreshProfile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)
  const { pending, cooldown, blocked, run, holdIfRateLimited } = useAuthSubmit()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (blocked) return
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.') // UNKNOWN copy
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.') // UNKNOWN copy
      return
    }
    setError(null)
    void run(async () => {
      try {
        // The role travels as signup metadata; the database trigger copies it
        // into profiles.role once and locks it — the client can never change it.
        // Every call sends a confirmation email when "Confirm email" is on, so
        // the submit guard above makes sure it is sent once per click.
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { role: role === 'saas' ? 'company' : 'creator', locale },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (signUpError) {
          holdIfRateLimited(signUpError)
          setError(describeError(signUpError))
          return
        }
        // Supabase returns an empty identities array when the email is already registered.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('An account with this email already exists. Sign in instead.')
          return
        }
        if (!data.session) {
          // "Confirm email" is enabled on the project: the session starts after the link is clicked.
          setConfirmSent(true)
          return
        }
        await refreshProfile()
        navigate('/app/onboarding', { replace: true })
      } catch (err) {
        holdIfRateLimited(err)
        setError(describeError(err))
      }
    })
  }

  const prefix = `register-${role}`
  if (confirmSent) {
    return (
      <div className="rounded-xl border border-[#DDD4FF] bg-[#F7F4FF] p-5 text-sm text-[#4B3BA8]" role="status">
        <div className="font-semibold text-[#111827]">Check your inbox</div>
        <p className="mt-1">
          We sent a confirmation link to <span className="font-medium">{email.trim()}</span>. Open it to activate your account, then sign in.
        </p>
      </div>
    )
  }
  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      <div>
        <label htmlFor={`${prefix}-email`} className={AUTH_LABEL_CLASS}>
          Email
        </label>
        <input
          id={`${prefix}-email`}
          type="email"
          required
          autoComplete="email"
          placeholder="john@company.com"
          className={AUTH_INPUT_CLASS}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-password`} className={AUTH_LABEL_CLASS}>
          Password
        </label>
        <div className="relative">
          <input
            id={`${prefix}-password`}
            type={show ? 'text' : 'password'}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className={`${AUTH_INPUT_CLASS} pr-11`}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#9B9A97] hover:text-[#37352F] hover:bg-[#F7F6F3] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((s) => !s)}
          >
            {show ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
      </div>
      {error && <AuthError>{error}</AuthError>}
      <button type="submit" className={AUTH_SUBMIT_CLASS} style={AUTH_SUBMIT_STYLE} disabled={blocked} aria-busy={pending}>
        {pending && <LoaderIcon />}
        {cooldown > 0 ? `Try again in ${cooldown}s` : 'Create account'}
      </button>
    </form>
  )
}

function SignupButtons({ role, dark }: { role: Role; dark: boolean }) {
  const [emailOpen, setEmailOpen] = useState(false)
  const [oauthError, setOauthError] = useState<string | null>(null)
  return (
    <>
      <div className="space-y-3">
        <OAuthButton provider="linkedin_oidc" role={role} label="Sign up with LinkedIn" onError={setOauthError} />
        <OAuthButton provider="google" role={role} label="Sign up with Google" onError={setOauthError} />
        {oauthError && <AuthError>{oauthError}</AuthError>}
      </div>
      {emailOpen ? (
        <EmailSignupForm role={role} />
      ) : (
        <button type="button" className={EMAIL_TOGGLE_CLASS} style={OAUTH_BUTTON_STYLE} onClick={() => setEmailOpen(true)}>
          <MailIcon />
          <span>Sign up with email</span>
        </button>
      )}
      <p className={`text-xs text-center ${dark ? 'text-[#64748b]' : 'text-[#6B7280]'}`}>
        Already have an account?{' '}
        <Link to="/login?reauth=1" className={`text-[#7C5CFC] ${dark ? 'font-semibold' : 'font-medium'}`}>
          Sign in here
        </Link>
      </p>
    </>
  )
}

/** /register — choose a role. */
function RolePicker() {
  const t = useT()
  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <AuthHeader />
          <h1 className="text-2xl font-bold text-[#111827]">{t({ en: 'Create your account', fr: 'Créez votre compte' })}</h1>
          <p className="text-sm text-[#6B7280] mt-1 mb-6">First, who are you here as?</p>
          <div className="space-y-3">
            <Link to="/register?role=influencer" className="block rounded-xl border border-[#D1D5DB] p-5 transition-colors hover:border-[#7C5CFC] hover:bg-[#F7F4FF]">
              <div className="text-base font-semibold text-[#111827]">I'm a creator</div>
              <p className="text-sm text-[#6B7280] mt-1">Get paid to create LinkedIn content for B2B brands you actually use.</p>
            </Link>
            <Link to="/register?role=saas" className="block rounded-xl border border-[#D1D5DB] p-5 transition-colors hover:border-[#7C5CFC] hover:bg-[#F7F4FF]">
              <div className="text-base font-semibold text-[#111827]">I'm a brand</div>
              <p className="text-sm text-[#6B7280] mt-1">Find creators, launch campaigns, and trace real pipeline back to each post.</p>
            </Link>
          </div>
          <p className="text-xs text-center text-[#6B7280] mt-6">
            Already have an account?{' '}
            <Link to="/login?reauth=1" className="text-[#7C5CFC] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <AuthSidePanel title="One platform. Two sides.">
        <p className="text-violet-100">
          Creators get paid to post. B2B brands get real pipeline. Pick where you fit and we'll set the rest up in a couple of minutes.
        </p>
      </AuthSidePanel>
    </div>
  )
}

/** /register?role=saas — brand. */
function BrandSignup() {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex-1 flex items-start sm:items-center justify-center p-6 sm:p-10 bg-white min-w-0 overflow-y-auto">
        <div className="w-full max-w-md">
          <AuthHeader className="flex items-center justify-between gap-4 mb-8" wrapLocale />
          <div className="space-y-4">
            <h1 className="text-[1.75rem] font-extrabold tracking-tight text-[#0f172a]">Join NaanoX</h1>
            <p className="text-[0.95rem] font-bold text-[#7C5CFC]">Creators. Brands. Results.</p>
            <p className="text-sm text-[#64748b]">The #1 platform to run LinkedIn creator campaigns that drive real business.</p>
            <SignupButtons role="saas" dark />
          </div>
        </div>
      </div>
      <AuthSidePanel title="Creators. Brands. Results.">
        <p className="text-violet-100 mb-8">Run LinkedIn creator campaigns that drive real business - discover creators, track performance, pay in one click.</p>
        <div className="text-sm text-violet-200">Built for B2B marketing teams</div>
      </AuthSidePanel>
    </div>
  )
}

/** /register?role=influencer — creator, "Step 1 of 4" with the Marketplace card preview. */
function CreatorSignup() {
  return (
    <div style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }} className="flex h-[100dvh] max-h-full min-h-0 overflow-hidden">
      <div className="flex h-full min-h-0 flex-1 items-start justify-center overflow-y-auto overscroll-y-contain bg-white px-8 xl:px-10 pb-10 pt-[clamp(1.75rem,7dvh,4.5rem)] sm:pb-12">
        <div className="w-full max-w-md pb-4">
          <AuthHeader />
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#7C5CFC]">Step 1 of 4</div>
            <h1 className="text-2xl font-bold text-[#111827]">Join NaanoX</h1>
            <p className="text-sm text-[#6B7280]">Get paid to create LinkedIn content for B2B brands you actually use.</p>
            <SignupButtons role="influencer" dark={false} />
          </div>
        </div>
      </div>
      <div className="hidden h-full min-h-0 flex-1 items-start justify-center bg-[radial-gradient(circle_at_top_left,#FFFFFF_0%,#F1F6FF_46%,#EEF0FF_100%)] px-8 pb-10 pt-[clamp(1.75rem,7dvh,4.5rem)] xl:px-12 lg:flex overflow-hidden">
        <div className="flex w-full max-w-[560px] flex-col items-center ">
          <div className="mb-4 max-w-[500px] text-center xl:mb-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#7C5CFC]">Your Marketplace card</div>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#111827] xl:text-3xl">Build a card brands can trust.</h2>
            <p className="mt-2 text-sm leading-6 text-[#596273]">It updates live with your profile, analytics, positioning and price.</p>
          </div>
          <MarketplaceCard />
        </div>
      </div>
    </div>
  )
}

/**
 * /register (recon/html/app/register.dom.html). The `?role=` query param
 * drives which step is shown. Steps 2–4 of the creator flow are UNKNOWN.
 */
export default function Register() {
  useAppShell()
  const [params] = useSearchParams()
  const role = params.get('role')
  return (
    <>
      <div className="bg-noise" />
      {role === 'saas' ? <BrandSignup /> : role === 'influencer' ? <CreatorSignup /> : <RolePicker />}
    </>
  )
}
