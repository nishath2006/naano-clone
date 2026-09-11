import { useEffect, useState } from 'react'

type TocItem = { id: string; text: string }

const LINK = 'block -ml-px pl-4 py-0.5 border-l-2 transition-colors duration-150 motion-reduce:transition-none'
const ACTIVE = 'border-[#111827] text-[#111827] font-medium'
const IDLE = 'border-transparent text-[#6B7280] hover:text-[#111827]'

/** Top offset under which a heading counts as "current" (sticky nav + scroll-mt-28). */
const TOP_OFFSET = 112

/**
 * Sticky "On this page" navigation. The active entry follows the heading
 * currently in view (IntersectionObserver on the body's `h2[id]`/`h3[id]`).
 */
export function TableOfContents({ label, items }: { label: string; items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    setActive(items[0]?.id ?? '')
    const headings = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0 || !('IntersectionObserver' in window)) return

    const pick = () => {
      // Last heading whose top has passed the offset line; falls back to the first one.
      let current = headings[0]
      for (const h of headings) {
        if (h.getBoundingClientRect().top - TOP_OFFSET <= 0) current = h
        else break
      }
      setActive(current.id)
    }
    const io = new IntersectionObserver(pick, { rootMargin: `-${TOP_OFFSET}px 0px -55% 0px`, threshold: [0, 1] })
    headings.forEach((h) => io.observe(h))
    window.addEventListener('scroll', pick, { passive: true })
    pick()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', pick)
    }
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label={label} className="hidden lg:block sticky top-24 self-start text-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] mb-4">{label}</p>
      <ul className="space-y-2.5 border-l border-[#E5E7EB]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`${LINK} ${active === item.id ? ACTIVE : IDLE}`}
              onClick={(e) => {
                const el = document.getElementById(item.id)
                if (!el) return
                e.preventDefault()
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                history.replaceState(null, '', `#${item.id}`)
                setActive(item.id)
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
