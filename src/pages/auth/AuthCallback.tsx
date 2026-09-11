import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FullPageLoader, PENDING_ROLE_KEY, useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import type { UserRole } from '@/lib/database.types'
import { AuthError } from '@/components/auth/AuthShell'

/**
 * /auth/callback — landing point for OAuth and email-confirmation links.
 * supabase-js picks the session up from the URL (detectSessionInUrl); if a
 * role was chosen before an OAuth redirect it is applied once via choose_role.
 */
export default function AuthCallback() {
  const { loading, session, profile, refreshProfile } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (loading || !session || !profile || applied) return
    let pending: UserRole | null = null
    try {
      const v = localStorage.getItem(PENDING_ROLE_KEY)
      pending = v === 'company' || v === 'creator' ? v : null
      localStorage.removeItem(PENDING_ROLE_KEY)
    } catch {
      /* ignore */
    }
    if (!pending || profile.role_locked) {
      setApplied(true)
      return
    }
    supabase
      .rpc('choose_role', { p_role: pending })
      .then(async ({ error: err }) => {
        if (err) setError(describeError(err))
        await refreshProfile()
        setApplied(true)
      })
  }, [loading, session, profile, applied, refreshProfile])

  useEffect(() => {
    if (loading) return
    // Give supabase-js a moment to exchange the URL hash/code; if no session
    // shows up, fall back to the sign-in page with the provider error (if any).
    const t = window.setTimeout(() => {
      if (!session) {
        const params = new URLSearchParams(window.location.search + window.location.hash.replace('#', '&'))
        setError(params.get('error_description') ?? 'We could not complete sign-in. Please try again.')
      }
    }, 4000)
    return () => window.clearTimeout(t)
  }, [loading, session])

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full max-w-md space-y-4">
          <AuthError>{error}</AuthError>
          <a href="/login" className="text-sm text-[#2563eb] font-medium">
            ← Back to sign in
          </a>
        </div>
      </div>
    )
  }
  if (session && profile && applied) return <Navigate to="/app" replace />
  return <FullPageLoader label="Signing you in…" />
}
