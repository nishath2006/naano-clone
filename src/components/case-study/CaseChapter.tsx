import type { ReactNode } from 'react'

/**
 * Numbered two-column chapter ("01 The challenge" …) of a case-study page:
 * 300px label column + content column, revealed on scroll (`.rv`).
 */
export function CaseChapter({
  index,
  title,
  aside,
  children,
  contentStyle,
}: {
  index: string
  title: string
  /** optional paragraph under the title in the label column */
  aside?: ReactNode
  children: ReactNode
  contentStyle?: React.CSSProperties
}) {
  return (
    <section
      data-reveal=""
      className="rv"
      style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(56px, 10vw, 96px) clamp(20px, 5vw, 56px) 0' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', color: '#9B9DA3' }}>{index}</div>
          <h2 style={{ margin: '12px 0 0 0', fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', color: '#17181C' }}>{title}</h2>
          {aside}
        </div>
        <div style={{ maxWidth: 640, ...contentStyle }}>{children}</div>
      </div>
    </section>
  )
}

export const LEAD = {
  margin: 0,
  fontSize: 21,
  lineHeight: 1.6,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  color: '#26272C',
} as const

export const BODY = { fontSize: 18, lineHeight: 1.65, color: '#55575E' } as const

export function Strong({ children, weight = 700 }: { children: ReactNode; weight?: 600 | 700 }) {
  return <span style={{ fontWeight: weight, color: '#17181C' }}>{children}</span>
}
