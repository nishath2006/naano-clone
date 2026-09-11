import { Link } from 'react-router-dom'
import { SiteLayout } from '@/layouts/SiteLayout'
import { LucideLinkedIn, LucideMail } from '@/components/site/icons'
import { useLocale } from '@/lib/locale'

// The live page obfuscates the address with Cloudflare's email-protection
// (data-cfemail); decoded it is info@naano.com.
const EMAIL = 'info@naano.com'

const copy = {
  en: {
    title: 'Naano Help Center: campaigns, pricing & payouts',
    description:
      'Answers to common questions about Naano: fixed-price creator campaigns, matching, payouts, and performance dashboards for B2B SaaS and creators.',
    h1: 'Help Center',
    sub: "Have a question or feedback? We're here to help.",
    contact: 'Contact us',
    before: 'Send an email to ',
    between: ', or reach out to one of us on ',
    back: 'Back to home',
  },
  fr: {
    title: 'Naano Help Center: campaigns, pricing & payouts',
    description:
      'Answers to common questions about Naano: fixed-price creator campaigns, matching, payouts, and performance dashboards for B2B SaaS and creators.',
    h1: "Centre d'aide",
    sub: 'Vous avez une question ou un commentaire ? Nous sommes là pour vous aider !',
    contact: 'Contactez-nous',
    before: 'Envoyer un courriel à ',
    between: ", ou contactez l'un d'entre nous sur ",
    back: "Retour à l'accueil",
  },
}

/**
 * /help — the live Help Center is a single "Contact us" block (no search, no
 * accordion in the captured markup).
 */
export default function Help() {
  const { locale } = useLocale()
  const c = copy[locale]

  return (
    <SiteLayout title={c.title} description={c.description} deps={[locale]}>
      <section className="pt-32 sm:pt-36 md:pt-44 pb-16 sm:pb-20 px-4 sm:px-6 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[32px] sm:text-[40px] md:text-[52px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.1] mb-4 fade-up">{c.h1}</h1>
          <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto fade-up">{c.sub}</p>
        </div>
      </section>
      <section className="pt-4 sm:pt-6 pb-24 sm:pb-36 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="py-4 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#3B82F6]">
                <LucideMail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">{c.contact}</h2>
            </div>
            <p className="text-[#4B5563] leading-relaxed text-lg">
              {c.before}
              <a href={`mailto:${EMAIL}`} className="text-[#3B82F6] hover:text-[#2563EB] font-medium underline">
                {EMAIL}
              </a>
              {c.between}
              <a
                href="https://www.linkedin.com/company/naanooo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#3B82F6] hover:text-[#2563EB] font-medium underline"
              >
                LinkedIn
                <LucideLinkedIn className="w-4 h-4" />
              </a>
            </p>
          </div>
          <div className="mt-8 text-center fade-up">
            <Link className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-medium" to="/">
              ← {c.back}
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
