import { Link } from 'react-router-dom'
import { NavAnchor } from '@/components/lp/LpNav'
import { ArrowLeft, ArrowRightLong } from '@/components/lp/fluidIcons'

/** Sticky frosted header of the case-study pages (logo, "All stories", "Book a call"). */
export function CaseStudyHeader() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px clamp(20px, 5vw, 56px)',
        background: 'rgba(252,252,251,0.82)',
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
        borderBottom: '1px solid rgba(232,230,226,0.9)',
      }}
    >
      <Link style={{ display: 'inline-flex', alignItems: 'center' }} to="/">
        <img src="/lp/naano-logo-nav.png" alt="naano" style={{ height: 28, display: 'block' }} />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <NavAnchor
          href="/#what-people-think"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#55575E', fontSize: 14.5, fontWeight: 600, padding: '10px 4px', textDecoration: 'none' }}
        >
          <ArrowLeft />
          All stories
        </NavAnchor>
        <Link
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            whiteSpace: 'nowrap',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 600,
            background: '#17181C',
            borderRadius: 999,
            padding: '11px 20px',
            textDecoration: 'none',
          }}
          to="/book"
        >
          Book a call
          <ArrowRightLong />
        </Link>
      </div>
    </header>
  )
}
