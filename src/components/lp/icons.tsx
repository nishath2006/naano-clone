import type { CSSProperties } from 'react'

type IconProps = { size?: number; stroke?: string; strokeWidth?: number; style?: CSSProperties; className?: string }

/** Right arrow (line + chevron) used on primary CTAs. */
export function ArrowRight({ size = 17, stroke = 'currentColor', strokeWidth = 2.2, style, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  )
}

/** Compact arrow (5→19) used in chips and small links. */
export function ArrowRightSmall({ size = 11, strokeWidth = 2.6, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function ArrowUpRight({ size = 13, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d="M7 17 L17 7" />
      <path d="M8 7 H17 V16" />
    </svg>
  )
}

export function Check({ size = 10, strokeWidth = 3.2, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <polyline points="5 12.5 10 17.5 19 7" />
    </svg>
  )
}

export function ChevronDown({ size = 18, stroke = '#9B9DA3', strokeWidth = 1.8, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function ChevronUp({ size = 18, stroke = 'var(--nn-ink, #111318)', strokeWidth = 1.8, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <polyline points="6 15 12 9 18 15" />
    </svg>
  )
}

export function ShieldCheck({ size = 20, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
      <path d="M9 12 L11 14 L15 9.5" />
    </svg>
  )
}

export function ShieldCheckSmall({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9B9DA3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 l7 3 v5 c0 4.4 -3 7.5 -7 9 c-4 -1.5 -7 -4.6 -7 -9 V6 Z" />
      <polyline points="9 12 11.2 14.2 15.5 9.6" />
    </svg>
  )
}

export function XLogo({ size = 15, fill = '#17181C' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function LinkedInLogo({ size = 18, fill = '#0A66C2' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/** Rounded-square LinkedIn badge used next to avatars. */
export function LinkedInBadge({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" style={{ flexShrink: 0 }} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#FFFFFF"
        d="M7.2 9.6H4.8V19h2.4V9.6ZM6 5.2a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8ZM19.2 19h-2.4v-4.9c0-1.2-.5-1.9-1.5-1.9-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8V19H11.3s.03-8.6 0-9.4h2.4v1.3c.3-.5.9-1.2 2.2-1.2 1.6 0 2.9 1 2.9 3.3V19Z"
      />
    </svg>
  )
}

export function Lock({ size = 12 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function Play({ size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--nn-ink, #111318)" aria-hidden="true">
      <path d="M8 5.5 L19 12 L8 18.5 Z" />
    </svg>
  )
}

export function Burger() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function Dots() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#B4B6BC" aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  )
}

export function Eye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B9DA3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12 S5 5 12 5 s10 7 10 7 -3 7 -10 7 -10 -7 -10 -7Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

export function Cursor() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B9DA3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 3 L19 11 L12.5 12.5 L16 20 L13 21 L9.5 13.5 L5 17 Z" />
    </svg>
  )
}

export function People() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B9DA3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20 c0 -3.4 2.7 -5.8 6 -5.8 s6 2.4 6 5.8" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 14 c2.6 0.2 5 2.2 5 5.2" />
    </svg>
  )
}

export function BlogSeoMark() {
  return (
    <svg width="30" height="24" viewBox="0 0 40 32" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <rect x="3" y="3" width="27" height="19" rx="6" fill="none" stroke="#2B9BF9" strokeWidth="3.4" />
      <circle cx="25" cy="21" r="6.2" fill="none" stroke="#2B9BF9" strokeWidth="3.4" />
      <line x1="29.6" y1="25.6" x2="34.5" y2="30.5" stroke="#2B9BF9" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

export function TrustpilotStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#00B67A" aria-hidden="true">
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.5l7.1-.6z" />
    </svg>
  )
}

export function Star({ size = 18, fill = '#F5A623' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.5l7.1-.6z" />
    </svg>
  )
}

/* Flags used by the "Across 100 countries" card */
export const Flags = {
  fr: (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="#1a47b8" d="M0 0h10v20H0z" />
      <path fill="#fff" d="M10 0h10v20H10z" />
      <path fill="#f1333f" d="M20 0h10v20H20z" />
    </svg>
  ),
  us: (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="#fff" d="M0 0h30v20H0z" />
      {[0, 3, 6, 9, 12, 15, 18].map((y) => (
        <path key={y} fill="#b22234" d={`M0 ${y}h30v1.55H0z`} />
      ))}
      <path fill="#3c3b6e" d="M0 0h13v10.8H0z" />
      <g fill="#fff">
        {[2, 5, 8, 11].flatMap((x) => [2, 5, 8].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r=".65" />))}
      </g>
    </svg>
  ),
  de: (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="#111" d="M0 0h30v6.67H0z" />
      <path fill="#d00" d="M0 6.67h30v6.67H0z" />
      <path fill="#ffce00" d="M0 13.34h30V20H0z" />
    </svg>
  ),
  gb: (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="#012169" d="M0 0h30v20H0z" />
      <path stroke="#fff" strokeWidth="5" d="m0 0 30 20M30 0 0 20" />
      <path stroke="#c8102e" strokeWidth="2" d="m0 0 30 20M30 0 0 20" />
      <path fill="#fff" d="M12 0h6v20h-6zM0 7h30v6H0z" />
      <path fill="#c8102e" d="M13.5 0h3v20h-3zM0 8.5h30v3H0z" />
    </svg>
  ),
  es: (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="#aa151b" d="M0 0h30v20H0z" />
      <path fill="#f1bf00" d="M0 5h30v10H0z" />
    </svg>
  ),
  ca: (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="#d80621" d="M0 0h7v20H0zm23 0h7v20h-7z" />
      <path fill="#fff" d="M7 0h16v20H7z" />
      <path fill="#d80621" d="m15 3 1.2 3 2.4-1.1-.8 3 2 .8-3.1 2.4.6 3.1-2.3-1.4-2.3 1.4.6-3.1-3.1-2.4 2-.8-.8-3 2.4 1.1z" />
    </svg>
  ),
  nl: (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="#ae1c28" d="M0 0h30v6.67H0z" />
      <path fill="#fff" d="M0 6.67h30v6.67H0z" />
      <path fill="#21468b" d="M0 13.34h30V20H0z" />
    </svg>
  ),
}
