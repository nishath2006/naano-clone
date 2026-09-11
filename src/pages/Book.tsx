import { Link } from 'react-router-dom'
import { StandaloneShell } from '@/layouts/StandaloneShell'
import { AccentCheck, ArrowLeft, ArrowRightShort, Clock, VideoCamera } from '@/components/lp/fluidIcons'

// naano.com serves this page in English for both locales (the FR capture is
// identical apart from the Cloudflare email hash). The address decodes to:
const EMAIL = 'info@naano.com'

const CAL_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1jAKngmC-PGgCsMuK4Z7fnFDMmnjZRJjHEReGR7wAALR7mdOwyUx55Owm06Iood6_ZaWIG8HlU?gv=true'

const BULLETS = [
  'Creator angles tailored to your market',
  'Recommended campaign format and budget',
  'A clear launch plan for your next campaign',
]

const LOGOS = [
  { src: '/lp/logo-lemlist.png', alt: 'lemlist' },
  { src: '/lp/logo-folk.png', alt: 'folk' },
  { src: '/lp/logo-ringover.png', alt: 'Ringover' },
  { src: '/lp/logo-attio.jpg', alt: 'Attio' },
  { src: '/lp/logo-gojiberry.png', alt: 'gojiberry' },
]

const PILL = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '5px 10px',
  border: '1px solid #E7E5E1',
  borderRadius: 8,
  fontSize: 12.5,
  fontWeight: 600,
  color: '#2C2E33',
} as const

/**
 * /book — standalone "campaign strategy call" page. On naano.com it has its
 * own slim header (logo + "Back to homepage"), no LP nav and no footer, and
 * embeds a Google Calendar appointment schedule in an iframe.
 */
export default function Book() {
  return (
    <StandaloneShell
      title="Book a campaign call — Naano"
      description="In 30 minutes, we'll map the right creator angles, campaign format and budget for your ICP. Book a free campaign strategy call with the Naano team."
      background="#FCFCFB"
    >
      <div
        className="naano-lp"
        data-lp-fluid=""
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#FCFCFB',
          color: '#17181C',
          WebkitFontSmoothing: 'antialiased',
          fontFamily: 'var(--font-inter), -apple-system, sans-serif',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(16px, 3vw, 24px) clamp(20px, 5vw, 48px)',
            borderBottom: '1px solid #EFEDE9',
          }}
        >
          <Link style={{ display: 'inline-flex', alignItems: 'center' }} to="/">
            <img src="/lp/naano-logo-nav.png" alt="naano" style={{ height: 26, display: 'block' }} />
          </Link>
          <Link
            className="lp-fhover"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#55575E', fontSize: 14.5, fontWeight: 600, textDecoration: 'none' }}
            to="/"
          >
            <ArrowLeft />
            Back to homepage
          </Link>
        </header>

        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: 940,
            margin: '0 auto',
            padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 48px) 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <section style={{ width: '100%', maxWidth: 680, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--accent)' }}>CAMPAIGN STRATEGY CALL</div>
            <h1
              style={{
                margin: '20px 0 0 0',
                fontSize: 'clamp(36px, 8vw, 52px)',
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: '-0.035em',
                color: '#0E0F12',
                textWrap: 'balance',
              }}
            >
              Let&apos;s build your next creator campaign.
            </h1>
            <p style={{ margin: '22px auto 0', fontSize: 19, lineHeight: 1.5, color: '#55575E', maxWidth: 500 }}>
              In 30 minutes, we&apos;ll map the right creator angles, campaign format and budget for your ICP.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px 26px', marginTop: 32 }}>
              {BULLETS.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(37,99,235,0.1)',
                    }}
                  >
                    <AccentCheck />
                  </span>
                  <span style={{ fontSize: 15.5, fontWeight: 500, color: '#2C2E33' }}>{b}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ width: '100%', marginTop: 44 }}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E7E5E1',
                borderRadius: 16,
                padding: 'clamp(16px, 3vw, 26px) clamp(16px, 3vw, 26px) 22px',
                boxShadow: '0 1px 3px rgba(17,18,28,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '0 4px',
                  flexWrap: 'wrap',
                  rowGap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', rowGap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#0E0F12' }}>Book a campaign call</h2>
                  <span style={PILL}>
                    <Clock />
                    30 min
                  </span>
                  <span style={PILL}>
                    <VideoCamera />
                    Video call
                  </span>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 11px',
                    background: '#F5F4F1',
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#55575E',
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A' }} />
                  Available
                </span>
              </div>
              <div style={{ marginTop: 18, border: '1px solid #E7E5E1', borderRadius: 12, overflow: 'hidden', background: '#FFFFFF' }}>
                <iframe
                  title="Book a campaign call with Naano"
                  src={CAL_URL}
                  style={{ border: 0, display: 'block', width: '100%' }}
                  width="100%"
                  height={620}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginTop: 16,
                  padding: '14px 4px 2px',
                  borderTop: '1px solid #F0EEEA',
                  flexWrap: 'wrap',
                  rowGap: 10,
                }}
              >
                <p style={{ margin: 0, fontSize: 13, color: '#A7A9AF' }}>You&apos;ll receive a Google Calendar invite instantly.</p>
                <a
                  href={`mailto:${EMAIL}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13.5,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                  }}
                >
                  Prefer email? Contact us
                  <ArrowRightShort />
                </a>
              </div>
            </div>
          </section>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 30,
              marginTop: 40,
              opacity: 0.9,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', color: '#A7A9AF' }}>Trusted by B2B teams at</span>
            {LOGOS.map((l) => (
              <div key={l.alt} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24, width: 80 }}>
                <img
                  src={l.src}
                  alt={l.alt}
                  style={{ maxHeight: 22, maxWidth: 80, objectFit: 'contain', display: 'block', filter: 'grayscale(1)', opacity: 0.6 }}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </StandaloneShell>
  )
}
