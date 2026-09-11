/**
 * Builds data/creators.json from the captured creator profile pages in the
 * recon folder. Run: node scripts/extract-creators.mjs <dir-with-creators-html>
 *
 * Each `<slug>.html` is the server-rendered /creators/<slug> page. The visible
 * markup (inline-styled, no classes) is parsed into a small DOM tree and walked
 * section by section, so the JSON mirrors exactly what the live page shows:
 * header (avatar, name, headline, location, sector chips, availability badge,
 * stat row), the ordered sections (about, audience & average metrics, recent
 * posts, who engages with you, pricing, creator-authored custom sections), the
 * "More creators in …" links, plus <title> / meta description. Numeric extras
 * (followers, price in cents, LinkedIn URL…) come from the page's embedded RSC
 * payload. Labels are stored as dictionary keys so the UI can render EN or FR.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = process.argv[2]
if (!dir) throw new Error('usage: node scripts/extract-creators.mjs <dir-with-creators-html>')

const here = path.dirname(fileURLToPath(import.meta.url))
const outFile = path.join(here, '..', 'data', 'creators.json')

/* ------------------------------------------------------------------ */
/* Label dictionary (EN strings as rendered → keys, see flatProfile i18n) */

const SECTION_TITLES = {
  About: 'about',
  'Audience & average metrics': 'audience',
  'Recent posts': 'posts',
  'Who engages with you': 'engagers',
  Pricing: 'pricing',
}
const STAT_LABELS = {
  Followers: 'followers',
  'Est. median reach': 'avgViews',
  'Avg reactions': 'avgReactions',
  'Avg comments': 'avgComments',
  Engagement: 'engagement',
  'Based in': 'basedIn',
  'Impressions · 90 days': 'impressions28d',
  'Avg impressions/post': 'avgImpressions',
  'Posts measured': 'impressionsCoverage',
}
const SENIORITY = {
  'Founder / C-level': 'seniorityFounder',
  'VP / Head / Director': 'seniorityVp',
  'Manager / Lead': 'seniorityManager',
  'Senior IC': 'senioritySenior',
  Other: 'seniorityOther',
}
const FUNCTIONS = {
  Founders: 'functionFounders',
  Marketing: 'functionMarketing',
  'Sales / BD': 'functionSales',
  Product: 'functionProduct',
  'Engineering / Data': 'functionEngineering',
  Design: 'functionDesign',
  'HR / Talent': 'functionHr',
  'Finance / VC': 'functionFinance',
  Consulting: 'functionConsulting',
}
const EMPTY_NOTES = {
  "First stats land ~3 hours after this creator's next post.": 'audiencePending',
  'Audience stats unlock once this creator completes their professional profile and we scrape their recent posts.': 'audienceLocked',
  "Recent posts will appear here within a few hours of this creator's next post.": 'postsPending',
  'Not enough engagement data yet to break down the audience.': 'notEnoughEngagementData',
}
const BADGES = { 'Available to book': 'availableToBook', 'Accepting bookings': 'acceptingBookings', Paused: 'paused' }

/* ------------------------------------------------------------------ */
/* Tiny HTML → tree parser (enough for the inline-styled profile markup) */

const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon'])

const decode = (s) =>
  String(s)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

function parseAttrs(s) {
  const attrs = {}
  for (const m of s.matchAll(/([a-zA-Z:-]+)(?:="([^"]*)")?/g)) attrs[m[1]] = m[2] === undefined ? '' : decode(m[2])
  return attrs
}

/** Parses an HTML fragment into {tag, attrs, children} nodes; text nodes are {text}. */
function parseHtml(html) {
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:\s+[^\s=>\/]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/g
  let m
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue
    if (m[1]) {
      const tag = m[1].toLowerCase()
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) {
          stack.length = i
          break
        }
      }
      continue
    }
    if (m[2]) {
      const tag = m[2].toLowerCase()
      const node = { tag, attrs: parseAttrs(m[3] || ''), children: [] }
      stack[stack.length - 1].children.push(node)
      if (!m[4] && !VOID.has(tag)) stack.push(node)
      continue
    }
    if (m[5]) {
      const text = decode(m[5])
      if (text.trim() === '' && !/\S/.test(text)) {
        // keep single spaces that separate inline content
        if (text.includes(' ')) stack[stack.length - 1].children.push({ text: ' ' })
        continue
      }
      stack[stack.length - 1].children.push({ text })
    }
  }
  return root
}

