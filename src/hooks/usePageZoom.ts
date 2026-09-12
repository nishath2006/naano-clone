import { useEffect } from 'react'

export const LP_CANVAS_WIDTH = 1672

/**
 * The landing pages are laid out on a fixed 1672px canvas that is scaled with
 * CSS `zoom` to the viewport width. The live site publishes the ratio on the
 * root element as `--page-zoom` and the scaled viewport height as `--hero-h`.
 */
export function usePageZoom(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    const apply = () => {
      const vw = window.innerWidth
      const zoom = vw / LP_CANVAS_WIDTH
      root.style.setProperty('--page-zoom', String(zoom))
      root.style.setProperty('--hero-h', `${Math.round(window.innerHeight / zoom)}px`)
      root.style.setProperty('--accent', '#7C5CFC')
      root.style.background = '#FCFCFB'
    }
    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      root.style.removeProperty('--page-zoom')
      root.style.removeProperty('--hero-h')
      root.style.removeProperty('--accent')
      root.style.background = ''
    }
  }, [enabled])
}
