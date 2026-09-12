import { Check } from '@/components/lp/icons'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    eyebrow: 'One platform, from brief to results',
    title: 'Run creator campaigns from one place',
    body: 'Find the right voices, launch faster, and connect every post to measurable business results.',
    fit: 'Fit',
    cards: ['Find creators your buyers trust', 'Build a campaign brief in minutes', 'Manage every collaboration', 'Track reach, clicks, and leads', 'Pay creators without the admin'],
    brief: { title: 'Campaign brief', tag: 'AI', items: ['Objectives and key messages', 'Creator guidelines', 'Tracking links ready'] },
    collab: [
      ['Raphael', 'Draft ready'],
      ['Thomas', 'Scheduled'],
      ['Nada', 'Live'],
    ],
    pipeline: { label: 'Attributed pipeline', value: '€48.2K', delta: '+24%', views: '124K views', leads: '418 leads' },
    pay: { title: 'Payment scheduled', sub: 'Handled by NaanoX', payout: 'Creator payout', amount: '€1,240', chips: ['Contract', 'Invoice', 'Payout'] },
  },
  fr: {
    eyebrow: 'Une plateforme, de brief aux résultats',
    title: 'Pilotez vos campagnes de créateurs au même endroit',
    body: 'Trouvez les bonnes voix, lancez vos campagnes plus vite et reliez chaque post à des résultats business mesurables.',
    fit: 'Affinité',
    cards: [
      'Trouvez les créateurs en qui vos acheteurs ont confiance',
      'Créez un brief de campagne en quelques minutes',
      'Gérez chaque collaboration',
      'Suivez la portée, les clics et les leads',
      'Payez les créateurs sans gestion administrative',
    ],
    brief: { title: 'Brief de campagne', tag: 'IA', items: ['Objectifs et messages clés', 'Consignes pour les créateurs', 'Liens de tracking prêts'] },
    collab: [
      ['Raphael', 'Brouillon prêt'],
      ['Thomas', 'Planifié'],
      ['Nada', 'En ligne'],
    ],
    pipeline: { label: 'Pipeline attribué', value: '€48.2K', delta: '+24%', views: '124K vues', leads: '418 leads' },
    pay: { title: 'Paiement programmé', sub: 'Géré par NaanoX', payout: 'Paiement du créateur', amount: '€1,240', chips: ['Contrat', 'Facture', 'Paiement'] },
  },
}

const CARD_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,.9)',
  border: '1px solid rgba(172,203,219,.42)',
  borderRadius: 24,
  padding: '18px 18px 22px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 22px 58px -44px rgba(56, 96, 128, .38)',
  backdropFilter: 'blur(14px)',
}
const PREVIEW_STYLE: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(145deg, rgba(243,248,255,.9), rgba(255,255,255,.82))',
  border: '1px solid rgba(204, 225, 239, .68)',
  borderRadius: 20,
  padding: '18px 16px',
  minHeight: 158,
  overflow: 'hidden',
}
const INNER_CARD: React.CSSProperties = {
  width: '100%',
  maxWidth: 272,
  background: 'rgba(255,255,255,.9)',
  border: '1px solid rgba(203, 224, 238, .72)',
  borderRadius: 16,
  boxShadow: '0 20px 48px -32px rgba(56, 96, 128, .4)',
  padding: 16,
}
const H3: React.CSSProperties = {
  margin: '18px 4px 0',
  fontSize: 17,
  lineHeight: 1.3,
  fontWeight: 650,
  letterSpacing: '-0.02em',
  color: 'var(--nn-ink, #111318)',
  textAlign: 'left',
}
const BADGE: React.CSSProperties = {
  fontSize: 9.5,
  fontWeight: 700,
  color: '#315B7C',
  background: 'rgba(220,239,250,.72)',
  padding: '4px 7px',
  borderRadius: 6,
}

