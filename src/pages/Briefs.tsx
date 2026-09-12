import { Link } from 'react-router-dom'
import { StandaloneShell } from '@/layouts/StandaloneShell'
import { useLocale } from '@/lib/locale'

const LINK = { color: '#7C5CFC', textDecoration: 'none', fontWeight: 600 } as const

// Only the intro paragraph is translated on naano.com; everything else stays
// in English in the FR capture (including the link label).
const intro = {
  en: "B2B brands publish campaign briefs on NaanoX to find vetted LinkedIn creators for flat-fee sponsored posts. Each brief describes the brand's context, tone, content angles and targeting — pick a campaign that fits your audience and apply, or ",
  fr: 'Les marques B2B publient des briefs de campagne sur NaanoX pour trouver des créateurs LinkedIn vérifiés et leur confier des posts sponsorisés au forfait. Chaque brief présente le contexte de la marque, le ton, les angles de contenu et le ciblage : choisissez une campagne adaptée à votre audience et postulez, ou ',
}

/** /briefs — public list of open creator campaigns (empty state at capture time). */
export default function Briefs() {
  const { locale } = useLocale()
  return (
    <StandaloneShell
      title="Open LinkedIn creator campaigns — briefs | NaanoX"
      description="Browse open campaign briefs from B2B brands looking for LinkedIn creators on NaanoX. Flat-fee sponsored posts, full creative control — apply as a creator or launch your own campaign."
      background="#FAFAF9"
    >
      <main
        style={{
          minHeight: '100vh',
          background: '#FAFAF9',
          fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
          color: '#37352F',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 64px' }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: '1px solid #E9E9E7',
            }}
          >
            <Link style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} to="/">
              <img src="/logo.svg" alt="NaanoX" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#7C5CFC', letterSpacing: '-0.02em', lineHeight: 1.05 }}>naanoX</div>
                <div style={{ fontSize: 11.5, color: '#787774', marginTop: 1 }}>Creator-led growth for B2B</div>
              </div>
            </Link>
            <Link to="/register?role=influencer" style={{ fontSize: 12.5, fontWeight: 600, color: '#7C5CFC', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Apply as a creator →
            </Link>
          </header>
          <h1 style={{ margin: 0, fontSize: 27, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25 }}>Open LinkedIn creator campaigns</h1>
          <p style={{ margin: '10px 0 0', fontSize: 14.5, color: '#787774', lineHeight: 1.65, maxWidth: 640 }}>
            {intro[locale]}
            <Link to="/register?role=saas" style={LINK}>
              launch your own creator search
            </Link>
            .
          </p>
          <section style={{ marginTop: 28, background: '#FFFFFF', border: '1px solid #E9E9E7', borderRadius: 16, padding: '28px 26px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#787774', lineHeight: 1.6 }}>
              No open campaigns right now — check back soon, or{' '}
              <Link to="/register?role=influencer" style={LINK}>
                join NaanoX as a creator
              </Link>{' '}
              to get matched as soon as new campaigns open.
            </p>
          </section>
        </div>
      </main>
    </StandaloneShell>
  )
}
