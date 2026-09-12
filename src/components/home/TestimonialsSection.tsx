import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BlogSeoMark, Play } from '@/components/lp/icons'
import { TRUST_LOGOS } from '@/data/home'
import { useT } from '@/lib/locale'

const VIDEO_SRC = 'https://api.naano.xyz/storage/v1/object/public/marketing-assets/case-studies/blogseo-vincent-josse.mp4'

const copy = {
  en: {
    title: 'Real teams. Measurable pipeline.',
    sub: 'See how B2B teams turn creator trust into attributable demand with NaanoX.',
    video: 'VIDEO TESTIMONIAL',
    quote: '“NaanoX became one of our fastest acquisition channels. We know exactly what every creator brings.”',
    name: 'Vincent Josse',
    role: 'CEO & Founder, BlogSEO',
    caseStudy: 'CASE STUDY',
    csTitle: 'How BlogSEO turned creator content into product signups',
    csBody: 'BlogSEO briefed SEO & SaaS creators on LinkedIn and X, then traced every trial back to the post that drove it, all in NaanoX.',
    stats: [
      ['9', 'creators activated'],
      ['2,940', 'qualified clicks'],
      ['512', 'trials started'],
    ],
    read: 'Read case study',
    trusted: 'TRUSTED BY TEAMS AT',
  },
  fr: {
    title: 'De vraies équipes. Un pipeline mesurable.',
    sub: 'Voyez comment les équipes B2B transforment la confiance des créateurs en demande attribuable avec NaanoX.',
    video: 'TÉMOIGNAGE VIDÉO',
    quote: "« NaanoX est devenu l'un de nos canaux d'acquisition les plus rapides. On sait exactement ce que chaque créateur apporte. »",
    name: 'Vincent Josse',
    role: 'CEO & Fondateur, BlogSEO',
    caseStudy: 'ÉTUDE DE CAS',
    csTitle: 'Comment BlogSEO a transformé le contenu de créateurs en inscriptions à son produit',
    csBody: "BlogSEO a briefé des créateurs SEO & SaaS sur LinkedIn et X, puis a relié chaque essai au post qui l'a généré, le tout dans NaanoX.",
    stats: [
      ['9', 'créateurs activés'],
      ['2,940', 'clics qualifiés'],
      ['512', 'essais démarrés'],
    ],
    read: "Lire l'étude de cas",
    trusted: 'ILS NOUS FONT CONFIANCE',
  },
}

