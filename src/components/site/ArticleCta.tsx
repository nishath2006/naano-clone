import type { ReactNode } from 'react'
import { PillLink } from './Pill'

/** Grey rounded call-to-action card that closes the article pages. */
export function ArticleCta({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow: string
  title: ReactNode
  body: ReactNode
  primary: { href: string; label: string }
  secondary?: { href: string; label: string }
}) {
  const main = (
    <PillLink href={primary.href} variant="dark" arrow>
      {primary.label}
    </PillLink>
  )
  return (
    <div className="mt-14 p-7 sm:p-9 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B7280] mb-3">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-light tracking-[-0.02em] text-[#111827] mb-4">{title}</h2>
      <p className="text-[#4B5563] leading-relaxed mb-6 max-w-xl">{body}</p>
      {secondary ? (
        <div className="flex flex-wrap gap-3">
          {main}
          <PillLink href={secondary.href} variant="light">
            {secondary.label}
          </PillLink>
        </div>
      ) : (
        main
      )}
    </div>
  )
}
