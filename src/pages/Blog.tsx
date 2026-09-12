import { SiteLayout } from '@/layouts/SiteLayout'
import { LpNavShell } from '@/components/lp/LpNavShell'
import { FooterCta } from '@/components/site/FooterCta'
import { BlogCard, FeaturedBlogCard } from '@/components/blog/BlogCard'
import { useLocale } from '@/lib/locale'
import { getBlogListing } from '@/data/blog-listing'

/** /blog — "NaanoX Journal" listing: header, topics, featured post, article grid. */
export default function Blog() {
  const { locale } = useLocale()
  const l = getBlogListing(locale)

  return (
    <SiteLayout nav={<LpNavShell />} title={l.docTitle} description={l.description} className="min-h-screen bg-white text-[#111827]">
      <section className="px-4 sm:px-6 pt-32 pb-14 sm:pt-36 sm:pb-20 border-b border-[#F3F4F6]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
            <span>{l.eyebrow}</span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
            <span className="font-normal">{l.count}</span>
          </div>
          <h1 className="text-[clamp(36px,5.4vw,68px)] font-light leading-[1.02] tracking-[-0.025em] text-[#111827] mb-6 max-w-[18ch]">{l.h1}</h1>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl leading-relaxed">{l.intro}</p>
          <div className="mt-10 flex flex-wrap gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF] mr-3 self-center">{l.topicsLabel}</span>
            {l.topics.map((t) => (
              <span key={t} className="text-[12px] text-[#4B5563] border border-[#E5E7EB] rounded-full px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {l.featured && (
        <section className="px-4 sm:px-6 pt-12 sm:pt-16 pb-12">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-5">{l.latestLabel}</p>
            <FeaturedBlogCard card={l.featured} readArticle={l.readArticle} />
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 pt-8 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-baseline justify-between mb-8 pb-5 border-b border-[#F3F4F6]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">{l.moreLabel}</p>
            <span className="text-xs text-[#9CA3AF]">{l.moreCount}</span>
          </div>
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {l.cards.map((c) => (
              <BlogCard key={c.slug} card={c} />
            ))}
          </ul>
        </div>
      </section>

      <FooterCta />
    </SiteLayout>
  )
}
