import { Link } from 'react-router-dom'
import type { BlogPostView } from '@/data/blog'

/** Tag pills under the article body. */
export function PostTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div className="mt-14 pt-8 border-t border-[#E5E7EB] flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t} className="text-[11px] uppercase tracking-[0.1em] text-[#6B7280] border border-[#E5E7EB] rounded-full px-3 py-1">
          {t}
        </span>
      ))}
    </div>
  )
}

/** "Ready to try it" card that closes every post. */
export function PostCta({ cta }: { cta: BlogPostView['cta'] }) {
  return (
    <div className="mt-14 p-7 sm:p-9 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B7280] mb-3">{cta.eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-light tracking-[-0.02em] text-[#111827] mb-4">{cta.title}</h2>
      <p className="text-[#4B5563] leading-relaxed mb-6 max-w-xl">{cta.text}</p>
      <Link
        to={cta.href}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111827] text-white text-sm font-medium hover:bg-[#1F2937] transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2"
      >
        {cta.button}
        <span aria-hidden="true">{cta.arrow}</span>
      </Link>
    </div>
  )
}
