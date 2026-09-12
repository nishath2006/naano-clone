import { Flags, Lock } from '@/components/lp/icons'
import { useT } from '@/lib/locale'

const copy = {
  en: {
    eyebrow: 'The NaanoX creator marketplace',
    title: 'Work with all the best creators.',
    body: 'Find the right B2B voices, compare their audience fit, and book every collaboration from one place.',
    screenshotAlt: 'NaanoX marketplace showing a curated selection of B2B creators',
    creators: ['3,000+ vetted creators', 'Specialist B2B voices, ready to collaborate.'],
    countries: ['Across 100 countries', 'Local expertise with genuinely global reach.'],
    matching: ['Matched to your buyers', 'Audience fit comes before follower count.'],
    creatorType: 'AI & SaaS creator',
    buyers: ['Founders', 'Sales leaders', 'GTM teams'],
  },
  fr: {
    eyebrow: 'La marketplace de créateurs NaanoX',
    title: 'Collaborez avec les meilleurs créateurs.',
    body: "Trouvez les bonnes voix B2B, comparez l'adéquation de leur audience et réservez chaque collaboration en un seul endroit.",
    screenshotAlt: 'Marketplace NaanoX présentant une sélection de créateurs B2B',
    creators: ['Plus de 3 000 créateurs vérifiés', 'Des voix B2B spécialisées, prêtes à collaborer.'],
    countries: ['Présents dans 100 pays', 'Une expertise locale avec une portée véritablement mondiale.'],
    matching: ['Alignés avec vos acheteurs', "L'adéquation de l'audience prime sur le nombre de followers."],
    creatorType: 'Créateur IA & SaaS',
    buyers: ['Fondateurs', 'Responsables commerciaux', 'Équipes GTM'],
  },
}

const AVATARS = ['/lp/avatar-a.png', '/lp/avatar-d.png', '/lp/avatar-g.png', '/lp/avatar-b.png', '/lp/avatar-e.png']
const FLAGS = [Flags.fr, Flags.us, Flags.de, Flags.gb, Flags.es, Flags.ca, Flags.nl]

export function MarketplaceSection() {
  const t = useT()
  const c = t(copy)
  return (
    <section className="lp-marketplace" data-screen-label="Creator marketplace" aria-labelledby="lp-marketplace-title">
      <div className="lp-marketplace__inner">
        <header className="lp-marketplace__header rv rv-d0">
          <div className="lp-marketplace__eyebrow">
            <span className="lp-marketplace__eyebrow-dot" />
            {c.eyebrow}
          </div>
          <h2 id="lp-marketplace-title" className="lp-marketplace__title">
            {c.title}
          </h2>
          <p className="lp-marketplace__copy">{c.body}</p>
        </header>

        <div className="lp-marketplace__stage rv rv-d1">
          <img src="/lp/marketplace-atmosphere-v1.png" alt="" className="lp-marketplace__atmosphere" loading="lazy" />
          <div className="lp-marketplace__glow" />
          <div className="lp-marketplace__product-shell">
            <div className="lp-marketplace__chrome">
              <div className="lp-marketplace__traffic-lights">
                <span />
                <span />
                <span />
              </div>
              <div className="lp-marketplace__address">
                <span className="lp-marketplace__lock">
                  <Lock />
                </span>
                naano.co/marketplace
              </div>
              <span className="lp-marketplace__chrome-space" />
            </div>
            <div className="lp-marketplace__screen">
              <img src="/lp/marketplace-screenshot-clean-v2.png" alt={c.screenshotAlt} className="lp-marketplace__screenshot" loading="lazy" />
            </div>
          </div>
          <div className="lp-marketplace__shadow" />
        </div>

        <div className="lp-marketplace__signals rv rv-d2">
          <article className="lp-marketplace__signal lp-marketplace__signal--creators rv rv-d0">
            <div className="lp-marketplace__signal-cloud" />
            <div className="lp-marketplace__avatar-field">
              {AVATARS.map((src, i) => (
                <span key={src} style={{ '--avatar-index': i } as React.CSSProperties}>
                  <img src={src} alt="" loading="lazy" />
                </span>
              ))}
            </div>
            <div className="lp-marketplace__signal-copy">
              <strong>{c.creators[0]}</strong>
              <span>{c.creators[1]}</span>
            </div>
          </article>

          <article className="lp-marketplace__signal lp-marketplace__signal--countries rv rv-d1">
            <div className="lp-marketplace__signal-cloud" />
            <div className="lp-marketplace__map">
              {FLAGS.map((flag, i) => (
                <span key={i} className={`lp-marketplace__flag lp-marketplace__flag--${i + 1}`}>
                  {flag}
                </span>
              ))}
            </div>
            <div className="lp-marketplace__signal-copy">
              <strong>{c.countries[0]}</strong>
              <span>{c.countries[1]}</span>
            </div>
          </article>

          <article className="lp-marketplace__signal lp-marketplace__signal--matching rv rv-d2">
            <div className="lp-marketplace__signal-cloud" />
            <div className="lp-marketplace__match">
              <div className="lp-marketplace__match-creator">
                <span className="lp-marketplace__match-person">
                  <img src="/lp/avatar-f.png" alt="" loading="lazy" />
                </span>
                <span>{c.creatorType}</span>
              </div>
              <svg className="lp-marketplace__match-bridge" viewBox="0 0 96 52" aria-hidden="true">
                <path d="M3 37 C27 4 68 4 93 36" />
                <circle cx="48" cy="13" r="5" />
              </svg>
              <span className="lp-marketplace__match-score">96%</span>
              <div className="lp-marketplace__buyer-cluster">
                {c.buyers.map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
            <div className="lp-marketplace__signal-copy">
              <strong>{c.matching[0]}</strong>
              <span>{c.matching[1]}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