const isEl = (n) => n && n.tag !== undefined
const els = (n) => (n ? n.children.filter(isEl) : [])
const style = (n) => (n && n.attrs && n.attrs.style) || ''
const textOf = (n) => {
  if (!n) return ''
  if (n.text !== undefined) return n.text
  return n.children.map(textOf).join('')
}
const clean = (s) => s.replace(/\s+/g, ' ').trim()
function find(n, pred) {
  if (!n) return null
  if (isEl(n) && pred(n)) return n
  for (const c of n.children || []) {
    const r = isEl(c) ? find(c, pred) : null
    if (r) return r
  }
  return null
}
function findAll(n, pred, out = []) {
  if (!n) return out
  if (isEl(n) && pred(n)) out.push(n)
  for (const c of n.children || []) if (isEl(c)) findAll(c, pred, out)
  return out
}

/* ------------------------------------------------------------------ */
/* RSC payload (structured extras) */

function rscData(s) {
  const m = s.match(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)<\/script>/)
  if (!m) return null
  let all
  try {
    all = JSON.parse('"' + m[1] + '"')
  } catch {
    return null
  }
  const k = all.indexOf('"data":{"name"')
  if (k < 0) return null
  const start = k + 7
  let depth = 0
  let inStr = false
  for (let i = start; i < all.length; i++) {
    const c = all[i]
    if (inStr) {
      if (c === '\\') i++
      else if (c === '"') inStr = false
      continue
    }
    if (c === '"') inStr = true
    else if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(all.slice(start, i + 1))
        } catch {
          return null
        }
      }
    }
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Section parsers */

function parseAbout(section) {
  const col = els(section)[1]
  const out = { kind: 'about', position: null, bio: null, sectors: [] }
  for (const c of els(col)) {
    if (c.tag === 'div' && style(c).includes('font-weight:600') && !style(c).includes('flex-wrap')) out.position = clean(textOf(c))
    else if (c.tag === 'p') out.bio = textOf(c).trim()
    else if (c.tag === 'div' && style(c).includes('flex-wrap')) out.sectors = els(c).map((s) => clean(textOf(s)))
  }
  return out
}

function parseStatCards(grid) {
  return els(grid)
    .filter((c) => c.tag === 'div')
    .map((card) => {
      const [v, l] = els(card)
      const label = clean(textOf(l))
      const key = STAT_LABELS[label]
      if (!key) throw new Error('unknown stat label: ' + label)
      return { key, value: clean(textOf(v)) }
    })
}

function parseAudience(section) {
  const body = els(section)[1]
  const grid = find(body, (n) => style(n).includes('display:grid'))
  const out = { kind: 'audience', cards: parseStatCards(grid), note: null, updated: null }
  const noteP = els(grid).find((c) => c.tag === 'p')
  if (noteP) {
    const t = clean(textOf(noteP))
    out.note = EMPTY_NOTES[t]
    if (!out.note) throw new Error('unknown audience note: ' + t)
  }
  const updatedP = els(body).find((c) => c.tag === 'p')
  if (updatedP) {
    const m = clean(textOf(updatedP)).match(/^Stats updated (\d+) ([a-z]+) ago$/)
    if (!m) throw new Error('unknown stats-updated text: ' + textOf(updatedP))
    out.updated = { n: Number(m[1]), unit: m[2] }
  }
  return out
}

function parsePosts(section) {
  const body = els(section)[1]
  const out = { kind: 'posts', posts: [], empty: null }
  if (body.tag === 'p') {
    const t = clean(textOf(body))
    out.empty = EMPTY_NOTES[t]
    if (!out.empty) throw new Error('unknown posts note: ' + t)
    return out
  }
  for (const card of els(body)) {
    const [head, p, foot] = els(card)
    const headSpans = els(head)
    const naano = headSpans.some((s) => style(s).includes('text-transform:uppercase'))
    const typeSpan = headSpans.find((s) => style(s).includes('text-transform:capitalize'))
    const footEls = els(foot)
    const spans = footEls.filter((s) => s.tag === 'span')
    const link = footEls.find((s) => s.tag === 'a')
    out.posts.push({
      type: typeSpan ? clean(textOf(typeSpan)) : '',
      naano,
      text: textOf(p).trim(),
      reactions: clean(textOf(spans[0])),
      comments: clean(textOf(spans[1])),
      url: link ? link.attrs.href : '',
    })
  }
  return out
}

