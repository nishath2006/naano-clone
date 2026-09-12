import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { BrandWordmark } from '@/components/shared/BrandWordmark'

/**
 * The 3D "Marketplace card" preview shown on /register?role=influencer
 * (recon/html/app/register.dom.html). Front = profile, back = "Performance & ICP".
 *
 * - Hovering the card tilts it (rotateX/rotateY on the `.group/tilt` wrapper,
 *   transform-origin 50% 72%) and moves the glare via `--card-glare-x/-y`.
 * - The hover-revealed "More details" pill flips the card (rotateY 180deg on
 *   the inner grid, 320ms cubic-bezier(0.4,0,0.2,1)).
 *
 * The overlay gradients (grain / glare / sheen / conic edge / corner
 * highlights) were only described in the capture, not dumped — their exact
 * stops are UNKNOWN and approximated here with the captured opacities.
 */

const JAKARTA = "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif"
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const MAX_TILT = 9 // degrees — UNKNOWN exact amplitude

type Side = 'profile' | 'performance'

function CardHeader() {
  return (
    <div className="relative aspect-[4/1] bg-[linear-gradient(135deg,#E4F1ED_0%,#E6EEFC_52%,#EEE9FC_100%)] px-5 py-4 sm:px-7 sm:py-5">
      <div
        className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.25),transparent_28%),radial-gradient(circle_at_88%_86%,rgba(137,174,255,0.42),transparent_36%),linear-gradient(135deg,#0C3EBE_0%,#1959EF_57%,#6691FF_100%)]"
        aria-hidden="true"
      >
        <span className="absolute -right-16 -top-20 h-32 w-32 rounded-full border border-white/15 shadow-[0_0_0_20px_rgba(255,255,255,0.045),0_0_0_40px_rgba(255,255,255,0.025)]" />
        <span className="absolute -bottom-12 -left-12 h-20 w-20 rounded-full border border-white/15 shadow-[0_0_0_16px_rgba(255,255,255,0.035)]" />
        <BrandWordmark inverted height={28} className="relative z-10 mb-3 sm:mb-3.5" />
      </div>
      <span
        aria-label="Open my LinkedIn profile"
        className="inline-flex h-11 w-11 rounded-[15px] items-center justify-center border border-white/75 bg-white/88 text-[#0A66C2] shadow-[0_6px_18px_rgba(15,23,42,0.10)] backdrop-blur-md absolute left-5 top-4 z-20 sm:left-7 sm:top-5 cursor-default opacity-90"
      >
        <span aria-hidden="true" className="inline-flex h-7 w-7 rounded-[8px] items-center justify-center bg-[#0A66C2] text-white shadow-[0_4px_10px_rgba(10,102,194,0.24)]">
          <svg viewBox="0 0 24 24" className="h-[58%] w-[58%] fill-current">
            <path d="M5.16 3.55a2.36 2.36 0 1 1-4.72 0 2.36 2.36 0 0 1 4.72 0ZM.73 7.36h4.14V20.7H.73V7.36Zm6.73 0h3.97v1.82h.06c.55-1.05 1.91-2.15 3.92-2.15 4.2 0 4.97 2.76 4.97 6.35v7.32h-4.13v-6.5c0-1.54-.03-3.53-2.15-3.53-2.16 0-2.49 1.68-2.49 3.42v6.61H7.46V7.36Z" />
          </svg>
        </span>
      </span>
      <div className="absolute bottom-0 left-1/2 z-30 -translate-x-1/2 translate-y-1/2">
        <div className="group/avatar relative rounded-full shadow-[0_10px_24px_rgba(124,92,252,0.20)] ring-[3px] ring-[#7C5CFC]">
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              border: 'none',
              flexShrink: 0,
              background: 'var(--v3-bg-hover, #F7F6F3)',
              color: 'var(--v3-text-secondary, #787774)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            Y
          </div>
        </div>
      </div>
    </div>
  )
}

