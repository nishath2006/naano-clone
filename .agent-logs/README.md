# Agent logs

Raw prompt/response captures written automatically by `.claude/hooks/capture.js`,
wired to Claude Code's `UserPromptSubmit` and `Stop` hooks in `.claude/settings.json`.
One file per session. Entries are append-only and are never edited after the fact.
