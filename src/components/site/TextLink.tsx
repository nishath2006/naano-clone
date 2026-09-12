import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { NavAnchor } from '@/components/lp/LpNav'

/** Inline link inside long-form article copy (benchmarks, sector pages, rankings). */
export const LINK_ARTICLE =
  'text-[#7C5CFC] underline underline-offset-4 decoration-[#7C5CFC]/30 hover:decoration-[#7C5CFC] transition-colors duration-150 motion-reduce:transition-none'
/** Inline link inside the hub-style pages (reports, creator marketplace). */
export const LINK_HUB =
  'font-semibold text-[#7C5CFC] underline underline-offset-2 hover:text-[#1240C4] transition-colors duration-150 motion-reduce:transition-none'

/** Router-aware anchor: internal paths use <Link>, hashes/external use NavAnchor. */
export function TextLink({
  href,
  children,
  className = LINK_ARTICLE,
  hrefLang,
}: {
  href: string
  children: ReactNode
  className?: string
  hrefLang?: string
}) {
  if (href.includes('#') || /^https?:/.test(href)) {
    return (
      <NavAnchor href={href} className={className}>
        {children}
      </NavAnchor>
    )
  }
  return (
    <Link to={href} className={className} hrefLang={hrefLang}>
      {children}
    </Link>
  )
}

/** A run of inline copy: plain strings, links, strong/em/code spans. */
export type Seg = string | { t: string; href?: string; strong?: boolean; em?: boolean; code?: boolean }

const CODE = 'bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[0.92em] text-[#111827] border border-[#E5E7EB]'

export function Rich({
  segs,
  linkClass = LINK_ARTICLE,
  strongClass = 'text-[#111827] font-medium',
}: {
  segs: Seg[]
  linkClass?: string
  strongClass?: string
}) {
  return (
    <>
      {segs.map((s, i) => {
        if (typeof s === 'string') return <Fragment key={i}>{s}</Fragment>
        if (s.href)
          return (
            <TextLink key={i} href={s.href} className={linkClass}>
              {s.t}
            </TextLink>
          )
        if (s.strong)
          return (
            <strong key={i} className={strongClass}>
              {s.t}
            </strong>
          )
        if (s.em) return <em key={i}>{s.t}</em>
        if (s.code)
          return (
            <code key={i} className={CODE}>
              {s.t}
            </code>
          )
        return <Fragment key={i}>{s.t}</Fragment>
      })}
    </>
  )
}