function parseEngagers(section) {
  const body = els(section)[1]
  const out = { kind: 'engagers', empty: false, seniority: [], functions: null }
  if (body.tag === 'p') {
    const t = clean(textOf(body))
    if (EMPTY_NOTES[t] !== 'notEnoughEngagementData') throw new Error('unknown engagers note: ' + t)
    out.empty = true
    return out
  }
  const blocks = els(body).filter((c) => c.tag === 'div')
  for (const block of blocks) {
    const heading = clean(textOf(els(block)[0]))
    if (heading === 'By seniority') {
      // each item is an unstyled wrapper div holding the label row and the bar track
      for (const item of els(block).slice(1)) {
        const [row, track] = els(item)
        const [labelSpan, valueSpan] = els(row)
        const label = clean(textOf(labelSpan))
        const key = SENIORITY[label]
        if (!key) throw new Error('unknown seniority label: ' + label)
        const fill = els(track)[0]
        const width = (style(fill).match(/^width:([\d.]+%)/) || [])[1]
        if (!width) throw new Error('missing seniority bar width for ' + label)
        out.seniority.push({ key, value: clean(textOf(valueSpan)), width })
      }
    } else if (heading === 'By function') {
      out.functions = []
      const chips = els(els(block)[1])
      for (const chip of chips) {
        const parts = chip.children
        const label = clean(textOf(parts[0]))
        const key = FUNCTIONS[label]
        if (!key) throw new Error('unknown function label: ' + label)
        const countSpan = parts.find((c) => isEl(c) && c.tag === 'span')
        out.functions.push({ key, value: clean(textOf(countSpan)) })
      }
    } else {
      throw new Error('unknown engagers block: ' + heading)
    }
  }
  return out
}

function parsePricing(section, slug) {
  const body = els(section)[1]
  const [cardsRow, cta] = els(body)
  const cards = els(cardsRow)
  const out = { kind: 'pricing', price: clean(textOf(els(cards[0])[0])), bundles: [], cta: cta ? cta.attrs.href : `/r/${slug}?deal=1` }
  for (const card of cards.slice(1)) {
    const summary = clean(textOf(els(card)[0]))
    const m = summary.match(/^(\d+) posts · (.+)$/)
    if (!m) throw new Error('unknown bundle summary: ' + summary)
    out.bundles.push({ count: Number(m[1]), price: m[2] })
  }
  return out
}

function parseCustom(section, title) {
  const rest = els(section).slice(1)
  const out = { kind: 'text', title, body: null, items: [] }
  for (const n of rest) {
    if (n.tag === 'p') out.body = textOf(n).trim()
    else if (n.tag === 'div') {
      for (const a of els(n).filter((c) => c.tag === 'a')) {
        const img = find(a, (x) => x.tag === 'img')
        const span = find(a, (x) => x.tag === 'span')
        out.items.push({ href: a.attrs.href, name: clean(textOf(span)), favicon: img ? img.attrs.src : '', title: a.attrs.title || '' })
      }
    }
  }
  if (out.items.length) out.kind = 'logos'
  return out
}

/* ------------------------------------------------------------------ */

