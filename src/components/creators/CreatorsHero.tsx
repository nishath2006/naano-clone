import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRight, ShieldCheck } from '@/components/lp/icons'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    pill: '2,000+ creators paid · 4.8/5 rating',
    h1: 'Get paid to post on LinkedIn',
    p: 'Choose deals from B2B brands you know, post in your own voice, and get paid within 24h. No negotiating, no admin. Creators earn ',
    strong: '€500 on average per deal',
    after: '.',
    primary: 'Start earning',
    secondary: 'See how it works',
    trust: 'Free to join · No exclusivity · Paid within 24h',
    brands: 'THE BRANDS ALREADY ON NAANOX',
  },
  fr: {
    pill: '2 000+ créateurs payés · note 4,8/5',
    h1: 'Soyez payé pour publier sur LinkedIn',
    p: 'Choisissez des deals de marques B2B que vous connaissez, postez avec votre voix, et soyez payé sous 24h. Sans négociation, sans admin. Les créateurs gagnent ',
    strong: '500 € en moyenne par deal',
    after: '.',
    primary: 'Commencer à gagner',
    secondary: 'Voir comment ça marche',
    trust: 'Gratuit · Sans exclusivité · Payé sous 24h',
    brands: 'LES MARQUES DÉJÀ SUR NAANOX',
  },
}

const BRANDS = [
  { src: '/lp/logo-lemlist.png', alt: 'lemlist', h: 30 },
  { src: '/lp/logo-attio.jpg', alt: 'Attio', h: 26 },
  { src: '/lp/logo-folk.png', alt: 'Folk', h: 22 },
  { src: '/lp/logo-ringover.png', alt: 'Ringover', h: 30 },
  { src: '/lp/logo-gojiberry.png', alt: 'Gojiberry', h: 24 },
  { src: '/lp/logo-lagrowthmachine.png', alt: 'La Growth Machine', h: 24 },
  { src: '/lp/logo-chatseo.png', alt: 'ChatSEO', h: 28 },
  { src: '/lp/logo-abyssale.png', alt: 'Abyssale', h: 22 },
]

const LOGO_STYLE = (h: number): React.CSSProperties => ({ maxHeight: h, maxWidth: 132, objectFit: 'contain', display: 'block', filter: 'grayscale(1)', opacity: 0.55 })

export function CreatorsHero() {
  const t = useT()
  const c = t(copy)
  return (
    <>
      <div style={{ height: 74 }} />
      <div
        data-screen-label="Hero"
        style={{
          minHeight: 'calc(var(--hero-h, max(760px, calc(100dvh / (100vw / 1672px)))) - 74px)',
          padding: '40px 84px 60px 84px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div className="lp-cloud-scene">
          <img src="/lp/hero-clouds-cotton-blue-v7.png" alt="" className="lp-cloud-image" decoding="async" fetchPriority="high" />
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#FFFFFF',
            border: '1px solid #EBE9E5',
            borderRadius: 999,
            padding: '9px 18px 9px 14px',
            boxShadow: '0 1px 2px rgba(23,24,28,0.04)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {['/lp/avatar-b.png', '/lp/avatar-f.png', '/lp/avatar-a.png'].map((src, i) => (
              <span
                key={src}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  marginLeft: i === 0 ? 0 : -8,
                  backgroundColor: '#EDEBE7',
                  backgroundImage: `url("${src}")`,
                  backgroundSize: 'cover',
                  border: '2px solid #FFFFFF',
                }}
              />
            ))}
          </span>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#33353B' }}>{c.pill}</span>
        </div>
        <h1 style={{ margin: '34px 0 0 0', fontSize: 80, lineHeight: 1.05, fontWeight: 600, letterSpacing: '-0.04em', color: '#17181C', maxWidth: 980 }}>{c.h1}</h1>
        <p style={{ margin: '30px 0 0 0', fontSize: 21, lineHeight: 1.5, color: '#43454C', maxWidth: 680 }}>
          {c.p}
          <span style={{ color: '#17181C', fontWeight: 600 }}>{c.strong}</span>
          {c.after}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 44 }}>
          <NavAnchor
            href="/register"
            className="lp-hero-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 11,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              background: '#17181C',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 600,
              padding: '16px 28px',
              borderRadius: 12,
            }}
          >
            {c.primary}
            <ArrowRight size={17} />
          </NavAnchor>
          <NavAnchor
            href="/creators#monetize"
            className="lp-hero-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none', whiteSpace: 'nowrap', color: '#17181C', fontSize: 16.5, fontWeight: 600 }}
          >
            {c.secondary}
            <ArrowRight size={16} stroke="#111318" />
          </NavAnchor>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 34, color: '#55575E' }}>
          <ShieldCheck />
          <span style={{ fontSize: 15.5, fontWeight: 500 }}>{c.trust}</span>
        </div>

        <div data-screen-label="Trust bar" style={{ width: '100%', marginTop: 62 }}>
          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: '#B0B2B8' }}>{c.brands}</div>
          <div className="creator-trust-static" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '28px 54px', marginTop: 28 }}>
            {BRANDS.map((b) => (
              <div key={b.src} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34 }}>
                <img src={b.src} alt={b.alt} style={LOGO_STYLE(b.h)} />
              </div>
            ))}
          </div>
          <div
            className="creator-trust-marquee"
            style={{
              marginTop: 28,
              overflow: 'hidden',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
              maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            }}
          >
            <div className="naano-trust-track" style={{ display: 'inline-flex', alignItems: 'center', animation: 'naanoMarquee 26s linear infinite' }}>
              {[0, 1].map((rep) =>
                BRANDS.map((b) => (
                  <div key={`${rep}-${b.src}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 26px', height: 34, flexShrink: 0 }}>
                    <img src={b.src} alt={rep === 0 ? b.alt : ''} style={LOGO_STYLE(b.h)} />
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
