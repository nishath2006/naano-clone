import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LocaleProvider } from '@/lib/locale'
import { ChatWidget } from '@/components/shared/ChatWidget'
import { CookieConsent } from '@/components/shared/CookieConsent'

const Home = lazy(() => import('@/pages/Home'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Scroll to top on route change, or to the hash target when one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      let tries = 0
      const tick = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else if (tries++ < 20) requestAnimationFrame(tick)
      }
      tick()
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <LocaleProvider>
      <ScrollManager />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ChatWidget />
      <CookieConsent />
    </LocaleProvider>
  )
}
