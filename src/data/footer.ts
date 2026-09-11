import type { Locale } from '@/lib/locale'
import type { NavLink } from './nav'

export type FooterColumn = { heading: string; links: NavLink[]; subHeading?: string; subLinks?: NavLink[] }

export type FooterCopy = {
  tagline: string
  columns: FooterColumn[]
  legal: string
  trustpilot: string
}

const press: NavLink[] = [
  { label: 'Interview Thomas Marcelle, Xymag.tv', href: 'https://www.xymag.tv/les-videos/interview-de-thomas-marcelle-createur-de-naano/' },
  { label: 'Naano on FounderTrace', href: 'https://foundertrace.fr/25-000e-de-ca-en-2-mois-comment-trois-etudiants-ont-reinvente-la-micro-influence-b2b-avec-naano/' },
  { label: 'Naano on TechnicalBeep', href: 'https://technicalbeep.com/naano-b2b-linkedin-creator-pay-per-click/' },
]

const pressFr: NavLink[] = [
  { label: 'Entretien avec Thomas Marcelle, Xymag.tv', href: press[0].href },
  { label: 'Naano sur FounderTrace', href: press[1].href },
  { label: 'Naano sur TechnicalBeep', href: press[2].href },
]

const resourceHrefs = [
  '/linkedin-creator-marketplace',
  '/best-b2b-influencer-marketing-platforms-2026',
  '/blog/b2b-influencer-marketing-cost',
  '/blog/launch-b2b-linkedin-creator-campaign',
  '/blog/linkedin-creator-marketplace-europe',
  '/blog/how-to-pay-b2b-creators',
  '/blog/linkedin-creator-marketplace-explained',
  '/blog/what-is-a-b2b-creator-marketplace',
  '/blog/creator-led-growth-b2b',
  '/blog/linkedin-ads-vs-creator-led-cpl',
  '/blog/nano-vs-macro-creators-b2b-ctr',
  '/blog/b2b-influence-linkedin',
  '/blog/founder-led-distribution-b2b-saas',
  '/blog/naano-vs-alternatives',
]

const resourcesEn = [
  'LinkedIn creator marketplace',
  'Best B2B influencer platforms 2026',
  'B2B influencer marketing cost',
  'Launch a LinkedIn creator campaign',
  'LinkedIn Creator Marketplace in Europe',
  'How to pay B2B creators',
  'Creator Marketplace explained',
  'What is a B2B creator marketplace?',
  'Creator-led growth for B2B',
  'LinkedIn Ads vs creator-led CPL',
  'Nano vs macro creators in B2B',
  'B2B influence on LinkedIn',
  'Founder-led distribution for SaaS',
  'Naano vs alternatives',
].map((label, i) => ({ label, href: resourceHrefs[i] }))

const resourcesFr = [
  'Marketplace de créateurs LinkedIn',
  "Meilleures plateformes d'influence B2B 2026",
  "Coût du marketing d'influence B2B",
  'Lancer une campagne avec des créateurs LinkedIn',
  'Marketplace de créateurs LinkedIn en Europe',
  'Comment payer des créateurs B2B',
  'Comprendre la Marketplace de créateurs',
  "Qu'est-ce qu'une Marketplace de créateurs B2B ?",
  'Croissance B2B portée par les créateurs',
  'LinkedIn Ads ou CPL porté par les créateurs',
  'Créateurs nano vs macro en B2B',
  'Influence B2B sur LinkedIn',
  'Distribution SaaS portée par les fondateurs',
  'Naano par rapport aux alternatives',
].map((label, i) => ({ label, href: resourceHrefs[i] }))

/** Footer of the landing pages (home, creators, agencies). */
export function getLpFooter(locale: Locale, variant: 'home' | 'creators' | 'agencies' = 'home'): FooterCopy {
  if (locale === 'fr') {
    return {
      tagline:
        variant === 'creators'
          ? 'Faites de votre audience LinkedIn un canal rémunéré.'
          : "Faites des créateurs LinkedIn votre meilleur canal d'acquisition.",
      columns: [
        {
          heading: 'PRODUIT',
          links: [
            { label: 'Fonctionnalités', href: '/#how-it-works' },
            { label: 'Tarifs', href: '/#pricing' },
            { label: 'FAQ', href: '/#faq' },
            { label: 'Blog', href: '/blog' },
            { label: 'Rapports & benchmarks', href: '/reports' },
            { label: 'À propos', href: '/about' },
          ],
        },
        {
          heading: 'ENTREPRISE',
          links: [
            { label: "Centre d'aide", href: '/help' },
            { label: 'Confidentialité', href: '/privacy' },
            { label: 'Conditions générales de vente et d’utilisation', href: '/terms' },
          ],
          subHeading: 'Pour les agents IA',
          subLinks: [
            { label: 'llms.txt', href: '/llms.txt' },
            { label: 'pricing.md', href: '/pricing.md' },
            { label: 'Reports & données', href: '/reports' },
          ],
        },
        { heading: 'PRESSE', links: pressFr },
        { heading: 'RESSOURCES', links: resourcesFr },
      ],
      legal: '© 2026 naano. Tous droits réservés.',
      trustpilot: 'Avis Trustpilot',
    }
  }
  return {
    tagline:
      variant === 'creators'
        ? 'Turn your LinkedIn audience into a paid channel.'
        : 'Turn LinkedIn creators into your best acquisition channel.',
    columns: [
      {
        heading: 'PRODUCT',
        links: [
          { label: 'Features', href: '/#how-it-works' },
          { label: 'Pricing', href: '/#pricing' },
          { label: 'FAQs', href: '/#faq' },
          { label: 'Blog', href: '/blog' },
          { label: 'Reports & benchmarks', href: '/reports' },
          { label: 'About', href: '/about' },
        ],
      },
      {
        heading: 'COMPANY',
        links: [
          { label: 'Help Center', href: '/help' },
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms of Sale & Use', href: '/terms' },
        ],
        subHeading: 'For AI agents',
        subLinks: [
          { label: 'llms.txt', href: '/llms.txt' },
          { label: 'pricing.md', href: '/pricing.md' },
          { label: 'Reports & data', href: '/reports' },
        ],
      },
      { heading: 'PRESS', links: press },
      { heading: 'RESOURCES', links: resourcesEn },
    ],
    legal: '© 2026 naano. All rights reserved.',
    trustpilot: 'Trustpilot reviews',
  }
}

