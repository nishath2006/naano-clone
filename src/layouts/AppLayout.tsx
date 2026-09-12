import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Avatar, ToastProvider } from '@/components/app/ui'
import {
  BellIcon,
  ChartIcon,
  ChatIcon,
  GridIcon,
  HandshakeIcon,
  InboxIcon,
  LayersIcon,
  LogoutIcon,
  MegaphoneIcon,
  MenuIcon,
  SettingsIcon,
  StarIcon,
  StoreIcon,
  UserIcon,
  WalletIcon,
  XIcon,
} from '@/components/app/icons'

type Item = { to: string; label: string; icon: typeof GridIcon; end?: boolean }

const COMPANY_NAV: Item[] = [
  { to: '/app', label: 'Overview', icon: GridIcon, end: true },
  { to: '/app/marketplace', label: 'Marketplace', icon: StoreIcon },
  { to: '/app/bookmarks', label: 'Saved creators', icon: StarIcon },
  { to: '/app/campaigns', label: 'Campaigns', icon: LayersIcon },
  { to: '/app/analytics', label: 'Analytics', icon: ChartIcon },
  { to: '/app/messages', label: 'Messages', icon: ChatIcon },
]

const CREATOR_NAV: Item[] = [
  { to: '/app', label: 'Overview', icon: GridIcon, end: true },
  { to: '/app/profile', label: 'My card', icon: UserIcon },
  { to: '/app/campaigns', label: 'Campaigns', icon: MegaphoneIcon },
  { to: '/app/applications', label: 'Applications', icon: InboxIcon },
  { to: '/app/collaborations', label: 'Deals', icon: HandshakeIcon },
  { to: '/app/performance', label: 'Performance', icon: ChartIcon },
  { to: '/app/earnings', label: 'Earnings', icon: WalletIcon },
  { to: '/app/messages', label: 'Messages', icon: ChatIcon },
]

/** Unread notification count, kept live through Supabase Realtime. */
function useUnreadCount(userId: string | undefined) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!userId) return
    let active = true
    const load = async () => {
      const { count: c } = await supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', userId).is('read_at', null)
      if (active) setCount(c ?? 0)
    }
    void load()
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => void load())
      .subscribe()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [userId])
  return count
}

/**
 * Authenticated shell: the thin icon rail seen in the marketplace screenshot
 * (public/lp/marketplace-screenshot-clean-v2.png) with labels on wide screens
 * and a slide-over on mobile. Navigation depends on the role stored in
 * `profiles` (never on a client-side value).
 */
export default function AppLayout() {
  const { profile, user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const unread = useUnreadCount(user?.id)
  const items = profile?.role === 'company' ? COMPANY_NAV : CREATOR_NAV
  const bare = location.pathname.startsWith('/app/onboarding') || location.pathname.startsWith('/app/choose-role')

  useEffect(() => {
    document.title = 'NaanoX · Dashboard'
    setOpen(false)
  }, [location.pathname])

  const onSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  if (bare) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Outlet />
        </div>
      </ToastProvider>
    )
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-[#EEE9FF] text-[#7C5CFC]' : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'}`
          }
        >
          <Icon />
          <span className="lg:inline">{label}</span>
        </NavLink>
      ))}
      <NavLink
        to="/app/notifications"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-[#EEE9FF] text-[#7C5CFC]' : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'}`
        }
      >
        <span className="relative">
          <BellIcon />
          {unread > 0 && (
            <span className="absolute -right-1.5 -top-1.5 min-w-[16px] h-4 rounded-full bg-[#7C5CFC] px-1 text-[10px] font-bold leading-4 text-white text-center" aria-label={`${unread} unread`}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </span>
        <span>Notifications</span>
      </NavLink>
      <NavLink
        to="/app/settings"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-[#EEE9FF] text-[#7C5CFC]' : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'}`
        }
      >
        <SettingsIcon />
        <span>Settings</span>
      </NavLink>
    </nav>
  )

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F7F8FA] text-[#111827]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Desktop sidebar */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 w-[232px] flex-col border-r border-[#E9EBF0] bg-white px-3 py-5">
          <NavLink to="/" className="flex items-center gap-2 px-2 mb-6">
            <img src="/logo.svg" alt="NaanoX" className="h-7" />
          </NavLink>
          {nav}
          <div className="mt-auto pt-4 border-t border-[#F3F4F6]">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar src={profile?.avatar_url} name={profile?.full_name ?? profile?.email} size={34} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{profile?.full_name ?? profile?.email}</div>
                <div className="text-[11px] text-[#9CA3AF] capitalize">{profile?.role}</div>
              </div>
              <button type="button" onClick={() => void onSignOut()} aria-label="Sign out" className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] cursor-pointer">
                <LogoutIcon width={18} height={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[#E9EBF0] bg-white px-4 h-14">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-1.5 text-[#4B5563] cursor-pointer">
            <MenuIcon />
          </button>
          <img src="/logo.svg" alt="NaanoX" className="h-6" />
          <NavLink to="/app/notifications" className="relative rounded-lg p-1.5 text-[#4B5563]" aria-label="Notifications">
            <BellIcon />
            {unread > 0 && <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-[#7C5CFC]" />}
          </NavLink>
        </header>
        {open && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#0f172a]/40" onClick={() => setOpen(false)}>
            <div className="h-full w-[260px] bg-white p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <img src="/logo.svg" alt="NaanoX" className="h-6" />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-1.5 text-[#4B5563] cursor-pointer">
                  <XIcon />
                </button>
              </div>
              {nav}
              <button type="button" onClick={() => void onSignOut()} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] cursor-pointer">
                <LogoutIcon /> Sign out
              </button>
            </div>
          </div>
        )}

        <main className="md:pl-[232px]">
          <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}
