import type { Locale } from '@/lib/locale'

export type TeamMember = {
  name: string
  role: string
  linkedin: string
  src: string
  alt: string
  objectPosition: string
}

export const ABOUT_TEAM: TeamMember[] = [
  {
    name: 'Alexis',
    role: 'CMO & Co-founder',
    linkedin: 'https://www.linkedin.com/in/alexis-jarre/',
    src: '/alex.png',
    alt: 'Alexis',
    objectPosition: 'center 0.2%',
  },
  {
    name: 'Justine',
    role: 'CTO & Co-founder',
    linkedin: 'https://www.linkedin.com/in/justine-namour-709951388/',
    src: '/ju.jpeg',
    alt: 'Justine',
    objectPosition: 'center 10%',
  },
  {
    name: 'Thomas',
    role: 'CEO & Co-founder',
    linkedin: 'https://www.linkedin.com/in/thomas-marcelle/',
    src: '/tom.png',
    alt: 'Thomas',
    objectPosition: 'center 10%',
  },
]

export type AboutCopy = {
  title: string
  description: string
  story: { eyebrow: string; h1: [string, string]; sub: string }
  started: { eyebrow: string; h2: string; paragraphs: string[] }
  mission: { eyebrow: string; h2: string; intro: string; items: string[]; outro: string }
  glance: {
    eyebrow: string
    facts: { term: string; value: string }[]
    /** sentence fragments around the inline links, in order */
    note: {
      before: string
      benchmark: string
      afterBenchmark: string
      guide: string
      afterGuide: string
      platforms: string
      afterPlatforms: string
      network: string
      and: string
      pricing: string
      end: string
    }
  }
  why: {
    eyebrow: string
    h2: [string, string]
    brands: { label: string; items: string[] }
    creators: { label: string; items: string[] }
  }
  cta: { eyebrow: string; h2: string; body: string; button: string; footnote: string }
}

const en: AboutCopy = {
  title: 'About Naano: the team behind the B2B LinkedIn creator marketplace',
  description:
    "Meet Naano's founders, Thomas Marcelle (CEO), Alexis Jarre (CMO), Justine Namour (CTO), and the LinkedIn creator marketplace with flat per-post pricing.",
  story: {
    eyebrow: 'Our story',
    h1: ['Built by founders,', 'for founders.'],
    sub: 'The B2B LinkedIn creator marketplace connecting companies with vetted creators.',
  },
  started: {
    eyebrow: 'How we started',
    h2: 'Built on Proven Results',
    paragraphs: [
      'Naano connects companies that want to grow with LinkedIn creators who want to monetize their audience.',
      "We believe growth works better when it's driven by people, not ads.",
      "That's why we help businesses scale through Creator-Led Growth: real professionals talking to real audiences.",
    ],
  },
  mission: {
    eyebrow: 'Our mission',
    h2: 'Make creator marketing your most effective revenue channel.',
    intro: 'We connect B2B companies with LinkedIn micro-creators who deliver:',
    items: ['Strong credibility in their industry', 'Trust that converts into growth'],
    outro: 'Real professionals talking to real audiences-at scale.',
  },
  glance: {
    eyebrow: 'Naano at a glance',
    facts: [
      { term: 'Founded', value: '2025, Paris, France' },
      { term: 'Category', value: 'B2B LinkedIn creator marketplace' },
      { term: 'Creator network', value: '2,000+ vetted B2B LinkedIn creators (≈1K–500K followers)' },
      { term: 'Pricing', value: 'From €20 per post · Self-Serve €0/month · Managed €700/month' },
      { term: 'Avg. cost per qualified click', value: '€18 (Q1 2026, n=312 campaigns)' },
      { term: 'Avg. CTR on creator posts', value: '12% vs 0.8% LinkedIn Ads benchmark' },
    ],
    note: {
      before: 'Performance figures are first-party measurements published in our ',
      benchmark: 'quarterly benchmark report',
      afterBenchmark: '. New to the category? Start with ',
      guide: 'the creator-led growth guide',
      afterGuide: ', see how Naano ranks against ',
      platforms: 'the other B2B influencer platforms',
      afterPlatforms: ', or browse ',
      network: 'the creator network',
      and: ' and ',
      pricing: 'pricing',
      end: '.',
    },
  },
  why: {
    eyebrow: 'Why naano',
    h2: ['Better for brands.', 'Better for creators.'],
    brands: {
      label: 'For Brands',
      items: [
        'Unlock new growth: Turn LinkedIn creators into your best sales channel',
        'Build brand authority: Get recommended by trusted voices in your industry',
        'Performance-pay only: Pay per click, not per post',
      ],
    },
    creators: {
      label: 'For Creators',
      items: [
        'Your expertise is the asset: Your credibility matters more than your follower count',
        'Monetize what you already do: Get paid for recommending tools you actually use',
        'Earn from your network: Turn your LinkedIn posts into revenue',
      ],
    },
  },
  cta: {
    eyebrow: 'The future of growth',
    h2: 'The Future of Growth',
    body: 'Traditional advertising is losing impact.',
    button: 'Get started',
    footnote: 'Collaboration is the future.',
  },
}

// The French capture only translates the body copy; eyebrows, the h1, the
// "at a glance" block and the team roles stay in English on naano.com.
const fr: AboutCopy = {
  ...en,
  story: { ...en.story, sub: 'La marketplace de créateurs LinkedIn B2B qui connecte les entreprises à des créateurs vérifiés.' },
  started: {
    ...en.started,
    h2: 'Des résultats éprouvés',
    paragraphs: [
      'Naano met en relation des entreprises qui souhaitent se développer avec des créateurs LinkedIn qui souhaitent monétiser leur audience.',
      "Nous pensons que la croissance est plus efficace lorsqu'elle est alimentée par des personnes, et non par des annonces.",
      "C'est pourquoi nous aidons les entreprises à se développer grâce à une croissance dirigée par les créateurs : de vrais professionnels s'adressant à de vrais publics.",
    ],
  },
  mission: {
    ...en.mission,
    h2: 'Faites du marketing de création votre canal de revenus le plus efficace.',
    intro: 'Nous mettons en relation des entreprises B2B avec des micro-créateurs LinkedIn qui tiennent leurs promesses :',
    items: ["Forte crédibilité dans leur secteur d'activité", 'Une confiance qui se transforme en croissance'],
    outro: "De vrais professionnels s'adressant à de vrais publics - à grande échelle.",
  },
  why: {
    ...en.why,
    brands: {
      label: 'Pour les marques',
      items: [
        'Débloquez une nouvelle croissance : Transformez les créateurs de LinkedIn en votre meilleur canal de vente',
        "Renforcez l'autorité de votre marque : Faites-vous recommander par des personnes de confiance dans votre secteur d'activité",
        'Rémunération à la performance uniquement : Payez par clic, pas par message',
      ],
    },
    creators: {
      label: 'Pour les créateurs',
      items: [
        'Votre expertise est un atout : votre crédibilité compte plus que votre nombre de followers.',
        'Monétisez ce que vous faites déjà : Soyez payé pour recommander des outils que vous utilisez réellement',
        "Gagnez de l'argent grâce à votre réseau : Transformez vos posts LinkedIn en revenus",
      ],
    },
  },
  cta: {
    ...en.cta,
    h2: "L'avenir de la croissance",
    body: 'La publicité traditionnelle perd de son impact.',
    footnote: "La collaboration est l'avenir.",
  },
}

export const ABOUT_COPY: Record<Locale, AboutCopy> = { en, fr }
