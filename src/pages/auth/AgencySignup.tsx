import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppShell } from '@/components/auth/AuthShell'

/**
 * /agency ("Agency portfolio | Naano") and /talent-agency ("Talent agency | Naano").
 * One CSS module on the live site (class prefix renamed to `tas-`, see
 * src/styles/talent-agency.css). Markup from recon/html/app/agency.dom.html.
 * Steps 2–3 of the onboarding were not captured (UNKNOWN).
 */

export type AgencyVariant = 'brand' | 'talent'

function Lucide({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const ICONS = {
  'building-2': (
    <>
      <path d="M10 12h4" />
      <path d="M10 8h4" />
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    </>
  ),
  landmark: (
    <>
      <path d="M10 18v-7" />
      <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />
      <path d="M14 18v-7" />
      <path d="M18 18v-7" />
      <path d="M3 22h18" />
      <path d="M6 18v-7" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
} as const

type IconName = keyof typeof ICONS

const VARIANTS: Record<
  AgencyVariant,
  {
    path: string
    title: string
    eyebrow: string
    heading: string
    intro: string
    bullets: { icon: IconName; text: string }[]
    stepIntro: string
  }
> = {
  brand: {
    path: '/agency',
    title: 'Agency portfolio | Naano',
    eyebrow: 'Brand agency workspace',
    heading: 'Run every client campaign from one portfolio.',
    intro: 'Create client workspaces, assign their budgets and monitor delivery without mixing accounts.',
    bullets: [
      { icon: 'building-2', text: 'One workspace per client company' },
      { icon: 'landmark', text: 'Budgets allocated from one dashboard' },
      { icon: 'check', text: 'One operational queue across campaigns' },
    ],
    stepIntro: 'Use the login of the person who will manage client workspaces.',
  },
  talent: {
    path: '/talent-agency',
    title: 'Talent agency | Naano',
    eyebrow: 'Talent agency workspace',
    heading: 'Run every creator operation from one place.',
    intro: 'Import your roster, manage collaborations and collect agency earnings without creating accounts for your creators.',
    bullets: [
      { icon: 'users', text: 'Import all your creators in minutes' },
      { icon: 'shield-check', text: 'Creators never need to log in' },
      { icon: 'check', text: 'One task list for the whole agency' },
    ],
    stepIntro: 'This login belongs to the agency manager, not to a creator.',
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AgencySignup({ variant }: { variant: AgencyVariant }) {
  const v = VARIANTS[variant]
  useAppShell(v.title)

  const [step, setStep] = useState<1 | 2>(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // UNKNOWN validation copy — the live form relies on native `required`/`minlength`.
    if (!firstName.trim() || !lastName.trim()) return setError('Please enter your first and last name.')
    if (!EMAIL_RE.test(email.trim())) return setError('Please enter a valid work email.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    setError(null)
    setStep(2)
  }

  return (
    <>
      <div className="bg-noise" />
      <main className="tas-page">
        <section className="tas-shell">
          <aside className="tas-intro">
            <Link className="tas-logo" aria-label="Naano" to="/">
              Naano
            </Link>
            <div>
              <span className="tas-eyebrow">{v.eyebrow}</span>
              <h1>{v.heading}</h1>
              <p>{v.intro}</p>
            </div>
            <ul>
              {v.bullets.map((b) => (
                <li key={b.text}>
                  <Lucide size={18}>{ICONS[b.icon]}</Lucide>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          </aside>
          <div className="tas-formPanel">
            <div className="tas-progress" aria-label="Onboarding progress">
              <span className={step === 1 ? 'tas-current' : 'tas-done'} />
              <span className={step === 2 ? 'tas-current' : ''} />
              <span />
            </div>
            {step === 1 ? (
              <form className="tas-form" onSubmit={onSubmit} noValidate>
                <div>
                  <span className="tas-step">Step 1 of 3</span>
                  <h2>Create your agency account</h2>
                  <p>{v.stepIntro}</p>
                </div>
                <div className="tas-twoColumns">
                  <label>
                    <span>First name</span>
                    <input required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </label>
                  <label>
                    <span>Last name</span>
                    <input required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </label>
                </div>
                <label>
                  <span>Work email</span>
                  <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    required
                    minLength={8}
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <small>At least 8 characters</small>
                </label>
                {error && (
                  <p className="tas-error" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit">
                  <Lucide size={17}>{ICONS['arrow-right']}</Lucide>
                  Continue
                </button>
                <p className="tas-login">
                  Already have an account? <Link to={`/login?redirectTo=${v.path}`}>Log in</Link>
                </p>
              </form>
            ) : (
              /* Step 2 of 3 — UNKNOWN on the live site (requires an account); neutral placeholder. */
              <div className="tas-form">
                <div>
                  <span className="tas-step">Step 2 of 3</span>
                  <h2>Almost there</h2>
                  <p>The rest of the onboarding happens inside the Naano app and requires an account.</p>
                </div>
                <p className="tas-status">This preview stops here — the remaining steps were not captured.</p>
                <div className="tas-codeActions">
                  <button type="button" onClick={() => setStep(1)}>
                    Back to step 1
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
