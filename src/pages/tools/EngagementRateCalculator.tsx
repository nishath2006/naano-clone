import { useMemo, useState } from 'react'
import { FooterCta } from '@/components/site/FooterCta'
import { SiteLayout } from '@/layouts/SiteLayout'
import { useLocale } from '@/lib/locale'
import { MORE_TOOLS } from '@/data/free-tools'
import {
  CtaPair,
  DataTable,
  FaqSection,
  MoreFreeTools,
  SectionHeading,
  TOOLS_MAIN_CLASS,
  ToolHero,
  ToolSection,
} from '@/components/tools/ToolSections'

const META = {
  title: 'LinkedIn Engagement Rate Calculator (Free) — NaanoX',
  description:
    'Free LinkedIn engagement rate calculator. Get your rate by followers and by impressions, compare it to 2026 B2B benchmarks, and see how to improve it.',
}

/* ---------------------------------------------------------------------------
 * Calculator (mirrors the live client component; copy is English in both locales)
 * ------------------------------------------------------------------------ */

const TIERS = [
  { min: 0, max: 2000, label: 'Under 2,000 followers', low: 5, high: 8 },
  { min: 2000, max: 5000, label: '2,000 - 5,000 followers', low: 4, high: 6 },
  { min: 5000, max: 20000, label: '5,000 - 20,000 followers', low: 2.5, high: 4 },
  { min: 20000, max: 50000, label: '20,000 - 50,000 followers', low: 1.5, high: 2.5 },
  { min: 50000, max: null, label: '50,000+ followers', low: 1, high: 1.5 },
]

