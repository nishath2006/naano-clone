import { getSiteFooter } from '@/data/footer'
import { useLocale } from '@/lib/locale'
import { NavAnchor } from '@/components/lp/LpNav'
import { LinkedInLogo, TrustpilotStar } from '@/components/lp/icons'

const LINK = 'text-[13px] transition-colors duration-150 hover:text-white'
const LINK_STYLE = { color: 'var(--lp-ink-soft)', textDecoration: 'none' } as const
const HEAD = 'text-[11px] font-semibold uppercase tracking-[0.1em] mb-1'
const HEAD_STYLE = { color: 'rgba(255,255,255,0.35)' } as const

/** Dark footer shared by the Plus-Jakarta pages (about, pricing, blog, tools…). */
export function SiteFooter() {
  const { locale } = useLocale()
  const f = getSiteFooter(locale)
  return (
    <footer style={{ fontFamily: 'var(--font-jakarta)', backgroundColor: 'var(--lp-footer)' }}>
      <div className="relative overflow-hidden" style={{ background: 'var(--lp-footer)' }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none" style={{ lineHeight: 1 }}>
          <span className="font-black text-white tracking-[-0.05em]" style={{ fontSize: 'clamp(80px, 14vw, 180px)', opacity: 0.03 }}>
            NAANOX
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="NaanoX" loading="lazy" style={{ height: 20, width: 20, objectFit: 'contain', filter: 'invert(1)' }} />
                <span className="font-bold text-white text-base">naano<span style={{ color: '#DDD4FF' }}>X</span></span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--lp-ink-soft)', maxWidth: 220 }}>
                {f.tagline}
              </p>
              <a
                href="https://www.linkedin.com/company/naanooo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-white"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.15s',
                  marginTop: 4,
                }}
              >
                <LinkedInLogo size={16} fill="currentColor" />
              </a>
            </div>
            {[f.product, f.company, f.press].map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className={HEAD} style={HEAD_STYLE}>
                  {col.heading}
                </p>
                {col.links.map((l) => (
                  <NavAnchor key={l.href + l.label} href={l.href} className={LINK} style={LINK_STYLE}>
                    {l.label}
                  </NavAnchor>
                ))}
              </div>
            ))}
            <div className="flex flex-col gap-3">
              <p className={HEAD} style={HEAD_STYLE}>
                {f.resources.heading}
              </p>
              {f.resources.links.map((l) => (
                <NavAnchor key={l.href + l.label} href={l.href} className={LINK} style={LINK_STYLE}>
                  {l.label}
                </NavAnchor>
              ))}
              <p className={`${HEAD} mt-4`} style={HEAD_STYLE}>
                {f.resources.aiHeading}
              </p>
              {f.resources.aiLinks.map((l) => (
                <NavAnchor key={l.href + l.label} href={l.href} className={LINK} style={LINK_STYLE}>
                  {l.label}
                </NavAnchor>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[12px]" style={{ color: 'var(--lp-ink-soft)' }}>
              {f.legal}
            </p>
            <a
              href="https://fr.trustpilot.com/review/www.naano.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] transition-colors duration-150 hover:text-white"
              style={LINK_STYLE}
            >
              <TrustpilotStar /> {f.trustpilot}
            </a>
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--lp-footer)', height: 80 }} />
    </footer>
  )
}