function parseProfile(file) {
  const s = fs.readFileSync(file, 'utf8')
  const slug = path.basename(file, '.html')
  if (!s.includes('<main')) return { skipped: 'no main (error page)' }
  const mainStart = s.indexOf('<main')
  const mainEnd = s.indexOf('</main>') + 7
  const navStart = s.indexOf('<nav', mainEnd)
  const navEnd = navStart >= 0 ? s.indexOf('</nav>', navStart) + 6 : -1
  const tree = parseHtml(s.slice(mainStart, mainEnd) + (navStart >= 0 && navStart < navEnd ? s.slice(navStart, navEnd) : ''))
  const main = els(tree)[0]
  const nav = els(tree)[1]
  const wrap = els(main)[0]
  const [, hero, columns] = els(wrap)
  const ctaBox = els(wrap)[3]

  /* header card */
  const heroRow = els(hero)[1]
  const [avatar, info, badge] = els(heroRow)
  const infoEls = els(info)
  const h1 = find(info, (n) => n.tag === 'h1')
  const headlineP = infoEls.find((n) => n.tag === 'p')
  const chipsRow = infoEls.find((n) => n.tag === 'div' && style(n).includes('flex-wrap'))
  let location = null
  const sectors = []
  for (const span of els(chipsRow || { children: [] })) {
    if (find(span, (n) => n.tag === 'svg')) location = clean(textOf(span))
    else sectors.push(clean(textOf(span)))
  }
  const badgeText = badge ? clean(textOf(badge)) : null
  if (badgeText && !BADGES[badgeText]) throw new Error('unknown badge: ' + badgeText)
  const statsRow = els(hero)[2]
  const headerStats = statsRow ? parseStatCards(statsRow) : []

  /* sections */
  const sections = []
  for (const section of els(columns)) {
    const h2 = find(section, (n) => n.tag === 'h2')
    const title = clean(textOf(h2))
    const kind = SECTION_TITLES[title]
    if (kind === 'about') sections.push(parseAbout(section))
    else if (kind === 'audience') sections.push(parseAudience(section))
    else if (kind === 'posts') sections.push(parsePosts(section))
    else if (kind === 'engagers') sections.push(parseEngagers(section))
    else if (kind === 'pricing') sections.push(parsePricing(section, slug))
    else sections.push(parseCustom(section, title))
  }

  /* bottom CTA + related links */
  const ctaLink = find(ctaBox, (n) => n.tag === 'a')
  const moreCreators = []
  if (nav) {
    const firstP = els(els(nav)[0])[0]
    if (firstP && clean(textOf(firstP)).startsWith('More creators in')) {
      for (const a of findAll(firstP, (n) => n.tag === 'a')) moreCreators.push({ label: clean(textOf(a)), href: a.attrs.href })
    }
  }

  const data = rscData(s)
  const title = decode((s.match(/<title>([^<]*)<\/title>/) || [])[1] || '')
  const description = decode((s.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '')

  return {
    slug,
    name: clean(textOf(h1)),
    firstName: clean(textOf(h1)).split(' ')[0],
    headline: headlineP ? clean(textOf(headlineP)) : null,
    avatarUrl: avatar.tag === 'img' ? avatar.attrs.src : null,
    avatarInitial: avatar.tag === 'img' ? null : clean(textOf(avatar)),
    location,
    sectors,
    badge: badgeText ? BADGES[badgeText] : null,
    headerStats,
    sections,
    ctaHref: ctaLink ? ctaLink.attrs.href : `/r/${slug}?deal=1`,
    moreCreators,
    title,
    description,
    meta: data
      ? {
          followers: data.followers ?? null,
          engagement: data.engagement ?? null,
          avgViews: data.metrics?.avgViews ?? null,
          avgReactions: data.metrics?.avgReactions ?? null,
          avgComments: data.metrics?.avgComments ?? null,
          statsUpdatedAt: data.metrics?.statsUpdatedAt ?? null,
          country: data.country ?? null,
          linkedinUrl: data.linkedinUrl ?? null,
          priceCents: data.priceCents ?? null,
          bundles: (data.bundles || []).map((b) => ({ posts: b.posts, priceCents: b.price_cents })),
          acceptingBookings: !!data.acceptingBookings,
          showPricing: !!data.showPricing,
          postsCount: data.postsCount ?? null,
          engagersTotal: data.engagers?.total ?? null,
        }
      : null,
  }
}

/* ------------------------------------------------------------------ */

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.html'))
  .sort()
const profiles = []
const skipped = []
for (const f of files) {
  const file = path.join(dir, f)
  try {
    const p = parseProfile(file)
    if (p.skipped) skipped.push(`${f}: ${p.skipped}`)
    else profiles.push(p)
  } catch (e) {
    skipped.push(`${f}: ${e.message}`)
  }
}

fs.writeFileSync(outFile, JSON.stringify(profiles))

const has = (kind, pred = () => true) => profiles.filter((p) => p.sections.some((s) => s.kind === kind && pred(s))).length
const count = (pred) => profiles.filter(pred).length
console.log(`profiles: ${profiles.length} (skipped ${skipped.length})`)
for (const s of skipped) console.log('  skipped', s)
console.log(`about section:        ${has('about')} (with bio ${has('about', (s) => !!s.bio)}, with position ${has('about', (s) => !!s.position)})`)
console.log(`audience section:     ${has('audience')} (with stats-updated ${has('audience', (s) => !!s.updated)}, locked/pending note ${has('audience', (s) => !!s.note)})`)
console.log(`posts section:        ${has('posts')} (with posts ${has('posts', (s) => s.posts.length > 0)}, empty ${has('posts', (s) => !!s.empty)}, naano-tagged posts ${profiles.reduce((n, p) => n + p.sections.filter((s) => s.kind === 'posts').flatMap((s) => s.posts).filter((x) => x.naano).length, 0)})`)
console.log(`engagers section:     ${has('engagers')} (with data ${has('engagers', (s) => !s.empty)}, with functions ${has('engagers', (s) => Array.isArray(s.functions))}, empty ${has('engagers', (s) => s.empty)})`)
console.log(`pricing section:      ${has('pricing')} (with bundles ${has('pricing', (s) => s.bundles.length > 0)})`)
console.log(`custom sections:      ${count((p) => p.sections.some((s) => s.kind === 'text' || s.kind === 'logos'))} profiles, ${profiles.reduce((n, p) => n + p.sections.filter((s) => s.kind === 'text').length, 0)} text + ${profiles.reduce((n, p) => n + p.sections.filter((s) => s.kind === 'logos').length, 0)} logos`)
console.log(`availability badge:   ${count((p) => !!p.badge)} shown, ${count((p) => !p.badge)} hidden (paused)`)
console.log(`avatar image:         ${count((p) => !!p.avatarUrl)} (initial fallback ${count((p) => !p.avatarUrl)})`)
console.log(`headline / location:  ${count((p) => !!p.headline)} / ${count((p) => !!p.location)}`)
console.log(`more-creators links:  ${count((p) => p.moreCreators.length > 0)}`)
console.log(`rsc meta:             ${count((p) => !!p.meta)}`)
console.log(`written ${path.relative(process.cwd(), outFile)} (${(fs.statSync(outFile).size / 1024).toFixed(0)} KB)`)
