-- ============================================================================
-- Naano clone — hosted Supabase schema
-- Run this in the Supabase SQL editor of a fresh project (or `supabase db push`).
-- Everything is idempotent-friendly for a fresh project; re-running on an
-- existing project is not supported (use a new migration instead).
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('company', 'creator');
create type public.campaign_status as enum ('draft', 'published', 'closed', 'completed');
create type public.application_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
create type public.collaboration_status as enum (
  'invited',        -- company booked/invited the creator, waiting for an answer
  'accepted',       -- creator accepted, no draft yet
  'declined',       -- creator declined the invitation
  'draft_ready',    -- creator submitted a draft for review
  'scheduled',      -- post approved and scheduled
  'live',           -- post is published
  'completed',      -- results tracked, payout done
  'cancelled'
);
create type public.payment_status as enum ('scheduled', 'paid', 'failed');

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user. The role is written ONLY by the
-- signup trigger (from the signup metadata) and can never be changed by the
-- user afterwards.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  email text not null,
  full_name text,
  avatar_url text,
  locale text not null default 'en' check (locale in ('en', 'fr')),
  -- true once the role is final. Email signups lock it immediately (role comes
  -- from the signup metadata); OAuth signups pick it once via choose_role().
  role_locked boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested text := coalesce(new.raw_user_meta_data ->> 'role', '');
  resolved public.user_role;
begin
  -- Only the two product roles are accepted; anything else defaults to creator.
  resolved := case when requested = 'company' then 'company'::public.user_role else 'creator'::public.user_role end;
  insert into public.profiles (id, role, role_locked, email, full_name, avatar_url, locale)
  values (
    new.id,
    resolved,
    requested in ('company', 'creator'),
    coalesce(new.email, ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), nullif(new.raw_user_meta_data ->> 'name', '')),
    coalesce(nullif(new.raw_user_meta_data ->> 'avatar_url', ''), nullif(new.raw_user_meta_data ->> 'picture', '')),
    case when new.raw_user_meta_data ->> 'locale' = 'fr' then 'fr' else 'en' end
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users must not be able to change their own role / id / email through the API.
create or replace function public.protect_profile_columns()
returns trigger language plpgsql as $$
begin
  if auth.uid() is not null then
    new.role := old.role;
    new.role_locked := old.role_locked;
    new.id := old.id;
    new.email := old.email;
  end if;
  return new;
end $$;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- One-time role choice for OAuth signups (no signup metadata available).
-- Refuses once the role is locked or once company/creator data exists.
create or replace function public.choose_role(p_role public.user_role)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare v public.profiles;
begin
  select * into v from public.profiles where id = auth.uid();
  if v.id is null then raise exception 'Not signed in' using errcode = '42501'; end if;
  if v.role_locked then
    if v.role = p_role then return v; end if;
    raise exception 'Role is already set' using errcode = '42501';
  end if;
  if exists (select 1 from public.companies where owner_id = auth.uid())
     or exists (select 1 from public.creators where user_id = auth.uid()) then
    raise exception 'Role is already in use' using errcode = '42501';
  end if;
  update public.profiles set role = p_role, role_locked = true where id = auth.uid() returning * into v;
  return v;
end $$;
grant execute on function public.choose_role(public.user_role) to authenticated;

-- ---------------------------------------------------------------------------
-- Role helpers (security definer so they work inside RLS policies)
-- ---------------------------------------------------------------------------
create or replace function public.current_role_of_user()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.my_company_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.companies where owner_id = auth.uid()
$$;

create or replace function public.my_creator_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.creators where user_id = auth.uid()
$$;

