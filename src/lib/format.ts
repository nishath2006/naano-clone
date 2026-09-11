/** Shared formatting helpers + option lists for the app (company/creator dashboards). */

export function formatMoney(cents: number | null | undefined, currency = 'EUR'): string {
  const value = (cents ?? 0) / 100
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency, maximumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value)
}

/** 14100 → "14.1K", 2500000 → "2.5M" (matches the marketplace card style). */
export function formatCompact(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${trim(n / 1_000_000)}M`
  if (n >= 1_000) return `${trim(n / 1_000)}K`
  return String(n)
}
function trim(v: number) {
  return v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, '')
}

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', opts).format(new Date(iso))
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(iso, { day: 'numeric', month: 'short' })
}

export function initials(name: string | null | undefined): string {
  return (name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

export function parseEuros(input: string): number | null {
  const n = Number(String(input).replace(/[^\d.,]/g, '').replace(',', '.'))
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}

/** Niche taxonomy observed on the public creator directory (most common first). */
export const NICHES = [
  'AI', 'Marketing', 'SaaS', 'Software', 'Growth / GTM', 'Sales', 'Productivity', 'Creative', 'B2B', 'Media / Content',
  'Fintech', 'HR', 'SEO', 'Data / Analytics', 'Developer Tools', 'Outreach', 'EdTech', 'Agencies / Consulting', 'HealthTech',
  'Cybersecurity', 'CRM', 'Real Estate / PropTech', 'E-commerce', 'Recruiting / Talent', 'Web3 / Crypto', 'Manufacturing',
  'Design', 'Customer Support', 'Logistics / Supply Chain', 'Hospitality / Travel', 'LegalTech', 'Retail', 'Energy / CleanTech',
] as const

/** Company sectors — same slugs as the public `/for/:sector` pages. */
export const INDUSTRIES: { value: string; label: string }[] = [
  { value: 'sales-tech', label: 'Sales-tech' },
  { value: 'revops', label: 'RevOps' },
  { value: 'devtools', label: 'DevTools' },
  { value: 'product', label: 'Product' },
  { value: 'hr-tech', label: 'HR-tech' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'marketing-ops', label: 'Marketing-ops' },
  { value: 'vertical-saas', label: 'Vertical SaaS' },
  { value: 'other', label: 'Other' },
]

export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']

export const OBJECTIVES: { value: string; label: string }[] = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'leads', label: 'Leads' },
  { value: 'signups', label: 'Sign-ups' },
  { value: 'pipeline', label: 'Pipeline' },
]

export const LANGUAGES = ['English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese', 'Dutch', 'Hindi', 'Arabic', 'Other']

export const COUNTRIES: { code: string; name: string }[] = [
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' }, { code: 'FR', name: 'France' }, { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' }, { code: 'ES', name: 'Spain' }, { code: 'IT', name: 'Italy' }, { code: 'NL', name: 'Netherlands' },
  { code: 'CA', name: 'Canada' }, { code: 'IE', name: 'Ireland' }, { code: 'PT', name: 'Portugal' }, { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' }, { code: 'SE', name: 'Sweden' }, { code: 'PL', name: 'Poland' }, { code: 'AE', name: 'United Arab Emirates' },
  { code: 'PK', name: 'Pakistan' }, { code: 'NG', name: 'Nigeria' }, { code: 'BD', name: 'Bangladesh' }, { code: 'UA', name: 'Ukraine' },
  { code: 'IL', name: 'Israel' }, { code: 'KE', name: 'Kenya' }, { code: 'CZ', name: 'Czechia' }, { code: 'MA', name: 'Morocco' },
  { code: 'RO', name: 'Romania' }, { code: 'AU', name: 'Australia' }, { code: 'BR', name: 'Brazil' }, { code: 'MX', name: 'Mexico' },
  { code: 'SG', name: 'Singapore' }, { code: 'ZA', name: 'South Africa' }, { code: 'OTHER', name: 'Other' },
]

export function countryName(code: string | null | undefined): string {
  if (!code) return '—'
  return COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export const CAMPAIGN_STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  published: 'Open',
  closed: 'Closed',
  completed: 'Completed',
}

export const COLLAB_STATUS_LABEL: Record<string, string> = {
  invited: 'Invitation sent',
  accepted: 'Accepted',
  declined: 'Declined',
  draft_ready: 'Draft ready',
  scheduled: 'Scheduled',
  live: 'Live',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Not selected',
  withdrawn: 'Withdrawn',
}

export function statusTone(status: string): 'green' | 'blue' | 'amber' | 'gray' | 'red' {
  switch (status) {
    case 'published':
    case 'live':
    case 'accepted':
    case 'paid':
      return 'green'
    case 'scheduled':
    case 'draft_ready':
    case 'invited':
      return 'blue'
    case 'pending':
      return 'amber'
    case 'rejected':
    case 'declined':
    case 'cancelled':
    case 'failed':
      return 'red'
    default:
      return 'gray'
  }
}
