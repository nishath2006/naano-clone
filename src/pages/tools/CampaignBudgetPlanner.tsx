import { useMemo, useState } from 'react'
import { FooterCta } from '@/components/site/FooterCta'
import { SiteLayout } from '@/layouts/SiteLayout'
import { useLocale, type Locale } from '@/lib/locale'
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
  title: 'Creator Campaign Budget Planner (Free) — NaanoX',
  description:
    'Turn a budget into published LinkedIn posts, not just booked ones. Built on 300 real sponsored-post bookings: transacted medians and historical delivery rates.',
}

/* ---------------------------------------------------------------------------
 * Data (NaanoX Index, n=300 bookings, 14 June – 11 August 2026)
 * ------------------------------------------------------------------------ */

type AllocationId = 'spread' | 'mid' | 'concentrated'

const ALLOCATIONS: { id: AllocationId; price: number; tierN: number }[] = [
  { id: 'spread', price: 84, tierN: 66 },
  { id: 'mid', price: 300, tierN: 118 },
  { id: 'concentrated', price: 720, tierN: 16 },
]

const BANDS = [
  { label: 'Under €200', min: 0, max: 200, deliveryRate: 30.4, nCreated: 142, nBrands: 22 },
  { label: '€200 – €399', min: 200, max: 400, deliveryRate: 25.9, nCreated: 70, nBrands: 13 },
  { label: '€400 – €599', min: 400, max: 600, deliveryRate: 34.6, nCreated: 36, nBrands: 9 },
  { label: '€600 and above', min: 600, max: null, deliveryRate: 64.6, nCreated: 52, nBrands: 17 },
]
type Band = (typeof BANDS)[number]

const bandFor = (price: number): Band => BANDS.find((b) => price >= b.min && (b.max === null || price < b.max)) ?? BANDS[BANDS.length - 1]
const euro = (n: number) => `€${Math.round(n).toLocaleString('en-US')}`

function parse(raw: string): number | null {
  const s = raw.trim()
  if (s === '') return null
  const n = Number(s)
  return !Number.isFinite(n) || n <= 0 ? null : n
}

/** Tiny ICU-style interpolation for the `{name}` placeholders of the captured messages. */
function fmt(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
}

/* ---------------------------------------------------------------------------
 * Messages (the live page ships this tool through next-intl, EN + FR)
 * ------------------------------------------------------------------------ */

