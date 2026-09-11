import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRight } from '@/components/lp/icons'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    eyebrow: 'READY TO LAUNCH?',
    title: 'Your next creator campaign starts here.',
    sub: 'Get a clear creator strategy, campaign format and estimated budget for your next launch.',
    cardEyebrow: 'CAMPAIGN STRATEGY CALL',
    cardTitle: '30-minute working session',
    cardBody: 'Leave with a concrete plan for your next creator campaign.',
    bullets: ['Creator strategy', 'Campaign format', 'Budget recommendation'],
    cta: 'Book a campaign call',
    pick: 'Pick a time on the next page.',
    prefer: 'Prefer to start yourself?',
    start: 'Start for free →',
    trusted: 'Trusted by B2B teams building creator-led acquisition.',
  },
  fr: {
    eyebrow: 'PRÊT À LANCER ?',
    title: 'Votre prochaine campagne avec des créateurs commence ici.',
    sub: 'Obtenez une stratégie créateurs claire, un format de campagne et un budget estimé pour votre prochain lancement.',
    cardEyebrow: 'APPEL STRATÉGIE CAMPAGNE',
    cardTitle: 'Session de travail de 30 minutes',
    cardBody: 'Repartez avec un plan concret pour votre prochaine campagne créateurs.',
    bullets: ['Stratégie créateurs', 'Format de campagne', 'Recommandation de budget'],
    cta: 'Réserver un appel de cadrage',
    pick: 'Choisissez un créneau sur la page suivante.',
    prefer: 'Vous préférez commencer seul ?',
    start: 'Commencer gratuitement →',
    trusted: 'La confiance des équipes B2B qui construisent une acquisition creator-led.',
  },
}

export function BookSection() {
  const t = useT()
  const c = t(copy)
  return (
    <div id="book-a-call" className="lp-system-section lp-system-book" data-screen-label="Book a call" style={{ padding: '112px 84px 130px 84px' }}>
      <div className="rv rv-d0" style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: '#315B7C' }}>{c.eyebrow}</div>
        <h2 style={{ margin: '20px 0 0 0', fontSize: 64, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.02, color: 'var(--nn-ink, #111318)' }}>{c.title}</h2>
        <p style={{ margin: '26px auto 0 auto', maxWidth: 600, fontSize: 19, lineHeight: 1.55, color: '#55575E' }}>{c.sub}</p>
      </div>
      <div className="rv rv-d1" style={{ maxWidth: 560, margin: '56px auto 0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            className="lp-book-card rv rv-d0"
            style={{
              width: '100%',
              maxWidth: 520,
              padding: '48px 48px 44px',
              background: 'var(--nn-glass-strong, rgba(255,255,255,.88))',
              border: '1px solid var(--nn-glass-border, rgba(255,255,255,.92))',
              borderRadius: 28,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 32px 88px -54px rgba(56,96,128,.46)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/lp/photo-book-call.png" alt="" loading="lazy" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#315B7C' }}>{c.cardEyebrow}</div>
            </div>
            <h3 style={{ margin: '20px 0 0 0', fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, color: '#17181C' }}>{c.cardTitle}</h3>
            <p style={{ margin: '14px 0 0 0', fontSize: 15.5, lineHeight: 1.55, color: '#55575E' }}>{c.cardBody}</p>
            <div style={{ marginTop: 30 }}>
              {c.bullets.map((b) => (
                <div
                  key={b}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '15px 0',
                    borderTop: '1px solid rgba(203,224,238,.72)',
                    fontSize: 15.5,
                    color: '#26272C',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#315B7C', flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
            <NavAnchor
              href="/book"
              style={{
                marginTop: 32,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                textDecoration: 'none',
                background: '#17181C',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                borderRadius: 12,
                padding: '16px 28px',
              }}
            >
              {c.cta}
              <ArrowRight size={15} />
            </NavAnchor>
            <div style={{ marginTop: 14, textAlign: 'center', fontSize: 13.5, color: '#9B9DA3' }}>{c.pick}</div>
            <NavAnchor
              href="/register"
              style={{ marginTop: 20, textAlign: 'center', textDecoration: 'none', fontSize: 14.5, color: '#55575E', letterSpacing: '-0.005em' }}
            >
              <span data-prefer-start>
                {c.prefer} <span style={{ color: 'var(--nn-ink, #111318)', fontWeight: 600 }}>{c.start}</span>
              </span>
            </NavAnchor>
          </div>
        </div>
      </div>
      <div className="rv rv-d2" style={{ marginTop: 40, textAlign: 'center', fontSize: 14, color: '#9B9DA3', letterSpacing: '-0.005em' }}>
        {c.trusted}
      </div>
    </div>
  )
}
