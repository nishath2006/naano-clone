import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { NavAnchor } from '@/components/lp/LpNav'
import type { MoreToolEntry } from '@/data/free-tools'
import { ArrowLeftIcon, ArrowRightIcon, ToolIcon } from './ToolIcons'

/** Radial glow behind every free-tools hero. */
export const HERO_GLOW = {
  background: 'radial-gradient(640px 320px at 50% -120px, rgba(124,92,252,0.08), transparent 70%)',
} as const

/** Main wrapper classes of the free-tools pages (passed to SiteLayout). */
export const TOOLS_MAIN_CLASS = 'min-h-screen bg-[#FCFCFB] text-[#17181C]'

/** The blue full stop that ends every heading. */
export function Dot() {
  return <span className="text-[#7C5CFC]">.</span>
}

/** Hero of an individual tool page: back pill → h1 → intro. */
export function ToolHero({ backLabel, title, intro }: { backLabel: string; title: string; intro: string }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-12">
      <div className="pointer-events-none absolute inset-0" style={HERO_GLOW} />
      <div className="relative mx-auto max-w-[900px] px-4 sm:px-6 text-center">
        <Link
          to="/free-tools"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#E4E1DC] bg-white px-4 py-2 text-[13px] font-medium text-[#55575E] shadow-[0_1px_2px_rgba(23,24,28,0.04)] transition-colors duration-200 hover:border-[#D8D4CE] hover:text-[#17181C] motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFCFB]"
        >
          <ArrowLeftIcon size={14} className="text-[#7C5CFC]" />
          {backLabel}
        </Link>
        <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#17181C]">
          {title}
          <Dot />
        </h1>
        <p className="mx-auto mt-6 max-w-[680px] text-lg sm:text-[19px] leading-relaxed text-[#55575E]">{intro}</p>
      </div>
    </section>
  )
}

const WIDTH: Record<820 | 1100 | 1200, string> = {
  820: 'max-w-[820px] mx-auto px-4 sm:px-6',
  1100: 'max-w-[1100px] mx-auto px-4 sm:px-6',
  1200: 'max-w-[1200px] mx-auto px-4 sm:px-6',
}

/** A bordered content section (`border-t … py-16 sm:py-20`) with its centred container. */
export function ToolSection({
  width = 820,
  className = 'border-t border-[#ECEAE6] py-16 sm:py-20',
  children,
}: {
  width?: 820 | 1100 | 1200
  className?: string
  children: ReactNode
}) {
  return (
    <section className={className}>
      <div className={WIDTH[width]}>{children}</div>
    </section>
  )
}

/** Section heading. `lg` = 38px (FAQ, methodology…), `md` = 30px (More free tools, Keep reading). */
export function SectionHeading({
  size = 'lg',
  dot = true,
  className = '',
  children,
}: {
  size?: 'lg' | 'md'
  dot?: boolean
  className?: string
  children: ReactNode
}) {
  const base =
    size === 'lg'
      ? 'text-3xl sm:text-[38px] font-semibold tracking-[-0.03em] text-[#17181C]'
      : 'text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#17181C]'
  return (
    <h2 className={className ? `${className} ${base}` : base}>
      {children}
      {dot && <Dot />}
    </h2>
  )
}

export type FaqItem = { q: string; a: string }

/** "Frequently asked questions" block: h3 + paragraph rows separated by hairlines. */
export function FaqSection({ heading, items }: { heading: string; items: FaqItem[] }) {
  return (
    <ToolSection>
      <SectionHeading>{heading}</SectionHeading>
      <div className="mt-8">
        {items.map((item) => (
          <div key={item.q} className="border-t border-[#ECEAE6] py-7 first:border-t-0 first:pt-2">
            <h3 className="text-[18px] font-medium tracking-[-0.015em] text-[#17181C]">{item.q}</h3>
            <p className="mt-3 max-w-[680px] text-[16px] leading-[1.65] text-[#6B6D74]">{item.a}</p>
          </div>
        ))}
      </div>
    </ToolSection>
  )
}

export type TableCell = { className: string; content: ReactNode }

const TABLE_MIN: Record<560 | 620 | 640, string> = {
  560: 'w-full min-w-[560px] text-left text-[15px]',
  620: 'w-full min-w-[620px] text-left text-[15px]',
  640: 'w-full min-w-[640px] text-left text-[15px]',
}

