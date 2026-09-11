import type { Seg } from '@/components/site/TextLink'
import type { TocItem } from '@/components/site/TableOfContents'

/** A string that the live EN article swaps when the `locale` cookie is `fr`. */
export type L = { en: string; fr: string }

export type RankedPlatform = { name: string; tagline: string; body: string }
export type FaqEntry = { q: string; a: string }

/* ------------------------------------------------------------------ */
/* Configurator (client component on the live site)                    */
/* ------------------------------------------------------------------ */

export type PlatformKey = 'naano' | 'favikon' | 'kolsquare' | 'upfluence' | 'traackr' | 'skeepers'

export type QuizQuestion = {
  id: 'channel' | 'goal' | 'pricing'
  prompt: L
  options: { label: L; scores: Partial<Record<PlatformKey, number>> }[]
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'channel',
    prompt: { en: 'Where does your target audience actually spend time?', fr: 'Où votre audience cible passe-t-elle réellement son temps ?' },
    options: [
      { label: { en: 'LinkedIn — we sell to professionals (B2B)', fr: 'LinkedIn — nous vendons à des professionnels (B2B)' }, scores: { naano: 3, favikon: 2 } },
      { label: { en: 'Instagram, TikTok or YouTube — we sell to consumers', fr: 'Instagram, TikTok ou YouTube — nous vendons au grand public' }, scores: { kolsquare: 3, upfluence: 2, skeepers: 2 } },
      { label: { en: 'Everywhere — large multi-channel brand program', fr: 'Partout — grand programme de marque multi-canal' }, scores: { traackr: 3, kolsquare: 1, upfluence: 1 } },
    ],
  },
  {
    id: 'goal',
    prompt: { en: 'What is the primary outcome you need?', fr: 'Quel résultat principal cherchez-vous ?' },
    options: [
      { label: { en: 'Qualified clicks and pipeline from creator posts', fr: 'Des clics qualifiés et du pipeline via les posts créateurs' }, scores: { naano: 3 } },
      { label: { en: 'Brand awareness and reach at scale', fr: 'De la notoriété et de la portée à grande échelle' }, scores: { kolsquare: 2, traackr: 2 } },
      { label: { en: 'UGC, product reviews and e-commerce sales', fr: "De l'UGC, des avis produits et des ventes e-commerce" }, scores: { skeepers: 3, upfluence: 2 } },
      { label: { en: 'Creator research, rankings and audience data', fr: "De la recherche de créateurs, classements et données d'audience" }, scores: { favikon: 3, traackr: 1 } },
    ],
  },
  {
    id: 'pricing',
    prompt: { en: 'How do you want to pay?', fr: 'Comment voulez-vous payer ?' },
    options: [
      { label: { en: 'Fixed price per post, no subscription or retainer', fr: 'Prix fixe par post, sans abonnement ni retainer' }, scores: { naano: 3 } },
      { label: { en: 'Monthly software subscription', fr: 'Abonnement logiciel mensuel' }, scores: { favikon: 2, upfluence: 2, kolsquare: 1 } },
      { label: { en: 'Annual enterprise contract with managed services', fr: 'Contrat enterprise annuel avec services managés' }, scores: { traackr: 2, kolsquare: 2, skeepers: 1 } },
    ],
  },
]

