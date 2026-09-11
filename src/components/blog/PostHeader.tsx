import { Link } from 'react-router-dom'
import type { BlogPostView } from '@/data/blog'
import { useLocale } from '@/lib/locale'
import { ClockIcon, LinkedinIcon } from './icons'

const DOT_PATTERN = 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)'

/** Gradient hero: breadcrumb, meta row (category · read time · language), title, excerpt. */
export function PostHero({ post }: { post: BlogPostView }) {
  return (
    <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden text-white" style={{ background: post.gradient }}>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.14] pointer-events-none" style={{ backgroundImage: DOT_PATTERN, backgroundSize: post.dot }} />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Link
            className="text-xs uppercase tracking-[0.14em] text-white/80 hover:text-white transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
            to="/blog"
          >
            {post.back}
          </Link>
        </div>
        <div className="max-w-[840px]">
          <div className="flex items-center gap-3 mb-6 text-[11px] uppercase tracking-[0.16em] text-white/85">
            <span className="font-semibold">{post.category}</span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-white/60" />
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon />
              {post.readMinutes} {post.readLabel}
            </span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-white/60" />
            <span>{post.langLabel}</span>
          </div>
          <h1 className="text-[clamp(32px,5vw,58px)] font-light leading-[1.04] tracking-[-0.025em] mb-7">{post.title}</h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">{post.excerpt}</p>
        </div>
      </div>
    </section>
  )
}

/** Author card (avatar + LinkedIn badge, name, role) with the Published / Updated dates. */
export function AuthorRow({ post }: { post: BlogPostView }) {
  const { author } = post
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 pb-7 mb-12 border-b border-[#E5E7EB]">
      <a
        href={author.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2 rounded-full"
      >
        <span className="relative">
          <img
            alt={author.name}
            loading="lazy"
            width={44}
            height={44}
            decoding="async"
            className="w-11 h-11 rounded-full object-cover border border-[#E5E7EB]"
            style={{ color: 'transparent' }}
            src={author.avatar}
          />
          <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center ring-2 ring-white">
            <LinkedinIcon />
          </span>
        </span>
        <span>
          <span className="block text-sm font-medium text-[#111827] group-hover:underline">{author.name}</span>
          <span className="block text-xs text-[#6B7280]">{author.role}</span>
        </span>
      </a>
      <div className="text-xs text-[#6B7280] space-y-0.5 sm:text-right">
        {post.published && (
          <div>
            {post.published.label}{' '}
            <time dateTime={post.published.iso} className="text-[#111827]">
              {post.published.text}
            </time>
          </div>
        )}
        {post.updated && (
          <div>
            {post.updated.label}{' '}
            <time dateTime={post.updated.iso} className="text-[#111827]">
              {post.updated.text}
            </time>
          </div>
        )}
      </div>
    </div>
  )
}

/** "Also in Français / English" pill. The live site serves the translation at the same URL via the locale cookie. */
export function AlternatePill({ post }: { post: BlogPostView }) {
  const { set } = useLocale()
  const alt = post.alternate
  if (!alt) return null
  return (
    <div className="mb-10 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563]">
      <span>{alt.label}</span>
      <a
        hrefLang={alt.lang}
        className="font-medium text-[#111827] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2 rounded-sm"
        href={alt.href}
        onClick={(e) => {
          if (alt.lang !== 'en' && alt.lang !== 'fr') return
          e.preventDefault()
          set(alt.lang)
        }}
      >
        {alt.text}
      </a>
    </div>
  )
}
