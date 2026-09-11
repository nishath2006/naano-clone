import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const HERO_BACK =
  'text-xs uppercase tracking-[0.14em] text-white/80 hover:text-white transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm'

/**
 * Navy→blue gradient hero with the 26px dot grid, shared by the sector pages,
 * reports hub, benchmark report and ranking articles.
 */
export function DarkHero({
  children,
  padding = 'pt-28 pb-20 sm:pt-32 sm:pb-24',
}: {
  children: ReactNode
  padding?: string
}) {
  return (
    <section
      className={`relative ${padding} overflow-hidden text-white`}
      style={{ background: 'linear-gradient(135deg, #111827 0%, #1652F0 100%)' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '26px 26px' }}
      />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">{children}</div>
    </section>
  )
}

export function HeroBackLink() {
  return (
    <Link to="/" className={HERO_BACK}>
      ← Naano
    </Link>
  )
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-clock w-3 h-3"
      aria-hidden="true"
    >
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

/** Article hero: back link, kicker row (report name · read time · language), title, lede, meta line. */
export function ArticleHero({
  kicker,
  readTime,
  lang,
  title,
  lede,
  meta,
}: {
  kicker: string
  readTime: string
  lang: string
  title: string
  lede: string
  meta: ReactNode
}) {
  return (
    <DarkHero>
      <div className="mb-10">
        <HeroBackLink />
      </div>
      <div className="max-w-[840px]">
        <div className="flex items-center gap-3 mb-6 text-[11px] uppercase tracking-[0.16em] text-white/85">
          <span className="font-semibold">{kicker}</span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-white/60" />
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon />
            {readTime}
          </span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-white/60" />
          <span>{lang}</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,58px)] font-light leading-[1.04] tracking-[-0.025em] mb-7">{title}</h1>
        <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">{lede}</p>
        <p className="mt-8 text-xs sm:text-sm text-white/70 tabular-nums">{meta}</p>
      </div>
    </DarkHero>
  )
}
