import type { ResultPost } from '@/data/home'
import { useLocale } from '@/lib/locale'
import { ArrowUpRight, Cursor, Eye, People } from './icons'

const METRIC_LABELS = {
  en: { impressions: 'Impressions', clicks: 'Clicks', leads: 'Leads', for: 'For', view: 'View post' },
  fr: { impressions: 'Impressions', clicks: 'Clics', leads: 'Leads', for: 'Pour', view: 'Voir le post' },
}

/** Sponsored-post result card used in the "results" grids on / and /creators. */
export function PostResultCard({ post }: { post: ResultPost }) {
  const { locale } = useLocale()
  const l = METRIC_LABELS[locale]
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EDEBE7', borderRadius: 18, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 22px 0 22px' }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#EDEBE7',
            backgroundImage: `url("${post.avatar}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 15.5, fontWeight: 700, color: '#17181C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {post.name}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#8B8D94', marginTop: 1 }}>{post.meta[locale]}</div>
        </div>
      </div>
      <p
        style={{
          margin: '16px 22px 0 22px',
          fontSize: 16.5,
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          color: '#17181C',
          minHeight: 92,
        }}
      >
        {post.title[locale]}
      </p>
      <div style={{ margin: '16px 22px 18px 22px', height: 200, borderRadius: 14, overflow: 'hidden', position: 'relative', background: '#F2F1ED' }}>
        <img
          src={post.image}
          alt={post.imageAlt}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: post.imagePosition, display: 'block' }}
        />
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div className="lp-post-metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '6px 22px 2px 22px' }}>
          <Metric icon={<Eye />} value={post.impressions} label={l.impressions} />
          <Metric icon={<Cursor />} value={post.clicks} label={l.clicks} />
          <Metric icon={<People />} value={post.leads} label={l.leads} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          borderTop: '1px solid #F1EFEB',
          marginTop: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flexShrink: 1, overflow: 'hidden' }}>
          <span style={{ fontSize: 13.5, color: '#9B9DA3', flexShrink: 0 }}>{l.for}</span>
          <img src={post.brandLogo} alt={post.brandAlt} style={{ height: post.brandLogoHeight, width: 'auto', display: 'block', marginLeft: 2 }} />
        </div>
        <a
          href={post.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
            color: 'var(--accent)',
            fontSize: 13.5,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {l.view}
          <ArrowUpRight />
        </a>
      </div>
    </div>
  )
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {icon}
        <span style={{ fontSize: 16.5, fontWeight: 700, color: '#17181C' }}>{value}</span>
      </div>
      <span style={{ fontSize: 12.5, color: '#9B9DA3', paddingLeft: 23 }}>{label}</span>
    </div>
  )
}
