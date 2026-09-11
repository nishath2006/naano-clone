import { Link } from 'react-router-dom'
import type { CreatorCard } from '@/lib/queries'
import { matchingScore } from '@/lib/queries'
import { countryName, formatCompact, formatMoney } from '@/lib/format'
import { Avatar, flag } from './ui'
import { LinkedInBadge, StarIcon } from './icons'

/**
 * Marketplace creator card, modelled on public/lp/marketplace-screenshot-clean-v2.png:
 * cloud-blue header with the naano wordmark, overlapping avatar, name, niches,
 * country pill, bio, MATCHING bar and the Followers / Median views / Post cost row.
 */
export function CreatorCardView({
  creator,
  bookmarked,
  onBookmark,
  onBook,
  wanted,
  index,
}: {
  creator: CreatorCard
  bookmarked: boolean
  onBookmark: () => void
  onBook: () => void
  wanted?: string[]
  index?: number
}) {
  const score = matchingScore(creator, wanted)
  return (
    <article className="relative flex flex-col rounded-2xl bg-white border border-[#E9EBF0] shadow-[0_1px_3px_rgba(15,23,42,0.06)] overflow-hidden">
      <div className="relative h-[92px] bg-[radial-gradient(circle_at_30%_20%,#e8f5ff_0%,#cfeafd_45%,#dcefff_100%)]">
        {index != null && <span className="absolute left-3 bottom-1 text-[44px] font-extrabold leading-none text-white/70 select-none">{index}</span>}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <LinkedInBadge />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onBook}
            disabled={!creator.accepting_bookings || !creator.price_cents}
            className="h-8 rounded-lg bg-white px-3 text-xs font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book
          </button>
          <button
            type="button"
            onClick={onBookmark}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove from saved creators' : 'Save creator'}
            className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm cursor-pointer ${bookmarked ? 'bg-[#2563eb] text-white' : 'bg-white text-[#6B7280] hover:text-[#111827]'}`}
          >
            <StarIcon width={16} height={16} filled={bookmarked} />
          </button>
        </div>
        <img src="/logo.svg" alt="" className="absolute left-1/2 top-4 h-6 -translate-x-1/2 opacity-90" />
      </div>
      <Link to={`/app/creators/${creator.id}`} className="-mt-9 flex flex-col items-center px-5 text-center">
        <Avatar src={creator.avatar_url} name={creator.name} size={72} className="ring-4 ring-white shadow-md" />
        <h3 className="mt-2 text-[15px] font-bold text-[#111827]">{creator.name}</h3>
        <div className="mt-0.5 text-xs text-[#6B7280]">{creator.sectors.slice(0, 2).join(' · ') || '—'}</div>
        {creator.country && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-0.5 text-[11px] font-medium text-[#4B5563]">
            <span aria-hidden>{flag(creator.country)}</span> {countryName(creator.country)}
          </span>
        )}
        <p className="mt-3 h-9 text-xs leading-[18px] text-[#6B7280] line-clamp-2">{creator.bio ?? creator.headline ?? ''}</p>
      </Link>
      <div className="px-5 pt-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wide text-[#6B7280]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" /> Matching
          </span>
          <span className="font-bold text-[#111827]">{score}/100</span>
        </div>
        <div className="mt-1.5 h-1 rounded-full bg-[#E5E7EB]">
          <div className="h-1 rounded-full bg-[#2563eb]" style={{ width: `${score}%` }} />
        </div>
      </div>
      <div className="m-4 mt-3 grid grid-cols-3 divide-x divide-[#E9EBF0] rounded-xl border border-[#E9EBF0] bg-[#FAFBFC]">
        {[
          [formatCompact(creator.followers), 'Followers'],
          [formatCompact(creator.median_views), 'Median views'],
          [creator.price_cents ? formatMoney(creator.price_cents) : '—', 'Post cost'],
        ].map(([v, l]) => (
          <div key={l} className="py-2.5 text-center">
            <div className="text-sm font-bold text-[#111827]">{v}</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">{l}</div>
          </div>
        ))}
      </div>
    </article>
  )
}
