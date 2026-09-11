import { Link } from 'react-router-dom'
import type { BlogCardData } from '@/data/blog-listing'
import { ArrowRightIcon, CalendarDaysIcon, ClockIcon } from './icons'

const DOT_PATTERN = 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)'

/** Gradient cover with the white dot overlay (listing cards and the featured card). */
function Cover({ card, className, children }: { card: BlogCardData; className: string; children?: React.ReactNode }) {
  return (
    <div className={className} style={{ background: card.gradient }}>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: DOT_PATTERN, backgroundSize: card.dot }} />
      {children}
    </div>
  )
}

function Dot() {
  return <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
}

function ReadTime({ card }: { card: BlogCardData }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <ClockIcon />
      {card.readMinutes} {card.readLabel}
    </span>
  )
}

function DateStamp({ card }: { card: BlogCardData }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <CalendarDaysIcon />
      {card.date && <time dateTime={card.date.iso}>{card.date.text}</time>}
    </span>
  )
}

/** Card of the "More articles" grid. */
export function BlogCard({ card }: { card: BlogCardData }) {
  return (
    <li>
      <Link
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-4 rounded-xl"
        to={`/blog/${card.slug}`}
      >
        <Cover
          card={card}
          className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.015]"
        />
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] mb-3">{card.category}</p>
        <h3 className="text-[20px] sm:text-[22px] font-medium leading-[1.25] tracking-[-0.01em] text-[#111827] mb-3 group-hover:underline underline-offset-4 decoration-[#111827]/20">
          {card.title}
        </h3>
        <p className="text-sm text-[#4B5563] leading-relaxed mb-5 line-clamp-2">{card.excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
          <span>{card.author}</span>
          <Dot />
          <ReadTime card={card} />
          <Dot />
          <DateStamp card={card} />
        </div>
      </Link>
    </li>
  )
}

/** The "Latest" card: large cover on the left, copy on the right. */
export function FeaturedBlogCard({ card, readArticle }: { card: BlogCardData; readArticle: string }) {
  return (
    <Link
      className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-4 rounded-2xl"
      to={`/blog/${card.slug}`}
    >
      <Cover
        card={card}
        className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.01]"
      >
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
        <span className="absolute top-6 left-6 sm:top-8 sm:left-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
          {card.category}
        </span>
      </Cover>
      <div className="lg:col-span-5">
        <h2 className="text-[clamp(26px,3.6vw,42px)] font-light leading-[1.08] tracking-[-0.02em] text-[#111827] mb-5 group-hover:underline underline-offset-4 decoration-[#111827]/20">
          {card.title}
        </h2>
        <p className="text-base text-[#4B5563] leading-relaxed mb-7 max-w-prose">{card.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-7">
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[10px] font-medium text-[#4B5563]">
              {card.initials}
            </span>
            {card.author}
          </span>
          <Dot />
          <ReadTime card={card} />
          <Dot />
          <DateStamp card={card} />
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111827] group-hover:gap-2.5 transition-all duration-200 motion-reduce:transition-none">
          {readArticle}
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  )
}
