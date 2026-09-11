/**
 * Per-vertical data for `/for/:sector`. Everything else on those pages is
 * identical across the eight captures; the derived strings ("Start a X
 * campaign", "Who the X creators are", …) are built in the page from `label`,
 * `short` and `n`.
 */
export type SectorSlug =
  | 'sales-tech'
  | 'revops'
  | 'devtools'
  | 'product'
  | 'hr-tech'
  | 'fintech'
  | 'marketing-ops'
  | 'vertical-saas'

export type Sector = {
  slug: SectorSlug
  /** Capitalised name: "Sales-tech", "RevOps", "Vertical SaaS" */
  label: string
  /** Lower-case form used in running copy: "sales-tech", "vertical saas" */
  short: string
  /** Q1 2026 campaigns analysed */
  n: number
  p10: number
  median: number
  p90: number
  title: string
  description: string
  h1: string
  intro: string
  analysis: string
  who: string
  bullets: string[]
  faq: { q: string; a: string }[]
}

export const SECTOR_ORDER: SectorSlug[] = [
  'sales-tech',
  'revops',
  'devtools',
  'product',
  'hr-tech',
  'fintech',
  'marketing-ops',
  'vertical-saas',
]

export const sectors: Record<SectorSlug, Sector> = {
  'sales-tech': {
    slug: 'sales-tech',
    label: 'Sales-tech',
    short: 'sales-tech',
    n: 58,
    p10: 11,
    median: 16,
    p90: 23,
    title: 'B2B Influencer Marketing for Sales-Tech SaaS | Naano',
    description:
      'Run LinkedIn creator campaigns for sales-tech products: vetted SDR, AE and sales-leadership creators, fixed per-post pricing from €20, median CPL €16 (Q1 2026, n=58 campaigns).',
    h1: 'LinkedIn creator marketing for sales-tech SaaS',
    intro:
      "Sales-tech is Naano's deepest creator pool: SDR coaches, AE practitioners, and sales leaders whose audiences are the exact buyers of prospecting, engagement, and revenue tooling. A sponsored post from a voice their feed already trusts outperforms a cold ad on every click metric.",
    analysis:
      'Sales-tech runs below the €18 platform mean because creator supply is dense and the buyer persona is sharply defined: the audiences of sales creators are overwhelmingly quota-carrying practitioners feeling pipeline pain daily.',
    who: 'SDR managers and coaches posting about cold outbound, AEs sharing discovery and closing frameworks, RevOps-adjacent sales leaders — typically 2k–8k followers with 70–90% sales-practitioner audiences.',
    bullets: [
      'Launch a new prospecting or sales-engagement tool to an audience of active SDRs and AEs',
      'Warm up a defined account list before an SDR outbound sequence — engagers become the warm list',
      'Counter LinkedIn Ads fatigue in a category where every competitor is bidding on the same job titles',
    ],
    faq: [
      {
        q: 'What does a sales-tech creator campaign cost on Naano?',
        a: 'Posts are booked at a fixed price from €20 per post (median creator ~€150). In Q1 2026, sales-tech campaigns delivered a median cost per qualified click of €16 across 58 campaigns — the second-cheapest vertical on the platform.',
      },
      {
        q: 'Which creators cover sales-tech?',
        a: 'SDR coaches, AE practitioners, and sales leaders with 2k–8k LinkedIn followers, vetted for audience fit. Their followers are predominantly quota-carrying sales professionals — the buying users of sales-tech products.',
      },
      {
        q: 'How fast can a sales-tech campaign launch?',
        a: 'Median time from brief to first live post is 7 days across the platform. Sales-tech is usually faster than average because the creator pool is deep enough to match most briefs in one pass.',
      },
    ],
  },
  revops: {
    slug: 'revops',
    label: 'RevOps',
    short: 'revops',
    n: 41,
    p10: 12,
    median: 17,
    p90: 24,
    title: 'B2B Influencer Marketing for RevOps SaaS | Naano',
    description:
      'Reach RevOps leaders through the LinkedIn creators they already read: fixed per-post pricing from €20, median CPL €17 (Q1 2026, n=41 campaigns).',
    h1: 'LinkedIn creator marketing for RevOps SaaS',
    intro:
      "RevOps audiences are small and extremely high-intent: operators who evaluate tooling for a living. Naano's RevOps creators — practitioners posting about pipeline hygiene, forecasting, and go-to-market ops — reliably outperform paid retargeting on click quality.",
    analysis:
      'Median CPL sits just below the €18 platform mean. The long tail reflects scarcer creators in niche sub-verticals like usage-based pricing or PLG ops — briefs in those niches take an extra matching pass.',
    who: 'RevOps leads and consultants with 2k–6k followers posting about CRM hygiene, forecasting, territory design, and GTM tooling — audiences dense in exactly the operators who own the tooling budget.',
    bullets: [
      'Put a data-quality, forecasting, or commission tool in front of the operators who run those workflows',
      'Seed a category narrative (e.g. "spreadsheets are breaking your forecast") through voices operators trust',
      'Reach the RevOps buying committee without bidding on hyper-competitive ops job titles in LinkedIn Ads',
    ],
    faq: [
      {
        q: 'What does a RevOps creator campaign cost on Naano?',
        a: 'Fixed per-post pricing from €20 (median creator ~€150/post). Q1 2026 RevOps campaigns delivered a €17 median cost per qualified click across 41 campaigns.',
      },
      {
        q: 'Is the RevOps creator pool big enough?',
        a: 'Yes for core RevOps briefs; niche sub-verticals (PLG ops, usage-based pricing) have scarcer supply and may take an extra matching pass. The 2,000+ creator network is vetted per vertical before campaigns launch.',
      },
      {
        q: 'Why not just run LinkedIn Ads against RevOps titles?',
        a: 'You can — and the two compound. But RevOps CPCs are among the most competitive on LinkedIn, while a creator post reaches the same operators through a trusted voice at a fixed, known cost per post.',
      },
    ],
  },
  devtools: {
    slug: 'devtools',
    label: 'Devtools',
    short: 'devtools',
    n: 47,
    p10: 13,
    median: 19,
    p90: 26,
    title: 'B2B Influencer Marketing for Devtools | Naano',
    description:
      'Sponsor developer creators on LinkedIn: engineering audiences, fixed per-post pricing from €20, median CPL €19 and the highest click-to-demo conversion of any vertical (Q1 2026, n=47).',
    h1: 'LinkedIn creator marketing for devtools',
    intro:
      "Developers are famously ad-resistant — and famously receptive to practitioners showing real workflows. Naano's devtools creators are engineers and DevRel voices whose audiences click deliberately: raw CTR runs slightly lower, but click-to-demo conversion is the highest of any vertical on the platform.",
    analysis:
      'Devtools trends slightly above the €18 platform mean: technical content takes longer to draft (raising creator pricing) and engineering audiences click more deliberately. The offset is downstream — conversion-to-demo on devtools clicks is the best on the platform.',
    who: 'Staff engineers, DevRel practitioners, and technical founders with 1k–10k followers posting about infrastructure, tooling, and developer workflows — audiences that are largely working engineers.',
    bullets: [
      'Launch an API, SDK, or infrastructure product through engineers who show it in a real workflow',
      'Build credibility in a category where developer audiences discount anything that reads as marketing',
      'Drive qualified sign-ups for a self-serve developer product without burning budget on broad ads',
    ],
    faq: [
      {
        q: 'Do developer audiences accept sponsored posts?',
        a: 'Yes, when the post is written by a practitioner in their own voice about a real workflow. Naano briefs are one page — context, constraints, link — and creators draft in their own words, which is why devtools CTR holds up.',
      },
      {
        q: 'What does a devtools campaign cost?',
        a: 'Fixed pricing from €20/post. Q1 2026 median CPL was €19 across 47 devtools campaigns — slightly above the platform mean, offset by the highest click-to-demo conversion of any vertical.',
      },
      {
        q: 'Can technical accuracy be enforced in the brief?',
        a: 'The brief carries your constraints and proof points, and you review the draft before it publishes. Edits stay light to keep the post native, but factual corrections are always in scope.',
      },
    ],
  },
  product: {
    slug: 'product',
    label: 'Product',
    short: 'product',
    n: 39,
    p10: 12,
    median: 18,
    p90: 25,
    title: 'B2B Influencer Marketing for Product & PM Tools | Naano',
    description:
      'Reach product managers through LinkedIn creators: PM and product-leadership voices, fixed per-post pricing from €20, median CPL €18 (Q1 2026, n=39 campaigns).',
    h1: 'LinkedIn creator marketing for product & PM tools',
    intro:
      "PMs are a generalist audience reachable through many adjacent niches — product leadership, research, analytics, design. Naano's product creators give roadmap, discovery, and analytics tools a route to PMs that doesn't depend on outbidding every other PM tool on the same ad inventory.",
    analysis:
      'Median CPL aligns with the €18 platform mean. Variance is moderate: creator supply is broad across product niches without being deep in any single one, so matching optimizes for audience overlap with your specific PM segment.',
    who: 'Product leads, PM coaches, and product-analytics practitioners with 2k–8k followers posting about discovery, prioritization, and product craft — audiences of working PMs and product leaders.',
    bullets: [
      'Launch a roadmapping, analytics, or user-research tool to an audience of practicing PMs',
      'Differentiate in a crowded PM-tool category where every competitor runs the same feature-list ads',
      'Reach product leaders who influence the stack decision without a top-down enterprise sales motion',
    ],
    faq: [
      {
        q: 'What does a product-vertical campaign cost?',
        a: 'Fixed per-post pricing from €20 (median creator ~€150/post). Q1 2026 median CPL was €18 across 39 campaigns — exactly the platform average.',
      },
      {
        q: 'How is the right PM audience matched?',
        a: "Product is a broad vertical, so matching works on audience overlap with your segment — e.g. analytics-leaning PMs vs discovery-leaning PMs — using creator audience data, not just the creator's own title.",
      },
      {
        q: 'Does creator content work for PLG products?',
        a: 'Especially well: a post showing a real workflow drives self-serve sign-ups directly, and Q1 2026 data shows creator clicks convert to product sign-up at rates comparable to warm referral traffic.',
      },
    ],
  },
  'hr-tech': {
    slug: 'hr-tech',
    label: 'HR-tech',
    short: 'hr-tech',
    n: 34,
    p10: 14,
    median: 20,
    p90: 27,
    title: 'B2B Influencer Marketing for HR-Tech | Naano',
    description:
      'Run LinkedIn creator campaigns for HR-tech: People Ops and talent-leadership creators, fixed per-post pricing from €20, median CPL €20 (Q1 2026, n=34 campaigns).',
    h1: 'LinkedIn creator marketing for HR-tech',
    intro:
      "HR buyers sit on LinkedIn all day — it is their professional network in the most literal sense. Naano's HR-tech creators are People Ops leads, talent leaders, and HR consultants whose audiences map directly onto the buying committee for HRIS, recruiting, and people-analytics tools.",
    analysis:
      'HR-tech sits above the €18 platform mean: creator supply is thinner than in sales or RevOps and the buying committee is wider, which pushes both creator pricing and click filtering up. The gap narrows as more People Ops creators onboard.',
    who: 'People Ops leads, heads of talent, and HR consultants with 2k–7k followers posting about hiring, retention, comp, and people analytics — audiences of HR decision-makers and their influencers.',
    bullets: [
      'Put an HRIS, recruiting, or engagement tool in front of People leaders through voices they follow',
      'Reach the full HR buying committee (People lead + finance + ops) via overlapping creator audiences',
      'Build category trust in a market where buyers are heavily burned by over-promising HR software',
    ],
    faq: [
      {
        q: 'What does an HR-tech creator campaign cost?',
        a: 'Fixed pricing from €20/post. Q1 2026 median CPL was €20 across 34 campaigns — slightly above the platform mean, reflecting thinner creator supply and a wider buying committee.',
      },
      {
        q: 'Is HR-tech creator supply sufficient?',
        a: 'The pool is thinner than sales or RevOps but growing; most briefs match in one pass. Naano flags upfront when a niche brief (e.g. comp-specific) needs a wider matching window.',
      },
      {
        q: 'Do HR audiences convert on creator posts?',
        a: 'Yes — HR professionals are among the most active LinkedIn audiences, and a recommendation from a People Ops voice they follow carries more weight than an ad in a category with high software fatigue.',
      },
    ],
  },
  fintech: {
    slug: 'fintech',
    label: 'Fintech',
    short: 'fintech',
    n: 29,
    p10: 13,
    median: 19,
    p90: 26,
    title: 'B2B Influencer Marketing for Fintech | Naano',
    description:
      'Sponsor finance and fintech creators on LinkedIn: CFO-audience voices, compliance-aware briefs, fixed per-post pricing from €20, median CPL €19 (Q1 2026, n=29 campaigns).',
    h1: 'LinkedIn creator marketing for B2B fintech',
    intro:
      "Finance buyers are precise, skeptical, and highly active on LinkedIn. Naano's fintech creators — finance operators, fractional CFOs, and payments practitioners — deliver some of the strongest click quality on the platform, with time-on-site among the best of any vertical.",
    analysis:
      'Fintech hovers slightly above the €18 mean: compliance constraints on creator copy lengthen review cycles and creators charge a small premium for regulated content. Click quality (time-on-site) is among the strongest on the platform.',
    who: 'Fractional CFOs, finance-ops leads, and payments practitioners with 2k–8k followers posting about cash management, spend, billing, and finance tooling — audiences of finance decision-makers.',
    bullets: [
      'Launch a spend-management, billing, or treasury product to an audience of finance operators',
      'Run compliance-reviewed creator content in a regulated category without losing the native voice',
      'Reach CFOs and finance leads who never click display ads but read practitioner content daily',
    ],
    faq: [
      {
        q: 'How does compliance review work for fintech campaigns?',
        a: 'Your brief carries the regulatory constraints, and you review each draft before it publishes. Review cycles run slightly longer than other verticals — factored into the timeline at match time.',
      },
      {
        q: 'What does a fintech creator campaign cost?',
        a: 'Fixed pricing from €20/post, with a small creator premium for regulated content. Q1 2026 median CPL was €19 across 29 campaigns, with top-tier time-on-site on the resulting clicks.',
      },
      {
        q: 'Which fintech products fit creator-led growth best?',
        a: 'B2B products bought by finance operators — spend management, billing, treasury, FP&A tooling. Consumer fintech audiences live on other channels; LinkedIn creator campaigns are built for the B2B side.',
      },
    ],
  },
  'marketing-ops': {
    slug: 'marketing-ops',
    label: 'Marketing-ops',
    short: 'marketing-ops',
    n: 36,
    p10: 10,
    median: 16,
    p90: 22,
    title: 'B2B Influencer Marketing for Martech & Marketing-Ops | Naano',
    description:
      'The cheapest vertical on Naano: martech and demand-gen creators, fixed per-post pricing from €20, median CPL €16 (Q1 2026, n=36 campaigns).',
    h1: 'LinkedIn creator marketing for martech & marketing-ops',
    intro:
      'Marketers are the easiest audience to reach with creator content — they are the audience that invented the playbook. Martech analysts, demand-gen leads, and lifecycle marketers on Naano deliver the cheapest qualified clicks on the platform, with a self-selecting practitioner audience.',
    analysis:
      "Marketing-ops is the cheapest vertical on Naano in Q1 2026: dense creator supply (martech analysts, demand-gen leads, lifecycle marketers) and a self-selecting practitioner audience push both CTR and CPL into the platform's best territory.",
    who: 'Demand-gen leads, martech analysts, and lifecycle marketers with 2k–10k followers posting about attribution, automation, and channel strategy — audiences of practicing marketers who evaluate tools constantly.',
    bullets: [
      'Launch an attribution, automation, or content tool to marketers who try new tools weekly',
      'Get cited in the martech-stack conversations where practitioners actually decide what to adopt',
      "Exploit the platform's cheapest CPL vertical for high-volume top-of-funnel testing",
    ],
    faq: [
      {
        q: 'Why is marketing-ops the cheapest vertical?',
        a: "Dense creator supply meets a self-selecting audience: marketers follow marketing creators to find tools. Q1 2026 median CPL was €16 across 36 campaigns, with a p10 of €10 — the platform's best.",
      },
      {
        q: "Isn't marketing to marketers saturated?",
        a: "Ad inventory is saturated; practitioner trust isn't. A martech recommendation from an operator who shows their stack converts precisely because marketers ignore the ads.",
      },
      {
        q: 'What does a martech campaign cost?',
        a: 'Fixed per-post pricing from €20 (median creator ~€150/post), no platform subscription on Self-Serve. At a €16 median CPL, a €1,000 test budget delivered ~60 qualified clicks in Q1 2026.',
      },
    ],
  },
  'vertical-saas': {
    slug: 'vertical-saas',
    label: 'Vertical SaaS',
    short: 'vertical saas',
    n: 28,
    p10: 14,
    median: 21,
    p90: 28,
    title: 'B2B Influencer Marketing for Vertical SaaS | Naano',
    description:
      'Creator campaigns for niche-industry SaaS (legal-tech, construction-tech, insurance-tech): rare niche voices, fixed per-post pricing from €20, median CPL €21 (Q1 2026, n=28).',
    h1: 'LinkedIn creator marketing for vertical SaaS',
    intro:
      'Legal-tech, construction-tech, insurance-tech, logistics — niche-industry SaaS has the hardest distribution problem in B2B: the audience is small, specialized, and invisible to broad targeting. The few LinkedIn creators who speak natively to a niche industry are disproportionately valuable, and finding them is exactly what a vetted marketplace is for.',
    analysis:
      "Vertical SaaS is the most expensive cluster on the platform (~15% above the mean): creator supply is sparse by definition, so creator pricing rises. The offset is audience fit — a niche-industry creator's audience is almost entirely your ICP.",
    who: 'Industry practitioners who publish: a construction PM posting about site software, a paralegal covering legal-tech, an insurance broker reviewing tooling — small followings (1k–5k) with near-total ICP overlap.',
    bullets: [
      "Reach a niche industry audience that LinkedIn Ads targeting can't isolate without massive waste",
      'Borrow credibility in a conservative industry where buyers only trust voices from inside the industry',
      'Test messaging with a small, perfectly-matched audience before scaling spend on broader channels',
    ],
    faq: [
      {
        q: 'Are there creators for my specific niche industry?',
        a: 'Supply is checked before you commit: Naano verifies matching creators for your niche at brief time and tells you upfront if the pool is thin. Vertical SaaS briefs sometimes take a wider matching window than horizontal categories.',
      },
      {
        q: 'Why is vertical SaaS CPL higher?',
        a: 'Scarce creator supply raises per-post pricing — Q1 2026 median CPL was €21 across 28 campaigns, ~15% above the platform mean. The compensation is audience fit: near-total ICP overlap versus single-digit relevance on broad channels.',
      },
      {
        q: 'Is a small niche audience worth a campaign?',
        a: 'In vertical SaaS, yes: a creator with 2,000 followers who are all in your industry out-delivers a 100k generalist. The qualified-click math favors precision over reach — the same logic covered in our nano vs macro creators data.',
      },
    ],
  },
}

export function isSectorSlug(slug: string | undefined): slug is SectorSlug {
  return !!slug && Object.prototype.hasOwnProperty.call(sectors, slug)
}

export function getSector(slug: string | undefined): Sector | undefined {
  return isSectorSlug(slug) ? sectors[slug] : undefined
}
