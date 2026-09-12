import { useMemo, useState } from 'react'
import { FooterCta } from '@/components/site/FooterCta'
import { SiteLayout } from '@/layouts/SiteLayout'
import { useLocale } from '@/lib/locale'
import { MORE_TOOLS } from '@/data/free-tools'
import {
  CtaPair,
  DataTable,
  FaqSection,
  InlineLink,
  MethodSection,
  MoreFreeTools,
  NoteList,
  ResultCallout,
  SectionHeading,
  SourceNote,
  TOOLS_MAIN_CLASS,
  ToolHero,
  ToolSection,
} from '@/components/tools/ToolSections'

const META = {
  title: 'Sponsored Post Delivery Odds Estimator (Free) — NaanoX',
  description:
    'Will your creator offer actually get published? Compare it to 300 real sponsored-post bookings: delivery rate, transacted median, and how often offers go unanswered.',
}

/* ---------------------------------------------------------------------------
 * Data (NaanoX Index, n=300 bookings, 14 June – 11 August 2026)
 * ------------------------------------------------------------------------ */

const TIERS = [
  { id: 'u5k', label: 'Under 5,000 followers', p25: 56, median: 84, p75: 120, n: 66 },
  { id: '5-10k', label: '5,000 – 10,000 followers', p25: 88, median: 180, p75: 423, n: 64 },
  { id: '10-25k', label: '10,000 – 25,000 followers', p25: 122, median: 300, p75: 360, n: 118 },
  { id: '25-50k', label: '25,000 – 50,000 followers', p25: 345, median: 588, p75: 606, n: 36 },
  { id: '50k+', label: '50,000+ followers', p25: 499, median: 720, p75: 900, n: 16 },
]

const BANDS = [
  { id: 'under200', label: 'Under €200', min: 0, max: 200, deliveryRate: 30.4, ignoredRate: 41.6, nCreated: 142, nBrands: 22 },
  { id: '200-399', label: '€200 – €399', min: 200, max: 400, deliveryRate: 25.9, ignoredRate: 40.9, nCreated: 70, nBrands: 13 },
  { id: '400-599', label: '€400 – €599', min: 400, max: 600, deliveryRate: 34.6, ignoredRate: 25, nCreated: 36, nBrands: 9 },
  { id: '600plus', label: '€600 and above', min: 600, max: null, deliveryRate: 64.6, ignoredRate: 19.2, nCreated: 52, nBrands: 17 },
]

