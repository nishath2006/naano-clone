import type { Locale } from '@/lib/locale'

export type LpNavVariant = 'home' | 'creators' | 'agencies'

export type NavLink = { label: string; href: string }

type LpNavCopy = {
  logoHref: string
  links: NavLink[]
  resources: { label: string; items: NavLink[] }
  mobileExtra: NavLink[]
  signIn: NavLink
  cta: NavLink
}

const resources: Record<Locale, { label: string; items: NavLink[] }> = {
  en: {
    label: 'Resources',
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Free Tools', href: '/free-tools' },
      { label: 'Case study: BlogSEO', href: '/case-studies/blogseo' },
    ],
  },
  fr: {
    label: 'Ressources',
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Outils gratuits', href: '/free-tools' },
      { label: 'Étude de cas : BlogSEO', href: '/case-studies/blogseo' },
    ],
  },
}

const primary: Record<Locale, { companies: string; creators: string; agencies: string; how: string }> = {
  en: { companies: 'For companies', creators: 'For creators', agencies: 'For agencies', how: 'How it works' },
  fr: { companies: 'Pour les entreprises', creators: 'Pour les créateurs', agencies: 'Pour les agences', how: 'Comment ça marche' },
}

const signIn: Record<Locale, NavLink> = {
  en: { label: 'Sign in', href: '/login?reauth=1' },
  fr: { label: 'Se connecter', href: '/login?reauth=1' },
}

const ctas: Record<LpNavVariant, Record<Locale, NavLink>> = {
  home: { en: { label: 'Sign up', href: '/register' }, fr: { label: "S'inscrire", href: '/register' } },
  creators: { en: { label: 'Start earning', href: '/register' }, fr: { label: 'Commencer à gagner', href: '/register' } },
  agencies: {
    en: { label: 'Choose your agency', href: '/agencies#choose' },
    fr: { label: 'Choisir mon agence', href: '/agencies#choose' },
  },
}

export function getLpNav(variant: LpNavVariant, locale: Locale): LpNavCopy {
  const p = primary[locale]
  const base: NavLink[] = [
    { label: p.companies, href: '/' },
    { label: p.creators, href: '/creators' },
    { label: p.agencies, href: '/agencies' },
  ]
  const how: NavLink | null =
    variant === 'home'
      ? { label: p.how, href: '/#how-it-works' }
      : variant === 'creators'
        ? { label: p.how, href: '/creators#platform' }
        : null
  const links = how ? [...base, how] : base
  const logoHref = variant === 'home' ? '/' : variant === 'creators' ? '/creators' : '/agencies'
  return {
    logoHref,
    links,
    resources: resources[locale],
    mobileExtra: resources[locale].items,
    signIn: signIn[locale],
    cta: ctas[variant][locale],
  }
}
