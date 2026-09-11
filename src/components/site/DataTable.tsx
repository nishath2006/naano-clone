import type { ReactNode } from 'react'

export const TH = 'text-left px-4 py-3 font-medium text-[#111827] text-[11px] uppercase tracking-[0.1em] border-b border-[#E5E7EB]'
export const TD = 'px-4 py-3 text-[#374151] border-b border-[#F3F4F6] align-top'
export const TD_STRONG = 'px-4 py-3 text-[#111827] font-medium border-b border-[#F3F4F6] align-top'
export const TD_MUTED = 'px-4 py-3 text-[#6B7280] border-b border-[#F3F4F6] align-top'
export const TD_GREEN = 'px-4 py-3 text-[#1A7F4B] font-medium border-b border-[#F3F4F6] align-top'
/** Comparison tables: label column / Naano column rendered as the "strong" variant of TD. */
export const TD_LEAD = 'px-4 py-3 text-[#374151] border-b border-[#F3F4F6] align-top font-medium text-[#111827]'

export type Cell = ReactNode | { content: ReactNode; className: string }

function isCellObj(c: Cell): c is { content: ReactNode; className: string } {
  return typeof c === 'object' && c !== null && 'className' in c && 'content' in c
}

/**
 * Bordered data table (rounded wrapper, scrollable on narrow screens).
 * `cellClasses` gives the default class per column; a cell may override it.
 */
export function DataTable({
  head,
  rows,
  cellClasses,
  wrapClassName = 'my-8 overflow-x-auto rounded-xl border border-[#E5E7EB]',
  tableClassName = 'w-full text-sm border-separate border-spacing-0 tabular-nums',
  theadClassName = 'bg-[#F9FAFB]',
  thClassName = TH,
}: {
  head: string[]
  rows: Cell[][]
  cellClasses: string[]
  wrapClassName?: string
  tableClassName?: string
  theadClassName?: string
  thClassName?: string
}) {
  return (
    <div className={wrapClassName}>
      <table className={tableClassName}>
        <thead className={theadClassName || undefined}>
          <tr>
            {head.map((h) => (
              <th key={h} className={thClassName}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                const cls = isCellObj(cell) ? cell.className : (cellClasses[ci] ?? TD)
                const content = isCellObj(cell) ? cell.content : cell
                return (
                  <td key={ci} className={cls}>
                    {content}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
