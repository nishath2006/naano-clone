import type { Locale } from '@/lib/locale'

/**
 * Copy of /selection (captured html/selection.html and html/fr/selection.html).
 * The live French page keeps almost everything in English: only the "What
 * NaanoX is" intro paragraph is translated, so `fr` reuses `en` for the rest.
 */
export const selectionMeta = {
  title: 'Find LinkedIn Creators for B2B — Free Creator Search | NaanoX',
  description:
    'Find the LinkedIn creators your B2B buyers already trust. Describe your campaign and a real person at NaanoX hand-builds your shortlist — with pricing and audience fit — within 48 hours. Free, no account, no commitment.',
}

export const selectionHeader = { signedIn: 'Already have an account?', signIn: 'Sign in' }

export const selectionHero = {
  eyebrow: 'FREE LINKEDIN CREATOR SEARCH',
  h1: 'Find the LinkedIn creators your buyers already trust.',
  subBefore: "Skip weeks of manual sourcing. Tell us what you're launching, and a real person at NaanoX hand-picks the creators worth contacting — with pricing and audience fit — ",
  subBold: 'in your inbox within 48 hours',
  subAfter: ". Free, and there's nothing to commit to.",
  points: ['Hand-picked by a human, not an algorithm', 'Free — no account, no card, no commitment', 'In your inbox within 48 hours'],
}

export const selectionAside = {
  eyebrow: 'What you receive',
  title: 'A shortlist you can act on the same day.',
  body: 'We return the creators who genuinely fit your campaign and audience — each with pricing, audience fit, and why they belong in your campaign. The list scales with your budget, from a few hand-picked profiles to a full roster.',
  stats: [
    { value: '2,000+', label: 'vetted B2B creators' },
    { value: '48h', label: 'to your inbox' },
    { value: '€0', label: 'no commitment' },
  ],
  callout: { title: 'No artificial creator count', body: 'Every profile includes pricing, audience fit and a clear reason why they belong in your campaign.' },
  examplesTitle: 'Example matches',
  examplesHint: 'Based on your brief',
  examples: [
    { avatar: '/lp/avatar-a.png', name: 'Clara Moreau', role: 'Sales advisor · B2B & AI', value: '47%', metric: 'ICP audience' },
    { avatar: '/lp/avatar-b.png', name: 'Karim Benali', role: 'Product leader · B2B SaaS', value: '54K', metric: 'avg. views' },
    { avatar: '/lp/avatar-c.png', name: 'Thibault Louis', role: 'SaaS founder · Growth', value: '€870', metric: 'per post' },
  ],
  sourced: { title: 'Sourced by the NaanoX campaign team', body: 'Inside our marketplace and beyond it.' },
}

/** Strings of the client-side form (hard-coded in the live bundle, EN only). */
export const selectionForm = {
  title: 'Get your creator shortlist.',
  subtitle: 'Takes 2 minutes. No account, no card — just your brief.',
  badge: 'Human-led',
  company: 'Company name',
  companyPlaceholder: 'Acme',
  website: 'Website ',
  optional: '· optional',
  websitePlaceholder: 'company.com',
  email: 'Work email',
  emailPlaceholder: 'you@company.com',
  goal: "What's your goal?",
  goals: [
    { label: 'Generate leads', hint: 'Drive demos and qualified demand' },
    { label: 'Build awareness', hint: 'Reach your market repeatedly' },
    { label: 'Launch a product', hint: 'Introduce a new offer or feature' },
  ],
  budget: 'Exact creator budget ',
  budgetHint: '· campaign spend only',
  budgetAria: 'Exact creator budget',
  budgetHelp: 'Enter the exact amount you want to spend',
  budgetPresets: [2500, 10000, 50000],
  currency: 'EUR',
  target: 'Who do you want to reach?',
  targetPlaceholder: 'e.g. RevOps leaders at B2B SaaS companies',
  submit: 'Get my free creator shortlist →',
  sending: 'Sending…',
  error: 'Something went wrong. Please try again, or email us at info@naano.com.',
  footnote: 'Free creator selection · No commitment · Delivered by email within 48h',
  doneTitle: 'Your search has started.',
  doneBody: 'Our team will review your campaign and return every creator worth contacting for your budget. Your shortlist lands in your inbox within 48 hours.',
  doneAgain: 'Submit another campaign',
}

export const selectionManaged = { question: 'Want NaanoX to run the entire campaign?', cta: 'Talk to the managed campaigns team →' }

export const selectionLogos = {
  label: 'Trusted by B2B teams at',
  logos: [
    { src: '/lp/logo-lemlist.png', alt: 'lemlist' },
    { src: '/lp/logo-folk.png', alt: 'folk' },
    { src: '/lp/logo-ringover.png', alt: 'Ringover' },
    { src: '/lp/logo-attio.jpg', alt: 'Attio' },
    { src: '/lp/logo-gojiberry.png', alt: 'gojiberry' },
  ],
}

export const selectionHowTo = {
  title: 'How to find LinkedIn creators for your campaign',
  intro: 'You can search LinkedIn by hand, buy a creator database, or have someone do it for you. This tool is the third option, and it costs nothing.',
  steps: [
    { title: 'Describe your campaign', body: 'Tell us what you sell, who your buyer is, and roughly what budget you are working with. Four fields, about two minutes.' },
    {
      title: 'A human searches',
      body: 'A member of the NaanoX campaign team searches inside the NaanoX marketplace and across the wider LinkedIn ecosystem for creators whose audience genuinely overlaps your buyer.',
    },
    { title: 'Receive your shortlist', body: 'Within 48 hours you get the creators worth contacting, each with pricing, audience fit, and the reason they belong in your campaign.' },
    { title: 'Book or take the list and go', body: 'Book the creators through NaanoX at a flat fee per post from €20, or use the shortlist however you want — there is no obligation.' },
  ],
}

