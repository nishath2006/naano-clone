import { usePageZoom } from '@/hooks/usePageZoom'
import { LpNav } from './LpNav'
import type { LpNavVariant } from '@/data/nav'

/**
 * The landing-page navigation as used on Tailwind pages (blog, selection,
 * book, case study). The nav keeps its own zoomed 1672px wrapper, so
 * `--page-zoom` must be maintained even though the page body is fluid. On these
 * pages the live nav stays on its cloud-blue "hero" surface and never compacts.
 */
export function LpNavShell({ variant = 'home' }: { variant?: LpNavVariant }) {
  usePageZoom()
  return (
    <div className="naano-lp" style={{ overflow: 'visible' }}>
      <LpNav variant={variant} mode="static" />
    </div>
  )
}
