import type { ReactNode } from 'react'

/**
 * Small uppercase section label used across the Jakarta pages.
 * `tone="brand"` renders the inline `color:#7C5CFC` the site uses; `muted`
 * uses the `text-muted-foreground` utility instead.
 */
export function Eyebrow({
  children,
  tone = 'brand',
  tracking = '0.14em',
  className = 'mb-5',
}: {
  children: ReactNode
  tone?: 'brand' | 'muted'
  tracking?: '0.14em' | '0.12em'
  className?: string
}) {
  const track = tracking === '0.14em' ? 'tracking-[0.14em]' : 'tracking-[0.12em]'
  if (tone === 'muted') {
    return <p className={`text-xs font-semibold uppercase ${track} ${className} text-muted-foreground`}>{children}</p>
  }
  return (
    <p className={`text-xs font-semibold uppercase ${track} ${className}`} style={{ color: '#7C5CFC' }}>
      {children}
    </p>
  )
}
