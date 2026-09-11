import { useRef, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Exact class attribute of the article body on naano.com (Tailwind v4
 * arbitrary-variant syntax). Kept as a literal so the Tailwind scanner emits
 * every utility; `blog-posts.json#proseClass` holds the same string for reference.
 */
export const PROSE_CLASS =
  'prose-blog text-[17px] text-[#1F2937] leading-[1.75] max-w-[68ch] [&>p:first-of-type]:text-[19px] [&>p:first-of-type]:leading-[1.7] [&>p:first-of-type]:text-[#111827] [&_h2]:scroll-mt-28 [&_h3]:scroll-mt-28 [&_h1]:text-[clamp(26px,3.2vw,36px)] [&_h1]:font-light [&_h1]:tracking-[-0.02em] [&_h1]:text-[#111827] [&_h1]:mt-14 [&_h1]:mb-6 [&_h2]:text-[clamp(22px,2.6vw,30px)] [&_h2]:font-light [&_h2]:tracking-[-0.02em] [&_h2]:text-[#111827] [&_h2]:mt-16 [&_h2]:mb-5 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-[#F3F4F6] [&_h3]:text-[clamp(18px,2vw,22px)] [&_h3]:font-medium [&_h3]:tracking-[-0.01em] [&_h3]:text-[#111827] [&_h3]:mt-10 [&_h3]:mb-3 [&_p]:my-5 [&_strong]:text-[#111827] [&_strong]:font-medium [&_a]:text-[#1652F0] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[#1652F0]/30 hover:[&_a]:decoration-[#1652F0] [&_a]:transition-colors [&_a]:duration-150 motion-reduce:[&_a]:transition-none [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-[#9CA3AF] [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:marker:text-[#6B7280] [&_li]:my-2 [&_li]:pl-1 [&_blockquote]:relative [&_blockquote]:border-l-2 [&_blockquote]:border-[#111827] [&_blockquote]:pl-6 [&_blockquote]:my-10 [&_blockquote]:text-[#111827] [&_blockquote]:italic [&_blockquote]:text-[19px] [&_blockquote]:leading-[1.6] [&_code]:bg-[#F3F4F6] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.92em] [&_code]:text-[#111827] [&_code]:border [&_code]:border-[#E5E7EB] [&_pre]:bg-[#F9FAFB] [&_pre]:border [&_pre]:border-[#E5E7EB] [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_img]:rounded-xl [&_img]:my-10 [&_img]:border [&_img]:border-[#E5E7EB] [&_hr]:border-[#E5E7EB] [&_hr]:my-12 [&_table]:w-full [&_table]:my-8 [&_table]:text-sm [&_table]:border [&_table]:border-[#E5E7EB] [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border-separate [&_table]:border-spacing-0 [&_table]:tabular-nums [&_thead]:bg-[#F9FAFB] [&_th]:text-left [&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:text-[#111827] [&_th]:text-[11px] [&_th]:uppercase [&_th]:tracking-[0.1em] [&_th]:border-b [&_th]:border-[#E5E7EB] [&_td]:px-4 [&_td]:py-3 [&_td]:text-[#374151] [&_td]:border-b [&_td]:border-[#F3F4F6] [&_td]:align-top [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:hover]:bg-[#FAFAFA] [&_tbody_tr]:transition-colors motion-reduce:[&_tbody_tr]:transition-none'

/**
 * Renders the stored article HTML. Clicks on in-body links to internal routes
 * (`/blog/…`, `/pricing`, …) are handed to the router instead of reloading.
 */
export function ArticleBody({ html }: { html: string }) {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const anchor = (e.target as HTMLElement).closest('a')
    if (!anchor || !ref.current?.contains(anchor)) return
    const href = anchor.getAttribute('href') ?? ''
    if (anchor.target === '_blank' || !href.startsWith('/') || href.startsWith('//')) return
    e.preventDefault()
    navigate(href)
  }

  return <div ref={ref} className={PROSE_CLASS} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}
