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

/** Normalises Supabase/PostgREST errors into user-facing copy. */
export function describeError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) return fallback
  const e = error as { message?: string; code?: string; status?: number }
  const msg = e.message ?? ''
  if (/Invalid login credentials/i.test(msg)) return 'Invalid email or password.'
  if (/Email not confirmed/i.test(msg)) return 'Please confirm your email address before signing in.'
  if (/already registered|already exists|duplicate key/i.test(msg)) return 'An account with this email already exists.'
  if (/Password should be at least/i.test(msg)) return 'Password must be at least 8 characters.'
  if (/rate limit/i.test(msg)) return 'Too many attempts. Please wait a moment and try again.'
  if (/row-level security|permission denied|42501/i.test(msg + (e.code ?? ''))) return 'You do not have permission to do that.'
  if (/Failed to fetch|NetworkError|network/i.test(msg)) return 'Network error. Check your connection and try again.'
  if (/not configured/i.test(msg)) return msg
  return msg || fallback
}
