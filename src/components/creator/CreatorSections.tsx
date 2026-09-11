import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type {
  AboutSection,
  AudienceSection,
  CreatorSection,
  CustomSection,
  EngagersSection,
  PostsSection,
  PricingSection,
} from '@/data/creators'
import type { CreatorCopy } from './creatorCopy'
import { ArrowUpRight, Heart, MessageCircle } from './creatorIcons'

const CARD: CSSProperties = { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: 16, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }
const H2: CSSProperties = { fontSize: 13.5, fontWeight: 700, color: '#0F172A', margin: '0 0 14px', letterSpacing: '-0.01em' }
const MUTED_NOTE: CSSProperties = { margin: 0, fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5 }
const UPPER_LABEL: CSSProperties = { fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }
const PRE_WRAP_P: CSSProperties = { fontSize: 13.5, color: '#64748B', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }

const STAT_CARD: CSSProperties = { background: '#F8FAFC', border: '1px solid #E5E9F0', borderRadius: 12, padding: '13px 15px', minWidth: 0 }
const STAT_VALUE: CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: '#0F172A',
  letterSpacing: '-0.02em',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}
const STAT_LABEL: CSSProperties = { ...UPPER_LABEL, marginTop: 7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }

const BUTTON: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '11px 20px',
  borderRadius: 12,
  background: '#1652F0',
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 700,
  textDecoration: 'none',
  transition: 'background 0.15s ease',
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={CARD}>
      <h2 style={H2}>{title}</h2>
      {children}
    </section>
  )
}

function About({ s, copy }: { s: AboutSection; copy: CreatorCopy }) {
  return (
    <Section title={copy.sections.about}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {s.position && <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{s.position}</div>}
        {s.bio && <p style={PRE_WRAP_P}>{s.bio}</p>}
        {s.sectors.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {s.sectors.map((x) => (
              <span key={x} style={{ fontSize: 12, fontWeight: 500, color: '#1652F0', background: '#EAF0FF', padding: '4px 11px', borderRadius: 999 }}>
                {x}
              </span>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

function Audience({ s, copy }: { s: AudienceSection; copy: CreatorCopy }) {
  const ago = s.updated ? `${s.updated.n} ${copy.agoUnit[s.updated.unit] ?? s.updated.unit}` : null
  return (
    <Section title={copy.sections.audience}>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 10 }}>
          {s.cards.map((c) => (
            <div key={c.key} style={STAT_CARD}>
              <div style={STAT_VALUE}>{c.value}</div>
              <div style={STAT_LABEL}>{copy.stats[c.key]}</div>
            </div>
          ))}
          {s.note && <p style={{ gridColumn: '1 / -1', margin: '2px 0 0', fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5 }}>{copy.notes[s.note]}</p>}
        </div>
        {ago && <p style={{ margin: '10px 0 0', fontSize: 11.5, color: '#94A3B8' }}>{copy.statsUpdatedAgo(ago)}</p>}
      </div>
    </Section>
  )
}

function Posts({ s, copy }: { s: PostsSection; copy: CreatorCopy }) {
  return (
    <Section title={copy.sections.posts}>
      {s.empty ? (
        <p style={MUTED_NOTE}>{copy.notes[s.empty]}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {s.posts.map((p) => (
            <div
              key={p.url}
              style={{ border: '1px solid #E5E9F0', borderRadius: 12, padding: 14, background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.naano && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#1652F0',
                      background: '#EAF0FF',
                      padding: '2px 6px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {copy.naanoTag}
                  </span>
                )}
                <span style={{ fontSize: 10, color: '#94A3B8', textTransform: 'capitalize' }}>{p.type}</span>
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: '#0F172A',
                  margin: 0,
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {p.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, fontSize: 12, color: '#64748B', marginTop: 'auto' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Heart />
                  {p.reactions}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <MessageCircle />
                  {p.comments}
                </span>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="View on LinkedIn"
                  style={{ marginLeft: 'auto', color: '#1652F0', display: 'inline-flex', alignItems: 'center' }}
                >
                  <ArrowUpRight />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function Engagers({ s, copy }: { s: EngagersSection; copy: CreatorCopy }) {
  return (
    <Section title={copy.sections.engagers}>
      {s.empty ? (
        <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>{copy.notes.notEnoughEngagementData}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{copy.engagersIntro}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={UPPER_LABEL}>{copy.bySeniority}</div>
            {s.seniority.map((row) => (
              <div key={row.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#0F172A', marginBottom: 4 }}>
                  <span>{copy.seniority[row.key]}</span>
                  <span style={{ fontWeight: 600 }}>{row.value}</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#EEF1F6', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: row.width, height: '100%', background: '#1652F0', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
          {s.functions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={UPPER_LABEL}>{copy.byFunction}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {s.functions.map((f) => (
                  <span
                    key={f.key}
                    style={{ fontSize: 12.5, color: '#0F172A', background: '#F8FAFC', border: '1px solid #E5E9F0', borderRadius: 8, padding: '5px 12px' }}
                  >
                    {copy.functions[f.key]} <span style={{ color: '#94A3B8', fontWeight: 600 }}>{f.value}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  )
}

function Pricing({ s, copy }: { s: PricingSection; copy: CreatorCopy }) {
  return (
    <Section title={copy.sections.pricing}>
      <div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ flex: '1 1 140px', background: '#E4F7EC', border: '1px solid #C7EDD6', borderRadius: 12, padding: '13px 15px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#12A150', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.price}</div>
            <div style={{ fontSize: 11, color: '#12A150', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginTop: 7 }}>{copy.pricePerPost}</div>
          </div>
          {s.bundles.map((b) => (
            <div key={b.count} style={{ flex: '1 1 140px', background: '#F8FAFC', border: '1px solid #E5E9F0', borderRadius: 12, padding: '13px 15px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{copy.bundleSummary(b.count, b.price)}</div>
              <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginTop: 7 }}>{copy.bundleLabel}</div>
            </div>
          ))}
        </div>
        <Link to={s.cta} style={BUTTON}>
          {copy.bookCtaButton}
          <span>→</span>
        </Link>
      </div>
    </Section>
  )
}

function Custom({ s }: { s: CustomSection }) {
  return (
    <Section title={s.title}>
      {s.body !== null && <p style={PRE_WRAP_P}>{s.body}</p>}
      {s.items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {s.items.map((it, i) => (
            <a
              key={it.href + i}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={it.title}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px 8px 8px',
                background: '#FFFFFF',
                border: '1px solid #E5E9F0',
                borderRadius: 999,
                textDecoration: 'none',
                maxWidth: '100%',
              }}
            >
              <img
                src={it.favicon}
                alt={it.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', background: '#FFFFFF', flexShrink: 0 }}
              />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</span>
            </a>
          ))}
        </div>
      )}
    </Section>
  )
}

/** Renders the profile sections in the creator's own order. */
export function CreatorSections({ sections, copy }: { sections: CreatorSection[]; copy: CreatorCopy }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {sections.map((s, i) => {
        switch (s.kind) {
          case 'about':
            return <About key={i} s={s} copy={copy} />
          case 'audience':
            return <Audience key={i} s={s} copy={copy} />
          case 'posts':
            return <Posts key={i} s={s} copy={copy} />
          case 'engagers':
            return <Engagers key={i} s={s} copy={copy} />
          case 'pricing':
            return <Pricing key={i} s={s} copy={copy} />
          default:
            return <Custom key={i} s={s} />
        }
      })}
    </div>
  )
}
