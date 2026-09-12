import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Single hosted-Supabase client for the browser.
 *
 * Configuration comes exclusively from environment variables
 * (`.env.local` for local development, Vercel → Environment Variables in
 * production). Only the public anon/publishable key is ever used here; the
 * service-role key must never reach the browser.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

function createSupabase(): SupabaseClient<Database> {
  if (!url || !anonKey) {
    // A stub that fails loudly at call time keeps the marketing site usable
    // when the app has not been configured yet.
    return new Proxy({} as SupabaseClient<Database>, {
      get() {
        throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).')
      },
    })
  }
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'naano-auth',
    },
  })
}

export const supabase = createSupabase()

type ErrorLike = { message?: string; code?: string; status?: number }

/**
 * Supabase Auth error codes (AuthApiError.code) mapped to user-facing copy.
 * See https://supabase.com/docs/guides/auth/debugging/error-codes
 */
const AUTH_CODE_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Invalid email or password.',
  email_not_confirmed: 'Please confirm your email address before signing in. Check your inbox for the confirmation link.',
  user_already_exists: 'An account with this email already exists. Sign in instead.',
  email_exists: 'An account with this email already exists. Sign in instead.',
  weak_password: 'Password must be at least 8 characters.',
  same_password: 'The new password must be different from the current one.',
  otp_expired: 'That code or link has expired. Request a new one.',
  otp_disabled: 'Code sign-in is not enabled on this project.',
  validation_failed: 'Please check the email address and try again.',
  email_address_invalid: 'Please enter a valid email address.',
  signup_disabled: 'New sign-ups are currently disabled.',
  email_provider_disabled: 'Email sign-up is disabled on this project.',
  provider_disabled: 'This sign-in provider is not enabled on the project yet. Use email and password instead.',
  unexpected_failure: 'Something went wrong on our side. Please try again in a moment.',
  over_email_send_rate_limit:
    "The project's hourly limit for sending emails has been reached, so a confirmation email can't go out right now. Wait about an hour and try again — or sign in if you already confirmed this address.",
  over_request_rate_limit: 'Too many sign-in attempts from this network. Please wait a few minutes and try again.',
  over_sms_send_rate_limit: 'Too many verification messages were sent. Please wait a while before trying again.',
}

/**
 * Seconds the UI should hold off before allowing another attempt, or 0 when
 * the error is not a rate limit. Supabase does not send Retry-After, so this
 * is a client-side courtesy delay that stops the form from hammering Auth.
 */
export function rateLimitSeconds(error: unknown): number {
  if (!error) return 0
  const e = error as ErrorLike
  if (e.code === 'over_email_send_rate_limit') return 60
  if (e.code === 'over_request_rate_limit' || e.code === 'over_sms_send_rate_limit') return 60
  if (e.status === 429 || /rate limit/i.test(e.message ?? '')) return 30
  return 0
}

/** Normalises Supabase Auth / PostgREST errors into user-facing copy. */
export function describeError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) return fallback
  const e = error as ErrorLike
  const msg = e.message ?? ''
  if (e.code && AUTH_CODE_MESSAGES[e.code]) return AUTH_CODE_MESSAGES[e.code]
  if (/Invalid login credentials/i.test(msg)) return AUTH_CODE_MESSAGES.invalid_credentials
  if (/Email not confirmed/i.test(msg)) return AUTH_CODE_MESSAGES.email_not_confirmed
  if (/already registered|already exists|duplicate key/i.test(msg)) return AUTH_CODE_MESSAGES.user_already_exists
  if (/Password should be at least/i.test(msg)) return AUTH_CODE_MESSAGES.weak_password
  if (/email rate limit/i.test(msg)) return AUTH_CODE_MESSAGES.over_email_send_rate_limit
  if (e.status === 429 || /rate limit/i.test(msg)) return AUTH_CODE_MESSAGES.over_request_rate_limit
  if (/row-level security|permission denied|42501/i.test(msg + (e.code ?? ''))) return 'You do not have permission to do that.'
  if (/Failed to fetch|NetworkError|network/i.test(msg)) return 'Network error. Check your connection and try again.'
  if (/not configured/i.test(msg)) return msg
  return msg || fallback
}
