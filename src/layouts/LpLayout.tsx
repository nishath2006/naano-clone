import { useEffect, type ReactNode } from 'react'
import { LpNav } from '@/components/lp/LpNav'
import { LpFooter } from '@/components/lp/LpFooter'
import { usePageZoom } from '@/hooks/usePageZoom'
import type { LpNavVariant } from '@/data/nav'

/**
 * Shell for the fixed-canvas landing pages (/, /creators, /agencies):
 * grain overlay, fixed nav, the 1672px zoomed canvas and the cloud footer.
 */
export function LpLayout({
  variant,
  children,
  title,
  description,
  mainClassName,
  footer = true,
}: {
  variant: LpNavVariant
  children: ReactNode
  title: string
  description?: string
  mainClassName?: string
  footer?: boolean
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
              {footer && <LpFooter variant={variant} />}
            </div>
          </div>
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
