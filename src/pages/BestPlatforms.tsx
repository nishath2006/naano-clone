import { SiteLayout } from '@/layouts/SiteLayout'
import { ArticleHero } from '@/components/site/DarkHero'
import { ArticleH2 } from '@/components/site/ArticleH2'
import { ArticleCta } from '@/components/site/ArticleCta'
import { DataTable, TD, TD_LEAD, TH } from '@/components/site/DataTable'
import { FaqList } from '@/components/site/FaqList'
import { FooterCta } from '@/components/site/FooterCta'
import { ReadingProgress } from '@/components/site/ReadingProgress'
import { TableOfContents } from '@/components/site/TableOfContents'
import { Rich, TextLink } from '@/components/site/TextLink'
import { PlatformQuiz } from '@/components/best-platforms/PlatformQuiz'
import { useLocale, type Locale } from '@/lib/locale'
import { bestEn, bestFr, type RankedPlatform } from '@/data/best-platforms'

const STRONG = 'text-[#111827] font-medium'
const LIST = 'my-5 list-disc pl-6 marker:text-[#9CA3AF] space-y-2'
const TABLE_CELLS = [TD_LEAD, TD_LEAD, TD, TD, TD, TD, TD]

function Ranking({ items }: { items: RankedPlatform[] }) {
  return (
    <ol className="my-8 space-y-6 list-none pl-0">
      {items.map((p, i) => (
        <li key={p.name} className="rounded-xl border border-[#E5E7EB] p-5 sm:p-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span aria-hidden="true" className="text-[#7C5CFC] font-medium tabular-nums text-lg">
              {i + 1}.
            </span>
            <h3 className="text-xl font-medium tracking-[-0.01em] text-[#111827]">{p.name}</h3>
          </div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B7280] font-semibold mb-3">{p.tagline}</p>
          <p className="text-[15px] text-[#374151] leading-[1.7]">{p.body}</p>
        </li>
      ))}
    </ol>
  )
}

function ComparisonTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <DataTable
      head={head}
      rows={rows}
      cellClasses={TABLE_CELLS}
      tableClassName="w-full text-sm border-separate border-spacing-0"
      thClassName={`${TH} whitespace-nowrap`}
    />
  )
}

function CiteBox({ label, title, rest }: { label: string; title: string; rest: string }) {
  return (
    <div className="my-10 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#374151] leading-relaxed">
      <strong className={STRONG}>{label}</strong> NaanoX. <em>{title}</em>
      {rest}
    </div>
  )
}

/**
 * The 2026 platform ranking. `lang="en"` is the full article with sticky
 * table of contents and per-platform reviews; `lang="fr"` is the shorter
 * French edition served at /meilleures-plateformes-influence-marketing-b2b-2026.
 */
export default function BestPlatforms({ lang = 'en' }: { lang?: Locale }) {
  return lang === 'fr' ? <FrenchArticle /> : <EnglishArticle />
}

