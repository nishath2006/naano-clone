import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRight } from '@/components/lp/icons'
import { FaqAccordion } from '@/components/lp/FaqAccordion'
import { CREATORS_FAQ } from '@/data/faq'
import { useLocale, useT } from '@/lib/locale'

const faqCopy = {
  en: { title: 'Frequently asked questions', sub: 'Everything you need to know before you start earning.' },
  fr: { title: 'Questions fréquentes', sub: "Tout ce qu'il faut savoir avant de commencer à gagner." },
}

export function CreatorsFaqSection() {
  const t = useT()
  const { locale } = useLocale()
  const c = t(faqCopy)
  return (
    <div id="faq" data-screen-label="FAQ" style={{ padding: '40px 84px 100px 84px' }}>
      <h2 style={{ margin: 0, textAlign: 'center', fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', color: '#17181C' }}>
        {c.title}
        <span style={{ color: 'var(--accent)' }}>.</span>
      </h2>
      <p style={{ margin: '16px 0 0 0', textAlign: 'center', fontSize: 19, color: '#55575E' }}>{c.sub}</p>
      <div style={{ maxWidth: 820, margin: '60px auto 0 auto' }}>
        <FaqAccordion key={locale} items={CREATORS_FAQ[locale]} />
      </div>
    </div>
  )
}

const ctaCopy = {
  en: {
    eyebrow: 'READY TO EARN?',
    titleA: "You've seen how it works.",
    titleB: 'Now get paid for it.',
    body: "Join 2,000+ creators already getting paid to post on LinkedIn. It's free, and you keep 100% of what you earn.",
    cta: 'Apply now',
    note: 'Takes 2 minutes. No commitment.',
    chips: ['2,000+ creators paid', 'Paid within 24h', 'Quit anytime, keep your earnings'],
  },
  fr: {
    eyebrow: 'PRÊT À GAGNER ?',
    titleA: 'Vous avez vu comment ça marche.',
    titleB: 'Maintenant, soyez payé pour ça.',
    body: 'Rejoignez 2 000+ créateurs déjà payés pour poster sur LinkedIn. C\'est gratuit, et vous gardez 100 % de ce que vous gagnez.',
    cta: 'Postuler maintenant',
    note: '2 minutes. Sans engagement.',
    chips: ['2 000+ créateurs payés', 'Payé sous 24h', 'Arrêtez quand vous voulez, gardez vos gains'],
  },
}

export function CreatorsCtaSection() {
  const t = useT()
  const c = t(ctaCopy)
  return (
    <div data-screen-label="Get started" style={{ padding: '60px 84px 140px 84px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--accent)' }}>{c.eyebrow}</div>
        <h2 style={{ margin: '20px 0 0 0', fontSize: 64, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.02, color: '#17181C' }}>
          {c.titleA}
          <br />
          {c.titleB}
        </h2>
        <p style={{ margin: '26px auto 0 auto', maxWidth: 600, fontSize: 19, lineHeight: 1.55, color: '#55575E' }}>{c.body}</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <NavAnchor
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 11,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              background: '#17181C',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 600,
              padding: '16px 28px',
              borderRadius: 12,
              boxShadow: '0 12px 30px rgba(23,24,28,0.18)',
            }}
          >
            {c.cta}
            <ArrowRight size={17} />
          </NavAnchor>
        </div>
        <div style={{ marginTop: 16, fontSize: 15, color: '#9B9DA3' }}>{c.note}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14, marginTop: 40 }}>
          {c.chips.map((chip) => (
            <span
              key={chip}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                background: '#FFFFFF',
                border: '1px solid #ECEAE6',
                borderRadius: 999,
                padding: '11px 20px',
                fontSize: 15,
                fontWeight: 600,
                color: '#26272C',
                boxShadow: '0 4px 14px rgba(23,24,28,0.04)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="5 12.5 10 17.5 19 7" />
              </svg>
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
