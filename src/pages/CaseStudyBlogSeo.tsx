import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { StandaloneShell } from '@/layouts/StandaloneShell'
import { CaseStudyHeader } from '@/components/case-study/CaseStudyHeader'
import { CaseVideoCard } from '@/components/case-study/CaseVideoCard'
import { BODY, CaseChapter, LEAD, Strong } from '@/components/case-study/CaseChapter'
import { AccentCheck, ArrowRightLong, ArrowRightShort, LinkedInFilled, LinkedInSquare } from '@/components/lp/fluidIcons'
import { useRevealOnScroll } from '@/hooks/useReveal'
import { useCountUp } from '@/hooks/useCountUp'

// The FR capture of this page is byte-identical to the EN one.
const POST_URL =
  'https://www.linkedin.com/posts/god-sfavour-joseph-sanyaolu-33494b227_i-fired-my-seo-agency-an-ai-agent-now-runs-share-7462843037375909888-GdjJ/'
const VIDEO_URL = 'https://api.naano.xyz/storage/v1/object/public/marketing-assets/case-studies/blogseo-vincent-josse.mp4'

const METRICS = [
  { value: '150%', label: 'Return on ad spend (ROAS)' },
  { value: '1,500+', label: 'Qualified leads surfaced for outreach' },
  { value: 'Hundreds', label: 'Of sign-ups generated' },
  { value: '~20', label: 'Creator posts published' },
  { value: '15', label: 'Creators activated' },
  { value: '€5,000', label: 'Campaign budget' },
]

const WHY = [
  'Relevant creator matching instead of one expensive bet on a single influencer',
  'Multiple posts and angles instead of relying on one piece of content',
  'Centralized tracking across the entire campaign',
  'Qualified lead extraction directly into a dashboard',
  'Clear visibility into what actually drove commercial outcomes',
]

const SECTION_PAD = 'clamp(20px, 5vw, 56px)'

/**
 * /case-studies/blogseo — fluid landing-style case study. Sticky frosted
 * header, count-up metrics (`data-cu`), scroll reveals (`data-reveal`) and a
 * click-to-play testimonial video. No LP nav and no footer on naano.com.
 */
