import { useCallback, useEffect, useRef, useState } from 'react'
import { rateLimitSeconds } from './supabase'

/**
 * Guards an auth form against duplicate requests:
 * - an in-flight ref rejects a second submit even before React re-renders
 *   with `pending` (double-click, Enter + click, double form event);
 * - after a rate-limit error the form is held for a short cooldown so it
 *   cannot immediately retry against Supabase Auth.
 */
export function useAuthSubmit() {
  const inFlight = useRef(false)
  const [pending, setPending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = window.setInterval(() => setCooldown((c) => (c > 1 ? c - 1 : 0)), 1000)
    return () => window.clearInterval(t)
  }, [cooldown])

  /** Runs `fn` once; returns false when a submit was ignored. */
  const run = useCallback(
    async (fn: () => Promise<void>): Promise<boolean> => {
      if (inFlight.current || cooldown > 0) return false
      inFlight.current = true
      setPending(true)
      try {
        await fn()
        return true
      } finally {
        inFlight.current = false
        setPending(false)
      }
    },
    [cooldown],
  )

  /** Starts a cooldown when the error is a rate limit; returns the seconds applied. */
  const holdIfRateLimited = useCallback((error: unknown) => {
    const s = rateLimitSeconds(error)
    if (s > 0) setCooldown(s)
    return s
  }, [])

  return { pending, cooldown, blocked: pending || cooldown > 0, run, holdIfRateLimited }
}