/** Benchmark / data table with the shared thead and row hairlines. */
export function DataTable({
  minWidth,
  headers,
  rows,
  wrapperClassName = 'mt-8 overflow-x-auto rounded-2xl border border-[#ECEAE6] bg-white shadow-[0_2px_10px_rgba(23,24,28,0.05)]',
}: {
  minWidth: 560 | 620 | 640
  headers: string[]
  rows: { key: string; cells: TableCell[] }[]
  wrapperClassName?: string
}) {
  return (
    <div className={wrapperClassName}>
      <table className={TABLE_MIN[minWidth]}>
        <thead>
          <tr className="border-b border-[#ECEAE6] bg-[#FAFAF9]">
            {headers.map((h) => (
              <th key={h} scope="col" className="px-5 py-3.5 font-semibold text-[#17181C]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-[#ECEAE6] last:border-b-0">
              {row.cells.map((cell, i) => (
                <td key={i} className={cell.className}>
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Small grey source line under a table. */
export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[14px] text-[#6B6D74]">{children}</p>
}

/** Inline blue link used inside notes and paragraphs. */
export function InlineLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="font-semibold text-[#7C5CFC] hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm"
    >
      {children}
    </Link>
  )
}

export type MethodNote = { lead: string; text: string }

/** "Method, and what this tool does not claim" — paragraphs with a bold lead-in. */
export function MethodSection({ heading, notes }: { heading: string; notes: MethodNote[] }) {
  return (
    <ToolSection>
      <SectionHeading>{heading}</SectionHeading>
      <div className="mt-8 space-y-5 text-[16px] leading-[1.65] text-[#6B6D74]">
        {notes.map((n) => (
          <p key={n.lead}>
            <span className="font-semibold text-[#17181C]">{n.lead}</span> {n.text}
          </p>
        ))}
      </div>
    </ToolSection>
  )
}

/** "More free tools" — three compact cards linking to the sibling tools. */
export function MoreFreeTools({ heading, openLabel, tools }: { heading: string; openLabel: string; tools: MoreToolEntry[] }) {
  return (
    <ToolSection width={1100}>
      <SectionHeading size="md">{heading}</SectionHeading>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            to={t.href}
            className="group flex flex-col rounded-2xl border border-[#ECEAE6] bg-white p-6 shadow-[0_2px_10px_rgba(23,24,28,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7C5CFC]/40 hover:shadow-[0_14px_32px_rgba(23,24,28,0.10)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFCFB]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE9FF] text-[#7C5CFC]">
              <ToolIcon name={t.icon} size={20} />
            </span>
            <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[#17181C]">{t.title}</h3>
            <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-[#55575E]">{t.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#17181C] transition-colors group-hover:text-[#7C5CFC] motion-reduce:transition-none">
              {openLabel}
              <ArrowRightIcon size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
          </Link>
        ))}
      </div>
    </ToolSection>
  )
}

export type CtaCard = { title: string; text: string; cta: string; href: string }

/** Closing CTA pair: dark card (left) + white card (right). */
export function CtaPair({ dark, light }: { dark: CtaCard; light: CtaCard }) {
  return (
    <ToolSection width={1100}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col rounded-2xl bg-[#17181C] p-8 text-white shadow-[0_18px_44px_rgba(23,24,28,0.18)]">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">{dark.title}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-white/80 flex-1">{dark.text}</p>
          <NavAnchor
            href={dark.href}
            className="mt-6 inline-flex min-h-11 self-start items-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-[#17181C] transition-opacity duration-200 hover:opacity-90 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {dark.cta}
            <ArrowRightIcon size={15} />
          </NavAnchor>
        </div>
        <div className="flex flex-col rounded-2xl border border-[#ECEAE6] bg-white p-8 shadow-[0_2px_10px_rgba(23,24,28,0.05)]">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#17181C]">{light.title}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[#55575E] flex-1">{light.text}</p>
          <NavAnchor
            href={light.href}
            className="mt-6 inline-flex min-h-11 self-start items-center gap-2 rounded-xl bg-[#7C5CFC] px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#6D4EF5] motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] focus-visible:ring-offset-2"
          >
            {light.cta}
            <ArrowRightIcon size={15} />
          </NavAnchor>
        </div>
      </div>
    </ToolSection>
  )
}

/** Bulleted note list used under calculator results (blue or amber dot). */
export function NoteList({ items }: { items: { text: string; tone?: 'blue' | 'amber' }[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((n) => (
        <li key={n.text} className="flex gap-3 text-[15px] leading-relaxed text-[#55575E]">
          <span aria-hidden="true" className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${n.tone === 'amber' ? 'bg-amber-500' : 'bg-[#7C5CFC]'}`} />
          <span>{n.text}</span>
        </li>
      ))}
    </ul>
  )
}

/** "How to use this result:" callout under the odds / budget results. */
export function ResultCallout({ lead, text }: { lead: string; text: string }) {
  return (
    <p className="mt-6 rounded-xl border border-[#ECEAE6] bg-[#FAFAF9] px-5 py-4 text-[15px] leading-relaxed text-[#17181C]">
      <span className="font-semibold">{lead}</span> {text}
    </p>
  )
}
