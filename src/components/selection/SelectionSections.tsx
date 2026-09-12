import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/lib/locale'
import { selectionFaq, selectionHowTo, selectionLogos, selectionManaged, selectionRelated, selectionWhatIsNaano } from './selectionCopy'

const H2: CSSProperties = { margin: 0, fontSize: 'clamp(26px, 4vw, 34px)', lineHeight: 1.12, fontWeight: 700, letterSpacing: '-0.03em', color: '#0E0F12' }
const PILL: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 40,
  padding: '0 18px',
  borderRadius: 999,
  border: '1px solid #E7E5E1',
  background: '#FFFFFF',
  color: '#0E0F12',
  fontSize: 14,
  fontWeight: 700,
  textDecoration: 'none',
}

/** "Want NaanoX to run the entire campaign?" strip under the shortlist card. */
export function ManagedBanner() {
  return (
    <div
      style={{
        marginTop: 14,
        padding: '14px 18px',
        border: '1px solid #EFEDE9',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.65)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <span style={{ color: '#8A8D93', fontSize: 13.5 }}>{selectionManaged.question}</span>
      <Link to="/book" className="lp-fhover" style={{ marginLeft: 'auto', color: '#0E0F12', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        {selectionManaged.cta}
      </Link>
    </div>
  )
}

/** Greyscale customer logo strip. */
export function TrustedLogos() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 30, marginTop: 38, opacity: 0.9 }}>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', color: '#A7A9AF' }}>{selectionLogos.label}</span>
      {selectionLogos.logos.map((l) => (
        <div key={l.alt} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24, width: 80 }}>
          <img src={l.src} alt={l.alt} style={{ maxHeight: 22, maxWidth: 80, objectFit: 'contain', display: 'block', filter: 'grayscale(1)', opacity: 0.6 }} />
        </div>
      ))}
    </div>
  )
}

/** Four-step "How to find LinkedIn creators for your campaign" grid. */
export function HowToSection() {
  return (
    <section style={{ marginTop: 72, paddingTop: 48, borderTop: '1px solid #EFEDE9' }}>
      <h2 style={H2}>{selectionHowTo.title}</h2>
      <p style={{ maxWidth: 660, margin: '14px 0 0', fontSize: 16.5, lineHeight: 1.6, color: '#55575E' }}>{selectionHowTo.intro}</p>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', marginTop: 28 }}>
        {selectionHowTo.steps.map((s, i) => (
          <div key={s.title} style={{ padding: 20, border: '1px solid #EFEDE9', borderRadius: 14, background: '#FFFFFF' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 8,
                background: 'rgba(124,92,252,0.1)',
                color: 'var(--accent)',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {i + 1}
            </span>
            <h3 style={{ margin: '12px 0 6px', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: '#0E0F12' }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#55575E' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/** "First time here? What NaanoX is." explainer card. */
export function WhatIsNaanoSection() {
  const { locale } = useLocale()
  const c = selectionWhatIsNaano[locale]
  return (
    <section style={{ marginTop: 56, padding: 'clamp(24px, 4vw, 36px)', border: '1px solid #E7E5E1', borderRadius: 20, background: '#FFFFFF' }}>
      <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3.4vw, 30px)', lineHeight: 1.14, fontWeight: 700, letterSpacing: '-0.03em', color: '#0E0F12' }}>{c.title}</h2>
      <p style={{ maxWidth: 740, margin: '14px 0 0', fontSize: 16.5, lineHeight: 1.65, color: '#55575E' }}>
        {c.introBefore}
        <b>{c.introBold}</b>
        {c.introAfter}
      </p>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 26 }}>
        {c.facts.map((f) => (
          <div key={f.value} style={{ padding: 18, border: '1px solid #EFEDE9', borderRadius: 13, background: '#FAFAF8' }}>
            <b style={{ display: 'block', fontSize: 18, letterSpacing: '-0.02em', color: '#0E0F12' }}>{f.value}</b>
            <span style={{ display: 'block', marginTop: 6, fontSize: 13.5, lineHeight: 1.55, color: '#55575E' }}>{f.label}</span>
          </div>
        ))}
      </div>
      <p style={{ maxWidth: 740, margin: '22px 0 0', fontSize: 15.5, lineHeight: 1.65, color: '#55575E' }}>
        {c.outroBefore}
        <Link to={c.link1.href} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
          {c.link1.label}
        </Link>
        {c.outroMiddle}
        <Link to={c.link2.href} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
          {c.link2.label}
        </Link>
        {c.outroAfter}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
        {c.buttons.map((b) => (
          <Link key={b.href} to={b.href} className="lp-fhover" style={PILL}>
            {b.label}
          </Link>
        ))}
      </div>
    </section>
  )
}

/** Native <details> FAQ list. */
export function FaqSection() {
  return (
    <section style={{ marginTop: 56 }}>
      <h2 style={H2}>{selectionFaq.title}</h2>
      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {selectionFaq.items.map((f) => (
          <details key={f.q} style={{ padding: '18px 20px', border: '1px solid #EFEDE9', borderRadius: 14, background: '#FFFFFF' }}>
            <summary style={{ cursor: 'pointer', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: '#0E0F12' }}>{f.q}</summary>
            <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.65, color: '#55575E' }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/** "Related reading" link list. */
export function RelatedReading() {
  return (
    <section style={{ marginTop: 56 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#0E0F12' }}>{selectionRelated.title}</h2>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 9 }}>
        {selectionRelated.links.map((l) => (
          <li key={l.href}>
            <Link to={l.href} style={{ fontSize: 15.5, fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
