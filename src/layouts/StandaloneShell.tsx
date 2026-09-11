import { useEffect, type ReactNode } from 'react'
import { useDocumentMeta } from './LpLayout'

/**
 * Minimal shell for pages that ship their own header and no site footer on
 * naano.com (/book, /case-studies/*, /briefs): grain overlay + document meta +
 * root background. The page supplies its own `.naano-lp` (or Jakarta) root.
 */
export function StandaloneShell({
  title,
  description,
  background,
  children,
}: {
  title: string
  description?: string
  background: string
  children: ReactNode
}) {
  useDocumentMeta(title, description)
  useEffect(() => {
    document.documentElement.style.background = background
    return () => {
      document.documentElement.style.background = ''
    }
  }, [background])
  return (
    <>
      <div className="bg-noise" />
      {children}
    </>
  )
}
