-- ============================================================================
-- Repair script for an existing project (safe to run any number of times).
-- Run in Supabase → SQL Editor. It does NOT delete users, drop tables or
-- touch unrelated data. It:
--   1. grants the API roles the table privileges the app needs (RLS still
--      decides which rows each user can see);
--   2. inserts a profiles row for every auth.users account that has none,
--      keeping the role recorded in the signup metadata.
-- ============================================================================

-- 1. Privileges -------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant select on public.creators, public.creator_posts to anon;
grant usage, select on all sequences in schema public to authenticated, service_role;
grant execute on all functions in schema public to authenticated, service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema public grant execute on functions to authenticated, service_role;

-- 2. Missing profile rows ---------------------------------------------------
insert into public.profiles (id, role, role_locked, email, full_name, avatar_url, locale)
select
  u.id,
  case when u.raw_user_meta_data ->> 'role' = 'company' then 'company'::public.user_role else 'creator'::public.user_role end,
  coalesce(u.raw_user_meta_data ->> 'role', '') in ('company', 'creator'),
  coalesce(u.email, ''),
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), nullif(u.raw_user_meta_data ->> 'name', '')),
  coalesce(nullif(u.raw_user_meta_data ->> 'avatar_url', ''), nullif(u.raw_user_meta_data ->> 'picture', '')),
  case when u.raw_user_meta_data ->> 'locale' = 'fr' then 'fr' else 'en' end
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- 3. Report -----------------------------------------------------------------
select
  (select count(*) from auth.users)                                   as auth_users,
  (select count(*) from public.profiles)                              as profiles,
  (select count(*) from auth.users u
     where not exists (select 1 from public.profiles p where p.id = u.id)) as still_missing,
  has_table_privilege('authenticated', 'public.profiles', 'select')   as authenticated_can_read_profiles,
  (select count(*) from storage.buckets where id in ('avatars', 'company-logos')) as buckets;
