import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LocaleProvider } from '@/lib/locale'
import { AuthProvider, RedirectIfAuthed, RequireAuth, RequireRole, useAuth } from '@/lib/auth'
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
const AuthCallback = lazy(() => import('@/pages/auth/AuthCallback'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const PdfPage = lazy(() => import('@/pages/PdfPage'))
const Sector = lazy(() => import('@/pages/Sector'))
const Reports = lazy(() => import('@/pages/Reports'))
const BenchmarksQ2 = lazy(() => import('@/pages/BenchmarksQ2'))
const LinkedinCreatorMarketplace = lazy(() => import('@/pages/LinkedinCreatorMarketplace'))
const BestPlatforms = lazy(() => import('@/pages/BestPlatforms'))
const CreatorProfile = lazy(() => import('@/pages/CreatorProfile'))
const Selection = lazy(() => import('@/pages/Selection'))
const RedirectToRegister = lazy(() => import('@/pages/RedirectToRegister'))

// Authenticated app (hosted Supabase)
const AppLayout = lazy(() => import('@/layouts/AppLayout'))
const ChooseRole = lazy(() => import('@/pages/app/ChooseRole'))
const Onboarding = lazy(() => import('@/pages/app/Onboarding'))
const Overview = lazy(() => import('@/pages/app/Overview'))
const Marketplace = lazy(() => import('@/pages/app/company/Marketplace'))
const CreatorDetail = lazy(() => import('@/pages/app/company/CreatorDetail'))
const Bookmarks = lazy(() => import('@/pages/app/company/Bookmarks'))
const CompanyCampaigns = lazy(() => import('@/pages/app/company/Campaigns'))
const CampaignForm = lazy(() => import('@/pages/app/company/CampaignForm'))
const CompanyCampaignDetail = lazy(() => import('@/pages/app/company/CampaignDetail'))
const Analytics = lazy(() => import('@/pages/app/company/Analytics'))
const CreatorCard = lazy(() => import('@/pages/app/creator/MyCard'))
const BrowseCampaigns = lazy(() => import('@/pages/app/creator/BrowseCampaigns'))
const CreatorCampaignDetail = lazy(() => import('@/pages/app/creator/CampaignDetail'))
const Applications = lazy(() => import('@/pages/app/creator/Applications'))
const Collaborations = lazy(() => import('@/pages/app/creator/Collaborations'))
const CollaborationDetail = lazy(() => import('@/pages/app/CollaborationDetail'))
const Performance = lazy(() => import('@/pages/app/creator/Performance'))
const Earnings = lazy(() => import('@/pages/app/creator/Earnings'))
const Messages = lazy(() => import('@/pages/app/Messages'))
const Notifications = lazy(() => import('@/pages/app/Notifications'))
const Settings = lazy(() => import('@/pages/app/Settings'))

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

/** Picks the page for a shared path (`/app/campaigns`…) from the RLS-backed role. */
function ByRole({ company, creator }: { company: React.ReactNode; creator: React.ReactNode }) {
  const { profile } = useAuth()
  return <>{profile?.role === 'company' ? company : creator}</>
}

/** The marketing site keeps its chrome; the app shell doesn't show the chat widget / cookie banner. */
function SiteChrome() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/app') || pathname.startsWith('/auth')) return null
  return (
    <>
      <ChatWidget />
      <CookieConsent />
    </>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
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
            <Route
              path="/login"
              element={
                <RedirectIfAuthed>
                  <Login />
                </RedirectIfAuthed>
              }
            />
            <Route path="/login/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/register"
              element={
                <RedirectIfAuthed>
                  <Register />
                </RedirectIfAuthed>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/agency" element={<AgencySignup variant="brand" />} />
            <Route path="/talent-agency" element={<AgencySignup variant="talent" />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />

            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Overview />} />
              <Route path="choose-role" element={<ChooseRole />} />
              <Route path="onboarding" element={<Onboarding />} />
              {/* company */}
              <Route path="marketplace" element={<RequireRole role="company"><Marketplace /></RequireRole>} />
              <Route path="creators/:id" element={<RequireRole role="company"><CreatorDetail /></RequireRole>} />
              <Route path="bookmarks" element={<RequireRole role="company"><Bookmarks /></RequireRole>} />
              <Route path="campaigns/new" element={<RequireRole role="company"><CampaignForm /></RequireRole>} />
              <Route path="campaigns/:id/edit" element={<RequireRole role="company"><CampaignForm /></RequireRole>} />
              <Route path="analytics" element={<RequireRole role="company"><Analytics /></RequireRole>} />
              {/* creator */}
              <Route path="profile" element={<RequireRole role="creator"><CreatorCard /></RequireRole>} />
              <Route path="applications" element={<RequireRole role="creator"><Applications /></RequireRole>} />
              <Route path="collaborations" element={<RequireRole role="creator"><Collaborations /></RequireRole>} />
              <Route path="performance" element={<RequireRole role="creator"><Performance /></RequireRole>} />
              <Route path="earnings" element={<RequireRole role="creator"><Earnings /></RequireRole>} />
              {/* shared paths, role-specific pages */}
              <Route path="campaigns" element={<ByRole company={<CompanyCampaigns />} creator={<BrowseCampaigns />} />} />
              <Route path="campaigns/:id" element={<ByRole company={<CompanyCampaignDetail />} creator={<CreatorCampaignDetail />} />} />
              <Route path="collaborations/:id" element={<CollaborationDetail />} />
              <Route path="messages" element={<Messages />} />
              <Route path="messages/:id" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>

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
        <SiteChrome />
      </AuthProvider>
    </LocaleProvider>
  )
}
