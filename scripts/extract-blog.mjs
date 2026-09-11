/**
 * Builds src/data/blog-posts.json from the captured blog HTML in the recon
 * folder. Run: node scripts/extract-blog.mjs <recon-html-dir>
 *
 * Extracted per post: slug, lang, category, title, excerpt, readMinutes,
 * published/updated dates, author, gradient, table of contents, article HTML,
 * and the alternate-language slug.
 */
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
if (!dir) throw new Error('usage: node scripts/extract-blog.mjs <dir-with-blog-html>')

const decode = (s) =>
  s
    .replace(/<!--\s*-->/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')

const text = (html = '') => decode(String(html).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

function between(s, start, endTag) {
  const i = s.indexOf(start)
  if (i < 0) return null
  const j = s.indexOf(endTag, i)
  return s.slice(i, j)
}

/** Returns inner HTML of the element whose opening tag starts at `idx` (depth aware for divs). */
function innerOf(s, idx, tag = 'div') {
  const open = s.indexOf('>', idx) + 1
  let depth = 1
  let i = open
  const re = new RegExp(`<(/?)${tag}\\b`, 'g')
  re.lastIndex = open
  let m
  while ((m = re.exec(s))) {
    depth += m[1] ? -1 : 1
    if (depth === 0) return s.slice(open, m.index)
    i = re.lastIndex
  }
  return s.slice(open, i)
}

function parsePost(file) {
  const s = fs.readFileSync(file, 'utf8')
  const slug = path.basename(file, '.html')
  const lang = (s.match(/<html[^>]*lang="([a-z]{2})"/) || [])[1] || 'en'
  const heroStart = s.indexOf('<section class="relative pt-28')
  const hero = s.slice(heroStart, s.indexOf('</section>', heroStart))
  const metaRow = between(hero, '<div class="flex items-center gap-3 mb-6', '</div>') || ''
  const spans = [...metaRow.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)].map((m) => text(m[1])).filter(Boolean)
  const category = spans[0] || ''
  const readMinutes = Number((spans.find((x) => /^\d+$/.test(x)) || '0')) || 0
  const title = text((hero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '')
  const excerpt = text((hero.match(/<p class="text-base sm:text-lg[^"]*"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '')
  const gradient = (hero.match(/background:(linear-gradient\([^)]*\))/) || [])[1] || ''

  const artStart = s.indexOf('<article')
  const article = s.slice(artStart, s.indexOf('</article>', artStart))
  const authorName = text((article.match(/<span class="block text-sm font-medium[^"]*"[^>]*>([\s\S]*?)<\/span>/) || [])[1] || '')
  const authorRole = text((article.match(/<span class="block text-xs text-\[#6B7280\]">([\s\S]*?)<\/span>/) || [])[1] || '')
  const authorLinkedin = (article.match(/<a href="(https:\/\/www\.linkedin\.com\/in\/[^"]+)"/) || [])[1] || ''
  const authorAvatar = decode((article.match(/<img src="([^"]+)"[^>]*class="w-11 h-11/) || [])[1] || '')
  const times = [...article.matchAll(/<time[^>]*>([^<]*)<\/time>/g)].map((m) => text(m[1]))
  const published = times[0] || ''
  const updated = times[1] || ''
  const alsoIn = article.match(/Also in|Aussi en[\s\S]{0,300}?<a href="([^"]+)"[^>]*>([^<]*)<\/a>/)
  const alternate = alsoIn ? { href: alsoIn[1], label: text(alsoIn[2]) } : null

  const proseIdx = article.indexOf('<div class="prose-blog')
  let body = proseIdx >= 0 ? innerOf(article, proseIdx) : ''
  body = body.replace(/<!--\s*-->/g, '').trim()

  const tocNav = between(s, '<nav class="hidden lg:block sticky', '</nav>') || ''
  const toc = [...tocNav.matchAll(/<a href="#([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({ id: m[1], text: text(m[2]) }))

  return { slug, lang, category, title, excerpt, readMinutes, published, updated, gradient, author: { name: authorName, role: authorRole, linkedin: authorLinkedin, avatar: authorAvatar }, alternate, toc, body }
}

function parseListing(file) {
  const s = fs.readFileSync(file, 'utf8')
  const cards = []
  const featured = s.match(/<a href="(\/blog\/[^"]+)" class="group grid[\s\S]*?<\/a>\s*<\/div>\s*<\/section>/)
  if (featured) {
    const f = featured[0]
    cards.push({
      slug: featured[1].replace('/blog/', ''),
      featured: true,
      gradient: (f.match(/background:(linear-gradient\([^)]*\))/) || [])[1] || '',
      dot: (f.match(/background-size:(\d+px \d+px)/) || [])[1] || '',
      category: text((f.match(/<span class="absolute top-6[^"]*"[^>]*>([^<]*)/) || [])[1] || ''),
      initials: text((f.match(/<span class="w-6 h-6 rounded-full[^"]*"[^>]*>([^<]*)/) || [])[1] || ''),
      date: text((f.match(/<time>([^<]*)/) || [])[1] || ''),
    })
  }
  const re = /<li[^>]*>\s*<a href="(\/blog\/[^"]+)" class="group block[\s\S]*?<\/li>/g
  let m
  while ((m = re.exec(s))) {
    const f = m[0]
    cards.push({
      slug: m[1].replace('/blog/', ''),
      featured: false,
      gradient: (f.match(/background:(linear-gradient\([^)]*\))/) || [])[1] || '',
      dot: (f.match(/background-size:(\d+px \d+px)/) || [])[1] || '',
      category: text((f.match(/<p class="text-\[10px\] font-semibold uppercase[^"]*"[^>]*>([^<]*)/) || [])[1] || ''),
      author: text((f.match(/<div class="flex flex-wrap items-center gap-3[^"]*"[^>]*>\s*<span>([^<]*)/) || [])[1] || ''),
      date: text((f.match(/<time>([^<]*)/) || [])[1] || ''),
    })
  }
  const topics = [...(between(s, '<div class="mt-10 flex flex-wrap gap-2">', '</div>') || '').matchAll(/rounded-full px-3 py-1">([^<]*)</g)].map((m) => text(m[1]))
  const count = text((s.match(/<span class="font-normal">([^<]*)<\/span>/) || [])[1] || '')
  return { cards, topics, count }
}

const postsDir = path.join(dir, 'blog')
const posts = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => parsePost(path.join(postsDir, f)))

const listingEn = parseListing(path.join(dir, 'blog.html'))
const listingFr = fs.existsSync(path.join(dir, 'fr', 'blog.html')) ? parseListing(path.join(dir, 'fr', 'blog.html')) : null

const out = { listing: { en: listingEn, fr: listingFr }, posts }
fs.mkdirSync('src/data', { recursive: true })
fs.writeFileSync('src/data/blog-posts.json', JSON.stringify(out))
console.log(`posts: ${posts.length}, listing cards: ${listingEn.cards.length}, fr cards: ${listingFr?.cards.length ?? 'n/a'}`)
console.log('sample:', JSON.stringify({ ...posts[0], body: posts[0].body.slice(0, 200) }, null, 1))
const missing = posts.filter((p) => !p.title || !p.body || !p.author.name)
console.log('incomplete:', missing.map((p) => p.slug))
