import type { TocItem } from '@/components/site/TableOfContents'
import type { SectorSlug } from './sectors'

/** Tabular data of the Q2 2026 benchmark report. Prose lives in the page. */

export const benchmarksMeta = {
  title: 'B2B Creator-Led Growth Benchmarks Q2 2026 | NaanoX',
  description:
    'First-party CPL, CTR, and conversion benchmarks from 312 B2B creator-led campaigns on NaanoX in Q1 2026. Per-vertical and per-tier breakdowns, methodology, and sample sizes.',
  kicker: 'Q2 2026 Benchmark Report',
  readTime: '14 min read',
  h1: 'B2B Creator-Led Growth Benchmarks: Q2 2026',
  lede: 'First-party CPL, CTR, and conversion data from ~300 vetted B2B nano-creators on NaanoX. Methodology, sample sizes, and per-vertical breakdowns.',
  published: 'Published April 27, 2026 · Authored by the NaanoX team · Sample: 312 campaigns, 1,847 sponsored posts, Q1 2026',
}

export const benchmarksToc: TocItem[] = [
  { id: 'executive-summary', text: 'Executive summary' },
  { id: 'methodology', text: 'Methodology' },
  { id: 'headline-benchmarks', text: 'Headline benchmarks' },
  { id: 'cpl-by-vertical', text: 'CPL by vertical' },
  { id: 'ctr-by-creator-tier', text: 'CTR by creator tier' },
  { id: 'time-to-launch', text: 'Time-to-launch distribution' },
  { id: 'conversion-benchmarks', text: 'Conversion benchmarks' },
  { id: 'channel-mix', text: 'Channel mix observations' },
  { id: 'limitations', text: 'Limitations and caveats' },
  { id: 'how-to-cite', text: 'How to cite' },
  { id: 'next-steps', text: 'Next steps' },
]

export const headlineHead = ['Metric', 'NaanoX (Q1 2026)', 'LinkedIn Ads benchmark', 'Delta']
export const headlineRows: string[][] = [
  ['Average CPL (cost per qualified click)', '€18.10', '€55–€90 (LinkedIn Ads, B2B SaaS)', '−67% to −80%'],
  ['Average CTR (sponsored content)', '12.0%', '0.8% (LinkedIn B2B Marketing Benchmark 2025)', '+15× absolute'],
  ['Average CPC (per qualified click)', '€2.30', '€8–€15 (LinkedIn Ads CPC range)', '−71% to −85%'],
  ['Time-to-launch (brief → first post)', '7 days (median)', '21–35 days (typical agency)', '−67% to −80%'],
  ['Reply rate, warm outbound to post engagers', '39.6%', '~5% (cold outbound industry avg)', '+8× absolute'],
]

export const cplHead = ['Vertical', 'CPL p10', 'CPL median', 'CPL p90', 'n campaigns']

export const verticalNotes: { slug: SectorSlug; text: string }[] = [
  {
    slug: 'sales-tech',
    text: "Sales-tech is NaanoX's deepest creator pool, with dense overlap between AE, sales-leader, and SDR audiences. High creator supply and a well-defined buyer persona compress CPL well below the platform mean. CTR remains strong because creators speak directly to readers' day-to-day pipeline pain.",
  },
  {
    slug: 'revops',
    text: 'RevOps audiences are smaller but extremely high-intent. Creators with 2k–6k followers reliably outperform paid retargeting on click quality. Median CPL sits just below platform average; the long tail (€24) reflects scarcer creators in vertical-specific RevOps niches like usage-based pricing or PLG ops.',
  },
  {
    slug: 'devtools',
    text: 'Devtools campaigns trend slightly above the platform mean because of two effects: technical content takes longer to draft (raising creator pricing) and engineering audiences click more deliberately (lower raw CTR offsetting strong qualification). Conversion-to-demo on devtools clicks is the highest of any vertical.',
  },
  {
    slug: 'product',
    text: 'PMs are a generalist audience reachable through many adjacent niches (research, analytics, design). Median CPL aligns with the platform mean. Variance is moderate because creator supply is broad without being deep in any single sub-vertical.',
  },
  {
    slug: 'hr-tech',
    text: 'HR-tech sits above the platform mean. Creator supply is thinner than in sales/RevOps and the buying committee is wider, which pushes both creator pricing and click filtering up. We expect this gap to narrow in H2 2026 as we onboard more People Ops creators.',
  },
  {
    slug: 'fintech',
    text: 'Fintech CPL hovers slightly above the mean. Compliance constraints on creator copy lengthen review cycles, and creators charge a small premium for regulated content. Click quality (time-on-site) is among the strongest on platform.',
  },
  {
    slug: 'marketing-ops',
    text: 'Marketing-ops is the cheapest vertical on NaanoX in Q1 2026. Dense creator supply (martech analysts, demand-gen leads, lifecycle marketers) and a self-selecting practitioner audience drive both CTR and CPL into favorable territory.',
  },
  {
    slug: 'vertical-saas',
    text: 'Vertical SaaS (legal-tech, construction-tech, insurance-tech, etc.) is the most expensive cluster. Creator supply is sparse by definition, very few LinkedIn micro-creators speak natively to a niche industry, so creator pricing rises and average CPL trends ~15% above the platform mean.',
  },
]

