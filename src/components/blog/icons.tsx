/** Lucide icons as they appear inline on the blog pages (24px viewBox, stroke currentColor). */

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function ClockIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg {...base} className={`lucide lucide-clock ${className}`}>
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export function CalendarDaysIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg {...base} className={`lucide lucide-calendar-days ${className}`}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg {...base} className={`lucide lucide-arrow-right ${className}`}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export function LinkedinIcon({ className = 'w-2.5 h-2.5 text-white' }: { className?: string }) {
  return (
    <svg {...base} className={`lucide lucide-linkedin ${className}`}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
