import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLpNav, type LpNavVariant } from '@/data/nav'
import { useLocale } from '@/lib/locale'
import { LocaleButton } from '@/components/shared/LocaleButton'
import { Burger } from './icons'
import { BrandWordmark } from '@/components/shared/BrandWordmark'

const LINK_STYLE = { textDecoration: 'none', color: '#17181C', fontSize: 15, fontWeight: 500 } as const

/**
 * Fixed landing-page navigation (id="naano-nav").
 *
 * Observed behaviour on naano.com:
 *  - data-compact flips to "true" as soon as the page is scrolled (pill padding
 *    16px→10px, logo 30px→26px, with 0.32s ease-outs).
 *  - data-surface flips from "hero" (cloud-blue background) to "page" (frosted
 *    #fcfcfb at 82%, blur + soft shadow) once the hero has scrolled past.
 *  - "Resources" opens a popover on click; the burger toggles a frosted menu on
 *    viewports below 1024px.
 */
export function LpNav({
  variant,
  heroSelector = '[data-screen-label="Hero"]',
  mode = 'landing',
}: {
  variant: LpNavVariant
  heroSelector?: string
  /** `static`: the nav never compacts or changes surface (blog, selection, book…). */
  mode?: 'landing' | 'static'
}) {
  const { locale } = useLocale()
  const nav = getLpNav(variant, locale)
  const [compact, setCompact] = useState(false)
  const [surface, setSurface] = useState<'hero' | 'page'>('hero')
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const groupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode === 'static') return
    const onScroll = () => {
      const y = window.scrollY
      setCompact(y > 8)
      const hero = document.querySelector<HTMLElement>(heroSelector)
      if (hero) {
        const bottom = hero.getBoundingClientRect().bottom
        setSurface(bottom <= 72 ? 'page' : 'hero')
      } else {
        setSurface(y > 8 ? 'page' : 'hero')
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [heroSelector, mode])

  // Close the resources popover when clicking elsewhere / pressing Escape
  useEffect(() => {
    if (!resourcesOpen) return
    const onDown = (e: MouseEvent) => {
      if (!groupRef.current?.contains(e.target as Node)) setResourcesOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setResourcesOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [resourcesOpen])

  return (
    <div
      id="naano-nav"
      data-screen-label="Nav"
      data-surface={surface}
      data-compact={mode === 'static' ? undefined : compact ? 'true' : 'false'}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
    >
      <div style={{ zoom: 'var(--page-zoom, calc(100vw / 1672px))', width: 1672 } as React.CSSProperties}>
        <div id="naano-navpad" style={{ padding: 0, position: 'relative', fontFamily: 'var(--font-inter), -apple-system, sans-serif' }}>
          <div
            id="naano-nav-pill"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: compact ? '10px 56px' : '16px 56px',
              background: 'transparent',
              borderBottom: 0,
              boxShadow: 'none',
              transition: 'padding 0.32s cubic-bezier(.22,.61,.36,1), background-color 0.42s cubic-bezier(.22,.61,.36,1)',
            }}
          >
            <Link to={nav.logoHref} style={{ display: 'block' }}>
              <BrandWordmark id="naano-nav-logo" height={compact ? 26 : 30} style={{ transition: 'height 0.32s cubic-bezier(.22,.61,.36,1)' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32, marginRight: 22 }}>
                {nav.links.map((l) => (
                  <NavAnchor key={l.href} href={l.href} style={LINK_STYLE}>
                    {l.label}
                  </NavAnchor>
                ))}
                <div className="lp-nav-group" style={{ position: 'relative' }} ref={groupRef}>
                  <button
                    type="button"
                    className="lp-nav-group-trigger"
                    aria-expanded={resourcesOpen}
                    aria-haspopup="true"
                    onClick={() => setResourcesOpen((o) => !o)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: 0,
                      background: 'none',
                      border: 0,
                      cursor: 'pointer',
                      color: '#17181C',
                      fontSize: 15,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                    }}
                  >
                    {nav.resources.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: 'transform 0.15s ease', transform: resourcesOpen ? 'rotate(180deg)' : 'none' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {resourcesOpen && (
                    <div className="lp-nav-popover">
                      <div
                        className="lp-nav-popover-panel"
                        style={{
                          minWidth: 172,
                          background: '#fff',
                          border: '1px solid #E8E6E2',
                          borderRadius: 14,
                          boxShadow: '0 18px 40px rgba(17,18,28,0.1)',
                          overflow: 'hidden',
                          padding: 6,
                        }}
                      >
                        {nav.resources.items.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setResourcesOpen(false)}
                            className="lp-nav-popover-link"
                            style={{
                              display: 'block',
                              textDecoration: 'none',
                              color: '#17181C',
                              fontSize: 15,
                              fontWeight: 500,
                              padding: '10px 12px',
                              borderRadius: 9,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="lp-nav-burger"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  padding: 0,
                  background: '#FFFFFF',
                  border: '1px solid #E8E6E2',
                  borderRadius: 999,
                  cursor: 'pointer',
                  color: '#17181C',
                }}
              >
                {menuOpen ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                ) : (
                  <Burger />
                )}
              </button>
              <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center' }}>
                <LocaleButton />
              </div>
              <Link
                to={nav.signIn.href}
                style={{
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  color: '#17181C',
                  fontSize: 15,
                  fontWeight: 600,
                  background: '#FFFFFF',
                  border: '1px solid #E8E6E2',
                  borderRadius: 999,
                  padding: '10px 18px',
                }}
              >
                {nav.signIn.label}
              </Link>
              <NavAnchor
                href={nav.cta.href}
                style={{
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 600,
                  background: '#17181C',
                  borderRadius: 999,
                  padding: '11px 20px',
                }}
              >
                {nav.cta.label}
              </NavAnchor>
            </div>
          </div>
          <div className="lp-nav-menu" data-open={menuOpen ? 'true' : 'false'} style={{ display: 'none' }}>
            {[...nav.links, ...nav.mobileExtra].map((l) => (
              <NavAnchor
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', textDecoration: 'none', color: '#17181C', fontSize: 16, fontWeight: 500, padding: '13px 6px' }}
              >
                {l.label}
              </NavAnchor>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Router link that keeps in-page anchors (`/#faq`) working as plain anchors. */
export function NavAnchor({
  href,
  children,
  style,
  className,
  onClick,
}: {
  href: string
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}) {
  // Absolute links back to naano.com are same-site on the live site.
  href = href.replace(/^https?:\/\/(www\.)?naano\.com(?=\/|$)/, '') || '/'
  const isHash = href.includes('#')
  const isExternal = /^https?:/.test(href)
  if (isExternal) {
    return (
      <a href={href} style={style} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  if (isHash) {
    return (
      <a
        href={href}
        style={style}
        className={className}
        onClick={(e) => {
          onClick?.()
          const [path, hash] = href.split('#')
          if ((path === '' || path === window.location.pathname) && hash) {
            const el = document.getElementById(hash)
            if (el) {
              e.preventDefault()
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              history.replaceState(null, '', `#${hash}`)
            }
          }
        }}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={href} style={style} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
