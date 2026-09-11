import { useEffect, type ReactNode } from 'react'
import { LpNav } from '@/components/lp/LpNav'
import { LpFooter } from '@/components/lp/LpFooter'
import { usePageZoom } from '@/hooks/usePageZoom'
import type { LpNavVariant } from '@/data/nav'

/**
 * Shell for the landing pages (/, /creators, /agencies).
 *
 * `children` are laid out on the fixed 1672px canvas and scaled with CSS zoom
 * (`#naano-scale`). `fluid` content is rendered *after* the canvas at 1:1 —
 * this is how naano.com renders the lower half of the homepage (testimonials,
 * results, pricing, FAQ, book-a-call and footer), whose CSS uses clamp()/vw
 * sizing instead of the zoom factor.
 */
export function LpLayout({
  variant,
  children,
  fluid,
  title,
  description,
  mainClassName,
  footer = 'scaled',
}: {
  variant: LpNavVariant
  children: ReactNode
  fluid?: ReactNode
  title: string
  description?: string
  mainClassName?: string
  footer?: 'scaled' | 'fluid' | 'none'
}) {
  usePageZoom()
  useDocumentMeta(title, description)

  return (
    <>
      <div className="bg-noise" />
      <main className={`naano-lp ${mainClassName ?? ''}`} style={{ background: '#FCFCFB', minHeight: '100vh' }}>
        <LpNav variant={variant} />
        <div style={{ overflowX: 'clip', background: '#FCFCFB' }}>
          <div id="naano-scale" style={{ zoom: 'var(--page-zoom, calc(100vw / 1672px))', width: 1672 } as React.CSSProperties}>
            <div
              className="lp-canvas"
              style={{
                fontFamily: 'var(--font-inter), -apple-system, sans-serif',
                background: '#FCFCFB',
                width: 1672,
                color: '#17181C',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {children}
              {footer === 'scaled' && <LpFooter variant={variant} />}
            </div>
          </div>
          {fluid}
          {footer === 'fluid' && <LpFooter variant={variant} />}
        </div>
      </main>
    </>
  )
}

export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    if (description) {
      let el = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!el) {
        el = document.createElement('meta')
        el.name = 'description'
        document.head.appendChild(el)
      }
      el.content = description
    }
  }, [title, description])
}
