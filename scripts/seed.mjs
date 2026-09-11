#!/usr/bin/env node
/**
 * Seeds a HOSTED Supabase project with demo data. Run locally only:
 *
 *   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/seed.mjs
 *
 * (or put those two lines in .env.local — the file is git-ignored — and run `npm run seed`).
 *
 * The service-role key bypasses RLS and must NEVER be shipped to the browser
 * or committed. This script never writes it anywhere.
 *
 * What it does (idempotent — safe to re-run):
 *   1. Imports the 374 captured public creator profiles (data/creators.json)
 *      into `creators` + `creator_posts` (upsert by slug).
 *   2. Creates two demo accounts (confirmed, ready to sign in):
 *        demo.brand@example.com    → company "Leadbay"
 *        demo.creator@example.com  → creator card "Demo Creator"
 *      with the password from SEED_DEMO_PASSWORD, or a random one printed once.
 *   3. Creates campaigns, applications, deals (across the whole lifecycle),
 *      recorded results, payouts, a conversation and notifications for them.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { resolve } from 'node:path'

// --- config -----------------------------------------------------------------
function loadEnvLocal() {
  const p = resolve(process.cwd(), '.env.local')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnvLocal()

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY in the environment or .env.local.')
  process.exit(1)
}
const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

const DEMO_BRAND_EMAIL = 'demo.brand@example.com'
const DEMO_CREATOR_EMAIL = 'demo.creator@example.com'
const password = process.env.SEED_DEMO_PASSWORD || `Naano-${randomBytes(6).toString('base64url')}`

const must = ({ data, error }) => {
  if (error) throw new Error(error.message)
  return data
}
const num = (v) => {
  if (v == null || v === '') return null
  const s = String(v).trim().toUpperCase().replace(/,/g, '')
  const m = s.match(/^([\d.]+)\s*([KM])?$/)
  if (!m) return null
  return Math.round(parseFloat(m[1]) * (m[2] === 'K' ? 1e3 : m[2] === 'M' ? 1e6 : 1))
}
const pct = (v) => (v == null ? null : Number(String(v).replace('%', '')) || null)
const daysAgo = (n) => new Date(Date.now() - n * 86400e3).toISOString()
const dateIn = (n) => new Date(Date.now() + n * 86400e3).toISOString().slice(0, 10)

// --- 1. public creator directory --------------------------------------------
async function importCreators() {
  const raw = JSON.parse(readFileSync(resolve(process.cwd(), 'data/creators.json'), 'utf8'))
  const list = Array.isArray(raw) ? raw : raw.creators ?? Object.values(raw)
  console.log(`Importing ${list.length} creators…`)
  const rows = list.map((c) => {
    const about = c.sections?.find((s) => s.kind === 'about')
    const m = c.meta ?? {}
    return {
      slug: c.slug,
      name: c.name,
      headline: c.headline ?? null,
      position: about?.position ?? null,
      bio: about?.bio ?? null,
      avatar_url: c.avatarUrl ?? null,
      country: m.country ?? c.location ?? null,
      languages: [],
      sectors: c.sectors ?? [],
      linkedin_url: m.linkedinUrl ?? null,
      followers: m.followers ?? num(c.headerStats?.find((s) => s.key === 'followers')?.value),
      median_views: m.avgViews ?? num(c.headerStats?.find((s) => s.key === 'avgViews')?.value),
      avg_reactions: m.avgReactions ?? null,
      avg_comments: m.avgComments ?? null,
      engagement_rate: pct(m.engagement ?? c.headerStats?.find((s) => s.key === 'engagement')?.value),
      price_cents: m.showPricing === false ? null : (m.priceCents ?? null),
      bundle_posts: m.bundles?.[0]?.posts ?? null,
      bundle_price_cents: m.bundles?.[0]?.priceCents ?? null,
      accepting_bookings: m.acceptingBookings ?? c.badge !== 'paused',
      is_public: true,
      stats_updated_at: m.statsUpdatedAt ?? null,
    }
  })
  const ids = new Map()
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50)
    const data = must(await db.from('creators').upsert(chunk, { onConflict: 'slug' }).select('id, slug'))
    data.forEach((r) => ids.set(r.slug, r.id))
    process.stdout.write(`  ${Math.min(i + 50, rows.length)}/${rows.length}\r`)
  }
  console.log('\n  creators done. Importing posts…')
  // Posts: replace per creator (simple + idempotent)
  const posts = []
  for (const c of list) {
    const section = c.sections?.find((s) => s.kind === 'posts')
    const creatorId = ids.get(c.slug)
    if (!section || !creatorId) continue
    for (const p of section.posts.slice(0, 6)) {
      if (!p.text) continue
      posts.push({ creator_id: creatorId, kind: p.type || null, body: p.text, reactions: num(p.reactions) ?? 0, comments: num(p.comments) ?? 0, url: p.url || null, via_naano: !!p.naano })
    }
  }
  must(await db.from('creator_posts').delete().in('creator_id', [...ids.values()]))
  for (let i = 0; i < posts.length; i += 200) must(await db.from('creator_posts').insert(posts.slice(i, i + 200)))
  console.log(`  ${posts.length} posts done.`)
  return ids
}

// --- 2. demo accounts -------------------------------------------------------
async function resetUser(email, meta) {
  // listUsers is paginated; the demo emails are looked up page by page.
  let page = 1
  for (;;) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw new Error(error.message)
    const found = data.users.find((u) => u.email === email)
    if (found) {
      must(await db.auth.admin.deleteUser(found.id)) // cascades: profile → company/creator → campaigns → …
      break
    }
    if (data.users.length < 200) break
    page++
  }
  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: meta })
  if (error) throw new Error(error.message)
  // wait for the profile trigger
  for (let i = 0; i < 10; i++) {
    const { data: p } = await db.from('profiles').select('id').eq('id', data.user.id).maybeSingle()
    if (p) return data.user
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('profile row was not created by the trigger — is the migration applied?')
}

async function seedDemo(creatorIds) {
  console.log('Creating demo accounts…')
  const brandUser = await resetUser(DEMO_BRAND_EMAIL, { role: 'company', full_name: 'Alex Martin' })
  const creatorUser = await resetUser(DEMO_CREATOR_EMAIL, { role: 'creator', full_name: 'Demo Creator' })
  must(await db.from('profiles').update({ onboarding_completed: true }).in('id', [brandUser.id, creatorUser.id]))

  const company = must(
    await db
      .from('companies')
      .insert({
        owner_id: brandUser.id,
        name: 'Leadbay',
        website: 'https://leadbay.app',
        industry: 'sales-tech',
        size: '11-50',
        country: 'FR',
        description: 'AI-powered lead scoring for B2B sales teams. We help SDRs focus on the 20% of accounts that close.',
        logo_url: null,
      })
      .select()
      .single(),
  )

  const demoCreator = must(
    await db
      .from('creators')
      .upsert(
        {
          user_id: creatorUser.id,
          slug: 'demo-creator',
          name: 'Demo Creator',
          headline: 'Head of Growth | Writing about B2B GTM, PLG and sales-marketing alignment',
          position: 'Head of Growth @ Northwind',
          bio: 'I post twice a week about go-to-market for B2B SaaS: what worked, what flopped, with the numbers. 8 years in growth roles at three venture-backed startups.',
          country: 'GB',
          languages: ['English'],
          sectors: ['Growth / GTM', 'SaaS', 'Marketing'],
          linkedin_url: 'https://www.linkedin.com/in/demo-creator',
          followers: 14100,
          median_views: 18700,
          avg_reactions: 210,
          avg_comments: 38,
          engagement_rate: 3.1,
          price_cents: 36000,
          bundle_posts: 3,
          bundle_price_cents: 95000,
          accepting_bookings: true,
          is_public: true,
          stats_updated_at: daysAgo(3),
        },
        { onConflict: 'slug' },
      )
      .select()
      .single(),
  )

  // A few imported creators to populate applications and deals
  const pick = must(await db.from('creators').select('id, name, price_cents').is('user_id', null).not('price_cents', 'is', null).gt('followers', 5000).order('followers', { ascending: false }).limit(6))
  const [c1, c2, c3, c4, c5] = pick

  console.log('Creating campaigns…')
  const campaigns = must(
    await db
      .from('campaigns')
      .insert([
        {
          company_id: company.id,
          title: 'Launch: Leadbay AI lead scoring for SDR teams',
          description: 'We are launching lead scoring that plugs into HubSpot and Salesforce in 10 minutes. Looking for sales and RevOps creators to share an honest take on how they prioritise accounts today, and where AI scoring fits.',
          objective: 'leads',
          brief: 'Angle: "how I decide which accounts to work first". Mention Leadbay naturally as a tool you tried; link to the 14-day trial. No feature lists. One post, image or text.',
          creator_requirements: 'Posts about sales, RevOps or GTM. Audience mostly in B2B SaaS. English.',
          target_audience: 'Heads of Sales / RevOps at 50–500 person B2B SaaS companies',
          industry: 'sales-tech',
          sectors: ['Sales', 'Growth / GTM', 'SaaS'],
          min_followers: 3000,
          budget_cents: 300000,
          price_per_post_cents: 30000,
          posts_wanted: 6,
          start_date: dateIn(-20),
          end_date: dateIn(25),
          status: 'published',
        },
        {
          company_id: company.id,
          title: 'Case study amplification: how Acme cut SDR ramp time by 40%',
          description: 'We published a customer story with Acme. We want 3 creators in the HR-tech / sales-enablement space to react to it with their own experience of ramping new reps.',
          objective: 'awareness',
          brief: 'Share one lesson about ramping SDRs and link the case study. Keep it in your voice.',
          creator_requirements: 'Sales leadership or enablement background.',
          target_audience: 'Sales managers and enablement leads',
          industry: 'sales-tech',
          sectors: ['Sales', 'HR', 'Recruiting / Talent'],
          min_followers: 2000,
          budget_cents: 90000,
          price_per_post_cents: 25000,
          posts_wanted: 3,
          status: 'published',
        },
        {
          company_id: company.id,
          title: 'Q4 product update (draft)',
          description: 'Placeholder brief for the Q4 release — to be completed once the feature set is final. Not visible to creators while in draft.',
          objective: 'signups',
          sectors: ['SaaS', 'Productivity'],
          budget_cents: 150000,
          posts_wanted: 4,
          status: 'draft',
        },
      ])
      .select(),
  )
  const [camp1, camp2] = campaigns

  console.log('Creating applications and deals…')
  // Applications to campaign 1: one accepted (becomes a deal via trigger), one pending, one rejected, plus the demo creator pending
  must(await db.from('campaign_applications').insert([
    { campaign_id: camp1.id, creator_id: c1.id, message: `I run a weekly series on outbound prioritisation — this fits naturally. I'd frame it around my own scoring spreadsheet vs. a tool.`, proposed_price_cents: c1.price_cents },
    { campaign_id: camp1.id, creator_id: c2.id, message: 'Happy to test Leadbay on my current pipeline and post the before/after.', proposed_price_cents: c2.price_cents },
    { campaign_id: camp1.id, creator_id: c3.id, message: 'Interested — my audience is mostly founders though.', proposed_price_cents: c3.price_cents },
    { campaign_id: camp2.id, creator_id: demoCreator.id, message: 'I ramped 12 SDRs at Northwind last year and wrote about what worked. Would love to react to the Acme story with real numbers.', proposed_price_cents: 36000 },
  ]))
  const apps = must(await db.from('campaign_applications').select('id, creator_id, campaign_id').eq('campaign_id', camp1.id))
  must(await db.from('campaign_applications').update({ status: 'accepted' }).eq('id', apps.find((a) => a.creator_id === c1.id).id))
  must(await db.from('campaign_applications').update({ status: 'rejected' }).eq('id', apps.find((a) => a.creator_id === c3.id).id))

  // Direct bookings on campaign 1: a live post with results, a completed one with payout, and a pending invitation to the demo creator
  const live = must(await db.from('collaborations').insert({ campaign_id: camp1.id, company_id: company.id, creator_id: c4.id, status: 'accepted', agreed_price_cents: c4.price_cents, brief: 'See campaign brief. Please tag @Leadbay.', due_date: dateIn(-3) }).select().single())
  must(await db.from('collaborations').update({ status: 'draft_ready', post_url: 'https://docs.google.com/document/d/demo-draft' }).eq('id', live.id))
  must(await db.from('collaborations').update({ status: 'scheduled' }).eq('id', live.id))
  must(await db.from('collaborations').update({ status: 'live', post_url: 'https://www.linkedin.com/posts/demo-live-post', published_at: daysAgo(2) }).eq('id', live.id))
  must(await db.from('collaboration_metrics').update({ impressions: 24800, clicks: 412, leads: 9, pipeline_cents: 1800000 }).eq('collaboration_id', live.id))

  const done = must(await db.from('collaborations').insert({ campaign_id: camp1.id, company_id: company.id, creator_id: c5.id, status: 'accepted', agreed_price_cents: c5.price_cents, due_date: dateIn(-12) }).select().single())
  must(await db.from('collaborations').update({ status: 'draft_ready' }).eq('id', done.id))
  must(await db.from('collaborations').update({ status: 'scheduled' }).eq('id', done.id))
  must(await db.from('collaborations').update({ status: 'live', post_url: 'https://www.linkedin.com/posts/demo-completed-post', published_at: daysAgo(10) }).eq('id', done.id))
  must(await db.from('collaboration_metrics').update({ impressions: 41200, clicks: 690, leads: 17, pipeline_cents: 3400000 }).eq('collaboration_id', done.id))
  must(await db.from('collaborations').update({ status: 'completed' }).eq('id', done.id))

  must(await db.from('collaborations').insert({ campaign_id: camp1.id, company_id: company.id, creator_id: demoCreator.id, status: 'invited', agreed_price_cents: 36000, brief: 'Loved your GTM series. Same brief as the campaign — one post, your angle on account prioritisation.', due_date: dateIn(10) }))

  // Bookmarks + a conversation
  must(await db.from('bookmarks').insert([{ company_id: company.id, creator_id: demoCreator.id }, { company_id: company.id, creator_id: c2.id }]))
  const conv = must(await db.from('conversations').insert({ company_id: company.id, creator_id: demoCreator.id, campaign_id: camp1.id }).select().single())
  must(await db.from('messages').insert([
    { conversation_id: conv.id, sender_id: brandUser.id, body: 'Hi! We just sent you an invitation for the Leadbay launch. Happy to answer any question about the product.' },
    { conversation_id: conv.id, sender_id: creatorUser.id, body: 'Thanks Alex — reading the brief now. Is a text-only post OK, or do you prefer an image?' },
    { conversation_id: conv.id, sender_id: brandUser.id, body: 'Text is perfect. Your voice matters more than visuals here.' },
  ]))

  console.log(`\nDone. Demo accounts (password shown once, not stored anywhere):`)
  console.log(`  ${DEMO_BRAND_EMAIL}     (company)`)
  console.log(`  ${DEMO_CREATOR_EMAIL}   (creator)`)
  console.log(`  password: ${password}`)
  return creatorIds
}

try {
  const ids = await importCreators()
  await seedDemo(ids)
} catch (e) {
  console.error('\nSeed failed:', e.message)
  process.exit(1)
}
