import type { Locale } from '@/lib/locale'

export type PricingCopy = {
  title: string
  description: string
  hero: { eyebrow: string; h1: string; intro: string }
  table: {
    plans: [string, string]
    rows: { label: string; selfServe: string; managed: string }[]
    startFree: string
    bookCall: string
    note: string
  }
  perPost: { eyebrow: string; h2: string; paragraphs: string[] }
  faq: { h2: string; items: { q: string; a: string }[] }
  included: { label: string; items: string[] }
  cta: { h2: string; body: string; primary: string; secondary: string }
}

const en: PricingCopy = {
  title: 'Pricing | NaanoX',
  description:
    'NaanoX pricing: Self-Serve is €0/month and each creator sets a fixed offer price. Managed Campaigns is €700/month, done for you.',
  hero: {
    eyebrow: 'Pricing',
    h1: 'NaanoX pricing',
    intro:
      'NaanoX offers two ways to run LinkedIn creator campaigns. Self-Serve costs €0 per month: you get full platform access and pay creators at the fixed price shown on their offer. Managed Campaigns costs €700 per month and adds a NaanoX team that sources creators, writes briefs and runs your campaigns end to end.',
  },
  table: {
    plans: ['Self-Serve', 'Managed Campaigns'],
    rows: [
      { label: 'Price', selfServe: '€0 / month', managed: '€700 / month' },
      {
        label: "What's included",
        selfServe: 'Creator marketplace access, AI-powered brief creation, click/lead/pipeline tracking, automatic creator payouts',
        managed: 'Campaign strategy & positioning, creator sourcing & coordination, brief creation & launch, reporting & optimisation',
      },
      {
        label: 'Creator payment',
        selfServe: "You book the creator's published fixed-price offer",
        managed: 'NaanoX manages creator payments on your behalf',
      },
      {
        label: 'Support',
        selfServe: 'Self-serve platform, help center + email',
        managed: 'Dedicated NaanoX team, book a campaign call',
      },
    ],
    startFree: 'Start for free',
    bookCall: 'Book a campaign call',
    note: 'Campaign spend is separate from the plan fee. No lock-in, cancel anytime.',
  },
  perPost: {
    eyebrow: 'How it works',
    h2: 'How per-post pricing works',
    paragraphs: [
      'Marketplace offers use a fixed price chosen by the creator. The amount and included deliverables are visible before you book; there is no cost per click, impression, or lead.',
      'You review and approve the content a creator submits. Once approved, the post goes live and payment is released to the creator automatically through Stripe Connect, invoices and approvals are handled for you inside the platform.',
      'On Self-Serve there is no platform retainer; you fund the offers you choose. On Managed Campaigns, creator spend remains separate and the €700 monthly fee covers the NaanoX team running the campaign for you.',
    ],
  },
  faq: {
    h2: 'Pricing FAQ',
    items: [
      {
        q: "What's the minimum budget to start on NaanoX?",
        a: 'Self-Serve is €0 per month. Creator spend depends on the offers you book, and the exact fixed price is shown before you commit.',
      },
      {
        q: 'How much does a single post cost?',
        a: 'Each creator sets a fixed price for their offer. You see the amount and included deliverables before booking; there is no cost per click or impression.',
      },
      {
        q: 'Can I upgrade to Managed Campaigns or cancel anytime?',
        a: 'Yes. Both plans are month-to-month with no lock-in. You can move from Self-Serve to Managed Campaigns, downgrade, or cancel whenever you like. Campaign spend is always separate from the plan fee.',
      },
      {
        q: 'How do creator payouts work?',
        a: 'Creators are paid automatically through Stripe Connect once you approve their content. Invoices, approvals and payment records are handled inside the platform on both Self-Serve and Managed Campaigns.',
      },
      {
        q: 'What exactly is included in the €700/month Managed plan?',
        a: 'Managed Campaigns adds a dedicated NaanoX team that handles campaign strategy, creator sourcing and coordination, brief creation, campaign launch, and reporting and optimisation, on top of everything in Self-Serve.',
      },
      {
        q: 'Do you still charge per click?',
        a: 'No. Marketplace offers use a fixed price shown before booking, with no cost per click, impression, or lead.',
      },
    ],
  },
  included: {
    label: 'Both plans include',
    items: [
      'Browse eligible LinkedIn creator profiles and fixed-price offers',
      'Tracking from click to lead to pipeline for every post',
      'Automatic creator payouts via Stripe Connect',
      'Month-to-month billing, no lock-in',
    ],
  },
  cta: {
    h2: "Start free, upgrade when you're ready.",
    body: 'Self-Serve is €0 per month. Managed Campaigns is €700 per month. Creator spend is separate and shown before every booking.',
    primary: 'Start for free',
    secondary: 'Book a campaign call',
  },
}

