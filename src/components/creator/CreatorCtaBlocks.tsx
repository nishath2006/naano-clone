import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { CreatorProfile } from '@/data/creators'
import { relatedNav, type CreatorCopy } from './creatorCopy'
import { Check, MousePointerClick, Tag } from './creatorIcons'

const POINT: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 500,
  color: '#7C5CFC',
  background: '#FFFFFF',
  border: '1px solid #DDD4FF',
  borderRadius: 999,
  padding: '5px 11px',
}

/** Blue "Want to work with {name}?" card with the three check points and the main CTA. */
export function WorkWithCta({ profile, copy }: { profile: CreatorProfile; copy: CreatorCopy }) {
  return (
    <div style={{ marginTop: 18, background: '#EEE9FF', border: '1px solid #DDD4FF', borderRadius: 16, padding: '24px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '1px solid #DDD4FF', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #DDD4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: '#7C5CFC',
              flexShrink: 0,
            }}
          >
            {profile.avatarInitial}
          </div>
        )}
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#0F172A' }}>{copy.ctaTitle(profile.name)}</p>
      </div>
      <p style={{ margin: '0 0 14px', fontSize: 13.5, color: '#64748B', lineHeight: 1.55, maxWidth: 500 }}>{copy.ctaBody}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {copy.ctaPoints.map((pt) => (
          <span key={pt} style={POINT}>
            <Check />
            {pt}
          </span>
        ))}
      </div>
      <Link
        to={profile.ctaHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 22px',
          borderRadius: 12,
          background: '#7C5CFC',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'background 0.15s ease',
        }}
      >
        {copy.ctaButton}
        <span>→</span>
      </Link>
    </div>
  )
}

/** "What is NaanoX" explainer card with the two business-model tiles. */
export function WhatIsNaano({ copy }: { copy: CreatorCopy }) {
  const tiles = [
    { icon: <Tag />, label: copy.modelFlatLabel, body: copy.modelFlatBody },
    { icon: <MousePointerClick />, label: copy.modelCpcLabel, body: copy.modelCpcBody },
  ]
  return (
    <div style={{ marginTop: 16, background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <img src="/logo.svg" alt="NaanoX" style={{ width: 20, height: 20, objectFit: 'contain' }} />
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{copy.whatIsNaanoTitle}</h2>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: '#64748B', lineHeight: 1.65 }}>{copy.whatIsNaanoBody}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 16 }}>
        {tiles.map((t) => (
          <div key={t.label} style={{ background: '#F8FAFC', border: '1px solid #E5E9F0', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  background: '#EEE9FF',
                  color: '#7C5CFC',
                }}
              >
                {t.icon}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{t.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: '#64748B', lineHeight: 1.5 }}>{t.body}</p>
          </div>
        ))}
      </div>
      <Link to="/creators" style={{ display: 'inline-block', marginTop: 16, fontSize: 13, fontWeight: 600, color: '#7C5CFC', textDecoration: 'none' }}>
        {copy.browseCreatorsLink}
      </Link>
    </div>
  )
}

/** Footer nav below the page: "More creators in X's verticals" + the creator-led growth reading list. */
export function CreatorRelatedNav({ profile }: { profile: CreatorProfile }) {
  return (
    <nav
      aria-label="Learn more about NaanoX"
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '0 20px 56px',
        // The live page leaves this nav on the browser's UI font (outside the Inter-styled <main>).
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      }}
    >
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20, fontSize: 13, lineHeight: 1.7, color: '#6B7280' }}>
        {profile.moreCreators.length > 0 && (
          <p style={{ margin: '0 0 12px' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>{relatedNav.moreCreators(profile.firstName)}</span>{' '}
            {profile.moreCreators.map((l, i) => (
              <span key={l.href}>
                {i > 0 && ' · '}
                <Link to={l.href} style={{ color: '#7C5CFC' }}>
                  {l.label}
                </Link>
              </span>
            ))}
          </p>
        )}
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#374151' }}>{relatedNav.newTo}</p>
        <p style={{ margin: 0 }}>
          {relatedNav.links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && ' · '}
              <Link to={l.href} style={{ color: '#7C5CFC' }}>
                {l.label}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </nav>
  )
}
