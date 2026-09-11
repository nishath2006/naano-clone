import type { Seg } from '@/components/site/TextLink'

export type MarketplaceCopy = {
  title: string
  description: string
  hero: { h1: string; lede: string; primary: string; secondary: string }
  what: { h2: string; p1: Seg[]; p2: string }
  how: { h2: string; lede: string; steps: { title: string; body: string }[] }
  vs: { h2: string; lede: string; head: string[]; rows: string[][]; note: Seg[] }
  cost: { h2: string; lede: string; tiles: { value: string; label: string }[]; after: Seg[] }
  who: { h2: string; p: Seg[]; h3: string; p2: Seg[] }
  faq: { h2: string; items: { q: string; a: string }[] }
  cta: { eyebrow: string; h2: string; p: string; primary: string; shortlist: string; pricing: string }
}

export const marketplaceCopy: { en: MarketplaceCopy; fr: MarketplaceCopy } = {
  en: {
    title: 'LinkedIn Creator Marketplace for B2B Brands — Naano',
    description:
      "Naano is the B2B LinkedIn creator marketplace: book vetted LinkedIn creators at a fixed price per post, with payment and tracking handled — available in Europe today, unlike LinkedIn's US-only alpha.",
    hero: {
      h1: 'The LinkedIn creator marketplace built for B2B',
      lede: 'A LinkedIn creator marketplace is a platform where companies find, book, and pay LinkedIn creators for sponsored posts. Naano is the B2B version: 2,000+ vetted creators from about 1,000 to 500,000 followers, each with a fixed price per post shown before booking — live in Europe today.',
      primary: 'Launch a campaign',
      secondary: 'Get a free creator shortlist',
    },
    what: {
      h2: 'What is a LinkedIn creator marketplace?',
      p1: [
        'A LinkedIn creator marketplace connects companies with LinkedIn creators for sponsored creator campaigns: the brand chooses a creator, the creator publishes a post about the brand from their personal account, and the marketplace handles the transaction between the two. Since June 10, 2026, the term covers two different things — the generic category, and ',
        { t: "LinkedIn's own Creator Marketplace", strong: true },
        ', the discovery tool LinkedIn announced inside Campaign Manager (currently in alpha, US and Canada only, English-language content only).',
      ],
      p2: 'The distinction that matters for a buying team is scope. A discovery tool tells you who the creators are. An end-to-end marketplace also handles what comes after: booking, briefing, payment, and per-post tracking. Naano is the second kind, built exclusively for B2B — companies discover and book vetted LinkedIn creators, from about 1,000 to 500,000 followers, at a fixed price per post set by each creator and shown before booking.',
    },
    how: {
      h2: 'How Naano works',
      lede: 'Five steps from brief to measured results. The price of every post is a flat fixed fee, set by the creator and visible before you book — never a cost per click, impression, or lead.',
      steps: [
        { title: 'Match', body: 'Define your vertical and ICP; Naano surfaces vetted creators whose audience contains your buyers, in the language your buyers read.' },
        { title: 'Brief', body: 'You share the campaign brief; creators write in their own voice and you review before anything goes live.' },
        { title: 'Publish', body: "Posts go live from creators' personal accounts, where LinkedIn concentrates organic reach." },
        { title: 'Pay', body: 'Each creator sets a fixed price per post, shown before booking. Naano handles the payment, so creators never have to invoice your company.' },
        { title: 'Track', body: 'Every post carries tracked links, so you see clicks per creator and per post instead of guessing from screenshots.' },
      ],
    },
    vs: {
      h2: "Naano vs LinkedIn's native Creator Marketplace",
      lede: "LinkedIn's Creator Marketplace, announced June 10, 2026, is a genuinely useful discovery tool: creators opt in, and the follower and engagement data is native to LinkedIn rather than scraped or self-reported. But it is an alpha limited to the US and Canada, for English-language content only, and it stops at discovery — you contact creators by email and handle contracting, payment, and measurement yourself. The two products solve different halves of the same problem.",
      head: ['Dimension', 'LinkedIn Creator Marketplace', 'Naano'],
      rows: [
        ['Available in Europe today', 'No — alpha, US and Canada only, English-language content only', 'Yes — live in Europe, local-language creators'],
        ['Self-serve booking', 'No — discovery and email contact; you negotiate offline', 'Yes — book a creator directly on the platform'],
        ['Payment handling', 'Not handled — monetization tools announced with no launch date', 'Handled — creators are paid per post through the platform'],
        ['Pricing transparency', 'Creator fees negotiated by email; amplification billed as Thought Leader Ads media', 'Each creator sets a fixed price per post, shown before booking'],
        ['Performance tracking', 'None built in — you instrument UTMs yourself', 'Per-creator, per-post tracked links included'],
        ['Creator range', 'Opt-in directory with native follower and engagement data', '2,000+ vetted creators, from about 1,000 to 500,000 followers'],
      ],
      note: [
        "LinkedIn product characteristics reflect the June 10, 2026 launch coverage (Digiday, Social Media Today) as of the alpha; verify current availability with LinkedIn. For the full side-by-side, including where LinkedIn's product is genuinely strong, read ",
        { t: 'LinkedIn Creator Marketplace vs Naano', href: '/blog/linkedin-creator-marketplace-vs-naano' },
        '.',
      ],
    },
    cost: {
      h2: 'What sponsored LinkedIn posts cost',
      lede: 'On Naano, each creator sets a fixed price per post, shown before booking. The Naano Index — 239 real sponsored-post bookings on the marketplace between June 14 and August 1, 2026 — puts numbers on what brands actually pay:',
      tiles: [
        { value: '€84', label: 'Median per post, creators under 5K followers' },
        { value: '€180', label: 'Median per post, creators at 5–10K followers' },
        { value: '€312', label: 'Median per post, creators at 10–25K followers' },
      ],
      after: [
        'These are transacted medians, not rate-card estimates. The full dataset, methodology, and price-spread analysis are in the ',
        { t: 'LinkedIn Sponsored Post Price Index 2026', href: '/blog/linkedin-sponsored-post-price-index-2026' },
        ', and every first-party dataset we publish lives on the ',
        { t: 'reports hub', href: '/reports' },
        '.',
      ],
    },
    who: {
      h2: 'Who Naano is for',
      p: [
        'Naano is built for B2B teams whose buyers are on LinkedIn — B2B SaaS companies above all, along with agencies and marketing teams selling to professional audiences. If your pipeline depends on reaching founders, operators, or specialists in a vertical, the creators they already follow are the distribution channel, and a marketplace is the fastest way to book them. If your buyers are consumers on Instagram or TikTok, a consumer influencer platform is a better structural fit — our ',
        { t: '2026 platform comparison', href: '/best-b2b-influencer-marketing-platforms-2026' },
        ' covers those honestly.',
      ],
      h3: 'Is Naano a LinkedIn influencer marketing platform?',
      p2: [
        'Yes. "Influencer marketing platform" and "creator marketplace" describe the same job from two angles. Naano does that job for LinkedIn specifically: instead of a searchable database you export and chase by email, it is a transactional marketplace where you book a vetted creator at a fixed price per post and the platform handles briefing, payment, and per-post tracking. Plans are Self-Serve at €0/month and Managed at €700/month — see ',
        { t: 'pricing', href: '/pricing' },
        ' for the details.',
      ],
    },
    faq: {
      h2: 'Frequently asked questions',
      items: [
        {
          q: 'Is there a LinkedIn creator marketplace available in Europe?',
          a: "Yes. LinkedIn's own Creator Marketplace (announced June 10, 2026) is an alpha limited to advertisers in the US and Canada, with English-language content only and no announced European date. Naano is a B2B LinkedIn creator marketplace that is live in Europe today, with 2,000+ vetted creators publishing in local languages.",
        },
        {
          q: "What is the difference between Naano and LinkedIn's Creator Marketplace?",
          a: "LinkedIn's Creator Marketplace is a creator discovery tool inside Campaign Manager: brands search opted-in creators, see native follower and engagement data, and contact them by email — payment, contracting, and tracking remain the brand's problem. Naano is an end-to-end marketplace: brands book vetted LinkedIn creators at a fixed price per post, and the platform handles briefing, publishing, payment, and per-post tracking. LinkedIn's product is also US/Canada-only alpha, while Naano operates in Europe today.",
        },
        {
          q: 'How much does a sponsored LinkedIn post cost?',
          a: 'Based on 239 real sponsored-post bookings on the Naano marketplace between June 14 and August 1, 2026, the median transacted price was €84 per post for creators under 5,000 followers, €180 at 5,000–10,000 followers, and €312 at 10,000–25,000 followers. On Naano, each creator sets a fixed price per post, shown before booking — there is no cost per click or per impression.',
        },
        {
          q: 'Is Naano an influencer marketing platform?',
          a: 'Yes — Naano is a LinkedIn influencer marketing platform, structured as a marketplace rather than a database: instead of exporting a list of profiles and running outreach yourself, you book a vetted LinkedIn creator at a fixed price per post and the platform handles matching, briefing, payment, and tracking. It is built exclusively for B2B brands on LinkedIn.',
        },
        {
          q: 'How do creators get paid?',
          a: "Naano handles the payment. The fixed per-post fee is known before the post goes live, and the platform pays the creator after publication — creators never issue brand-by-brand invoices, which matters because most active B2B creators are salaried professionals. LinkedIn's own Creator Marketplace does not handle payment; its monetization tools were announced with no launch date.",
        },
        {
          q: 'How much does Naano cost?',
          a: "There are two plans: Self-Serve at €0/month, where you pay only the fixed per-post fee each creator has set, and Managed at €700/month, where Naano handles creator selection, briefs, and campaign management. Every creator's price is a flat fee per post, shown before booking.",
        },
      ],
    },
    cta: {
      eyebrow: 'Available in Europe today',
      h2: 'Book a vetted LinkedIn creator at a fixed price per post',
      p: '2,000+ registered and vetted creators, from about 1,000 to 500,000 followers. Every price is set by the creator and shown before you book — Self-Serve is €0/month.',
      primary: 'Launch a campaign',
      shortlist: 'Get a free creator shortlist',
      pricing: 'See pricing',
    },
  },
  fr: {
    title: 'Marketplace de créateurs LinkedIn pour les marques B2B — Naano',
    description:
      "Naano est la marketplace de créateurs LinkedIn B2B : réservez des créateurs vérifiés à un prix fixe par post, avec paiement et tracking gérés — disponible en Europe aujourd'hui, contrairement à la version alpha de LinkedIn limitée aux États-Unis.",
    hero: {
      h1: 'La marketplace de créateurs LinkedIn conçue pour le B2B',
      lede: "Une marketplace de créateurs LinkedIn est une plateforme où les entreprises trouvent, réservent et paient des créateurs LinkedIn pour des posts sponsorisés. Naano en est la version B2B : plus de 2 000 créateurs vérifiés, d'environ 1 000 à 500 000 abonnés, chacun avec un prix fixe par post affiché avant la réservation — disponible en Europe aujourd'hui.",
      primary: 'Lancer une campagne',
      secondary: 'Obtenir une sélection gratuite de créateurs',
    },
    what: {
      h2: "Qu'est-ce qu'une marketplace de créateurs LinkedIn ?",
      p1: [
        'Une marketplace de créateurs LinkedIn met en relation les entreprises avec des créateurs LinkedIn pour des campagnes sponsorisées : la marque choisit un créateur, celui-ci publie un post sur la marque depuis son compte personnel, et la marketplace gère la transaction entre les deux. Depuis le 10 juin 2026, le terme désigne deux réalités : la catégorie générique et ',
        { t: 'la Creator Marketplace de LinkedIn', strong: true },
        ", l'outil de découverte annoncé par LinkedIn dans Campaign Manager (actuellement en version alpha, limité aux États-Unis et au Canada et au contenu en anglais).",
      ],
      p2: "La distinction importante pour une équipe acheteuse concerne le périmètre. Un outil de découverte vous indique qui sont les créateurs. Une marketplace de bout en bout gère aussi la suite : réservation, brief, paiement et tracking par post. Naano appartient à cette deuxième catégorie et se consacre exclusivement au B2B — les entreprises y trouvent et réservent des créateurs LinkedIn vérifiés, d'environ 1 000 à 500 000 abonnés, à un prix fixe par post défini par chaque créateur et affiché avant la réservation.",
    },
    how: {
      h2: 'Comment fonctionne Naano',
      lede: "Cinq étapes, du brief aux résultats mesurés. Le prix de chaque post est un forfait fixe, défini par le créateur et visible avant la réservation — jamais un coût au clic, à l'impression ou au lead.",
      steps: [
        { title: 'Matching', body: "Définissez votre secteur et votre ICP ; Naano fait remonter des créateurs vérifiés dont l'audience comprend vos acheteurs, dans la langue qu'ils lisent." },
        { title: 'Brief', body: 'Vous partagez le brief de campagne ; les créateurs écrivent avec leur propre voix et vous validez avant toute publication.' },
        { title: 'Publication', body: 'Les posts sont publiés depuis les comptes personnels des créateurs, là où LinkedIn concentre la portée organique.' },
        { title: 'Paiement', body: "Chaque créateur fixe un prix par post, affiché avant la réservation. Naano gère le paiement afin que les créateurs n'aient jamais à facturer votre entreprise." },
        { title: 'Tracking', body: "Chaque post comporte des liens trackés : vous voyez les clics par créateur et par post au lieu de vous fier à des captures d'écran." },
      ],
    },
    vs: {
      h2: 'Naano face à la Creator Marketplace native de LinkedIn',
      lede: "La Marketplace de créateur de LinkedIn, annoncée le 10 juin 2026, est un outil de découverte véritablement utile : les créateurs s'inscrivent, et les données de followers et d'engagement sont natives à LinkedIn plutôt que scrappées ou auto-déclarées. Mais c'est un alpha limité aux États-Unis et au Canada, pour le contenu en anglais uniquement, et il s'arrête à la découverte — vous contactez les créateurs par e-mail et gérez vous-même les contrats, les paiements et les mesures. Les deux produits résolvent les deux moitiés différentes du même problème.",
      head: ['Critère', 'Marketplace de créateurs LinkedIn', 'Naano'],
      rows: [
        ["Disponible en Europe aujourd'hui", 'Non — version alpha limitée aux États-Unis et au Canada, pour du contenu en anglais uniquement', 'Oui — en direct en Europe, créateurs en langue locale'],
        ['Réservation en self-service', 'Non — découverte et contact par e-mail ; vous négociez hors ligne', 'Oui — réservez directement un créateur sur la plateforme'],
        ['Gestion du paiement', 'Non géré — des outils de monétisation ont été annoncés sans date de lancement', 'Géré — les créateurs sont rémunérés par publication via la plateforme'],
        ['Transparence des tarifs', 'Tarifs des créateurs négociés par e-mail ; amplification facturée comme dépense média Thought Leader Ads', 'Chaque créateur fixe un prix par post, affiché avant la réservation'],
        ['Suivi des performances', 'Aucun tracking intégré — vous configurez vous-même les UTM', 'Liens trackés inclus par créateur et par post'],
        ['Éventail de créateurs', "Annuaire sur inscription avec données natives sur les abonnés et l'engagement", "Plus de 2 000 créateurs vérifiés, d'environ 1 000 à 500 000 abonnés"],
      ],
      note: [
        "Les caractéristiques du produit LinkedIn reflètent la couverture de lancement du 10 juin 2026 (Digiday, Social Media Today) au moment de l'alpha ; vérifiez la disponibilité actuelle auprès de LinkedIn. Pour la comparaison complète côte à côte, y compris où le produit de LinkedIn est véritablement fort, lisez ",
        { t: 'LinkedIn Creator Marketplace vs Naano', href: '/blog/linkedin-creator-marketplace-vs-naano' },
        '.',
      ],
    },
    cost: {
      h2: 'Le prix des posts LinkedIn sponsorisés',
      lede: 'Sur Naano, chaque créateur fixe un prix par post, affiché avant la réservation. Le Naano Index — 239 réservations réelles de posts sponsorisés sur la marketplace entre le 14 juin et le 1er août 2026 — montre ce que les marques paient réellement :',
      tiles: [
        { value: '€84', label: 'Médiane par publication, créateurs avec moins de 5K followers' },
        { value: '€180', label: 'Médiane par post, créateurs de 5 000 à 10 000 abonnés' },
        { value: '€312', label: 'Médiane par post, créateurs de 10 000 à 25 000 abonnés' },
      ],
      after: [
        "Il s'agit de médianes de transactions réelles, pas d'estimations issues de grilles tarifaires. L'ensemble des données, la méthodologie et l'analyse de la dispersion des prix figurent dans le ",
        { t: 'LinkedIn Sponsored Post Price Index 2026', href: '/blog/linkedin-sponsored-post-price-index-2026' },
        ', et toutes nos données propriétaires sont réunies dans le ',
        { t: 'hub de rapports', href: '/reports' },
        '.',
      ],
    },
    who: {
      h2: "À qui s'adresse Naano",
      p: [
        "Naano s'adresse aux équipes B2B dont les acheteurs sont sur LinkedIn — en premier lieu les entreprises SaaS B2B, mais aussi les agences et les équipes marketing qui ciblent des audiences professionnelles. Si votre pipeline dépend de fondateurs, d'opérationnels ou de spécialistes sectoriels, les créateurs qu'ils suivent déjà constituent le canal de distribution, et une marketplace est le moyen le plus rapide de les réserver. Si vos acheteurs sont des consommateurs sur Instagram ou TikTok, une plateforme d'influence grand public sera structurellement plus adaptée — notre ",
        { t: 'comparatif des plateformes 2026', href: '/best-b2b-influencer-marketing-platforms-2026' },
        " l'explique en toute transparence.",
      ],
      h3: "Naano est-il une plateforme d'influence marketing LinkedIn ?",
      p2: [
        "Oui. « Plateforme d'influence marketing » et « marketplace de créateurs » décrivent le même besoin sous deux angles. Naano répond à ce besoin spécifiquement pour LinkedIn : au lieu d'une base de données à exporter puis de contacter par e-mail, c'est une marketplace transactionnelle où vous réservez un créateur vérifié à un prix fixe par post et où la plateforme gère le brief, le paiement et le tracking par post. Les formules sont Self-Serve à 0 €/mois et Managed à 700 €/mois — consultez les ",
        { t: 'tarifs', href: '/pricing' },
        ' pour plus de détails.',
      ],
    },
    faq: {
      h2: 'Questions fréquentes',
      items: [
        {
          q: 'Existe-t-il une marketplace de créateurs LinkedIn disponible en Europe ?',
          a: "Oui. La Creator Marketplace de LinkedIn, annoncée le 10 juin 2026, est une version alpha limitée aux annonceurs des États-Unis et du Canada, avec du contenu en anglais uniquement et aucune date annoncée pour l'Europe. Naano est une marketplace de créateurs LinkedIn B2B disponible en Europe aujourd'hui, avec plus de 2 000 créateurs vérifiés publiant dans les langues locales.",
        },
        {
          q: 'Quelle est la différence entre Naano et la Marketplace de créateur de LinkedIn ?',
          a: "La Creator Marketplace de LinkedIn est un outil de découverte intégré à Campaign Manager : les marques recherchent des créateurs inscrits, consultent leurs données natives d'abonnés et d'engagement, puis les contactent par e-mail — le paiement, les contrats et le tracking restent à la charge de la marque. Naano est une marketplace de bout en bout : les marques réservent des créateurs LinkedIn vérifiés à un prix fixe par post, et la plateforme gère le brief, la publication, le paiement et le tracking de chaque post. Le produit de LinkedIn est également une version alpha limitée aux États-Unis et au Canada, tandis que Naano opère déjà en Europe.",
        },
        {
          q: 'Combien coûte un post LinkedIn sponsorisé ?',
          a: "D'après 239 réservations réelles de posts sponsorisés sur la marketplace Naano entre le 14 juin et le 1er août 2026, le prix médian payé était de 84 € par post pour les créateurs de moins de 5 000 abonnés, 180 € entre 5 000 et 10 000 abonnés et 312 € entre 10 000 et 25 000 abonnés. Sur Naano, chaque créateur fixe un prix par post, affiché avant la réservation — il n'y a aucun coût au clic ni à l'impression.",
        },
        {
          q: "Naano est-il une plateforme de marketing d'influenceurs ?",
          a: "Oui — Naano est une plateforme d'influence marketing LinkedIn structurée comme une marketplace plutôt que comme une base de données : au lieu d'exporter une liste de profils et de gérer vous-même la prospection, vous réservez un créateur LinkedIn vérifié à un prix fixe par post, puis la plateforme gère le matching, le brief, le paiement et le tracking. Elle est conçue exclusivement pour les marques B2B sur LinkedIn.",
        },
        {
          q: 'Comment les créateurs sont-ils payés ?',
          a: "Naano gère le paiement. Le forfait par post est connu avant la publication, puis la plateforme paie le créateur après la mise en ligne — les créateurs n'émettent jamais de facture pour chaque marque, ce qui compte puisque la plupart des créateurs B2B actifs sont salariés. La Creator Marketplace de LinkedIn ne gère pas le paiement ; ses outils de monétisation ont été annoncés sans date de lancement.",
        },
        {
          q: 'Combien coûte Naano ?',
          a: 'Deux formules sont proposées : Self-Serve à 0 €/mois, où vous payez uniquement le forfait par post fixé par chaque créateur, et Managed à 700 €/mois, où Naano gère la sélection des créateurs, les briefs et la campagne. Le prix de chaque créateur est un forfait par post affiché avant la réservation.',
        },
      ],
    },
    cta: {
      eyebrow: "Disponible en Europe aujourd'hui",
      h2: 'Réservez un créateur LinkedIn vérifié à un prix fixe par publication',
      p: "Plus de 2 000 créateurs inscrits et vérifiés, d'environ 1 000 à 500 000 abonnés. Chaque prix est fixé par le créateur et affiché avant la réservation — Self-Serve coûte 0 €/mois.",
      primary: 'Lancer une campagne',
      shortlist: 'Obtenir une sélection gratuite de créateurs',
      pricing: 'Voir les tarifs',
    },
  },
}
