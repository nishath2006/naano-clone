import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findCreator, type CreatorProfile as Profile } from '@/data/creators'
import { useDocumentMeta } from '@/layouts/LpLayout'
import { useLocale } from '@/lib/locale'
import { creatorCopy } from '@/components/creator/creatorCopy'
import { CreatorHeader } from '@/components/creator/CreatorHeader'
import { CreatorSections } from '@/components/creator/CreatorSections'
import { CreatorRelatedNav, WhatIsNaano, WorkWithCta } from '@/components/creator/CreatorCtaBlocks'
import NotFound from './NotFound'

/**
 * /creators/:slug — public creator profile. The live page is a standalone
 * Inter-font document (own mini header, no site nav / footer), so it is not
 * wrapped in SiteLayout. Data comes from `creators.json`, loaded on demand.
 */
export default function CreatorProfile() {
  const { slug = '' } = useParams()
  const { locale } = useLocale()
  const copy = creatorCopy[locale]
  const [state, setState] = useState<{ slug: string; profile: Profile | null } | null>(null)

  useEffect(() => {
    let cancelled = false
    findCreator(slug).then((profile) => {
      if (!cancelled) setState({ slug, profile })
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  const profile = state?.slug === slug ? state.profile : undefined
  useDocumentMeta(profile?.title ?? 'Naano', profile?.description)

  useEffect(() => {
    document.documentElement.style.background = '#F7F8FA'
    return () => {
      document.documentElement.style.background = ''
    }
  }, [])

  if (profile === null) return <NotFound />

  return (
    <>
      <div className="bg-noise" />
      <main style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#F7F8FA', minHeight: '100vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px 64px' }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '1px solid #E5E9F0',
            }}
          >
            <Link to="/creators" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/logo.svg" alt="naano" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1652F0', letterSpacing: '-0.02em', lineHeight: 1.05 }}>naano</div>
                <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 1 }}>{copy.brandTagline}</div>
              </div>
            </Link>
            <Link to="/creators" style={{ fontSize: 12.5, fontWeight: 600, color: '#1652F0', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {copy.browseCreatorsLink}
            </Link>
          </header>
          {profile && (
            <>
              <CreatorHeader profile={profile} copy={copy} />
              <CreatorSections sections={profile.sections} copy={copy} />
              <WorkWithCta profile={profile} copy={copy} />
              <WhatIsNaano copy={copy} />
            </>
          )}
        </div>
      </main>
      {profile && <CreatorRelatedNav profile={profile} />}
    </>
  )
}