/** Footer of the Plus-Jakarta pages (about, pricing, free tools, …). */
export function getSiteFooter(locale: Locale) {
  const en = {
    tagline: 'Turn LinkedIn creators into your best acquisition channel.',
    product: {
      heading: 'Product',
      links: [
        { label: 'Features', href: '/#how-it-works' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'FAQs', href: '/#faq' },
        { label: 'Blog', href: '/blog' },
        { label: 'Free Tools', href: '/free-tools' },
        { label: 'Benchmarks', href: '/benchmarks/q2-2026' },
        { label: 'About', href: '/about' },
      ],
    },
    company: {
      heading: 'Company',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms of Sale & Use', href: '/terms' },
      ],
    },
    press: {
      heading: 'Press',
      links: [
        { label: 'Interview Thomas Marcelle — Xymag.tv', href: press[0].href },
        { label: 'Naano on FounderTrace', href: press[1].href },
        { label: 'Naano on TechnicalBeep', href: press[2].href },
      ],
    },
    resources: {
      heading: 'Resources',
      links: [
        { label: 'Best B2B influencer platforms 2026', href: '/best-b2b-influencer-marketing-platforms-2026' },
        { label: 'Creator-led growth for B2B', href: '/blog/creator-led-growth-b2b' },
        { label: 'B2B influencer marketing cost', href: '/blog/b2b-influencer-marketing-cost' },
        { label: 'What is a B2B creator marketplace?', href: '/blog/what-is-a-b2b-creator-marketplace' },
        { label: 'Launch a LinkedIn creator campaign', href: '/blog/launch-b2b-linkedin-creator-campaign' },
        { label: 'LinkedIn Creator Marketplace in Europe', href: '/blog/linkedin-creator-marketplace-europe' },
        { label: 'How to pay B2B creators', href: '/blog/how-to-pay-b2b-creators' },
        { label: 'Creator Marketplace explained', href: '/blog/linkedin-creator-marketplace-explained' },
        { label: 'LinkedIn Ads vs creator-led CPL', href: '/blog/linkedin-ads-vs-creator-led-cpl' },
        { label: 'Nano vs macro creators in B2B', href: '/blog/nano-vs-macro-creators-b2b-ctr' },
        { label: 'B2B influence on LinkedIn', href: '/blog/b2b-influence-linkedin' },
        { label: 'Founder-led distribution for SaaS', href: '/blog/founder-led-distribution-b2b-saas' },
        { label: 'Naano vs alternatives', href: '/blog/naano-vs-alternatives' },
      ],
      aiHeading: 'For AI agents',
      aiLinks: [
        { label: 'llms.txt', href: '/llms.txt' },
        { label: 'pricing.md', href: '/pricing.md' },
        { label: 'Reports & data', href: '/reports' },
      ],
    },
    legal: '© 2026 naano. All rights reserved.',
    trustpilot: 'Trustpilot reviews',
  }
  if (locale === 'en') return en
  return {
    ...en,
    tagline: "Faites des créateurs LinkedIn votre meilleur canal d'acquisition.",
    product: {
      heading: 'Produit',
      links: [
        { label: 'Fonctionnalités', href: '/#how-it-works' },
        { label: 'Tarifs', href: '/#pricing' },
        { label: 'FAQ', href: '/#faq' },
        { label: 'Blog', href: '/blog' },
        { label: 'Outils gratuits', href: '/free-tools' },
        { label: 'Benchmarks', href: '/benchmarks/q2-2026' },
        { label: 'À propos', href: '/about' },
      ],
    },
    company: {
      heading: 'Entreprise',
      links: [
        { label: "Centre d'aide", href: '/help' },
        { label: 'Confidentialité', href: '/privacy' },
        { label: 'Conditions générales de vente et d’utilisation', href: '/terms' },
      ],
    },
    press: { heading: 'Presse', links: pressFr },
    resources: {
      ...en.resources,
      heading: 'Ressources',
      links: resourcesFr.filter((l) => l.href !== '/linkedin-creator-marketplace'),
      aiHeading: 'Pour les agents IA',
      aiLinks: [
        { label: 'llms.txt', href: '/llms.txt' },
        { label: 'pricing.md', href: '/pricing.md' },
        { label: 'Reports & données', href: '/reports' },
      ],
    },
    legal: '© 2026 naano. Tous droits réservés.',
    trustpilot: 'Avis Trustpilot',
  }
}