/** grain / glare / sheen / conic edge / corner highlights (see file comment). */
function CardOverlays() {
  return (
    <>
      {/* grain */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[24] rounded-[inherit] bg-[length:170px_170px] opacity-[0.14] mix-blend-soft-light"
        style={{ backgroundImage: NOISE }}
      />
      {/* glare follows the cursor via --card-glare-x/y */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[25] rounded-[inherit] opacity-0 mix-blend-screen transition-opacity duration-200 group-hover/tilt:opacity-[0.32] group-focus-within/tilt:opacity-[0.32] group-data-[flipping=true]/tilt:!opacity-0 group-data-[flipping=true]/tilt:transition-none motion-reduce:transition-none"
        style={{
          background:
            'radial-gradient(circle 180px at var(--card-glare-x) var(--card-glare-y), rgba(255,255,255,0.48) 0%, rgba(213,232,255,0.16) 28%, rgba(168,173,255,0.05) 48%, transparent 70%)',
        }}
      />
      {/* sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[20%] z-[25] opacity-0 mix-blend-soft-light transition-opacity duration-200 group-hover/tilt:opacity-[0.38] group-focus-within/tilt:opacity-[0.38] group-data-[flipping=true]/tilt:!opacity-0 group-data-[flipping=true]/tilt:transition-none motion-reduce:transition-none"
        style={{
          background:
            'linear-gradient(112deg, transparent 24%, rgba(255,255,255,0.03) 34%, rgba(255,255,255,0.52) 47%, rgba(179,199,255,0.16) 52%, transparent 65%)',
          transform: 'translate3d(var(--card-sheen-x), 0, 0) rotate(-2deg)',
        }}
      />
      {/* conic edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[26] rounded-[inherit] p-px"
        style={{
          background:
            'conic-gradient(from 215deg, rgba(255,255,255,0.96), rgba(132,174,255,var(--card-edge-opacity)), rgba(219,177,255,0.24), rgba(146,227,222,0.20), rgba(255,255,255,0.96))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {/* corner highlights */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[23] rounded-[inherit] opacity-[0.34] mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 0 0, rgba(255,255,255,0.9), transparent 12%),radial-gradient(circle at 100% 0, rgba(186,210,255,0.46), transparent 14%),radial-gradient(circle at 0 100%, rgba(195,237,231,0.34), transparent 15%),radial-gradient(circle at 100% 100%, rgba(217,194,255,0.38), transparent 15%)',
        }}
      />
    </>
  )
}

function FlipPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="absolute bottom-9 left-1/2 z-40 flex h-[43px] min-w-[168px] -translate-x-1/2 translate-y-1/2 items-center justify-between gap-3 rounded-full border border-[#B2C6F1] bg-white/95 pl-4 pr-1.5 px-3.5 text-[13px] font-semibold text-[#24324A] opacity-0 shadow-[0_10px_24px_rgba(124,92,252,0.16)] backdrop-blur-md transition-opacity duration-300 group-hover/physical-card:opacity-100 focus-visible:opacity-100 cursor-pointer"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7C5CFC] text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </button>
  )
}

const CARD_SHELL =
  'relative overflow-hidden rounded-[34px] border border-[#E4E5E7] bg-white/90 shadow-[0_20px_55px_rgba(15,23,42,0.10),0_2px_8px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 group-hover/card:border-[#9FB9F7] group-hover/card:shadow-[0_30px_72px_rgba(37,62,117,0.18),0_8px_22px_rgba(49,91,194,0.09),inset_0_1px_0_rgba(255,255,255,1)] sm:rounded-[42px]'

function FrontFace({ onFlip }: { onFlip: () => void }) {
  return (
    <section
      aria-label="Preview of Your name's Marketplace card"
      className="group/card col-start-1 row-start-1 min-w-0 w-full self-start cursor-pointer pb-9 relative pointer-events-auto"
      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
      onClick={onFlip}
    >
      <div className={CARD_SHELL}>
        <CardHeader />
        <div className="px-5 pb-0 pt-[54px] text-center sm:px-8 sm:pt-[58px]">
          <div className="flex min-w-0 justify-center px-8">
            <div className="relative min-w-0 max-w-full">
              <h2 className="truncate text-[24px] font-bold leading-tight tracking-[-0.035em] text-[#111827] sm:text-[28px]">Your name</h2>
            </div>
          </div>
          <p
            className="mx-auto mt-5 min-h-[48px] max-w-[390px] text-[14px] leading-6 text-[#5F6673] sm:text-[15px]"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            Your LinkedIn headline and topics will appear here.
          </p>
          <div className="mx-auto mt-4 flex max-w-[360px] items-center gap-3 pb-5 text-left">
            <span className="shrink-0 text-xs font-medium text-[#8A909B]">Data</span>
            <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#E8EBF1]" role="progressbar" aria-valuenow={0}>
              <span className="block h-full rounded-full bg-[linear-gradient(90deg,#7C5CFC,#7C8DF6)]" style={{ width: '0%' }} />
            </span>
            <span className="shrink-0 text-xs font-semibold text-[#6B7280]">Pending</span>
          </div>
        </div>
        <dl className="grid grid-cols-3 border-t border-[#E7E8EB] bg-[#FCFCFD]">
          <div className="flex min-w-0 flex-col items-center justify-center px-2 py-5 text-center sm:px-4 sm:py-6 ">
            <dt className="order-2 mt-1 text-[11px] leading-4 text-[#8A909B] sm:text-xs">Followers</dt>
            <dd className="order-1 w-full truncate text-[20px] font-bold tracking-[-0.025em] text-[#111827] sm:text-[24px]">—</dd>
          </div>
          <div className="flex min-w-0 flex-col items-center justify-center px-2 py-5 text-center sm:px-4 sm:py-6 border-x border-[#E7E8EB]">
            <dt className="order-2 mt-1 text-[11px] leading-4 text-[#8A909B] sm:text-xs">Est. impressions</dt>
            <dd className="order-1 w-full truncate text-[20px] font-bold tracking-[-0.025em] text-[#111827] sm:text-[24px]">—</dd>
          </div>
          <div className="flex min-w-0 flex-col items-center justify-center px-2 py-5 text-center sm:px-4 sm:py-6">
            <dt className="order-2 mt-1 text-[11px] leading-4 text-[#8A909B] sm:text-xs">Cost / post</dt>
            <dd className="order-1 min-w-0">
              <span className="block truncate text-[20px] font-bold tracking-[-0.025em] text-[#111827] sm:text-[24px]">—</span>
            </dd>
          </div>
        </dl>
        <CardOverlays />
      </div>
      <FlipPill label="More details" onClick={onFlip} />
    </section>
  )
}