-- ---------------------------------------------------------------------------
-- companies — one per company user
-- ---------------------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  website text,
  industry text,                       -- sector slug (sales-tech, revops, devtools, product, hr-tech, fintech, marketing-ops, vertical-saas)
  size text,                           -- '1-10', '11-50', '51-200', '201-1000', '1000+'
  country text,                        -- ISO-3166 alpha-2
  logo_url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger companies_updated_at before update on public.companies
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- creators — the public creator directory. A row can belong to a signed-up
-- creator (user_id set) or be an imported public profile (user_id null).
-- ---------------------------------------------------------------------------
create table public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles (id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,120}$'),
  name text not null check (char_length(name) between 1 and 120),
  headline text,
  position text,                       -- current job title, e.g. 'Founder @ Acme'
  bio text,
  avatar_url text,
  country text,                        -- ISO-3166 alpha-2
  languages text[] not null default '{}',
  sectors text[] not null default '{}', -- niches (sector slugs)
  linkedin_url text,
  followers integer check (followers >= 0),
  median_views integer check (median_views >= 0),
  avg_reactions integer check (avg_reactions >= 0),
  avg_comments integer check (avg_comments >= 0),
  engagement_rate numeric(6, 2) check (engagement_rate >= 0),
  price_cents integer check (price_cents >= 0),        -- flat fee per sponsored post
  bundle_posts integer check (bundle_posts > 1),
  bundle_price_cents integer check (bundle_price_cents >= 0),
  accepting_bookings boolean not null default true,
  is_public boolean not null default true,
  stats_updated_at timestamptz,
  search tsvector generated always as (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(headline, '') || ' ' || coalesce(bio, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index creators_search_idx on public.creators using gin (search);
create index creators_sectors_idx on public.creators using gin (sectors);
create index creators_followers_idx on public.creators (followers desc);
create index creators_price_idx on public.creators (price_cents);
create index creators_country_idx on public.creators (country);
create index creators_name_trgm_idx on public.creators using gin (name gin_trgm_ops);
create trigger creators_updated_at before update on public.creators
  for each row execute function public.set_updated_at();

create table public.creator_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators (id) on delete cascade,
  kind text,                           -- 'image', 'text', 'video', …
  body text not null,
  reactions integer not null default 0 check (reactions >= 0),
  comments integer not null default 0 check (comments >= 0),
  url text,
  via_naano boolean not null default false,
  posted_at timestamptz,
  created_at timestamptz not null default now()
);
create index creator_posts_creator_idx on public.creator_posts (creator_id, posted_at desc);

-- ---------------------------------------------------------------------------
-- campaigns — a company brief. Lifecycle: draft → published → closed → completed
-- ---------------------------------------------------------------------------
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 140),
  description text not null default '',
  objective text,                      -- awareness | leads | signups | pipeline
  brief text,                          -- content requirements / key messages
  creator_requirements text,
  target_audience text,
  industry text,                       -- sector slug
  sectors text[] not null default '{}',-- wanted creator niches
  min_followers integer check (min_followers >= 0),
  budget_cents integer not null check (budget_cents >= 0),
  price_per_post_cents integer check (price_per_post_cents >= 0),
  posts_wanted integer not null default 1 check (posts_wanted between 1 and 100),
  start_date date,
  end_date date,
  status public.campaign_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_dates check (start_date is null or end_date is null or end_date >= start_date)
);
create index campaigns_company_idx on public.campaigns (company_id, created_at desc);
create index campaigns_status_idx on public.campaigns (status, published_at desc);
create index campaigns_sectors_idx on public.campaigns using gin (sectors);
create trigger campaigns_updated_at before update on public.campaigns
  for each row execute function public.set_updated_at();

create or replace function public.campaigns_track_publish()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' and (old.status is distinct from 'published') and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;
create trigger campaigns_publish before insert or update on public.campaigns
  for each row execute function public.campaigns_track_publish();

-- ---------------------------------------------------------------------------
-- campaign_applications — a creator applies to a published campaign
-- ---------------------------------------------------------------------------
create table public.campaign_applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  creator_id uuid not null references public.creators (id) on delete cascade,
  status public.application_status not null default 'pending',
  message text,
  proposed_price_cents integer check (proposed_price_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);
create index campaign_applications_creator_idx on public.campaign_applications (creator_id, created_at desc);
create index campaign_applications_campaign_idx on public.campaign_applications (campaign_id, status);
create trigger campaign_applications_updated_at before update on public.campaign_applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- collaborations — a booked creator on a campaign (from an accepted
-- application or a direct "Book" invitation)
-- ---------------------------------------------------------------------------
create table public.collaborations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  creator_id uuid not null references public.creators (id) on delete cascade,
  application_id uuid references public.campaign_applications (id) on delete set null,
  status public.collaboration_status not null default 'invited',
  agreed_price_cents integer not null check (agreed_price_cents >= 0),
  brief text,
  post_url text,
  due_date date,
  scheduled_at timestamptz,
  published_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);
