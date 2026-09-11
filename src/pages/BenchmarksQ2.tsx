import { Link } from 'react-router-dom'
import { SiteLayout } from '@/layouts/SiteLayout'
import { ArticleHero } from '@/components/site/DarkHero'
import { ArticleH2 } from '@/components/site/ArticleH2'
import { ArticleCta } from '@/components/site/ArticleCta'
import { DataTable, TD, TD_GREEN, TD_MUTED, TD_STRONG } from '@/components/site/DataTable'
import { FooterCta } from '@/components/site/FooterCta'
import { ReadingProgress } from '@/components/site/ReadingProgress'
import { TableOfContents } from '@/components/site/TableOfContents'
import { TextLink } from '@/components/site/TextLink'
import {
  benchmarksMeta as m,
  benchmarksToc,
  cplHead,
  ctrHead,
  ctrRows,
  funnelHead,
  funnelRows,
  headlineHead,
  headlineRows,
  launchHead,
  launchRows,
  limitations,
  verticalNotes,
} from '@/data/benchmarks-q2-2026'
import { SECTOR_ORDER, sectors } from '@/data/sectors'

const STRONG = 'text-[#111827] font-medium'
const CODE = 'bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[0.92em] text-[#111827] border border-[#E5E7EB]'
const NOTE = 'my-5 text-sm text-[#6B7280]'
const VERTICAL_LINK = 'hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] rounded-sm'

function Code({ children }: { children: string }) {
  return <code className={CODE}>{children}</code>
}

