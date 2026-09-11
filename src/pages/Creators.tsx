import { useRef } from 'react'
import { LpLayout } from '@/layouts/LpLayout'
import { CreatorsHero } from '@/components/creators/CreatorsHero'
import { MonetizeSection } from '@/components/creators/MonetizeSection'
import { CreatorQuoteSection, PlatformSection } from '@/components/creators/PlatformSection'
import { CreatorResultsSection } from '@/components/creators/CreatorResultsSection'
import { ReviewsSection } from '@/components/creators/ReviewsSection'
import { CreatorsCtaSection, CreatorsFaqSection } from '@/components/creators/CreatorsFaqAndCta'
import { useRevealOnScroll } from '@/hooks/useReveal'
import { useCountUp } from '@/hooks/useCountUp'
import { useLocale } from '@/lib/locale'

const META = {
  en: {
    title: 'Get paid for your LinkedIn content: Naano for creators',
    description: 'Choose deals from B2B brands you know, post in your own voice, and get paid within 24h. No negotiating, no admin.',
  },
  fr: {
    title: 'Soyez payé pour votre contenu LinkedIn : Naano pour les créateurs',
    description: 'Choisissez des deals de marques B2B que vous connaissez, postez avec votre voix, et soyez payé sous 24h.',
  },
}

export default function Creators() {
  const { locale } = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  useRevealOnScroll(ref, { deps: [locale] })
  useCountUp(ref, 1100, [locale])
  return (
    <LpLayout variant="creators" title={META[locale].title} description={META[locale].description}>
      <div ref={ref} key={locale} style={{ display: 'contents' }}>
        <CreatorsHero />
        <MonetizeSection />
        <PlatformSection />
        <CreatorQuoteSection />
        <CreatorResultsSection />
        <ReviewsSection />
        <CreatorsFaqSection />
        <CreatorsCtaSection />
      </div>
    </LpLayout>
  )
}
