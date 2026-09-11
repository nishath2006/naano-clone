import { useMemo, useState } from 'react'
import { FooterCta } from '@/components/site/FooterCta'
import { SiteLayout } from '@/layouts/SiteLayout'
import { NavAnchor } from '@/components/lp/LpNav'
import { useLocale } from '@/lib/locale'
import { MORE_TOOLS } from '@/data/free-tools'
import { ArrowRightIcon } from '@/components/tools/ToolIcons'
import { Dot, FaqSection, MoreFreeTools, SectionHeading, TOOLS_MAIN_CLASS, ToolHero, ToolSection } from '@/components/tools/ToolSections'

const META = {
  title: 'LinkedIn Creator Worth Calculator — Free | Naano',
  description:
    'Free calculator: enter your LinkedIn followers and engagement to see what a sponsored post is worth in euros, based on Naano marketplace flat-fee data.',
}

/* ---------------------------------------------------------------------------
 * Calculator (mirrors the live client component; copy is English in both locales)
 * ------------------------------------------------------------------------ */

const NICHES = [
  { value: 'b2b-saas-tech', label: 'B2B SaaS / Tech', multiplier: 1.2 },
  { value: 'sales-marketing', label: 'Sales / Marketing', multiplier: 1.1 },
  { value: 'finance', label: 'Finance', multiplier: 1.15 },
  { value: 'hr-future-of-work', label: 'HR / Future of work', multiplier: 1 },
  { value: 'other', label: 'Other', multiplier: 0.9 },
]

const POSTS_PER_WEEK = [1, 2, 3, 4, 5, 6, 7]

