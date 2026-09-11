/**
 * Builds src/data/blog-posts.json from the captured blog HTML in the recon
 * folder. Run: node scripts/extract-blog.mjs <recon-html-dir>
 *
 * Output shape:
 *   listing.en / listing.fr — header copy, labels, featured card, grid cards
 *   posts[]                 — slug, lang, meta, hero, author, toc, tags, cta,
 *                             body HTML and (when captured) a `fr` variant
 *   proseClass              — the exact class attribute of the article body
 *   footerCta.en / .fr      — the blue "Ready to scale with naano?" block
 */
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
if (!dir) throw new Error('usage: node scripts/extract-blog.mjs <dir-with-blog-html>')

const decode = (s) =>
  String(s)
    .replace(/<!--\s*-->/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

const stripSvg = (html = '') => String(html).replace(/<svg[\s\S]*?<\/svg>/g, '')
const text = (html = '') => decode(stripSvg(html).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

function between(s, start, endTag, from = 0) {
  const i = s.indexOf(start, from)
  if (i < 0) return null
  const j = s.indexOf(endTag, i)
  return s.slice(i, j < 0 ? undefined : j)
}

/** Inner HTML of the element whose opening tag starts at `idx` (depth aware). */
function innerOf(s, idx, tag = 'div') {
  const open = s.indexOf('>', idx) + 1
  let depth = 1
  const re = new RegExp(`<(/?)${tag}\\b`, 'g')
  re.lastIndex = open
  let m
  while ((m = re.exec(s))) {
    depth += m[1] ? -1 : 1
    if (depth === 0) return s.slice(open, m.index)
  }
  return s.slice(open)
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))
  return m ? decode(m[1]) : ''
}

/** `/_next/image?url=%2Falex.png&w=…` → `/alex.png` */
function imageSrc(src) {
  const s = decode(src)
  const m = s.match(/[?&]url=([^&]+)/)
  return m ? decodeURIComponent(m[1]) : s
}

function parseTime(html) {
  const m = html.match(/<time([^>]*)>([^<]*)<\/time>/)
  return m ? { iso: attr(m[1], 'dateTime'), text: text(m[2]) } : null
}

function readMinutesOf(html) {
  // `<span class="inline-flex …">[svg]10<!-- --> <!-- -->min read</span>`
  const m = text(html).match(/(\d+)\s*(min[^<]*)/)
  return m ? { minutes: Number(m[1]), label: m[2].trim() } : { minutes: 0, label: '' }
}

