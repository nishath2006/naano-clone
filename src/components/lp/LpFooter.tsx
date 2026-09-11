import { getLpFooter } from '@/data/footer'
import { useLocale } from '@/lib/locale'
import { NavAnchor } from './LpNav'
import { LinkedInLogo, TrustpilotStar } from './icons'

const HEADING = { fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: '#6E7076' } as const
const LINK = { textDecoration: 'none', color: '#AEB0B6', fontSize: 14.5, lineHeight: 1.3 } as const

/**
 * Landing-page footer. The markup carries the original dark inline styles; the
 * `.naano-lp .lp-footer` rules in lp.css restyle it as the light, cloud-topped
 * footer that is actually rendered.
 */
export function LpFooter({ variant = 'home' }: { variant?: 'home' | 'creators' | 'agencies' }) {
  const { locale } = useLocale()
  const f = getLpFooter(locale, variant)
  return (
    <div
      className="lp-footer"
      data-screen-label="Footer"
      style={{ background: '#101113', color: '#FFFFFF', padding: '88px 84px 0 84px', overflow: 'hidden', position: 'relative' }}
    >
      <div
        className="lp-footer__grid"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.6fr',
          gap: 44,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <img src="/lp/naano-logo-nav.png" alt="naano" style={{ height: 28, width: 'auto', alignSelf: 'flex-start' }} />
          <p style={{ margin: '22px 0 0 0', fontSize: 15, lineHeight: 1.55, color: '#9A9CA3', maxWidth: 210 }}>{f.tagline}</p>
          <a
            href="https://www.linkedin.com/company/naanooo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="lp-fhover-bg"
            style={{
              marginTop: 26,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              background: '#26272C',
              borderRadius: 11,
            }}
          >
            <LinkedInLogo size={16} fill="#FFFFFF" />
          </a>
        </div>
        {f.columns.map((col) => (
          <div key={col.heading} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={HEADING}>{col.heading}</div>
            {col.links.map((l) => (
              <NavAnchor key={l.href + l.label} href={l.href} className="lp-fhover" style={LINK}>
                {l.label}
              </NavAnchor>
            ))}
            {col.subHeading && (
              <>
                <div style={{ ...HEADING, marginTop: 14 }}>{col.subHeading}</div>
                {col.subLinks?.map((l) => (
                  <NavAnchor key={l.href + l.label} href={l.href} className="lp-fhover" style={LINK}>
                    {l.label}
                  </NavAnchor>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
      <div
        className="lp-footer__legal"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #26272C',
          marginTop: 60,
          padding: '22px 0 30px 0',
        }}
      >
        <span style={{ fontSize: 13.5, color: '#8A8C92' }}>{f.legal}</span>
        <a
          href="https://fr.trustpilot.com/review/www.naano.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="lp-fhover"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 13.5, color: '#C7C9CF' }}
        >
          <TrustpilotStar />
          {f.trustpilot}
        </a>
      </div>
      <div
        className="lp-footer__watermark"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -64,
          textAlign: 'center',
          fontSize: 300,
          lineHeight: 0.78,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          color: 'rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }}
      >
        naano
      </div>
    </div>
  )
}
