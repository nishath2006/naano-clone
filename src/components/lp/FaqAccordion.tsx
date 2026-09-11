import { useState } from 'react'
import type { Faq } from '@/data/faq'
import { ChevronDown, ChevronUp } from './icons'

/**
 * Single-open accordion used by the landing-page FAQ blocks. The first item
 * starts open; clicking an open item closes it (observed on naano.com).
 */
export function FaqAccordion({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  return (
    <>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} style={{ borderTop: '1px solid #ECEAE6' }}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                padding: '30px 0',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 500, color: '#17181C', letterSpacing: '-0.015em' }}>{item.q}</span>
              <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </span>
            </button>
            {isOpen && (
              <p style={{ margin: 0, padding: '0 60px 32px 0', fontSize: 16.5, lineHeight: 1.65, color: '#6B6D74', maxWidth: 680 }}>{item.a}</p>
            )}
          </div>
        )
      })}
      <div style={{ borderTop: '1px solid #ECEAE6' }} />
    </>
  )
}
