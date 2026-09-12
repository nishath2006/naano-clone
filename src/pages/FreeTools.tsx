import { Link } from 'react-router-dom'
import { FooterCta } from '@/components/site/FooterCta'
import { SiteLayout } from '@/layouts/SiteLayout'
import { useLocale } from '@/lib/locale'
import { FREE_TOOL_CARDS } from '@/data/free-tools'
import { ArrowRightIcon, SparklesIcon, ToolIcon } from '@/components/tools/ToolIcons'
import { FaqSection, HERO_GLOW, SectionHeading, TOOLS_MAIN_CLASS, ToolSection, Dot } from '@/components/tools/ToolSections'

const META = {
  title: 'Free Tools for B2B Creator Marketing — NaanoX',
  description:
    'Free tools for B2B teams running LinkedIn creator campaigns. Start with the free LinkedIn creator search: tell us your campaign, get a hand-picked shortlist of relevant B2B creators within 48 hours. No account, no commitment.',
}

const FAQ = [
  {
    q: "Are NaanoX's free tools really free?",
    a: 'Yes. The free LinkedIn creator search costs nothing, requires no account and no payment method, and carries no obligation to book anything afterwards. You keep the shortlist whether or not you run a campaign with NaanoX.',
  },
  {
    q: 'What is the free LinkedIn creator search?',
    a: 'You describe your campaign — your product, your audience, and your budget — and a member of the NaanoX team manually builds a shortlist of LinkedIn creators whose audience genuinely overlaps your buyer. Each profile comes with pricing, audience fit, and the reason it belongs in your campaign. It is delivered within 48 hours.',
  },
  {
    q: 'Do I have to run my campaign on NaanoX to use the tools?',
    a: "No. The shortlist is yours to use however you want, including contacting the creators directly yourself. NaanoX's bet is that booking, briefing, paying, and tracking those creators in one place is easier than doing it by hand — but that is your decision to make after you see the list.",
  },
]

const KEEP_READING = [
  { href: '/blog/how-to-find-b2b-creators-linkedin', label: 'How to find B2B creators on LinkedIn' },
  { href: '/blog/best-b2b-creator-marketplace', label: 'Best B2B creator marketplaces in 2026 (ranked)' },
  { href: '/blog/what-is-a-b2b-creator-marketplace', label: 'What is a B2B creator marketplace?' },
  { href: '/blog/launch-b2b-linkedin-creator-campaign', label: 'How to launch your first LinkedIn creator campaign in 30 days' },
  { href: '/blog/b2b-influencer-marketing-cost', label: 'How much does B2B influencer marketing cost in 2026?' },
]

const EN = {
  badge: 'Free tools by NaanoX',
  h1: 'Free tools for B2B creator marketing',
  intro:
    'Practical tools for teams running LinkedIn creator campaigns. No account, no payment method, no commitment — start with the one below.',
  free: 'Free',
  open: 'Open the tool',
  coming: {
    title: 'More tools coming',
    before: 'We ship a new free tool whenever we build something internally that B2B teams keep asking us for. In the meantime, the',
    blog: 'blog',
    after: 'covers the playbooks.',
  },
  faqHeading: 'Frequently asked questions',
  keepReading: 'Keep reading',
}

// The FR capture only localises the hero badge and the card link label.
const COPY = {
  en: EN,
  fr: { ...EN, badge: 'Outils gratuits par NaanoX', open: "Ouvrir l'outil" },
}

export default function FreeTools() {
  const { locale } = useLocale()
  const c = COPY[locale]
  const cards = FREE_TOOL_CARDS[locale]

  return (
    <SiteLayout title={META.title} description={META.description} className={TOOLS_MAIN_CLASS} deps={[locale]}>
      <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
        <div className="pointer-events-none absolute inset-0" style={HERO_GLOW} />
        <div className="relative mx-auto max-w-[900px] px-4 sm:px-6 text-center">
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#E4E1DC] bg-white px-4 py-2 text-[13px] font-medium text-[#55575E] shadow-[0_1px_2px_rgba(23,24,28,0.04)]">
            <SparklesIcon size={14} className="text-[#7C5CFC]" />
            {c.badge}
          </span>
          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[60px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#17181C]">
            {c.h1}
            <Dot />
          </h1>
          <p className="mx-auto mt-6 max-w-[640px] text-lg sm:text-[19px] leading-relaxed text-[#55575E]">{c.intro}</p>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {cards.map((card) => (
              <Link
                key={card.href}
                to={card.href}
                className="group flex flex-col rounded-2xl border border-[#ECEAE6] bg-white p-7 shadow-[0_2px_10px_rgba(23,24,28,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#7C5CFC]/40 hover:shadow-[0_18px_40px_rgba(23,24,28,0.10)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFCFB]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEE9FF] text-[#7C5CFC]">
                    <ToolIcon name={card.icon} size={22} />
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#E4E1DC] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#55575E]">
                    {c.free}
                  </span>
                </div>
                <h2 className="mt-5 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-[#17181C]">{card.title}</h2>
                <p className="mt-1.5 text-[15px] font-medium text-[#7C5CFC]">{card.tagline}</p>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#55575E]">{card.description}</p>
                <span className="mt-5 inline-flex self-start items-center gap-2 rounded-full border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-1.5 text-[12px] font-medium text-[#55575E]">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
                  {card.pill}
                </span>
                <span className="mt-3 text-[13px] text-[#6B6D74]">{card.meta}</span>
                <span className="mt-5 inline-flex items-center gap-2 border-t border-[#F1EFEA] pt-5 text-[15px] font-semibold text-[#17181C] transition-colors group-hover:text-[#7C5CFC] motion-reduce:transition-none">
                  {c.open}
                  <ArrowRightIcon size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
              </Link>
            ))}
            <div className="flex flex-col justify-center rounded-2xl border border-dashed border-[#E4E1DC] bg-[#FAFAF9] p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ECEAE6] bg-white text-[#6B6D74]">
                <SparklesIcon size={20} />
              </span>
              <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-[#17181C]">{c.coming.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#55575E]">
                {c.coming.before}{' '}
                <Link
                  to="/blog"
                  className="font-semibold text-[#7C5CFC] underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm"
                >
                  {c.coming.blog}
                </Link>{' '}
                {c.coming.after}
              </p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection heading={c.faqHeading} items={FAQ} />

      <ToolSection>
        <SectionHeading size="md">{c.keepReading}</SectionHeading>
        <ul className="mt-6 divide-y divide-[#ECEAE6]">
          {KEEP_READING.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className="group flex min-h-11 items-center justify-between gap-4 py-3.5 text-[16px] font-medium text-[#17181C] transition-colors hover:text-[#7C5CFC] motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm"
              >
                {l.label}
                <ArrowRightIcon
                  size={16}
                  className="shrink-0 text-[#7C5CFC] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      </ToolSection>
      <FooterCta />
    </SiteLayout>
  )
}
