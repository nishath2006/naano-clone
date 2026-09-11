import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { describeError, supabase } from '@/lib/supabase'
import type { UserRole } from '@/lib/database.types'
import { AuthError } from '@/components/auth/AuthShell'
import { Button } from '@/components/app/ui'

/**
 * Shown once to accounts created through OAuth (no signup metadata). The
 * choice is applied by the `choose_role` RPC, which locks it server-side.
 */
export default function ChooseRole() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [pending, setPending] = useState<UserRole | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (profile?.role_locked) {
    navigate('/app', { replace: true })
    return null
  }

  const choose = async (role: UserRole) => {
    setPending(role)
    setError(null)
    const { error: err } = await supabase.rpc('choose_role', { p_role: role })
    if (err) {
      setError(describeError(err))
      setPending(null)
      return
    }
    await refreshProfile()
    navigate('/app/onboarding', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <img src="/logo.svg" alt="naano" className="h-7 mb-8" />
        <h1 className="text-2xl font-bold text-[#111827]">Who are you here as?</h1>
        <p className="text-sm text-[#6B7280] mt-1 mb-6">This can't be changed later.</p>
        <div className="space-y-3">
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => void choose('creator')}
            className="w-full text-left rounded-xl border border-[#D1D5DB] bg-white p-5 transition-colors hover:border-[#2563eb] hover:bg-[#F5F8FF] cursor-pointer disabled:opacity-60"
          >
            <div className="text-base font-semibold text-[#111827]">I'm a creator</div>
            <p className="text-sm text-[#6B7280] mt-1">Get paid to create LinkedIn content for B2B brands you actually use.</p>
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => void choose('company')}
            className="w-full text-left rounded-xl border border-[#D1D5DB] bg-white p-5 transition-colors hover:border-[#2563eb] hover:bg-[#F5F8FF] cursor-pointer disabled:opacity-60"
          >
            <div className="text-base font-semibold text-[#111827]">I'm a brand</div>
            <p className="text-sm text-[#6B7280] mt-1">Find creators, launch campaigns, and trace real pipeline back to each post.</p>
          </button>
        </div>
        {error && (
          <div className="mt-4">
            <AuthError>{error}</AuthError>
          </div>
        )}
        {pending && (
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" loading>
              Saving…
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
