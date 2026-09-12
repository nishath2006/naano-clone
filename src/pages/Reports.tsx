import { Link } from 'react-router-dom'
import { SiteLayout } from '@/layouts/SiteLayout'
import { DarkHero, HeroBackLink } from '@/components/site/DarkHero'
import { FaqList } from '@/components/site/FaqList'
import { FooterCta } from '@/components/site/FooterCta'
import { Rich } from '@/components/site/TextLink'
import { useLocale } from '@/lib/locale'
import { reportsCopy } from '@/data/reports'

const CARD =
  'group flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_1px_3px_rgba(17,24,39,0.05)] transition-all duration-200 hover:border-[#7C5CFC]/40 hover:shadow-[0_12px_32px_rgba(124,92,252,0.10)] motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC]'

/** `/reports` — hub listing the first-party data reports. */
export default function Reports() {
  const { locale } = useLocale()
  const c = reportsCopy[locale]

  return (
    <SiteLayout title={c.title} description={c.description} className="min-h-screen bg-white text-[#111827]">
      <DarkHero padding="pt-28 pb-16 sm:pt-32 sm:pb-20">
        <HeroBackLink />
        <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] max-w-[900px]">{c.h1}</h1>
        <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-[680px] leading-relaxed">{c.lede}</p>
      </DarkHero>

      <section className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.cards.map((card) => (
              <Link key={card.href} to={card.href} className={CARD}>
                <span className="inline-flex self-start items-center rounded-full bg-[#7C5CFC]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#7C5CFC]">
                  {card.badge}
                </span>
                <h2 className="mt-5 text-xl font-bold tracking-[-0.02em] text-[#111827]">{card.title}</h2>
                <p className="mt-2 text-[15px] font-semibold text-[#7C5CFC]">{card.subtitle}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4B5563] flex-1">{card.body}</p>
                <span className="mt-5 text-[13px] text-[#6B7280]">{card.meta}</span>
                <span className="mt-4 text-[15px] font-bold text-[#111827] group-hover:text-[#7C5CFC] transition-colors motion-reduce:transition-none">
                  {card.read}
                </span>
              </Link>
            ))}
            <div className="flex flex-col justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FAFAFA] p-7">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-[#111827]">{c.upcoming.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4B5563]">
                <Rich segs={c.upcoming.body} linkClass="font-semibold text-[#7C5CFC] underline underline-offset-2" />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#FAFAFA] border-y border-[#E5E7EB]">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-[#111827]">{c.using.h2}</h2>
          <FaqList variant="hub" items={c.using.items} />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#111827]">{c.built.h2}</h2>
          <ul className="mt-6 space-y-3">
            {c.built.links.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-[16px] font-medium text-[#7C5CFC] hover:underline underline-offset-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FooterCta />
    </SiteLayout>
  )
}
