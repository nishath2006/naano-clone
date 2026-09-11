import type { ReactNode } from 'react'

/**
 * Near-black closing CTA block (`bg-[#0A0A0A]`) shared by the about and
 * pricing pages. `actions` receives the button row; `eyebrow` renders the
 * dotted label the about page shows above the heading.
 */
export function DarkCtaSection({
  eyebrow,
  title,
  body,
  actions,
  footnote,
  fadeUp = false,
}: {
  eyebrow?: string
  title: ReactNode
  body: ReactNode
  actions: ReactNode
  footnote?: ReactNode
  fadeUp?: boolean
}) {
  return (
    <section className="bg-[#0A0A0A] py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-[580px] mx-auto text-center">
        <div className={`flex flex-col items-center${fadeUp ? ' fade-up' : ''}`}>
          {eyebrow && (
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#1652F0' }} />
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">{eyebrow}</p>
            </div>
          )}
          <h2 className="text-[clamp(28px,4.5vw,52px)] font-bold leading-[1.08] tracking-[-0.03em] text-white mb-4">{title}</h2>
          <p className="text-[15px] text-white/45 leading-relaxed mb-10 max-w-sm">{body}</p>
          {actions}
          {footnote && <p className="text-[12px] text-white/30 mt-3">{footnote}</p>}
        </div>
      </div>
    </section>
  )
}

export const DARK_CTA_PRIMARY =
  'inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-white text-[#0A0A0A] font-semibold text-[15px] hover:bg-gray-100 transition-colors duration-200'
export const DARK_CTA_SECONDARY =
  'inline-flex items-center gap-2 h-12 px-8 rounded-xl border border-white/20 text-white font-semibold text-[15px] hover:bg-white/5 transition-colors duration-200'
