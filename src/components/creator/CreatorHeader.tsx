import type { CSSProperties } from 'react'
import type { CreatorProfile } from '@/data/creators'
import type { CreatorCopy } from './creatorCopy'
import { MapPin } from './creatorIcons'

const STAT_VALUE: CSSProperties = { fontSize: 23, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }
const STAT_LABEL: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#64748B',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: 7,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

/** Round avatar (86px) with the initial-letter fallback used when the creator has no photo. */
export function CreatorAvatar({ profile }: { profile: CreatorProfile }) {
  if (profile.avatarUrl) {
    return (
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        style={{
          width: 86,
          height: 86,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '3px solid #FFFFFF',
          boxShadow: '0 0 0 1px #E5E9F0, 0 4px 12px rgba(124,92,252,0.10)',
          flexShrink: 0,
        }}
      />
    )
  }
  return (
    <div
      style={{
        width: 86,
        height: 86,
        borderRadius: '50%',
        background: '#EEE9FF',
        border: '3px solid #FFFFFF',
        boxShadow: '0 0 0 1px #E5E9F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30.96,
        fontWeight: 800,
        color: '#7C5CFC',
        flexShrink: 0,
      }}
    >
      {profile.avatarInitial}
    </div>
  )
}

/** Profile card: avatar, name, headline, location + sector chips, availability badge and the 3-stat row. */
export function CreatorHeader({ profile, copy }: { profile: CreatorProfile; copy: CreatorCopy }) {
  return (
    <header
      style={{
        position: 'relative',
        overflow: 'visible',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFCFF 100%)',
        border: '1px solid #E5E9F0',
        borderRadius: 16,
        padding: '26px 26px 22px',
        boxShadow: '0 6px 24px rgba(124,92,252,0.07)',
        marginBottom: 14,
      }}
    >
      <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 2, borderRadius: '16px 16px 0 0', background: '#CBD5E1' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
        <CreatorAvatar profile={profile} />
        <div style={{ flex: '1 1 200px', minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, minWidth: 0 }}>
            <h1 style={{ fontSize: 27, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.1, letterSpacing: '-0.025em', wordBreak: 'break-word' }}>
              {profile.name}
            </h1>
          </div>
          {profile.headline && <p style={{ fontSize: 14, color: '#64748B', margin: '6px 0 0', lineHeight: 1.45 }}>{profile.headline}</p>}
          {(profile.location || profile.sectors.length > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {profile.location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#64748B' }}>
                  <MapPin /> {profile.location}
                </span>
              )}
              {profile.sectors.map((s) => (
                <span key={s} style={{ fontSize: 11.5, fontWeight: 600, color: '#7C5CFC', background: '#EEE9FF', padding: '3px 10px', borderRadius: 999 }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        {profile.badge && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 12,
              fontWeight: 600,
              color: '#12A150',
              background: '#E4F7EC',
              border: '1px solid #C7EDD6',
              padding: '6px 13px',
              borderRadius: 999,
              flexShrink: 0,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#12A150' }} />
            {copy.badges[profile.badge]}
          </span>
        )}
      </div>
      {profile.headerStats.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 22, paddingTop: 20, borderTop: '1px solid #EEF1F6' }}>
          {profile.headerStats.map((s, i) => (
            <div
              key={s.key}
              style={{ flex: '1 1 0', minWidth: 92, padding: i === 0 ? '0 20px 0 0' : '0 20px', borderLeft: i === 0 ? 'none' : '1px solid #EEF1F6' }}
            >
              <div style={STAT_VALUE}>{s.value}</div>
              <div style={STAT_LABEL}>{copy.stats[s.key]}</div>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
