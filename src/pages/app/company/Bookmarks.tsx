import { useState } from 'react'
import { describeError, supabase } from '@/lib/supabase'
import { unwrap, useQuery, type CreatorCard } from '@/lib/queries'
import { useBookmarks, useCompany } from '@/lib/useCompany'
import { EmptyState, ErrorBanner, LinkButton, PageHeader, Skeleton, useToast } from '@/components/app/ui'
import { StarIcon } from '@/components/app/icons'
import { CreatorCardView } from '@/components/app/CreatorCardView'
import { BookCreatorModal } from '@/components/app/BookCreatorModal'

/** /app/bookmarks — creators the company starred on the marketplace. */
export default function Bookmarks() {
  const company = useCompany()
  const { bookmarks, toggle } = useBookmarks(company.data?.id)
  const toast = useToast()
  const [booking, setBooking] = useState<{ id: string; name: string; price_cents: number | null } | null>(null)

  const q = useQuery(async () => {
    if (!company.data) return []
    const rows = unwrap(
      await supabase
        .from('bookmarks')
        .select('created_at, creators(id, slug, name, headline, position, bio, avatar_url, country, sectors, followers, median_views, engagement_rate, price_cents, accepting_bookings, linkedin_url)')
        .eq('company_id', company.data.id)
        .order('created_at', { ascending: false }),
    ) as { created_at: string; creators: CreatorCard | null }[]
    return rows.map((r) => r.creators).filter((c): c is CreatorCard => c !== null)
  }, [company.data?.id])

  const remove = async (id: string) => {
    try {
      await toggle(id)
      q.setData((q.data ?? []).filter((c) => c.id !== id))
    } catch (e) {
      toast.push('error', describeError(e))
    }
  }

  return (
    <>
      <PageHeader title="Saved creators" subtitle="Your shortlist. Book them directly or invite them to a campaign." />
      {q.error ? (
        <ErrorBanner onRetry={() => void q.reload()}>{describeError(q.error)}</ErrorBanner>
      ) : q.loading || company.loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px]" />
          ))}
        </div>
      ) : (q.data ?? []).length === 0 ? (
        <EmptyState icon={<StarIcon />} title="No saved creators yet" body="Star creators on the marketplace to build a shortlist." action={<LinkButton to="/app/marketplace">Browse the marketplace</LinkButton>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {q.data?.map((c) => (
            <CreatorCardView key={c.id} creator={c} bookmarked={bookmarks.has(c.id)} onBookmark={() => void remove(c.id)} onBook={() => setBooking({ id: c.id, name: c.name, price_cents: c.price_cents })} />
          ))}
        </div>
      )}
      <BookCreatorModal open={booking !== null} onClose={() => setBooking(null)} creator={booking} companyId={company.data?.id ?? null} />
    </>
  )
}
