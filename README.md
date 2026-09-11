# Naano clone

A front-end recreation of [naano.com](https://naano.com) (the B2B LinkedIn creator marketplace), built for the 8x assignment. The goal is a 1:1 reproduction of the publicly observable site: layout, copy, responsive behaviour, interactions and EN/FR localisation, with local data standing in for the private backend.

## Stack

- Vite 6, React 19, TypeScript, Tailwind CSS v4, react-router-dom v7
- No UI library. Every component is hand-written from the observed markup and computed styles.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## How the original site is built (and how the clone mirrors it)

naano.com uses two visual systems, and so does this repo:

| System | Live pages | Clone |
|---|---|---|
| **Landing canvas** (`naano-lp`): a fixed 1672px design canvas scaled with CSS `zoom: 100vw / 1672`, Inter LP webfont, cloud backgrounds, `data-screen-label` sections | `/`, `/creators`, `/agencies` (+ the LP nav on `/blog`, `/selection`, `/book`, `/case-studies/*`) | `src/layouts/LpLayout.tsx`, `src/components/lp/*`, `src/components/home/*`, `src/components/creators/*`, `src/styles/lp.css`, `src/styles/agencies.css` |
| **Plus Jakarta Sans / Tailwind** pages: fixed transparent nav, white sections, dark footer | about, pricing, free tools, `/for/*`, reports, benchmarks, help, blog, creator profiles, auth | `src/layouts/SiteLayout.tsx`, `src/components/site/*`, `src/pages/*` |

On the homepage the lower half (testimonials → footer) is rendered *outside* the zoomed canvas at 1:1, exactly like the live site; `LpLayout` exposes a `fluid` slot for that. Below 1024px the canvas zoom is disabled and the LP media queries take over.

## Project layout

```
src/
  App.tsx              routes (lazy-loaded pages) + global widgets
  layouts/             LpLayout (landing canvas), SiteLayout (Jakarta pages)
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

## Known gaps

See `CAPTURE-TEST.md` for the capture setup, and the last section of the session log for anything marked UNKNOWN (behaviour that could not be verified from the public site is left as-is rather than invented).