export default function CaseStudyBlogSeo() {
  const ref = useRef<HTMLElement>(null)
  useRevealOnScroll(ref)
  useCountUp(ref)

  return (
    <StandaloneShell
      title="How BlogSEO turned creator marketing into a measurable acquisition channel — Naano case study"
      description="After one €2,000 sponsored post returned just three sign-ups, BlogSEO rebuilt creator marketing on Naano: 150% ROAS, 1,500+ qualified leads and hundreds of sign-ups from one LinkedIn creator campaign."
      background="#FCFCFB"
    >
      <main
        ref={ref}
        className="naano-lp"
        data-lp-fluid=""
        style={{ background: '#FCFCFB', color: '#17181C', WebkitFontSmoothing: 'antialiased', fontFamily: 'var(--font-inter), -apple-system, sans-serif' }}
      >
        <CaseStudyHeader />

        {/* Hero */}
        <section style={{ maxWidth: 1160, margin: '0 auto', padding: `clamp(40px, 8vw, 72px) ${SECTION_PAD} 40px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 72, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: 'var(--accent)' }}>CASE STUDY</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9CBD1' }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9B9DA3' }}>LINKEDIN CREATOR CAMPAIGN</span>
              </div>
              <img src="/lp/logo-blogseo.png" alt="BlogSEO" style={{ height: 34, display: 'block', marginTop: 26 }} />
              <h1
                style={{
                  margin: '26px 0 0 0',
                  fontSize: 52,
                  lineHeight: 1.06,
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  color: '#0E0F12',
                  textWrap: 'balance',
                  maxWidth: 640,
                }}
              >
                How BlogSEO turned creator marketing into a measurable acquisition channel
              </h1>
              <p style={{ margin: '24px 0 0 0', fontSize: 19, lineHeight: 1.55, color: '#55575E', maxWidth: 560 }}>
                After one €2,000 sponsored post returned just three sign-ups, BlogSEO rebuilt creator marketing on Naano, and turned it into
                predictable, trackable pipeline.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 34, flexWrap: 'wrap', rowGap: 14 }}>
                <a
                  href={POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-fluid-cta=""
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    whiteSpace: 'nowrap',
                    background: '#17181C',
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 600,
                    padding: '16px 28px',
                    borderRadius: 12,
                    textDecoration: 'none',
                  }}
                >
                  <LinkedInFilled />
                  View a campaign post
                </a>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: '#9B9DA3' }}>B2B SaaS · SEO</span>
              </div>
            </div>
            <CaseVideoCard src={VIDEO_URL} name="Vincent Josse" role="CEO & Founder, BlogSEO" ariaLabel="Play the BlogSEO case study video" />
          </div>
        </section>

        {/* Metrics */}
        <section data-reveal-kids="" style={{ maxWidth: 1160, margin: '28px auto 0', padding: `0 ${SECTION_PAD}` }}>
          <div
            className="rv"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E7E5E1',
              borderRadius: 20,
              padding: 'clamp(28px, 5vw, 44px) clamp(20px, 4vw, 40px)',
              boxShadow: '0 1px 3px rgba(17,18,28,0.04)',
            }}
          >
            <div data-case-metrics="" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 24px' }}>
              {METRICS.map((m) => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div data-cu="" style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.035em', color: '#0E0F12', lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 500, color: '#55575E', marginTop: 12 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 01 The challenge */}
        <CaseChapter index="01" title="The challenge">
          <p style={LEAD}>
            Before Naano, BlogSEO had already tested influencer marketing. They paid <Strong>€2,000 for a single sponsored post</Strong> and
            generated only three sign-ups.
          </p>
          <p style={{ margin: '22px 0 0 0', ...BODY }}>
            The conclusion was simple: creator marketing looked expensive, difficult to track, and impossible to scale with confidence.
          </p>
          <p style={{ margin: '18px 0 0 0', ...BODY }}>
            They didn&apos;t need more reach. They needed a predictable way to find relevant creators, activate them at scale, and turn
            engagement into pipeline.
          </p>
          <div
            data-case-compare=""
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 0,
              marginTop: 34,
              border: '1px solid #EDEBE7',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#FFFFFF',
            }}
          >
            <div style={{ flex: 1, padding: '22px 24px' }}>
              <div style={{ fontSize: 13, color: '#9B9DA3', fontWeight: 600 }}>Old approach</div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#17181C', marginTop: 8 }}>€2,000</div>
              <div style={{ fontSize: 14, color: '#8B8D94', marginTop: 4 }}>one sponsored post</div>
            </div>
            <div style={{ width: 1, background: '#EDEBE7' }} />
            <div style={{ flex: 1, padding: '22px 24px' }}>
              <div style={{ fontSize: 13, color: '#9B9DA3', fontWeight: 600 }}>Result</div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#DC2626', marginTop: 8 }}>3 sign-ups</div>
              <div style={{ fontSize: 14, color: '#8B8D94', marginTop: 4 }}>no way to trace or repeat it</div>
            </div>
          </div>
        </CaseChapter>

        {/* 02 The campaign */}
        <CaseChapter index="02" title="The campaign">
          <p style={LEAD}>
            BlogSEO launched a LinkedIn creator campaign with Naano, matched with <Strong>~10 relevant creators</Strong> and a{' '}
            <Strong>€5,000 budget</Strong>.
          </p>
          <p style={{ margin: '22px 0 0 0', ...BODY }}>
            Over the campaign, creators published around 15 posts designed to reach BlogSEO&apos;s target audience and generate qualified
            demand. Every post was tracked through Naano, so the team could see which creators and which content generated real commercial
            intent.
          </p>
          <a
            href={POST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-chip"
            style={{
              display: 'block',
              marginTop: 32,
              border: '1px solid #EDEBE7',
              borderRadius: 16,
              background: '#FFFFFF',
              padding: '20px 22px',
              boxShadow: '0 1px 2px rgba(17,18,28,0.03)',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: '#EDEBE7',
                  backgroundImage: 'url("/lp/avatar-joseph.webp")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#17181C' }}>Creator campaign post</span>
                  <LinkedInSquare />
                </div>
                <div style={{ fontSize: 13, color: '#8B8D94', marginTop: 1 }}>Tracked in Naano · LinkedIn</div>
              </div>
            </div>
            <p style={{ margin: '14px 0 0 0', fontSize: 15.5, lineHeight: 1.5, color: '#26272C', fontWeight: 500 }}>
              &quot;I fired my SEO agency. An AI agent now runs it.&quot;, one of the creator posts that drove qualified demand for BlogSEO.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 14.5, fontWeight: 600, color: 'var(--accent)' }}>
              View one of the posts
              <ArrowRightShort size={15} />
            </div>
          </a>
        </CaseChapter>

        {/* 03 The results */}
        <CaseChapter index="03" title="The results">
          <p style={LEAD}>
            For BlogSEO, the value wasn&apos;t just visibility. The campaign created a structured list of people who had engaged,{' '}
            <Strong>1,500+ qualified leads</Strong> surfaced in the dashboard, ready to reactivate through outbound.
          </p>
          <p style={{ margin: '22px 0 0 0', ...BODY }}>
            Instead of treating creator marketing as an awareness play, the team could connect creator content to leads, conversations, and
            revenue, landing at <Strong weight={600}>150% ROAS</Strong>.
          </p>
        </CaseChapter>

        {/* 04 Why it worked */}
        <CaseChapter
          index="04"
          title="Why it worked"
          aside={
            <p style={{ margin: '16px 0 0 0', fontSize: 16, lineHeight: 1.55, color: '#8B8D94' }}>
              The difference wasn&apos;t spending more on creators. Naano made the campaign operational.
            </p>
          }
          contentStyle={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {WHY.map((w) => (
            <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 15, padding: '20px 0', borderTop: '1px solid #ECEAE6' }}>
              <span
                style={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'rgba(37,99,235,0.1)',
                  marginTop: 1,
                }}
              >
                <AccentCheck size={14} />
              </span>
              <span style={{ fontSize: 18, lineHeight: 1.5, fontWeight: 500, color: '#26272C' }}>{w}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #ECEAE6' }} />
        </CaseChapter>

        {/* Quote */}
        <section data-reveal-kids="" style={{ maxWidth: 1000, margin: '110px auto 0', padding: `0 ${SECTION_PAD}`, textAlign: 'center' }}>
          <div className="rv rv-d0" style={{ width: 46, height: 2, background: 'var(--accent)', borderRadius: 2, margin: '0 auto' }} />
          <blockquote
            className="rv rv-d1"
            style={{ margin: '40px 0 0 0', fontSize: 40, lineHeight: 1.3, fontWeight: 500, letterSpacing: '-0.02em', color: '#17181C', textWrap: 'balance' }}
          >
            &quot;We had tried influencer marketing before and spent €2,000 on one post for three sign-ups. With Naano, we saw{' '}
            <span style={{ color: 'var(--accent)' }}>150% ROAS</span> and generated more than 1,500 leads we could follow up with.&quot;
          </blockquote>
          <div className="rv rv-d2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 44 }}>
            <span
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#6B72E8',
                backgroundImage: 'url("/lp/avatar-g.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#17181C' }}>Vincent Josse</div>
              <div style={{ fontSize: 14, color: '#8B8D94', marginTop: 2 }}>CEO &amp; Founder, BlogSEO</div>
            </div>
          </div>
        </section>

        {/* Dark CTA */}
        <section style={{ maxWidth: 1160, margin: '110px auto 0', padding: `0 ${SECTION_PAD} clamp(72px, 12vw, 120px)` }}>
          <div
            data-case-cta=""
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#101113',
              borderRadius: 24,
              padding: 'clamp(44px, 8vw, 72px) clamp(24px, 5vw, 64px)',
              textAlign: 'center',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: '#7FA0F0' }}>BUILD YOUR LINKEDIN CREATOR CAMPAIGN</div>
              <h2
                style={{
                  margin: '22px auto 0',
                  maxWidth: 660,
                  fontSize: 46,
                  lineHeight: 1.08,
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  color: '#FFFFFF',
                  textWrap: 'balance',
                }}
              >
                Turn creator engagement into pipeline.
              </h2>
              <p style={{ margin: '22px auto 0', maxWidth: 520, fontSize: 18, lineHeight: 1.55, color: '#AEB0B6' }}>
                Run a campaign with creators your buyers already trust, track the results, and turn engagement into revenue.
              </p>
              <Link
                data-fluid-cta=""
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 11,
                  marginTop: 38,
                  background: '#FFFFFF',
                  color: '#101113',
                  fontSize: 16.5,
                  fontWeight: 600,
                  padding: '17px 30px',
                  borderRadius: 12,
                  textDecoration: 'none',
                }}
                to="/book"
              >
                Launch your campaign with Naano
                <ArrowRightLong size={17} />
              </Link>
            </div>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -70,
                textAlign: 'center',
                fontSize: 240,
                lineHeight: 0.78,
                fontWeight: 800,
                letterSpacing: '-0.05em',
                color: 'rgba(255,255,255,0.04)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              naano
            </div>
          </div>
        </section>
      </main>
    </StandaloneShell>
  )
}
