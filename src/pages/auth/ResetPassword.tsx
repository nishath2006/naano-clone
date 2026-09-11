import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LocaleButton } from '@/components/shared/LocaleButton'
import { AuthError, EyeIcon, EyeOffIcon, LoaderIcon, useAppShell } from '@/components/auth/AuthShell'
import { describeError, supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

/** /auth/reset-password — target of the recovery link in the Supabase email. */
export default function ResetPassword() {
  useAppShell()
  const navigate = useNavigate()
  const { loading, session } = useAuth()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [noSession, setNoSession] = useState(false)

  useEffect(() => {
    if (loading) return
    const t = window.setTimeout(() => setNoSession(!session), 3000)
    return () => window.clearTimeout(t)
  }, [loading, session])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pending) return
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
        setDone(true)
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
              <img src="/logo.svg" alt="naano" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold tracking-tight text-[#37352F]">naano</span>
            </Link>
            <LocaleButton />
          </div>
          {done ? (
            <div className="text-center" role="status">
              <h1 className="text-2xl font-semibold text-[#37352F] mb-2">Password updated</h1>
              <p className="text-[#787774] text-sm">Taking you to your dashboard…</p>
            </div>
          ) : session ? (
            <>
              <h1 className="text-2xl font-semibold text-[#37352F] text-center mb-2">Choose a new password</h1>
              <p className="text-[#787774] text-center text-sm mb-8">At least 8 characters.</p>
              <form className="space-y-4" noValidate onSubmit={(e) => void onSubmit(e)}>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    aria-label="New password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/10 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={pending}
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
                {error && <AuthError>{error}</AuthError>}
                <button
                  type="submit"
                  className="w-full h-11 mt-2 bg-[#0F172A] text-white rounded-xl text-sm font-medium hover:bg-[#1E293B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={pending}
                >
                  {pending && <LoaderIcon />}
                  Update password
                </button>
              </form>
            </>
          ) : noSession ? (
            <div className="space-y-4">
              <AuthError>This recovery link is invalid or has expired. Request a new one.</AuthError>
              <Link to="/login/forgot-password" className="block text-center text-sm text-[#1652F0] font-medium">
                Request a new code
              </Link>
            </div>
          ) : (
            <p className="text-center text-sm text-[#787774]">Verifying your link…</p>
          )}
        </div>
      </div>
    </>
  )
}