const RATINGS = {
  excellent: {
    label: 'Excellent',
    detail: 'Top tier for B2B nano and micro creators. Audiences this engaged are rare and command the upper end of any rate range.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  good: {
    label: 'Good',
    detail: 'Above the typical B2B benchmark. Your audience clearly pays attention, which is exactly what sponsors buy.',
    badgeClass: 'bg-[#E8F0FE] text-[#1652F0] border border-[#1652F0]/20',
  },
  average: {
    label: 'Average',
    detail: 'In line with the B2B average. Consistent posting and tighter topic focus usually move this up within a quarter.',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  low: {
    label: 'Low',
    detail: 'Below the typical B2B benchmark. Worth growing engagement before setting a rate — value follows attention, not follower count.',
    badgeClass: 'bg-[#F7F6F3] text-[#55575E] border border-[#E4E1DC]',
  },
}

const roundTo10 = (n: number) => 10 * Math.round(n / 10)
const num = (raw: string) => {
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : 0
}
const euro = (n: number) => `€${n.toLocaleString('en-US')}`

const INPUT =
  'mt-2 w-full min-h-11 rounded-xl border border-[#E4E1DC] bg-white px-4 py-3 text-[16px] text-[#17181C] placeholder:text-[#B4B4B0] shadow-[0_1px_2px_rgba(23,24,28,0.03)] focus:outline-none focus:ring-2 focus:ring-[#1652F0] focus:border-transparent transition-shadow motion-reduce:transition-none'
const LABEL = 'block text-[14px] font-semibold text-[#17181C]'
const HINT = 'mt-1.5 text-[13px] text-[#6B6D74]'

function WorthCalculator() {
  const [followers, setFollowers] = useState('')
  const [reactions, setReactions] = useState('')
  const [comments, setComments] = useState('')
  const [postsPerWeek, setPostsPerWeek] = useState(3)
  const [niche, setNiche] = useState('b2b-saas-tech')

  const result = useMemo(() => {
    const f = num(followers)
    const r = num(reactions)
    const c = num(comments)
    if (f <= 0) return null
    const multiplier = NICHES.find((n) => n.value === niche)?.multiplier ?? 1
    const engagementRatePct = ((r + 2 * c) / f) * 100
    const value = Math.max(100, (f / 1000) * 12) * Math.min(2, 0.6 + engagementRatePct / 2.5) * multiplier
    const perPostLow = Math.max(100, roundTo10(0.8 * value))
    const perPostHigh = Math.max(perPostLow, roundTo10(1.2 * value))
    const rating =
      engagementRatePct >= 4
        ? RATINGS.excellent
        : engagementRatePct >= 2
          ? RATINGS.good
          : engagementRatePct >= 1
            ? RATINGS.average
            : RATINGS.low
    return {
      engagementRatePct,
      rating,
      perPostLow,
      perPostHigh,
      monthlyLow: 2 * perPostLow,
      monthlyHigh: 4 * perPostHigh,
      sponsoredSharePct: Math.min(100, Math.round((4 / (4.33 * postsPerWeek + 4)) * 100)),
    }
  }, [followers, reactions, comments, postsPerWeek, niche])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8 items-start">
      <form
        aria-label="Creator profile inputs"
        onSubmit={(e) => e.preventDefault()}
        className="rounded-2xl border border-[#ECEAE6] bg-white p-7 sm:p-8 shadow-[0_2px_10px_rgba(23,24,28,0.05)]"
      >
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-[#17181C]">Your LinkedIn profile</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[#55575E]">
          Type your numbers as they appear on LinkedIn. Nothing is scraped, stored, or sent anywhere — the math runs in your browser.
        </p>
        <div className="mt-7 space-y-6">
          <div>
            <label htmlFor="followers" className={LABEL}>
              Follower count
            </label>
            <input
              id="followers"
              name="followers"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="e.g. 8500"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className={INPUT}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="reactions" className={LABEL}>
                Average reactions per post
              </label>
              <input
                id="reactions"
                name="reactions"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="e.g. 120"
                value={reactions}
                onChange={(e) => setReactions(e.target.value)}
                className={INPUT}
              />
              <p className={HINT}>Likes and all other reactions.</p>
            </div>
            <div>
              <label htmlFor="comments" className={LABEL}>
                Average comments per post
              </label>
              <input
                id="comments"
                name="comments"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="e.g. 25"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className={INPUT}
              />
              <p className={HINT}>Comments count double — they signal a real audience.</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="posts-per-week" className={LABEL}>
                Posts per week
              </label>
              <select
                id="posts-per-week"
                name="posts-per-week"
                value={postsPerWeek}
                onChange={(e) => setPostsPerWeek(Number(e.target.value))}
                className={INPUT}
              >
                {POSTS_PER_WEEK.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'post' : 'posts'} per week
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="niche" className={LABEL}>
                Niche
              </label>
              <select id="niche" name="niche" value={niche} onChange={(e) => setNiche(e.target.value)} className={INPUT}>
                {NICHES.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
              <p className={HINT}>B2B buying audiences carry a premium.</p>
            </div>
          </div>
        </div>
      </form>

      <div aria-live="polite" className="rounded-2xl border border-[#ECEAE6] bg-white p-7 sm:p-8 shadow-[0_18px_44px_rgba(23,24,28,0.08)]">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-[#17181C]">Your estimate</h2>
        {result === null ? (
          <p className="mt-4 text-[15px] leading-relaxed text-[#55575E]">
            Enter your follower count on the left and your estimate appears here instantly — engagement rate, a per-post rate range in euros, and your monthly sponsorship potential.
          </p>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-[#ECEAE6] bg-[#FAFAF9] p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6B6D74]">Engagement rate</span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${result.rating.badgeClass}`}>
                  {result.rating.label}
                </span>
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#17181C]">{result.engagementRatePct.toFixed(2)}%</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#55575E]">{result.rating.detail}</p>
            </div>
            <div className="rounded-xl border border-[#1652F0]/25 bg-[#E8F0FE]/50 p-5 shadow-[0_8px_24px_rgba(22,82,240,0.10)]">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1652F0]">Estimated value per sponsored post</span>
              <p className="mt-2 text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#1652F0]">
                {euro(result.perPostLow)} – {euro(result.perPostHigh)}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#55575E]">
                Flat fee for one sponsored post, the pricing model used on the Naano marketplace. Creators set their own rate; this range is where profiles like yours typically land.
              </p>
            </div>
            <div className="rounded-xl border border-[#ECEAE6] bg-[#FAFAF9] p-5">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6B6D74]">Monthly sponsorship potential</span>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#17181C]">
                {euro(result.monthlyLow)} – {euro(result.monthlyHigh)}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#55575E]">
                Based on 2 to 4 sponsored posts per month — the ceiling we recommend to protect authenticity. At your pace of {postsPerWeek}{' '}
                {postsPerWeek === 1 ? 'post' : 'posts'} per week, that keeps sponsored content to roughly {result.sponsoredSharePct}% of what your
                audience sees.
              </p>
            </div>
            <p className="text-[13px] leading-relaxed text-[#6B6D74]">
              Estimate only. Real rates also reflect audience seniority, content format, and usage rights — see the methodology below.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Page copy
 * ------------------------------------------------------------------------ */

const STEPS = [
  {
    title: 'Engagement rate',
    text: '(average reactions + 2 × average comments) ÷ followers. Comments are weighted double because they signal an audience that actually reads and responds — the thing sponsors pay for. Benchmarks for B2B nano and micro creators: 4% and above is excellent, 2–4% good, 1–2% average, below 1% low.',
  },
  {
    title: 'Base value',
    text: '€12 per 1,000 followers, with a floor of €100 — the minimum flat fee on Naano. This anchors the estimate to audience size before quality adjustments.',
  },
  {
    title: 'Engagement adjustment',
    text: 'The base is multiplied by 0.6 + (engagement rate ÷ 2.5), capped at ×2. A creator at the 4% excellent threshold roughly doubles their base value; a low-engagement profile is discounted below it.',
  },
  {
    title: 'Niche multiplier',
    text: 'B2B SaaS / Tech ×1.2, Finance ×1.15, Sales / Marketing ×1.1, HR / Future of work ×1.0, Other ×0.9 — reflecting what sponsors pay to reach each audience on Naano.',
  },
  {
    title: 'Range and monthly potential',
    text: 'The result is shown as a ±20% range, rounded to the nearest €10, never below €100. Monthly potential assumes 2 to 4 sponsored posts per month — the ceiling we recommend so sponsored content never drowns out the organic voice that made the audience valuable.',
  },
]

const FAQ = [
  {
    q: 'How accurate is this calculator?',
    a: 'It is an estimate, not a quote. The formula is calibrated on flat fees actually paid on the Naano marketplace (Q2 2026), where sponsored posts run from €100 to roughly €1,500 depending on audience and engagement. It cannot see qualitative factors — audience seniority, content quality, niche authority — so treat the range as a starting point for setting or budgeting a rate, not a guarantee.',
  },
  {
    q: 'What makes a LinkedIn creator worth more?',
    a: 'Engagement quality beats follower count. A creator with 8,000 followers and a 5% engagement rate is typically worth more per post than one with 50,000 followers and 0.5%, because sponsors buy attention from a relevant audience. Rates also rise with niche (B2B SaaS and finance audiences carry a premium), comment depth, posting consistency, and how senior the audience is.',
  },
  {
    q: 'How do creators get paid on Naano?',
    a: 'Each creator sets a flat fee per sponsored post, starting from €100. Companies see that price up front, book the post, and the creator is paid the fee once the post is published. There is no bidding and no percentage-of-spend arrangement: the creator decides the rate, and this calculator helps pick a defensible one.',
  },
  {
    q: 'Can companies use this calculator to budget?',
    a: 'Yes. Enter the public numbers of a creator you are considering — followers, typical reactions and comments — and the per-post range tells you what a fair flat fee looks like before you reach out. For a full campaign, multiply by the number of creators and posts, or request a free hand-picked shortlist from Naano with real prices attached.',
  },
]

const EN = {
  back: 'Free Tools',
  h1: 'LinkedIn Creator Worth Calculator',
  intro:
    'Find out what a sponsored LinkedIn post is worth — as a flat fee in euros. Type your followers and engagement, get an instant range based on real Naano marketplace rates. Free, no account, nothing leaves your browser.',
  howHeading: 'How the estimate works',
  howIntro:
    'No black box: here is the exact formula, calibrated on flat fees actually paid for sponsored posts on the Naano marketplace, where creators charge from €100 up to roughly €1,500 per post [Naano marketplace data, Q2 2026].',
  faqHeading: 'Frequently asked questions',
  moreHeading: 'More free tools',
  open: 'Open',
  ctaHeading: 'Now put the number to work',
  creators: {
    badge: 'For creators',
    title: 'Set your rate and get booked',
    text: 'Publish your flat fee on Naano — from €100 per post, you decide the price — and let B2B companies book you directly. No pitching, no negotiation threads.',
    cta: 'Set your rate and get booked',
    href: 'https://naano.com/register?role=influencer',
  },
  companies: {
    badge: 'For companies',
    title: 'Get a free hand-picked creator shortlist',
    text: 'Describe your campaign and a real person at Naano sends you a shortlist of vetted LinkedIn creators — with their actual flat fees — within 48 hours. Free, no commitment.',
    cta: 'Get a free creator shortlist',
    href: 'https://naano.com/selection',
  },
}

// FR capture: only the back pill and the "More free tools" block are translated.
const COPY = {
  en: EN,
  fr: { ...EN, back: 'Outils gratuits', moreHeading: "Plus d'outils gratuits", open: 'Ouvrir' },
}

export default function CreatorWorthCalculator() {
  const { locale } = useLocale()
  const c = COPY[locale]
  const more = [MORE_TOOLS.erc[locale], MORE_TOOLS.odds[locale], MORE_TOOLS.all[locale]]

  return (
    <SiteLayout title={META.title} description={META.description} className={TOOLS_MAIN_CLASS} deps={[locale]}>
      <ToolHero backLabel={c.back} title={c.h1} intro={c.intro} />

      <section className="pt-6 pb-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <WorthCalculator />
        </div>
      </section>

      <ToolSection>
        <SectionHeading>{c.howHeading}</SectionHeading>
        <p className="mt-6 text-[16px] leading-[1.65] text-[#55575E]">{c.howIntro}</p>
        <ol className="mt-8 space-y-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-semibold text-[#1652F0]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[#17181C]">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[#6B6D74]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </ToolSection>

      <FaqSection heading={c.faqHeading} items={FAQ} />

      <MoreFreeTools heading={c.moreHeading} openLabel={c.open} tools={more} />

      <section className="border-t border-[#E4E1DC] bg-[#F4F0E8] py-16 sm:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <h2 className="max-w-[720px] text-3xl sm:text-[38px] font-semibold tracking-[-0.03em] text-[#17181C]">
            {c.ctaHeading}
            <Dot />
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-[#E4E1DC] bg-white p-7 shadow-[0_2px_10px_rgba(23,24,28,0.05)]">
              <span className="inline-flex self-start items-center rounded-full bg-[#E8F0FE] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1652F0]">
                {c.creators.badge}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[#17181C]">{c.creators.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#55575E] flex-1">{c.creators.text}</p>
              <NavAnchor
                href={c.creators.href}
                className="mt-6 inline-flex min-h-11 self-start items-center gap-2 rounded-xl bg-[#1652F0] px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#1240D0] motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1652F0] focus-visible:ring-offset-2"
              >
                {c.creators.cta}
                <ArrowRightIcon size={15} />
              </NavAnchor>
            </div>
            <div className="flex flex-col rounded-2xl border border-[#E4E1DC] bg-white p-7 shadow-[0_2px_10px_rgba(23,24,28,0.05)]">
              <span className="inline-flex self-start items-center rounded-full bg-[#F7F6F3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#17181C]">
                {c.companies.badge}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[#17181C]">{c.companies.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#55575E] flex-1">{c.companies.text}</p>
              <NavAnchor
                href={c.companies.href}
                className="mt-6 inline-flex min-h-11 self-start items-center gap-2 rounded-xl bg-[#17181C] px-6 py-3 text-[15px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17181C] focus-visible:ring-offset-2"
              >
                {c.companies.cta}
                <ArrowRightIcon size={15} />
              </NavAnchor>
            </div>
          </div>
        </div>
      </section>
      <FooterCta />
    </SiteLayout>
  )
}
