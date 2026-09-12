import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LocaleButton } from '@/components/shared/LocaleButton'
import { AuthError, EyeIcon, EyeOffIcon, LoaderIcon, useAppShell } from '@/components/auth/AuthShell'
import { describeError, supabase } from '@/lib/supabase'
import { useAuthSubmit } from '@/lib/useAuthSubmit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INPUT_CLASS =
  'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all'
const SUBMIT_CLASS =
  'w-full h-11 mt-2 bg-[#0F172A] text-white rounded-xl text-sm font-medium hover:bg-[#1E293B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'

type Step = 'request' | 'code' | 'password' | 'done'

/**
 * /login/forgot-password (recon/html/app/forgot-password.dom.html).
 * Uses Supabase password recovery. The email contains a link (handled on
 * /auth/reset-password) and, when the project's "Reset password" template
 * includes `{{ .Token }}`, the 6-digit code that this page verifies.
 */
export default function ForgotPassword() {
  useAppShell()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { pending, cooldown, blocked, run, holdIfRateLimited } = useAuthSubmit()
  const [pendingLocal, setPending] = useState(false)
  const busy = pending || pendingLocal

  const request = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (blocked) return
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.') // UNKNOWN copy
      return
    }
    setError(null)
    // Sends an email: guarded against duplicate submits and rate-limit retries.
    void run(async () => {
      try {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (err) {
          holdIfRateLimited(err)
          setError(describeError(err))
        } else setStep('code')
      } catch (err) {
        holdIfRateLimited(err)
        setError(describeError(err))
      }
    })
  }

  const verify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit code from the email.')
      return
    }
    setError(null)
    setPending(true)
    try {
      const { error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'recovery' })
      if (err) setError(describeError(err, 'That code is invalid or has expired.'))
      else setStep('password')
    } catch (err) {
      setError(describeError(err))
    } finally {
      setPending(false)
    }
  }

  const update = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError(null)
    setPending(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) setError(describeError(err))
      else {
        setStep('done')
        window.setTimeout(() => navigate('/app', { replace: true }), 1200)
      }
    } catch (err) {
      setError(describeError(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <div className="bg-noise" />
      <div className="min-h-screen bg-white flex items-center justify-center p-6" style={{ fontFamily: 'var(--font-jakarta)' }}>
        <div className="w-full max-w-md bg-white border border-[#E9E9E7] rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <Link className="flex items-center gap-2 group cursor-pointer" to="/">
              <img src="/logo.svg" alt="NaanoX" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold tracking-tight text-[#37352F]">naano<span style={{ color: '#7C5CFC' }}>X</span></span>
            </Link>
            <LocaleButton />
          </div>

          {step === 'request' && (
            <>
              <h1 className="text-2xl font-semibold text-[#37352F] text-center mb-2">Reset your password</h1>
              <p className="text-[#787774] text-center text-sm mb-8">
                Enter your email and we'll send you a 6-digit code to set a new password.
              </p>
              <form className="space-y-4" noValidate onSubmit={request}>
                <div>
                  <label htmlFor="forgot-password-email" className="block text-xs font-medium text-[#475569] mb-1.5 ml-1">
                    Email
                  </label>
                  <input
                    id="forgot-password-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="john@company.com"
                    className={INPUT_CLASS}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={busy}
                  />
                </div>
                {error && <AuthError>{error}</AuthError>}
                <button type="submit" className={SUBMIT_CLASS} disabled={blocked} aria-busy={pending}>
                  {pending && <LoaderIcon />}
                  {cooldown > 0 ? `Try again in ${cooldown}s` : 'Send recovery code'}
                </button>
              </form>
            </>
          )}

          {step === 'code' && (
            <>
              <h1 className="text-2xl font-semibold text-[#37352F] text-center mb-2">Check your email</h1>
              <p className="text-[#787774] text-center text-sm mb-8">
                We sent a message to <span className="font-medium text-[#37352F]">{email.trim()}</span>. Enter the 6-digit code below, or open the link in the email.
              </p>
              <form className="space-y-4" noValidate onSubmit={(e) => void verify(e)}>
                <div>
                  <label htmlFor="forgot-password-code" className="block text-xs font-medium text-[#475569] mb-1.5 ml-1">
                    Recovery code
                  </label>
                  <input
                    id="forgot-password-code"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="123456"
                    className={`${INPUT_CLASS} tracking-[0.3em] text-center text-lg`}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    disabled={busy}
                  />
                </div>
                {error && <AuthError>{error}</AuthError>}
                <button type="submit" className={SUBMIT_CLASS} disabled={busy}>
                  {busy && <LoaderIcon />}
                  Verify code
                </button>
                <button
                  type="button"
                  className="w-full text-xs text-[#787774] hover:text-[#37352F] transition-colors cursor-pointer"
                  onClick={() => {
                    setStep('request')
                    setCode('')
                    setError(null)
                  }}
                >
                  Use a different email
                </button>
              </form>
            </>
          )}

          {step === 'password' && (
            <>
              <h1 className="text-2xl font-semibold text-[#37352F] text-center mb-2">Choose a new password</h1>
              <p className="text-[#787774] text-center text-sm mb-8">At least 8 characters.</p>
              <form className="space-y-4" noValidate onSubmit={(e) => void update(e)}>
                <div>
                  <label htmlFor="forgot-password-new" className="block text-xs font-medium text-[#475569] mb-1.5 ml-1">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="forgot-password-new"
                      type={show ? 'text' : 'password'}
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`${INPUT_CLASS} pr-11`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={busy}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#9B9A97] hover:text-[#37352F] cursor-pointer"
                      aria-label={show ? 'Hide password' : 'Show password'}
                      onClick={() => setShow((s) => !s)}
                    >
                      {show ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>
                {error && <AuthError>{error}</AuthError>}
                <button type="submit" className={SUBMIT_CLASS} disabled={busy}>
                  {busy && <LoaderIcon />}
                  Update password
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center" role="status">
              <h1 className="text-2xl font-semibold text-[#37352F] mb-2">Password updated</h1>
              <p className="text-[#787774] text-sm">Taking you to your dashboard…</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link className="text-sm text-[#7C5CFC] hover:text-[#7C5CFC] transition-colors font-medium cursor-pointer" to="/login">
              ← Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
