import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import type { CreatorRow } from './database.types'

/**
 * Tiny data-fetching hook: runs `fn` on mount and whenever `deps` change,
 * tracks loading/error, and exposes `reload`. Results from stale calls are
 * discarded.
 */
export function useQuery<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const seq = useRef(0)
  const run = useCallback(async () => {
    const id = ++seq.current
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      if (id === seq.current) setData(result)
    } catch (e) {
      if (id === seq.current) setError(e)
    } finally {
      if (id === seq.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(() => {
    void run()
  }, [run])
  return { data, error, loading, reload: run, setData }
}

/** Throws on PostgREST errors so callers can use try/catch. */
export function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw res.error
  return res.data as T
}

/* ------------------------------------------------------------------ */
/* Creator discovery                                                   */
/* ------------------------------------------------------------------ */

export type CreatorSort = 'relevance' | 'followers' | 'views' | 'price_asc' | 'price_desc' | 'engagement'

export type CreatorFilters = {
  q: string
  niches: string[]
  country: string
  minFollowers: number | null
  maxPrice: number | null // cents
  sort: CreatorSort
  page: number
  pageSize: number
  bookingOnly: boolean
}

export const DEFAULT_CREATOR_FILTERS: CreatorFilters = {
  q: '',
  niches: [],
  country: '',
  minFollowers: null,
  maxPrice: null,
  sort: 'relevance',
  page: 1,
  pageSize: 12,
  bookingOnly: false,
}

const CARD_COLUMNS =
  'id, slug, name, headline, position, bio, avatar_url, country, sectors, followers, median_views, engagement_rate, price_cents, accepting_bookings, linkedin_url'

export type CreatorCard = Pick<
  CreatorRow,
  'id' | 'slug' | 'name' | 'headline' | 'position' | 'bio' | 'avatar_url' | 'country' | 'sectors' | 'followers' | 'median_views' | 'engagement_rate' | 'price_cents' | 'accepting_bookings' | 'linkedin_url'
>

/** Server-side filtered, sorted and paginated creator search (uses the GIN indexes on `sectors` and `search`). */
export async function searchCreators(f: CreatorFilters): Promise<{ rows: CreatorCard[]; total: number }> {
  let q = supabase.from('creators').select(CARD_COLUMNS, { count: 'exact' }).eq('is_public', true)
  const term = f.q.trim()
  if (term) q = q.or(`name.ilike.%${escapeLike(term)}%,headline.ilike.%${escapeLike(term)}%`)
  if (f.niches.length) q = q.overlaps('sectors', f.niches)
  if (f.country) q = q.eq('country', f.country)
  if (f.minFollowers) q = q.gte('followers', f.minFollowers)
  if (f.maxPrice) q = q.lte('price_cents', f.maxPrice)
  if (f.bookingOnly) q = q.eq('accepting_bookings', true)
  switch (f.sort) {
    case 'followers':
      q = q.order('followers', { ascending: false, nullsFirst: false })
      break
    case 'views':
      q = q.order('median_views', { ascending: false, nullsFirst: false })
      break
    case 'price_asc':
      q = q.order('price_cents', { ascending: true, nullsFirst: false })
      break
    case 'price_desc':
      q = q.order('price_cents', { ascending: false, nullsFirst: false })
      break
    case 'engagement':
      q = q.order('engagement_rate', { ascending: false, nullsFirst: false })
      break
    default:
      // "relevance": creators with pricing + most reach first
      q = q.order('accepting_bookings', { ascending: false }).order('median_views', { ascending: false, nullsFirst: false })
  }
  q = q.order('id', { ascending: true })
  const from = (f.page - 1) * f.pageSize
  const { data, error, count } = await q.range(from, from + f.pageSize - 1)
  if (error) throw error
  return { rows: (data ?? []) as CreatorCard[], total: count ?? 0 }
}

function escapeLike(s: string) {
  return s.replace(/[%_,()]/g, (m) => `\\${m}`)
}

/** A naive "matching" score for the card bar (documented as a heuristic, not the live algorithm). */
export function matchingScore(c: CreatorCard, wanted: string[] = []): number {
  let score = 60
  if (c.accepting_bookings) score += 8
  if (c.price_cents) score += 6
  if ((c.median_views ?? 0) > 5000) score += 8
  else if ((c.median_views ?? 0) > 1000) score += 4
  if ((c.engagement_rate ?? 0) >= 3) score += 8
  else if ((c.engagement_rate ?? 0) >= 1) score += 4
  const overlap = wanted.filter((w) => c.sectors.includes(w)).length
  score += Math.min(10, overlap * 5)
  return Math.min(99, score)
}