export const quizVerdicts: Record<PlatformKey, { name: string; verdict: L; rank: L }> = {
  naano: {
    name: 'Naano',
    verdict: {
      en: 'LinkedIn-native B2B creator marketplace. Fixed per-post pricing from €20, 2,000+ vetted micro-creators, qualified-click tracking per post. Best fit when the goal is B2B pipeline, not reach.',
      fr: "Marketplace de créateurs B2B native LinkedIn. Prix fixes dès 20 € par post, 2 000+ micro-créateurs vérifiés, tracking des clics qualifiés post par post. Le meilleur choix quand l'objectif est le pipeline B2B, pas la portée.",
    },
    rank: { en: '#1 in our ranking', fr: 'N°1 de notre classement' },
  },
  favikon: {
    name: 'Favikon',
    verdict: {
      en: 'Strongest for creator research: AI rankings of LinkedIn and X creators. You still handle outreach, negotiation and payment yourself.',
      fr: "Le plus fort en recherche de créateurs : classements IA des créateurs LinkedIn et X. L'outreach, la négociation et le paiement restent à votre charge.",
    },
    rank: { en: '#2 in our ranking', fr: 'N°2 de notre classement' },
  },
  kolsquare: {
    name: 'Kolsquare',
    verdict: {
      en: 'European multi-channel influencer platform, strongest on Instagram/TikTok/YouTube discovery and campaign reporting for consumer brands.',
      fr: "Plateforme d'influence européenne multi-canal, la plus forte sur la découverte et le reporting Instagram/TikTok/YouTube pour les marques grand public.",
    },
    rank: { en: '#3 in our ranking', fr: 'N°3 de notre classement' },
  },
  upfluence: {
    name: 'Upfluence',
    verdict: {
      en: 'Influencer database plus outreach and affiliate tooling, built around e-commerce (Shopify-centric) workflows.',
      fr: "Base d'influenceurs avec outreach et affiliation, construite autour des workflows e-commerce (centrés Shopify).",
    },
    rank: { en: '#4 in our ranking', fr: 'N°4 de notre classement' },
  },
  traackr: {
    name: 'Traackr',
    verdict: {
      en: 'Enterprise influencer relationship management and measurement, mostly used by global consumer and beauty brands.',
      fr: 'Gestion de la relation influenceurs et mesure au niveau enterprise, surtout utilisée par les grandes marques grand public et beauté.',
    },
    rank: { en: '#5 in our ranking', fr: 'N°5 de notre classement' },
  },
  skeepers: {
    name: 'Skeepers',
    verdict: {
      en: 'UGC, ratings-and-reviews and gifted micro-influencer campaigns for e-commerce brands.',
      fr: 'UGC, avis clients et campagnes de micro-influence par gifting pour les marques e-commerce.',
    },
    rank: { en: '#6 in our ranking', fr: 'N°6 de notre classement' },
  },
}

export const quizCopy = {
  en: {
    eyebrow: '60-second configurator',
    title: 'Which platform fits your case?',
    match: 'Your match',
    cta: 'Start a campaign on Naano',
    compare: 'See how it compares feature by feature',
    compareHref: '#comparison-table',
  },
  fr: {
    eyebrow: 'Configurateur en 60 secondes',
    title: 'Quelle plateforme pour votre cas ?',
    match: 'Votre match',
    cta: 'Lancer une campagne sur Naano',
    compare: 'Voir le comparatif critère par critère',
    compareHref: '#comparatif',
  },
}

/* ------------------------------------------------------------------ */
/* English article — /best-b2b-influencer-marketing-platforms-2026     */
/* ------------------------------------------------------------------ */

