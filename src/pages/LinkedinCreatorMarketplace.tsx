import { SiteLayout } from '@/layouts/SiteLayout'
import { DarkHero, HeroBackLink } from '@/components/site/DarkHero'
import { DataTable, TD, TD_LEAD, TH } from '@/components/site/DataTable'
import { FaqList } from '@/components/site/FaqList'
import { FooterCta } from '@/components/site/FooterCta'
import { PillLink } from '@/components/site/Pill'
import { LINK_HUB, Rich } from '@/components/site/TextLink'
import { useLocale } from '@/lib/locale'
import { marketplaceCopy } from '@/data/linkedin-creator-marketplace'

const H2 = 'text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-[#111827]'
const BODY = 'text-[17px] leading-[1.75] text-[#374151]'
const STRONG = 'font-semibold text-[#111827]'

/** `/linkedin-creator-marketplace` — category page positioning NaanoX against LinkedIn's alpha. */
export default function LinkedinCreatorMarketplace() {
  const { locale } = useLocale()
  const c = marketplaceCopy[locale]

  return (
    <SiteLayout title={c.title} description={c.description} className="min-h-screen bg-white text-[#111827]">
      <DarkHero padding="pt-28 pb-16 sm:pt-32 sm:pb-20">
        <HeroBackLink />
        <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] max-w-[900px]">{c.hero.h1}</h1>
        <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-[720px] leading-relaxed">{c.hero.lede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PillLink href="/register" variant="whiteOffset" arrow>
            {c.hero.primary}
          </PillLink>
          <PillLink href="/selection" variant="outline">
            {c.hero.secondary}
          </PillLink>
        </div>
      </DarkHero>

      <section className="py-16 sm:py-20">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <h2 className={H2}>{c.what.h2}</h2>
          <p className={`mt-6 ${BODY}`}>
            <Rich segs={c.what.p1} linkClass={LINK_HUB} strongClass={STRONG} />
          </p>
          <p className={`mt-5 ${BODY}`}>{c.what.p2}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#FAFAFA] border-y border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className={H2}>{c.how.h2}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#4B5563] max-w-[680px]">{c.how.lede}</p>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 list-none pl-0">
            {c.how.steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(17,24,39,0.05)]">
                <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-sm font-bold text-[#7C5CFC] tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-[-0.01em] text-[#111827]">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#4B5563]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <h2 className={H2}>{c.vs.h2}</h2>
          <p className={`mt-6 ${BODY} max-w-[820px]`}>{c.vs.lede}</p>
          <DataTable
            head={c.vs.head}
            rows={c.vs.rows}
            cellClasses={[TD_LEAD, TD, TD_LEAD]}
            wrapClassName="mt-8 overflow-x-auto rounded-2xl border border-[#E5E7EB]"
            tableClassName="w-full text-sm border-separate border-spacing-0"
            theadClassName=""
            thClassName={`${TH} whitespace-nowrap bg-[#F9FAFB]`}
          />
          <p className="mt-5 text-sm text-[#6B7280]">
            <Rich segs={c.vs.note} linkClass={LINK_HUB} />
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#FAFAFA] border-y border-[#E5E7EB]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <h2 className={H2}>{c.cost.h2}</h2>
          <p className={`mt-6 ${BODY} max-w-[820px]`}>{c.cost.lede}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {c.cost.tiles.map((t) => (
              <div key={t.value} className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_1px_3px_rgba(17,24,39,0.05)]">
                <p className="text-4xl font-bold tracking-[-0.03em] text-[#7C5CFC] tabular-nums">{t.value}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-[#4B5563]">{t.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[16px] leading-relaxed text-[#4B5563] max-w-[820px]">
            <Rich segs={c.cost.after} linkClass={LINK_HUB} />
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <h2 className={H2}>{c.who.h2}</h2>
          <p className={`mt-6 ${BODY}`}>
            <Rich segs={c.who.p} linkClass={LINK_HUB} />
          </p>
          <h3 className="mt-10 text-xl font-bold tracking-[-0.01em] text-[#111827]">{c.who.h3}</h3>
          <p className={`mt-3 ${BODY}`}>
            <Rich segs={c.who.p2} linkClass={LINK_HUB} />
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#FAFAFA] border-y border-[#E5E7EB]">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <h2 className={H2}>{c.faq.h2}</h2>
          <FaqList variant="hub" items={c.faq.items} />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-10 shadow-[0_1px_3px_rgba(17,24,39,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B7280]">{c.cta.eyebrow}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#111827]">{c.cta.h2}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#4B5563] max-w-xl">{c.cta.p}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PillLink href="/register" variant="dark" arrow>
                {c.cta.primary}
              </PillLink>
              <PillLink href="/selection" variant="light">
                {c.cta.shortlist}
              </PillLink>
              <PillLink href="/pricing" variant="light">
                {c.cta.pricing}
              </PillLink>
            </div>
          </div>
        </div>
      </section>

      <FooterCta />
    </SiteLayout>
  )
}
