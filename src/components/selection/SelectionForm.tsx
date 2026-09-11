import { useState, type CSSProperties, type FormEvent } from 'react'
import { selectionForm as c } from './selectionCopy'

const INPUT: CSSProperties = {
  width: '100%',
  height: 46,
  padding: '0 14px',
  fontSize: 15,
  color: '#17181C',
  background: '#FFFFFF',
  border: '1px solid #E7E5E1',
  borderRadius: 10,
  outline: 'none',
  fontFamily: 'inherit',
}
const LABEL: CSSProperties = { display: 'block', marginBottom: 8, fontSize: 13.5, fontWeight: 600, color: '#2C2E33' }
const OPTIONAL: CSSProperties = { color: '#A7A9AF', fontWeight: 500 }

type Status = 'idle' | 'sending' | 'done' | 'error'

/**
 * The "Get your creator shortlist" brief form (client component of the live
 * page). Same fields, defaults (Generate leads / €10,000), presets, honeypot
 * and status flow as naano.com. The live page POSTs to /api/leads/shortlist;
 * without a backend the submission is acknowledged locally after a short delay.
 */
export function SelectionForm() {
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [goal, setGoal] = useState(c.goals[0].label)
  const [budget, setBudget] = useState('10000')
  const [target, setTarget] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    window.setTimeout(() => setStatus('done'), 700)
  }

  if (status === 'done') {
    return (
      <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center', minHeight: 480, padding: '30px 20px' }}>
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(22,163,74,0.1)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <h3 style={{ margin: '18px 0 8px', fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#0E0F12' }}>{c.doneTitle}</h3>
          <p style={{ maxWidth: 360, margin: '0 auto', color: '#55575E', fontSize: 14.5, lineHeight: 1.6 }}>{c.doneBody}</p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="lp-fhover"
            style={{
              marginTop: 18,
              height: 40,
              padding: '0 16px',
              border: '1px solid #E7E5E1',
              borderRadius: 999,
              background: '#FFFFFF',
              color: '#17181C',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {c.doneAgain}
          </button>
        </div>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', color: '#0E0F12' }}>{c.title}</h3>
          <p style={{ margin: '6px 0 0', color: '#8A8D93', fontSize: 13.5, lineHeight: 1.5 }}>{c.subtitle}</p>
        </div>
        <span style={{ flexShrink: 0, padding: '6px 11px', borderRadius: 999, background: '#EEF8F2', color: '#23724F', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {c.badge}
        </span>
      </div>

      <div style={{ marginTop: 20 }}>
        <label htmlFor="sel-company" style={LABEL}>
          {c.company}
        </label>
        <input
          id="sel-company"
          type="text"
          required
          maxLength={120}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder={c.companyPlaceholder}
          autoComplete="organization"
          style={INPUT}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <label htmlFor="sel-website" style={LABEL}>
          {c.website}
          <span style={OPTIONAL}>{c.optional}</span>
        </label>
        <input
          id="sel-website"
          type="text"
          maxLength={300}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder={c.websitePlaceholder}
          autoComplete="url"
          inputMode="url"
          style={INPUT}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <label htmlFor="sel-email" style={LABEL}>
          {c.email}
        </label>
        <input id="sel-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={c.emailPlaceholder} style={INPUT} />
      </div>

      <div style={{ marginTop: 18 }}>
        <span style={LABEL}>{c.goal}</span>
        <div className="sel-goals" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
          {c.goals.map((g) => {
            const on = goal === g.label
            return (
              <button
                key={g.label}
                type="button"
                onClick={() => setGoal(g.label)}
                aria-pressed={on}
                style={{
                  minHeight: 72,
                  padding: 12,
                  border: on ? '1px solid rgba(37,99,235,0.45)' : '1px solid #E7E5E1',
                  borderRadius: 11,
                  background: on ? 'rgba(37,99,235,0.06)' : '#FFFFFF',
                  boxShadow: on ? 'inset 0 0 0 1px rgba(37,99,235,0.25)' : 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <b style={{ display: 'block', fontSize: 13, fontWeight: 700, color: on ? 'var(--accent)' : '#2C2E33' }}>{g.label}</b>
                <span style={{ display: 'block', marginTop: 4, fontSize: 12, lineHeight: 1.4, color: '#8A8D93' }}>{g.hint}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label htmlFor="sel-budget" style={LABEL}>
          {c.budget}
          <span style={OPTIONAL}>{c.budgetHint}</span>
        </label>
        <div style={{ display: 'flex', alignItems: 'stretch', height: 54, border: '1px solid #E7E5E1', borderRadius: 12, background: '#FFFFFF', overflow: 'hidden' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              flexShrink: 0,
              borderRight: '1px solid #EFEDE9',
              background: '#FAFAF8',
              color: '#55575E',
              fontSize: 17,
              fontWeight: 700,
            }}
          >
            €
          </span>
          <input
            id="sel-budget"
            inputMode="numeric"
            required
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, '').slice(0, 7))}
            aria-label={c.budgetAria}
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              height: '100%',
              border: 0,
              padding: '0 14px',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#0E0F12',
              outline: 'none',
              fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
          <small style={{ display: 'flex', alignItems: 'center', paddingRight: 14, flexShrink: 0, color: '#A7A9AF', fontSize: 12, fontWeight: 600 }}>{c.currency}</small>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 7, color: '#A7A9AF', fontSize: 12 }}>
          <span>{c.budgetHelp}</span>
          <span style={{ fontWeight: 700, color: '#55575E' }}>{budget ? '€' + Number(budget).toLocaleString('en-US') : '€0'}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
          {c.budgetPresets.map((v) => {
            const on = budget === String(v)
            return (
              <button
                key={v}
                type="button"
                onClick={() => setBudget(String(v))}
                className="lp-fhover"
                style={{
                  padding: '7px 11px',
                  border: '1px solid #E7E5E1',
                  borderRadius: 999,
                  background: on ? '#F0F4FF' : '#FAFAF8',
                  color: on ? 'var(--accent)' : '#55575E',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                €{v.toLocaleString('en-US')}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label htmlFor="sel-target" style={LABEL}>
          {c.target}
        </label>
        <input
          id="sel-target"
          type="text"
          required
          value={target}
          maxLength={300}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={c.targetPlaceholder}
          style={INPUT}
        />
      </div>

      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1 }} />

      <button
        type="submit"
        disabled={sending}
        className="lp-fhover"
        style={{
          width: '100%',
          height: 48,
          marginTop: 22,
          border: 0,
          borderRadius: 11,
          background: sending ? '#55575E' : '#0E0F12',
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: 700,
          cursor: sending ? 'default' : 'pointer',
          boxShadow: '0 10px 22px rgba(17,18,23,0.13)',
          fontFamily: 'inherit',
        }}
      >
        {sending ? c.sending : c.submit}
      </button>
      {status === 'error' && <p style={{ margin: '10px 0 0', fontSize: 13, color: '#DC2626', textAlign: 'center' }}>{c.error}</p>}
      <p style={{ margin: '10px 0 0', textAlign: 'center', color: '#A7A9AF', fontSize: 12.5 }}>{c.footnote}</p>
    </form>
  )
}
