# Supabase setup, deployment and security

The app uses one **hosted** Supabase project for everything: Auth, Postgres (with Row Level Security), Storage and Realtime. Nothing runs locally except the Vite dev server; production is the static Vite build on Vercel talking to Supabase from the browser.

```
Browser ──▶ React app (Vercel)
               │  supabase-js, public anon key only
               ▼
        Supabase project: Auth · Postgres/RLS · Storage · Realtime
```

## 1. Create the project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor → New query**, paste the whole of [`supabase/migrations/20260911000001_init.sql`](../supabase/migrations/20260911000001_init.sql) and run it. It creates every table, index, trigger, RLS policy, storage bucket and RPC in one go on a fresh project.
   - Alternative with the CLI: `npx supabase link --project-ref <ref>` then `npx supabase db push`.
3. **Authentication → URL configuration**: set *Site URL* to your Vercel URL (or `http://localhost:5173` while developing) and add both to *Redirect URLs*, plus `<url>/auth/callback` and `<url>/auth/reset-password`.
4. Optional:
   - **Authentication → Providers**: enable Google and/or LinkedIn (OIDC) to make the "Continue with…" buttons work. Without them the buttons show a clear "provider is not enabled" error.
   - **Authentication → Email**: if you want a 6-digit code in the password-reset email (the flow shown on `/login/forgot-password`), add `{{ .Token }}` to the *Reset password* template. The link in the default template also works (`/auth/reset-password`).
   - **Authentication → Providers → Email → Confirm email**: on by default. Turn it off for a frictionless demo; the register page handles both cases.

### Email rate limit ("email rate limit exceeded")

With **Confirm email** on, every `signUp` call and every password-reset request sends an email through Supabase's built-in mailer, which allows only a handful of emails per hour per project. When that cap is hit, Auth answers `429 over_email_send_rate_limit` and the app shows "The project's hourly limit for sending emails has been reached…". Sign-in with a password is not affected, because it sends nothing.

Options, from least to most work:

1. **Demo / testing**: Authentication → Providers → Email → turn **Confirm email** off. Sign-ups then start a session immediately and no email is sent. The seed script's demo accounts are created already confirmed either way.
2. **Production**: configure your own SMTP provider (Project Settings → Authentication → SMTP Settings, e.g. Resend, Postmark, SendGrid). Once custom SMTP is enabled, **Authentication → Rate Limits → "Rate limit for sending emails"** becomes editable and can be raised. The other limits on that page (sign-ins/sign-ups per IP, token refreshes, OTP verifications) are also adjustable there; leave them at their defaults unless you have a reason.
3. Wait: the built-in limit resets on an hourly window.

## 2. Environment variables

Only two public values are needed by the app. Find them under **Project settings → API**.

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Project URL, `https://<ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `anon` / publishable key |

- **Local**: `cp .env.example .env.local` and fill it in. `.env.local` is git-ignored (`.gitignore` ignores `.env` and `.env.*` except `.env.example`).
- **Vercel**: Project → Settings → Environment Variables → add both for Production (and Preview), then redeploy.

The **service-role key and the database password are never used by the app** and must not be added to Vercel or to any `VITE_` variable. Vite only exposes variables prefixed with `VITE_`, so nothing else can leak into the bundle.

## 3. Deploy to Vercel

`vercel.json` sets the framework to Vite, rewrites every path to `index.html` (client-side routing) and adds cache headers for hashed assets. Import the GitHub repo in Vercel, add the two variables above and deploy. `npm run build` (type-check + Vite build) is what Vercel runs.

## 4. Seed demo data

The seed script runs **on your machine** with the service-role key so it can create confirmed users and bypass RLS. It never runs in the browser.

```bash
# .env.local (git-ignored) — add these two lines for the seed only
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role key from Project settings → API>

