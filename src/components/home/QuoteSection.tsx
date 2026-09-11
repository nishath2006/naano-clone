import { useEffect, useRef } from 'react'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    words: ['We', 'manage', '€10M+', 'of', 'influence', 'budget', 'every', 'year.', 'For', 'B2B,', 'Naano', 'simply', 'makes', 'our', 'life'],
    accent: 'easier',
    name: 'David Zmirov',
    role: 'CEO, Zmirov Communication',
    kind: 'Influence agency',
  },
  fr: {
    words: ['Nous', 'gérons', 'plus', 'de', '10', 'M€', 'de', 'budget', 'influence', 'chaque', 'année.', 'Pour', 'le', 'B2B,', 'Naano', 'nous', 'simplifie', 'vraiment', 'la'],
    accent: 'vie',
    name: 'David Zmirov',
    role: 'PDG, Zmirov Communication',
    kind: "Agence d'influence",
  },
}

/**
 * Customer quote whose words light up one by one (opacity .14 → 1) as the
 * section scrolls through the viewport.
 */
export function QuoteSection() {
  const t = useT()
  const c = t(copy)
  const ref = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-word]'))
    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // progress 0 → 1 while the quote travels from 85% to 35% of the viewport
      const start = vh * 0.85
      const end = vh * 0.35
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      const lit = Math.round(p * words.length)
      words.forEach((w, i) => {
        w.style.opacity = i < lit ? '1' : '0.14'
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [c])

  return (
    <div
      data-screen-label="Quote"
      style={{
        minHeight: 680,
        padding: '96px 84px 96px 84px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'center',
      }}
    >
      <img src="/lp/logo-zmirov.png" alt="Zmirov Communication" style={{ height: 46, width: 'auto', display: 'block' }} />
      <div style={{ width: 46, height: 2, background: 'var(--accent)', borderRadius: 2, marginTop: 20 }} />
      <blockquote
        ref={ref}
        style={{
          margin: '44px 0 0 0',
          maxWidth: 1160,
          fontFamily: 'var(--font-inter), -apple-system, sans-serif',
          fontSize: 52,
          lineHeight: 1.2,
          fontWeight: 500,
          letterSpacing: '-0.022em',
          color: '#17181C',
          textWrap: 'balance',
        }}
      >
        “
        {c.words.map((w, i) => (
          <span key={i} data-word style={{ opacity: 0.14, transition: 'opacity 80ms linear' }}>
            {w}{' '}
          </span>
        ))}
        <span data-word style={{ opacity: 0.14, transition: 'opacity 80ms linear', color: 'var(--accent)' }}>
          {c.accent}
        </span>
        ”
      </blockquote>
      <img
        src="/lp/photo-david-zmirov.png"
        alt="David Zmirov"
        style={{ width: 104, height: 104, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 18%', marginTop: 52 }}
      />
      <div style={{ fontSize: 19, fontWeight: 700, color: '#17181C', marginTop: 20 }}>{c.name}</div>
      <div style={{ fontSize: 16, color: '#55575E', marginTop: 6 }}>{c.role}</div>
      <div style={{ fontSize: 15, color: '#9B9DA3', marginTop: 4 }}>{c.kind}</div>
    </div>
  )
}