export const ctrHead = ['Creator tier', 'CTR median', 'CTR p25', 'CTR p75', 'n posts']
export const ctrRows: string[][] = [
  ['1k–3k followers', '13.8%', '10.2%', '17.4%', 'n=612'],
  ['3k–7k followers', '12.1%', '9.0%', '15.6%', 'n=743'],
  ['7k–10k followers', '10.4%', '7.6%', '13.2%', 'n=318'],
  ['10k+ followers', '8.7%', '6.1%', '11.3%', 'n=174'],
]

export const launchHead = ['Percentile', 'Days from brief to first post', 'Distribution']
export const launchRows: { label: string; days: string; width: string }[] = [
  { label: 'p10 (fastest)', days: '3 days', width: '18%' },
  { label: 'p25', days: '5 days', width: '30%' },
  { label: 'Median (p50)', days: '7 days', width: '42%' },
  { label: 'p75', days: '10 days', width: '60%' },
  { label: 'p90 (slowest)', days: '16 days', width: '96%' },
]

export const funnelHead = ['Funnel stage', 'Conversion rate', 'Sample']
export const funnelRows: string[][] = [
  ['Click → ≥30s on-site engagement', '67.0%', 'n=82,440 clicks'],
  ['≥30s engagement → demo-form submission', '8.3%', 'n=55,235 engaged sessions'],
  ['Demo-form → SQL (sales-qualified lead)', '41.0%', 'n=4,584 demo submissions'],
  ['Implied qualified click → SQL', '≈3.4%', 'Composite'],
]

export const limitations: { strong: string; text: string }[] = [
  {
    strong: 'Selection bias.',
    text: ' Brands that choose to run on NaanoX are pre-disposed to creator-led growth. They have already decided that a performance-priced micro-creator marketplace fits their GTM thesis. Outcomes for brands that have not yet self-selected into the channel are likely to be more dispersed than the numbers reported here.',
  },
  {
    strong: 'One quarter is short.',
    text: ' This is the inaugural edition of the report. We expect medians to firm up and confidence intervals to narrow as we publish additional quarters. Particular care should be taken in the smaller-n verticals (vertical SaaS, fintech, HR-tech) where per-vertical sample sizes are below 35 campaigns.',
  },
  {
    strong: 'Vertical-by-vertical n is uneven.',
    text: ' Sales-tech and devtools account for a disproportionate share of campaign volume. Cross-vertical comparisons should be read as directional rather than statistically equivalent.',
  },
  {
    strong: 'Funnel data is opt-in.',
    text: ' Demo-to-SQL conversion rates are computed on the n=104 campaigns where brands granted NaanoX access to downstream CRM events. This sub-sample skews toward more measurement-mature brands and may overstate funnel quality for the broader population.',
  },
  {
    strong: 'Public benchmarks evolve.',
    text: ' The LinkedIn Ads CPC and CTR figures we compare against are themselves moving targets. Where we cite external numbers, we link to the most recent publicly available source rather than to a snapshot.',
  },
]
