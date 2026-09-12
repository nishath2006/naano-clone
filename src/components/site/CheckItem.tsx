import type { ReactNode } from 'react'
import { LucideCheck } from './icons'

/**
 * `flex items-start gap-3` row with a lucide check and a text span, as used in
 * the about page lists and the pricing "Both plans include" card.
 */
export function CheckItem({
  children,
  iconSize = 15,
  iconTone = 'brand',
  textClassName = 'text-sm text-muted-foreground leading-relaxed',
}: {
  children: ReactNode
  iconSize?: 15 | 16
  iconTone?: 'brand' | 'foreground'
  textClassName?: string
}) {
  return (
    <div className="flex items-start gap-3">
      {iconTone === 'foreground' ? (
        <LucideCheck size={iconSize} className="mt-0.5 flex-shrink-0 text-foreground" />
      ) : (
        <LucideCheck size={iconSize} className="mt-0.5 flex-shrink-0" style={{ color: '#7C5CFC' }} />
      )}
      <span className={textClassName}>{children}</span>
    </div>
  )
}

/** White bordered card with a muted uppercase label on top. */
export function LabeledCard({
  label,
  children,
  className = 'p-6',
  fadeUp = false,
}: {
  label: string
  children: ReactNode
  className?: string
  fadeUp?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E5E7EB] ${className}${fadeUp ? ' fade-up' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-5">{label}</p>
      {children}
    </div>
  )
}
