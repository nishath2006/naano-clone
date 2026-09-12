import type { CSSProperties } from 'react'

/**
 * NaanoX wordmark: the logomark (public/logo.svg) followed by the name set in
 * Inter 800. Replaces the captured naano-logo-nav.png so the brand text can be
 * rendered rather than baked into a bitmap. `height` matches the image height
 * the previous <img> used, so surrounding layout does not move.
 */
export function BrandWordmark({
  height = 28,
  inverted = false,
  className,
  style,
  id,
}: {
  height?: number
  /** white-on-dark variant */
  inverted?: boolean
  className?: string
  style?: CSSProperties
  id?: string
}) {
  const color = inverted ? '#FFFFFF' : '#0E0F12'
  return (
    <span
      id={id}
      className={className}
      aria-label="NaanoX"
      role="img"
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(height * 0.22), height, lineHeight: 1, whiteSpace: 'nowrap', ...style }}
    >
      <img src="/logo.svg" alt="" style={{ height, width: 'auto', display: 'block', filter: inverted ? 'brightness(0) invert(1)' : undefined }} />
      <span
        style={{
          fontFamily: "'Inter', 'Inter Fallback', -apple-system, sans-serif",
          fontWeight: 800,
          fontSize: Math.round(height * 0.92),
          letterSpacing: '-0.045em',
          color,
          transform: 'translateY(-4%)',
        }}
      >
        naano
        <span style={{ color: inverted ? '#DDD4FF' : '#7C5CFC' }}>X</span>
      </span>
    </span>
  )
}