const fr: PricingCopy = {
  title: 'Tarification | NaanoX',
  description:
    'Tarifs NaanoX : Self-Serve coûte 0 € par mois et chaque créateur fixe le prix de son offre. Managed Campaigns coûte 700 € par mois et nous nous occupons de tout.',
  hero: {
    eyebrow: 'Tarification',
    h1: 'Tarifs NaanoX',
    intro:
      'NaanoX propose deux façons de lancer des campagnes avec des créateurs LinkedIn. Self-Serve coûte 0 € par mois : vous accédez à toute la plateforme et payez chaque créateur au prix fixe affiché sur son offre. Managed Campaigns coûte 700 € par mois et ajoute une équipe NaanoX qui source les créateurs, rédige les briefs et pilote vos campagnes de A à Z.',
  },
  table: {
    plans: ['Self-Serve', 'Managed Campaigns'],
    rows: [
      { label: 'Prix', selfServe: '0 € / mois', managed: '700 € / mois' },
      {
        label: 'Ce qui est inclus',
        selfServe:
          'Accès à la Marketplace de créateurs, création de brief par IA, suivi des clics, leads et du pipeline, paiements automatiques des créateurs',
        managed:
          'Stratégie et positionnement de campagne, sourcing et coordination des créateurs, création du brief et lancement, reporting et optimisation',
      },
      {
        label: 'Paiement des créateurs',
        selfServe: "Vous réservez l'offre à prix fixe publiée par le créateur",
        managed: 'NaanoX gère les paiements des créateurs en votre nom',
      },
      {
        label: 'Assistance',
        selfServe: "Plateforme en libre-service, centre d'aide + e-mail",
        managed: 'Équipe NaanoX dédiée, avec un appel de cadrage de campagne',
      },
    ],
    startFree: 'Commencer gratuitement',
    bookCall: 'Réserver un appel de cadrage',
    note: "Le budget de campagne est séparé du prix de l'offre. Sans engagement, résiliable à tout moment.",
  },
  perPost: {
    eyebrow: 'Comment ça marche',
    h2: 'Comment fonctionne le prix par post',
    paragraphs: [
      "Sur la Marketplace, chaque créateur fixe le prix de son offre. Le montant et les livrables inclus sont visibles avant le booking ; il n'y a aucun coût par clic, par impression ou par lead.",
      'Vous relisez et approuvez le contenu envoyé par le créateur. Après validation, le post est publié et le paiement est automatiquement versé via Stripe Connect ; factures et validations sont gérées dans la plateforme.',
      "Avec Self-Serve, aucun abonnement plateforme : vous financez les offres que vous choisissez. Avec Managed Campaigns, le budget créateurs reste séparé et les 700 € mensuels couvrent l'équipe NaanoX qui pilote la campagne pour vous.",
    ],
  },
  faq: {
    h2: 'FAQ sur les tarifs',
    items: [
      {
        q: 'Quel est le budget minimum nécessaire pour se lancer sur NaanoX ?',
        a: 'Self-Serve coûte 0 € par mois. Votre budget créateurs dépend des offres que vous réservez, et le prix fixe exact est affiché avant tout engagement.',
      },
      {
        q: 'Combien coûte une publication ?',
        a: "Chaque créateur fixe le prix de son offre. Vous voyez le montant et les livrables inclus avant le booking ; aucun coût par clic ou par impression ne s'ajoute.",
      },
      {
        q: "Puis-je passer à l'offre « Campagnes gérées » ou résilier mon abonnement à tout moment ?",
        a: "Oui. Les deux offres sont mensuelles et sans engagement. Vous pouvez passer de Self-Serve à Managed Campaigns, revenir à Self-Serve ou résilier à tout moment. Le budget de campagne reste toujours séparé du prix de l'offre.",
      },
      {
        q: 'Comment fonctionnent les paiements des créateurs ?',
        a: 'Les créateurs sont payés automatiquement via Stripe Connect dès que vous approuvez leur contenu. Factures, validations et historique des paiements sont gérés dans la plateforme, avec Self-Serve comme avec Managed Campaigns.',
      },
      {
        q: 'Que comprend exactement la formule « Managed » à 700 € par mois ?',
        a: "Managed Campaigns ajoute une équipe NaanoX dédiée qui prend en charge la stratégie, le sourcing et la coordination des créateurs, la création du brief, le lancement, le reporting et l'optimisation, en plus de tout ce qui est inclus dans Self-Serve.",
      },
      {
        q: 'Facturez-vous toujours au clic ?',
        a: 'Non. Les offres de la Marketplace affichent un prix fixe avant le booking, sans coût par clic, par impression ou par lead.',
      },
    ],
  },
  included: {
    label: 'Les deux formules comprennent',
    items: [
      'Parcourez les profils de créateurs LinkedIn éligibles et les offres à prix fixe',
      'Suivi de chaque post, du clic au lead puis au pipeline',
      'Paiements automatiques aux créateurs via Stripe Connect',
      'Facturation mensuelle, sans engagement',
    ],
  },
  cta: {
    h2: 'Commencez gratuitement, passez à Managed Campaigns quand vous le souhaitez.',
    body: 'Self-Serve coûte 0 € par mois. Managed Campaigns coûte 700 € par mois. Le budget créateurs est séparé et affiché avant chaque booking.',
    primary: 'Commencer gratuitement',
    secondary: 'Réserver un appel de cadrage',
  },
}

export const PRICING_COPY: Record<Locale, PricingCopy> = { en, fr }
