import { useT } from '@/lib/locale'

const copy = {
  en: {
    title: 'Monetize your content on NaanoX',
    body: 'Accept deals from brands you know, or bring your own onto the platform and get paid faster.',
    captions: {
      mediaKit: ['Launch a professional', 'media kit in minutes'],
      payment: 'Instant payment',
      network: 'Get sponsored by our network',
      own: 'Bring your own deals & earn extra',
      workflows: ['Workflows to accelerate', 'collaborations'],
    },
  },
  fr: {
    title: 'Monétisez votre contenu sur NaanoX',
    body: 'Acceptez des deals de marques que vous connaissez, ou amenez les vôtres sur la plateforme et soyez payé plus vite.',
    captions: {
      mediaKit: ['Launch a professional', 'media kit in minutes'],
      payment: 'Instant payment',
      network: 'Get sponsored by our network',
      own: 'Bring your own deals & earn extra',
      workflows: ['Workflows to accelerate', 'collaborations'],
    },
  },
}

const CELL: React.CSSProperties = { background: '#FFFFFF', border: '1px solid #EDEBE7', borderRadius: 22, padding: '30px 30px 34px', display: 'flex', flexDirection: 'column' }
const PREVIEW: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#FBFAF8',
  border: '1px solid #F0EEEA',
  borderRadius: 16,
  padding: '28px 24px',
  minHeight: 200,
}
const MINI = (maxWidth: number, padding = 20): React.CSSProperties => ({
  width: '100%',
  maxWidth,
  background: '#FFFFFF',
  border: '1px solid #EDEBE7',
  borderRadius: 14,
  boxShadow: '0 18px 40px -22px rgba(23,24,28,0.28)',
  padding,
})
const CAPTION: React.CSSProperties = { marginTop: 24, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#17181C', textAlign: 'center' }
const AVATAR = (src: string, size: number): React.CSSProperties => ({
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: '#EDEBE7',
  backgroundImage: `url("${src}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0,
})

const LOGOMARKS = [
  { left: '5%', top: '10%', rot: -8, src: '/lp/logomark-lemlist.png', alt: 'lemlist', h: 34 },
  { left: '37%', top: '4%', rot: 6, src: '/lp/logomark-flame.png', alt: '', h: 34 },
  { left: '70%', top: '12%', rot: -6, src: '/lp/logomark-teal-circle.png', alt: '', h: 30 },
  { left: '15%', top: '56%', rot: 7, src: '/lp/logomark-circle-dark.png', alt: '', h: 30 },
  { left: '48%', top: '62%', rot: -9, src: '/lp/logomark-bolt.png', alt: '', h: 34 },
]

export function MonetizeSection() {
  const t = useT()
  const c = t(copy)
  return (
    <div id="monetize" data-screen-label="Get sponsored" style={{ padding: '92px 84px 100px 84px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.02fr 1fr 1fr', gap: 20, alignItems: 'stretch' }}>
        <div className="lp-mz-cell" style={{ gridColumn: 1, gridRow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '4px 8px 26px 4px' }}>
          <h2 style={{ margin: 0, fontSize: 50, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.04, color: '#17181C' }}>
            {c.title}
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
          <p style={{ margin: '20px 0 0 0', fontSize: 19, lineHeight: 1.5, color: '#55575E', maxWidth: 400 }}>{c.body}</p>
        </div>

        {/* Media kit */}
        <div className="lp-mz-cell" style={{ ...CELL, gridColumn: 2, gridRow: 1 }}>
          <div style={PREVIEW}>
            <div style={MINI(272)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={AVATAR('/lp/avatar-e.png', 42)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#17181C' }}>Robin Tempe</div>
                  <div style={{ fontSize: 11.5, color: '#8A8C92' }}>B2B SaaS · Product</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F7F4FF', color: 'var(--accent)', fontSize: 10.5, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>
                  in LinkedIn
                </span>
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FDECEC', color: '#E0455A', fontSize: 11.5, fontWeight: 700, padding: '5px 9px', borderRadius: 7 }}>▶ 97K views</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F7F4FF', color: 'var(--accent)', fontSize: 11.5, fontWeight: 700, padding: '5px 9px', borderRadius: 7 }}>◎ 34K reach</span>
              </div>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', gap: 6, height: 44 }}>
                {[
                  ['38%', '#E7E4DF'],
                  ['62%', '#E4DDFF'],
                  ['52%', '#E7E4DF'],
                  ['88%', 'var(--accent)'],
                  ['70%', '#E4DDFF'],
                  ['100%', 'var(--accent)'],
                ].map(([h, bg], i) => (
                  <span key={i} style={{ flex: 1, height: h, background: bg, borderRadius: '4px 4px 0 0' }} />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 13, borderTop: '1px solid #F0EEEA' }}>
                <span style={{ fontSize: 11.5, color: '#8A8C92' }}>Starting rate</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#17181C' }}>€800 / post</span>
              </div>
            </div>
          </div>
          <div style={CAPTION}>
            {c.captions.mediaKit[0]}
            <br />
            {c.captions.mediaKit[1]}
          </div>
        </div>

        {/* Instant payment */}
        <div className="lp-mz-cell" style={{ ...CELL, gridColumn: 3, gridRow: 1 }}>
          <div style={PREVIEW}>
            <div style={MINI(256)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#16A34A', fontSize: 12.5, fontWeight: 700 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="8 12.5 11 15.5 16 9" />
                  </svg>
                  Payment received
                </span>
                <span style={{ fontSize: 10.5, color: '#8A8C92' }}>Today</span>
              </div>
              <div style={{ marginTop: 12, fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#17181C', lineHeight: 1 }}>€5,000</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#E7F7EC', color: '#16A34A', fontSize: 10.5, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>⚡ Instant · SEPA</span>
                <span style={{ fontSize: 11, color: '#8A8C92' }}>Attio campaign</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, paddingTop: 14, borderTop: '1px solid #F0EEEA' }}>
                <span style={AVATAR('/lp/avatar-f.png', 28)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#17181C' }}>Paid to your account</div>
                  <div style={{ fontSize: 10.5, color: '#8A8C92' }}>No invoice, no chasing</div>
                </div>
              </div>
            </div>
          </div>
          <div style={CAPTION}>{c.captions.payment}</div>
        </div>

        {/* Network */}
        <div className="lp-mz-cell" style={{ ...CELL, gridColumn: 1, gridRow: 2 }}>
          <div style={PREVIEW}>
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 190 }}>
              {LOGOMARKS.map((m) => (
                <span
                  key={m.src}
                  style={{
                    position: 'absolute',
                    left: m.left,
                    top: m.top,
                    width: 62,
                    height: 62,
                    borderRadius: 16,
                    background: '#FFFFFF',
                    border: '1px solid #EDEBE7',
                    boxShadow: '0 12px 26px -12px rgba(23,24,28,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${m.rot}deg)`,
                  }}
                >
                  <img src={m.src} alt={m.alt} style={{ maxHeight: m.h, maxWidth: 40, objectFit: 'contain' }} />
                </span>
              ))}
              <span
                style={{
                  position: 'absolute',
                  left: '78%',
                  top: '58%',
                  width: 62,
                  height: 62,
                  borderRadius: 16,
                  background: 'var(--accent)',
                  boxShadow: '0 12px 30px -8px rgba(124,92,252,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(5deg)',
                }}
              >
                <img src="/lp/naano-logo-footer.png" alt="NaanoX" style={{ maxHeight: 22, maxWidth: 52, objectFit: 'contain' }} />
              </span>
            </div>
          </div>
          <div style={CAPTION}>{c.captions.network}</div>
        </div>

        {/* Bring your own deals */}
        <div className="lp-mz-cell" style={{ ...CELL, gridColumn: 2, gridRow: 2 }}>
          <div style={PREVIEW}>
            <div style={MINI(264)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: '#F7F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#17181C' }}>A deal you sourced</div>
              </div>
              <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #EDEBE7', borderRadius: 9, padding: '9px 12px', background: '#FBFAF8' }}>
                <span style={{ fontSize: 13, color: '#8A8C92' }}>yourbrand.com</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#17181C' }}>€2,000</span>
              </div>
              <div style={{ marginTop: 12, background: '#E7F7EC', border: '1px solid #CFEDD8', borderRadius: 9, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#16A34A' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
                  </svg>
                  NaanoX bonus
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#16A34A' }}>+ €300</span>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: '#8A8C92' }}>Contract & payout handled. You just close it.</div>
            </div>
          </div>
          <div style={CAPTION}>{c.captions.own}</div>
        </div>

        {/* Workflows */}
        <div className="lp-mz-cell" style={{ ...CELL, gridColumn: 3, gridRow: 2 }}>
          <div style={PREVIEW}>
            <div style={MINI(264, 18)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: '#EEE9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🔔</span>
                <div style={{ fontSize: 13, lineHeight: 1.35, color: '#26272C' }}>
                  <span style={{ fontWeight: 700 }}>Attio</span> sent a collaboration request
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EEE9FF', color: '#5B5FE0', fontSize: 11.5, fontWeight: 700, padding: '5px 10px', borderRadius: 999 }}>◆ Sponsored post</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F7F4FF', color: 'var(--accent)', fontSize: 11.5, fontWeight: 700, padding: '5px 10px', borderRadius: 7 }}>€1,000</span>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: '#8A8C92' }}>Deliver by · Aug 12 · 1 post + 1 repost</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <span style={{ flex: 1, textAlign: 'center', background: '#17181C', color: '#FFFFFF', fontSize: 12.5, fontWeight: 600, padding: '8px 0', borderRadius: 8 }}>Accept</span>
                <span style={{ flex: 1, textAlign: 'center', background: '#F4F2EE', color: '#55575E', fontSize: 12.5, fontWeight: 600, padding: '8px 0', borderRadius: 8 }}>Decline</span>
              </div>
            </div>
          </div>
          <div style={CAPTION}>
            {c.captions.workflows[0]}
            <br />
            {c.captions.workflows[1]}
          </div>
        </div>
      </div>
    </div>
  )
}
