import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { LocaleButton } from '@/components/shared/LocaleButton'
import { describeError, supabase } from '@/lib/supabase'
import { PENDING_ROLE_KEY } from '@/lib/auth'

/**
 * Shared pieces of the client-rendered "app shell" pages (/login, /register,
 * /login/forgot-password). Classes and inline styles are copied verbatim from
 * the captured DOM (recon/html/app/*.dom.html).
 */

export const DEFAULT_TITLE = 'Naano: B2B LinkedIn Creator Marketplace'

/** Dark body + document title, mirroring NotFound.tsx. */
export function useAppShell(title: string = DEFAULT_TITLE) {
  useEffect(() => {
    // The live app shell carries `bg-[#020408]` on <body>, but its computed
    // background is white (the page paints its own panels), so no dark flag here.
    document.title = title
  }, [title])
}

export const OAUTH_BUTTON_CLASS =
  'w-full h-12 rounded-xl text-[15px] font-semibold text-[#111827] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3'
export const OAUTH_BUTTON_STYLE: CSSProperties = { boxShadow: '0 2px 6px rgba(15,23,42,0.05)' }

export const AUTH_INPUT_CLASS =
  'w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 transition-all'
export const AUTH_LABEL_CLASS = 'block text-xs font-semibold text-[#5C5B57] uppercase tracking-wide mb-1.5 ml-1'
export const AUTH_SUBMIT_CLASS =
  'w-full h-11 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1d4ed8] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2'
export const AUTH_SUBMIT_STYLE: CSSProperties = { boxShadow: '0 4px 12px rgba(37,99,235,0.24)' }

/**
 * Inline error box. UNKNOWN on the live site (needs a failed backend call);
 * colours follow the site's own `tas-error` module rule (#fff1f2 / #fecdd3 / #be123c).
 */
export function AuthError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-[11px] border border-[#fecdd3] bg-[#fff1f2] px-[13px] py-[11px] text-sm text-[#be123c]">
      {children}
    </p>
  )
}

export function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#0A66C2">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

export function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  )
}

type LucideProps = { className?: string; size?: number }

function Lucide({ className, size = 24, children }: LucideProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function MailIcon({ className = 'lucide lucide-mail w-5 h-5 text-[#6B7280]' }: LucideProps) {
  return (
    <Lucide className={className}>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </Lucide>
  )
}

export function EyeOffIcon({ className = 'lucide lucide-eye-off w-5 h-5' }: LucideProps) {
  return (
    <Lucide className={className}>
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </Lucide>
  )
}

export function EyeIcon({ className = 'lucide lucide-eye w-5 h-5' }: LucideProps) {
  return (
    <Lucide className={className}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </Lucide>
  )
}

/** lucide `loader-circle` — used for the pending state (UNKNOWN on the live site). */
export function LoaderIcon({ className = 'lucide lucide-loader-circle w-4 h-4 animate-spin' }: LucideProps) {
  return (
    <Lucide className={className}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </Lucide>
  )
}

/**
 * OAuth entry button — starts a Supabase OAuth flow (the provider must be
 * enabled in the Supabase dashboard). The chosen role is remembered locally
 * and applied once on `/auth/callback` through the `choose_role` RPC.
 */
export function OAuthButton({
  provider,
  role,
  label,
  onError,
}: {
  provider: 'linkedin_oidc' | 'google'
  role?: 'saas' | 'influencer'
  label: string
  onError?: (message: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const start = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      if (role) localStorage.setItem(PENDING_ROLE_KEY, role === 'saas' ? 'company' : 'creator')
      else localStorage.removeItem(PENDING_ROLE_KEY)
    } catch {
      /* storage unavailable */
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setBusy(false)
      onError?.(describeError(error))
    }
  }
  return (
    <a
      href={`/auth/callback?provider=${provider}`}
      aria-disabled={busy}
      className={`${OAUTH_BUTTON_CLASS}${busy ? ' opacity-60 pointer-events-none' : ''}`}
      style={OAUTH_BUTTON_STYLE}
      onClick={(e) => void start(e)}
    >
      {provider === 'linkedin_oidc' ? <LinkedInIcon /> : <GoogleIcon />}
      <span>{label}</span>
    </a>
  )
}

/** Logo + locale switch row used at the top of the form column. */
export function AuthHeader({ className = 'flex items-center justify-between mb-8', wrapLocale = false }: { className?: string; wrapLocale?: boolean }) {
  return (
    <div className={className}>
      <img src="/logo.svg" alt="naano" className="h-7" />
      {wrapLocale ? (
        <div className="flex items-center gap-3">
          <LocaleButton />
        </div>
      ) : (
        <LocaleButton />
      )}
    </div>
  )
}

/** Blue right-hand panel (lg+) of the two-column auth layout. */
export function AuthSidePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center p-12 text-white" style={{ background: '#2563eb' }}>
      <div className="max-w-sm">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )
}
