import { useEffect, useRef } from 'react'
import { Star } from '@/components/lp/icons'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    eyebrow: 'THE PLATFORM',
    titleA: "For creators who don't want",
    titleB: 'the administrative burden.',
    body: 'Find deals, get paid, and track your performance from one dashboard. No invoicing, no chasing, no spreadsheets.',
    features: [
      ['Centralized opportunities', 'Discover brand deals that match your audience.'],
      ['Payments built-in', 'Get paid on time with secure, transparent payouts.'],
      ['Track performance', 'See views, clicks and engagement in real time.'],
      ['Easy delivery', 'Manage deals and deliver content with ease.'],
    ],
    alt: 'Naano creator dashboard',
  },
  fr: {
    eyebrow: 'LA PLATEFORME',
    titleA: 'Pour les créateurs qui ne veulent pas',
    titleB: 'de la charge administrative.',
    body: 'Trouvez des collaborations, recevez vos paiements et suivez vos performances depuis un seul dashboard. Aucune facture, aucune relance, aucun tableur.',
    features: [
      ['Opportunités centralisées', 'Découvrez des deals de marques qui matchent votre audience.'],
      ['Paiements intégrés', 'Soyez payé à temps, de façon sécurisée et transparente.'],
      ['Suivi de performance', 'Vues, clics et engagement en temps réel.'],
      ['Livraison simple', 'Gérez vos collaborations et livrez vos contenus simplement.'],
    ],
    alt: 'Dashboard créateur Naano',
  },
}

export function PlatformSection() {
  const t = useT()
  const c = t(copy)
  return (
    <div id="platform" data-screen-label="Platform" style={{ padding: '80px 84px 96px 84px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--accent)' }}>{c.eyebrow}</div>
        <h2 style={{ margin: '18px 0 0 0', textAlign: 'center', fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.06, color: '#17181C' }}>
          {c.titleA}
          <br />
          {c.titleB}
        </h2>
        <p style={{ margin: '16px 0 0 0', textAlign: 'center', fontSize: 19, color: '#55575E' }}>{c.body}</p>
      </div>
      <div
        style={{
          maxWidth: 1180,
          margin: '56px auto 0 auto',
          border: '1px solid #E4E1DC',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 40px 90px -40px rgba(23,24,28,0.42)',
          background: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid #EDEBE7', background: '#FBFAF8' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#E5726A' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#E8B54A' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#5FB666' }} />
          <span style={{ marginLeft: 14, fontSize: 12.5, color: '#9B9DA3' }}>naano.com/overview</span>
        </div>
        <img src="/lp/dashboard-creator.webp" alt={c.alt} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, maxWidth: 1180, margin: '44px auto 0 auto' }}>
        {c.features.map(([title, body]) => (
          <div key={title} style={{ background: '#FFFFFF', border: '1px solid #EDEBE7', borderRadius: 16, padding: '22px 22px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: '#17181C' }}>{title}</div>
            <p style={{ margin: '8px 0 0 0', fontSize: 14, lineHeight: 1.5, color: '#8B8D94' }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const quote = {
  en: {
    words: ['I', 'was', 'able', 'to', 'select', 'my', 'rate', 'and', 'get', 'paid', 'the', 'moment', 'the', 'post', 'went', 'live'],
    name: 'Thomas Higadère',
    role: 'B2B & AI creator · 34K followers',
  },
  fr: {
    words: ["J'ai", 'pu', 'choisir', 'mon', 'tarif', 'et', 'être', 'payé', 'dès', 'que', 'le', 'post', 'était', 'en', 'ligne'],
    name: 'Thomas Higadère',
    role: 'Créateur B2B & IA · 34K abonnés',
  },
}

export function CreatorQuoteSection() {
  const t = useT()
  const c = t(quote)
  const ref = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-word]'))
    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.5)))
      const lit = Math.round(p * words.length)
      words.forEach((w, i) => {
        w.style.opacity = i < lit ? '1' : '0.14'
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [c])

  return (
    <div
      data-screen-label="Quote"
      style={{ minHeight: 620, padding: '90px 84px 96px 84px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#F5A623' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={22} />
        ))}
      </div>
      <blockquote
        ref={ref}
        style={{ margin: '40px 0 0 0', maxWidth: 1040, fontSize: 44, lineHeight: 1.24, fontWeight: 500, letterSpacing: '-0.02em', color: '#17181C', textWrap: 'balance' }}
      >
        “
        {c.words.map((w, i) => (
          <span key={i} data-word style={{ opacity: 0.14, transition: 'opacity 0.4s ease' }}>
            {w}{' '}
          </span>
        ))}
        <span data-word style={{ opacity: 0.14, transition: 'opacity 0.4s ease', color: 'var(--accent)' }}>
          .
        </span>
        ”
      </blockquote>
      <span
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          backgroundColor: '#EDEBE7',
          backgroundImage: 'url("/lp/avatar-c.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: 44,
          display: 'inline-block',
        }}
      />
      <div style={{ fontSize: 19, fontWeight: 700, color: '#17181C', marginTop: 20 }}>{c.name}</div>
      <div style={{ fontSize: 16, color: '#55575E', marginTop: 6 }}>{c.role}</div>
    </div>
  )
}
