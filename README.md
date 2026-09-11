# Naano clone

A recreation of [naano.com](https://naano.com) (the B2B LinkedIn creator marketplace), built for the 8x assignment: a 1:1 reproduction of the public marketing site plus a working product behind it — authentication, company and creator dashboards, creator discovery, campaigns, applications, deals, messaging, notifications and payouts — running on a **hosted Supabase project** (Auth, Postgres with RLS, Storage, Realtime). There is no local database and no custom backend server; the deployed Vercel app talks to Supabase directly.

**Quick links:** [Supabase setup & deployment](docs/SUPABASE.md) · [Demo data](docs/SUPABASE.md#4-seed-demo-data) · [Security model](docs/SUPABASE.md#security-model) · [End-to-end test checklist](docs/SUPABASE.md#end-to-end-checklist)

## Stack

- Vite 6, React 19, TypeScript, Tailwind CSS v4, react-router-dom v7
- No UI library. Every component is hand-written from the observed markup and computed styles.

```bash
npm install
cp .env.example .env.local   # then paste your Supabase project URL + anon key
npm run dev                  # http://localhost:5173
npm run build                # type-check + production build
npm run seed                 # optional: import creators + demo accounts into your Supabase project
```

The marketing site works without any configuration. The application routes (`/login`, `/register`, `/app/*`) need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — see [docs/SUPABASE.md](docs/SUPABASE.md).

## How the original site is built (and how the clone mirrors it)

naano.com uses two visual systems, and so does this repo:

| System | Live pages | Clone |
|---|---|---|
| **Landing canvas** (`naano-lp`): a fixed 1672px design canvas scaled with CSS `zoom: 100vw / 1672`, Inter LP webfont, cloud backgrounds, `data-screen-label` sections | `/`, `/creators`, `/agencies` (+ the LP nav on `/blog`, `/selection`, `/book`, `/case-studies/*`) | `src/layouts/LpLayout.tsx`, `src/components/lp/*`, `src/components/home/*`, `src/components/creators/*`, `src/styles/lp.css`, `src/styles/agencies.css` |
| **Plus Jakarta Sans / Tailwind** pages: fixed transparent nav, white sections, dark footer | about, pricing, free tools, `/for/*`, reports, benchmarks, help, blog, creator profiles, auth | `src/layouts/SiteLayout.tsx`, `src/components/site/*`, `src/pages/*` |

On the homepage the lower half (testimonials → footer) is rendered *outside* the zoomed canvas at 1:1, exactly like the live site; `LpLayout` exposes a `fluid` slot for that. Below 1024px the canvas zoom is disabled and the LP media queries take over.

## Project layout

```
supabase/migrations/   SQL schema: tables, indexes, triggers, RLS policies, storage buckets, RPCs
scripts/seed.mjs       seeds a hosted project (service-role key, local use only)
docs/SUPABASE.md       setup, deployment, data model, security, test checklist
src/
  App.tsx              routes (lazy-loaded pages) + global widgets + auth guards
  layouts/             LpLayout (landing canvas), SiteLayout (Jakarta pages), AppLayout (signed-in shell)
  lib/supabase.ts      the single browser client (env-driven, anon key only)
  lib/auth.tsx         AuthProvider, RequireAuth / RequireRole / RedirectIfAuthed
  lib/queries.ts       creator search (server-side filters, sort, pagination) + useQuery helper
  lib/database.types.ts  typed schema for supabase-js
  pages/app/           dashboards: company/*, creator/*, shared (deal, messages, notifications, settings)
  components/app/      dashboard UI kit, marketplace creator card, booking modal
  components/
    lp/                landing nav, footer, icons, FAQ accordion, post cards
    home/              homepage sections
    creators/          /creators sections
    site/              SiteNav, SiteFooter and shared Jakarta-page blocks
    shared/            LocaleButton, CookieConsent, ChatWidget
  pages/               one file per route (or route family)
  data/                nav/footer/FAQ copy (EN/FR), extracted blog posts and creator profiles
  hooks/               usePageZoom, useRevealOnScroll, useCountUp
  lib/locale.tsx       EN/FR context stored in the `locale` cookie like the live site
  styles/              globals.css (tokens), lp.css, agencies.css, widgets.css
scripts/               extractors that turn captured HTML into src/data/*.json
public/                logos, landing-page imagery, fonts, PDFs, llms.txt, pricing.md
```

## Behaviour reproduced

- Fixed nav with compact + frosted states on scroll, Resources popover, burger menu below 1024px
- EN/FR switch (cookie-backed, same `localeIn` animation), cookie-consent banner + persistent "Cookies" button (`naano:analytics-consent`)
- Reveal-on-scroll (`.rv` / `.fade-up`), count-up numbers (`[data-cu]`), word-by-word quote reveal, logo marquee, hover lifts, FAQ accordions (single open), video testimonial play state
- Floating assistant prompt (visual recreation of the third-party Barkan widget; the assistant backend is not public, so replies are local)

## Data

- `scripts/extract-blog.mjs` → `src/data/blog-posts.json` + `blog-listing.json` (53 posts, EN/FR listing copy)
- `scripts/extract-creators.mjs` → `data/creators.json` (374 public creator profiles), then `scripts/split-creators.mjs` → `public/data/creators/<slug>.json`, fetched per profile page
- Sector pages, benchmarks, comparison articles, pricing, FAQs and nav/footer copy live as typed EN/FR objects in `src/data/`

## The application (hosted Supabase)

Naano's real product sits behind its login, so the app is a clean, documented equivalent of the observable behaviour (the marketplace screenshot on the landing page, the creator card preview on `/register`, public creator profiles, the pricing/FAQ copy) rather than a guess at private screens:

- **Auth**: email + password (with confirmation email), LinkedIn / Google OAuth (once enabled in the Supabase dashboard), password recovery by link or 6-digit code, persistent sessions, protected routes, role-based landing.
- **Roles**: `company` or `creator`, written once by a database trigger from the signup metadata (or chosen once after an OAuth signup), immutable afterwards, enforced by RLS — the client never decides what a user may see.
- **Company**: onboarding, overview, marketplace (search, niche/country/audience/price filters, sort, pagination, bookmarks, direct booking), creator profiles, campaigns (draft → open → closed → completed), applications review, deals, results tracking, analytics, messages, notifications, settings.
- **Creator**: 4-step onboarding, live-updating marketplace card, browse/apply to open campaigns, applications, deals (invited → accepted → draft → scheduled → live → completed), performance, earnings, messages, notifications, settings.
- **Data**: `data/creators.json` (374 captured public profiles) is imported into the `creators` table by the seed script; the public `/creators/:slug` pages keep rendering from the captured JSON so they need no configuration.

## Known gaps (not reproducible from the public site)

- The assistant prompt is a third-party widget (Barkan) with a private backend; the clone keeps the UI and answers locally.
- The private app screens (dashboards, campaign tooling, matching score) are not observable; the clone implements a documented equivalent. The card "MATCHING" bar uses a simple heuristic (`matchingScore` in `src/lib/queries.ts`), not Naano's algorithm.
- Agency onboarding steps 2–3 (`/agency`, `/talent-agency`) remain UI-only.
- `/privacy` and `/terms` trigger the same PDF downloads as the live site.
- The `/selection` shortlist form and the `/book` scheduler (a Google Calendar appointment embed) cannot reach Naano's backend.
- Payments are recorded as ledger rows (scheduled → paid) by database triggers; no card processing is wired in.

See `CAPTURE-TEST.md` for the prompt/response capture setup that ships with this repo.
