import { useEffect, useState } from 'react'
import { NavAnchor } from '@/components/lp/LpNav'

export type TocItem = { id: string; text: string }

/**
 * Sticky "On this page" list (lg and up). The entry whose heading is highest
 * in the top 35% of the viewport is highlighted. Hidden below three entries,
 * as on the live site.
 */
export function TableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    if (items.length === 0) return
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e)
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -65% 0px', threshold: [0, 1] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  if (items.length < 3) return null

  return (
    <nav aria-label={label} className="hidden lg:block sticky top-24 self-start text-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] mb-4">{label}</p>
      <ul className="space-y-2.5 border-l border-[#E5E7EB]">
        {items.map((item) => {
          const on = item.id === active
          return (
            <li key={item.id}>
              <NavAnchor
                href={`#${item.id}`}
                className={`block -ml-px pl-4 py-0.5 border-l-2 transition-colors duration-150 motion-reduce:transition-none ${
                  on ? 'border-[#111827] text-[#111827] font-medium' : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {item.text}
              </NavAnchor>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
