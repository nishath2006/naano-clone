import type { Locale } from '@/lib/locale'
import type { BadgeKey, EmptyNoteKey, FunctionKey, SeniorityKey, StatKey } from '@/data/creators'

/**
 * Static strings of the public creator profile, taken from the `flatProfile`
 * and `publicCreatorProfile` i18n namespaces embedded in the captured pages
 * (EN: creators/eric-djavid, FR: fr/creators_thomas-marcelle). Creator-authored
 * text (headline, bio, posts, custom sections) is never translated.
 */
export type CreatorCopy = {
  brandTagline: string
  browseCreatorsLink: string
  badges: Record<BadgeKey, string>
  sections: { about: string; audience: string; posts: string; engagers: string; pricing: string }
  stats: Record<StatKey, string>
  /** "Stats updated {ago} ago" */
  statsUpdatedAgo: (ago: string) => string
  /** unit suffix used in `ago` ("2 d" → "2 j" in French) */
  agoUnit: Record<string, string>
  notes: Record<EmptyNoteKey, string>
  engagersIntro: string
  bySeniority: string
  byFunction: string
  seniority: Record<SeniorityKey, string>
  functions: Record<FunctionKey, string>
  pricePerPost: string
  bundleLabel: string
  bundleSummary: (count: number, price: string) => string
  bookCtaButton: string
  naanoTag: string
  ctaTitle: (name: string) => string
  ctaBody: string
  ctaButton: string
  ctaPoints: [string, string, string]
  whatIsNaanoTitle: string
  whatIsNaanoBody: string
  modelFlatLabel: string
  modelFlatBody: string
  modelCpcLabel: string
  modelCpcBody: string
}

const en: CreatorCopy = {
  brandTagline: 'The B2B LinkedIn creator marketplace',
  browseCreatorsLink: 'Browse all creators',
  badges: { availableToBook: 'Available to book', acceptingBookings: 'Accepting bookings', paused: 'Paused' },
  sections: {
    about: 'About',
    audience: 'Audience & average metrics',
    posts: 'Recent posts',
    engagers: 'Who engages with you',
    pricing: 'Pricing',
  },
  stats: {
    followers: 'Followers',
    avgViews: 'Est. median reach',
    avgReactions: 'Avg reactions',
    avgComments: 'Avg comments',
    engagement: 'Engagement',
    basedIn: 'Based in',
    impressions28d: 'Impressions · 90 days',
    avgImpressions: 'Avg impressions/post',
    impressionsCoverage: 'Posts measured',
  },
  statsUpdatedAgo: (ago) => `Stats updated ${ago} ago`,
  agoUnit: { d: 'd', h: 'h' },
  notes: {
    audiencePending: "First stats land ~3 hours after this creator's next post.",
    audienceLocked: 'Audience stats unlock once this creator completes their professional profile and we scrape their recent posts.',
    postsPending: "Recent posts will appear here within a few hours of this creator's next post.",
    notEnoughEngagementData: 'Not enough engagement data yet to break down the audience.',
  },
  engagersIntro: "Who likes and comments on this creator's posts, inferred from their LinkedIn titles.",
  bySeniority: 'By seniority',
  byFunction: 'By function',
  seniority: {
    seniorityFounder: 'Founder / C-level',
    seniorityVp: 'VP / Head / Director',
    seniorityManager: 'Manager / Lead',
    senioritySenior: 'Senior IC',
    seniorityOther: 'Other',
  },
  functions: {
    functionFounders: 'Founders',
    functionMarketing: 'Marketing',
    functionSales: 'Sales / BD',
    functionProduct: 'Product',
    functionEngineering: 'Engineering / Data',
    functionDesign: 'Design',
    functionHr: 'HR / Talent',
    functionFinance: 'Finance / VC',
    functionConsulting: 'Consulting',
  },
  pricePerPost: 'Price per post',
  bundleLabel: 'Bundle',
  bundleSummary: (count, price) => `${count} posts · ${price}`,
  bookCtaButton: 'Book a post',
  naanoTag: 'NaanoX',
  ctaTitle: (name) => `Want to work with ${name}?`,
  ctaBody: 'Book this creator for a LinkedIn post on NaanoX - fixed price, you keep full creative alignment, they keep their voice.',
  ctaButton: 'Get started on NaanoX',
  ctaPoints: ['Fixed price per post', 'Keeps their authentic voice', 'Booked & paid on NaanoX'],
  whatIsNaanoTitle: 'What is NaanoX',
  whatIsNaanoBody:
    'NaanoX is the B2B LinkedIn creator marketplace: companies discover and book vetted creators, from niche voices with around 1,000 followers to established names with hundreds of thousands, for sponsored LinkedIn posts. Brands brief creators, creators publish authentic posts in their own voice, and every post is booked at a fixed price shown upfront.',
  modelFlatLabel: 'Flat fee per post',
  modelFlatBody: 'Book a creator at the fixed price on their offer, shown with deliverables before you commit. No retainer.',
  modelCpcLabel: 'Tracked results',
  modelCpcBody: 'Every post carries tracked links, so you see the clicks and leads each creator drives. The price stays fixed per post - no cost per click.',
}

