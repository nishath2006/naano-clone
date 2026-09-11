import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavAnchor } from '@/components/lp/LpNav'
import { LocaleButton } from '@/components/shared/LocaleButton'
import { useLocale } from '@/lib/locale'

const copy = {
  en: {
    links: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'FAQs', href: '/#faq' },
    ],
    resources: 'Resources',
    resourceItems: [
      { label: 'Blog', href: '/blog' },
      { label: 'Free Tools', href: '/free-tools' },
      { label: 'Reports', href: '/reports' },
      { label: 'Case study: BlogSEO', href: '/case-studies/blogseo' },
    ],
    about: 'About us',
    creator: "I'm a creator",
    signIn: 'Sign in',
    cta: 'Get started',
  },
  fr: {
    links: [
      { label: 'Comment ça marche', href: '/#how-it-works' },
      { label: 'Tarifs', href: '/#pricing' },
      { label: 'FAQ', href: '/#faq' },
    ],
    resources: 'Ressources',
    resourceItems: [
      { label: 'Blog', href: '/blog' },
      { label: 'Outils gratuits', href: '/free-tools' },
      { label: 'Rapports', href: '/reports' },
      { label: 'Étude de cas : BlogSEO', href: '/case-studies/blogseo' },
    ],
    about: 'À propos',
    creator: 'Je suis créateur',
    signIn: 'Se connecter',
    cta: 'Commencer',
  },
}

const LINK = 'text-[14px] font-medium text-[var(--lp-ink-soft)] hover:text-[var(--lp-ink)] transition-colors duration-150 whitespace-nowrap'

/**
 * Fixed, transparent navigation used by the Plus-Jakarta pages (about,
 * pricing, free tools, sector pages, reports…). Link groups fade in on mount;
 * "Resources" opens a small dropdown; below `md` a burger toggles a menu.
 */
export function SiteNav() {
  const { locale } = useLocale()
  const c = copy[locale]
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ddRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const fade = { opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease' } as const

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-6 pt-3 sm:pt-4 md:pt-6 transition-all duration-300 opacity-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto relative transition-all duration-200 px-0 py-0" style={{ fontFamily: 'var(--font-jakarta)' }}>
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="navbar-brand flex items-center gap-2 cursor-pointer transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]">
            <img src="/logo.svg" alt="naano" className="h-5 w-5 sm:h-6 sm:w-6 object-contain" />
            <span className="font-bold text-base sm:text-lg text-[var(--lp-ink)]">naano</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 lg:gap-8" style={fade}>
            {c.links.map((l) => (
              <NavAnchor key={l.href} href={l.href} className={LINK}>
                {l.label}
              </NavAnchor>
            ))}
            <div className="relative" ref={ddRef}>
              <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)} className={`flex items-center gap-1 ${LINK}`}>
                {c.resources}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
                </svg>
              </button>
              <div
                className="absolute left-0 top-full pt-3 z-10"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(-6px)',
                  transition: 'opacity 0.15s ease, transform 0.15s ease',
                  pointerEvents: open ? 'auto' : 'none',
                }}
              >
                <div className="min-w-[176px] bg-white border border-[var(--lp-border)] rounded-xl shadow-lg overflow-hidden">
                  {c.resourceItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-[14px] font-medium text-[var(--lp-ink-soft)] hover:text-[var(--lp-ink)] hover:bg-[var(--lp-surface-2)] transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/about" className={LINK}>
              {c.about}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3" style={fade}>
          <Link to="/creators" className="hidden md:inline-flex items-center gap-1 font-semibold text-[14px] text-[var(--lp-ink-soft)] hover:text-[var(--lp-ink)] transition-colors duration-150">
            {c.creator}
          </Link>
          <Link
            to="/login?reauth=1"
            className="hidden md:inline-flex items-center h-9 px-4 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--lp-brand)', fontFamily: 'var(--font-jakarta)' }}
          >
            {c.signIn}
          </Link>
          <LocaleButton />
          <Link
            to="/register"
            className="shrink-0 items-center justify-center gap-2 outline-none focus-visible:border-ring focus-visible:ring-[3px] hidden md:inline-flex h-8 rounded-full px-4 bg-[var(--lp-ink)] text-white text-[13px] font-medium hover:bg-[var(--lp-footer)] transition-colors duration-150 whitespace-nowrap"
          >
            {c.cta}
          </Link>
          <button
            type="button"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--lp-surface-3)] transition-colors cursor-pointer text-[var(--lp-ink)]"
          >
            {menu ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {menu && (
        <div
          className="md:hidden mt-2 bg-white border border-[var(--lp-border)] rounded-2xl shadow-lg overflow-hidden"
          style={{ fontFamily: 'var(--font-jakarta)', animation: 'siteMenuIn 0.2s ease both' }}
        >
          {[...c.links, ...c.resourceItems, { label: c.about, href: '/about' }].map((l) => (
            <NavAnchor
              key={l.href + l.label}
              href={l.href}
              onClick={() => setMenu(false)}
              className="block px-5 py-3.5 font-medium text-[15px] text-[var(--lp-ink-soft)] hover:text-[var(--lp-ink)] hover:bg-[var(--lp-surface-2)] transition-colors border-b border-[var(--lp-border)]"
            >
              {l.label}
            </NavAnchor>
          ))}
          <Link to="/creators" onClick={() => setMenu(false)} className="block px-5 py-3.5 font-semibold text-[15px] text-[var(--lp-ink)] hover:bg-[var(--lp-surface-2)] transition-colors">
            {c.creator}
          </Link>
          <div className="p-4 pt-1 flex flex-col gap-2">
            <Link
              to="/login?reauth=1"
              onClick={() => setMenu(false)}
              className="inline-flex items-center justify-center h-11 rounded-xl text-[14px] font-semibold text-white"
              style={{ background: 'var(--lp-brand)' }}
            >
              {c.signIn}
            </Link>
            <Link
              to="/register"
              onClick={() => setMenu(false)}
              className="inline-flex items-center justify-center h-11 rounded-xl text-[14px] font-semibold text-white bg-[var(--lp-ink)]"
            >
              {c.cta}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