const RATINGS = {
  excellent: { label: 'Excellent', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  healthy: { label: 'Healthy', className: 'bg-[#EEE9FF] text-[#7C5CFC] border border-[#7C5CFC]/20' },
  below: { label: 'Below benchmark', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
}
type Rating = keyof typeof RATINGS

function parse(raw: string): number | null {
  const s = raw.trim()
  if (s === '') return null
  const n = Number(s)
  return !Number.isFinite(n) || n < 0 ? null : n
}
const pct = (n: number) => `${n.toFixed(2)}%`

const INPUT =
  'mt-2 w-full min-h-11 rounded-xl border border-[#E4E1DC] bg-white px-4 py-3 text-[15px] text-[#17181C] placeholder:text-[#B4B4B0] shadow-[0_1px_2px_rgba(23,24,28,0.03)] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] focus:border-transparent'
const LABEL = 'block text-sm font-semibold text-[#17181C]'
const SUB = 'block text-xs font-normal text-[#6B6D74]'

type Field = { id: string; label: string; sub?: string; placeholder: string }

const FIELDS: Field[] = [
  { id: 'erc-reactions', label: 'Average reactions per post', sub: 'Over your last ~10 posts', placeholder: 'e.g. 85' },
  { id: 'erc-comments', label: 'Average comments per post', sub: 'Over your last ~10 posts', placeholder: 'e.g. 20' },
  { id: 'erc-reposts', label: 'Average reposts per post', sub: 'Over your last ~10 posts', placeholder: 'e.g. 5' },
  { id: 'erc-impressions', label: 'Average impressions per post', sub: 'Optional — from LinkedIn analytics', placeholder: 'e.g. 6000' },
]

function EngagementCalculator() {
  const [followers, setFollowers] = useState('')
  const [reactions, setReactions] = useState('')
  const [comments, setComments] = useState('')
  const [reposts, setReposts] = useState('')
  const [impressions, setImpressions] = useState('')
  const values = [reactions, comments, reposts, impressions]
  const setters = [setReactions, setComments, setReposts, setImpressions]

  const result = useMemo(() => {
    const f = parse(followers)
    if (f === null || f <= 0) return null
    const r = parse(reactions) ?? 0
    const c = parse(comments) ?? 0
    const s = parse(reposts) ?? 0
    const imp = parse(impressions)
    const total = r + c + s
    if (total <= 0) return null
    const rateByFollowers = (total / f) * 100
    const tier = TIERS.find((t) => f >= t.min && (t.max === null || f < t.max)) ?? TIERS[TIERS.length - 1]
    const rating: Rating = rateByFollowers > tier.high ? 'excellent' : rateByFollowers >= tier.low ? 'healthy' : 'below'
    const tips: string[] = []
    if (c < 0.1 * r)
      tips.push(
        "Comments are low relative to reactions. Open with a sharper hook and end posts with a specific question — comments weigh more than reactions in LinkedIn's ranking.",
      )
    if (s < 0.05 * total)
      tips.push(
        'Almost nobody reshares your posts. Package ideas people want to pass along: frameworks, checklists, and contrarian takes get reposted far more than updates.',
      )
    if (imp === null || imp <= 0)
      tips.push(
        'You did not enter impressions, so we can only rate you by followers. Pull average impressions from LinkedIn analytics — the by-impressions rate is the fairer read on your content.',
      )
    if (rating === 'below')
      tips.push(
        'You are under the benchmark for your follower tier. Post consistently (2-3 times a week), reply to every comment within the first hour, and cut posts that read like press releases.',
      )
    if (tips.length < 2)
      tips.push(
        'Your engagement is strong. Protect it: keep the posting cadence that got you here, and double down on the formats your audience already responds to.',
      )
    return {
      totalEngagements: total,
      rateByFollowers,
      rateByImpressions: imp !== null && imp > 0 ? (total / imp) * 100 : null,
      tier,
      rating,
      tips: tips.slice(0, 3),
    }
  }, [followers, reactions, comments, reposts, impressions])

  return (
    <div className="rounded-2xl border border-[#ECEAE6] bg-white p-6 sm:p-8 shadow-[0_18px_44px_rgba(23,24,28,0.08)]">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="erc-followers" className={LABEL}>
            Follower count
          </label>
          <input
            id="erc-followers"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="e.g. 4500"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            className={INPUT}
          />
        </div>
        {FIELDS.map((f, i) => (
          <div key={f.id}>
            <label htmlFor={f.id} className={LABEL}>
              {f.label}
              <span className={SUB}>{f.sub}</span>
            </label>
            <input
              id={f.id}
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={f.placeholder}
              value={values[i]}
              onChange={(e) => setters[i](e.target.value)}
              className={INPUT}
            />
          </div>
        ))}
      </div>
      <div aria-live="polite" className="mt-8">
        {result === null ? (
          <div className="rounded-xl border border-dashed border-[#E4E1DC] bg-[#FAFAF9] px-5 py-6 text-[15px] leading-relaxed text-[#55575E]">
            Enter your follower count and your per-post averages above — your engagement rate appears here instantly. Nothing is stored or sent anywhere.
          </div>
        ) : (
          <div className="rounded-xl border border-[#ECEAE6] bg-[#FAFAF9] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold tracking-[-0.015em] text-[#17181C]">Your results</h3>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${RATINGS[result.rating].className}`}>
                {RATINGS[result.rating].label}
              </span>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#7C5CFC]/25 bg-[#EEE9FF]/50 p-4 shadow-[0_8px_24px_rgba(124,92,252,0.08)]">
                <dt className="text-[13px] font-medium text-[#55575E]">Engagement rate by followers</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-[-0.02em] text-[#7C5CFC]">{pct(result.rateByFollowers)}</dd>
                <dd className="mt-1 text-[13px] text-[#6B6D74]">
                  Benchmark for {result.tier.label.toLowerCase()}: {result.tier.low}% - {result.tier.high}%
                </dd>
              </div>
              <div className="rounded-xl border border-[#ECEAE6] bg-white p-4">
                <dt className="text-[13px] font-medium text-[#55575E]">Engagement rate by impressions</dt>
                {result.rateByImpressions !== null ? (
                  <dd className="mt-1 text-3xl font-semibold tracking-[-0.02em] text-[#17181C]">{pct(result.rateByImpressions)}</dd>
                ) : (
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#55575E]">Add average impressions above to see the fairer, reach-based rate.</dd>
                )}
              </div>
            </dl>
            <div className="mt-5">
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6B6D74]">How to improve</h4>
              <ul className="mt-3 space-y-2.5">
                {result.tips.map((tip) => (
                  <li key={tip} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C5CFC]" />
                    <span className="text-[15px] leading-relaxed text-[#55575E]">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Page copy
 * ------------------------------------------------------------------------ */

const BENCHMARKS = [
  { tier: 'Under 2,000 followers', rate: '5% - 8%', meaning: 'Small, warm audiences engage the most. Anything above 8% is exceptional.' },
  { tier: '2,000 - 5,000 followers', rate: '4% - 6%', meaning: 'The sweet spot for B2B micro-creators: reach with the audience still intact.' },
  { tier: '5,000 - 20,000 followers', rate: '2.5% - 4%', meaning: 'Rates dilute as the audience broadens beyond the core network.' },
  { tier: '20,000 - 50,000 followers', rate: '1.5% - 2.5%', meaning: 'Large accounts trade engagement depth for raw distribution.' },
  { tier: '50,000+ followers', rate: '1% - 1.5%', meaning: 'At this scale, a stable 1%+ rate still means serious absolute reach.' },
]

const FORMULAS = [
  {
    title: 'Engagement rate by followers',
    code: '(reactions + comments + reposts) / followers x 100',
    text: 'The standard, comparable metric. Averages are taken over your last ~10 posts so a single viral outlier does not distort the result. It is the number sponsors quote because it can be estimated from any public profile.',
  },
  {
    title: 'Engagement rate by impressions',
    code: '(reactions + comments + reposts) / impressions x 100',
    text: 'The fairer metric. Follower counts include dormant accounts and people the algorithm never shows your posts to; impressions count only the people who actually saw them. Dividing by impressions isolates content quality from distribution luck, which is why serious sponsors ask for it. You will find average impressions in your LinkedIn analytics.',
  },
]

const FAQ = [
  {
    q: 'What is a good engagement rate on LinkedIn in 2026?',
    a: 'It depends on audience size. As a rule of thumb for B2B accounts: under 2,000 followers, 5-8% by followers is good; 2,000-5,000 followers, 4-6%; 5,000-20,000 followers, 2.5-4%; 20,000-50,000 followers, 1.5-2.5%; and above 50,000 followers, 1-1.5%. Rates above those ranges are excellent, and rates below them usually signal a content or consistency problem rather than an audience problem.',
  },
  {
    q: 'Should I measure engagement rate by followers or by impressions?',
    a: 'Use both. Engagement rate by followers ((reactions + comments + reposts) divided by followers) is the standard public metric because anyone can compute it. Engagement rate by impressions divides the same engagements by how many people actually saw the post, so it measures content quality independently of how often LinkedIn distributed it. By-impressions is the fairer metric; by-followers is the comparable one.',
  },
  {
    q: 'Why do micro-creators have higher engagement rates than large accounts?',
    a: "Smaller audiences are denser: a 3,000-follower creator is mostly followed by people who know their niche and interact regularly, while a 100,000-follower account accumulates passive followers who rarely see or touch its posts. LinkedIn also distributes posts through active commenters' networks, which favors tight communities. This is why B2B sponsors increasingly prefer several micro-creators over one large account for the same budget.",
  },
  {
    q: 'How do sponsors use engagement rate to set flat-fee post rates?',
    a: "On marketplaces like NaanoX, each creator sets a flat fee per sponsored post, starting from 100 euros. Sponsors compare that fee against the creator's engagement rate and audience fit: a creator with 4,000 followers and a 6% engagement rate reliably delivers more qualified attention per euro than a bigger account at 1%. A strong, documented engagement rate is the single best argument for setting a higher per-post rate.",
  },
]

const EN = {
  back: 'Free Tools',
  h1: 'LinkedIn Engagement Rate Calculator',
  intro:
    'Type your follower count and per-post averages, get your engagement rate instantly — by followers and by impressions — rated against 2026 B2B benchmarks. Free, no account, nothing leaves your browser.',
  benchHeading: 'LinkedIn engagement rate benchmarks for B2B (2026)',
  benchIntro:
    '“Good” is relative to audience size: rates fall as follower counts grow. These ranges are engagement rate by followers for B2B accounts, drawn from campaigns run through the NaanoX marketplace [NaanoX marketplace data, Q2 2026].',
  benchHeaders: ['Follower tier', 'Good rate (by followers)', 'What it means'],
  benchNote: 'Above the range for your tier: Excellent. Inside it: Healthy. Below it: Below benchmark — see the improvement tips the calculator gives you.',
  howHeading: "How it's calculated",
  howNote: 'Benchmark ranges: B2B campaigns run through the NaanoX marketplace [NaanoX marketplace data, Q2 2026].',
  faqHeading: 'Frequently asked questions',
  moreHeading: 'More free tools',
  open: 'Open',
  dark: {
    title: 'Strong engagement rate? Get paid for it.',
    text: 'Creators on NaanoX get paid per post by vetted B2B sponsors — you set your own flat rate, from 100 euros per post. Your engagement rate is exactly what companies are looking for.',
    cta: 'Get paid per post on NaanoX',
    href: 'https://naano.com/register?role=influencer',
  },
  light: {
    title: 'Buying attention, not follower counts?',
    text: 'Browse vetted LinkedIn creators with the engagement rates to prove it. Every creator lists a flat fee per post upfront — no negotiation, no surprises.',
    cta: 'Browse vetted creators',
    href: 'https://naano.com/creators',
  },
}

// FR capture: back pill, "More free tools" block and the second CTA paragraph are translated.
const COPY = {
  en: EN,
  fr: {
    ...EN,
    back: 'Outils gratuits',
    moreHeading: "Plus d'outils gratuits",
    open: 'Ouvrir',
    light: {
      ...EN.light,
      text: "Parcourez des créateurs LinkedIn vérifiés dont les taux d'engagement font leurs preuves. Chaque créateur affiche son forfait par post dès le départ : aucune négociation, aucune surprise.",
    },
  },
}

export default function EngagementRateCalculator() {
  const { locale } = useLocale()
  const c = COPY[locale]
  const more = [MORE_TOOLS.worth[locale], MORE_TOOLS.odds[locale], MORE_TOOLS.all[locale]]

  return (
    <SiteLayout title={META.title} description={META.description} className={TOOLS_MAIN_CLASS} deps={[locale]}>
      <ToolHero backLabel={c.back} title={c.h1} intro={c.intro} />

      <section className="pt-6 pb-16 sm:pb-20">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <EngagementCalculator />
        </div>
      </section>

      <ToolSection>
        <SectionHeading dot={false}>{c.benchHeading}</SectionHeading>
        <p className="mt-4 text-[16px] leading-[1.65] text-[#55575E]">{c.benchIntro}</p>
        <DataTable
          minWidth={560}
          headers={c.benchHeaders}
          rows={BENCHMARKS.map((b) => ({
            key: b.tier,
            cells: [
              { className: 'px-5 py-4 font-semibold text-[#17181C]', content: b.tier },
              { className: 'px-5 py-4 font-semibold text-[#7C5CFC] whitespace-nowrap', content: b.rate },
              { className: 'px-5 py-4 leading-relaxed text-[#55575E]', content: b.meaning },
            ],
          }))}
        />
        <p className="mt-4 text-[14px] text-[#6B6D74]">{c.benchNote}</p>
      </ToolSection>

      <ToolSection>
        <SectionHeading>{c.howHeading}</SectionHeading>
        <div className="mt-8 space-y-8">
          {FORMULAS.map((f) => (
            <div key={f.title}>
              <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[#17181C]">{f.title}</h3>
              <div className="mt-3 overflow-x-auto rounded-xl border border-[#ECEAE6] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(23,24,28,0.03)]">
                <code className="text-[15px] font-semibold text-[#7C5CFC] whitespace-nowrap">{f.code}</code>
              </div>
              <p className="mt-3 text-[16px] leading-[1.65] text-[#6B6D74]">{f.text}</p>
            </div>
          ))}
          <p className="text-[14px] text-[#6B6D74]">{c.howNote}</p>
        </div>
      </ToolSection>

      <FaqSection heading={c.faqHeading} items={FAQ} />

      <MoreFreeTools heading={c.moreHeading} openLabel={c.open} tools={more} />

      <CtaPair dark={c.dark} light={c.light} />
      <FooterCta />
    </SiteLayout>
  )
}