type WhatIsNaano = {
  title: string
  introBefore: string
  introBold: string
  introAfter: string
  facts: { value: string; label: string }[]
  outroBefore: string
  link1: { label: string; href: string }
  outroMiddle: string
  link2: { label: string; href: string }
  outroAfter: string
  buttons: { label: string; href: string }[]
}

const whatIsNaanoEn: WhatIsNaano = {
  title: 'First time here? What NaanoX is.',
  introBefore: 'NaanoX is a ',
  introBold: 'B2B LinkedIn creator marketplace',
  introAfter:
    '. B2B companies book LinkedIn posts from vetted creators — practitioners with high-fit professional audiences, from about 1K to 500K followers — at a flat fee per post. We handle the parts that usually kill these programs: matching, briefing, payment, and click tracking.',
  facts: [
    { value: '2,000+', label: 'registered and vetted B2B LinkedIn creators, from about 1K to 500K followers, each in a defined vertical.' },
    { value: 'From €20', label: 'flat fee per post, set by the creator. No impression billing, no retainer lock-in.' },
    { value: '€0/month', label: 'on the Self-Serve plan. Managed, where we run the campaign for you, is €700/month.' },
    { value: 'No invoices', label: 'NaanoX pays creators directly, so salaried experts can take part without a registered company.' },
  ],
  outroBefore: "The reason this works in B2B is relevance, not reach: a creator with 3,000 followers who all do your buyer's job outperforms a generalist with 100,000. More on that in ",
  link1: { label: 'why nano-creators outperform macro-creators', href: '/blog/nano-vs-macro-creators-b2b-ctr' },
  outroMiddle: ' and ',
  link2: { label: 'what a B2B creator marketplace is', href: '/blog/what-is-a-b2b-creator-marketplace' },
  outroAfter: '.',
  buttons: [
    { label: 'See pricing', href: '/pricing' },
    { label: 'About NaanoX', href: '/about' },
    { label: 'All free tools', href: '/free-tools' },
  ],
}

const whatIsNaanoFr: WhatIsNaano = {
  ...whatIsNaanoEn,
  introBefore: 'NaanoX est une ',
  introBold: 'marketplace de créateurs LinkedIn B2B',
  introAfter:
    ". Les entreprises B2B réservent des posts LinkedIn auprès de créateurs vérifiés — des professionnels disposant d'audiences pertinentes, d'environ 1 000 à 500 000 abonnés — à un prix fixe par post. Nous gérons les étapes qui font habituellement échouer ces programmes : matching, brief, paiement et tracking des clics.",
}

export const selectionWhatIsNaano: Record<Locale, WhatIsNaano> = { en: whatIsNaanoEn, fr: whatIsNaanoFr }

export const selectionFaq = {
  title: 'Frequently asked questions',
  items: [
    {
      q: 'How do I find LinkedIn creators for a B2B campaign?',
      a: "Three routes. Search LinkedIn manually by job title and topic, which is free but slow and gives you no pricing or willingness-to-post signal. Use a creator database such as Favikon, which surfaces who exists but stops before booking. Or use a B2B creator marketplace, where creators have already published their price and opted in to sponsored posts. NaanoX's free creator search does the third route for you: describe your campaign and a real person returns a shortlist with pricing and audience fit within 48 hours.",
    },
    {
      q: 'Is the NaanoX creator search really free?',
      a: 'Yes. There is no cost, no account required, and no payment method requested. You keep the shortlist whether or not you run a campaign with NaanoX, including if you decide to contact the creators directly yourself.',
    },
    {
      q: 'How long does it take to receive the shortlist?',
      a: 'Within 48 hours. It is built by a member of the NaanoX campaign team rather than generated automatically, which is why it takes hours rather than seconds — and why every profile comes with a reason it belongs in your campaign.',
    },
    {
      q: 'How many creators are in the shortlist?',
      a: 'It scales with your campaign budget rather than hitting a fixed quota, from a few hand-picked profiles to a full campaign roster. We would rather send four genuinely relevant creators than pad the list to twenty.',
    },
    {
      q: 'What counts as a good B2B LinkedIn creator?',
      a: 'Audience fit over audience size. A creator with 3,000 followers who are all RevOps managers outperforms a generalist with 100,000 followers for a sales-tech company, because B2B buys relevance, not reach. The signals that matter are the job titles in their comment section, posting consistency, and whether they already write about your category.',
    },
    {
      q: 'What is NaanoX?',
      a: 'NaanoX is a B2B LinkedIn creator marketplace: a curated marketplace of 2,000+ registered and vetted LinkedIn creators (from about 1,000 to 500,000 followers), where B2B companies book posts at a flat fee per post from €20. NaanoX pays the creator directly, so salaried experts can take part without issuing an invoice, and every post carries tracked links so spend maps to measured clicks.',
    },
  ],
}

export const selectionRelated = {
  title: 'Related reading',
  links: [
    { label: 'How to find B2B creators on LinkedIn: a practical sourcing guide', href: '/blog/how-to-find-b2b-creators-linkedin' },
    { label: 'Best B2B creator marketplaces in 2026 (ranked)', href: '/blog/best-b2b-creator-marketplace' },
    { label: 'How to launch your first B2B LinkedIn creator campaign in 30 days', href: '/blog/launch-b2b-linkedin-creator-campaign' },
    { label: 'How much does B2B influencer marketing cost in 2026?', href: '/blog/b2b-influencer-marketing-cost' },
    { label: 'How to write a B2B sponsored post that converts', href: '/blog/how-to-write-b2b-sponsored-post' },
  ],
}
