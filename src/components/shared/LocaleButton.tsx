import { useLocale } from '@/lib/locale'

/**
 * Globe + "EN"/"FR" switch. Clicking writes the locale cookie and re-renders
 * the site in the other language. While switching, the live site disables the
 * button (opacity .5, cursor not-allowed).
 */
export function LocaleButton({ className }: { className?: string }) {
  const { locale, switching, toggle } = useLocale()
  return (
    <button
      type="button"
      aria-label="Switch language"
      onClick={toggle}
      disabled={switching}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 10px',
        borderRadius: 8,
        border: 'none',
        background: 'transparent',
        cursor: switching ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.1s ease',
        opacity: switching ? 0.5 : 1,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ color: 'var(--v3-text-tertiary, #6B6D74)', flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
      <span style={{ display: 'inline-block', width: 20, height: 18, position: 'relative', overflow: 'hidden' }}>
        <span
          key={locale}
          style={{
            display: 'block',
            position: 'absolute',
            inset: 0,
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--v3-text-secondary, #17181C)',
            letterSpacing: '0.02em',
            lineHeight: '18px',
            textAlign: 'center',
            animation: 'localeIn 0.3s cubic-bezier(0.2, 0, 0, 1) forwards',
          }}
        >
          {locale}
        </span>
      </span>
    </button>
  )
}
