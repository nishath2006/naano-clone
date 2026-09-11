import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRightSmall } from '@/components/lp/icons'
import { FaqAccordion } from '@/components/lp/FaqAccordion'
import { HOME_FAQ } from '@/data/faq'
import { useLocale, useT } from '@/lib/locale'

const copy = {
  en: { title: 'Frequently asked questions', sub: 'Everything you need to know before getting started.', still: 'Still have questions?', talk: 'Talk to our team' },
  fr: { title: 'Questions fréquentes', sub: "Tout ce qu'il faut savoir avant de démarrer.", still: 'Encore des questions ?', talk: "Parler à l'équipe" },
}

export function FaqSection() {
  const t = useT()
  const { locale } = useLocale()
  const c = t(copy)
  return (
    <div id="faq" className="lp-system-section lp-system-faq" data-screen-label="FAQ">
      <div className="lp-faq-layout">
        <div className="lp-faq-intro rv rv-d0">
          <h2 style={{ margin: 0, textAlign: 'center', fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--nn-ink, #111318)' }}>
            {c.title}
            <span>.</span>
          </h2>
          <p style={{ margin: '16px 0 0 0', textAlign: 'center', fontSize: 19, lineHeight: 1.5, color: '#55575E' }}>{c.sub}</p>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 28, fontSize: 15, color: '#70747b' }}>
            <span>{c.still}</span>
            <NavAnchor
              href="/book"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none', color: 'var(--nn-ink, #111318)', fontWeight: 650 }}
            >
              {c.talk}
              <ArrowRightSmall size={15} strokeWidth={2.2} />
            </NavAnchor>
          </div>
        </div>
        <div
          className="lp-faq-shell rv rv-d1"
          style={{
            maxWidth: 860,
            margin: '60px auto 0 auto',
            padding: '8px 36px',
            background: 'var(--nn-glass-strong, rgba(255,255,255,.88))',
            border: '1px solid var(--nn-glass-border, rgba(255,255,255,.92))',
            borderRadius: 28,
            boxShadow: '0 28px 80px -56px rgba(56,96,128,.4)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <FaqAccordion key={locale} items={HOME_FAQ[locale]} />
        </div>
      </div>
    </div>
  )
}
