import { Link } from 'react-router-dom'
import { NavAnchor } from '@/components/lp/LpNav'
import { useLocale } from '@/lib/locale'

const copy = {
  en: { title: 'Ready to scale with ', cta: 'Get started' },
  fr: { title: 'Prêt à évoluer avec ', cta: 'Commencer' },
}

/**
 * Blue gradient "Ready to scale with naano?" block that sits on top of the
 * dark footer on the Jakarta pages. Only the headline and primary button are
 * localised on the live site; the rest stays in English.
 */
export function FooterCta() {
  const { locale } = useLocale()
  const c = copy[locale]
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A2A6B 0%, #1652F0 55%, #2563EB 100%)',
        padding: 'clamp(48px, 8vw, 80px) 24px clamp(56px, 8vw, 96px)',
        fontFamily: 'var(--font-jakarta)',
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="ftGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ftGrid)" />
      </svg>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Get started
        </p>
        <h2 className="font-bold text-white leading-[1.08] tracking-[-0.03em] mb-5" style={{ fontSize: 'clamp(28px, 3.4vw, 46px)' }}>
          {c.title}
          <span style={{ color: '#FFFFFF' }}>naano</span>?
        </h2>
        <p className="text-white/75 text-base leading-relaxed max-w-md mx-auto mb-10">
          Launch your first campaign in minutes. Top up your wallet and pay per post, with tracked clicks on every one.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/register"
            style={{
              height: 50,
              padding: '0 28px',
              background: '#FFFFFF',
              color: 'var(--lp-ink)',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 8px 30px rgba(4,18,60,0.28)',
            }}
          >
            {c.cta}
          </Link>
          <NavAnchor
            href="/#how-it-works"
            style={{
              height: 50,
              padding: '0 22px',
              background: 'transparent',
              color: 'white',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              letterSpacing: '-0.01em',
            }}
          >
            See how it works
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </NavAnchor>
        </div>
        <p className="text-[12px] text-white/60 mt-5">Free to start. No credit card required.</p>
      </div>
    </div>
  )
}
