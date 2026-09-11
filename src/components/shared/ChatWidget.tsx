import { useEffect, useRef, useState } from 'react'

const PLACEHOLDERS = ['What would you like to see?', 'What would you like to do?', 'What can I help you find?']

/**
 * Visual recreation of the third-party "Barkan" assistant prompt that floats at
 * the bottom of every page on naano.com (a shadow-DOM widget). The assistant's
 * backend is not public, so the pill accepts input and shows a local reply
 * explaining that the live assistant is unavailable in this clone.
 */
export function ChatWidget() {
  const [phIndex, setPhIndex] = useState(0)
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([])
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (value) return
    const id = window.setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length), 4200)
    return () => window.clearInterval(id)
  }, [value])

  const submit = () => {
    const text = value.trim()
    if (!text) return
    setMessages((m) => [
      ...m,
      { role: 'user', text },
      { role: 'bot', text: 'The live assistant is not part of this front-end clone. Try the navigation above to explore Naano.' },
    ])
    setValue('')
    setOpen(true)
  }

  return (
    <div className="nn-chat" data-collapsed={collapsed ? 'true' : 'false'} data-open={open ? 'true' : 'false'}>
      {open && (
        <aside className="nn-chat__panel" aria-label="Conversation">
          <div className="nn-chat__panel-head">
            <strong>Hi there</strong>
            <span>Ask Naano anything.</span>
            <button type="button" aria-label="Close chat" className="nn-chat__close" onClick={() => setOpen(false)}>
              <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="m6.7 5.64 5.3 5.3 5.3-5.3 1.06 1.06-5.3 5.3 5.3 5.3-1.06 1.06-5.3-5.3-5.3 5.3-1.06-1.06 5.3-5.3-5.3-5.3 1.06-1.06Z" />
              </svg>
            </button>
          </div>
          <ol className="nn-chat__messages">
            {messages.map((m, i) => (
              <li key={i} data-role={m.role}>
                {m.text}
              </li>
            ))}
          </ol>
        </aside>
      )}
      <button
        type="button"
        className="nn-chat__handle"
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Open assistant' : 'Minimize assistant'}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.937 1.25 22.75 6.06293 22.75 12C22.75 17.937 17.937 22.75 12 22.75C10.1437 22.75 8.39536 22.2788 6.87016 21.4493L2.63727 22.2373C2.39422 22.2826 2.14448 22.2051 1.96967 22.0303C1.79485 21.8555 1.71742 21.6058 1.76267 21.3627L2.55076 17.1298C1.72113 15.6046 1.25 13.8563 1.25 12Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.75 6 8.25l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {!collapsed && (
        <form
          className="nn-chat__entry"
          data-input-empty={value ? 'false' : 'true'}
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <button type="button" className="nn-chat__mark" tabIndex={-1} aria-label="Assistant">
            <img src="/lp/naano-logomark.png" alt="" width={22} height={22} />
          </button>
          <div className="nn-chat__body">
            {!value && (
              <span className="nn-chat__placeholder" aria-hidden="true" key={phIndex}>
                {PLACEHOLDERS[phIndex]}
              </span>
            )}
            <label className="sr-only" htmlFor="nn-chat-input">
              Chat message
            </label>
            <textarea
              id="nn-chat-input"
              ref={inputRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit()
                }
              }}
              autoComplete="off"
              enterKeyHint="send"
              aria-label="Type your message"
            />
          </div>
          <button type="submit" className="nn-chat__send" aria-label={value ? 'Send' : 'Voice (optional)'}>
            {value ? (
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
                <path d="M9.5 16.5V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.96094 8.54167L9.5026 3L15.0443 8.54167" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M5 10v4M9 7v10M12 4v16M15 8v8M19 11v2" />
              </svg>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
