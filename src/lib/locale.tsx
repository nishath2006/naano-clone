import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Locale = 'en' | 'fr'

const COOKIE = 'locale'

function readCookie(): Locale {
  if (typeof document === 'undefined') return 'en'
  const m = document.cookie.match(/(?:^|;\s*)locale=(en|fr)/)
  return (m?.[1] as Locale) ?? 'en'
}

function writeCookie(locale: Locale) {
  document.cookie = `${COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}

type LocaleContextValue = {
  locale: Locale
  /** true while the switch is in flight (the live site disables the button and reloads) */
  switching: boolean
  toggle: () => void
  set: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  switching: false,
  toggle: () => {},
  set: () => {},
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => readCookie())
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const set = useCallback((l: Locale) => {
    setSwitching(true)
    writeCookie(l)
    // The live site performs a full server refresh after writing the cookie.
    // We emulate the same visible sequence: button disabled → content swaps.
    window.setTimeout(() => {
      setLocale(l)
      setSwitching(false)
    }, 250)
  }, [])

  const toggle = useCallback(() => set(locale === 'en' ? 'fr' : 'en'), [locale, set])

  const value = useMemo(() => ({ locale, switching, toggle, set }), [locale, switching, toggle, set])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

/** Pick a localized string from an {en, fr} pair. */
export function useT() {
  const { locale } = useLocale()
  return useCallback(
    <T,>(pair: { en: T; fr: T }): T => (locale === 'fr' ? pair.fr : pair.en),
    [locale],
  )
}
