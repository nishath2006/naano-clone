import type { Seg } from '@/components/site/TextLink'

export type ReportCard = {
  href: string
  badge: string
  title: string
  subtitle: string
  body: string
  meta: string
  read: string
}

export type ReportsCopy = {
  title: string
  description: string
  h1: string
  lede: string
  cards: ReportCard[]
  upcoming: { title: string; body: Seg[] }
  using: { h2: string; items: { q: string; a: string }[] }
  built: { h2: string; links: { href: string; label: string }[] }
}

const priceIndexHref = '/blog/linkedin-sponsored-post-price-index-2026'
const benchmarksHref = '/benchmarks/q2-2026'

const builtHrefs = [
  '/free-tools/sponsored-post-delivery-odds-estimator',
  '/free-tools/linkedin-creator-worth-calculator',
  '/blog/b2b-influencer-marketing-cost',
  '/blog/how-much-charge-sponsored-linkedin-post',
  '/best-b2b-influencer-marketing-platforms-2026',
]

export const reportsCopy: { en: ReportsCopy; fr: ReportsCopy } = {
  en: {
    title: 'NaanoX Reports: B2B LinkedIn Creator Marketing Data',
    description:
      'First-party data on B2B LinkedIn creator marketing, published by NaanoX: real sponsored-post prices from marketplace bookings, campaign benchmarks (CPL, CTR, time-to-launch), and methodology you can cite.',
    h1: 'B2B LinkedIn creator marketing, measured',
    lede: 'First-party data from the NaanoX marketplace: what sponsored LinkedIn posts really cost, and what B2B creator campaigns really deliver. Every number ships with its sample size, time period and methodology — built to be cited.',
    cards: [
      {
        href: priceIndexHref,
        badge: 'First-party data',
        title: 'LinkedIn Sponsored Post Price Index 2026',
        subtitle: 'What sponsored LinkedIn posts actually cost, from real bookings',
        body: 'Transacted prices from 239 sponsored-post bookings on the NaanoX marketplace between June and August 2026: median €84 per post for creators under 5K followers, €180 at 5–10K, €312 at 10–25K — against rate-card guides quoting $500–$2,500 for the same tiers. Includes price-spread analysis (a 25x spread inside a single follower tier), how much follower count actually explains price (~29%), and delivery odds by price level.',
        meta: 'n=239 bookings · June–August 2026 · First-party transaction data',
        read: 'Read the report →',
      },
      {
        href: benchmarksHref,
        badge: 'First-party data',
        title: 'Q2 2026 B2B Creator-Led Growth Benchmarks',
        subtitle: 'CPL, CTR and conversion benchmarks from 312 B2B creator campaigns',
        body: "First-party benchmark dataset covering cost per qualified click, CTR, time-to-launch and conversion rates for B2B creator campaigns: 312 campaigns and 1,847 sponsored posts measured in Q1 2026, with per-vertical medians, full methodology, sample sizes and limitations. Historical dataset — measured under NaanoX's earlier pricing model and labeled as such; performance benchmarks remain valid as reference points.",
        meta: 'n=312 campaigns · 1,847 posts · Q1 2026 data · Dataset schema',
        read: 'Read the report →',
      },
    ],
    upcoming: {
      title: 'LinkedIn Creator Marketing Benchmarks 2026',
      body: [
        'The annual edition — prices, engagement and delivery data across every follower tier of the marketplace — ships once the underlying samples are large enough to publish. Until then, the two reports above carry the current data, and the ',
        { t: 'free tools', href: '/free-tools' },
        ' are built on the same dataset.',
      ],
    },
    using: {
      h2: 'Using this data',
      items: [
        {
          q: "Can I cite NaanoX's data in an article or report?",
          a: 'Yes — that is what these reports are for. Cite the specific report with a link, e.g. "NaanoX Index, n=239 sponsored-post bookings, June–August 2026 (naano.com/reports)". Every number is published with its sample size and time period; please carry both in the citation. Claims we attribute to third parties (Edelman, LinkedIn benchmarks) should be attributed to the original source, not to NaanoX.',
        },
        {
          q: 'Where does the data come from?',
          a: 'From anonymized, aggregated transactions and campaigns on the NaanoX marketplace — the B2B LinkedIn creator marketplace. No customer or creator is identifiable in any published number. Each report states its own sample, time window and known limitations; we publish the caveats alongside the findings.',
        },
        {
          q: 'How often are the reports updated?',
          a: 'Each report shows its publication date, and a visible dateModified when it is genuinely refreshed with new data — we do not bump dates for freshness. New editions ship when the underlying marketplace data reaches a sample size worth publishing.',
        },
      ],
    },
    built: {
      h2: 'Built on the same data',
      links: [
        { href: builtHrefs[0], label: 'Sponsored Post Delivery Odds Estimator (free tool)' },
        { href: builtHrefs[1], label: 'LinkedIn Creator Worth Calculator (free tool)' },
        { href: builtHrefs[2], label: 'How much does B2B influencer marketing cost in 2026?' },
        { href: builtHrefs[3], label: 'How much should you charge for a sponsored LinkedIn post?' },
        { href: builtHrefs[4], label: 'Best B2B influencer marketing platforms 2026 (ranked)' },
      ],
    },
  },
  fr: {
    title: 'Rapports NaanoX : données sur le creator marketing LinkedIn B2B',
    description:
      'Données propriétaires sur le creator marketing LinkedIn B2B publiées par NaanoX : prix réels de posts sponsorisés issus des réservations de la marketplace, benchmarks de campagne (CPL, CTR, délai de lancement) et méthodologie que vous pouvez citer.',
    h1: 'Le creator marketing LinkedIn B2B, mesuré',
    lede: "Données propriétaires de la marketplace NaanoX : le prix réel des posts LinkedIn sponsorisés et les résultats réels des campagnes de créateurs B2B. Chaque chiffre est accompagné de sa taille d'échantillon, de sa période et de sa méthodologie — prêt à être cité.",
    cards: [
      {
        href: priceIndexHref,
        badge: 'Données propriétaires',
        title: 'Indice des prix des publications Post sponsorisées LinkedIn 2026',
        subtitle: "Le prix réel des posts LinkedIn sponsorisés, d'après des réservations effectives",
        body: "Prix transactionnels de 239 réservations de publications sponsorisées sur le marketplace NaanoX entre juin et août 2026 : médiane de 84 € par publication pour les créateurs avec moins de 5K followers, 180 € à 5–10K, 312 € à 10–25K — par rapport aux guides de tarification citant 500–2 500 $ pour les mêmes niveaux. Inclut l'analyse de la répartition des prix (un écart de 25x au sein d'un seul niveau de followers), combien le nombre de followers explique réellement le prix (~29 %), et les probabilités de livraison par niveau de prix.",
        meta: 'n=239 réservations · Juin–août 2026 · Données de transaction propriétaires',
        read: 'Lire le rapport →',
      },
      {
        href: benchmarksHref,
        badge: 'Données propriétaires',
        title: 'Benchmarks Q2 2026 de la croissance portée par les créateurs B2B',
        subtitle: 'Benchmarks de CPL, CTR et conversion issus de 312 campagnes de créateurs B2B',
        body: "Jeu de données propriétaire couvrant le coût par clic qualifié, le CTR, le délai de lancement et les taux de conversion de campagnes de créateurs B2B : 312 campagnes et 1 847 posts sponsorisés mesurés au T1 2026, avec médianes par secteur, méthodologie complète, tailles d'échantillon et limites. Jeu de données historique — mesuré avec l'ancien modèle tarifaire de NaanoX et présenté comme tel ; les benchmarks de performance restent des références valables.",
        meta: 'n=312 campagnes · 1 847 posts · Données T1 2026 · Schéma du jeu de données',
        read: 'Lire le rapport →',
      },
    ],
    upcoming: {
      title: 'Benchmarks du Marketing de Créateurs LinkedIn 2026',
      body: [
        "L'édition annuelle — prix, engagement et données de publication pour chaque tranche d'abonnés de la marketplace — paraîtra lorsque les échantillons seront suffisamment importants. En attendant, les deux rapports ci-dessus contiennent les données actuelles, et les ",
        { t: 'outils gratuits', href: '/free-tools' },
        ' reposent sur le même jeu de données.',
      ],
    },
    using: {
      h2: 'Utiliser ces données',
      items: [
        {
          q: 'Puis-je citer les données de NaanoX dans un article ou un rapport ?',
          a: "Oui — c'est précisément le but de ces rapports. Citez le rapport concerné avec un lien, par exemple « NaanoX Index, n=239 réservations de publications sponsorisées, juin–août 2026 (naano.com/reports) ». Chaque chiffre est publié avec la taille de son échantillon et sa période ; merci d'indiquer les deux. Les affirmations attribuées à des tiers (Edelman, benchmarks LinkedIn) doivent citer la source originale, et non NaanoX.",
        },
        {
          q: "D'où proviennent les données ?",
          a: "Elles proviennent de transactions et de campagnes agrégées et anonymisées sur la marketplace NaanoX — la marketplace de créateurs LinkedIn B2B. Aucun client ni créateur n'est identifiable dans les chiffres publiés. Chaque rapport précise son échantillon, sa période et ses limites connues ; nous publions les réserves avec les résultats.",
        },
        {
          q: 'À quelle fréquence les rapports sont-ils mis à jour ?',
          a: "Chaque rapport indique sa date de publication et affiche une dateModified lorsqu'il est réellement actualisé avec de nouvelles données — nous ne modifions pas les dates pour simuler de la fraîcheur. Une nouvelle édition paraît lorsque les données de la marketplace atteignent une taille d'échantillon suffisante.",
        },
      ],
    },
    built: {
      h2: 'Basé sur les mêmes données',
      links: [
        { href: builtHrefs[0], label: "Estimateur de probabilité de publication d'un post sponsorisé (outil gratuit)" },
        { href: builtHrefs[1], label: 'Calculateur de Valeur des Créateurs LinkedIn (outil gratuit)' },
        { href: builtHrefs[2], label: "Combien coûte l'influence marketing B2B en 2026 ?" },
        { href: builtHrefs[3], label: 'Combien facturer pour un post LinkedIn sponsorisé ?' },
        { href: builtHrefs[4], label: "Meilleures plateformes d'influence marketing B2B en 2026 (classement)" },
      ],
    },
  },
}