function headMeta(s) {
  return {
    docTitle: text((s.match(/<title>([^<]*)<\/title>/) || [])[1] || ''),
    description: decode((s.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''),
    lang: (s.match(/<html[^>]*\slang="([a-z]{2})"/) || [])[1] || 'en',
  }
}

/* ------------------------------------------------------------------ posts */

function parsePost(file, slug) {
  const s = fs.readFileSync(file, 'utf8')
  const meta = headMeta(s)

  const heroStart = s.indexOf('<section class="relative pt-28')
  const hero = s.slice(heroStart, s.indexOf('</section>', heroStart))
  const gradient = (hero.match(/style="background:(linear-gradient\([^)]*\))"/) || [])[1] || ''
  const dot = (hero.match(/background-size:(\d+px \d+px)/) || [])[1] || ''
  const back = text((hero.match(/<a[^>]*href="\/blog">([^<]*)<\/a>/) || [])[1] || '')
  const metaRowIdx = hero.indexOf('<div class="flex items-center gap-3 mb-6')
  const metaRow = metaRowIdx >= 0 ? innerOf(hero, metaRowIdx) : ''
  const metaSpans = [...metaRow.matchAll(/<span([^>]*)>([\s\S]*?)<\/span>/g)]
    .filter((m) => !/aria-hidden/.test(m[1]))
    .map((m) => m[2])
  const category = text(metaSpans[0] || '')
  const read = readMinutesOf(metaSpans.find((x) => /<svg/.test(x)) || '')
  const langLabel = text(metaSpans[metaSpans.length - 1] || '')
  const title = text((hero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '')
  const excerpt = text((hero.match(/<p class="text-base sm:text-lg[^"]*">([\s\S]*?)<\/p>/) || [])[1] || '')

  const navIdx = s.search(/<nav[^>]*class="hidden lg:block sticky/)
  const tocNav = navIdx >= 0 ? innerOf(s, navIdx, 'nav') : ''
  const tocLabel = text((tocNav.match(/<p[^>]*>([^<]*)<\/p>/) || [])[1] || '')
  const toc = [...tocNav.matchAll(/<a href="#([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({ id: decode(m[1]), text: text(m[2]) }))

  const artStart = s.indexOf('<article')
  const article = s.slice(artStart, s.indexOf('</article>', artStart))

  const authorA = article.match(/<a href="(https:\/\/www\.linkedin\.com\/in\/[^"]+)"[^>]*class="flex items-center gap-3 group[^"]*">([\s\S]*?)<\/a>/)
  const authorHtml = authorA ? authorA[2] : ''
  const imgTag = (authorHtml.match(/<img[^>]*>/) || [])[0] || ''
  const author = {
    name: text((authorHtml.match(/<span class="block text-sm font-medium[^"]*">([\s\S]*?)<\/span>/) || [])[1] || ''),
    role: text((authorHtml.match(/<span class="block text-xs text-\[#6B7280\]">([\s\S]*?)<\/span>/) || [])[1] || ''),
    linkedin: authorA ? decode(authorA[1]) : '',
    avatar: imgTag ? imageSrc(attr(imgTag, 'src')) : '',
  }

  const datesIdx = article.indexOf('<div class="text-xs text-[#6B7280] space-y-0.5 sm:text-right">')
  const datesHtml = datesIdx >= 0 ? innerOf(article, datesIdx) : ''
  const dateRows = [...datesHtml.matchAll(/<div>([\s\S]*?)<\/div>/g)].map((m) => m[1])
  const dateRow = (html) => (html ? { label: text(html.replace(/<time[\s\S]*<\/time>/, '')), ...parseTime(html) } : null)
  const published = dateRow(dateRows[0])
  const updated = dateRow(dateRows[1])

  const alsoIn = article.match(/<span>([^<]*)<\/span><a hrefLang="([a-z]{2})"[^>]*href="([^"]+)">([^<]*)<\/a>/)
  const alternate = alsoIn ? { label: text(alsoIn[1]), lang: alsoIn[2], href: decode(alsoIn[3]), text: text(alsoIn[4]) } : null

  const proseIdx = article.indexOf('<div class="prose-blog')
  const proseTag = proseIdx >= 0 ? article.slice(proseIdx, article.indexOf('>', proseIdx) + 1) : ''
  const proseClass = attr(proseTag, 'class').replace(/\s+/g, ' ').trim()
  let body = proseIdx >= 0 ? innerOf(article, proseIdx) : ''
  body = body.replace(/<!--\s*-->/g, '').trim()

  const tagsIdx = article.indexOf('<div class="mt-14 pt-8 border-t border-[#E5E7EB] flex flex-wrap gap-2">')
  const tagsHtml = tagsIdx >= 0 ? innerOf(article, tagsIdx) : ''
  const tags = [...tagsHtml.matchAll(/<span[^>]*>([^<]*)<\/span>/g)].map((m) => text(m[1]))

  const ctaIdx = article.indexOf('<div class="mt-14 p-7 sm:p-9')
  const ctaHtml = ctaIdx >= 0 ? innerOf(article, ctaIdx) : ''
  const ctaA = ctaHtml.match(/<a href="([^"]+)"[^>]*>([\s\S]*?)<span[^>]*>([^<]*)<\/span><\/a>/)
  const cta = {
    eyebrow: text((ctaHtml.match(/<p class="text-\[11px\][^"]*">([^<]*)<\/p>/) || [])[1] || ''),
    title: text((ctaHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || ''),
    text: text((ctaHtml.match(/<p class="text-\[#4B5563\][^"]*">([\s\S]*?)<\/p>/) || [])[1] || ''),
    href: ctaA ? decode(ctaA[1]) : '/register',
    button: ctaA ? text(ctaA[2]) : '',
    arrow: ctaA ? text(ctaA[3]) : '→',
  }

  return {
    slug,
    lang: meta.lang,
    docTitle: meta.docTitle,
    description: meta.description,
    title,
    excerpt,
    category,
    readMinutes: read.minutes,
    readLabel: read.label,
    langLabel,
    back,
    gradient,
    dot,
    published,
    updated,
    author,
    alternate,
    tocLabel,
    toc,
    tags,
    cta,
    body,
    proseClass,
  }
}

/* ---------------------------------------------------------------- listing */

function parseCard(slug, html, featured) {
  const metaIdx = html.indexOf(featured ? '<div class="flex items-center gap-4' : '<div class="flex flex-wrap items-center gap-3')
  const metaHtml = metaIdx >= 0 ? innerOf(html, metaIdx) : ''
  const authorIdx = metaHtml.indexOf('<span')
  const authorSpan = authorIdx >= 0 ? innerOf(metaHtml, authorIdx, 'span') : ''
  const initials = text((authorSpan.match(/<span class="w-6 h-6[^"]*">([^<]*)<\/span>/) || [])[1] || '')
  const author = text(authorSpan.replace(/<span class="w-6 h-6[^"]*">[^<]*<\/span>/, ''))
  const read = readMinutesOf(metaHtml.match(/<span class="inline-flex items-center gap-1.5">[\s\S]*?lucide-clock[\s\S]*?<\/span>/)?.[0] || '')
  const date = parseTime(metaHtml)
  const gradient = (html.match(/style="background:(linear-gradient\([^)]*\))"/) || [])[1] || ''
  const dot = (html.match(/background-size:(\d+px \d+px)/) || [])[1] || ''
  return {
    slug,
    gradient,
    dot,
    category: text(
      (featured
        ? html.match(/<span class="absolute top-6[^"]*">([^<]*)<\/span>/)
        : html.match(/<p class="text-\[10px\] font-semibold uppercase[^"]*">([^<]*)<\/p>/)) ?.[1] || '',
    ),
    title: text((html.match(featured ? /<h2[^>]*>([\s\S]*?)<\/h2>/ : /<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1] || ''),
    excerpt: text((html.match(featured ? /<p class="text-base text-\[#4B5563\][^"]*">([\s\S]*?)<\/p>/ : /<p class="text-sm text-\[#4B5563\][^"]*">([\s\S]*?)<\/p>/) || [])[1] || ''),
    author,
    initials,
    readMinutes: read.minutes,
    readLabel: read.label,
    date,
  }
}

function parseListing(file) {
  const s = fs.readFileSync(file, 'utf8')
  const meta = headMeta(s)

  const headIdx = s.indexOf('<section class="px-4 sm:px-6 pt-32')
  const head = s.slice(headIdx, s.indexOf('</section>', headIdx))
  const eyebrowIdx = head.indexOf('<div class="flex items-center gap-3 mb-6')
  const eyebrowHtml = eyebrowIdx >= 0 ? innerOf(head, eyebrowIdx) : ''
  const eyebrowSpans = [...eyebrowHtml.matchAll(/<span([^>]*)>([\s\S]*?)<\/span>/g)].filter((m) => !/aria-hidden/.test(m[1])).map((m) => text(m[2]))
  const topicsIdx = head.indexOf('<div class="mt-10 flex flex-wrap gap-2">')
  const topicsHtml = topicsIdx >= 0 ? innerOf(head, topicsIdx) : ''
  const topicSpans = [...topicsHtml.matchAll(/<span class="([^"]*)">([^<]*)<\/span>/g)]

  const featuredM = s.match(/<a class="group grid[^"]*" href="(\/blog\/[^"]+)">([\s\S]*?)<\/a><\/div><\/section>/)
  const latestSection = between(s, '<section class="px-4 sm:px-6 pt-12', '</section>') || ''
  const featured = featuredM ? parseCard(featuredM[1].replace('/blog/', ''), featuredM[2], true) : null
  const readArticle = text((latestSection.match(/<span class="inline-flex items-center gap-1.5 text-sm font-medium[^"]*">([\s\S]*?)<\/span>/) || [])[1] || '')

  const moreIdx = s.indexOf('<section class="px-4 sm:px-6 pt-8 pb-24">')
  const moreHead = between(s, '<div class="flex items-baseline justify-between', '</div>', moreIdx) || ''
  const cards = []
  const re = /<li><a class="group block[^"]*" href="(\/blog\/[^"]+)">([\s\S]*?)<\/a><\/li>/g
  let m
  while ((m = re.exec(s))) cards.push(parseCard(m[1].replace('/blog/', ''), m[2], false))

  return {
    docTitle: meta.docTitle,
    description: meta.description,
    eyebrow: eyebrowSpans[0] || '',
    count: eyebrowSpans[1] || '',
    h1: text((head.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || ''),
    intro: text((head.match(/<p class="text-base sm:text-lg[^"]*">([\s\S]*?)<\/p>/) || [])[1] || ''),
    topicsLabel: text(topicSpans[0]?.[2] || ''),
    topics: topicSpans.slice(1).map((t) => text(t[2])),
    latestLabel: text((latestSection.match(/<p class="text-\[10px\][^"]*">([^<]*)<\/p>/) || [])[1] || ''),
    readArticle,
    moreLabel: text((moreHead.match(/<p[^>]*>([^<]*)<\/p>/) || [])[1] || ''),
    moreCount: text((moreHead.match(/<span[^>]*>([^<]*)<\/span>/) || [])[1] || ''),
    featured,
    cards,
  }
}

function parseFooterCta(file) {
  const s = fs.readFileSync(file, 'utf8')
  const f = s.indexOf('<footer')
  const block = s.slice(f, s.indexOf('<div class="relative overflow-hidden" style="background:var(--lp-footer)"', f))
  const inner = between(block, '<div class="relative z-10', '</div></div>') || ''
  const links = [...inner.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
  const h2 = (inner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || ''
  return {
    eyebrow: text((inner.match(/<p class="text-xs[^"]*"[^>]*>([^<]*)<\/p>/) || [])[1] || ''),
    titleBefore: text(h2.replace(/<span[\s\S]*$/, '')),
    titleBrand: text((h2.match(/<span[^>]*>([^<]*)<\/span>/) || [])[1] || ''),
    titleAfter: text(h2.replace(/^[\s\S]*<\/span>/, '')),
    text: text((inner.match(/<p class="text-white\/75[^"]*">([\s\S]*?)<\/p>/) || [])[1] || ''),
    primary: { href: decode(links[0]?.[1] || '/register'), label: text(links[0]?.[2] || '') },
    secondary: { href: decode(links[1]?.[1] || '/#how-it-works'), label: text(links[1]?.[2] || '') },
    note: text((inner.match(/<p class="text-\[12px\][^"]*">([^<]*)<\/p>/) || [])[1] || ''),
  }
}

/* ------------------------------------------------------------------- main */

const postsDir = path.join(dir, 'blog')
const frDir = path.join(dir, 'fr')
const posts = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => {
    const slug = path.basename(f, '.html')
    const post = parsePost(path.join(postsDir, f), slug)
    const frFile = path.join(frDir, `blog_${slug}.html`)
    if (fs.existsSync(frFile)) {
      const fr = parsePost(frFile, slug)
      // Only keep the French capture when the page is actually a translation.
      if (fr.lang === 'fr' && fr.langLabel === 'FR') post.fr = fr
    }
    return post
  })

const proseClasses = new Set(posts.map((p) => p.proseClass))
if (proseClasses.size !== 1) console.warn('WARNING: prose class differs between posts', proseClasses.size)
const proseClass = posts[0].proseClass
for (const p of posts) {
  delete p.proseClass
  if (p.fr) delete p.fr.proseClass
}

const listingEn = parseListing(path.join(dir, 'blog.html'))
const listingFr = fs.existsSync(path.join(frDir, 'blog.html')) ? parseListing(path.join(frDir, 'blog.html')) : null
const footerCta = {
  en: parseFooterCta(path.join(dir, 'blog.html')),
  fr: fs.existsSync(path.join(frDir, 'blog.html')) ? parseFooterCta(path.join(frDir, 'blog.html')) : null,
}

fs.mkdirSync('src/data', { recursive: true })
// Listing (light, used by /blog) and posts (heavy, bodies included) are split so
// the listing route does not ship every article body.
fs.writeFileSync('src/data/blog-listing.json', JSON.stringify({ listing: { en: listingEn, fr: listingFr }, footerCta }))
fs.writeFileSync('src/data/blog-posts.json', JSON.stringify({ proseClass, posts }))

console.log(`posts: ${posts.length} (fr variants: ${posts.filter((p) => p.fr).length}), listing cards: ${listingEn.cards.length} + featured ${listingEn.featured ? 1 : 0}, fr cards: ${listingFr?.cards.length ?? 'n/a'}`)
console.log('lang by post:', Object.entries(posts.reduce((a, p) => ((a[p.lang] = (a[p.lang] || 0) + 1), a), {})))
const check = (label, fn) => {
  const bad = posts.filter((p) => !fn(p)).map((p) => p.slug)
  console.log(`${label}: ${bad.length ? 'MISSING ' + bad.join(', ') : 'ok'}`)
}
check('title', (p) => p.title)
check('body', (p) => p.body.length > 500)
check('author', (p) => p.author.name && p.author.avatar && p.author.linkedin)
check('readMinutes', (p) => p.readMinutes > 0)
check('published', (p) => p.published?.iso)
check('toc', (p) => p.toc.length > 0)
check('tags', (p) => p.tags.length > 0)
check('cta', (p) => p.cta.title && p.cta.button)
console.log('updated present:', posts.filter((p) => p.updated).length, '| alternates:', posts.filter((p) => p.alternate).map((p) => p.slug))
const missingCards = listingEn.cards.filter((c) => !c.title || !c.author || !c.readMinutes || !c.date)
console.log('incomplete listing cards:', missingCards.map((c) => c.slug))
const unknownSlugs = [listingEn.featured?.slug, ...listingEn.cards.map((c) => c.slug)].filter((s) => !posts.some((p) => p.slug === s))
console.log('listing slugs without post capture:', unknownSlugs)
console.log('sample post:', JSON.stringify({ ...posts.find((p) => p.slug === 'naano-vs-alternatives'), body: '…', fr: undefined }, null, 1).slice(0, 1800))
console.log('sample listing:', JSON.stringify({ ...listingEn, cards: listingEn.cards.slice(0, 1) }, null, 1).slice(0, 1800))
