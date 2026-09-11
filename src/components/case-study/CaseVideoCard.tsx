import { useRef, useState } from 'react'
import { PlayAccent } from '@/components/lp/fluidIcons'

/**
 * 4:5 video card with the Naano-logo cover and pulsing play button. The cover
 * is a real <button>; clicking it starts the video with native controls.
 */
export function CaseVideoCard({
  src,
  name,
  role,
  ariaLabel,
}: {
  src: string
  name: string
  role: string
  ariaLabel: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const play = () => {
    const v = videoRef.current
    if (!v) return
    setPlaying(true)
    v.controls = true
    void v.play().catch(() => {})
  }

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#0E0F12',
        aspectRatio: '4 / 5',
        boxShadow: '0 24px 60px -22px rgba(23,24,28,0.4)',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {!playing && (
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={play}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 0, border: 0, background: '#0E0F12', cursor: 'pointer' }}
        >
          <img
            src="/lp/naano-logo-footer.png"
            alt="Naano"
            style={{ position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%, -50%)', width: '52%', height: 'auto' }}
          />
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '58%',
              transform: 'translate(-50%, -50%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 66,
              height: 66,
              background: '#FFFFFF',
              borderRadius: '50%',
              animation: 'naanoPulse 2.6s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          >
            <PlayAccent />
          </span>
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: '22px 20px 18px',
              background: 'linear-gradient(to top, rgba(11,12,15,0.82), rgba(11,12,15,0))',
              textAlign: 'left',
              pointerEvents: 'none',
            }}
          >
            <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{name}</span>
            <span style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.82)', marginTop: 2 }}>{role}</span>
          </span>
        </button>
      )}
    </div>
  )
}
