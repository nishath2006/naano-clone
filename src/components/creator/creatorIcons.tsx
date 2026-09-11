/** Lucide icons inlined exactly as the creator profile page renders them. */

type Props = { size?: number; strokeWidth?: number }

const base = (size: number, strokeWidth: number, name: string) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: `lucide lucide-${name}`,
  'aria-hidden': true,
})

export function MapPin({ size = 13, strokeWidth = 2.2 }: Props) {
  return (
    <svg {...base(size, strokeWidth, 'map-pin')}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function Heart({ size = 13, strokeWidth = 2 }: Props) {
  return (
    <svg {...base(size, strokeWidth, 'heart')}>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  )
}

export function MessageCircle({ size = 13, strokeWidth = 2 }: Props) {
  return (
    <svg {...base(size, strokeWidth, 'message-circle')}>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
    </svg>
  )
}

export function ArrowUpRight({ size = 15, strokeWidth = 2.2 }: Props) {
  return (
    <svg {...base(size, strokeWidth, 'arrow-up-right')}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}

export function Check({ size = 13, strokeWidth = 2.6 }: Props) {
  return (
    <svg {...base(size, strokeWidth, 'check')}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function Tag({ size = 13, strokeWidth = 2.2 }: Props) {
  return (
    <svg {...base(size, strokeWidth, 'tag')}>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  )
}

export function MousePointerClick({ size = 13, strokeWidth = 2.2 }: Props) {
  return (
    <svg {...base(size, strokeWidth, 'mouse-pointer-click')}>
      <path d="M14 4.1 12 6" />
      <path d="m5.1 8-2.9-.8" />
      <path d="m6 12-1.9 2" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
    </svg>
  )
}
