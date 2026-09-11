import { Star } from '@/components/lp/icons'
import { useT } from '@/lib/locale'

type Review = { text: string; name: string; meta: string; avatar: string }

const copy = {
  en: {
    eyebrow: 'FROM THE COMMUNITY',
    title: 'What creators say',
    sub: '2,000+ creators already getting paid on Naano.',
    stats: [
      ['2,000+', 'Creators'],
      ['€500', 'Avg. per deal'],
      ['€1,500', 'Top deal'],
    ],
    reviews: [
      { text: 'Naano is the marketplace LinkedIn was missing. The founders truly listen and do everything they can to build something that brings real value to its users.', name: 'Raphael Alfero', meta: 'B2B creator · 18K followers', avatar: '/lp/avatar-d.png' },
      { text: "At first I wasn't sure what to expect. But the whole experience was simple and smooth: clear opportunities, an easy platform, everything well guided. A real bridge between creators and brands.", name: 'Aya Dara', meta: 'Content creator · 9K followers', avatar: '/lp/avatar-f.png' },
      { text: 'Excellent experience. The platform is simple and efficient, the team ultra-responsive, and results come fast. I recommend it whether you want to grow your name or create content.', name: 'Robin Tempe', meta: 'Sales creator · 14K followers', avatar: '/lp/avatar-e.png' },
      { text: 'Great experience, I love the platform, it helps me every day. I already made money with it from day one.', name: 'Thomas Higadère', meta: 'B2B & AI creator · 34K followers', avatar: '/lp/avatar-c.png' },
      { text: 'Naano lets me keep making useful content while monetizing my LinkedIn community. We never give up!', name: 'Eric Djavid', meta: 'LinkedIn creator · 40K followers', avatar: '/lp/avatar-b.png' },
      { text: "A young team that's ambitious, efficient and driven. Super proactive and always listening. I'd tell every creator to join Naano!", name: 'Nada Ait Ouchene', meta: 'Marketing creator · 11K followers', avatar: '/lp/avatar-a.png' },
    ] as Review[],
  },
  fr: {
    eyebrow: 'DE LA COMMUNAUTÉ',
    title: 'Ce que disent les créateurs',
    sub: '2 000+ créateurs déjà payés sur Naano.',
    stats: [
      ['2,000+', 'Créateurs'],
      ['€500', 'Moy. par collaboration'],
      ['€1,500', 'Meilleur deal'],
    ],
    reviews: [
      { text: 'Naano est la marketplace qui manquait à LinkedIn. Les fondateurs écoutent vraiment et font tout pour construire quelque chose qui apporte de la vraie valeur.', name: 'Raphael Alfero', meta: 'Créateur B2B · 18K abonnés', avatar: '/lp/avatar-d.png' },
      { text: "Au début je ne savais pas à quoi m'attendre. Mais l'expérience a été simple et fluide : des opportunités claires, une plateforme facile, tout bien guidé. Un vrai pont entre créateurs et marques.", name: 'Aya Dara', meta: 'Créatrice de contenu · 9K abonnés', avatar: '/lp/avatar-f.png' },
      { text: "Excellente expérience. La plateforme est simple et efficace, l'équipe ultra-réactive, et les résultats arrivent vite. Je recommande que vous vouliez grandir ou créer du contenu.", name: 'Robin Tempe', meta: 'Créateur sales · 14K abonnés', avatar: '/lp/avatar-e.png' },
      { text: "Super expérience, j'adore la plateforme, elle m'aide au quotidien. J'ai déjà gagné de l'argent dès le premier jour.", name: 'Thomas Higadère', meta: 'Créateur B2B & IA · 34K abonnés', avatar: '/lp/avatar-c.png' },
      { text: "Naano me permet de continuer à créer du contenu utile tout en monétisant ma communauté LinkedIn. On n'abandonne jamais !", name: 'Eric Djavid', meta: 'Créateur LinkedIn · 40K abonnés', avatar: '/lp/avatar-b.png' },
      { text: "Une jeune équipe ambitieuse, efficace et motivée. Super proactive et toujours à l'écoute. Je dirais à chaque créateur de rejoindre Naano !", name: 'Nada Ait Ouchene', meta: 'Créatrice marketing · 11K abonnés', avatar: '/lp/avatar-a.png' },
    ] as Review[],
  },
}

export function ReviewsSection() {
  const t = useT()
  const c = t(copy)
  return (
    <div id="reviews" data-screen-label="Reviews" style={{ padding: '80px 84px 100px 84px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.22em', color: 'var(--accent)' }}>{c.eyebrow}</span>
      </div>
      <h2 style={{ margin: 0, textAlign: 'center', fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', color: '#17181C', marginTop: 20 }}>
        {c.title}
        <span style={{ color: 'var(--accent)' }}>.</span>
      </h2>
      <p style={{ margin: '16px 0 0 0', textAlign: 'center', fontSize: 19, color: '#55575E' }}>{c.sub}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: 44 }}>
        {c.stats.map(([value, label], i) => (
          <span key={label} style={{ display: 'contents' }}>
            {i > 0 && <span style={{ width: 1, height: 44, background: '#E4E1DC' }} />}
            <div style={{ textAlign: 'center', padding: '0 30px' }}>
              <div data-cu="" style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', color: '#17181C', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 14, color: '#8B8D94', marginTop: 10 }}>{label}</div>
            </div>
          </span>
        ))}
      </div>
      <div data-reviews-masonry style={{ columnCount: 3, columnGap: 22, maxWidth: 1160, margin: '60px auto 0 auto' }}>
        {c.reviews.map((r) => (
          <div
            key={r.name}
            style={{
              breakInside: 'avoid',
              display: 'inline-block',
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #EDEBE7',
              borderRadius: 20,
              padding: '26px 24px',
              marginBottom: 22,
              position: 'relative',
              boxShadow: '0 1px 2px rgba(23,24,28,0.05),0 12px 28px -20px rgba(23,24,28,0.28)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 8,
                right: 22,
                fontFamily: "Georgia,'Times New Roman',serif",
                fontSize: 70,
                lineHeight: 1,
                color: 'var(--accent)',
                opacity: 0.1,
                pointerEvents: 'none',
              }}
            >
              ”
            </span>
            <div style={{ display: 'flex', gap: 2 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={15} />
              ))}
            </div>
            <p style={{ margin: '16px 0 0 0', fontSize: 16, lineHeight: 1.6, color: '#2B2D33', letterSpacing: '-0.004em' }}>{r.text}</p>
            <div style={{ height: 1, background: '#F0EEEA', margin: '22px 0 18px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ position: 'relative', flexShrink: 0, display: 'inline-block' }}>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#EDEBE7',
                    backgroundImage: `url("${r.avatar}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: -2,
                    bottom: -2,
                    width: 19,
                    height: 19,
                    borderRadius: 6,
                    background: '#0A66C2',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.83v2.19h.05c.53-1 1.84-2.19 3.79-2.19C22.6 8 24 10.02 24 14.06V24h-4v-8.86c0-2.11-.75-3.55-2.64-3.55-1.44 0-2.3.97-2.68 1.91-.14.34-.17.81-.17 1.28V24h-4V8z" />
                  </svg>
                </span>
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#17181C' }}>{r.name}</div>
                <div style={{ fontSize: 12.5, color: '#8B8D94', marginTop: 2 }}>{r.meta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
