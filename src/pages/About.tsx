import { Link } from 'react-router-dom'
import { SiteLayout } from '@/layouts/SiteLayout'
import { Eyebrow } from '@/components/site/Eyebrow'
import { CheckItem, LabeledCard } from '@/components/site/CheckItem'
import { DarkCtaSection, DARK_CTA_PRIMARY } from '@/components/site/DarkCta'
import { LucideArrowRight, LucideLinkedIn } from '@/components/site/icons'
import { ABOUT_COPY, ABOUT_TEAM } from '@/data/about'
import { useLocale } from '@/lib/locale'

const GLANCE_LINK = 'text-[#7C5CFC] underline underline-offset-4 decoration-[#7C5CFC]/30 hover:decoration-[#7C5CFC]'

const H2_SMALL = 'text-[clamp(24px,3vw,36px)] font-light leading-[1.15] tracking-[-0.02em] text-foreground'

export default function About() {
  const { locale } = useLocale()
  const c = ABOUT_COPY[locale]
  const n = c.glance.note

  return (
    <SiteLayout title={c.title} description={c.description} deps={[locale]}>
      {/* Our story + team */}
      <section className="bg-white pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto text-center">
          <div className="mb-16 fade-up">
            <Eyebrow>{c.story.eyebrow}</Eyebrow>
            <h1 className="text-[clamp(32px,5vw,60px)] font-light leading-[1.1] tracking-[-0.025em] text-foreground mb-5">
              {c.story.h1[0]}
              <br />
              {c.story.h1[1]}
            </h1>
            <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">{c.story.sub}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 fade-up">
            {ABOUT_TEAM.map((m) => (
              <div key={m.name} className="flex flex-col items-center gap-3">
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="relative group block">
                  <img
                    alt={m.alt}
                    loading="lazy"
                    width={112}
                    height={112}
                    decoding="async"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
                    style={{ color: 'transparent', objectPosition: m.objectPosition }}
                    sizes="(max-width: 640px) 96px, 112px"
                    src={m.src}
                  />
                  <div className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center ring-2 ring-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <LucideLinkedIn className="w-4 h-4 text-white" />
                  </div>
                </a>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we started */}
      <section className="bg-[#F3F4F6] py-20 px-4 sm:px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="fade-up">
            <Eyebrow tone="muted">{c.started.eyebrow}</Eyebrow>
            <h2 className={`${H2_SMALL} mb-8`}>{c.started.h2}</h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              {c.started.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our mission */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="fade-up">
            <Eyebrow>{c.mission.eyebrow}</Eyebrow>
            <h2 className={`${H2_SMALL} mb-6`}>{c.mission.h2}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{c.mission.intro}</p>
            <div className="space-y-3 mt-6">
              {c.mission.items.map((item) => (
                <CheckItem key={item} iconSize={16} textClassName="text-base text-foreground">
                  {item}
                </CheckItem>
              ))}
            </div>
            <p className="text-base text-muted-foreground leading-relaxed mt-6">{c.mission.outro}</p>
          </div>
        </div>
      </section>

      {/* NaanoX at a glance */}
      <section className="bg-white pb-20 px-4 sm:px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="fade-up">
            <Eyebrow>{c.glance.eyebrow}</Eyebrow>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-8">
              {c.glance.facts.map((f) => (
                <div key={f.term}>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1">{f.term}</dt>
                  <dd className="text-sm text-foreground font-medium leading-relaxed">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {n.before}
              <Link className={GLANCE_LINK} to="/benchmarks/q2-2026">
                {n.benchmark}
              </Link>
              {n.afterBenchmark}
              <Link className={GLANCE_LINK} to="/blog/creator-led-growth-b2b">
                {n.guide}
              </Link>
              {n.afterGuide}
              <Link className={GLANCE_LINK} to="/best-b2b-influencer-marketing-platforms-2026">
                {n.platforms}
              </Link>
              {n.afterPlatforms}
              <Link className={GLANCE_LINK} to="/creators">
                {n.network}
              </Link>
              {n.and}
              <Link className={GLANCE_LINK} to="/pricing">
                {n.pricing}
              </Link>
              {n.end}
            </p>
          </div>
        </div>
      </section>

      {/* Why naano */}
      <section className="bg-[#F3F4F6] py-20 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12 fade-up">
            <Eyebrow>{c.why.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(28px,3.5vw,46px)] font-light leading-[1.1] tracking-[-0.025em] text-foreground">
              {c.why.h2[0]}
              <br />
              {c.why.h2[1]}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <LabeledCard label={c.why.brands.label} fadeUp>
              <div className="space-y-4">
                {c.why.brands.items.map((item) => (
                  <CheckItem key={item} iconTone="foreground">
                    {item}
                  </CheckItem>
                ))}
              </div>
            </LabeledCard>
            <LabeledCard label={c.why.creators.label} fadeUp>
              <div className="space-y-4">
                {c.why.creators.items.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </div>
            </LabeledCard>
          </div>
        </div>
      </section>

      <DarkCtaSection
        fadeUp
        eyebrow={c.cta.eyebrow}
        title={c.cta.h2}
        body={c.cta.body}
        footnote={c.cta.footnote}
        actions={
          <Link to="/register" className={DARK_CTA_PRIMARY}>
            {c.cta.button} <LucideArrowRight size={16} />
          </Link>
        }
      />
    </SiteLayout>
  )
}