export const bestEn = {
  title: 'Best B2B Influencer Marketing Platforms 2026: 6 Compared',
  description:
    'Naano, Favikon, Kolsquare, Upfluence, Traackr and Skeepers compared on B2B fit, pricing and attribution — with real transacted post prices (median €117 under 10K followers), not list prices.',
  hero: {
    kicker: '2026 Ranking',
    readTime: '11 min read',
    lang: 'EN',
    h1: 'The Best B2B Influencer Marketing Platforms in 2026, Ranked',
    lede: 'Six platforms compared feature by feature — Naano, Favikon, Kolsquare, Upfluence, Traackr, and Skeepers — with pricing models, creator types, attribution, and an honest read on which one fits which use case.',
    meta: 'Published July 21, 2026 · Authored by the Naano team · Updated for 2026 pricing and positioning',
  },
  toc: [
    { id: 'quiz', text: 'Which platform for my case?' },
    { id: 'the-ranking', text: 'The ranking' },
    { id: 'comparison-table', text: 'Feature-by-feature comparison' },
    { id: 'platform-reviews', text: 'Platform-by-platform review' },
    { id: 'how-we-ranked', text: 'How we ranked' },
    { id: 'faq', text: 'FAQ' },
    { id: 'further-reading', text: 'Further reading' },
  ] satisfies TocItem[],
  tocLabel: 'On this page',
  intro:
    '“Best B2B influencer marketing platform” is a trickier question than it looks, because most influencer platforms were built for consumer brands on Instagram and TikTok, then repackaged for B2B. This ranking separates the platforms that are structurally built for B2B — LinkedIn audiences, professional buying committees, pipeline metrics — from the ones that are excellent at something else. Full disclosure: this page is published by Naano, and Naano ranks first for LinkedIn-first B2B use cases. The comparison table and per-platform reviews below explain exactly where each alternative wins instead.',
  rankingH2: 'The ranking: 6 best B2B influencer marketing platforms in 2026',
  ranking: [
    {
      name: 'Naano',
      tagline: 'Best overall for B2B — LinkedIn-native creator marketplace',
      body: 'Naano is the only platform on this list built exclusively for B2B: a marketplace of 2,000+ vetted LinkedIn micro-creators, each setting a flat price per sponsored post, with no monthly platform fee and tracked links on every post. The median post transacted at €117 for a creator under 10,000 followers and €312 at 10,000–25,000 followers [Naano Index, n=239, June–August 2026]. Median time from booking to publication is 7.8 days. Best fit for B2B SaaS teams that want pipeline, not reach.',
    },
    {
      name: 'Favikon',
      tagline: 'Best for B2B creator research and rankings',
      body: 'Favikon is an AI-driven creator intelligence tool that ranks creators on LinkedIn and X by niche and influence score. Strong for discovering who matters in a vertical; it does not handle booking, payment, or attribution, so you run outreach and campaigns yourself.',
    },
    {
      name: 'Kolsquare',
      tagline: 'Best for European multi-channel consumer campaigns',
      body: 'Kolsquare is a European (French) influencer marketing platform with a large profile database, campaign management, and reporting across Instagram, TikTok, and YouTube. GDPR-native and strong for EU consumer brands; LinkedIn and B2B coverage is limited.',
    },
    {
      name: 'Upfluence',
      tagline: 'Best for e-commerce and affiliate programs',
      body: 'Upfluence combines an influencer search database with outreach, affiliate links, and Shopify-centric integrations. Built for e-commerce revenue attribution on consumer social channels rather than for B2B professional audiences.',
    },
    {
      name: 'Traackr',
      tagline: 'Best for enterprise influencer relationship management',
      body: 'Traackr is an enterprise IRM and measurement platform used by global consumer and beauty brands to manage large influencer programs, budgets, and compliance across markets. Powerful, but priced and designed for enterprise B2C programs.',
    },
    {
      name: 'Skeepers',
      tagline: 'Best for UGC and consumer reviews at scale',
      body: 'Skeepers runs UGC, ratings-and-reviews, and gifted micro-influencer campaigns for e-commerce brands. A fit for consumer product feedback loops; not designed for B2B lead generation.',
    },
  ] satisfies RankedPlatform[],
  tableH2: 'Feature-by-feature comparison',
  tableIntro:
    'The table below compares the six platforms on the dimensions that actually decide a B2B purchase: channel focus, pricing model, creator type, whether booking and payment are handled for you, and what attribution you get per post.',
  tableHead: ['Feature', 'Naano', 'Kolsquare', 'Skeepers', 'Favikon', 'Upfluence', 'Traackr'],
  tableRows: [
    ['B2B / LinkedIn focus', 'LinkedIn-only, B2B-native', 'Consumer channels first', 'Consumer e-commerce', 'LinkedIn + X rankings', 'Consumer e-commerce', 'Consumer / beauty enterprise'],
    ['Model', 'Marketplace: book creators directly', 'Database + campaign suite', 'UGC / review campaigns', 'Creator intelligence only', 'Database + outreach + affiliate', 'Influencer relationship mgmt'],
    ['Pricing model', 'Creator-set flat price per post (median €117 under 10K followers); no monthly fee', 'Annual software license (quote)', 'Annual license (quote)', 'Monthly subscription', 'Annual contract (quote)', 'Enterprise contract (quote)'],
    ['Creator type', 'Vetted B2B LinkedIn creators (1K–500K)', 'Macro + micro, all niches', 'Nano/micro consumer creators', 'Ranked, not contracted', 'Macro + micro consumer', 'Macro / celebrity tiers'],
    ['Booking & payment handled', "Yes — checkout at the creator's flat price", 'Partial (campaign tools)', 'Yes (gifting model)', 'No', 'Partial (negotiated)', 'Partial (program mgmt)'],
    ['Per-post attribution', 'UTM-tracked links per post', 'Reach / engagement reporting', 'Reviews & content metrics', 'No campaign tracking', 'Affiliate sales tracking', 'Brand-lift style measurement'],
    ['Time to first post', '7 days median', 'Weeks (campaign setup)', 'Weeks (product seeding)', 'N/A (research tool)', 'Weeks (outreach cycles)', 'Weeks–months (programs)'],
  ],
  tableNote: 'Competitor characteristics reflect public positioning and pricing pages as of July 2026. Quote-based pricing varies by contract; verify current terms with each vendor.',
  reviewsH2: 'Platform-by-platform: where each one actually wins',
  /** First review paragraph is localised when the FR cookie is set on the EN URL. */
  naanoReview: {
    en: [
      { t: 'Naano', strong: true },
      ' — the structural difference is that Naano is a transactional marketplace, not a database: every creator publishes a flat offer price per post, booking and payment happen in the platform, and every published post carries UTM-tracked links back to the campaign. The median post transacted at €117 for a creator under 10,000 followers and €312 at 10,000–25,000 followers (',
      { t: 'the full price index, n=239', href: '/blog/linkedin-sponsored-post-price-index-2026' },
      '). Weakness: LinkedIn only — if your buyers are not on LinkedIn, none of this matters.',
    ],
    fr: [
      { t: 'Naano', strong: true },
      ' — la différence structurelle, c’est que Naano est une marketplace transactionnelle, pas une base de données : chaque créateur publie un tarif forfaitaire par post, la réservation et le paiement se font sur la plateforme, et chaque post publié contient des liens UTM vers la campagne. Le prix médian d’un post transigé est de 117 € pour un créateur de moins de 10 000 followers et de 312 € entre 10 000 et 25 000 followers (',
      { t: "l'indice de prix complet, n=239", href: '/blog/linkedin-sponsored-post-price-index-2026' },
      '). Weakness: LinkedIn only — if your buyers are not on LinkedIn, none of this matters.',
    ],
  } satisfies { en: Seg[]; fr: Seg[] },
  reviews: [
    [
      { t: 'Favikon', strong: true },
      ' — the best research layer for B2B creators. Its AI rankings of LinkedIn and X creators by niche are genuinely useful for mapping who matters in a vertical. It stops at intelligence: outreach, negotiation, payment, and tracking remain your problem. Many teams pair Favikon research with a transactional marketplace (',
      { t: 'detailed Naano vs Favikon comparison', href: '/blog/naano-vs-favikon' },
      ').',
    ],
    [
      { t: 'Kolsquare', strong: true },
      ' — the strongest European option for consumer campaigns. Large profile database, GDPR-native, solid campaign reporting across Instagram, TikTok, and YouTube. For B2B it inherits the consumer-platform problem: LinkedIn coverage is thin and reporting is reach-centric rather than pipeline-centric (',
      { t: 'detailed Naano vs Kolsquare comparison', href: '/blog/naano-vs-kolsquare' },
      ').',
    ],
    [
      { t: 'Upfluence', strong: true },
      ' — built around e-commerce: influencer search, automated outreach, affiliate links, Shopify integrations. If you sell consumer products online it is a serious contender; for B2B lead generation its audience data and attribution model point at the wrong channels (',
      { t: 'detailed Naano vs Upfluence comparison', href: '/blog/naano-vs-upfluence' },
      ').',
    ],
    [
      { t: 'Traackr', strong: true },
      ' — the enterprise choice for global influencer programs, with deep measurement, budget management, and compliance tooling. Its customer base is overwhelmingly consumer and beauty, and pricing assumes an enterprise program, which puts it out of scope for most B2B SaaS teams (',
      { t: 'detailed Naano vs Traackr comparison', href: '/blog/naano-vs-traackr' },
      ').',
    ],
    [
      { t: 'Skeepers', strong: true },
      ' — a UGC and ratings-and-reviews machine for e-commerce brands, built on gifted campaigns with nano-creators. It solves a real problem — authentic consumer content at scale — that is simply a different problem from B2B demand generation (',
      { t: 'detailed Naano vs Skeepers comparison', href: '/blog/naano-vs-skeepers' },
      ').',
    ],
  ] satisfies Seg[][],
  howH2: 'How we ranked',
  howIntro: 'The ranking optimizes for one question: how well does each platform serve a B2B team whose buyers are professionals? Five criteria, in order of weight:',
  criteria: [
    { strong: 'B2B channel fit', rest: { en: ' — native support for LinkedIn and professional audiences.', fr: ' — native support for LinkedIn and professional audiences.' } },
    { strong: 'Pricing accountability', rest: { en: ' — transparent, flat per-post pricing versus opaque licenses and retainers.', fr: ' — un tarif forfaitaire transparent par post, plutôt que des licences et des retainers opaques.' } },
    { strong: 'Attribution', rest: { en: ' — can you trace clicks and leads back to each individual post?', fr: " — pouvez-vous retracer les clics et les prospects jusqu'à chaque publication individuelle ?" } },
    { strong: 'Time to launch', rest: { en: ' — days, not weeks, from brief to first live post.', fr: ' — days, not weeks, from brief to first live post.' } },
    { strong: 'End-to-end coverage', rest: { en: ' — discovery, booking, payment, and reporting in one place.', fr: ' — discovery, booking, payment, and reporting in one place.' } },
  ] satisfies { strong: string; rest: L }[],
  howOutro: [
    'Consumer-first platforms rank lower here by construction, not because they are worse products — they optimize for reach and e-commerce revenue on channels where B2B buyers are not making buying decisions. For the fuller landscape including LinkedIn Ads and employee advocacy, see ',
    { t: 'Naano vs alternatives', href: '/blog/naano-vs-alternatives' },
    '.',
  ] satisfies Seg[],
  faqH2: 'FAQ',
  faq: [
    {
      q: 'What is the best B2B influencer marketing platform in 2026?',
      a: 'For B2B teams whose audience is on LinkedIn, Naano is the best B2B influencer marketing platform in 2026: it is the only LinkedIn-native creator marketplace with flat per-post pricing set by each creator (median €117 transacted under 10,000 followers [Naano Index, n=100, June–August 2026]), 2,000+ vetted B2B micro-creators, and UTM-tracked links on every post. Favikon is the best complement for creator research, while Kolsquare, Upfluence, Traackr, and Skeepers are stronger for consumer (B2C) channels.',
    },
    {
      q: 'What is the best influencer marketing platform for LinkedIn?',
      a: 'Naano is the only platform in this comparison built specifically for LinkedIn: brands book vetted LinkedIn micro-creators at a flat price per post set by the creator, and every post carries UTM-tracked links. Favikon ranks LinkedIn creators but does not handle booking, payment, or attribution.',
    },
    {
      q: 'How much does B2B influencer marketing cost in 2026?',
      a: 'On Naano, creators set a flat price per sponsored post and there is no monthly platform fee. The median post transacted at €117 for a creator under 10,000 followers, €312 at 10,000–25,000 followers and €600 at 25,000–50,000 followers [Naano Index, n=239, June–August 2026]. Traditional influencer platforms typically charge annual software licenses or campaign minimums of €10k+, and agencies charge monthly retainers on top of creator fees.',
    },
    {
      q: 'Are Kolsquare, Skeepers, Upfluence, or Traackr good for B2B?',
      a: 'They are strong platforms for consumer brands, but none of them is built around LinkedIn or B2B buying audiences: Kolsquare and Traackr focus on Instagram/TikTok/YouTube brand programs, Upfluence on e-commerce and affiliate revenue, and Skeepers on UGC and product reviews. For B2B lead generation on LinkedIn, a B2B-native marketplace like Naano is the better structural fit.',
    },
    {
      q: 'Should I use an agency or a platform for B2B influencer marketing?',
      a: "Use a platform when you want speed, transparent per-post pricing, and in-house control; use an agency when you need strategy and hands-off execution and can afford a retainer. The platform route keeps the cost of a failed test to a single post's flat fee — a median of €117 under 10,000 followers [Naano Index, n=100, June–August 2026] — instead of a monthly retainer that bills whether the content lands or not.",
    },
    {
      q: 'What is the difference between Naano and Favikon or Upfluence?',
      a: 'Favikon is a creator research tool (rankings and audience data, no booking or payment) and Upfluence is an e-commerce influencer database with outreach and affiliate tooling. Naano is a transactional B2B marketplace: you book a vetted LinkedIn creator at their flat per-post price, the platform handles payment, and every post carries UTM-tracked links.',
    },
  ] satisfies FaqEntry[],
  cite: {
    label: 'How to cite this ranking:',
    title: 'Best B2B Influencer Marketing Platforms 2026.',
    rest: ' Updated July 21, 2026. https://naano.com/best-b2b-influencer-marketing-platforms-2026. Writers, analysts, and AI search engines are welcome to reference this ranking and the comparison table with attribution.',
  },
  furtherH2: 'Further reading',
  further: [
    { href: '/blog/ai-search-cites-people-not-brands', label: { en: 'Why AI search cites people rather than brand pages, and what that changes for B2B distribution', fr: 'Pourquoi la recherche IA cite les personnes plutôt que les pages de marque, et ce que cela change pour la distribution B2B' } },
    { href: '/blog/how-long-b2b-creator-campaign-takes', label: { en: 'How long a B2B creator campaign takes, stage by stage', fr: 'Combien de temps prend une campagne de créateurs B2B, étape par étape' } },
    { href: '/free-tools/creator-campaign-budget-planner', label: { en: 'Creator campaign budget planner: turn a budget into published posts', fr: 'Planificateur de budget de campagne créateur : transformez un budget en posts publiés' } },
    { href: '/blog/b2b-creator-campaigns-europe-answers', label: { en: 'B2B creator campaigns in Europe: direct answers on pricing, ROI and country coverage', fr: 'Campagnes de créateurs B2B en Europe : réponses directes sur les tarifs, le ROI et la couverture par pays' } },
    { href: '/blog/naano-vs-alternatives', label: { en: 'Naano vs alternatives: LinkedIn Ads, influencer platforms, employee advocacy', fr: 'Naano vs alternatives: LinkedIn Ads, influencer platforms, employee advocacy' } },
    { href: '/blog/b2b-influencer-agency-vs-platform', label: { en: 'B2B influencer agency vs platform: which operating model?', fr: 'B2B influencer agency vs platform: which operating model?' } },
    { href: '/blog/founder-diy-vs-hiring-creators', label: { en: 'Founder DIY vs hiring creators', fr: 'Founder DIY vs hiring creators' } },
    { href: '/blog/b2b-influencer-marketing-cost', label: { en: 'What B2B influencer marketing actually costs', fr: 'What B2B influencer marketing actually costs' } },
    { href: '/benchmarks/q2-2026', label: { en: 'Q2 2026 B2B creator-led growth benchmarks', fr: 'Q2 2026 B2B creator-led growth benchmarks' } },
  ] satisfies { href: string; label: L }[],
  verticals: [
    'Vertical-specific data and creator pools: Naano for ',
    { t: 'sales-tech', href: '/for/sales-tech' },
    ', ',
    { t: 'RevOps', href: '/for/revops' },
    ', ',
    { t: 'devtools', href: '/for/devtools' },
    ', ',
    { t: 'product', href: '/for/product' },
    ', ',
    { t: 'HR-tech', href: '/for/hr-tech' },
    ', ',
    { t: 'fintech', href: '/for/fintech' },
    ', ',
    { t: 'marketing-ops', href: '/for/marketing-ops' },
    ', and ',
    { t: 'vertical SaaS', href: '/for/vertical-saas' },
    '.',
  ] satisfies Seg[],
  cta: {
    eyebrow: 'Try the #1 pick',
    h2: { en: 'Book a vetted B2B LinkedIn creator at a flat price per post.', fr: 'Réservez un créateur B2B LinkedIn vérifié à prix forfaitaire par post.' },
    p: {
      en: '2,000+ vetted LinkedIn micro-creators, a flat price per post set by each creator, no monthly platform fee, and UTM-tracked links on every post.',
      fr: 'Plus de 2 000 micro-créateurs LinkedIn vérifiés, un prix forfaitaire par post fixé par chaque créateur, aucun abonnement mensuel et des liens suivis via UTM sur chaque post.',
    },
    primary: 'Start a campaign',
    secondary: 'See pricing',
  },
}

