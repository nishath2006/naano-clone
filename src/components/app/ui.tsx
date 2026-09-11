import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { Link } from 'react-router-dom'
import { initials, statusTone } from '@/lib/format'
import { LoaderIcon } from '@/components/auth/AuthShell'
import { XIcon } from './icons'

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
  back,
}: {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  back?: { to: string; label: string }
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link to={back.to} className="inline-flex items-center gap-1 text-xs font-medium text-[#6B7280] hover:text-[#111827] mb-2">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#111827]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#6B7280] max-w-2xl">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function Card({ children, className = '', padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={`rounded-2xl bg-white border border-[#E9EBF0] shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${padded ? 'p-5' : ''} ${className}`}>{children}</div>
}

export function StatCard({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'blue' }) {
  return (
    <Card className="min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">{label}</div>
      <div className={`mt-1 text-2xl font-bold tracking-tight ${tone === 'blue' ? 'text-[#2563eb]' : 'text-[#111827]'}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-[#9CA3AF]">{hint}</div>}
    </Card>
  )
}

export function Badge({ status, children, tone }: { status?: string; children: ReactNode; tone?: ReturnType<typeof statusTone> }) {
  const t = tone ?? (status ? statusTone(status) : 'gray')
  const cls = {
    green: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    amber: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    red: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    gray: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
  }[t]
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${cls}`}>{children}</span>
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-medium text-[#4B5563]">{children}</span>
}

export function Avatar({ src, name, size = 40, className = '' }: { src?: string | null; name?: string | null; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [src])
  if (src && !broken) {
    return <img src={src} alt="" width={size} height={size} onError={() => setBroken(true)} className={`rounded-full object-cover bg-[#E5E7EB] shrink-0 ${className}`} style={{ width: size, height: size }} />
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#DBEAFE] text-[#1D4ED8] font-semibold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.38) }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}

export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white px-6 py-12 text-center">
      {icon && <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563eb]">{icon}</div>}
      <div className="text-sm font-semibold text-[#111827]">{title}</div>
      {body && <p className="mx-auto mt-1 max-w-sm text-sm text-[#6B7280]">{body}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

export function ErrorBanner({ children, onRetry }: { children: ReactNode; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-[#fecdd3] bg-[#fff1f2] px-4 py-3 text-sm text-[#be123c]">
      <span>{children}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="shrink-0 text-xs font-semibold underline">
          Retry
        </button>
      )}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#EEF0F3] ${className}`} aria-hidden />
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return <LoaderIcon className={`lucide lucide-loader-circle w-4 h-4 animate-spin ${className}`} />
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
const VARIANT: Record<Variant, string> = {
  primary: 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[0_2px_8px_rgba(37,99,235,0.24)]',
  secondary: 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]',
  ghost: 'bg-transparent text-[#4B5563] hover:bg-[#F3F4F6]',
  danger: 'bg-white text-[#B91C1C] border border-[#FECACA] hover:bg-[#FEF2F2]',
}
const SIZE = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm' }

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md'; loading?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

export function LinkButton({ to, variant = 'primary', size = 'md', className = '', children }: { to: string; variant?: Variant; size?: 'sm' | 'md'; className?: string; children: ReactNode }) {
  return (
    <Link to={to} className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ${VARIANT[variant]} ${SIZE[size]} ${className}`}>
      {children}
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */

export const INPUT =
  'w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 transition-all disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF]'

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: ReactNode; error?: string | null; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#5C5B57] uppercase tracking-wide mb-1.5 ml-1">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 ml-1 text-xs text-[#be123c]">{error}</p> : hint ? <p className="mt-1 ml-1 text-xs text-[#9CA3AF]">{hint}</p> : null}
    </div>
  )
}

export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={`${INPUT} ${className}`} />
}

export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={`${INPUT} pr-8 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236B7280%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_12px_center] ${className}`}>
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...rest} className={`${INPUT} h-auto min-h-[96px] py-2.5 resize-y ${className}`} />
}

/** Multi-select chips (niches, languages…). */
export function ChipSelect({ options, value, onChange, max }: { options: readonly string[]; value: string[]; onChange: (v: string[]) => void; max?: number }) {
  const toggle = (o: string) => {
    if (value.includes(o)) onChange(value.filter((v) => v !== o))
    else if (!max || value.length < max) onChange([...value, o])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            aria-pressed={on}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${on ? 'border-[#2563eb] bg-[#EFF6FF] text-[#1D4ED8]' : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#D1D5DB]'}`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tabs / pagination / modal                                           */
/* ------------------------------------------------------------------ */

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { value: T; label: ReactNode }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 rounded-xl bg-[#F3F4F6] p-1 w-fit max-w-full overflow-x-auto" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${value === t.value ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function Pagination({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-[#6B7280]">
      <span>
        Page {page} of {pages} · {total} results
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0f172a]/40 p-4" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#111827]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] cursor-pointer">
            <XIcon width={18} height={18} />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

type Toast = { id: number; kind: 'success' | 'error' | 'info'; text: string }
const ToastContext = createContext<{ push: (kind: Toast['kind'], text: string) => void }>({ push: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, kind, text }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])
  const value = useMemo(() => ({ push }), [push])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-medium shadow-lg border ${
              t.kind === 'success' ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]' : t.kind === 'error' ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]' : 'bg-white text-[#111827] border-[#E5E7EB]'
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

/* ------------------------------------------------------------------ */
/* Country flag (regional-indicator emoji)                             */
/* ------------------------------------------------------------------ */
export function flag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return '🌍'
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}
