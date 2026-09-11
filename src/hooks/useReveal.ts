import { useEffect, type RefObject } from 'react'

/**
 * Scroll-reveal used by the landing pages (`.rv` → `.rv.rv-in`) and by the
 * Jakarta pages (`.fade-up` → `.is-visible`). Elements are revealed once,
 * when ~12% of them enters the viewport.
 */
export function useRevealOnScroll(
  ref: RefObject<HTMLElement | null>,
  options: { selector?: string; className?: string; threshold?: number; deps?: unknown[] } = {},
) {
  const { selector = '.rv', className = 'rv-in', threshold = 0.12, deps = [] } = options
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (root.matches(selector)) nodes.unshift(root)
    if (nodes.length === 0) return
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add(className))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add(className)
            io.unobserve(e.target)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, selector, className, threshold, ...deps])
}
