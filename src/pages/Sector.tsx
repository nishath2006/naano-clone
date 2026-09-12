import { Link, useParams } from 'react-router-dom'
import { SiteLayout } from '@/layouts/SiteLayout'
import NotFound from '@/pages/NotFound'
import { DarkHero, HeroBackLink } from '@/components/site/DarkHero'
import { ArticleH2 } from '@/components/site/ArticleH2'
import { ArticleCta } from '@/components/site/ArticleCta'
import { FaqList } from '@/components/site/FaqList'
import { FooterCta } from '@/components/site/FooterCta'
import { PillLink } from '@/components/site/Pill'
import { TextLink } from '@/components/site/TextLink'
import { SECTOR_ORDER, getSector, sectors, type Sector as SectorData } from '@/data/sectors'

const CHIP =
  'text-sm px-3.5 py-1.5 rounded-full border border-[#E5E7EB] text-[#374151] hover:border-[#9CA3AF] hover:text-[#111827] transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2'

/**
 * `/for/:sector` — one template for the eight vertical landing pages. The
 * live site serves the same English copy regardless of the locale cookie.
 */
export default function Sector() {
  const { sector } = useParams()
  const data = getSector(sector)
  if (!data) return <NotFound />
  return <SectorPage key={data.slug} s={data} />
}

function SectorPage({ s }: { s: SectorData }) {
  const stats = [
    { label: 'CPL p10', value: `€${s.p10}` },
    { label: 'CPL median', value: `€${s.median}` },
    { label: 'CPL p90', value: `€${s.p90}` },
    { label: 'Campaigns', value: `n=${s.n}` },
  ]
  const others = SECTOR_ORDER.filter((slug) => slug !== s.slug)

  return (
    <SiteLayout title={s.title} description={s.description} className="min-h-screen bg-white text-[#111827]">
      <DarkHero>
        <div className="mb-10">
          <HeroBackLink />
        </div>
        <div className="max-w-[840px]">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/85 font-semibold mb-6">NaanoX for {s.label}</p>
          <h1 className="text-[clamp(32px,5vw,54px)] font-light leading-[1.06] tracking-[-0.025em] mb-7">{s.h1}</h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">{s.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <PillLink href="/register" variant="white" arrow>
              Start a {s.short} campaign
            </PillLink>
            <PillLink href="/pricing" variant="outline">
              See pricing
            </PillLink>
          </div>
        </div>
      </DarkHero>

      <div className="px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
        <div className="max-w-[840px] mx-auto">
          <div className="text-[17px] text-[#1F2937] leading-[1.75]">
            <ArticleH2 scrollMargin={false} className="mt-4 border-t-0 pt-0">
              {s.label} benchmarks on NaanoX (Q1 2026)
            </ArticleH2>
            <p className="my-5">
              First-party cost-per-qualified-click data from the <TextLink href="/benchmarks/q2-2026">Q2 2026 benchmark report</TextLink>, measured
              across {s.n} {s.short} campaigns:
            </p>
            <div className="my-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((st) => (
                <div key={st.label} className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-5 text-center">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B7280] font-semibold mb-1.5">{st.label}</p>
                  <p className="text-2xl font-light tracking-[-0.02em] text-[#111827] tabular-nums">{st.value}</p>
                </div>
              ))}
            </div>
            <p className="my-5">{s.analysis}</p>
            <p className="my-5 text-sm text-[#6B7280]">
              Reference: platform-wide average CPL was €18 vs €55–90 typical for LinkedIn Ads in B2B SaaS. CPL = cost per qualified click
              (UTM-tracked, ≥30s on-site engagement). Cite as: NaanoX marketplace data, Q1 2026, n={s.n} {s.label} campaigns
              (https://naano.com/for/{s.slug}).
            </p>

            <ArticleH2 scrollMargin={false}>Who the {s.short} creators are</ArticleH2>
            <p className="my-5">{s.who}</p>
            <p className="my-5">
              Every creator publishes a fixed offer price — from €20 per post, median ~€150 — and briefs stay one page so posts read native to
              the creator's feed. Why small vertical creators beat big generalist ones is covered in{' '}
              <TextLink href="/blog/nano-vs-macro-creators-b2b-ctr">nano vs macro creators in B2B</TextLink>.
            </p>

            <ArticleH2 scrollMargin={false}>What {s.short} teams use NaanoX for</ArticleH2>
            <ul className="my-5 list-disc pl-6 marker:text-[#9CA3AF] space-y-2">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="my-5">
              The mechanics are the same in every vertical: book vetted creators at a fixed price, review drafts, track qualified clicks per
              post. The full playbook is in{' '}
              <TextLink href="/blog/launch-b2b-linkedin-creator-campaign">how to launch a B2B LinkedIn creator campaign in 30 days</TextLink>, and
              the strategic case in <TextLink href="/blog/creator-led-growth-b2b">the complete creator-led growth guide</TextLink>.
            </p>

            <ArticleH2 scrollMargin={false}>FAQ</ArticleH2>
            <FaqList items={s.faq} />

            <ArticleH2 scrollMargin={false}>NaanoX in other verticals</ArticleH2>
            <div className="my-6 flex flex-wrap gap-2">
              {others.map((slug) => (
                <Link key={slug} to={`/for/${slug}`} className={CHIP}>
                  {sectors[slug].label}
                </Link>
              ))}
            </div>
            <p className="my-5 text-sm text-[#6B7280]">
              Comparing tools instead? See the{' '}
              <TextLink href="/best-b2b-influencer-marketing-platforms-2026">best B2B influencer marketing platforms in 2026</TextLink>.
            </p>
          </div>

          <ArticleCta
            eyebrow="Get started"
            title={`Book vetted ${s.short} creators at a fixed price.`}
            body="2,000+ vetted LinkedIn micro-creators across B2B verticals. Fixed per-post pricing from €20, no platform subscription on Self-Serve, qualified clicks tracked on every post."
            primary={{ href: '/register', label: 'Start a campaign' }}
          />
        </div>
      </div>

      <FooterCta />
    </SiteLayout>
  )
}
