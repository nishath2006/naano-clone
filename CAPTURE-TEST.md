# CAPTURE-TEST

Verification that automatic prompt/response capture is installed and working, per
section 4 of the 8x assignment brief.

## 1. Tool and model

- **Tool:** Claude Code (Anthropic CLI), running inside the Claude desktop app on
  Windows 11.
- **Model:** `claude-fable-5-1` (Claude Fable 5.1). A single model both plans and
  executes; there is no separate planner/executor split in this setup.
- **Automatic mechanism available:** yes. Claude Code exposes lifecycle hooks in
  `.claude/settings.json`. The `UserPromptSubmit` event fires on every prompt and the
  `Stop` event fires at the end of every turn, passing the transcript path on stdin.

## 2. Mechanism and config

- **Config file changed:** `.claude/settings.json`, which wires both `UserPromptSubmit`
  and `Stop` to `node .claude/hooks/capture.js`.
- **Hook script:** `.claude/hooks/capture.js`.
  - On `UserPromptSubmit` it appends the verbatim prompt with a UTC timestamp.
  - On `Stop` it reads the session JSONL transcript and appends only the final text
    of the turn. Thinking, tool calls, tool output and intermediate text are excluded.
    It then rewrites only the frontmatter counters (`total_exchanges`,
    `last_prompt_time`, `model`).
  - If a prompt hook was ever missed, the `Stop` handler recovers the prompt from the
    transcript and labels the entry `recovered from transcript at Stop`.
- **Hook state:** `.claude/hooks/state/` (gitignored, holds per-session cursors).
- **Logs:** `.agent-logs/`, one file per session, named
  `YYYY-MM-DD_HH-MM-SS_<session-id>.md`. This directory is committed, not ignored.

The hook fires on its own. Nothing is run manually.

## 3. Log files the canaries landed in

| Canary | Session | Log file |
|---|---|---|
| 1 | `39c93aea` (the session that installed the hook) | `.agent-logs/2026-09-11_14-59-10_39c93aea-a2ba-4670-82f1-26c5a1e59180.md` |
| 2 | `910c7320` (a fresh session, hook loaded from committed settings) | `.agent-logs/2026-09-11_15-15-59_910c7320-8202-4299-87b0-741d2b6fc937.md` |

Canary 2 is the important one. It proves the hook runs from the committed
`.claude/settings.json` in a brand new session, not only in the session that created it.

## 4. Canary entries, pasted raw

### Canary 1 (session `39c93aea`, entries 2 of that log)

```
[LOG_ENTRY type=PROMPT num=2 session=39c93aea]
timestamp: 2026-09-11T15:10:03.368Z
model: claude-fable-5-1

CAPTURE TEST — 8x assignment, Nishath


[LOG_ENTRY type=RESPONSE num=2 session=39c93aea]
timestamp: 2026-09-11T15:10:40.500Z
model: claude-fable-5-1

Canary 1 passed. Both the prompt and the response are being captured by the hooks in this session, and the log is committed as `676c800`.

**What landed** in `.agent-logs/2026-09-11_14-59-10_39c93aea-a2ba-4670-82f1-26c5a1e59180.md`:

- Prompt 1 is your full setup brief, pulled from the transcript by the Stop hook because the prompt hook didn't exist yet when you sent it. It is labeled "recovered from transcript at Stop".
- Response 1 is my previous reply, verbatim, with no tool calls or intermediate text.
- Prompt 2 is your canary, captured live by the prompt hook.
- Response 2 is this message. It will be appended by the Stop hook the moment this turn ends.

One quirk to note in the test report: the file name carries the time of the first hook write, not the time of your first prompt, because the log was created at the end of turn 1. The frontmatter has the correct first prompt time.

**Next, step 3 of the brief.** Close this session, open a new Claude Code session in this same folder, and send `CAPTURE TEST — 8x assignment, Nishath` there. That proves the hook works from the committed settings file rather than only in the session that created it. Then tell me "second canary sent" in either session. I will verify the second log file, write `CAPTURE-TEST.md` with both raw entries and the failed attempts, commit it, and the build can begin.
```

### Canary 2 (session `910c7320`, entries 1 of that log)

```
[LOG_ENTRY type=PROMPT num=1 session=910c7320]
timestamp: 2026-09-11T15:15:59.228Z
model: claude-fable-5-1 (assumed, not yet reported this session)

CAPTURE TEST — 8x assignment, Nishath


[LOG_ENTRY type=RESPONSE num=1 session=910c7320]
timestamp: 2026-09-11T15:16:26.068Z
model: claude-fable-5-1

Canary 2 passed. The prompt hook fired in this fresh session from the committed settings file, not just in the session that created it.

**What landed** in `.agent-logs/2026-09-11_15-15-59_910c7320-8202-4299-87b0-741d2b6fc937.md`:

- A new log file was created for this session with correct frontmatter. The author, project, and first prompt time are all filled in.
- Prompt 1 is your canary, captured live at 15:15:59Z.
- The model field reads "assumed, not yet reported this session" because the prompt hook runs before any assistant turn exists in the transcript. The Stop hook should replace it with the real model ID when this turn ends. That is worth one line in the test report.
- Response 1 will be this message, appended by the Stop hook when the turn closes.

The earlier session's log also has an uncommitted change. That is its own response 2 being appended by its Stop hook after the last commit, which is expected.

Both sessions are now proven end to end. When you send your next message, I will confirm that the Stop hook appended this response and fixed the model field, then write `CAPTURE-TEST.md` with both raw entries and the failed attempts, and commit it along with both log files. I am holding off on the commit for one turn so the log includes this response rather than a partial capture.
```

## 5. What was tried first that did not work, and known quirks

- **Heredoc through Bash failed on quoting.** The first attempt to write
  `capture.js` via a shell heredoc broke on backticks and `$` inside the script.
  Switched to writing the file directly with the editor tool.
- **Frontmatter was duplicated every turn.** The first version of the Stop handler
  prepended a fresh frontmatter block on each run instead of replacing the existing
  one. Fixed by parsing and rewriting only the counters.
- **The very first prompt was not captured live.** The prompt hook did not exist yet
  when the setup brief was sent, so the Stop hook recovered it from the transcript. That
  entry is labeled `recovered from transcript at Stop` rather than being edited to look
  live.
- **Log file name vs. first prompt time.** In session 1 the file name carries
  `14-59-10`, the time of the first hook write, while the frontmatter
  `first_prompt_time` is `14:53:13Z`. The file was created at the end of turn 1 because
  the prompt hook was not installed at prompt time. In session 2, where the hook was
  present from the start, the file name and first prompt time match.
- **Model field on the first prompt of a fresh session.** The `UserPromptSubmit` hook
  runs before any assistant message exists in the transcript, so the first prompt entry
  in a new session is labeled `claude-fable-5-1 (assumed, not yet reported this
  session)`. The Stop hook confirms the real model on the response entry and in the
  frontmatter. The prompt entry is left as written, since entries are never edited after
  the fact.
- **Mid-session hook install.** Claude Code snapshots hooks at session start, so
  there was a risk the hook would not fire in the session that created it. It did fire
  in practice (canary 1), but canary 2 in a fresh session is the real proof.
