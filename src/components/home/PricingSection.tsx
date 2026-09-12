import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRight, ArrowRightSmall, ShieldCheckSmall } from '@/components/lp/icons'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    title: 'Pricing',
    lead: 'Start free. Upgrade when you want your time back.',
    sub: 'Choose whether you want to run creator campaigns in-house or have NaanoX operate them.',
    self: {
      eyebrow: 'SELF-SERVE',
      title: 'Run it yourself.',
      body: 'For teams that want the infrastructure to run creator campaigns in-house.',
      price: '€0',
      per: '/ month',
      items: ['Creator marketplace access', 'AI-powered brief creation', 'Track clicks, companies and pipeline', 'Automatic creator payouts'],
      cta: 'Start for free',
    },
    managed: {
      eyebrow: 'MANAGED CAMPAIGNS',
      title: 'Get your time back.',
      body: 'For teams that want NaanoX to operate their creator channel end to end.',
      price: 'Custom quote',
      items: ['Campaign strategy and positioning', 'Creator sourcing and coordination', 'Brief creation and campaign launch', 'Reporting and optimisation'],
      cta: 'Book a campaign call',
    },
    note: 'Campaign spend is separate. No lock-in. Cancel anytime.',
  },
  fr: {
    title: 'Tarifs',
    lead: 'Commencez gratuitement. Passez à la vitesse supérieure quand vous voulez récupérer du temps.',
    sub: 'Choisissez entre gérer vos campagnes avec des créateurs en interne ou les confier à NaanoX.',
    self: {
      eyebrow: 'SELF-SERVE',
      title: 'Pilotez vous-même.',
      body: "Pour les équipes qui veulent l'infra pour lancer des campagnes créateurs en interne.",
      price: '€0',
      per: '/ mois',
      items: ['Accès à la Marketplace de créateurs', "Création de briefs assistée par l'IA", 'Suivi des clics, des entreprises et du pipeline', 'Paiements créateurs automatiques'],
      cta: 'Commencer gratuitement',
    },
    managed: {
      eyebrow: 'MANAGED CAMPAIGNS',
      title: 'Récupérez votre temps.',
      body: 'Pour les équipes qui veulent confier à NaanoX la gestion de leur canal créateurs de A à Z.',
      price: 'Devis personnalisé',
      items: ['Stratégie et positionnement de campagne', 'Sourcing et coordination des créateurs', 'Création du brief et lancement de la campagne', 'Reporting et optimisation'],
      cta: 'Réserver un appel de cadrage',
    },
    note: 'Le budget de campagne est séparé. Sans engagement. Résiliable à tout moment.',
  },
}

const ROW: React.CSSProperties = { padding: '16px 0', borderTop: '1px solid #ECEAE6', fontSize: 15.5, lineHeight: 1.4, color: '#26272C' }

export function PricingSection() {
  const t = useT()
  const c = t(copy)
  return (
    <div
      id="pricing"
      className="lp-system-section lp-system-pricing"
      data-screen-label="Pricing"
      style={{ padding: '112px 84px 120px 84px', background: 'linear-gradient(180deg, #FCFCFB 0%, var(--nn-sky-soft, #F3F8FF) 58%, #FCFCFB 100%)' }}
    >
      <div className="rv rv-d0" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 64, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--nn-ink, #111318)', lineHeight: 1 }}>
          {c.title}
          <span>.</span>
        </h2>
        <p style={{ margin: '26px 0 0 0', fontSize: 21, fontWeight: 600, letterSpacing: '-0.015em', color: '#17181C' }}>{c.lead}</p>
        <p style={{ margin: '12px 0 0 0', fontSize: 16, lineHeight: 1.55, color: '#8B8D94' }}>{c.sub}</p>
      </div>

      <div
        className="lp-pricing-shell rv rv-d1"
        style={{
          maxWidth: 1100,
          margin: '66px auto 0 auto',
          border: '1px solid var(--nn-glass-border, rgba(255,255,255,.92))',
          borderRadius: 28,
          overflow: 'hidden',
          background: 'var(--nn-glass, rgba(255,255,255,.72))',
          boxShadow: '0 32px 88px -58px rgba(56,96,128,.42)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div data-pricing-cards style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              padding: '52px 56px 44px 56px',
              borderRight: '1px solid rgba(203,224,238,.72)',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,.54)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9B9DA3' }}>{c.self.eyebrow}</div>
            <h3 style={{ margin: '20px 0 0 0', fontSize: 34, fontWeight: 800, letterSpacing: '-0.025em', color: '#17181C', lineHeight: 1.15, minHeight: 78 }}>
              {c.self.title}
            </h3>
            <p style={{ margin: '14px 0 0 0', fontSize: 15.5, lineHeight: 1.55, color: '#55575E', minHeight: 48 }}>{c.self.body}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 28 }}>
              <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', color: '#17181C', lineHeight: 1 }}>{c.self.price}</span>
              <span style={{ fontSize: 15, color: '#9B9DA3' }}>{c.self.per}</span>
            </div>
            <div style={{ marginTop: 34 }}>
              {c.self.items.map((i) => (
                <div key={i} style={ROW}>
                  {i}
                </div>
              ))}
            </div>
            <NavAnchor
              href="/register"
              style={{
                marginTop: 40,
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                textDecoration: 'none',
                color: '#17181C',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                borderBottom: '1.5px solid #17181C',
                paddingBottom: 3,
              }}
            >
              {c.self.cta}
              <ArrowRightSmall size={15} strokeWidth={2.4} />
            </NavAnchor>
          </div>
          <div style={{ padding: '52px 56px 44px 56px', background: 'rgba(255,255,255,.82)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#315B7C' }}>{c.managed.eyebrow}</div>
            <h3 style={{ margin: '20px 0 0 0', fontSize: 34, fontWeight: 800, letterSpacing: '-0.025em', color: '#17181C', lineHeight: 1.15, minHeight: 78 }}>
              {c.managed.title}
            </h3>
            <p style={{ margin: '14px 0 0 0', fontSize: 15.5, lineHeight: 1.55, color: '#55575E', minHeight: 48 }}>{c.managed.body}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 28 }}>
              <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', color: '#17181C', lineHeight: 1 }}>{c.managed.price}</span>
            </div>
            <div style={{ marginTop: 34 }}>
              {c.managed.items.map((i) => (
                <div key={i} style={ROW}>
                  {i}
                </div>
              ))}
            </div>
            <NavAnchor
              href="/book"
              style={{
                marginTop: 40,
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
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
              {c.managed.cta}
              <ArrowRight size={15} />
            </NavAnchor>
          </div>
        </div>
      </div>
      <div className="rv rv-d2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 34, color: '#9B9DA3', fontSize: 14 }}>
        <ShieldCheckSmall />
        {c.note}
      </div>
    </div>
  )
}