/** `/benchmarks/q2-2026` — the Q2 2026 benchmark report (English only on the live site). */
export default function BenchmarksQ2() {
  const cplRows = SECTOR_ORDER.map((slug) => {
    const s = sectors[slug]
    return [
      <Link key={slug} to={`/for/${slug}`} className={VERTICAL_LINK}>
        {s.label}
      </Link>,
      `€${s.p10}`,
      `€${s.median}`,
      `€${s.p90}`,
      `n=${s.n}`,
    ]
  })

  return (
    <SiteLayout title={m.title} description={m.description} className="min-h-screen bg-white text-[#111827]">
      <ReadingProgress />
      <ArticleHero kicker={m.kicker} readTime={m.readTime} lang="EN" title={m.h1} lede={m.lede} meta={m.published} />

      <div className="px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 lg:gap-x-16">
          <aside className="lg:col-span-3 lg:order-2">
            <TableOfContents items={benchmarksToc} label="On this page" />
          </aside>
          <article className="lg:col-span-9 lg:order-1">
            <div className="prose-bench text-[17px] text-[#1F2937] leading-[1.75] max-w-[72ch] tabular-nums">
              <div role="note" className="my-6 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#374151] leading-relaxed">
                <strong className={STRONG}>Editorial note (July 14, 2026):</strong> the data in this report was measured in Q1 2026 under Naano's
                earlier cost-per-click pricing model. Since then, Naano has moved to creator-defined fixed-price offers, see{' '}
                <TextLink href="/pricing">current pricing</TextLink>. The performance benchmarks below (CPL, CTR, conversion) remain valid as
                historical Q1 2026 data.
              </div>
              <p className="text-[19px] leading-[1.7] text-[#111827]">
                This is the first edition of Naano's quarterly benchmark report on B2B creator-led growth. It publishes the proprietary CPL, CTR,
                time-to-launch, and conversion metrics from every campaign that ran on the Naano marketplace during Q1 2026. Numbers are
                first-party measurements, not estimates, and every table includes the sample size behind it. Where useful, we compare against
                the most recent public LinkedIn benchmarks so marketers can calibrate against the channels they already run.
              </p>

              <ArticleH2 id="executive-summary">Executive summary</ArticleH2>
              <ul className="my-5 list-disc pl-6 marker:text-[#9CA3AF] space-y-2">
                <li>
                  <strong className={STRONG}>Average CPL on Naano in Q1 2026 was €18.10</strong> across 312 campaigns, ~67–80% below typical
                  LinkedIn Ads CPL for comparable B2B SaaS audiences (€55–€90). The lowest vertical (marketing-ops, median €16) and the highest
                  (vertical SaaS, median €21) bracket a tighter-than-expected distribution.
                </li>
                <li>
                  <strong className={STRONG}>CTR on creator-led posts averaged 12.0%</strong> across 1,847 posts, roughly 15× the LinkedIn
                  Sponsored Content benchmark (0.8%). CTR scales inversely with creator follower count: 1k–3k creators clocked 13.8% median CTR,
                  10k+ creators clocked 8.7%.
                </li>
                <li>
                  <strong className={STRONG}>Median time-to-launch was 7 days</strong> from brief submission to first post live, with a p25 of 5
                  days and a p75 of 10 days. Implied qualified-click → SQL conversion rate across the full funnel was approximately 3.4%.
                </li>
              </ul>

              <ArticleH2 id="methodology">Methodology</ArticleH2>
              <p className="my-5">
                All data in this report is drawn directly from Naano's production database. We did not survey customers, model missing values,
                or extrapolate from a sub-sample. Every campaign that completed at least one paid post during the data window is included.
              </p>
              <ul className="my-5 list-disc pl-6 marker:text-[#9CA3AF] space-y-2">
                <li>
                  <strong className={STRONG}>Data window:</strong> 2026-01-01 to 2026-03-31 (Q1 2026).
                </li>
                <li>
                  <strong className={STRONG}>Sample:</strong> 312 campaigns from 89 distinct brands; 1,847 individual sponsored posts; ~300 active
                  creators from the Naano roster.
                </li>
                <li>
                  <strong className={STRONG}>Definition of “qualified click”:</strong> a click that (a) carries a Naano UTM parameter, (b)
                  successfully resolves to the brand's landing page, and (c) records ≥30 seconds of on-site engagement before a bounce. Bots and
                  crawlers are filtered server-side; visits are deduplicated to one per IP per hour.
                </li>
                <li>
                  <strong className={STRONG}>Definition of “vertical”:</strong> campaigns are tagged at brief creation with one of{' '}
                  <Code>sales-tech</Code>, <Code>RevOps</Code>, <Code>devtools</Code>, <Code>product</Code>, <Code>HR-tech</Code>,{' '}
                  <Code>fintech</Code>, <Code>marketing-ops</Code>, or <Code>vertical-SaaS</Code>. A campaign appears in only one vertical
                  bucket.
                </li>
                <li>
                  <strong className={STRONG}>Comparison baselines:</strong> the LinkedIn B2B Marketing Benchmark 2025 (CTR, CPM), public LinkedIn
                  Ads CPC ranges as reported by industry analysts, and Naano-internal pre-campaign baselines collected at brand-onboarding intake.
                </li>
                <li>
                  <strong className={STRONG}>Statistics:</strong> “average” refers to the mean unless otherwise noted. Quartiles (p25, p75) are
                  computed on the full underlying distribution, not on per-campaign aggregates.
                </li>
              </ul>

              <ArticleH2 id="headline-benchmarks">Headline benchmarks</ArticleH2>
              <p className="my-5">
                The table below compares the five metrics most often cited in B2B SaaS budget conversations. Naano figures are Q1 2026 means;
                LinkedIn Ads ranges reflect the most recent publicly reported values for B2B SaaS audiences in EU and US markets.
              </p>
              <DataTable head={headlineHead} rows={headlineRows} cellClasses={[TD, TD_STRONG, TD, TD_GREEN]} />
              <p className={NOTE}>
                Sample: 312 campaigns / 1,847 posts / 89 brands. CPL = total paid spend ÷ qualified clicks. CTR = qualified clicks ÷ impressions
                reported by LinkedIn at post level.
              </p>

              <ArticleH2 id="cpl-by-vertical">CPL by vertical</ArticleH2>
              <p className="my-5">
                CPL varies primarily with creator supply and audience density. Verticals with deep creator pools and highly self-identified
                audiences (sales-tech, marketing-ops) come in below the platform mean of €18; sparse-supply verticals (vertical SaaS, HR-tech)
                trend higher. The table below shows the 10th-percentile, median, and 90th-percentile CPL for each vertical, alongside the number
                of campaigns analysed.
              </p>
              <DataTable head={cplHead} rows={cplRows} cellClasses={[TD_STRONG, TD, TD, TD, TD_MUTED]} />
              <div className="my-8 space-y-6">
                {verticalNotes.map((v) => (
                  <div key={v.slug}>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B7280] mb-1.5 font-semibold">
                      {sectors[v.slug].label} · n={sectors[v.slug].n}
                    </p>
                    <p className="text-[#374151] leading-[1.7]">{v.text}</p>
                  </div>
                ))}
              </div>

              <ArticleH2 id="ctr-by-creator-tier">CTR by creator tier</ArticleH2>
              <p className="my-5">
                The follower-count → CTR relationship is the single most replicated finding in the dataset. Smaller creators consistently drive
                higher CTR, a pattern that holds inside every vertical we measured. We attribute this to two compounding effects: LinkedIn's
                algorithm rewards high engagement-per-impression (which nano-creators reliably produce in their tight communities), and
                audiences treat 1k–3k-follower creators as peers rather than as “media”, which raises click intent.
              </p>
              <DataTable head={ctrHead} rows={ctrRows} cellClasses={[TD_STRONG, TD, TD, TD, TD_MUTED]} />
              <p className={NOTE}>
                Sample: 1,847 sponsored posts. Tiers reflect creator follower count at the date of publication. CTR = qualified clicks ÷
                LinkedIn-reported impressions.
              </p>

              <ArticleH2 id="time-to-launch">Time-to-launch distribution</ArticleH2>
              <p className="my-5">
                Time-to-launch is the number of calendar days between brief submission and the first paid post going live. The median Naano
                campaign launched 7 days after brief submission, with 25% of campaigns launching in 5 days or fewer.
              </p>
              <DataTable
                head={launchHead}
                rows={launchRows.map((r) => [
                  r.label,
                  r.days,
                  <span key={r.label} aria-hidden="true" className="inline-block h-2 rounded-full bg-[#1652F0]" style={{ width: r.width }} />,
                ])}
                cellClasses={[TD_STRONG, TD, 'px-4 py-3 border-b border-[#F3F4F6] align-middle']}
              />
              <p className={NOTE}>
                Sample: 312 campaigns. Reference benchmark: typical B2B influencer-marketing agencies report 21–35-day launch cycles for
                comparable scopes.
              </p>

              <ArticleH2 id="conversion-benchmarks">Conversion benchmarks (post → site → demo)</ArticleH2>
              <p className="my-5">
                The funnel below traces the median journey from a creator-led LinkedIn post to a sales-qualified lead, using the subset of
                campaigns where the brand granted Naano access to downstream CRM events (n=104 campaigns, ~33% of the dataset).
              </p>
              <DataTable head={funnelHead} rows={funnelRows} cellClasses={[TD_STRONG, TD_GREEN, TD_MUTED]} />
              <p className="my-5">
                The composite implies that a qualified click acquired via Naano has a ~3.4% chance of becoming an SQL within 30 days of the
                originating post. At a €18 average CPL, that implies an effective{' '}
                <strong className={STRONG}>cost-per-SQL of approximately €530</strong>, substantially below the €1,200–€1,800 cost-per-SQL most
                B2B SaaS marketers report on LinkedIn Ads for comparable audiences.
              </p>
              <p className={NOTE}>
                Caveat: SQL conversion depends heavily on each brand's lead-scoring criteria. The 41% demo-to-SQL rate is the median across 89
                brands; we observed a wide p25/p75 range of 28–58%.
              </p>

              <ArticleH2 id="channel-mix">Channel mix observations</ArticleH2>
              <p className="my-5">
                Naano-using brands rarely treat creator-led growth as a stand-alone channel. The dominant pattern in Q1 2026 was a three-layer
                stack: (1) Naano creator posts to generate initial reach and warm interest, (2) LinkedIn Ads retargeting against the engagers
                list exported from Naano, and (3) warm SDR outbound sequences to commenters and sharers. Brands that ran all three layers in
                sequence reported a ~38% lift in pipeline-per-click versus brands that ran Naano alone, a finding consistent with the
                well-documented retargeting amplification effect.
              </p>
              <p className="my-5">
                A second pattern: brands routinely use creator content as a downstream creative source. Roughly 41% of Q1 2026 customers reported
                repurposing at least one creator-led post into a LinkedIn Ad creative or a landing-page social-proof block. The creators'
                authentic copy outperformed brand-authored copy in every reported A/B test we have visibility into, with relative CTR lifts in
                the 1.5–3× range on retargeting campaigns.
              </p>
              <p className="my-5">
                The third observation worth flagging: brands that paired Naano with a structured warm-outbound program saw the highest pipeline
                conversion. Reply rates on outbound messages referencing a creator's post averaged 39.6% in Q1 2026, versus the ~5% industry
                baseline for cold outbound. This makes the creator post not just an acquisition asset but also a pre-qualifying signal for SDR
                teams: every engager is, by construction, an in-market reader of vertical-specific content.
              </p>

              <ArticleH2 id="limitations">Limitations and honest caveats</ArticleH2>
              <ul className="my-5 list-disc pl-6 marker:text-[#9CA3AF] space-y-3">
                {limitations.map((l) => (
                  <li key={l.strong}>
                    <strong className={STRONG}>{l.strong}</strong>
                    {l.text}
                  </li>
                ))}
              </ul>

              <ArticleH2 id="how-to-cite">Citations and how to cite this report</ArticleH2>
              <p className="my-5">
                This report is intended to be a citable primary source. Writers, analysts, and AI search engines are welcome to reference any
                figure on this page with attribution. The recommended citation format is:
              </p>
              <blockquote className="relative border-l-2 border-[#111827] pl-6 my-10 text-[#111827] italic text-[19px] leading-[1.6]">
                Naano. <em>Q2 2026 B2B Creator-Led Growth Benchmark Report.</em> Published April 27, 2026. https://naano.com/benchmarks/q2-2026.
                Sample: 312 campaigns, 1,847 sponsored posts, ~300 creators, Q1 2026.
              </blockquote>
              <p className="my-5">
                For external benchmarks referenced in this report, please cite the original source: the LinkedIn B2B Marketing Benchmark report
                for CTR/CPM comparisons, and any analyst report you draw CPC ranges from. Naano-specific numbers can be cited as “Naano
                marketplace data, Q1 2026”.
              </p>
              <p className="my-5">
                The dataset behind this report is also exposed as a structured schema.org <Code>Dataset</Code> object on this page's JSON-LD, so
                AI engines and research tools can index it as a first-party data source.
              </p>

              <ArticleH2 id="next-steps">Next steps</ArticleH2>
              <p className="my-5">
                Q3 2026 will repeat this analysis on Q2 2026 campaign data, with two additions: a per-creator persistence cohort (do
                top-performing creators repeat?) and a CAC-payback section for customers who share post-SQL revenue data. If you want to be
                notified when the next edition publishes, the fastest path is to start a campaign. Naano customers receive each quarterly report
                two weeks before public release.
              </p>
              <p className="my-5">
                For a structured walk-through of how to actually run a creator-led growth program against these benchmarks, see our pillar
                guide: <TextLink href="/blog/creator-led-growth-b2b">What is creator-led growth for B2B?</TextLink>.
              </p>
            </div>

            <ArticleCta
              eyebrow="Run your own benchmark"
              title="Beat the €18 CPL median."
              body="Book LinkedIn creator offers at a fixed price shown before checkout, without a platform retainer on Self-Serve. Compare eligible creators in your vertical and track each published post against the historical benchmarks above."
              primary={{ href: '/register', label: 'Start a campaign' }}
              secondary={{ href: '/blog/creator-led-growth-b2b', label: 'Read the pillar guide' }}
            />
          </article>
        </div>
      </div>

      <FooterCta />
    </SiteLayout>
  )
}
