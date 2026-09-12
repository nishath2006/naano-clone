import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useT } from '@/lib/locale'
import { describeError, supabase } from '@/lib/supabase'
import { safeRedirect, useAuth } from '@/lib/auth'
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
  OAuthButton,
  useAppShell,
} from '@/components/auth/AuthShell'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * /login — client-rendered on naano.com (recon/html/app/login.dom.html).
 * Only the FR <h1> was observed ("Bon retour parmi nous"); every other FR
 * string is UNKNOWN and kept in English.
 */
export default function Login() {
  useAppShell()
  const t = useT()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { refreshProfile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { pending, cooldown, blocked, run, holdIfRateLimited } = useAuthSubmit()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (blocked) return
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.') // UNKNOWN copy
      return
    }
    if (!password) {
      setError('Please enter your password.') // UNKNOWN copy
      return
    }
    setError(null)
    void run(async () => {
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (signInError) {
          holdIfRateLimited(signInError)
          setError(describeError(signInError))
          return
        }
        await refreshProfile()
        // The role-based landing is decided server-side (profiles.role via RLS)
        // inside /app; here we only honour a same-origin redirectTo.
        navigate(safeRedirect(params.get('redirectTo'), '/app'), { replace: true })
      } catch (err) {
        holdIfRateLimited(err)
        setError(describeError(err))
      }
    })
  }

  return (
    <>
      <div className="bg-noise" />
      <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <AuthHeader />
            <h1 className="text-2xl font-bold text-[#111827]">{t({ en: 'Welcome back', fr: 'Bon retour parmi nous' })}</h1>
            <p className="text-sm text-[#6B7280] mt-1 mb-6">Sign in to your account</p>
            <form className="space-y-5" noValidate onSubmit={onSubmit}>
              <div className="space-y-3">
                <OAuthButton provider="linkedin_oidc" label="Continue with LinkedIn" onError={setError} />
                <OAuthButton provider="google" label="Continue with Google" onError={setError} />
              </div>
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#E9E9E7]" />
                  <span className="text-[11px] text-[#9B9A97] font-medium uppercase tracking-wide">Or continue with email</span>
                  <span className="h-px flex-1 bg-[#E9E9E7]" />
                </div>
                <div>
                  <label htmlFor="login-email" className={AUTH_LABEL_CLASS}>
                    Email
                  </label>
                  <input
                    id="login-email"
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
                  <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-[#5C5B57] uppercase tracking-wide">
                      Password
                    </label>
                    <Link
                      className="text-xs text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer font-medium"
                      to="/login/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={show ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`${AUTH_INPUT_CLASS} pr-11`}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={pending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#9B9A97] hover:text-[#37352F] hover:bg-[#F7F6F3] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1652F0]/20"
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
                  {cooldown > 0 ? `Try again in ${cooldown}s` : 'Sign in'}
                </button>
              </div>
            </form>
            <p className="mt-6 text-center text-xs text-[#6B7280]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#2563eb] font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <AuthSidePanel title="Welcome back.">
          <p className="text-blue-100">Sign in to manage your campaigns, creators and payouts, all in one place.</p>
        </AuthSidePanel>
      </div>
    </>
  )
}
