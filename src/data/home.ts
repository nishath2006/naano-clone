export type TrustLogo = { src: string; alt: string; marqueeHeight: number; trustHeight: number; multiply?: boolean }

/** Client logos, in the order they appear in the hero marquee. */
export const TRUST_LOGOS: TrustLogo[] = [
  { src: '/lp/logo-lemlist.png', alt: 'lemlist', marqueeHeight: 42, trustHeight: 34 },
  { src: '/lp/logo-folk.png', alt: 'folk', marqueeHeight: 30, trustHeight: 24 },
  { src: '/lp/logo-leadbay.png', alt: 'Leadbay', marqueeHeight: 28, trustHeight: 22 },
  { src: '/lp/logo-ringover.png', alt: 'Ringover', marqueeHeight: 42, trustHeight: 34 },
  { src: '/lp/logo-attio.jpg', alt: 'Attio', marqueeHeight: 42, trustHeight: 34, multiply: true },
  { src: '/lp/logo-lagrowthmachine.png', alt: 'La Growth Machine', marqueeHeight: 34, trustHeight: 27 },
  { src: '/lp/logo-gojiberry.png', alt: 'gojiberry', marqueeHeight: 32, trustHeight: 26 },
  { src: '/lp/logo-chatseo.png', alt: 'ChatSEO', marqueeHeight: 40, trustHeight: 32 },
  { src: '/lp/logo-abyssale.png', alt: 'Abyssale', marqueeHeight: 30, trustHeight: 24, multiply: true },
]

export type ResultPost = {
  avatar: string
  name: string
  meta: { en: string; fr: string }
  title: { en: string; fr: string }
  image: string
  imageAlt: string
  imagePosition: string
  impressions: string
  clicks: string
  leads: string
  brandLogo: string
  brandAlt: string
  brandLogoHeight: number
  postUrl: string
}

/** "Proven across thousands of campaigns" post cards (shared with /creators). */
export const RESULT_POSTS: ResultPost[] = [
  {
    avatar: '/lp/avatar-c.png',
    name: 'Thomas Higadère',
    meta: { en: 'Creator · B2B & AI · 34K followers', fr: 'Créateur · B2B & IA · 34K abonnés' },
    title: {
      en: 'How AI changed our prospecting workflow for wealth managers and private bankers.',
      fr: 'Comment l’IA a transformé notre prospection auprès des gestionnaires de patrimoine et des banquiers privés.',
    },
    image: '/lp/photo-calendar.png',
    imageAlt: 'Calendar packed with meetings',
    imagePosition: 'top',
    impressions: '42.8K',
    clicks: '312',
    leads: '18',
    brandLogo: '/lp/logo-lemlist.png',
    brandAlt: 'lemlist',
    brandLogoHeight: 20,
    postUrl: 'https://fr.linkedin.com/posts/thomas-higadere_cgp-banquiers-priv%C3%A9s-g%C3%A9rants-de-fonds-activity-7452932902885015553-UMO7',
  },
  {
    avatar: '/lp/avatar-e.png',
    name: 'Robin Tempe',
    meta: { en: 'Creator · Sales & AI · 12K followers', fr: 'Créateur · Sales & IA · 12K abonnés' },
    title: { en: 'I run my entire prospecting workflow through an AI. Here is how.', fr: 'Je gère toute ma prospection avec une IA. Voici comment.' },
    image: '/lp/photo-claude-mcp-leadbay.png',
    imageAlt: 'Claude Code + MCP Leadbay',
    imagePosition: 'center',
    impressions: '9K',
    clicks: '100',
    leads: '50',
    brandLogo: '/lp/logo-leadbay.png',
    brandAlt: 'Leadbay',
    brandLogoHeight: 14,
    postUrl: 'https://www.linkedin.com/posts/robin-tempe_je-g%C3%A8re-toute-ma-prospection-en-discutant-share-7479799225610924032-ML4u',
  },
  {
    avatar: '/lp/avatar-b.png',
    name: 'Eric Djavid',
    meta: { en: 'Sales Leader · B2B · 40K followers', fr: 'Sales Leader · B2B · 40K abonnés' },
    title: {
      en: 'Most sales teams spend 80% of their time on the wrong leads. Here is how I changed that.',
      fr: 'La plupart des équipes commerciales consacrent 80 % de leur temps aux mauvais leads. Voici comment j’ai changé cela.',
    },
    image: '/lp/photo-leadbay-app.png',
    imageAlt: 'Leadbay app on screen',
    imagePosition: 'center',
    impressions: '20K',
    clicks: '350',
    leads: '80',
    brandLogo: '/lp/logo-leadbay.png',
    brandAlt: 'Leadbay',
    brandLogoHeight: 14,
    postUrl: 'https://www.linkedin.com/posts/eric-djavid-2154b991_la-plupart-des-%C3%A9quipes-sales-passent-80-share-7478351684121997312-MtzH',
  },
  {
    avatar: '/lp/avatar-h.png',
    name: 'Marina Panova',
    meta: { en: 'Content Creator · B2B · 34K followers', fr: 'Content Creator · B2B · 34K abonnés' },
    title: {
      en: 'How I build my 30-day LinkedIn content system, the exact playbook.',
      fr: 'Comment je construis mon système de contenu LinkedIn sur 30 jours — le playbook exact.',
    },
    image: '/lp/photo-marina-laptop.png',
    imageAlt: 'Marina working on laptop',
    imagePosition: 'center',
    impressions: '100K',
    clicks: '1,600',
    leads: '320',
    brandLogo: '/lp/logo-abyssale.png',
    brandAlt: 'Abyssale',
    brandLogoHeight: 16,
    postUrl: 'https://www.linkedin.com/posts/marina-panova_how-i-build-my-30-day-linkedin-content-system-activity-7442495515428126721-n28g',
  },
]