/* Back-face tile icons: UNKNOWN on the live site — lucide users / heart / eye / message-circle. */
function TileIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5267D9]">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </span>
  )
}

const BACK_TILES: { label: string; icon: ReactNode }[] = [
  {
    label: 'Followers',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
  },
  {
    label: 'Reactions per post (Average)',
    icon: <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />,
  },
  {
    label: 'Typical impressions per post',
    icon: (
      <>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    label: 'Comments per post (Average)',
    icon: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  },
]

function BackFace({ onFlip }: { onFlip: () => void }) {
  return (
    <section
      aria-label="Performance & ICP"
      className="group/card col-start-1 row-start-1 min-w-0 w-full self-start cursor-pointer pb-9 relative pointer-events-auto"
      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
      onClick={onFlip}
    >
      <div className={CARD_SHELL}>
        <CardHeader />
        <div className="px-5 pb-6 pt-[54px] text-center sm:px-7 sm:pt-[58px]">
          <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#111827] sm:text-[24px]">Performance &amp; ICP</h2>
          <p className="mt-1 text-xs text-[#737B89]">Public LinkedIn profile data from Apify (Basic card).</p>
          <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {BACK_TILES.map((tile) => (
              <div key={tile.label} className="flex min-h-[96px] min-w-0 flex-col items-center justify-center rounded-[18px] border border-[#E4E8F1] bg-white px-2 py-4 text-center">
                <TileIcon>{tile.icon}</TileIcon>
                <dd className="order-2 text-[20px] font-bold tracking-[-0.025em] text-[#111827]">—</dd>
                <dt className="order-3 mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#7A8290]">{tile.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <CardOverlays />
      </div>
      <FlipPill label="Back to profile" onClick={onFlip} />
    </section>
  )
}

export function MarketplaceCard() {
  const [side, setSide] = useState<Side>('profile')
  const tiltRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current
    const tilt = tiltRef.current
    if (!wrap || !tilt) return
    const r = wrap.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    const ry = ((px - 0.5) * 2 * MAX_TILT).toFixed(2)
    const rx = ((0.5 - py) * 2 * MAX_TILT).toFixed(2)
    tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    wrap.style.setProperty('--card-glare-x', `${(px * 100).toFixed(1)}%`)
    wrap.style.setProperty('--card-glare-y', `${(py * 100).toFixed(1)}%`)
  }, [])

  const onLeave = useCallback(() => {
    const wrap = wrapRef.current
    const tilt = tiltRef.current
    if (!wrap || !tilt) return
    tilt.style.transform = 'rotateX(0deg) rotateY(0deg)'
    wrap.style.setProperty('--card-glare-x', '50%')
    wrap.style.setProperty('--card-glare-y', '50%')
  }, [])

  const flip = () => setSide((s) => (s === 'profile' ? 'performance' : 'profile'))

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="group/physical-card relative isolate w-full max-w-[500px] [perspective:1600px]"
        data-card-side={side}
        style={{ fontFamily: JAKARTA }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span aria-hidden="true" className="pointer-events-none absolute bottom-10 left-1 z-0 h-14 w-[42%] -rotate-[8deg] rounded-[50%] bg-[rgba(109,78,245,0.14)] opacity-70 blur-[24px]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-10 right-1 z-0 h-14 w-[42%] rotate-[8deg] rounded-[50%] bg-[rgba(109,78,245,0.14)] opacity-70 blur-[24px]" />
        <div
          ref={tiltRef}
          className="group/tilt relative z-10 [transform-style:preserve-3d] transition-transform duration-200 ease-out"
          style={{ transform: 'rotateX(0deg) rotateY(0deg)', transformOrigin: '50% 72%' }}
        >
          <div
            className="relative grid min-w-0 w-full items-start transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transformStyle: 'preserve-3d', transform: `translateZ(0) rotateY(${side === 'profile' ? 0 : 180}deg)` }}
          >
            <FrontFace onFlip={flip} />
            <BackFace onFlip={flip} />
          </div>
        </div>
      </div>
    </div>
  )
}
