import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'
import type { ProfileRow, UserRole } from './database.types'

export const PENDING_ROLE_KEY = 'naano:pending-role'

type AuthContextValue = {
  /** true until the persisted session (if any) has been restored */
  loading: boolean
  session: Session | null
  user: User | null
  profile: ProfileRow | null
  /** Re-fetch the profile row (after onboarding, role choice, settings edits). */
  refreshProfile: () => Promise<ProfileRow | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  session: null,
  user: null,
  profile: null,
  refreshProfile: async () => null,
  signOut: async () => {},
})

async function fetchProfile(userId: string, attempts = 4): Promise<ProfileRow | null> {
  // The profile row is created by a database trigger right after signup; on a
  // brand-new account it can lag the session by a few hundred ms.
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) throw error
    if (data) return data as ProfileRow
    await new Promise((r) => setTimeout(r, 300 * (i + 1)))
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const userIdRef = useRef<string | null>(null)

  const loadProfile = useCallback(async (userId: string | null) => {
    if (!userId) {
      setProfile(null)
      return null
    }
    try {
      const p = await fetchProfile(userId)
      // Ignore stale results after a sign-out / account switch.
      if (userIdRef.current === userId) setProfile(p)
      return p
    } catch {
      if (userIdRef.current === userId) setProfile(null)
      return null
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (cancelled) return
        userIdRef.current = data.session?.user.id ?? null
        setSession(data.session)
        await loadProfile(userIdRef.current)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      const nextId = next?.user.id ?? null
      const changed = nextId !== userIdRef.current
      userIdRef.current = nextId
      setSession(next)
      if (event === 'SIGNED_OUT') setProfile(null)
      // Don't await Supabase calls inside the listener (supabase-js locks).
      if (changed || event === 'USER_UPDATED') setTimeout(() => void loadProfile(nextId), 0)
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const refreshProfile = useCallback(() => loadProfile(userIdRef.current), [loadProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    userIdRef.current = null
    setSession(null)
    setProfile(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ loading, session, user: session?.user ?? null, profile, refreshProfile, signOut }),
    [loading, session, profile, refreshProfile, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

/** Where a signed-in user lands. */
export function dashboardPath(role: UserRole | undefined | null): string {
  return role ? '/app' : '/dashboard'
}

export function safeRedirect(value: string | null | undefined, fallback = '/app'): string {
  if (!value) return fallback
  // Only same-origin absolute paths — never an external URL.
  if (!value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}

export function FullPageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-sm text-[#6B7280]" role="status" aria-live="polite">
      <span className="inline-block h-5 w-5 mr-3 rounded-full border-2 border-[#E5E7EB] border-t-[#2563eb] animate-spin" />
      {label}
    </div>
  )
}

/**
 * Wraps routes that need a signed-in user. Restores the session first, then
 * redirects to /login (keeping the intended destination) when there is none.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, session, profile } = useAuth()
  const location = useLocation()

  if (!isSupabaseConfigured) return <NotConfigured />
  if (loading) return <FullPageLoader />
  if (!session) {
    const redirectTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />
  }
  if (!profile) return <ProfilePending />

  const onboarding = location.pathname.startsWith('/app/onboarding')
  const chooseRole = location.pathname.startsWith('/app/choose-role')
  if (!profile.role_locked && !chooseRole) return <Navigate to="/app/choose-role" replace />
  if (profile.role_locked && !profile.onboarding_completed && !onboarding && !chooseRole) {
    return <Navigate to="/app/onboarding" replace />
  }
  return <>{children}</>
}

/** Restricts a route to one role. The role comes from the `profiles` row (RLS-protected), never from the client. */
export function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const { profile } = useAuth()
  if (profile && profile.role !== role) return <Navigate to="/app" replace />
  return <>{children}</>
}

/** Sends already-signed-in users away from /login and /register. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { loading, session, profile } = useAuth()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  // `?reauth=1` (used by the live site's "Sign in here" links) still shows the form.
  if (isSupabaseConfigured && !loading && session && profile && !params.get('reauth')) {
    return <Navigate to={safeRedirect(params.get('redirectTo'), dashboardPath(profile.role))} replace />
  }
  return <>{children}</>
}

/**
 * Signed in but no `profiles` row yet. Normally the trigger creates it within
 * a second; if it never shows up (migration not applied, RLS misconfigured)
 * explain instead of spinning forever.
 */
function ProfilePending() {
  const { refreshProfile, signOut } = useAuth()
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setStuck(true), 6000)
    const retry = window.setInterval(() => void refreshProfile(), 2000)
    return () => {
      window.clearTimeout(t)
      window.clearInterval(retry)
    }
  }, [refreshProfile])
  if (!stuck) return <FullPageLoader label="Preparing your account…" />
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-md w-full rounded-2xl border border-[#E9E9E7] p-8 shadow-lg">
        <img src="/logo.svg" alt="naano" className="h-7 mb-6" />
        <h1 className="text-xl font-bold text-[#111827]">We couldn't load your profile</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Your account exists but its profile row is missing. Make sure the SQL migration in <code>supabase/migrations</code> has been applied to this project, then reload.
        </p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={() => window.location.reload()} className="h-10 rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white cursor-pointer">
            Reload
          </button>
          <button type="button" onClick={() => void signOut()} className="h-10 rounded-xl border border-[#E5E7EB] px-4 text-sm font-semibold text-[#111827] cursor-pointer">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

function NotConfigured() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-md w-full rounded-2xl border border-[#E9E9E7] p-8 shadow-lg">
        <img src="/logo.svg" alt="naano" className="h-7 mb-6" />
        <h1 className="text-xl font-bold text-[#111827]">Supabase is not configured</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          The app needs the public project URL and anon key. Copy <code>.env.example</code> to <code>.env.local</code> for local development, or add
          <code> VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in Vercel → Settings → Environment Variables, then redeploy.
        </p>
      </div>
    </div>
  )
}