function EnglishArticle() {
  // The live EN page swaps a handful of strings when the locale cookie is `fr`.
  const { locale } = useLocale()
  const c = bestEn
  return (
    <SiteLayout title={c.title} description={c.description} className="min-h-screen bg-white text-[#111827]">
      <ReadingProgress />
      <ArticleHero kicker={c.hero.kicker} readTime={c.hero.readTime} lang={c.hero.lang} title={c.hero.h1} lede={c.hero.lede} meta={c.hero.meta} />

      <div className="px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 lg:gap-x-16">
          <aside className="lg:col-span-3 lg:order-2">
            <TableOfContents items={c.toc} label={c.tocLabel} />
          </aside>
          <article className="lg:col-span-9 lg:order-1">
            <div className="text-[17px] text-[#1F2937] leading-[1.75] max-w-[72ch]">
              <p className="text-[19px] leading-[1.7] text-[#111827]">{c.intro}</p>
              <div id="quiz" className="scroll-mt-28 mt-10">
                <PlatformQuiz locale="en" />
              </div>

              <ArticleH2 id="the-ranking">{c.rankingH2}</ArticleH2>
              <Ranking items={c.ranking} />

              <ArticleH2 id="comparison-table">{c.tableH2}</ArticleH2>
              <p className="my-5">{c.tableIntro}</p>
              <ComparisonTable head={c.tableHead} rows={c.tableRows} />
              <p className="my-5 text-sm text-[#6B7280]">{c.tableNote}</p>

              <ArticleH2 id="platform-reviews">{c.reviewsH2}</ArticleH2>
              <p className="my-5">
                <Rich segs={c.naanoReview[locale]} />
              </p>
              {c.reviews.map((segs, i) => (
                <p key={i} className="my-5">
                  <Rich segs={segs} />
                </p>
              ))}

              <ArticleH2 id="how-we-ranked">{c.howH2}</ArticleH2>
              <p className="my-5">{c.howIntro}</p>
              <ul className={LIST}>
                {c.criteria.map((cr) => (
                  <li key={cr.strong}>
                    <strong className={STRONG}>{cr.strong}</strong>
                    {cr.rest[locale]}
                  </li>
                ))}
              </ul>
              <p className="my-5">
                <Rich segs={c.howOutro} />
              </p>

              <ArticleH2 id="faq">{c.faqH2}</ArticleH2>
              <FaqList items={c.faq} />
              <CiteBox {...c.cite} />

              <ArticleH2 id="further-reading">{c.furtherH2}</ArticleH2>
              <ul className={LIST}>
                {c.further.map((l) => (
                  <li key={l.href}>
                    <TextLink href={l.href}>{l.label[locale]}</TextLink>
                  </li>
                ))}
              </ul>
              <p className="my-5 text-sm text-[#6B7280]">
                <Rich segs={c.verticals} />
              </p>
            </div>

            <ArticleCta
              eyebrow={c.cta.eyebrow}
              title={c.cta.h2[locale]}
              body={c.cta.p[locale]}
              primary={{ href: '/register', label: c.cta.primary }}
              secondary={{ href: '/pricing', label: c.cta.secondary }}
            />
          </article>
        </div>
      </div>

      <FooterCta />
    </SiteLayout>
  )
}

function FrenchArticle() {
  const c = bestFr
  return (
    <SiteLayout title={c.title} description={c.description} className="min-h-screen bg-white text-[#111827]">
      <ReadingProgress />
      <ArticleHero
        kicker={c.hero.kicker}
        readTime={c.hero.readTime}
        lang={c.hero.lang}
        title={c.hero.h1}
        lede={c.hero.lede}
        meta={
          <>
            {c.hero.metaPrefix}
            <TextLink
              href="/best-b2b-influencer-marketing-platforms-2026"
              hrefLang="en"
              className="underline underline-offset-4 decoration-white/40 hover:decoration-white"
            >
              {c.hero.metaLink}
            </TextLink>
          </>
        }
      />

      <div className="px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
        <div className="max-w-[840px] mx-auto">
          <div className="text-[17px] text-[#1F2937] leading-[1.75]">
            <p className="text-[19px] leading-[1.7] text-[#111827]">{c.intro}</p>
            <div className="mt-10">
              <PlatformQuiz locale="fr" />
            </div>

            <ArticleH2>{c.rankingH2}</ArticleH2>
            <Ranking items={c.ranking} />

            <ArticleH2 id="comparatif">{c.tableH2}</ArticleH2>
            <ComparisonTable head={c.tableHead} rows={c.tableRows} />
            <p className="my-5 text-sm text-[#6B7280]">{c.tableNote}</p>

            <ArticleH2>{c.faqH2}</ArticleH2>
            <FaqList items={c.faq} />
            <CiteBox {...c.cite} />

            <ArticleH2>{c.furtherH2}</ArticleH2>
            <ul className={LIST}>
              {c.further.map((l) => (
                <li key={l.href}>
                  <TextLink href={l.href} hrefLang={l.hrefLang}>
                    {l.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </div>

          <ArticleCta
            eyebrow={c.cta.eyebrow}
            title={c.cta.h2}
            body={c.cta.p}
            primary={{ href: '/register', label: c.cta.primary }}
            secondary={{ href: '/pricing', label: c.cta.secondary }}
          />
        </div>
      </div>

      <FooterCta />
    </SiteLayout>
  )
}
