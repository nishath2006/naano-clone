import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LocaleProvider } from '@/lib/locale'
import { ChatWidget } from '@/components/shared/ChatWidget'
import { CookieConsent } from '@/components/shared/CookieConsent'

const Home = lazy(() => import('@/pages/Home'))
const Creators = lazy(() => import('@/pages/Creators'))
const Agencies = lazy(() => import('@/pages/Agencies'))
const About = lazy(() => import('@/pages/About'))
const Pricing = lazy(() => import('@/pages/Pricing'))
const Help = lazy(() => import('@/pages/Help'))
const Book = lazy(() => import('@/pages/Book'))
const CaseStudyBlogSeo = lazy(() => import('@/pages/CaseStudyBlogSeo'))
const Briefs = lazy(() => import('@/pages/Briefs'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const FreeTools = lazy(() => import('@/pages/FreeTools'))
const CreatorWorthCalculator = lazy(() => import('@/pages/tools/CreatorWorthCalculator'))
const EngagementRateCalculator = lazy(() => import('@/pages/tools/EngagementRateCalculator'))
const DeliveryOddsEstimator = lazy(() => import('@/pages/tools/DeliveryOddsEstimator'))
const CampaignBudgetPlanner = lazy(() => import('@/pages/tools/CampaignBudgetPlanner'))
const Login = lazy(() => import('@/pages/auth/Login'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const Register = lazy(() => import('@/pages/auth/Register'))
const AgencySignup = lazy(() => import('@/pages/auth/AgencySignup'))
const PdfPage = lazy(() => import('@/pages/PdfPage'))
const Sector = lazy(() => import('@/pages/Sector'))
const Reports = lazy(() => import('@/pages/Reports'))
const BenchmarksQ2 = lazy(() => import('@/pages/BenchmarksQ2'))
const LinkedinCreatorMarketplace = lazy(() => import('@/pages/LinkedinCreatorMarketplace'))
const BestPlatforms = lazy(() => import('@/pages/BestPlatforms'))
const CreatorProfile = lazy(() => import('@/pages/CreatorProfile'))
const Selection = lazy(() => import('@/pages/Selection'))
const RedirectToRegister = lazy(() => import('@/pages/RedirectToRegister'))

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
          <Route path="/creators" element={<Creators />} />
          <Route path="/creators/:slug" element={<CreatorProfile />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/r/:slug" element={<RedirectToRegister />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/free-tools" element={<FreeTools />} />
          <Route path="/free-tools/linkedin-creator-worth-calculator" element={<CreatorWorthCalculator />} />
          <Route path="/free-tools/linkedin-engagement-rate-calculator" element={<EngagementRateCalculator />} />
          <Route path="/free-tools/sponsored-post-delivery-odds-estimator" element={<DeliveryOddsEstimator />} />
          <Route path="/free-tools/creator-campaign-budget-planner" element={<CampaignBudgetPlanner />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/help" element={<Help />} />
          <Route path="/book" element={<Book />} />
          <Route path="/case-studies/blogseo" element={<CaseStudyBlogSeo />} />
          <Route path="/briefs" element={<Briefs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/agency" element={<AgencySignup variant="brand" />} />
          <Route path="/talent-agency" element={<AgencySignup variant="talent" />} />
          <Route path="/dashboard" element={<Navigate to="/login?redirectTo=%2Fdashboard" replace />} />
          <Route path="/privacy" element={<PdfPage file="/privacy.pdf" />} />
          <Route path="/terms" element={<PdfPage file="/terms.pdf" />} />
          <Route path="/for/:sector" element={<Sector />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/benchmarks/q2-2026" element={<BenchmarksQ2 />} />
          <Route path="/linkedin-creator-marketplace" element={<LinkedinCreatorMarketplace />} />
          <Route path="/best-b2b-influencer-marketing-platforms-2026" element={<BestPlatforms />} />
          <Route path="/meilleures-plateformes-influence-marketing-b2b-2026" element={<BestPlatforms lang="fr" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ChatWidget />
      <CookieConsent />
    </LocaleProvider>
  )
}
