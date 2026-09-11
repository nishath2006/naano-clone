import type { ReactNode } from 'react'

const BASE = 'text-[clamp(22px,2.6vw,30px)] font-light tracking-[-0.02em] text-[#111827] mt-16 mb-5 pt-4 border-t border-[#F3F4F6]'

/** Thin, top-ruled section heading used in the long-form article pages. */
export function ArticleH2({
  id,
  children,
  className = '',
  scrollMargin = true,
}: {
  id?: string
  children: ReactNode
  className?: string
  scrollMargin?: boolean
}) {
  const cls = `${scrollMargin ? 'scroll-mt-28 ' : ''}${BASE}${className ? ` ${className}` : ''}`
  return (
    <h2 id={id} className={cls}>
      {children}
    </h2>
  )
}
