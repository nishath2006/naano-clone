import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRight } from '@/components/lp/icons'
import { PostResultCard } from '@/components/lp/PostResultCard'
import { RESULT_POSTS } from '@/data/home'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    eyebrow: 'THE RESULTS',
    stats: [
      ['2,000+', 'Creators earning'],
      ['€500', 'Avg. per deal'],
      ['5K+', 'Posts published'],
      ['24h', 'Avg. payout time'],
    ],
    title: 'Real posts from real creators',
    industries: ['B2B SaaS', 'Fintech', 'DevTools', 'E-commerce'],
    cta: 'Start earning',
    note: 'Free to join. Paid within 24h. Quit anytime.',
  },
  fr: {
    eyebrow: 'LES RÉSULTATS',
    stats: [
      ['2,000+', 'Créateurs rémunérés'],
      ['€500', 'Moy. par collaboration'],
      ['5K+', 'Posts publiés'],
      ['24h', 'Délai de paiement moy.'],
    ],
    title: 'De vrais posts, par de vrais créateurs',
    industries: ['B2B SaaS', 'Fintech', 'DevTools', 'E-commerce'],
    cta: 'Commencer à gagner',
    note: 'Inscription gratuite. Paiement sous 24 h. Arrêtez quand vous voulez.',
  },
}

const ICON_PROPS = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#55575E', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const INDUSTRY_ICONS = [
  <svg key="saas" {...ICON_PROPS} aria-hidden="true">
    <path d="M12 3 L21 7.5 L12 12 L3 7.5 Z" />
    <path d="M3 12 L12 16.5 L21 12" />
    <path d="M3 16.5 L12 21 L21 16.5" />
  </svg>,
  <svg key="fintech" {...ICON_PROPS} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>,
  <svg key="dev" {...ICON_PROPS} aria-hidden="true">
    <polyline points="7 8 3 12 7 16" />
    <polyline points="14 8 18 12 14 16" />
  </svg>,
  <svg key="ecom" {...ICON_PROPS} aria-hidden="true">
    <path d="M6 2 L3 6 V20 a2 2 0 0 0 2 2 H19 a2 2 0 0 0 2 -2 V6 L18 2 Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10 a4 4 0 0 1 -8 0" />
  </svg>,
]

export function CreatorResultsSection() {
  const t = useT()
  const c = t(copy)
  return (
    <div id="results" data-screen-label="The results" style={{ padding: '80px 84px 120px 84px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#16A34A' }} />
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.22em', color: '#16A34A' }}>{c.eyebrow}</span>
      </div>
      <div className="lp-results-proof">
        <img src="/lp/results-metrics-clouds-v2.png" alt="" className="lp-results-proof__clouds" loading="lazy" />
        <div className="lp-results-proof__stats" data-results-stats>
          {c.stats.map(([value, label]) => (
            <div key={label} className="stat-pop">
              <div data-cu="">{value}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <h2
        style={{ margin: '112px auto 0 auto', maxWidth: 820, textAlign: 'center', fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08, color: '#17181C' }}
      >
        {c.title}
        <span style={{ color: 'var(--accent)' }}>.</span>
      </h2>
      <div className="lp-result-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginTop: 64 }}>
        {RESULT_POSTS.map((p) => (
          <PostResultCard key={p.name} post={p} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14, marginTop: 48 }}>
        {c.industries.map((label, i) => (
          <span
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              background: 'var(--nn-glass-strong, rgba(255,255,255,.88))',
              border: '1px solid var(--nn-glass-border, rgba(255,255,255,.92))',
              borderRadius: 999,
              padding: '11px 20px',
              fontSize: 16,
              fontWeight: 600,
              color: '#26272C',
              boxShadow: '0 10px 30px -22px rgba(56,96,128,.34)',
            }}
          >
            {INDUSTRY_ICONS[i]}
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 44 }}>
        <NavAnchor
          href="/register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            background: '#17181C',
            color: '#FFFFFF',
            textDecoration: 'none',
            borderRadius: 12,
            padding: '16px 28px',
            fontSize: 16,
            fontWeight: 600,
            boxShadow: '0 12px 30px rgba(23,24,28,0.18)',
          }}
        >
          {c.cta}
          <ArrowRight size={18} />
        </NavAnchor>
        <span style={{ marginTop: 16, fontSize: 15, color: '#9B9DA3' }}>{c.note}</span>
      </div>
    </div>
  )
}