const VERDICTS = {
  strong: { label: 'Likely to ship', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  fair: { label: 'Mixed odds', className: 'bg-[#EEE9FF] text-[#7C5CFC] border border-[#7C5CFC]/20' },
  fragile: { label: 'Fragile offer', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
}
type Verdict = keyof typeof VERDICTS

const euro = (n: number) => `€${Math.round(n).toLocaleString('en-US')}`

function parse(raw: string): number | null {
  const s = raw.trim()
  if (s === '') return null
  const n = Number(s)
  return !Number.isFinite(n) || n <= 0 ? null : n
}

const INPUT =
  'mt-2 w-full min-h-11 rounded-xl border border-[#E4E1DC] bg-white px-4 py-3 text-[15px] text-[#17181C] placeholder:text-[#B4B4B0] shadow-[0_1px_2px_rgba(23,24,28,0.03)] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] focus:border-transparent'

/* ---------------------------------------------------------------------------
 * Calculator (mirrors the live client component; copy is English in both locales)
 * ------------------------------------------------------------------------ */

function OddsEstimator() {
  const [tierId, setTierId] = useState(TIERS[1].id)
  const [offer, setOffer] = useState('')

  const result = useMemo(() => {
    const o = parse(offer)
    if (o === null) return null
    const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[0]
    const band = BANDS.find((b) => o >= b.min && (b.max === null || o < b.max)) ?? BANDS[BANDS.length - 1]
    const pctOfMedian = (o / tier.median) * 100
    const verdict: Verdict = band.deliveryRate >= 60 ? 'strong' : band.deliveryRate >= 40 ? 'fair' : 'fragile'
    const headline = `About ${band.deliveryRate}% of settled bookings in the ${band.label.toLowerCase()} band ended in a published post.`
    const notes: string[] = []
    notes.push(`${band.ignoredRate}% of offers in this band expired without the creator ever answering.`)
    if (pctOfMedian < 100)
      notes.push(
        `The transacted median at this audience size was ${euro(tier.median)} per post (P25 ${euro(tier.p25)}, P75 ${euro(tier.p75)}, n=${tier.n}). Consider offering at least the median, or reducing the deliverable instead of the price.`,
      )
    else
      notes.push(
        `The transacted median at this audience size was ${euro(tier.median)} per post (P25 ${euro(tier.p25)}, P75 ${euro(tier.p75)}, n=${tier.n}), so your offer is at or above the observed median.`,
      )
    if (band.nBrands < 10) notes.push(`Read this band with caution: it rests on ${band.nCreated} bookings from only ${band.nBrands} distinct buying brands.`)
    notes.push(
      "Follower count explains under a third of what creators charge (log-log R² = 0.289, n=769). Use the creator's own listed rate as your anchor, not this tier.",
    )
    return { tier, band, offer: o, pctOfMedian, verdict, headline, notes }
  }, [tierId, offer])

  return (
    <div className="rounded-2xl border border-[#ECEAE6] bg-white p-6 sm:p-8 shadow-[0_18px_44px_rgba(23,24,28,0.08)]">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tier" className="text-[15px] font-semibold text-[#17181C]">
            Creator audience size
          </label>
          <select id="tier" value={tierId} onChange={(e) => setTierId(e.target.value)} className={INPUT}>
            {TIERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="offer" className="text-[15px] font-semibold text-[#17181C]">
            Your offer per post (€)
          </label>
          <input
            id="offer"
            type="number"
            inputMode="decimal"
            min="1"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="e.g. 250"
            className={INPUT}
          />
        </div>
      </div>
      <div className="mt-8 border-t border-[#ECEAE6] pt-8">
        {result === null ? (
          <p className="text-[16px] leading-relaxed text-[#55575E]">
            Enter what you plan to offer per post to see how often bookings at that price actually ended in a published post on NaanoX's marketplace.
          </p>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${VERDICTS[result.verdict].className}`}>
                {VERDICTS[result.verdict].label}
              </span>
              <span className="text-[14px] text-[#6B6D74]">
                {euro(result.offer)} per post · {result.band.label} band · {result.band.nCreated} bookings
              </span>
            </div>
            <p className="mt-5 text-[28px] sm:text-[34px] font-semibold leading-tight tracking-[-0.02em] text-[#7C5CFC]">
              {result.band.deliveryRate}%{' '}
              <span className="text-[18px] sm:text-[20px] font-medium text-[#55575E]">of settled bookings at this price were published</span>
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-[#55575E]">{result.headline}</p>
            <NoteList items={result.notes.map((text) => ({ text }))} />
            <ResultCallout
              lead="How to use this result:"
              text="treat the observed rate as a historical benchmark, not a causal promise or a recommended price. The creator's own listed rate and your agreed scope remain the best anchors for an offer."
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Page copy
 * ------------------------------------------------------------------------ */

const BAND_ROWS = [
  { label: 'Under €200', note: 'The largest band by volume. 22 distinct buying brands.', n: '142', published: '30.4%', ignored: '41.6%' },
  { label: '€200 – €399', note: 'The highest share of offers a creator never answered.', n: '70', published: '25.9%', ignored: '40.9%' },
  { label: '€400 – €599', note: 'Directional only — this band rests on 9 distinct buying brands.', n: '36', published: '34.6%', ignored: '25.0%' },
  {
    label: '€600 and above',
    note: 'The strongest observed delivery band, but it fell from 80.6% in the 3 August snapshot. 17 distinct buying brands.',
    n: '52',
    published: '64.6%',
    ignored: '19.2%',
  },
]

const FAQ = [
  {
    q: 'What are the odds a sponsored LinkedIn post offer actually gets published?',
    a: 'Observed delivery rates vary by price band, but the relationship is correlational rather than causal. Across 300 sponsored-post bookings placed on the NaanoX marketplace between 14 June and 11 August 2026, 64.6% of settled bookings priced at €600 or more per post ended in a published post, against 30.4% of those priced under €200. The rate for the €200–€399 band was 25.9% and for €400–€599 it was 34.6% [NaanoX Index snapshot, 11 August 2026, n=300 created bookings]. These rates move: the €600+ band read 80.6% in the 3 August snapshot.',
  },
  {
    q: 'Why do cheap sponsored post offers fail?',
    a: 'The snapshot cannot establish why an individual offer fails. It does show that 41.6% of offers under €200 and 40.9% of offers between €200 and €399 expired without the creator responding, versus 19.2% of offers above €600. Price may be associated with brand readiness, brief quality, creator availability or other factors, so these rates are risk signals rather than causal estimates.',
  },
  {
    q: 'What is the median price actually paid for a sponsored LinkedIn post?',
    a: '€84 per post for a creator under 5,000 followers, €180 for 5,000–10,000, €300 for 10,000–25,000, €588 for 25,000–50,000, and €720 above 50,000 followers. These are transacted prices, brand-side and excluding VAT, from bookings placed on NaanoX between June and August 2026 [NaanoX Index, n=300].',
  },
  {
    q: 'Does paying more actually cause a post to be delivered?',
    a: 'Not necessarily, and this tool does not claim it does. The relationship is a correlation across a young dataset: a brand paying €600 typically also has a real budget, a properly written brief, and an internal owner who follows up, and any of those could be doing the work. What is directly measurable is that low-priced offers are far more likely to go unanswered — and that part is a creator-side behaviour you can price around.',
  },
  {
    q: "Should I just offer the creator's listed rate?",
    a: "In most cases, yes, for a first booking. Follower tier is a weak guide — follower count explains under a third of the variance in what creators charge (log-log R-squared of 0.289 across 769 creators open for bookings at the snapshot time), and at 10,000–25,000 followers the spread between the cheapest and dearest tenth of creators was 22.7x. The creator's own published rate is a far better anchor than any tier benchmark, including this one.",
  },
]

const METHOD_EN = [
  {
    lead: 'Source.',
    text: "NaanoX's own marketplace database, queried read-only on 11 August 2026 at 19:05 UTC. Every sponsored-post booking created between 14 June and 11 August 2026, normalised to price per post (n=300), plus the live listed rate of every creator open for bookings at that time (n=769). Bookings placed by NaanoX itself as a buyer are excluded. No cell below ten observations is published, and no individual creator, brand or amount appears anywhere.",
  },
  {
    lead: 'This is a correlation, not a causal claim.',
    text: 'Paying €600 does not make a post appear. A brand paying €600 usually also has a real budget, a written brief, and someone internally who chases the campaign — any of which could be doing the work. What is directly measurable, and is a creator-side behaviour, is the observed difference in unanswered-offer rates.',
  },
  {
    lead: 'Sample caveats.',
    text: 'The €400–€599 band rests on 36 bookings from only 9 distinct buying brands and should be read as directional. The figures move week to week: the €600+ delivery rate fell from 80.6% to 64.6% between the 3 August and 11 August snapshots on 11 extra bookings.',
  },
  {
    lead: 'What is deliberately absent.',
    text: 'No impressions, reach or cost-per-lead figure appears on this page. LinkedIn does not expose post impressions for third-party posts, and our tracked-link coverage is currently too partial to publish a clicks-per-post benchmark honestly. Both will be added when the underlying data supports them.',
  },
]

// FR capture translates "Source." and "Sample caveats." only.
const METHOD_FR = [
  {
    lead: 'Source.',
    text: 'La base de données de la marketplace NaanoX, interrogée en lecture seule le 11 août 2026 à 19 h 05 UTC. Tous les bookings de posts sponsorisés créés entre le 14 juin et le 11 août 2026, normalisés au prix par post (n=300), ainsi que le tarif affiché en direct de chaque créateur ouvert aux bookings à cette date (n=769). Les bookings pour lesquels NaanoX est l’acheteur sont exclus. Aucune cellule de moins de dix observations n’est publiée, et aucun créateur, aucune marque ni aucun montant individuel n’apparaît.',
  },
  METHOD_EN[1],
  {
    lead: 'Limites de l’échantillon.',
    text: 'La tranche de 400 € à 599 € repose sur 36 bookings provenant de seulement 9 marques acheteuses distinctes et doit être interprétée comme une indication. Les chiffres évoluent chaque semaine : le taux de livraison de la tranche à 600 € et plus est passé de 80,6 % à 64,6 % entre les instantanés du 3 et du 11 août, avec 11 bookings supplémentaires.',
  },
  METHOD_EN[3],
]

const EN = {
  back: 'Free Tools',
  h1: 'Sponsored Post Delivery Odds Estimator',
  intro:
    'Enter what you plan to offer a LinkedIn creator per post. We compare it to 300 real sponsored-post bookings and tell you how often offers at that price actually ended in a published post. Free, no account, nothing leaves your browser.',
  bandsHeading: 'What happens to an offer, by price band',
  bandsIntro:
    'Every sponsored-post booking created on NaanoX between 14 June and 1 August 2026, excluding bookings still awaiting a decision from the delivery-rate denominator. “Never answered” means the offer window closed without the creator responding at all.',
  bandsHeaders: ['Price per post', 'Bookings', 'Published', 'Never answered'],
  source: '[NaanoX Index, n=300 bookings, 14 June – 11 August 2026]',
  paidHeading: 'What brands actually paid, by audience size',
  paidIntro:
    "Transacted prices per sponsored post, brand-side and excluding VAT. Use these to sanity-check an offer — but remember that follower count explains under a third of what creators charge, so a specific creator's own listed rate is always the better anchor.",
  paidHeaders: ['Creator audience', 'n', 'P25', 'Median', 'P75'],
  paidNoteBefore: '. The full report, including listed-price dispersion and niche premiums, is in the ',
  paidNoteLink: 'LinkedIn sponsored post price index 2026',
  paidNoteAfter: '.',
  methodHeading: 'Method, and what this tool does not claim',
  method: METHOD_EN,
  faqHeading: 'Frequently asked questions',
  moreHeading: 'More free tools',
  open: 'Open',
  dark: {
    title: 'Book at the listed rate, and skip the guessing',
    text: 'Every creator on NaanoX publishes their own flat fee per post, so you never open with a number you had to invent. Contracts, escrow and invoicing handled — no monthly platform fee.',
    cta: 'Book a creator on NaanoX',
    href: 'https://naano.com/register',
  },
  light: {
    title: 'Not sure which creators to approach?',
    text: 'Describe your campaign and a real person at NaanoX builds you a hand-picked shortlist of relevant B2B creators, with their rates and audience fit, within 48 hours. Free, no account.',
    cta: 'Get a free shortlist',
    href: 'https://naano.com/selection',
  },
}

const COPY = {
  en: EN,
  fr: {
    ...EN,
    back: 'Outils gratuits',
    intro:
      'Indiquez ce que vous prévoyez de proposer à un créateur LinkedIn par post. Nous comparons ce montant à 300 bookings réels de posts sponsorisés et vous indiquons à quelle fréquence les offres à ce prix ont effectivement abouti à un post publié. Gratuit, sans compte, aucune donnée ne quitte votre navigateur.',
    source: '[NaanoX Index, n=300 bookings, 14 juin – 11 août 2026]',
    paidNoteBefore: '. Le rapport complet, avec la dispersion des prix affichés et les primes par niche, figure dans l’',
    paidNoteLink: 'indice 2026 du prix des posts LinkedIn sponsorisés',
    method: METHOD_FR,
    moreHeading: "Plus d'outils gratuits",
    open: 'Ouvrir',
  },
}

export default function DeliveryOddsEstimator() {
  const { locale } = useLocale()
  const c = COPY[locale]
  const more = [MORE_TOOLS.worth[locale], MORE_TOOLS.erc[locale], MORE_TOOLS.all[locale]]

  return (
    <SiteLayout title={META.title} description={META.description} className={TOOLS_MAIN_CLASS} deps={[locale]}>
      <ToolHero backLabel={c.back} title={c.h1} intro={c.intro} />

      <section className="pt-6 pb-16 sm:pb-20">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <OddsEstimator />
        </div>
      </section>

      <ToolSection>
        <SectionHeading>{c.bandsHeading}</SectionHeading>
        <p className="mt-4 text-[16px] leading-[1.65] text-[#55575E]">{c.bandsIntro}</p>
        <DataTable
          minWidth={620}
          headers={c.bandsHeaders}
          rows={BAND_ROWS.map((r) => ({
            key: r.label,
            cells: [
              {
                className: 'px-5 py-4 font-semibold text-[#17181C] whitespace-nowrap',
                content: (
                  <>
                    {r.label}
                    <span className="mt-1 block text-[13px] font-normal leading-snug text-[#6B6D74]">{r.note}</span>
                  </>
                ),
              },
              { className: 'px-5 py-4 align-top text-[#55575E]', content: r.n },
              { className: 'px-5 py-4 align-top font-semibold text-[#7C5CFC]', content: r.published },
              { className: 'px-5 py-4 align-top text-[#55575E]', content: r.ignored },
            ],
          }))}
        />
        <SourceNote>{c.source}</SourceNote>
      </ToolSection>

      <ToolSection>
        <SectionHeading>{c.paidHeading}</SectionHeading>
        <p className="mt-4 text-[16px] leading-[1.65] text-[#55575E]">{c.paidIntro}</p>
        <DataTable
          minWidth={560}
          headers={c.paidHeaders}
          rows={TIERS.map((t) => ({
            key: t.id,
            cells: [
              { className: 'px-5 py-4 font-semibold text-[#17181C]', content: t.label },
              { className: 'px-5 py-4 text-[#6B6D74]', content: String(t.n) },
              { className: 'px-5 py-4 text-[#55575E]', content: euro(t.p25) },
              { className: 'px-5 py-4 font-semibold text-[#7C5CFC]', content: euro(t.median) },
              { className: 'px-5 py-4 text-[#55575E]', content: euro(t.p75) },
            ],
          }))}
        />
        <SourceNote>
          {c.source}
          {c.paidNoteBefore}
          <InlineLink to="/blog/linkedin-sponsored-post-price-index-2026">{c.paidNoteLink}</InlineLink>
          {c.paidNoteAfter}
        </SourceNote>
      </ToolSection>

      <MethodSection heading={c.methodHeading} notes={c.method} />

      <FaqSection heading={c.faqHeading} items={FAQ} />

      <MoreFreeTools heading={c.moreHeading} openLabel={c.open} tools={more} />

      <CtaPair dark={c.dark} light={c.light} />
      <FooterCta />
    </SiteLayout>
  )
}