npm run seed
```

It is idempotent and does three things:

1. Imports the 374 captured public creator profiles (`data/creators.json`) plus their recent posts into `creators` / `creator_posts`.
2. Creates two confirmed demo accounts — `demo.brand@example.com` (company "Leadbay") and `demo.creator@example.com` — with the password from `SEED_DEMO_PASSWORD`, or a random one printed once in the terminal.
3. Fills the brand with campaigns, applications, bookmarks, deals in every lifecycle state (including a live post with recorded results and a completed one with a payout), a conversation and the notifications those generate.

Re-running deletes and recreates the demo accounts (and everything they own) and upserts the creator directory.

## Data model

| Table | Purpose | Written by |
|---|---|---|
| `profiles` | one row per auth user: `role` (company/creator), name, avatar, locale, onboarding flag | signup trigger; user updates own row (role/email protected by trigger) |
| `companies` | company profile, one per company user | owner |
| `creators` | public creator directory: card fields, niches (`sectors`), audience numbers, price, bundle; `user_id` set for signed-up creators, null for imported profiles | creator (own row), seed |
| `creator_posts` | recent LinkedIn posts shown on a profile | creator, seed |
| `campaigns` | briefs: `draft → published → closed → completed` | company |
| `campaign_applications` | creator applies to a published campaign: `pending → accepted / rejected / withdrawn` | creator (insert/withdraw), company (decide) |
| `collaborations` | a booked creator on a campaign: `invited → accepted → draft_ready → scheduled → live → completed` (or `declined` / `cancelled`) | company (book, approve, complete, cancel), creator (accept, draft, live), trigger on accepted application |
| `collaboration_metrics` | impressions / clicks / leads / pipeline per live post | company |
| `payments` | payout ledger, one per collaboration: `scheduled` when live, `paid` when completed | triggers only |
| `bookmarks` | company shortlist | company |
| `conversations`, `messages` | company ↔ creator threads (Realtime) | participants |
| `notifications` | per-user feed (Realtime) | triggers only |

RPCs: `company_dashboard()` and `creator_dashboard()` aggregate the signed-in user's numbers (security invoker, RLS applies); `choose_role(role)` is the one-time role pick for OAuth signups.

Storage buckets: `avatars` and `company-logos` (public read; each user can only write inside `<their uid>/`).

## Security model

- **Roles are never trusted from the client.** `profiles.role` is set once by the `handle_new_user` trigger from the signup metadata (email signups) or by `choose_role()` (OAuth signups, only while unlocked and before any data exists). A `before update` trigger discards any client attempt to change `role`, `role_locked`, `id` or `email`. Route guards in the app only *read* the role to pick pages; every query is still filtered by RLS.
- **RLS is enabled on every table** with policies scoped by `auth.uid()` through the `my_company_id()` / `my_creator_id()` helpers. Creators only see published campaigns (or ones they are involved in); companies only see their own campaigns, applications, deals, metrics, payments and bookmarks; messages and conversations are visible to their two participants only; notifications are private.
- **State machines are enforced in the database.** `collaborations_guard` rejects status transitions that the current role isn't allowed to make (a creator cannot mark a deal `completed`, a company cannot mark it `live`). Applications can only be created against `published` campaigns and only with status `pending`.
- **Side effects run in triggers**, not in the client: accepting an application creates the deal; going live schedules the payment and notifies both sides; completing releases the payment.
- **Secrets**: only the anon key reaches the browser. The service-role key is read by `scripts/seed.mjs` from the local environment and never stored. Nothing sensitive is hard-coded; `.env*` files are ignored by git.
- **Storage** uploads are limited to images ≤ 5 MB and to the uploader's own folder.

## End-to-end checklist

Run these against your hosted project (after `npm run seed` for the "demo" items).

Auth
- [ ] Register as a brand (`/register?role=saas`) with email + password → confirmation email (or immediate session if confirmation is off) → onboarding → `/app` company overview.
- [ ] Register as a creator (`/register?role=influencer`) → 4-step onboarding → creator overview; card appears on the brand's marketplace.
- [ ] Registering twice with the same email shows "already exists".
- [ ] Wrong password shows "Invalid email or password."; `/login?redirectTo=/app/campaigns` lands on that page after sign-in.
- [ ] Refresh any `/app` page: session persists. Sign out → `/app` redirects to `/login`.
- [ ] Forgot password → email → code or link → new password → signed in.
- [ ] (Optional) Google / LinkedIn sign-up → `/auth/callback` → role applied once → onboarding.

Role enforcement
- [ ] As a creator, open `/app/marketplace` → redirected to `/app`. As a company, open `/app/profile` → redirected.
- [ ] In the browser console as a creator: `supabase.from('campaigns').select('*')` returns only published campaigns; `update` on another user's row affects 0 rows; `update profiles set role` leaves the role unchanged.

Company
- [ ] Marketplace search, niche/country/audience/price filters, sort options and pagination all query the server (watch the Network tab); URL reflects filters.
- [ ] Star a creator → appears under Saved creators; unstar removes it.
- [ ] Create a campaign as draft, publish it, edit it, close it, reopen it, complete it; delete a draft.
- [ ] Book a creator from the marketplace → deal `Invitation sent`; creator receives a notification.
- [ ] Accept an application → deal created automatically; decline another.
- [ ] Approve a draft, record results after it goes live, complete the deal → payment `paid`; analytics totals update.

Creator
- [ ] Edit the card (niches, numbers, price) → live preview updates → saved → visible to companies.
- [ ] Browse campaigns (matching filter), apply with a message and price, withdraw.
- [ ] Accept an invitation, submit a draft link, mark the post live with a LinkedIn URL → payout scheduled → earnings updates.
- [ ] Performance shows results recorded by the brand.

Realtime & misc
- [ ] Two browsers (brand + creator): messages appear instantly on both sides; the notification badge updates without reload.
- [ ] Every list has loading skeletons, an empty state and an error state with retry (block the network to see it).
- [ ] `npm run build` passes; `git grep -i "service_role\|eyJ"` finds no key; no `localhost` reference is required in production.