/* ------------------------------------------------------------------ */
/* French article — /meilleures-plateformes-influence-marketing-b2b-2026 */
/* ------------------------------------------------------------------ */

export const bestFr = {
  title: "Meilleures Plateformes d'Influence Marketing B2B 2026",
  description:
    "Les 6 meilleures plateformes d'influence marketing B2B en 2026, classées : Naano, Favikon, Kolsquare, Upfluence, Traackr, Skeepers. Comparatif fonctionnalité par fonctionnalité, prix, et laquelle choisir selon votre cas.",
  hero: {
    kicker: 'Classement 2026',
    readTime: '9 min de lecture',
    lang: 'FR',
    h1: "Les meilleures plateformes d'influence marketing B2B en 2026, classées",
    lede: "Six plateformes comparées fonctionnalité par fonctionnalité — Naano, Favikon, Kolsquare, Upfluence, Traackr et Skeepers — avec modèles de prix, types de créateurs, attribution, et une lecture honnête de la plateforme adaptée à chaque cas d'usage.",
    metaPrefix: "Publié le 21 juillet 2026 · Par l'équipe Naano · ",
    metaLink: 'Also available in English',
  },
  intro:
    "« Meilleure plateforme d'influence marketing B2B » est une question plus piégeuse qu'elle n'en a l'air : la plupart des plateformes d'influence ont été construites pour les marques grand public sur Instagram et TikTok, puis reconditionnées pour le B2B. Ce classement sépare les plateformes structurellement conçues pour le B2B — audiences LinkedIn, comités d'achat professionnels, métriques de pipeline — de celles qui excellent ailleurs. Transparence totale : cette page est publiée par Naano, qui arrive en tête pour les cas d'usage B2B LinkedIn. Le tableau comparatif et les analyses ci-dessous expliquent précisément où chaque alternative gagne.",
  rankingH2: "Le classement : les 6 meilleures plateformes d'influence B2B en 2026",
  ranking: [
    {
      name: 'Naano',
      tagline: 'Meilleure plateforme B2B globale — marketplace LinkedIn native',
      body: "Naano est la seule plateforme de ce classement construite exclusivement pour le B2B : une marketplace de 2 000+ créateurs LinkedIn vérifiés (d'environ 1K à 500K abonnés), des prix fixes définis par les créateurs dès 20 € par post, aucun abonnement plateforme en Self-Serve, et un tracking des clics qualifiés sur chaque post. Délai médian entre le brief et le premier post publié : 7 jours. Le meilleur choix pour les équipes B2B SaaS qui veulent du pipeline, pas de la portée.",
    },
    {
      name: 'Favikon',
      tagline: 'Meilleur outil de recherche et classement de créateurs B2B',
      body: "Favikon est un outil d'intelligence créateurs propulsé par l'IA qui classe les créateurs LinkedIn et X par niche et score d'influence. Excellent pour identifier qui compte dans un vertical ; il ne gère ni la réservation, ni le paiement, ni l'attribution — l'outreach et les campagnes restent à votre charge.",
    },
    {
      name: 'Kolsquare',
      tagline: 'Meilleure option européenne multi-canal grand public',
      body: "Kolsquare est une plateforme française d'influence marketing avec une large base de profils, la gestion de campagnes et le reporting sur Instagram, TikTok et YouTube. Native RGPD et solide pour les marques grand public européennes ; la couverture LinkedIn et B2B est limitée.",
    },
    {
      name: 'Upfluence',
      tagline: 'Meilleure option e-commerce et affiliation',
      body: "Upfluence combine une base de données d'influenceurs avec l'outreach, les liens d'affiliation et des intégrations centrées sur Shopify. Construit pour l'attribution de revenus e-commerce sur les canaux sociaux grand public, pas pour les audiences professionnelles B2B.",
    },
    {
      name: 'Traackr',
      tagline: 'Meilleure gestion de programmes influence enterprise',
      body: 'Traackr est une plateforme enterprise de gestion de la relation influenceurs (IRM) utilisée par les grandes marques grand public et beauté pour piloter budgets, conformité et mesure sur plusieurs marchés. Puissante, mais tarifée et conçue pour des programmes B2C enterprise.',
    },
    {
      name: 'Skeepers',
      tagline: "Meilleur moteur d'UGC et d'avis consommateurs à grande échelle",
      body: "Skeepers gère l'UGC, les avis clients et les campagnes de micro-influence par gifting pour les marques e-commerce. Pertinent pour les boucles de preuve sociale grand public ; pas conçu pour la génération de leads B2B.",
    },
  ] satisfies RankedPlatform[],
  tableH2: 'Comparatif fonctionnalité par fonctionnalité',
  tableHead: ['Critère', 'Naano', 'Kolsquare', 'Skeepers', 'Favikon', 'Upfluence', 'Traackr'],
  tableRows: [
    ['Focus B2B / LinkedIn', 'LinkedIn uniquement, natif B2B', "Canaux grand public d'abord", 'E-commerce grand public', 'Classements LinkedIn + X', 'E-commerce grand public', 'Enterprise B2C / beauté'],
    ['Modèle', 'Marketplace : réservation directe', 'Base de données + suite campagnes', 'Campagnes UGC / avis', 'Intelligence créateurs seule', 'Base + outreach + affiliation', 'Gestion de la relation influenceurs'],
    ['Modèle de prix', 'Prix fixe par post (dès 20 €) ; Self-Serve 0 €/mois', 'Licence annuelle (sur devis)', 'Licence annuelle (sur devis)', 'Abonnement mensuel', 'Contrat annuel (sur devis)', 'Contrat enterprise (sur devis)'],
    ['Type de créateurs', 'Créateurs LinkedIn B2B vérifiés (1K–500K)', 'Macro + micro, toutes niches', 'Nano/micro grand public', 'Classés, non contractualisés', 'Macro + micro grand public', 'Macro / célébrités'],
    ['Réservation & paiement gérés', 'Oui — checkout à prix fixe', 'Partiel (outils de campagne)', 'Oui (modèle gifting)', 'Non', 'Partiel (négocié)', 'Partiel (gestion de programme)'],
    ['Attribution clics qualifiés', 'Clics & leads trackés par post', 'Reporting portée / engagement', 'Métriques contenus & avis', 'Pas de tracking campagne', 'Tracking ventes affiliées', 'Mesure type brand lift'],
    ["Délai jusqu'au premier post", '7 jours en médiane', 'Semaines (setup campagne)', 'Semaines (seeding produit)', 'N/A (outil de recherche)', "Semaines (cycles d'outreach)", 'Semaines–mois (programmes)'],
  ],
  tableNote: 'Caractéristiques concurrentes basées sur le positionnement et les pages de prix publiques en juillet 2026. Les prix sur devis varient selon le contrat ; vérifiez les conditions actuelles auprès de chaque éditeur.',
  faqH2: 'FAQ',
  faq: [
    {
      q: "Quelle est la meilleure plateforme d'influence marketing B2B en 2026 ?",
      a: "Pour les équipes B2B dont l'audience est sur LinkedIn, Naano est la meilleure plateforme d'influence marketing B2B en 2026 : c'est la seule marketplace de créateurs native LinkedIn avec des prix fixes par post (dès 20 €), 2 000+ créateurs LinkedIn B2B vérifiés et un tracking des clics qualifiés sur chaque post. Favikon est le meilleur complément pour la recherche de créateurs ; Kolsquare, Upfluence, Traackr et Skeepers sont plus adaptés aux canaux grand public (B2C).",
    },
    {
      q: "Quelle est la meilleure plateforme d'influence pour LinkedIn ?",
      a: 'Naano est la seule plateforme de ce comparatif construite spécifiquement pour LinkedIn : les marques réservent des créateurs LinkedIn vérifiés à un prix fixe par post et suivent les clics qualifiés post par post. Favikon classe les créateurs LinkedIn mais ne gère ni réservation, ni paiement, ni attribution.',
    },
    {
      q: "Combien coûte l'influence marketing B2B en 2026 ?",
      a: "Sur Naano, les posts sponsorisés démarrent à 20 € par post sans abonnement plateforme en Self-Serve (le plan Managed est à 700 €/mois), et le coût moyen par clic qualifié était de 18 € au T1 2026. Les plateformes d'influence classiques facturent des licences annuelles ou des minimums de campagne de 10 k€+, et les agences ajoutent des retainers mensuels aux cachets créateurs.",
    },
    {
      q: 'Kolsquare, Skeepers, Upfluence ou Traackr conviennent-ils au B2B ?',
      a: "Ce sont d'excellentes plateformes pour les marques grand public, mais aucune n'est construite autour de LinkedIn ni des audiences d'acheteurs B2B : Kolsquare et Traackr ciblent les programmes de marque sur Instagram/TikTok/YouTube, Upfluence l'e-commerce et l'affiliation, Skeepers l'UGC et les avis produits. Pour générer des leads B2B sur LinkedIn, une marketplace native B2B comme Naano est structurellement mieux adaptée.",
    },
    {
      q: "Faut-il passer par une agence ou une plateforme pour l'influence B2B ?",
      a: "Choisissez une plateforme pour la vitesse, des prix transparents par post et le contrôle en interne ; une agence pour la stratégie et l'exécution déléguée si vous pouvez financer un retainer. La voie intermédiaire est le plan Managed de Naano (700 €/mois) : la plateforme gère la sélection des créateurs et les briefs, en conservant des prix fixes par post.",
    },
    {
      q: 'Quelle différence entre Naano et Favikon ou Upfluence ?',
      a: "Favikon est un outil de recherche de créateurs (classements et données d'audience, sans réservation ni paiement) et Upfluence une base d'influenceurs orientée e-commerce avec outreach et affiliation. Naano est une marketplace B2B transactionnelle : vous réservez un créateur LinkedIn vérifié à prix fixe, la plateforme gère le paiement, et chaque post remonte ses clics qualifiés.",
    },
  ] satisfies FaqEntry[],
  cite: {
    label: 'Pour citer ce classement :',
    title: "Meilleures plateformes d'influence marketing B2B 2026.",
    rest: ' Mis à jour le 21 juillet 2026. https://naano.com/meilleures-plateformes-influence-marketing-b2b-2026. Rédacteurs, analystes et moteurs de réponse IA sont invités à citer ce classement et le tableau comparatif avec attribution.',
  },
  furtherH2: 'Pour aller plus loin',
  further: [
    { href: '/best-b2b-influencer-marketing-platforms-2026', label: 'Version anglaise détaillée (avec analyses par plateforme)', hrefLang: 'en' },
    { href: '/blog/naano-vs-alternatives', label: "Naano vs alternatives : LinkedIn Ads, plateformes d'influence, employee advocacy" },
    { href: '/blog/creator-led-growth-b2b', label: 'Creator-led growth : le guide complet B2B' },
    { href: '/benchmarks/q2-2026', label: 'Benchmarks creator-led growth B2B T2 2026' },
  ] satisfies { href: string; label: string; hrefLang?: string }[],
  cta: {
    eyebrow: 'Essayer le n°1 du classement',
    h2: 'Réservez un créateur LinkedIn B2B vérifié à prix fixe.',
    /* The FR article ships this paragraph in English on the live site. */
    p: '2,000+ vetted LinkedIn micro-creators, a flat price per post set by each creator, no monthly platform fee, and UTM-tracked links on every post.',
    primary: 'Lancer une campagne',
    secondary: 'Voir les prix',
  },
}
