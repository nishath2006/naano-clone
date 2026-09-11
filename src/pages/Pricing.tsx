import { Link } from 'react-router-dom'
import { SiteLayout } from '@/layouts/SiteLayout'
import { Eyebrow } from '@/components/site/Eyebrow'
import { CheckItem, LabeledCard } from '@/components/site/CheckItem'
import { DarkCtaSection, DARK_CTA_PRIMARY, DARK_CTA_SECONDARY } from '@/components/site/DarkCta'
import { LucideArrowRight } from '@/components/site/icons'
import { PRICING_COPY } from '@/data/pricing'
import { useLocale } from '@/lib/locale'

const H2 = 'text-[clamp(24px,3vw,36px)] font-light leading-[1.15] tracking-[-0.02em] text-foreground'
const ROW_HEAD = 'p-5 text-sm font-semibold text-muted-foreground align-top'
const CELL = 'p-5 text-sm text-foreground leading-relaxed align-top'

export default function Pricing() {
  const { locale } = useLocale()
  const c = PRICING_COPY[locale]

  return (
    <SiteLayout title={c.title} description={c.description} deps={[locale]}>
      {/* Hero */}
      <section className="bg-white pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-[820px] mx-auto text-center">
          <Eyebrow>{c.hero.eyebrow}</Eyebrow>
          <h1 className="text-[clamp(32px,5vw,56px)] font-light leading-[1.1] tracking-[-0.025em] text-foreground mb-6">{c.hero.h1}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">{c.hero.intro}</p>
        </div>
      </section>

      {/* Plan comparison table */}
      <section className="bg-white pb-20 px-4 sm:px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F3F4F6]">
                  <th className="p-5 text-sm font-semibold text-muted-foreground uppercase tracking-[0.08em] w-[22%]"> </th>
                  <th className="p-5 text-base font-bold text-foreground">{c.table.plans[0]}</th>
                  <th className="p-5 text-base font-bold text-foreground">{c.table.plans[1]}</th>
                </tr>
              </thead>
              <tbody>
                {c.table.rows.map((row) => (
                  <tr key={row.label} className="border-t border-[#E5E7EB]">
                    <th scope="row" className={ROW_HEAD}>
                      {row.label}
                    </th>
                    <td className={CELL}>{row.selfServe}</td>
                    <td className={CELL}>{row.managed}</td>
                  </tr>
                ))}
                <tr className="border-t border-[#E5E7EB]">
                  <th scope="row" className="p-5 align-top" />
                  <td className="p-5 align-top">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-foreground border-b-[1.5px] border-foreground pb-0.5"
                    >
                      {c.table.startFree}
                      <LucideArrowRight size={14} />
                    </Link>
                  </td>
                  <td className="p-5 align-top">
                    <Link
                      to="/book"
                      className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#17181C] text-white text-sm font-semibold hover:bg-black transition-colors duration-200"
                    >
                      {c.table.bookCall}
                      <LucideArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">{c.table.note}</p>
        </div>
      </section>

      {/* How per-post pricing works */}
      <section className="bg-[#F3F4F6] py-16 px-4 sm:px-6">
        <div className="max-w-[760px] mx-auto">
          <Eyebrow>{c.perPost.eyebrow}</Eyebrow>
          <h2 className={`${H2} mb-6`}>{c.perPost.h2}</h2>
          <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
            {c.perPost.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQ (static list on the live page) */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-[820px] mx-auto">
          <h2 className={`${H2} mb-10 text-center`}>{c.faq.h2}</h2>
          <div className="divide-y divide-[#E5E7EB]">
            {c.faq.items.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Both plans include */}
      <section className="bg-[#F3F4F6] py-16 px-4 sm:px-6">
        <div className="max-w-[760px] mx-auto">
          <LabeledCard label={c.included.label} className="p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {c.included.items.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </div>
          </LabeledCard>
        </div>
      </section>

      <DarkCtaSection
        title={c.cta.h2}
        body={c.cta.body}
        actions={
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/register" className={DARK_CTA_PRIMARY}>
              {c.cta.primary} <LucideArrowRight size={16} />
            </Link>
            <Link to="/book" className={DARK_CTA_SECONDARY}>
              {c.cta.secondary} <LucideArrowRight size={16} />
            </Link>
          </div>
        }
      />
    </SiteLayout>
  )
}
