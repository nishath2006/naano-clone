import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/lib/locale'

const KEY = 'naano:analytics-consent'

type Consent = 'granted' | 'denied' | null

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/**
 * Google-Analytics consent banner + the persistent "Cookies" button that lets
 * visitors reopen it. State is stored under `naano:analytics-consent`, exactly
 * like the live site.
 */
export function CookieConsent() {
  const { locale } = useLocale()
  const [consent, setConsent] = useState<Consent>(() => readConsent())
  const [open, setOpen] = useState<boolean>(() => readConsent() === null)

  useEffect(() => {
    if (consent) {
      try {
        localStorage.setItem(KEY, consent)
      } catch {
        /* storage unavailable */
      }
    }
  }, [consent])

  const decide = (c: Consent) => {
    setConsent(c)
    setOpen(false)
  }

  const t =
    locale === 'fr'
      ? {
          title: "Mesure d'audience",
          body: "Avec votre accord, Google Analytics nous aide à comprendre les visites et à améliorer NaanoX. Les URLs sensibles et techniques sont exclues. Vous pouvez modifier votre choix à tout moment via Cookies. ",
          privacy: 'Politique de confidentialité',
          reject: 'Refuser',
          allow: 'Autoriser',
          cookies: 'Cookies',
          aria: 'Préférences des cookies analytiques',
        }
      : {
          title: 'Audience measurement',
          body: 'With your permission, Google Analytics helps us understand visits and improve NaanoX. Sensitive and technical URLs are excluded. You can change your choice at any time via Cookies. ',
          privacy: 'Privacy policy',
          reject: 'Reject',
          allow: 'Allow',
          cookies: 'Cookies',
          aria: 'Analytics cookie preferences',
        }

  const btn =
    'min-h-11 rounded-xl border border-white/25 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t.title}
          className="fixed bottom-4 left-1/2 z-[2147483646] w-[min(calc(100%-2rem),48rem)] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#07101f]/95 p-5 text-white shadow-2xl backdrop-blur-md sm:p-6"
          style={{ fontFamily: 'var(--font-inter), -apple-system, sans-serif' }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-base font-semibold text-white">{t.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                {t.body}
                <Link to="/privacy" className="font-medium text-violet-300 underline underline-offset-2 hover:text-violet-200">
                  {t.privacy}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button type="button" className={btn} onClick={() => decide('denied')}>
                {t.reject}
              </button>
              <button type="button" className={btn} onClick={() => decide('granted')}>
                {t.allow}
              </button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <button
          type="button"
          aria-label={t.aria}
          onClick={() => setOpen(true)}
          className="fixed right-3 bottom-3 z-[2147483645] min-h-10 rounded-full border border-white/15 bg-[#07101f]/90 px-3.5 py-2 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur transition hover:bg-[#0d1a2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
          style={{ fontFamily: 'var(--font-inter), -apple-system, sans-serif' }}
        >
          {t.cookies}
        </button>
      )}
    </>
  )
}
