import { useParams } from 'react-router-dom'
import { SiteLayout } from '@/layouts/SiteLayout'
import { LpNavShell } from '@/components/lp/LpNavShell'
import { FooterCta } from '@/components/site/FooterCta'
import { ReadingProgress } from '@/components/site/ReadingProgress'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { AlternatePill, AuthorRow, PostHero } from '@/components/blog/PostHeader'
import { PostCta, PostTags } from '@/components/blog/PostFooter'
import { getBlogPost, getBlogPostView } from '@/data/blog'
import { useLocale } from '@/lib/locale'
import NotFound from './NotFound'

/** /blog/:slug — article page (hero, sticky TOC, body, tags, CTA). */
export default function BlogPost() {
  const { slug } = useParams()
  const { locale } = useLocale()
  const post = getBlogPost(slug)
  if (!post) return <NotFound />
  const view = getBlogPostView(post, locale)

  return (
    <SiteLayout nav={<LpNavShell />} title={view.docTitle} description={view.description} className="min-h-screen bg-white text-[#111827]">
      <ReadingProgress />
      <PostHero post={view} />
      <div className="px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 lg:gap-x-16">
          <aside className="lg:col-span-3 lg:order-2">
            <TableOfContents key={`${view.slug}-${view.lang}`} label={view.tocLabel} items={view.toc} />
          </aside>
          <article className="lg:col-span-9 lg:order-1">
            <AuthorRow post={view} />
            <AlternatePill post={view} />
            <ArticleBody html={view.body} />
            <PostTags tags={view.tags} />
            <PostCta cta={view.cta} />
          </article>
        </div>
      </div>
      <FooterCta />
    </SiteLayout>
  )
}
