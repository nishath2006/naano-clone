import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base(size: number, strokeWidth: number, className: string | undefined, name: string) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `lucide lucide-${name}${className ? ` ${className}` : ''}`,
    'aria-hidden': true,
  }
}

/** lucide `sparkles` (hero badge, "All free tools" card, "More tools coming"). */
export function SparklesIcon({ size = 14, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2, className, 'sparkles')} {...rest}>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </svg>
  )
}

/** lucide `user-search` (free creator search card). */
export function UserSearchIcon({ size = 22, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2, className, 'user-search')} {...rest}>
      <circle cx="10" cy="7" r="4" />
      <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
      <circle cx="17" cy="17" r="3" />
      <path d="m21 21-1.9-1.9" />
    </svg>
  )
}

/** lucide `calculator` (creator worth calculator). */
export function CalculatorIcon({ size = 22, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2, className, 'calculator')} {...rest}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}

/** lucide `trending-up` (engagement rate calculator). */
export function TrendingUpIcon({ size = 22, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2, className, 'trending-up')} {...rest}>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </svg>
  )
}

/** lucide `target` (delivery odds estimator). */
export function TargetIcon({ size = 22, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2, className, 'target')} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

/** lucide `chart-pie` (campaign budget planner). */
export function ChartPieIcon({ size = 22, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2, className, 'chart-pie')} {...rest}>
      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    </svg>
  )
}

/** lucide `arrow-right` (card links, CTA buttons). */
export function ArrowRightIcon({ size = 15, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2.2, className, 'arrow-right')} {...rest}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

/** lucide `arrow-left` (back to /free-tools pill). */
export function ArrowLeftIcon({ size = 14, className, ...rest }: IconProps) {
  return (
    <svg {...base(size, 2.2, className, 'arrow-left')} {...rest}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

export type ToolIconName = 'sparkles' | 'user-search' | 'calculator' | 'trending-up' | 'target' | 'chart-pie'

export function ToolIcon({ name, size }: { name: ToolIconName; size: number }) {
  switch (name) {
    case 'sparkles':
      return <SparklesIcon size={size} />
    case 'user-search':
      return <UserSearchIcon size={size} />
    case 'calculator':
      return <CalculatorIcon size={size} />
    case 'trending-up':
      return <TrendingUpIcon size={size} />
    case 'target':
      return <TargetIcon size={size} />
    case 'chart-pie':
      return <ChartPieIcon size={size} />
  }
}