export function TestimonialsSection() {
  const t = useT()
  const c = t(copy)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <div
      id="what-people-think"
      className="lp-system-section lp-system-testimonials"
      data-screen-label="What people think"
      style={{ padding: '104px 84px 112px 84px', background: 'linear-gradient(180deg, #FCFCFB 0%, rgba(243,248,255,.72) 100%)' }}
    >
      <h2 className="rv rv-d0" style={{ margin: 0, textAlign: 'center', fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--nn-ink, #111318)' }}>
        {c.title}
      </h2>
      <p className="rv rv-d0" style={{ margin: '16px 0 0 0', textAlign: 'center', fontSize: 19, color: '#55575E' }}>
        {c.sub}
      </p>
      <div
        className="lp-testimonial-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 34,
          marginTop: 64,
          alignItems: 'stretch',
          transition: 'opacity 0.6s ease, transform 0.7s cubic-bezier(.22,.61,.36,1)',
        }}
      >
        {/* Video testimonial */}
        <div
          className="lp-proof-card lp-proof-card--video rv rv-d0"
          style={{
            background: 'var(--nn-glass-strong, rgba(255,255,255,.88))',
            border: '1px solid var(--nn-glass-border, rgba(255,255,255,.92))',
            borderRadius: 28,
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 28px 80px -54px rgba(56,96,128,.42)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: '#9B9DA3' }}>{c.video}</span>
          <div className="lp-proof-video" style={{ position: 'relative', marginTop: 18, height: 340, borderRadius: 16, overflow: 'hidden', backgroundColor: '#0E0F12' }}>
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster="/lp/blogseo-vincent-video-poster.png"
              playsInline
              preload="metadata"
              controls={playing}
              onEnded={() => setPlaying(false)}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              className="lp-proof-video__media"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {!playing && (
              <>
                <button
                  type="button"
                  aria-label="Play video testimonial"
                  onClick={toggle}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    border: 0,
                    background: 'linear-gradient(180deg, rgba(17,19,24,.02), rgba(17,19,24,.24))',
                    cursor: 'pointer',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 72,
                    height: 72,
                    background: 'rgba(255,255,255,.94)',
                    borderRadius: '50%',
                    boxShadow: '0 10px 30px rgba(23,24,28,0.25)',
                    animation: 'naanoPulse 2.6s ease-in-out infinite',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Play />
                </span>
                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    bottom: 12,
                    background: 'rgba(23,24,28,0.78)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 7,
                    padding: '4px 9px',
                    pointerEvents: 'none',
                  }}
                >
                  2:40
                </span>
              </>
            )}
          </div>
          <p style={{ margin: '26px 0 0 0', fontSize: 24, lineHeight: 1.4, fontWeight: 600, letterSpacing: '-0.015em', color: '#17181C' }}>{c.quote}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 22 }}>
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                backgroundColor: '#6B72E8',
                backgroundImage: 'url("/lp/avatar-g.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 13.5, color: '#8B8D94', marginTop: 1 }}>{c.role}</div>
            </div>
          </div>
        </div>

        {/* Case study */}
        <div
          className="lp-proof-card lp-proof-card--case"
          style={{
            background: 'var(--nn-glass-strong, rgba(255,255,255,.88))',
            border: '1px solid var(--nn-glass-border, rgba(255,255,255,.92))',
            borderRadius: 28,
            padding: '36px 40px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 28px 80px -54px rgba(56,96,128,.42)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <div className="rv rv-d1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: '#9B9DA3' }}>{c.caseStudy}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BlogSeoMark />
              <span style={{ fontSize: 22, fontWeight: 800, color: '#15171A', letterSpacing: '-0.02em' }}>BlogSEO</span>
            </div>
          </div>
          <h3 className="rv rv-d2" style={{ margin: '22px 0 0 0', fontSize: 27, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#17181C' }}>
            {c.csTitle}
          </h3>
          <p className="rv rv-d3" style={{ margin: '14px 0 0 0', fontSize: 15.5, lineHeight: 1.55, color: '#8B8D94' }}>
            {c.csBody}
          </p>
          <div className="rv rv-d4" style={{ height: 1, background: '#F0EEEA', margin: '26px 0' }} />
          <div className="lp-cs-stats rv rv-d5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {c.stats.map(([value, label], i) => (
              <div
                key={label}
                style={
                  i === 0
                    ? { paddingRight: 18 }
                    : i === 1
                      ? { padding: '0 22px', borderLeft: '1px solid #F0EEEA' }
                      : { paddingLeft: 22, borderLeft: '1px solid #F0EEEA' }
                }
              >
                <div data-cu style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', color: '#17181C' }}>
                  {value}
                </div>
                <div style={{ fontSize: 13.5, color: '#8B8D94', marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
          <Link
            to="/case-studies/blogseo"
            className="rv rv-d5"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              marginTop: 28,
              textDecoration: 'none',
              color: 'var(--nn-ink, #111318)',
              fontSize: 15.5,
              fontWeight: 600,
            }}
          >
            {c.read}
            <ArrowRight size={16} />
          </Link>
          <div className="rv rv-d5" style={{ height: 1, background: '#F0EEEA', margin: '30px 0 22px 0' }} />
          <div className="rv rv-d5" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#B0B2B8' }}>
            {c.trusted}
          </div>
          <div className="lp-trust-logos rv rv-d5" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '22px 36px', marginTop: 22 }}>
            {TRUST_LOGOS.map((l) => (
              <div key={l.src} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 124 }}>
                <img
                  src={l.src}
                  alt={l.alt}
                  loading="lazy"
                  style={{ maxHeight: l.trustHeight, maxWidth: 124, objectFit: 'contain', display: 'block', mixBlendMode: l.multiply ? 'multiply' : undefined }}
                />
              </div>
            ))}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 26,
                padding: '0 14px',
                border: '1.5px solid #D9D6D0',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: '#8B8D94',
              }}
            >
              +30
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
