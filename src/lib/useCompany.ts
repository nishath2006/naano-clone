import { useAuth } from './auth'
import { supabase } from './supabase'
import { unwrap, useQuery } from './queries'
import type { CompanyRow, CreatorRow } from './database.types'

/** The signed-in company's row (RLS: owner only). */
export function useCompany() {
  const { user } = useAuth()
  return useQuery(async () => unwrap(await supabase.from('companies').select('*').eq('owner_id', user!.id).maybeSingle()) as CompanyRow | null, [user?.id])
}

/** The signed-in creator's row (RLS: own row). */
export function useCreator() {
  const { user } = useAuth()
  return useQuery(async () => unwrap(await supabase.from('creators').select('*').eq('user_id', user!.id).maybeSingle()) as CreatorRow | null, [user?.id])
}

/** Set of bookmarked creator ids for the current company, with a toggle. */
export function useBookmarks(companyId: string | null | undefined) {
  const q = useQuery(async () => {
    if (!companyId) return new Set<string>()
    const rows = unwrap(await supabase.from('bookmarks').select('creator_id').eq('company_id', companyId)) as { creator_id: string }[]
    return new Set(rows.map((r) => r.creator_id))
  }, [companyId])

  const toggle = async (creatorId: string) => {
    if (!companyId || !q.data) return
    const has = q.data.has(creatorId)
    const next = new Set(q.data)
    if (has) next.delete(creatorId)
    else next.add(creatorId)
    q.setData(next) // optimistic
    const res = has
      ? await supabase.from('bookmarks').delete().eq('company_id', companyId).eq('creator_id', creatorId)
      : await supabase.from('bookmarks').insert({ company_id: companyId, creator_id: creatorId })
    if (res.error) {
      q.setData(q.data)
      throw res.error
    }
  }
  return { bookmarks: q.data ?? new Set<string>(), toggle, loading: q.loading, reload: q.reload }
}
