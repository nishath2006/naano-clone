import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '@/layouts/LpLayout'
import { SiteFooter } from '@/components/site/SiteFooter'
import { FooterCta } from '@/components/site/FooterCta'
import { SelectionForm } from '@/components/selection/SelectionForm'
import { SelectionAside } from '@/components/selection/SelectionAside'
import { FaqSection, HowToSection, ManagedBanner, RelatedReading, TrustedLogos, WhatIsNaanoSection } from '@/components/selection/SelectionSections'
import { selectionHeader, selectionHero, selectionMeta } from '@/components/selection/selectionCopy'
import { BrandWordmark } from '@/components/shared/BrandWordmark'

const RESPONSIVE_CSS = `
        .sel-card{display:grid;grid-template-columns:minmax(0,0.92fr) minmax(400px,1.08fr)}
        .sel-value{border-right:1px solid #EFEDE9}
        @media(max-width:900px){
          .sel-card{grid-template-columns:1fr}
          .sel-form{order:1}
          .sel-value{order:2;border-right:0;border-top:1px solid #EFEDE9}
        }
        @media(max-width:620px){
          .sel-hero-sub{font-size:16px !important}
          .sel-goals{grid-template-columns:1fr !important}
          .sel-goals button{min-height:0 !important}
          .sel-signin-label{display:none}
        }
`

/**
 * /selection — "Find LinkedIn creators for B2B", the free human-led creator
 * search. The live page is a fluid `.naano-lp` document with its own slim
 * header (logo + Sign in), the brief form card, explainer sections and the
 * Jakarta footer topped by the blue CTA block.
 */
export default function Selection() {
  useDocumentMeta(selectionMeta.title, selectionMeta.description)

  useEffect(() => {
    document.documentElement.style.background = '#FCFCFB'
    return () => {
      document.documentElement.style.background = ''
    }
  }, [])

  return (
    <>
      <div className="bg-noise" />
      <div
        className="naano-lp"
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
        <style>{RESPONSIVE_CSS}</style>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(16px, 3vw, 24px) clamp(20px, 5vw, 48px)',
            borderBottom: '1px solid #EFEDE9',
          }}
        >
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <BrandWordmark height={26} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="sel-signin-label" style={{ color: '#8A8D93', fontSize: 13.5 }}>
              {selectionHeader.signedIn}
            </span>
            <Link
              to="/login"
              className="lp-fhover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 36,
                padding: '0 15px',
                borderRadius: 999,
                background: '#0E0F12',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {selectionHeader.signIn}
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, width: '100%', maxWidth: 1140, margin: '0 auto', padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 48px) 64px' }}>
          <section style={{ maxWidth: 760, margin: '0 auto 36px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--accent)' }}>{selectionHero.eyebrow}</div>
            <h1
              style={{
                margin: '18px 0 0',
                fontSize: 'clamp(34px, 7vw, 50px)',
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: '-0.035em',
                color: '#0E0F12',
                textWrap: 'balance',
              }}
            >
              {selectionHero.h1}
            </h1>
            <p className="sel-hero-sub" style={{ maxWidth: 580, margin: '20px auto 0', fontSize: 18, lineHeight: 1.55, color: '#55575E' }}>
              {selectionHero.subBefore}
              <b>{selectionHero.subBold}</b>
              {selectionHero.subAfter}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 24px', marginTop: 26 }}>
              {selectionHero.points.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(124,92,252,0.1)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#2C2E33' }}>{p}</span>
                </div>
              ))}
            </div>
          </section>

          <section
            className="sel-card"
            style={{ border: '1px solid #E7E5E1', borderRadius: 20, background: '#FFFFFF', overflow: 'hidden', boxShadow: '0 25px 70px rgba(17,18,28,0.07)' }}
          >
            <SelectionAside />
            <div className="sel-form" style={{ padding: 'clamp(22px, 3vw, 32px)' }}>
              <SelectionForm />
            </div>
          </section>

          <ManagedBanner />
          <TrustedLogos />
          <HowToSection />
          <WhatIsNaanoSection />
          <FaqSection />
          <RelatedReading />
        </main>

        <FooterCta />
        <SiteFooter />
      </div>
    </>
  )
}
