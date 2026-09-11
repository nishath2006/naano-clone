import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { describeError } from '@/lib/supabase'
import { DEFAULT_CREATOR_FILTERS, searchCreators, useQuery, type CreatorFilters, type CreatorSort } from '@/lib/queries'
import { useBookmarks, useCompany } from '@/lib/useCompany'
import { COUNTRIES, NICHES } from '@/lib/format'
import { Button, ChipSelect, EmptyState, ErrorBanner, Input, PageHeader, Pagination, Select, Skeleton, useToast } from '@/components/app/ui'
import { SearchIcon, StoreIcon } from '@/components/app/icons'
import { CreatorCardView } from '@/components/app/CreatorCardView'
import { BookCreatorModal } from '@/components/app/BookCreatorModal'

const SORTS: { value: CreatorSort; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'followers', label: 'Most followers' },
  { value: 'views', label: 'Most views' },
  { value: 'engagement', label: 'Highest engagement' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
]

function readFilters(sp: URLSearchParams): CreatorFilters {
  return {
    ...DEFAULT_CREATOR_FILTERS,
    q: sp.get('q') ?? '',
    niches: sp.getAll('niche'),
    country: sp.get('country') ?? '',
    minFollowers: sp.get('min') ? Number(sp.get('min')) : null,
    maxPrice: sp.get('max') ? Number(sp.get('max')) * 100 : null,
    sort: (sp.get('sort') as CreatorSort) || 'relevance',
    page: Math.max(1, Number(sp.get('page') ?? 1)),
    bookingOnly: sp.get('booking') === '1',
  }
}

function writeFilters(f: CreatorFilters): URLSearchParams {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  f.niches.forEach((n) => sp.append('niche', n))
  if (f.country) sp.set('country', f.country)
  if (f.minFollowers) sp.set('min', String(f.minFollowers))
  if (f.maxPrice) sp.set('max', String(f.maxPrice / 100))
  if (f.sort !== 'relevance') sp.set('sort', f.sort)
  if (f.page > 1) sp.set('page', String(f.page))
  if (f.bookingOnly) sp.set('booking', '1')
  return sp
}

/** /app/marketplace — creator discovery with server-side search, filters, sort and pagination. */
export default function Marketplace() {
  const [sp, setSp] = useSearchParams()
  const filters = useMemo(() => readFilters(sp), [sp])
  const [q, setQ] = useState(filters.q)
  const [showFilters, setShowFilters] = useState(filters.niches.length > 0 || !!filters.country || !!filters.minFollowers || !!filters.maxPrice)
  const company = useCompany()
  const { bookmarks, toggle } = useBookmarks(company.data?.id)
  const toast = useToast()
  const [booking, setBooking] = useState<{ id: string; name: string; price_cents: number | null } | null>(null)

  const results = useQuery(() => searchCreators(filters), [JSON.stringify(filters)])

  useEffect(() => setQ(filters.q), [filters.q])

  const update = (patch: Partial<CreatorFilters>, resetPage = true) => setSp(writeFilters({ ...filters, ...patch, page: resetPage ? 1 : (patch.page ?? filters.page) }))

  const onBookmark = async (id: string) => {
    try {
      await toggle(id)
    } catch (e) {
      toast.push('error', describeError(e))
    }
  }

  return (
    <>
      <PageHeader title="Marketplace" subtitle="Vetted LinkedIn creators with fixed per-post pricing. Book directly or publish a campaign and let them apply." />

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          update({ q })
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" width={18} height={18} />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or headline…" className="pl-10" aria-label="Search creators" />
        </div>
        <Select value={filters.sort} onChange={(e) => update({ sort: e.target.value as CreatorSort })} aria-label="Sort" className="sm:w-52">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <Button variant="secondary" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
          Filters{filters.niches.length + (filters.country ? 1 : 0) + (filters.minFollowers ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.bookingOnly ? 1 : 0) > 0 ? ' •' : ''}
        </Button>
        <Button type="submit">Search</Button>
      </form>

      {showFilters && (
        <div className="mt-3 rounded-2xl border border-[#E9EBF0] bg-white p-4 space-y-4">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Niches</div>
            <ChipSelect options={NICHES.slice(0, 18)} value={filters.niches} onChange={(v) => update({ niches: v })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Select value={filters.country} onChange={(e) => update({ country: e.target.value })} aria-label="Country">
              <option value="">Any country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select value={filters.minFollowers ?? ''} onChange={(e) => update({ minFollowers: e.target.value ? Number(e.target.value) : null })} aria-label="Minimum followers">
              <option value="">Any audience size</option>
              <option value="1000">1K+ followers</option>
              <option value="5000">5K+ followers</option>
              <option value="10000">10K+ followers</option>
              <option value="25000">25K+ followers</option>
              <option value="50000">50K+ followers</option>
            </Select>
            <Select value={filters.maxPrice ? filters.maxPrice / 100 : ''} onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) * 100 : null })} aria-label="Maximum price">
              <option value="">Any price</option>
              <option value="50">Up to €50</option>
              <option value="100">Up to €100</option>
              <option value="250">Up to €250</option>
              <option value="500">Up to €500</option>
              <option value="1000">Up to €1,000</option>
            </Select>
            <label className="flex h-10 items-center gap-2 text-sm text-[#4B5563]">
              <input type="checkbox" checked={filters.bookingOnly} onChange={(e) => update({ bookingOnly: e.target.checked })} className="h-4 w-4 accent-[#2563eb]" />
              Accepting bookings
            </label>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setSp(new URLSearchParams())}>
              Clear all
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {results.error ? (
          <ErrorBanner onRetry={() => void results.reload()}>{describeError(results.error)}</ErrorBanner>
        ) : results.loading && !results.data ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px]" />
            ))}
          </div>
        ) : results.data && results.data.rows.length === 0 ? (
          <EmptyState
            icon={<StoreIcon />}
            title="No creators match these filters"
            body="Try fewer niches or a wider price range. New creators join every week."
            action={
              <Button variant="secondary" onClick={() => setSp(new URLSearchParams())}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${results.loading ? 'opacity-60' : ''}`}>
              {results.data?.rows.map((c, i) => (
                <CreatorCardView
                  key={c.id}
                  creator={c}
                  index={(filters.page - 1) * filters.pageSize + i + 1}
                  wanted={filters.niches}
                  bookmarked={bookmarks.has(c.id)}
                  onBookmark={() => void onBookmark(c.id)}
                  onBook={() => setBooking({ id: c.id, name: c.name, price_cents: c.price_cents })}
                />
              ))}
            </div>
            <div className="mt-6">
              <Pagination page={filters.page} pageSize={filters.pageSize} total={results.data?.total ?? 0} onPage={(p) => update({ page: p }, false)} />
            </div>
          </>
        )}
      </div>

      <BookCreatorModal open={booking !== null} onClose={() => setBooking(null)} creator={booking} companyId={company.data?.id ?? null} />
    </>
  )
}
