import { Link } from 'react-router-dom'
import { LpLayout } from '@/layouts/LpLayout'
import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowRight, Check } from '@/components/lp/icons'
import { useLocale, useT } from '@/lib/locale'

const copy = {
  en: {
    title: 'NaanoX for agencies — Brand and creator operations',
    description: 'NaanoX separates brand operations from creator management. Choose your setup and create the right workspace for your agency.',
    badge: 'NaanoX for agencies',
    h1: 'Choose the workspace that matches your agency.',
    p: 'NaanoX separates brand operations from creator management. Choose your setup and create the right workspace for your agency.',
    heroCta: 'Choose your agency',
    eyebrow: 'Two distinct products',
    h2: 'What does your agency manage?',
    cards: [
      {
        number: '01',
        type: 'Brand agency',
        title: 'I manage campaigns for companies',
        body: 'Operate separate client workspaces, budgets, campaigns and reporting from one portfolio.',
        items: ['Create one workspace per client', 'Add and allocate client budgets', 'Track campaigns and next actions'],
        cta: 'Create a brand agency workspace',
        href: '/agency',
        note: 'You will create the agency manager account first.',
      },
      {
        number: '02',
        type: 'Creator agency',
        title: 'I represent and manage creators',
        body: 'Import your roster, manage every profile and run collaborations without creator logins.',
        items: ['Import any creator roster CSV', 'Manage rates and creator profiles', 'Track collaborations and earnings'],
        cta: 'Create a creator agency workspace',
        href: '/talent-agency',
        note: 'Your creators do not need individual NaanoX accounts.',
      },
    ],
    callEyebrow: 'Talk to NaanoX',
    callTitle: 'Not sure which workspace fits your agency?',
    callBody: 'Book a 30-minute agency call. We will look at how you manage clients or creators and point you to the right setup.',
    callCta: 'Book a call',
    callNote: '30 minutes with the NaanoX team. No commitment.',
  },
  fr: {
    title: 'NaanoX pour les agences — Opérations marques et créateurs',
    description: 'NaanoX sépare les opérations pour les marques de la gestion des créateurs. Choisissez votre configuration et créez le bon workspace pour votre agence.',
    badge: 'NaanoX pour les agences',
    h1: 'Choisissez le workspace adapté à votre agence.',
    p: 'NaanoX sépare les opérations pour les marques de la gestion des créateurs. Choisissez votre configuration et créez le bon workspace pour votre agence.',
    heroCta: 'Choisir mon agence',
    eyebrow: 'Deux produits distincts',
    h2: 'Que gère votre agence ?',
    cards: [
      {
        number: '01',
        type: 'Agence de marques',
        title: 'Je gère des campagnes pour des entreprises',
        body: 'Pilotez les workspaces, budgets, campagnes et reportings de vos clients depuis un seul portfolio.',
        items: ['Créez un workspace par client', 'Ajoutez et allouez les budgets clients', 'Suivez les campagnes et les prochaines actions'],
        cta: 'Créer un workspace d’agence de marques',
        href: '/agency',
        note: 'Vous créerez d’abord le compte du responsable d’agence.',
      },
      {
        number: '02',
        type: 'Agence de créateurs',
        title: 'Je représente et gère des créateurs',
        body: 'Importez votre roster, gérez chaque profil et pilotez les collaborations sans connexion des créateurs.',
        items: ['Importez n’importe quel CSV de créateurs', 'Gérez les tarifs et les profils créateurs', 'Suivez les collaborations et les revenus'],
        cta: 'Créer un workspace d’agence de créateurs',
        href: '/talent-agency',
        note: 'Vos créateurs n’ont pas besoin de comptes NaanoX individuels.',
      },
    ],
    callEyebrow: 'Échangez avec NaanoX',
    callTitle: 'Vous hésitez entre les deux workspaces d’agence ?',
    callBody: 'Réservez un appel de 30 minutes dédié aux agences. Nous regarderons comment vous gérez vos clients ou vos créateurs et vous orienterons vers la bonne configuration.',
    callCta: 'Réserver un appel',
    callNote: '30 minutes avec l’équipe NaanoX. Sans engagement.',
  },
}

export default function Agencies() {
  const t = useT()
  const { locale } = useLocale()
  const c = t(copy)
  return (
    <LpLayout variant="agencies" title={c.title} description={c.description} mainClassName="ag-page">
      <div key={locale} style={{ display: 'contents' }}>
        <div className="ag-navSpacer" />
        <section className="ag-hero" data-screen-label="Hero" style={{ position: 'relative' }}>
          <div className="lp-cloud-scene">
            <img src="/lp/hero-clouds-cotton-blue-v7.png" alt="" className="lp-cloud-image" decoding="async" fetchPriority="high" />
          </div>
          <div className="ag-badge">{c.badge}</div>
          <h1>{c.h1}</h1>
          <p>{c.p}</p>
          <div className="ag-heroActions">
            <NavAnchor href="/agencies#choose" className="lp-hero-primary ag-primaryAction">
              {c.heroCta}
              <ArrowRight size={17} />
            </NavAnchor>
          </div>
        </section>

        <section id="choose" className="ag-choices" aria-labelledby="agency-choice-title">
          <header className="ag-sectionHeading">
            <span>{c.eyebrow}</span>
            <h2 id="agency-choice-title">{c.h2}</h2>
          </header>
          <div className="ag-grid">
            {c.cards.map((card) => (
              <article key={card.number} className="ag-card">
                <div className="ag-cardHeader">
                  <span className="ag-cardNumber">{card.number}</span>
                  <span className="ag-type">{card.type}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ul>
                  {card.items.map((item) => (
                    <li key={item}>
                      <Check size={16} strokeWidth={2.4} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={card.href}>
                  {card.cta}
                  <ArrowRight size={17} />
                </Link>
                <small>{card.note}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="book-a-call" className="ag-bookCall" aria-labelledby="agency-call-title">
          <div className="ag-bookCallInner">
            <span>{c.callEyebrow}</span>
            <h2 id="agency-call-title">{c.callTitle}</h2>
            <p>{c.callBody}</p>
            <Link to="/book">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="17" rx="3" />
                <path d="M8 2v4M16 2v4M3 10h18" />
              </svg>
              {c.callCta}
              <ArrowRight size={17} />
            </Link>
            <small>{c.callNote}</small>
          </div>
        </section>
      </div>
    </LpLayout>
  )
}