create index collaborations_company_idx on public.collaborations (company_id, created_at desc);
create index collaborations_creator_idx on public.collaborations (creator_id, created_at desc);
create index collaborations_campaign_idx on public.collaborations (campaign_id);
create trigger collaborations_updated_at before update on public.collaborations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- collaboration_metrics — tracked results per published post
-- ---------------------------------------------------------------------------
create table public.collaboration_metrics (
  collaboration_id uuid primary key references public.collaborations (id) on delete cascade,
  impressions integer not null default 0 check (impressions >= 0),
  clicks integer not null default 0 check (clicks >= 0),
  leads integer not null default 0 check (leads >= 0),
  pipeline_cents integer not null default 0 check (pipeline_cents >= 0),
  updated_at timestamptz not null default now()
);
create trigger collaboration_metrics_updated_at before update on public.collaboration_metrics
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- payments — one payout record per collaboration
-- ---------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  collaboration_id uuid not null unique references public.collaborations (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  creator_id uuid not null references public.creators (id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'EUR',
  status public.payment_status not null default 'scheduled',
  scheduled_for date,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_company_idx on public.payments (company_id, created_at desc);
create index payments_creator_idx on public.payments (creator_id, created_at desc);
create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- bookmarks — companies save creators
-- ---------------------------------------------------------------------------
create table public.bookmarks (
  company_id uuid not null references public.companies (id) on delete cascade,
  creator_id uuid not null references public.creators (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (company_id, creator_id)
);

-- ---------------------------------------------------------------------------
-- conversations + messages (company ↔ creator, optionally about a campaign)
-- ---------------------------------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  creator_id uuid not null references public.creators (id) on delete cascade,
  campaign_id uuid references public.campaigns (id) on delete set null,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (company_id, creator_id)
);
create index conversations_company_idx on public.conversations (company_id, last_message_at desc);
create index conversations_creator_idx on public.conversations (creator_id, last_message_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index messages_conversation_idx on public.messages (conversation_id, created_at);

create or replace function public.messages_touch_conversation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end $$;
create trigger messages_touch after insert on public.messages
  for each row execute function public.messages_touch_conversation();

-- ---------------------------------------------------------------------------
-- notifications — written only by triggers (security definer)
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,                  -- application_received | application_accepted | … | message
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create or replace function public.notify_user(p_user uuid, p_kind text, p_title text, p_body text, p_href text)
returns void language sql security definer set search_path = public as $$
  insert into public.notifications (user_id, kind, title, body, href)
  select p_user, p_kind, p_title, p_body, p_href where p_user is not null
$$;

-- application created → notify the company; status change → notify the creator
create or replace function public.applications_notify()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_owner uuid; v_creator_user uuid; v_title text; v_creator_name text;
begin
  select c.owner_id, ca.title into v_owner, v_title
    from public.campaigns ca join public.companies c on c.id = ca.company_id where ca.id = new.campaign_id;
  select user_id, name into v_creator_user, v_creator_name from public.creators where id = new.creator_id;
  if tg_op = 'INSERT' then
    perform public.notify_user(v_owner, 'application_received', v_creator_name || ' applied to ' || v_title, new.message,
      '/app/campaigns/' || new.campaign_id);
  elsif new.status is distinct from old.status then
    if new.status = 'accepted' then
      perform public.notify_user(v_creator_user, 'application_accepted', 'You were selected for ' || v_title, null, '/app/collaborations');
    elsif new.status = 'rejected' then
      perform public.notify_user(v_creator_user, 'application_rejected', 'Application to ' || v_title || ' was not selected', null, '/app/applications');
    elsif new.status = 'withdrawn' then
      perform public.notify_user(v_owner, 'application_withdrawn', v_creator_name || ' withdrew from ' || v_title, null, '/app/campaigns/' || new.campaign_id);
    end if;
  end if;
  return new;
end $$;
create trigger applications_notify after insert or update on public.campaign_applications
  for each row execute function public.applications_notify();

-- collaboration created/updated → notify the other side; live → schedule payout
create or replace function public.collaborations_notify()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_owner uuid; v_creator_user uuid; v_title text; v_creator_name text;
begin
  select c.owner_id, ca.title into v_owner, v_title
    from public.campaigns ca join public.companies c on c.id = ca.company_id where ca.id = new.campaign_id;
  select user_id, name into v_creator_user, v_creator_name from public.creators where id = new.creator_id;
  if tg_op = 'INSERT' then
    if new.status = 'invited' then
      perform public.notify_user(v_creator_user, 'collaboration_invited', 'New deal: ' || v_title,
        'Booked at €' || (new.agreed_price_cents / 100)::text || ' per post', '/app/collaborations/' || new.id);
    end if;
    insert into public.collaboration_metrics (collaboration_id) values (new.id) on conflict do nothing;
  elsif new.status is distinct from old.status then
    case new.status
      when 'accepted' then perform public.notify_user(v_owner, 'collaboration_accepted', v_creator_name || ' accepted ' || v_title, null, '/app/campaigns/' || new.campaign_id);
      when 'declined' then perform public.notify_user(v_owner, 'collaboration_declined', v_creator_name || ' declined ' || v_title, null, '/app/campaigns/' || new.campaign_id);
      when 'draft_ready' then perform public.notify_user(v_owner, 'draft_ready', v_creator_name || ' submitted a draft for ' || v_title, null, '/app/campaigns/' || new.campaign_id);
      when 'scheduled' then perform public.notify_user(v_creator_user, 'post_scheduled', 'Your post for ' || v_title || ' is approved and scheduled', null, '/app/collaborations/' || new.id);
      when 'live' then
        perform public.notify_user(v_owner, 'post_live', v_creator_name || '''s post for ' || v_title || ' is live', null, '/app/campaigns/' || new.campaign_id);
        insert into public.payments (collaboration_id, company_id, creator_id, amount_cents, scheduled_for)
        values (new.id, new.company_id, new.creator_id, new.agreed_price_cents, (now() + interval '1 day')::date)
        on conflict (collaboration_id) do nothing;
        perform public.notify_user(v_creator_user, 'payment_scheduled', 'Payment scheduled: €' || (new.agreed_price_cents / 100)::text, 'Handled by Naano — paid within 24h of going live', '/app/earnings');
      when 'completed' then
        update public.payments set status = 'paid', paid_at = now() where collaboration_id = new.id and status = 'scheduled';
        perform public.notify_user(v_creator_user, 'payment_paid', 'Payout received: €' || (new.agreed_price_cents / 100)::text, v_title, '/app/earnings');
      else null;
    end case;
  end if;
  return new;
end $$;
create trigger collaborations_notify after insert or update on public.collaborations
  for each row execute function public.collaborations_notify();

-- Allowed status transitions, enforced per role (cannot be bypassed from the client)
create or replace function public.collaborations_guard()
returns trigger language plpgsql as $$
declare
  r public.user_role := public.current_role_of_user();
begin
  if auth.uid() is null then return new; end if;  -- service role / seeds
  if new.status = old.status then return new; end if;
  if r = 'creator' then
    if not ((old.status = 'invited' and new.status in ('accepted', 'declined'))
         or (old.status = 'accepted' and new.status = 'draft_ready')
         or (old.status = 'scheduled' and new.status = 'live')) then
      raise exception 'Creators cannot move a collaboration from % to %', old.status, new.status using errcode = '42501';
    end if;
    if new.status = 'live' then new.published_at := coalesce(new.published_at, now()); end if;
  elsif r = 'company' then
    if not ((old.status = 'draft_ready' and new.status in ('scheduled', 'accepted'))
         or (old.status = 'live' and new.status = 'completed')
         or (old.status in ('invited', 'accepted', 'draft_ready', 'scheduled') and new.status = 'cancelled')) then
      raise exception 'Companies cannot move a collaboration from % to %', old.status, new.status using errcode = '42501';
    end if;
    if new.status = 'scheduled' then new.scheduled_at := coalesce(new.scheduled_at, now()); end if;
    if new.status = 'completed' then new.completed_at := coalesce(new.completed_at, now()); end if;
  end if;
  return new;
end $$;
create trigger collaborations_guard before update on public.collaborations
  for each row execute function public.collaborations_guard();

-- Accepting an application creates the collaboration
create or replace function public.applications_on_accept()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_company uuid; v_price integer;
begin
  if new.status = 'accepted' and old.status is distinct from 'accepted' then
    select company_id, coalesce(price_per_post_cents, 0) into v_company, v_price from public.campaigns where id = new.campaign_id;
    insert into public.collaborations (campaign_id, company_id, creator_id, application_id, status, agreed_price_cents)
    values (new.campaign_id, v_company, new.creator_id, new.id, 'accepted', coalesce(new.proposed_price_cents, v_price))
    on conflict (campaign_id, creator_id) do nothing;
  end if;
  return new;
end $$;
create trigger applications_on_accept after update on public.campaign_applications
  for each row execute function public.applications_on_accept();

-- New message → notify the recipient
create or replace function public.messages_notify()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_owner uuid; v_creator_user uuid; v_sender_name text; v_target uuid;
begin
  select c.owner_id, cr.user_id into v_owner, v_creator_user
    from public.conversations cv
    join public.companies c on c.id = cv.company_id
    join public.creators cr on cr.id = cv.creator_id
    where cv.id = new.conversation_id;
  select coalesce(full_name, email) into v_sender_name from public.profiles where id = new.sender_id;
  v_target := case when new.sender_id = v_owner then v_creator_user else v_owner end;
  perform public.notify_user(v_target, 'message', 'New message from ' || v_sender_name, left(new.body, 140), '/app/messages/' || new.conversation_id);
  return new;
end $$;
create trigger messages_notify after insert on public.messages
  for each row execute function public.messages_notify();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.creators enable row level security;
alter table public.creator_posts enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_applications enable row level security;
alter table public.collaborations enable row level security;
alter table public.collaboration_metrics enable row level security;
alter table public.payments enable row level security;
alter table public.bookmarks enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- profiles: own row only (insert happens in the signup trigger)
create policy "profiles: read own" on public.profiles for select using (id = auth.uid());
create policy "profiles: update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- companies: any signed-in user can read basic company info (needed to show
-- who published a campaign); only the owner (a company user) writes.
create policy "companies: read signed in" on public.companies for select using (auth.uid() is not null);
create policy "companies: insert own" on public.companies for insert
  with check (owner_id = auth.uid() and public.current_role_of_user() = 'company');
create policy "companies: update own" on public.companies for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- creators: public directory rows are readable by everyone (the live site
-- shows creator profiles publicly); a creator always sees and edits their own.
create policy "creators: read public or own" on public.creators for select
  using (is_public or user_id = auth.uid());
create policy "creators: insert own" on public.creators for insert
  with check (user_id = auth.uid() and public.current_role_of_user() = 'creator');
create policy "creators: update own" on public.creators for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "creator_posts: read with creator" on public.creator_posts for select
  using (exists (select 1 from public.creators c where c.id = creator_id and (c.is_public or c.user_id = auth.uid())));
create policy "creator_posts: manage own" on public.creator_posts for all
  using (creator_id = public.my_creator_id()) with check (creator_id = public.my_creator_id());

-- campaigns
create policy "campaigns: company manages own" on public.campaigns for all
  using (company_id = public.my_company_id()) with check (company_id = public.my_company_id());
create policy "campaigns: creators see open or related" on public.campaigns for select
  using (
    public.current_role_of_user() = 'creator' and (
      status in ('published', 'closed')
      or exists (select 1 from public.collaborations co where co.campaign_id = id and co.creator_id = public.my_creator_id())
      or exists (select 1 from public.campaign_applications ap where ap.campaign_id = id and ap.creator_id = public.my_creator_id())
    )
  );

-- applications
create policy "applications: creator reads own" on public.campaign_applications for select
  using (creator_id = public.my_creator_id());
create policy "applications: creator applies to published" on public.campaign_applications for insert
  with check (
    creator_id = public.my_creator_id()
    and status = 'pending'
    and exists (select 1 from public.campaigns c where c.id = campaign_id and c.status = 'published')
  );
create policy "applications: creator withdraws own" on public.campaign_applications for update
  using (creator_id = public.my_creator_id() and status = 'pending')
  with check (creator_id = public.my_creator_id() and status in ('pending', 'withdrawn'));
create policy "applications: company reads own campaigns" on public.campaign_applications for select
  using (exists (select 1 from public.campaigns c where c.id = campaign_id and c.company_id = public.my_company_id()));
create policy "applications: company decides" on public.campaign_applications for update
  using (exists (select 1 from public.campaigns c where c.id = campaign_id and c.company_id = public.my_company_id()))
  with check (status in ('pending', 'accepted', 'rejected'));

-- collaborations
create policy "collaborations: company reads own" on public.collaborations for select
  using (company_id = public.my_company_id());
create policy "collaborations: company books" on public.collaborations for insert
  with check (
    company_id = public.my_company_id()
    and status = 'invited'
    and exists (select 1 from public.campaigns c where c.id = campaign_id and c.company_id = public.my_company_id())
    and exists (select 1 from public.creators cr where cr.id = creator_id and cr.is_public and cr.accepting_bookings)
  );
create policy "collaborations: company updates own" on public.collaborations for update
  using (company_id = public.my_company_id()) with check (company_id = public.my_company_id());
create policy "collaborations: creator reads own" on public.collaborations for select
  using (creator_id = public.my_creator_id());
create policy "collaborations: creator updates own" on public.collaborations for update
  using (creator_id = public.my_creator_id()) with check (creator_id = public.my_creator_id());

-- metrics: both sides read; the company records results
create policy "metrics: participants read" on public.collaboration_metrics for select
  using (exists (select 1 from public.collaborations co where co.id = collaboration_id
                 and (co.company_id = public.my_company_id() or co.creator_id = public.my_creator_id())));
create policy "metrics: company writes" on public.collaboration_metrics for update
  using (exists (select 1 from public.collaborations co where co.id = collaboration_id and co.company_id = public.my_company_id()))
  with check (exists (select 1 from public.collaborations co where co.id = collaboration_id and co.company_id = public.my_company_id()));

-- payments: read-only for both sides (written by triggers)
create policy "payments: participants read" on public.payments for select
  using (company_id = public.my_company_id() or creator_id = public.my_creator_id());

-- bookmarks
create policy "bookmarks: company manages own" on public.bookmarks for all
  using (company_id = public.my_company_id()) with check (company_id = public.my_company_id());

-- conversations / messages: participants only
create policy "conversations: participants read" on public.conversations for select
  using (company_id = public.my_company_id() or creator_id = public.my_creator_id());
create policy "conversations: participants create" on public.conversations for insert
  with check (company_id = public.my_company_id() or creator_id = public.my_creator_id());
create policy "messages: participants read" on public.messages for select
  using (exists (select 1 from public.conversations cv where cv.id = conversation_id
                 and (cv.company_id = public.my_company_id() or cv.creator_id = public.my_creator_id())));
create policy "messages: participants send" on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (select 1 from public.conversations cv where cv.id = conversation_id
                and (cv.company_id = public.my_company_id() or cv.creator_id = public.my_creator_id()))
  );
create policy "messages: recipient marks read" on public.messages for update
  using (sender_id <> auth.uid() and exists (select 1 from public.conversations cv where cv.id = conversation_id
                 and (cv.company_id = public.my_company_id() or cv.creator_id = public.my_creator_id())))
  with check (sender_id <> auth.uid());

-- notifications: own only; inserts happen in triggers
create policy "notifications: read own" on public.notifications for select using (user_id = auth.uid());
create policy "notifications: update own" on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications: delete own" on public.notifications for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Realtime (messages + notifications)
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- ---------------------------------------------------------------------------
-- Storage buckets: public read, owner-scoped writes ({uid}/…)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('company-logos', 'company-logos', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "storage: public read" on storage.objects for select
  using (bucket_id in ('avatars', 'company-logos'));
create policy "storage: users write own folder" on storage.objects for insert
  with check (bucket_id in ('avatars', 'company-logos') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "storage: users update own folder" on storage.objects for update
  using (bucket_id in ('avatars', 'company-logos') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "storage: users delete own folder" on storage.objects for delete
  using (bucket_id in ('avatars', 'company-logos') and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- Dashboard helpers (run as the caller, RLS applies)
-- ---------------------------------------------------------------------------
create or replace function public.company_dashboard()
returns json language sql stable security invoker set search_path = public as $$
  select json_build_object(
    'campaigns_total', (select count(*) from public.campaigns where company_id = public.my_company_id()),
    'campaigns_active', (select count(*) from public.campaigns where company_id = public.my_company_id() and status = 'published'),
    'applications_pending', (select count(*) from public.campaign_applications a join public.campaigns c on c.id = a.campaign_id
                              where c.company_id = public.my_company_id() and a.status = 'pending'),
    'collaborations_active', (select count(*) from public.collaborations where company_id = public.my_company_id()
                              and status in ('accepted', 'draft_ready', 'scheduled', 'live')),
    'posts_live', (select count(*) from public.collaborations where company_id = public.my_company_id() and status in ('live', 'completed')),
    'impressions', (select coalesce(sum(m.impressions), 0) from public.collaboration_metrics m join public.collaborations co on co.id = m.collaboration_id where co.company_id = public.my_company_id()),
    'clicks', (select coalesce(sum(m.clicks), 0) from public.collaboration_metrics m join public.collaborations co on co.id = m.collaboration_id where co.company_id = public.my_company_id()),
    'leads', (select coalesce(sum(m.leads), 0) from public.collaboration_metrics m join public.collaborations co on co.id = m.collaboration_id where co.company_id = public.my_company_id()),
    'pipeline_cents', (select coalesce(sum(m.pipeline_cents), 0) from public.collaboration_metrics m join public.collaborations co on co.id = m.collaboration_id where co.company_id = public.my_company_id()),
    'spend_cents', (select coalesce(sum(amount_cents), 0) from public.payments where company_id = public.my_company_id()),
    'bookmarks', (select count(*) from public.bookmarks where company_id = public.my_company_id())
  )
$$;

create or replace function public.creator_dashboard()
returns json language sql stable security invoker set search_path = public as $$
  select json_build_object(
    'applications_pending', (select count(*) from public.campaign_applications where creator_id = public.my_creator_id() and status = 'pending'),
    'invitations_pending', (select count(*) from public.collaborations where creator_id = public.my_creator_id() and status = 'invited'),
    'collaborations_active', (select count(*) from public.collaborations where creator_id = public.my_creator_id()
                              and status in ('accepted', 'draft_ready', 'scheduled', 'live')),
    'posts_live', (select count(*) from public.collaborations where creator_id = public.my_creator_id() and status in ('live', 'completed')),
    'impressions', (select coalesce(sum(m.impressions), 0) from public.collaboration_metrics m join public.collaborations co on co.id = m.collaboration_id where co.creator_id = public.my_creator_id()),
    'clicks', (select coalesce(sum(m.clicks), 0) from public.collaboration_metrics m join public.collaborations co on co.id = m.collaboration_id where co.creator_id = public.my_creator_id()),
    'leads', (select coalesce(sum(m.leads), 0) from public.collaboration_metrics m join public.collaborations co on co.id = m.collaboration_id where co.creator_id = public.my_creator_id()),
    'earned_cents', (select coalesce(sum(amount_cents), 0) from public.payments where creator_id = public.my_creator_id() and status = 'paid'),
    'pending_cents', (select coalesce(sum(amount_cents), 0) from public.payments where creator_id = public.my_creator_id() and status = 'scheduled'),
    'open_campaigns', (select count(*) from public.campaigns where status = 'published')
  )
$$;

grant execute on function public.company_dashboard() to authenticated;
grant execute on function public.creator_dashboard() to authenticated;
