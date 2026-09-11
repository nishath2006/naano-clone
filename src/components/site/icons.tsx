import type { CSSProperties } from 'react'

type LucideProps = {
  size?: number
  strokeWidth?: number
  className?: string
  style?: CSSProperties
}

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** lucide `check` as rendered on the Jakarta pages (about, pricing…). */
export function LucideCheck({ size = 15, strokeWidth = 2.5, className = '', style }: LucideProps) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={strokeWidth} className={`lucide lucide-check ${className}`.trim()} style={style}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

/** lucide `arrow-right`. */
export function LucideArrowRight({ size = 16, strokeWidth = 2, className = '', style }: LucideProps) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={strokeWidth} className={`lucide lucide-arrow-right ${className}`.trim()} style={style}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

/** lucide `linkedin` (outline). */
export function LucideLinkedIn({ size = 24, strokeWidth = 2, className = '', style }: LucideProps) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={strokeWidth} className={`lucide lucide-linkedin ${className}`.trim()} style={style}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

/** lucide `mail`. */
export function LucideMail({ size = 24, strokeWidth = 2, className = '', style }: LucideProps) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={strokeWidth} className={`lucide lucide-mail ${className}`.trim()} style={style}>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  )
}