const fr: CreatorCopy = {
  brandTagline: 'La marketplace des créateurs LinkedIn B2B',
  browseCreatorsLink: 'Voir tous les créateurs',
  badges: { availableToBook: 'Disponible à la réservation', acceptingBookings: 'Réservations ouvertes', paused: 'En pause' },
  sections: {
    about: 'À propos',
    audience: 'Audience et mesures moyennes',
    posts: 'Messages récents',
    engagers: "Qui s'engage avec vous",
    pricing: 'Tarification',
  },
  stats: {
    followers: 'Followers',
    avgViews: 'Vues moy. (est.)',
    avgReactions: 'Réactions moyennes',
    avgComments: 'Moyenne des commentaires',
    engagement: 'Engagement',
    basedIn: 'Basé à',
    impressions28d: 'Impressions · 28 jours',
    avgImpressions: 'Impressions moy./post',
    impressionsCoverage: 'Posts mesurés',
  },
  statsUpdatedAgo: (ago) => `Stats à jour il y a ${ago}`,
  agoUnit: { d: 'j', h: 'h' },
  notes: {
    audiencePending: 'Les premières statistiques sont disponibles environ 3 heures après la publication suivante de ce créateur.',
    audienceLocked:
      "Les statistiques d'audience sont disponibles dès que ce créateur a complété son profil professionnel et que nous avons récupéré ses dernières publications.",
    postsPending: 'Les publications récentes apparaîtront ici dans les heures qui suivront la prochaine publication de cet auteur.',
    notEnoughEngagementData: "Il n'y a pas encore assez de données sur l'engagement pour ventiler l'audience.",
  },
  engagersIntro: "Qui aime et commente les articles de ce créateur, d'après leurs titres sur LinkedIn.",
  bySeniority: 'Par ancienneté',
  byFunction: 'Par fonction',
  seniority: {
    seniorityFounder: 'Fondateur / niveau C',
    seniorityVp: 'VP / Chef / Directeur',
    seniorityManager: 'Gestionnaire / Responsable',
    senioritySenior: 'IC senior',
    seniorityOther: 'Autres',
  },
  functions: {
    functionFounders: 'Les fondateurs',
    functionMarketing: 'Marketing',
    functionSales: 'Ventes / BD',
    functionProduct: 'Produit',
    functionEngineering: 'Ingénierie / Données',
    functionDesign: 'Conception',
    functionHr: 'RH / Talent',
    functionFinance: 'Finance / Capital-risque',
    functionConsulting: 'Conseil',
  },
  pricePerPost: 'Prix par post',
  bundleLabel: 'prix par lot',
  bundleSummary: (count, price) => `${count} posts · ${price}`,
  bookCtaButton: 'Réserver un post',
  naanoTag: 'NaanoX',
  ctaTitle: (name) => `Envie de travailler avec ${name} ?`,
  ctaBody: "Réservez ce créateur pour un post LinkedIn sur NaanoX, prix fixe, vous gardez l'alignement créatif, il garde sa voix.",
  ctaButton: 'Commencer sur NaanoX',
  ctaPoints: ['Prix fixe par post', 'Garde sa voix authentique', 'Réservé et payé sur NaanoX'],
  whatIsNaanoTitle: "Qu'est-ce que NaanoX",
  whatIsNaanoBody:
    "NaanoX est la marketplace de créateurs LinkedIn B2B : les entreprises y trouvent et réservent des créateurs vérifiés, des voix de niche d'environ 1 000 abonnés aux noms établis à plusieurs centaines de milliers, pour des posts LinkedIn sponsorisés. Les marques briefent les créateurs, qui publient des posts authentiques dans leur propre voix, à un prix fixe affiché avant réservation.",
  modelFlatLabel: 'Prix fixe par post',
  modelFlatBody: 'Réservez un créateur au prix fixe de son offre, affiché avec les livrables avant de vous engager. Sans retainer.',
  modelCpcLabel: 'Résultats trackés',
  modelCpcBody: 'Chaque post intègre des liens trackés : vous voyez les clics et les leads générés par chaque créateur. Le prix reste fixe par post, sans coût au clic.',
}

export const creatorCopy: Record<Locale, CreatorCopy> = { en, fr }

/**
 * The "More creators in …" / "New to creator-led growth?" footer nav is served
 * in English on both locales (verified on the FR capture).
 */
export const relatedNav = {
  moreCreators: (firstName: string) => `More creators in ${firstName}'s verticals:`,
  newTo: 'New to creator-led growth?',
  links: [
    { label: 'What creator-led growth is', href: '/blog/creator-led-growth-b2b' },
    { label: 'What it costs', href: '/blog/b2b-influencer-marketing-cost' },
    { label: 'How to launch a campaign', href: '/blog/launch-b2b-linkedin-creator-campaign' },
    { label: 'Platform comparison 2026', href: '/best-b2b-influencer-marketing-platforms-2026' },
    { label: 'CPL benchmarks', href: '/benchmarks/q2-2026' },
  ],
}
