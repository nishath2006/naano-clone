import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { NavAnchor } from '@/components/lp/LpNav'

const BASE = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2'

/** Rounded CTA buttons used across the Jakarta article/hub pages. */
export const PILL = {
  dark: `${BASE} bg-[#111827] text-white hover:bg-[#1F2937] focus-visible:ring-[#111827] focus-visible:ring-offset-2`,
  light: `${BASE} border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F3F4F6] focus-visible:ring-[#111827] focus-visible:ring-offset-2`,
  white: `${BASE} bg-white text-[#111827] hover:bg-white/90 focus-visible:ring-white/60`,
  whiteOffset: `${BASE} bg-white text-[#111827] hover:bg-white/90 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`,
  outline: `${BASE} border border-white/40 text-white hover:bg-white/10 focus-visible:ring-white/60`,
} as const

export type PillVariant = keyof typeof PILL

export function PillLink({
  href,
  variant,
  arrow = false,
  children,
  className,
}: {
  href: string
  variant: PillVariant
  arrow?: boolean
  children: ReactNode
  className?: string
}) {
  const cls = className ?? PILL[variant]
  const inner = (
    <>
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </>
  )
  if (href.includes('#') || /^https?:/.test(href)) {
    return (
      <NavAnchor href={href} className={cls}>
        {inner}
      </NavAnchor>
    )
  }
  return (
    <Link to={href} className={cls}>
      {inner}
    </Link>
  )
}
