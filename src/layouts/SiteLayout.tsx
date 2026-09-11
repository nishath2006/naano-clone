import { useEffect, useRef, type ReactNode } from 'react'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'
import { useDocumentMeta } from './LpLayout'
import { useRevealOnScroll } from '@/hooks/useReveal'

/**
 * Shell for the Plus-Jakarta pages: grain overlay, fixed transparent nav,
 * white main, dark footer. `.fade-up` blocks reveal on scroll.
 */
export function SiteLayout({
  children,
  title,
  description,
  className = 'min-h-screen bg-white',
  footer = true,
  nav = <SiteNav />,
  deps = [],
}: {
  children: ReactNode
  title: string
  description?: string
  className?: string
  footer?: boolean
  nav?: ReactNode
  deps?: unknown[]
}) {
  useDocumentMeta(title, description)
  const ref = useRef<HTMLElement>(null)
  useRevealOnScroll(ref, { selector: '.fade-up', className: 'is-visible', deps })

  useEffect(() => {
    document.documentElement.style.background = '#fff'
    return () => {
      document.documentElement.style.background = ''
    }
  }, [])

  return (
    <>
      <div className="bg-noise" />
      <main ref={ref} className={className} style={{ fontFamily: 'var(--font-jakarta)' }}>
        {nav}
        {children}
        {footer && <SiteFooter />}
      </main>
    </>
  )
}
