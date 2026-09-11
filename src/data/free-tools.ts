import type { ToolIconName } from '@/components/tools/ToolIcons'

/** One card of the /free-tools grid (captured order). */
export type FreeToolCard = {
  href: string
  icon: ToolIconName
  title: string
  tagline: string
  description: string
  pill: string
  meta: string
}

const CARDS_EN: FreeToolCard[] = [
  {
    href: '/selection',
    icon: 'user-search',
    title: 'Free LinkedIn creator search',
    tagline: 'Get a hand-picked creator shortlist in 48 hours',
    description:
      'Describe the campaign you want to launch and a real person at Naano finds every LinkedIn creator genuinely worth contacting — inside the Naano marketplace and across the wider LinkedIn ecosystem. You get names, pricing, and audience fit within 48 hours. Free, no account required, no commitment.',
    pill: 'Hand-picked by a real human, not an algorithm',
    meta: 'Free · 48h turnaround · No account needed',
  },
  {
    href: '/free-tools/linkedin-creator-worth-calculator',
    icon: 'calculator',
    title: 'LinkedIn Creator Worth Calculator',
    tagline: 'Find out what a sponsored post from any creator should cost',
    description:
      "Enter a LinkedIn creator's follower count, average reactions and comments, and their niche, and get an instant flat-fee estimate of what one sponsored post is worth — plus their engagement rating against B2B benchmarks. Built for creators setting their rate and for companies budgeting a campaign. Free, no account required.",
    pill: 'Benchmarked against B2B engagement tiers',
    meta: 'Free · Instant result · No account needed',
  },
  {
    href: '/free-tools/linkedin-engagement-rate-calculator',
    icon: 'trending-up',
    title: 'LinkedIn Engagement Rate Calculator',
    tagline: 'Calculate your engagement rate and compare it to 2026 benchmarks',
    description:
      'Enter your follower count and your average reactions, comments and reposts per post, and get your LinkedIn engagement rate two ways — by followers and by impressions — rated against 2026 B2B benchmarks for your audience size, with concrete tips to improve it. Free, no account required.',
    pill: 'Rated against 2026 B2B benchmarks',
    meta: 'Free · Instant result · No account needed',
  },
  {
    href: '/free-tools/sponsored-post-delivery-odds-estimator',
    icon: 'target',
    title: 'Sponsored Post Delivery Odds Estimator',
    tagline: 'See how often offers at your price actually get published',
    description:
      'Enter what you plan to offer a LinkedIn creator per post and see how often real bookings at that price ended in a published post, how often creators simply never answered, and what brands actually paid at that audience size. Built on 239 real sponsored-post bookings from the Naano marketplace, not rules of thumb. Free, no account required.',
    pill: 'Built on 239 real bookings',
    meta: 'Free · Built on 239 real bookings · No account needed',
  },
  {
    href: '/free-tools/creator-campaign-budget-planner',
    icon: 'chart-pie',
    title: 'Creator Campaign Budget Planner',
    tagline: 'Turn a budget into published posts, not just booked ones',
    description:
      'Enter your campaign budget and see how many sponsored LinkedIn posts it books at real transacted medians — then how many of those historically ended in a published post, and what that makes the true cost per published post. Built on 239 real sponsored-post bookings from the Naano marketplace. Free, no account required.',
    pill: 'Plans on published posts, not booked ones',
    meta: 'Free · Built on 239 real bookings · No account needed',
  },
]

/** The FR capture of /free-tools keeps the card copy in English. */
export const FREE_TOOL_CARDS = { en: CARDS_EN, fr: CARDS_EN }

/** Entries of the "More free tools" grid at the bottom of each tool page. */
export type MoreToolEntry = { href: string; icon: ToolIconName; title: string; description: string }

type MoreToolKey = 'worth' | 'erc' | 'odds' | 'oddsBudgetPage' | 'all'

export const MORE_TOOLS: Record<MoreToolKey, { en: MoreToolEntry; fr: MoreToolEntry }> = {
  worth: {
    en: {
      href: '/free-tools/linkedin-creator-worth-calculator',
      icon: 'calculator',
      title: 'LinkedIn Creator Worth Calculator',
      description: 'Find out what a sponsored post from any creator should cost.',
    },
    fr: {
      href: '/free-tools/linkedin-creator-worth-calculator',
      icon: 'calculator',
      title: "Calculateur de valeur d'un créateur LinkedIn",
      description: "Découvrez combien devrait coûter un post sponsorisé publié par n'importe quel créateur.",
    },
  },
  erc: {
    en: {
      href: '/free-tools/linkedin-engagement-rate-calculator',
      icon: 'trending-up',
      title: 'LinkedIn Engagement Rate Calculator',
      description: 'Calculate your engagement rate and compare it to 2026 benchmarks.',
    },
    fr: {
      href: '/free-tools/linkedin-engagement-rate-calculator',
      icon: 'trending-up',
      title: "Calculateur de taux d'engagement LinkedIn",
      description: "Calculez votre taux d'engagement et comparez-le aux benchmarks 2026.",
    },
  },
  odds: {
    en: {
      href: '/free-tools/sponsored-post-delivery-odds-estimator',
      icon: 'target',
      title: 'Sponsored Post Delivery Odds Estimator',
      description: 'See how often offers at your price actually get published.',
    },
    fr: {
      href: '/free-tools/sponsored-post-delivery-odds-estimator',
      icon: 'target',
      title: "Estimateur de probabilité de publication d'un post sponsorisé",
      description: 'Découvrez à quelle fréquence les offres à votre prix sont réellement publiées.',
    },
  },
  // The budget planner page ships its own (differently worded) FR translation of this card.
  oddsBudgetPage: {
    en: {
      href: '/free-tools/sponsored-post-delivery-odds-estimator',
      icon: 'target',
      title: 'Sponsored Post Delivery Odds Estimator',
      description: 'See how often offers at your price actually get published.',
    },
    fr: {
      href: '/free-tools/sponsored-post-delivery-odds-estimator',
      icon: 'target',
      title: "Estimateur de probabilité de livraison d'un post sponsorisé",
      description: 'Voyez à quelle fréquence les offres à votre prix sont réellement publiées.',
    },
  },
  all: {
    en: {
      href: '/free-tools',
      icon: 'sparkles',
      title: 'All free tools',
      description: 'Every free Naano tool for B2B creator marketing, in one place.',
    },
    fr: {
      href: '/free-tools',
      icon: 'sparkles',
      title: 'Tous les outils gratuits',
      description: 'Tous les outils Naano gratuits pour le marketing de créateurs B2B, en un seul endroit.',
    },
  },
}
