import { useEffect, type RefObject } from 'react'

/**
 * Animates `[data-cu]` numbers (e.g. "2,940", "30K+", "€500", "24h") from 0 to
 * their final value the first time they scroll into view, keeping prefix,
 * suffix and thousands separators intact.
 */
export function useCountUp(ref: RefObject<HTMLElement | null>, duration = 1100, deps: unknown[] = []) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-cu]'))
    if (nodes.length === 0) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const run = (el: HTMLElement) => {
      const final = el.textContent ?? ''
      const m = final.match(/^([^\d]*)([\d.,]+)(.*)$/)
      if (!m || reduce) return
      const [, prefix, numStr, suffix] = m
      const hasComma = numStr.includes(',')
      const decimals = (numStr.split('.')[1] ?? '').length
      const target = parseFloat(numStr.replace(/,/g, ''))
      if (!isFinite(target)) return
      const start = performance.now()
      const fmt = (v: number) => {
        const fixed = v.toFixed(decimals)
        return hasComma ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: decimals }) : fixed
      }
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = `${prefix}${fmt(target * eased)}${suffix}`
        if (p < 1) requestAnimationFrame(tick)
        else el.textContent = final
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run(e.target as HTMLElement)
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.4 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, duration, ...deps])
}
