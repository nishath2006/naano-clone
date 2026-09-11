import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavAnchor } from '@/components/lp/LpNav'
import type { Locale } from '@/lib/locale'
import { quizCopy, quizQuestions, quizVerdicts, type PlatformKey, type QuizQuestion } from '@/data/best-platforms'

const PLATFORMS: PlatformKey[] = ['naano', 'favikon', 'kolsquare', 'upfluence', 'traackr', 'skeepers']

type Answers = Partial<Record<QuizQuestion['id'], number>>

function winner(answers: Answers): PlatformKey | null {
  if (!quizQuestions.every((q) => answers[q.id] !== undefined)) return null
  const totals: Record<PlatformKey, number> = { naano: 0, favikon: 0, kolsquare: 0, upfluence: 0, traackr: 0, skeepers: 0 }
  for (const q of quizQuestions) {
    const opt = q.options[answers[q.id] ?? 0]
    for (const [k, v] of Object.entries(opt.scores) as [PlatformKey, number][]) totals[k] += v
  }
  return PLATFORMS.reduce((best, k) => (totals[k] > totals[best] ? k : best))
}

/**
 * "60-second configurator": three single-choice questions, each option adds
 * points to platforms; once all three are answered the top scorer is shown.
 * Ties resolve to the earlier platform in ranking order, as on the live site.
 */
export function PlatformQuiz({ locale }: { locale: Locale }) {
  const [answers, setAnswers] = useState<Answers>({})
  const c = quizCopy[locale]
  const pick = winner(answers)
  const result = pick ? quizVerdicts[pick] : null

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B7280] mb-2 font-semibold">{c.eyebrow}</p>
      <h2 className="text-xl sm:text-2xl font-light tracking-[-0.02em] text-[#111827] mb-6">{c.title}</h2>
      <div className="space-y-6">
        {quizQuestions.map((q) => (
          <fieldset key={q.id}>
            <legend className="text-sm font-medium text-[#111827] mb-2.5">{q.prompt[locale]}</legend>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, i) => {
                const on = answers[q.id] === i
                return (
                  <button
                    key={opt.label.en}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className={`text-left text-sm px-3.5 py-2 rounded-full border transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2 ${
                      on ? 'border-[#111827] bg-[#111827] text-white' : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#9CA3AF]'
                    }`}
                  >
                    {opt.label[locale]}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div aria-live="polite">
        {result && pick && (
          <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B7280] mb-1.5 font-semibold">
              {c.match} · {result.rank[locale]}
            </p>
            <p className="text-lg font-medium text-[#111827] mb-2">{result.name}</p>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-4">{result.verdict[locale]}</p>
            <div className="flex flex-wrap gap-3">
              {pick === 'naano' ? (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827] text-white text-sm font-medium hover:bg-[#1F2937] transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2"
                >
                  {c.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <NavAnchor
                  href={c.compareHref}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E5E7EB] bg-white text-[#111827] text-sm font-medium hover:bg-[#F3F4F6] transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2"
                >
                  {c.compare}
                </NavAnchor>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
