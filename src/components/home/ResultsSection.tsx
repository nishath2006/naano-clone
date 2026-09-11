import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRight } from '@/components/lp/icons'
import { PostResultCard } from '@/components/lp/PostResultCard'
import { RESULT_POSTS } from '@/data/home'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    eyebrow: 'THE RESULTS',
    titleA: 'Proven across',
    titleB: 'thousands of campaigns.',
    stats: [
      ['5M+', 'Impressions generated'],
      ['30K+', 'Leads generated'],
      ['2,000+', 'Creators on Naano'],
      ['5K+', 'Posts published'],
    ],
    cta: 'Get started',
    note: "Start free. Pay per post when you're ready.",
  },
  fr: {
    eyebrow: 'LES RÉSULTATS',
    titleA: 'Prouvé sur',
    titleB: 'des milliers de campagnes.',
    stats: [
      ['5M+', 'Impressions générées'],
      ['30K+', 'Leads générés'],
      ['2,000+', 'Créateurs sur Naano'],
      ['5K+', 'Posts publiés'],
    ],
    cta: 'Commencer',
    note: 'Gratuit pour démarrer. Payez au post quand vous êtes prêt.',
  },
}

export function ResultsSection() {
  const t = useT()
  const c = t(copy)
  return (
    <div
      className="lp-system-section lp-system-results"
      data-screen-label="The results"
      style={{
        padding: '112px 84px 128px 84px',
        background: 'linear-gradient(180deg, rgba(243,248,255,.72) 0%, #FCFCFB 48%, rgba(243,248,255,.52) 100%)',
      }}
    >
      <div className="rv rv-d0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#315B7C' }} />
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.22em', color: '#315B7C' }}>{c.eyebrow}</span>
      </div>
      <h2
        className="rv rv-d1"
        style={{
          margin: '24px auto 0 auto',
          maxWidth: 820,
          textAlign: 'center',
          fontSize: 52,
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1.08,
          color: '#17181C',
        }}
      >
        {c.titleA} <span style={{ fontWeight: 600 }}>{c.titleB}</span>
      </h2>

      <div className="lp-results-proof rv rv-d2">
        <img src="/lp/results-metrics-clouds-v2.png" alt="" className="lp-results-proof__clouds" loading="lazy" />
        <div className="lp-results-proof__stats" data-results-stats>
          {c.stats.map(([value, label], i) => (
            <div key={label} className="stat-pop">
              <div data-cu={i === 0 ? undefined : ''}>{value}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lp-result-grid rv rv-d3" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginTop: 64 }}>
        {RESULT_POSTS.map((p) => (
          <PostResultCard key={p.name} post={p} />
        ))}
      </div>

      <div className="rv rv-d4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 44 }}>
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