export function JourneySection() {
  const t = useT()
  const c = t(copy)
  const delays = ['rv-d2', 'rv-d3', 'rv-d4', 'rv-d5', 'rv-d5']
  return (
    <section id="how-it-works" className="lp-system-section lp-system-platform lp-journey" data-screen-label="Brand platform">
      <div className="lp-journey__inner">
        <header className="lp-journey__header">
          <div className="lp-journey__eyebrow rv rv-d0">
            <span />
            {c.eyebrow}
          </div>
          <h2 className="rv rv-d1" style={{ margin: 0, fontSize: 50, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.04, color: 'var(--nn-ink, #111318)' }}>
            {c.title}
            <span>.</span>
          </h2>
          <p className="rv rv-d2" style={{ margin: '20px 0 0', fontSize: 19, lineHeight: 1.5, color: '#55575E', maxWidth: 400 }}>
            {c.body}
          </p>
        </header>

        <div className="lp-journey__path">
          <img src="/lp/journey-cloud-current-v1.png" alt="" className="lp-journey__current rv rv-d0" loading="lazy" />
          <svg className="lp-journey__route rv rv-d1" viewBox="0 0 1280 360" fill="none" aria-hidden="true">
            <path d="M34 186 C172 132 280 230 410 182 S646 142 770 188 S1026 226 1246 174" />
          </svg>

          {/* 01 — creators */}
          <article className={`lp-brand-card lp-journey-card rv ${delays[0]}`} style={CARD_STYLE}>
            <span className="lp-journey-card__step">01</span>
            <div data-brand-preview style={PREVIEW_STYLE}>
              <div style={{ display: 'flex', gap: 6, width: '100%', justifyContent: 'center' }}>
                {[
                  ['/lp/avatar-b.png', 'Eric', '92%'],
                  ['/lp/avatar-e.png', 'Robin', '88%'],
                  ['/lp/avatar-f.png', 'Aya', '84%'],
                ].map(([src, name, fit]) => (
                  <div key={name} style={{ flex: '1 1 0', minWidth: 0, background: '#FFFFFF', border: '1px solid #EDEBE7', borderRadius: 12, padding: 6 }}>
                    <img src={src} alt="" loading="lazy" style={{ width: '100%', height: 54, borderRadius: 8, objectFit: 'cover', objectPosition: 'center 20%' }} />
                    <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: 'var(--nn-ink, #111318)' }}>{name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 9, color: '#8390A2' }}>
                      <span>{c.fit}</span>
                      <strong style={{ color: '#315B7C' }}>{fit}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <h3 style={H3}>{c.cards[0]}</h3>
          </article>

          {/* 02 — brief */}
          <article className={`lp-brand-card lp-journey-card rv ${delays[1]}`} style={CARD_STYLE}>
            <span className="lp-journey-card__step">02</span>
            <div data-brand-preview style={PREVIEW_STYLE}>
              <div style={INNER_CARD}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#17181C' }}>{c.brief.title}</span>
                  <span style={{ padding: '4px 8px', borderRadius: 999, background: 'rgba(220,239,250,.86)', color: '#315B7C', fontSize: 9.5, fontWeight: 700 }}>{c.brief.tag}</span>
                </div>
                <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                  {c.brief.items.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#55575E' }}>
                      <span
                        style={{
                          width: 17,
                          height: 17,
                          borderRadius: '50%',
                          background: 'rgba(220,239,250,.86)',
                          color: '#315B7C',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 17, height: 8, borderRadius: 999, background: '#E8EFF5', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: '#315B7C' }} />
                </div>
              </div>
            </div>
            <h3 style={H3}>{c.cards[1]}</h3>
          </article>

          {/* 03 — collaborations */}
          <article className={`lp-brand-card lp-journey-card rv ${delays[2]}`} style={CARD_STYLE}>
            <span className="lp-journey-card__step">03</span>
            <div data-brand-preview style={PREVIEW_STYLE}>
              <div style={INNER_CARD}>
                {c.collab.map(([name, status], i) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: i === 0 ? '0 0 11px' : '11px 0',
                      borderTop: i === 0 ? 'none' : '1px solid #F0EEEA',
                    }}
                  >
                    <img
                      src={['/lp/avatar-d.png', '/lp/avatar-c.png', '/lp/avatar-a.png'][i]}
                      alt=""
                      loading="lazy"
                      style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: '#17181C' }}>{name}</span>
                    <span style={BADGE}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <h3 style={H3}>{c.cards[2]}</h3>
          </article>

          {/* 04 — pipeline */}
          <article className={`lp-brand-card lp-journey-card rv ${delays[3]}`} style={CARD_STYLE}>
            <span className="lp-journey-card__step">04</span>
            <div data-brand-preview style={PREVIEW_STYLE}>
              <div style={INNER_CARD}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: '#9B9DA3' }}>{c.pipeline.label}</div>
                    <div style={{ marginTop: 4, fontSize: 30, fontWeight: 800, letterSpacing: '-0.035em', color: '#17181C' }}>{c.pipeline.value}</div>
                  </div>
                  <span style={{ ...BADGE, fontSize: 10, padding: '5px 7px' }}>{c.pipeline.delta}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64, marginTop: 18 }}>
                  {[32, 48, 39, 62, 54, 78, 92].map((h, i) => (
                    <span
                      key={i}
                      data-brand-bar
                      style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', background: i >= 5 ? '#315B7C' : '#DCEFFA' }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 12,
                    paddingTop: 11,
                    borderTop: '1px solid #F0EEEA',
                    fontSize: 10,
                    color: '#8A8C92',
                  }}
                >
                  <span>{c.pipeline.views}</span>
                  <span>{c.pipeline.leads}</span>
                </div>
              </div>
            </div>
            <h3 style={H3}>{c.cards[3]}</h3>
          </article>

          {/* 05 — payouts */}
          <article className={`lp-brand-card lp-journey-card rv ${delays[4]}`} style={CARD_STYLE}>
            <span className="lp-journey-card__step">05</span>
            <div data-brand-preview style={PREVIEW_STYLE}>
              <div style={INNER_CARD}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'rgba(220,239,250,.72)',
                      color: '#315B7C',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={15} strokeWidth={2.8} />
                  </span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#17181C' }}>{c.pay.title}</div>
                    <div style={{ fontSize: 10, color: '#9B9DA3', marginTop: 2 }}>{c.pay.sub}</div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 18,
                    padding: 14,
                    border: '1px solid #F0EEEA',
                    borderRadius: 10,
                    background: '#FCFCFB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, color: '#8A8C92' }}>{c.pay.payout}</span>
                  <strong style={{ fontSize: 15, color: '#17181C' }}>{c.pay.amount}</strong>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 13, fontSize: 9.5, color: '#8A8C92' }}>
                  {c.pay.chips.map((chip) => (
                    <span key={chip} style={{ padding: '5px 7px', borderRadius: 6, background: '#F4F2EE' }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <h3 style={H3}>{c.cards[4]}</h3>
          </article>
        </div>
      </div>
    </section>
  )
}