const MSG = {
  en: {
    spread: 'Spread',
    mid: 'Mid-tier',
    concentrated: 'Concentrated',
    tierSpread: 'Creators under 5,000 followers',
    tierMid: 'Creators with 10,000–25,000 followers',
    tierConcentrated: 'Creators with 50,000+ followers',
    tierSub: '{tier} · median {price}/post (n={n})',
    yourPrice: 'Your price',
    customSub: '{price} per post · {band} band',
    budgetLabel: 'Your campaign budget (€)',
    budgetPlaceholder: 'e.g. 5000',
    customLabel: 'Your own price per post (€)',
    optional: '— optional',
    customPlaceholder: 'e.g. 250',
    empty:
      'Enter a budget to see how many sponsored posts it books at real transacted medians — and how many of those historically ended in a published post.',
    summary: '{budget} budget · expected published posts apply the historical settled delivery rate for each price band',
    thAllocation: 'Allocation',
    thBooked: 'Posts booked',
    thRate: 'Delivery rate',
    thExpected: 'Expected published',
    thCost: 'Cost per published post',
    best: 'On these historical rates, the {allocation} allocation produced the lowest cost per published post: {costPerPublished} against {price} per post booked.',
    noteTiming:
      'Plan the calendar on {p90} days, not {median}. Delivered bookings took a median of {median} days from booking to published post, with a 90th percentile of {p90} days (n=89).',
    noteVolatile:
      'Delivery rates are volatile: the €600+ band moved from 80.6% to 64.6% between the 3 August and 11 August snapshots on 11 extra bookings. Read every rate here with its sample size.',
    noteThin:
      'One of the rows above sits in the €400–€599 band, which rests on 36 bookings from only 9 distinct buying brands. Treat it as directional.',
    noteFollowers:
      'Follower count explains under a third of what creators charge (log-log R² = 0.289, n=769). These tier medians are a budgeting aid, not a recommended price for any specific creator.',
    calloutLead: 'How to use this result:',
    calloutText:
      'the delivery rates are historical associations across a young dataset, not causal promises — a brand paying more usually also briefs better and follows up. Use the third column to stop planning on posts booked, then judge creators on audience fit rather than on the tier medians used here.',
  },
  fr: {
    spread: 'Diffus',
    mid: 'Milieu de gamme',
    concentrated: 'Concentré',
    tierSpread: 'Créateurs de moins de 5 000 abonnés',
    tierMid: 'Créateurs de 10 000 à 25 000 abonnés',
    tierConcentrated: 'Créateurs de plus de 50 000 abonnés',
    tierSub: '{tier} · médiane {price}/post (n={n})',
    yourPrice: 'Votre prix',
    customSub: '{price} par post · tranche {band}',
    budgetLabel: 'Votre budget de campagne (€)',
    budgetPlaceholder: 'ex. 5 000',
    customLabel: 'Votre propre prix par post (€)',
    optional: '— facultatif',
    customPlaceholder: 'ex. 250',
    empty:
      "Saisissez un budget pour voir combien de posts sponsorisés il permet de réserver aux médianes réellement transigées — et combien d'entre eux ont historiquement abouti à un post publié.",
    summary: 'Budget de {budget} · les posts publiés attendus appliquent le taux de livraison historique observé pour chaque tranche de prix',
    thAllocation: 'Allocation',
    thBooked: 'Posts réservés',
    thRate: 'Taux de livraison',
    thExpected: 'Publiés attendus',
    thCost: 'Coût par post publié',
    best: "Sur ces taux historiques, l'allocation {allocation} produit le coût par post publié le plus faible : {costPerPublished} contre {price} par post réservé.",
    noteTiming:
      'Planifiez le calendrier sur {p90} jours, pas {median}. Les réservations livrées ont mis {median} jours en médiane entre la réservation et la publication, avec un 90e centile à {p90} jours (n=89).',
    noteVolatile:
      "Les taux de livraison sont volatils : la tranche ≥ 600 € est passée de 80,6 % à 64,6 % entre les snapshots du 3 et du 11 août, sur 11 réservations supplémentaires. Lisez chaque taux avec sa taille d'échantillon.",
    noteThin:
      "L'une des lignes ci-dessus se situe dans la tranche 400–599 €, qui repose sur 36 réservations issues de seulement 9 marques acheteuses distinctes. À considérer comme directionnel.",
    noteFollowers:
      "Le nombre d'abonnés explique moins d'un tiers de ce que facturent les créateurs (R² log-log = 0,289, n=769). Ces médianes par tranche sont une aide au budget, pas un prix recommandé pour un créateur donné.",
    calloutLead: 'Comment lire ce résultat :',
    calloutText:
      "les taux de livraison sont des associations historiques sur un jeu de données récent, pas des promesses causales — une marque qui paie davantage rédige aussi généralement de meilleurs briefs et relance. Servez-vous de la troisième colonne pour cesser de planifier sur les posts réservés, puis jugez les créateurs sur l'adéquation de leur audience plutôt que sur les médianes par tranche utilisées ici.",
  },
}

const INPUT =
  'mt-2 w-full min-h-11 rounded-xl border border-[#E4E1DC] bg-white px-4 py-3 text-[15px] text-[#17181C] placeholder:text-[#B4B4B0] shadow-[0_1px_2px_rgba(23,24,28,0.03)] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] focus:border-transparent'

type Row = {
  id: string
  label: string
  sublabel: string
  price: number
  bandLabel: string
  deliveryRate: number
  postsBooked: number
  expectedPublished: number
  costPerPublished: number | null
  thinCell: boolean
}

