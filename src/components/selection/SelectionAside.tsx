import { selectionAside as c } from './selectionCopy'

/** Left column of the shortlist card: what you receive, stats, example matches. */
export function SelectionAside() {
  return (
    <aside className="sel-value" style={{ padding: 'clamp(22px, 3vw, 30px)', background: 'linear-gradient(180deg,#FFFFFF,#FAFAF8)' }}>
      <div style={{ color: '#A7A9AF', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.eyebrow}</div>
      <h2 style={{ margin: '12px 0 10px', fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.03em', color: '#0E0F12' }}>{c.title}</h2>
      <p style={{ margin: 0, color: '#55575E', fontSize: 14.5, lineHeight: 1.6 }}>{c.body}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 18 }}>
        {c.stats.map((s) => (
          <div key={s.label} style={{ padding: '12px 10px', border: '1px solid #EFEDE9', borderRadius: 12, background: '#FFFFFF', textAlign: 'center' }}>
            <b style={{ display: 'block', fontSize: 18, letterSpacing: '-0.02em', color: 'var(--accent)' }}>{s.value}</b>
            <span style={{ display: 'block', marginTop: 3, fontSize: 11.5, lineHeight: 1.35, color: '#8A8D93' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: '14px 15px',
          border: '1px solid rgba(124,92,252,0.18)',
          borderRadius: 13,
          background: 'rgba(124,92,252,0.05)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 11,
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            flexShrink: 0,
            borderRadius: 9,
            background: '#FFFFFF',
            color: 'var(--accent)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          ↗
        </span>
        <div>
          <b style={{ display: 'block', fontSize: 13.5, color: '#0E0F12' }}>{c.callout.title}</b>
          <span style={{ display: 'block', marginTop: 4, color: '#55575E', fontSize: 12.5, lineHeight: 1.5 }}>{c.callout.body}</span>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <b style={{ fontSize: 13.5, color: '#0E0F12' }}>{c.examplesTitle}</b>
          <span style={{ color: '#A7A9AF', fontSize: 12 }}>{c.examplesHint}</span>
        </div>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {c.examples.map((ex) => (
            <div
              key={ex.name}
              style={{
                padding: 10,
                border: '1px solid #EFEDE9',
                borderRadius: 12,
                background: '#FFFFFF',
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <img src={ex.avatar} alt={ex.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ minWidth: 0 }}>
                <b style={{ display: 'block', fontSize: 13.5, color: '#0E0F12', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.name}</b>
                <span style={{ display: 'block', marginTop: 2, color: '#8A8D93', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.role}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <b style={{ display: 'block', color: 'var(--accent)', fontSize: 13.5 }}>{ex.value}</b>
                <span style={{ display: 'block', marginTop: 2, color: '#A7A9AF', fontSize: 11 }}>{ex.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18, paddingTop: 15, borderTop: '1px solid #EFEDE9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/logo.svg" alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain' }} />
        <div>
          <b style={{ display: 'block', fontSize: 13.5, color: '#0E0F12' }}>{c.sourced.title}</b>
          <span style={{ display: 'block', marginTop: 2, color: '#A7A9AF', fontSize: 12 }}>{c.sourced.body}</span>
        </div>
      </div>
    </aside>
  )
}
