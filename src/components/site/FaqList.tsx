import type { ReactNode } from 'react'

export type FaqItem = { q: string; a: ReactNode }

/**
 * Static question/answer list. `article` matches the thin-heading style of the
 * report pages; `hub` matches the bold style of the reports/marketplace hubs.
 */
export function FaqList({ items, variant = 'article' }: { items: FaqItem[]; variant?: 'article' | 'hub' }) {
  if (variant === 'hub') {
    return (
      <div className="mt-10 space-y-8">
        {items.map((f) => (
          <div key={f.q}>
            <h3 className="text-lg font-bold text-[#111827]">{f.q}</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-[#4B5563]">{f.a}</p>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="my-8 space-y-8">
      {items.map((f) => (
        <div key={f.q}>
          <h3 className="text-[clamp(18px,2vw,22px)] font-medium tracking-[-0.01em] text-[#111827] mb-3">{f.q}</h3>
          <p className="text-[#374151] leading-[1.7]">{f.a}</p>
        </div>
      ))}
    </div>
  )
}