function buildRow(id: string, label: string, sublabel: string, price: number, band: Band, budget: number): Row {
  const postsBooked = Math.floor(budget / price)
  const expectedPublished = (postsBooked * band.deliveryRate) / 100
  return {
    id,
    label,
    sublabel,
    price,
    bandLabel: band.label,
    deliveryRate: band.deliveryRate,
    postsBooked,
    expectedPublished,
    costPerPublished: expectedPublished > 0 ? budget / expectedPublished : null,
    thinCell: band.nBrands < 10,
  }
}

/* ---------------------------------------------------------------------------
 * Calculator (mirrors the live client component)
 * ------------------------------------------------------------------------ */

function BudgetPlanner({ locale }: { locale: Locale }) {
  const m = MSG[locale]
  const [budget, setBudget] = useState('')
  const [customPrice, setCustomPrice] = useState('')

  const result = useMemo(() => {
    const b = parse(budget)
    if (b === null) return null
    const labelOf: Record<AllocationId, string> = { spread: m.spread, mid: m.mid, concentrated: m.concentrated }
    const tierOf: Record<AllocationId, string> = { spread: m.tierSpread, mid: m.tierMid, concentrated: m.tierConcentrated }
    const rows = ALLOCATIONS.map((a) =>
      buildRow(a.id, labelOf[a.id], fmt(m.tierSub, { tier: tierOf[a.id], price: euro(a.price), n: String(a.tierN) }), a.price, bandFor(a.price), b),
    )
    const custom = parse(customPrice)
    if (custom !== null) {
      const band = bandFor(custom)
      rows.push(buildRow('custom', m.yourPrice, fmt(m.customSub, { price: euro(custom), band: band.label }), custom, band, b))
    }
    const scored = rows.filter((r) => r.costPerPublished !== null)
    const best =
      scored.length > 0
        ? scored.reduce((acc, r) => ((acc.costPerPublished ?? Infinity) <= (r.costPerPublished ?? Infinity) ? acc : r))
        : null
    return { rows, best, budget: b }
  }, [budget, customPrice, m])

  return (
    <div className="rounded-2xl border border-[#ECEAE6] bg-white p-6 sm:p-8 shadow-[0_18px_44px_rgba(23,24,28,0.08)]">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="text-[15px] font-semibold text-[#17181C]">
            {m.budgetLabel}
          </label>
          <input
            id="budget"
            type="number"
            inputMode="decimal"
            min="1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={m.budgetPlaceholder}
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="customPrice" className="text-[15px] font-semibold text-[#17181C]">
            {m.customLabel} <span className="font-normal text-[#6B6D74]">{m.optional}</span>
          </label>
          <input
            id="customPrice"
            type="number"
            inputMode="decimal"
            min="1"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            placeholder={m.customPlaceholder}
            className={INPUT}
          />
        </div>
      </div>
      <div className="mt-8 border-t border-[#ECEAE6] pt-8">
        {result === null ? (
          <p className="text-[16px] leading-relaxed text-[#55575E]">{m.empty}</p>
        ) : (
          <div>
            <p className="text-[14px] text-[#6B6D74]">{fmt(m.summary, { budget: euro(result.budget) })}</p>
            <DataTable
              minWidth={640}
              wrapperClassName="mt-5 overflow-x-auto rounded-2xl border border-[#ECEAE6]"
              headers={[m.thAllocation, m.thBooked, m.thRate, m.thExpected, m.thCost]}
              rows={result.rows.map((r) => ({
                key: r.id,
                cells: [
                  {
                    className: 'px-5 py-4 align-top font-semibold text-[#17181C]',
                    content: (
                      <>
                        {r.label}
                        <span className="mt-1 block text-[13px] font-normal leading-snug text-[#6B6D74]">{r.sublabel}</span>
                      </>
                    ),
                  },
                  { className: 'px-5 py-4 align-top text-[#55575E]', content: r.postsBooked },
                  { className: 'px-5 py-4 align-top text-[#55575E]', content: `${r.deliveryRate}%` },
                  { className: 'px-5 py-4 align-top text-[#55575E]', content: r.expectedPublished.toFixed(1) },
                  {
                    className: 'px-5 py-4 align-top font-semibold text-[#7C5CFC]',
                    content: r.costPerPublished === null ? '—' : euro(r.costPerPublished),
                  },
                ],
              }))}
            />
            {result.best !== null && result.best.costPerPublished !== null && (
              <p className="mt-6 text-[18px] leading-relaxed text-[#17181C]">
                {fmt(m.best, {
                  allocation: result.best.label.toLowerCase(),
                  costPerPublished: euro(result.best.costPerPublished),
                  price: euro(result.best.price),
                })}
              </p>
            )}
            <NoteList
              items={[
                { text: fmt(m.noteTiming, { p90: '14.1', median: '8' }) },
                { text: m.noteVolatile },
                ...(result.rows.some((r) => r.thinCell) ? [{ text: m.noteThin, tone: 'amber' as const }] : []),
                { text: m.noteFollowers },
              ]}
            />
            <ResultCallout lead={m.calloutLead} text={m.calloutText} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Page copy
 * ------------------------------------------------------------------------ */

const FAQ = [
  {
    q: 'How many sponsored LinkedIn posts can I get for my budget?',
    a: 'Divide the budget by the transacted median for the audience size you are buying, then multiply by the historical delivery rate for that price band. On NaanoX, the transacted medians were €84 per post under 5,000 followers, €300 at 10,000–25,000, and €720 above 50,000, while settled delivery rates ranged from 25.9% to 64.6% depending on the band [NaanoX Index snapshot, n=300 bookings, 11 August 2026 at 19:05 UTC]. A €5,000 budget books 59 posts at €84 but historically produced around 18 published ones.',
  },
  {
    q: 'Why should I plan on published posts instead of booked posts?',
    a: 'Because the two differ by a factor of three to five. Of the bookings that reached a final state on NaanoX, 30.4% priced under €200 ended in a published post against 64.6% priced at €600 or more, and 41.6% of sub-€200 offers expired without the creator ever answering [NaanoX Index snapshot, n=300 created bookings, 11 August 2026 at 19:05 UTC]. A forecast built on posts booked has been systematically optimistic at the low end.',
  },
  {
    q: 'Is it cheaper per published post to book many small creators or a few large ones?',
    a: "Many small creators, by a wide margin. On these historical rates the lowest band costs roughly €280 per published post, against roughly €1,100–€1,300 for both the mid-tier and concentrated allocations — the cheap band's weak delivery rate is more than offset by how many more posts the same budget buys. The two upper allocations land close enough to each other that which one comes out ahead depends on your exact budget, so the tool computes it rather than asserting it. This is an observed association across a nine-week dataset, not a rule, and it is the opposite of the usual advice — the tool reports it because it is what the data says, not because it is convenient.",
  },
  {
    q: 'How long should I allow between booking a creator and the post going live?',
    a: 'Plan on 14 days rather than 8. Delivered bookings took a median of 8.0 days from booking to published post, with a 90th percentile of 14.1 days, and the creator accepted the offer in a median of 35 minutes [NaanoX Index snapshot, n=89 delivered bookings, 11 August 2026 at 19:05 UTC]. Almost all the elapsed time sits after acceptance, in drafting and approval.',
  },
  {
    q: 'Does this planner assume that paying more causes a post to be delivered?',
    a: 'No. The delivery rates are correlations across a young and visibly volatile dataset — the €600+ rate moved from 80.6% to 64.6% between the 3 August and 11 August snapshots on 11 additional bookings. A brand paying €600 typically also has a real budget, a written brief and an internal owner who follows up, and any of those could be doing the work. The planner applies observed historical rates to a budget; it does not claim that raising a price changes an outcome.',
  },
]

type AllocationRow = { label: string; tier: string; desc: string; median: string; band: string; published: string }

const COPY = {
  en: {
    back: 'Free Tools',
    h1: 'Creator Campaign Budget Planner',
    intro:
      'Enter a budget and see how many sponsored LinkedIn posts it books at real transacted medians — and, more usefully, how many of those historically ended in a published post. Built on 300 real bookings. Free, no account, nothing leaves your browser.',
    allocHeading: 'The three allocations, and where they come from',
    allocIntro:
      'Each allocation uses the transacted median price for a real follower tier, then applies the historical settled delivery rate for the price band that median falls into. The band is derived from the price, so a preset always agrees with what the custom-price input returns for the same number. Bookings still awaiting a decision are excluded from the delivery-rate denominator.',
    allocHeaders: ['Allocation', 'Median price', 'Band', 'Published'],
    allocRows: [
      { label: 'Spread', tier: 'Under 5,000 followers', desc: 'Most posts per euro, lowest delivery rate. 66 bookings set this median.', median: '€84', band: 'Under €200', published: '30.4%' },
      { label: 'Mid-tier', tier: '10,000 – 25,000 followers', desc: '40.9% of these offers went unanswered — the second-worst response rate.', median: '€300', band: '€200 – €399', published: '25.9%' },
      { label: 'Concentrated', tier: '50,000+ followers', desc: 'Fewest posts, strongest observed delivery. Thin tier: 16 bookings set this median.', median: '€720', band: '€600 and above', published: '64.6%' },
    ] as AllocationRow[],
    note: {
      before: '[NaanoX Index, n=300 bookings, 14 June – 11 August 2026]. The timing side of the same dataset is in ',
      timing: 'how long a B2B creator campaign takes',
      middle: ', and the full price distribution is in the ',
      pricing: 'LinkedIn sponsored post price index 2026',
      after: '.',
    },
    methodHeading: 'Method, and what this planner does not claim',
    method: [
      {
        lead: 'Source.',
        text: "NaanoX's own marketplace database, queried read-only on 11 August 2026 at 19:05 UTC. Every sponsored-post booking created between 14 June and 11 August 2026, normalised to price per post (n=300), plus the 89 of those that reached a published post for the timing figures. Bookings placed by NaanoX itself as a buyer are excluded. No cell below ten observations is published, and no individual creator, brand or amount appears anywhere.",
      },
      {
        lead: 'This is a correlation, not a causal claim.',
        text: 'Paying €600 does not make a post appear. A brand paying €600 usually also has a real budget, a written brief, and someone internally who chases the campaign — any of which could be doing the work. The planner applies observed historical rates to a budget; it does not model what would happen if you changed a price.',
      },
      {
        lead: 'Expected published posts are an average, not a guarantee.',
        text: 'A 30.4% delivery rate applied to ten bookings gives an expectation of about three published posts, but the actual outcome for any single campaign varies widely — especially at small booking counts. Treat the third column as a planning correction, not a forecast for one campaign.',
      },
      {
        lead: 'Sample caveats, and how much these rates move.',
        text: 'The €400–€599 band rests on 36 bookings from only 9 distinct buying brands and should be read as directional. More importantly, these rates are not stable yet: between the 3 August and 11 August snapshots the €600+ delivery rate fell from 80.6% to 64.6% on 11 additional bookings, and the unanswered-offer rate in that band rose from 8.1% to 19.2%. The direction of the effect has held in every cut so far; its size has not. Re-read this page against the snapshot date rather than assuming the numbers are settled.',
      },
      {
        lead: 'What is deliberately absent.',
        text: 'No impressions, reach, cost-per-lead or cost-per-click figure appears on this page. LinkedIn does not expose post impressions for third-party posts, and our tracked-link coverage is currently too partial to publish a clicks-per-post benchmark honestly. NaanoX charges a flat fee per sponsored post set by each creator, and does not sell per click.',
      },
    ],
    faqHeading: 'Frequently asked questions',
    moreHeading: 'More free tools',
    open: 'Open',
    dark: {
      title: 'See the real prices before you commit a budget',
      text: 'Every creator on NaanoX publishes their own flat fee per post, so you can build the plan against actual numbers instead of estimates. Contracts, escrow and invoicing handled — no monthly platform fee.',
      cta: 'Book a creator on NaanoX',
      href: 'https://naano.com/register',
    },
    light: {
      title: 'Want the shortlist before the spreadsheet?',
      text: 'Describe your campaign and a real person at NaanoX builds you a hand-picked shortlist of relevant B2B creators, with their rates and audience fit, within 48 hours. Free, no account.',
      cta: 'Get a free shortlist',
      href: 'https://naano.com/selection',
    },
  },
  fr: {
    back: 'Outils gratuits',
    h1: 'Planificateur de budget de campagne créateurs',
    intro:
      "Saisissez un budget et voyez combien de posts LinkedIn sponsorisés il permet de réserver aux médianes réellement transigées — et, plus utile encore, combien d'entre eux ont historiquement abouti à un post publié. Construit sur 300 réservations réelles. Gratuit, sans compte, rien ne quitte votre navigateur.",
    allocHeading: "Les trois allocations, et d'où elles viennent",
    allocIntro:
      "Chaque allocation part du prix médian réellement transigé pour une tranche d'abonnés réelle, puis applique le taux de livraison historique observé pour la tranche de prix dans laquelle cette médiane tombe. La tranche est déduite du prix, de sorte qu'une allocation prédéfinie donne toujours le même résultat que la saisie d'un prix personnalisé. Les réservations encore en attente de décision sont exclues du dénominateur du taux de livraison.",
    allocHeaders: ['Allocation', 'Prix médian', 'Tranche', 'Publiés'],
    allocRows: [
      { label: 'Diffus', tier: 'Moins de 5 000 abonnés', desc: 'Le plus de posts par euro, le taux de livraison le plus faible. 66 réservations fixent cette médiane.', median: '€84', band: 'Moins de 200 €', published: '30.4%' },
      { label: 'Milieu de gamme', tier: '10 000 – 25 000 abonnés', desc: '40,9 % de ces offres sont restées sans réponse — le deuxième plus mauvais taux de réponse.', median: '€300', band: '200 – 399 €', published: '25.9%' },
      { label: 'Concentré', tier: 'Plus de 50 000 abonnés', desc: 'Le moins de posts, la meilleure livraison observée. Tranche mince : 16 réservations fixent cette médiane.', median: '€720', band: '600 € et plus', published: '64.6%' },
    ] as AllocationRow[],
    note: {
      before: '[NaanoX Index, n=300 bookings, 14 juin – 11 août 2026]. Le volet calendrier du même jeu de données est présenté dans ',
      timing: 'combien de temps prend une campagne de créateurs B2B',
      middle: ', et la distribution complète des prix figure dans l’',
      pricing: 'indice 2026 du prix des posts LinkedIn sponsorisés',
      after: '.',
    },
    methodHeading: 'Méthode, et ce que cet outil ne prétend pas',
    method: [
      {
        lead: 'Source.',
        text: "La base marketplace de NaanoX, interrogée en lecture seule le 11 août 2026 à 19h05 UTC. Toutes les réservations de post sponsorisé créées entre le 14 juin et le 11 août 2026, ramenées au prix par post (n=300), plus les 89 d'entre elles qui ont abouti à un post publié pour les délais. Les réservations passées par NaanoX en tant qu'acheteur sont exclues. Aucune cellule de moins de dix observations n'est publiée, et aucun créateur, aucune marque et aucun montant individuel n'apparaît nulle part.",
      },
      {
        lead: "C'est une corrélation, pas une relation de cause à effet.",
        text: "Payer 600 € ne fait pas apparaître un post. Une marque qui paie 600 € a généralement aussi un vrai budget, un brief écrit et une personne en interne qui relance la campagne — n'importe lequel de ces facteurs peut être à l'œuvre. L'outil applique des taux historiques observés à un budget ; il ne modélise pas ce qui se passerait si vous changiez de prix.",
      },
      {
        lead: 'Les posts publiés attendus sont une moyenne, pas une garantie.',
        text: "Un taux de livraison de 30,4 % appliqué à dix réservations donne une espérance d'environ trois posts publiés, mais le résultat réel d'une campagne donnée varie fortement — surtout sur de petits nombres de réservations. Traitez la troisième colonne comme une correction de planification, pas comme une prévision pour une campagne.",
      },
      {
        lead: "Réserves d'échantillon, et à quel point ces taux bougent.",
        text: "La tranche 400–599 € repose sur 36 réservations issues de seulement 9 marques acheteuses distinctes et doit être lue comme directionnelle. Plus important : ces taux ne sont pas encore stables. Entre les snapshots du 3 et du 11 août, le taux de livraison de la tranche ≥ 600 € est tombé de 80,6 % à 64,6 % sur 11 réservations supplémentaires, et le taux d'offres restées sans réponse dans cette tranche est monté de 8,1 % à 19,2 %. Le sens de l'effet s'est vérifié dans toutes les coupes ; son ampleur non. Relisez cette page au regard de la date du snapshot plutôt qu'en supposant les chiffres définitifs.",
      },
      {
        lead: 'Ce qui est délibérément absent.',
        text: "Aucun chiffre d'impressions, de portée, de coût par lead ou de coût par clic n'apparaît sur cette page. LinkedIn n'expose pas les impressions des posts tiers, et la couverture de nos liens trackés est aujourd'hui trop partielle pour publier honnêtement un benchmark de clics par post. NaanoX facture un forfait par post sponsorisé fixé par chaque créateur, et ne vend pas au clic.",
      },
    ],
    faqHeading: 'Questions fréquentes',
    moreHeading: "Plus d'outils gratuits",
    open: 'Ouvrir',
    dark: {
      title: "Voyez les vrais prix avant d'engager un budget",
      text: 'Chaque créateur sur NaanoX publie son propre forfait par post, ce qui vous permet de bâtir le plan sur des chiffres réels plutôt que sur des estimations. Contrats, séquestre et facturation pris en charge — sans abonnement mensuel.',
      cta: 'Réserver un créateur sur NaanoX',
      href: 'https://naano.com/register',
    },
    light: {
      title: 'Vous voulez la sélection avant le tableur ?',
      text: "Décrivez votre campagne et une vraie personne chez NaanoX vous construit une sélection de créateurs B2B pertinents, avec leurs tarifs et l'adéquation de leur audience, sous 48 heures. Gratuit, sans compte.",
      cta: 'Obtenir une sélection gratuite',
      href: 'https://naano.com/selection',
    },
  },
}

export default function CampaignBudgetPlanner() {
  const { locale } = useLocale()
  const c = COPY[locale]
  const more = [MORE_TOOLS.oddsBudgetPage[locale], MORE_TOOLS.worth[locale], MORE_TOOLS.all[locale]]

  return (
    <SiteLayout title={META.title} description={META.description} className={TOOLS_MAIN_CLASS} deps={[locale]}>
      <ToolHero backLabel={c.back} title={c.h1} intro={c.intro} />

      <section className="pt-6 pb-16 sm:pb-20">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <BudgetPlanner key={locale} locale={locale} />
        </div>
      </section>

      <ToolSection>
        <SectionHeading>{c.allocHeading}</SectionHeading>
        <p className="mt-4 text-[16px] leading-[1.65] text-[#55575E]">{c.allocIntro}</p>
        <DataTable
          minWidth={640}
          headers={c.allocHeaders}
          rows={c.allocRows.map((r) => ({
            key: r.label,
            cells: [
              {
                className: 'px-5 py-4 align-top font-semibold text-[#17181C]',
                content: (
                  <>
                    {r.label}
                    <span className="mt-1 block text-[13px] font-normal leading-snug text-[#6B6D74]">
                      {r.tier}. {r.desc}
                    </span>
                  </>
                ),
              },
              { className: 'px-5 py-4 align-top text-[#55575E] whitespace-nowrap', content: r.median },
              { className: 'px-5 py-4 align-top text-[#55575E] whitespace-nowrap', content: r.band },
              { className: 'px-5 py-4 align-top font-semibold text-[#7C5CFC]', content: r.published },
            ],
          }))}
        />
        <SourceNote>
          {c.note.before}
          <InlineLink to="/blog/how-long-b2b-creator-campaign-takes">{c.note.timing}</InlineLink>
          {c.note.middle}
          <InlineLink to="/blog/linkedin-sponsored-post-price-index-2026">{c.note.pricing}</InlineLink>
          {c.note.after}
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
