/**
 * Inline icons used by the fluid landing-style pages (/book, /case-studies).
 * Sizes and stroke widths match the captured markup exactly.
 */
const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function ArrowLeft({ size = 15, strokeWidth = 2.2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg {...stroke} width={size} height={size} stroke="currentColor" strokeWidth={strokeWidth}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

/** Arrow whose shaft spans 4→20 (nav pills, dark CTA). */
export function ArrowRightLong({ size = 15, strokeWidth = 2.2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg {...stroke} width={size} height={size} stroke="currentColor" strokeWidth={strokeWidth}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  )
}

/** Arrow whose shaft spans 5→19 (inline text links). */
export function ArrowRightShort({ size = 13, strokeWidth = 2.3 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg {...stroke} width={size} height={size} stroke="currentColor" strokeWidth={strokeWidth}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function AccentCheck({ size = 12 }: { size?: number }) {
  return (
    <svg {...stroke} width={size} height={size} stroke="var(--accent)" strokeWidth={3}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function Clock({ size = 13 }: { size?: number }) {
  return (
    <svg {...stroke} width={size} height={size} stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  )
}

export function VideoCamera({ size = 13 }: { size?: number }) {
  return (
    <svg {...stroke} width={size} height={size} stroke="currentColor" strokeWidth={2}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

export function LinkedInFilled({ size = 16, fill = '#FFFFFF' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
  )
}

export function LinkedInSquare({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" style={{ flexShrink: 0 }}>
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#FFFFFF"
        d="M7.2 9.6H4.8V19h2.4V9.6ZM6 5.2a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8ZM19.2 19h-2.4v-4.9c0-1.2-.5-1.9-1.5-1.9-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8V19H11.3s.03-8.6 0-9.4h2.4v1.3c.3-.5.9-1.2 2.2-1.2 1.6 0 2.9 1 2.9 3.3V19Z"
      />
    </svg>
  )
}

export function PlayAccent({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--accent)">
      <path d="M8 5.5 L19 12 L8 18.5 Z" />
    </svg>
  )
}
