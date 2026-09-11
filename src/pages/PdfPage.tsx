import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * /privacy and /terms. naano.com serves these as file downloads
 * (Content-Disposition: attachment): the browser opens a save dialog and the
 * page itself does not change. We trigger the same download client-side and
 * then step back in history (or go home when there is none).
 */
export default function PdfPage({ file }: { file: string }) {
  const navigate = useNavigate()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    const a = document.createElement('a')
    a.href = file
    a.download = file.split('/').pop() ?? 'document.pdf'
    a.rel = 'noopener'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()

    // react-router keeps its history index in history.state.idx
    const state = window.history.state as { idx?: number } | null
    const idx = state?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate('/', { replace: true })
  }, [file, navigate])

  return <div className="bg-noise" />
}
