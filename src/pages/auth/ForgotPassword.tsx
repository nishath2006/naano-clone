import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LocaleButton } from '@/components/shared/LocaleButton'
import { AuthError, LoaderIcon, useAppShell } from '@/components/auth/AuthShell'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * /login/forgot-password (recon/html/app/forgot-password.dom.html).
 * No FR capture exists → English copy for both locales.
 */
export default function ForgotPassword() {
  useAppShell()
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pending) return
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.') // UNKNOWN copy
      return
    }
    setError(null)
    setPending(true)
    // No backend: the live site would email a 6-digit code and show a code
    // step (the CSS module has `tas-code` styles for it) — UNKNOWN markup.
    window.setTimeout(() => {
      setPending(false)
      setError('We could not send a recovery code. Please try again.') // UNKNOWN copy
    }, 900)
  }

  return (
    <>
      <div className="bg-noise" />
      <div className="min-h-screen bg-white flex items-center justify-center p-6" style={{ fontFamily: 'var(--font-jakarta)' }}>
        <div className="w-full max-w-md bg-white border border-[#E9E9E7] rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <Link className="flex items-center gap-2 group cursor-pointer" to="/">
              <img src="/logo.svg" alt="naano" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold tracking-tight text-[#37352F]">naano</span>
            </Link>
            <LocaleButton />
          </div>
          <h1 className="text-2xl font-semibold text-[#37352F] text-center mb-2">Reset your password</h1>
          <p className="text-[#787774] text-center text-sm mb-8">
            Enter your email and we'll send you a 6-digit code to set a new password.
          </p>
          <form className="space-y-4" action="/api/auth/password-recovery" method="post" noValidate onSubmit={onSubmit}>
            <input type="hidden" name="operation" value="request" />
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/10 transition-all"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
              />
            </div>
            {error && <AuthError>{error}</AuthError>}
            <button
              type="submit"
              className="w-full h-11 mt-2 bg-[#0F172A] text-white rounded-xl text-sm font-medium hover:bg-[#1E293B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={pending}
            >
              {pending && <LoaderIcon />}
              Send recovery code
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link className="text-sm text-[#1652F0] hover:text-[#1652F0] transition-colors font-medium cursor-pointer" to="/login">
              ← Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
