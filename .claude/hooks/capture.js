#!/usr/bin/env node
/*
 * Agent capture hook for Claude Code.
 *
 * Wired to two lifecycle events in .claude/settings.json:
 *   - UserPromptSubmit : receives { session_id, transcript_path, prompt, ... } on stdin.
 *                        Appends a PROMPT entry (verbatim) to the session log.
 *   - Stop             : receives { session_id, transcript_path, ... } on stdin.
 *                        Reads the JSONL transcript, extracts ONLY the final text of the
 *                        last assistant turn (no thinking, no tool calls, no intermediate
 *                        text) and appends a RESPONSE entry.
 *
 * One file per session in .agent-logs/: YYYY-MM-DD_HH-MM-SS_<session-id>.md
 * Frontmatter (total_exchanges, last_prompt_time, model) is regenerated on every write.
 * Entries are append-only and never modified.
 *
 * The script never exits non-zero: a logging failure must never block the session.
 * Failures are written to .claude/hooks/state/errors.log.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const LOG_DIR = path.join(PROJECT_DIR, '.agent-logs');
const STATE_DIR = path.join(PROJECT_DIR, '.claude', 'hooks', 'state');
const AUTHOR = 'nishath2006';
const TOOL = 'claude-code';
const PROJECT = 'naano-clone';

// ---------- helpers ----------
function log(msg) {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.appendFileSync(path.join(STATE_DIR, 'errors.log'), `${new Date().toISOString()} ${msg}\n`);
  } catch (_) { /* ignore */ }
}

function readStdinJson() {
  let raw = '';
  try { raw = fs.readFileSync(0, 'utf8'); } catch (e) { log('stdin read failed: ' + e.message); }
  try { return JSON.parse(raw); } catch (e) { log('stdin was not JSON: ' + raw.slice(0, 500)); return null; }
}

function fileStamp(iso) {
  // 2026-09-11T14:53:02.118Z -> 2026-09-11_14-53-02
  return iso.slice(0, 10) + '_' + iso.slice(11, 19).replace(/:/g, '-');
}

function readTranscript(p) {
  if (!p || !fs.existsSync(p)) return [];
  const out = [];
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch (_) { /* skip partial line */ }
  }
  return out.filter(e => !e.isSidechain);
}

function textOfContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter(b => b && b.type === 'text' && typeof b.text === 'string')
    .map(b => b.text)
    .join('\n\n');
}

function isRealUserPrompt(e) {
  if (!e || e.type !== 'user' || !e.message) return false;
  if (e.isMeta) return false;
  const c = e.message.content;
  if (typeof c === 'string') return c.trim().length > 0;
  if (!Array.isArray(c)) return false;
  if (c.some(b => b && b.type === 'tool_result')) return false;
  return c.some(b => b && b.type === 'text');
}

function lastAssistantModel(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    if (e.type === 'assistant' && e.message && e.message.model) return e.message.model;
  }
  return null;
}

/** Text of the final assistant turn: every assistant text block emitted after the last
 *  user entry (a tool_result counts as a user entry, so intermediate text is excluded). */
function finalResponse(entries) {
  const collected = [];
  let ts = null, model = null;
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    if (e.type === 'user') break;
    if (e.type !== 'assistant' || !e.message) continue;
    if (!ts) ts = e.timestamp || null;
    if (!model && e.message.model) model = e.message.model;
    const t = textOfContent(e.message.content);
    if (t) collected.unshift(t);
  }
  return { text: collected.join('\n\n'), timestamp: ts, model };
}

function lastUserPrompt(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (isRealUserPrompt(entries[i])) {
      const e = entries[i];
      let text = textOfContent(e.message.content);
      // Drop harness-injected system reminders; they are not the user's words.
      text = text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim();
      return { text, timestamp: e.timestamp || null };
    }
  }
  return null;
}

function readUserSettingsModel() {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude', 'settings.json'), 'utf8'));
    return typeof s.model === 'string' ? s.model : null;
  } catch (_) { return null; }
}

function readGlobalLastModel() {
  try { return fs.readFileSync(path.join(STATE_DIR, 'last-model'), 'utf8').trim() || null; } catch (_) { return null; }
}
function writeGlobalLastModel(m) {
  try { fs.mkdirSync(STATE_DIR, { recursive: true }); fs.writeFileSync(path.join(STATE_DIR, 'last-model'), m); } catch (_) { /* ignore */ }
}

// ---------- per-session state ----------
function statePath(sessionId) { return path.join(STATE_DIR, `${sessionId}.json`); }
function loadState(sessionId) {
  try { return JSON.parse(fs.readFileSync(statePath(sessionId), 'utf8')); } catch (_) { return null; }
}
function saveState(st) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(statePath(st.session_id), JSON.stringify(st, null, 2));
}
function findExistingLog(sessionId) {
  try {
    const hit = fs.readdirSync(LOG_DIR).find(f => f.endsWith(`_${sessionId}.md`));
    return hit ? path.join(LOG_DIR, hit) : null;
  } catch (_) { return null; }
}
function countPromptsInFile(file) {
  // Fallback only, used if state was lost. Anchored to line start to avoid matching
  // LOG_ENTRY-looking text quoted inside a prompt body.
  let max = 0;
  const re = /^\[LOG_ENTRY type=PROMPT num=(\d+) session=[^\]]+\]$/gm;
  const src = fs.readFileSync(file, 'utf8');
  let m; while ((m = re.exec(src))) max = Math.max(max, parseInt(m[1], 10));
  return max;
}
function newState(sessionId, now) {
  const existing = findExistingLog(sessionId);
  return {
    session_id: sessionId,
    file: existing || path.join(LOG_DIR, `${fileStamp(now)}_${sessionId}.md`),
    model: null,
    total_exchanges: existing ? countPromptsInFile(existing) : 0,
    first_prompt_time: now,
    last_prompt_time: now,
    last_prompt_text: null,
    awaiting_response: false,
  };
}

// ---------- file writing ----------
function frontmatter(st) {
  return [
    '---',
    `session_id: ${st.session_id}`,
    `date: ${st.first_prompt_time.slice(0, 10)}`,
    `author: ${AUTHOR}`,
    `model: ${st.model || 'unknown'}`,
    `tool: ${TOOL}`,
    `project: ${PROJECT}`,
    `total_exchanges: ${st.total_exchanges}`,
    `first_prompt_time: ${st.first_prompt_time}`,
    `last_prompt_time: ${st.last_prompt_time}`,
    '---',
    '',
    '',
  ].join('\n');
}

function heading(st) {
  return [
    `# Session Log - ${st.first_prompt_time.slice(0, 10)}`,
    '',
    `Session: \`${st.session_id.slice(0, 8)}\` | Project: \`${PROJECT}\` | Author: \`${AUTHOR}\``,
    '',
    '---',
    '',
    '',
  ].join('\n');
}

function entry(type, num, st, timestamp, model, body) {
  return [
    `[LOG_ENTRY type=${type} num=${num} session=${st.session_id.slice(0, 8)}]`,
    `timestamp: ${timestamp}`,
    `model: ${model}`,
    '',
    body,
    '',
    '',
    '',
  ].join('\n');
}

/** Rewrite frontmatter (session metadata only) and append a new entry. Existing entries untouched. */
function writeLog(st, entryText) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  if (!fs.existsSync(st.file)) {
    fs.writeFileSync(st.file, frontmatter(st) + heading(st) + entryText);
    return;
  }
  let src = fs.readFileSync(st.file, 'utf8');
  const m = src.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n\r?\n/);
  if (m) src = frontmatter(st) + src.slice(m[0].length);
  else src = frontmatter(st) + src; // should not happen; never drop content
  fs.writeFileSync(st.file, src + entryText);
}

// ---------- handlers ----------
function handlePrompt(input) {
  const sessionId = input.session_id;
  const now = new Date().toISOString();
  const entries = readTranscript(input.transcript_path);

  let model = lastAssistantModel(entries);
  if (!model) {
    const guess = process.env.ANTHROPIC_MODEL || readUserSettingsModel() || readGlobalLastModel();
    model = guess ? `${guess} (assumed, not yet reported this session)` : 'unknown (not yet reported this session)';
  }

  let st = loadState(sessionId) || newState(sessionId, now);
  st.total_exchanges += 1;
  st.last_prompt_time = now;
  st.last_prompt_text = input.prompt;
  st.awaiting_response = true;
  if (!st.model) st.model = model;

  writeLog(st, entry('PROMPT', st.total_exchanges, st, now, model, input.prompt));
  saveState(st);
}

function handleStop(input) {
  const sessionId = input.session_id;
  const entries = readTranscript(input.transcript_path);
  const resp = finalResponse(entries);
  const now = new Date().toISOString();
  const model = resp.model || lastAssistantModel(entries) || 'unknown';
  const ts = resp.timestamp || now;

  let st = loadState(sessionId) || newState(sessionId, now);

  let out = '';
  // Recovery: if the PROMPT for this turn was never captured (e.g. UserPromptSubmit did not
  // fire), pull it verbatim from the transcript so the pair stays complete.
  if (!st.awaiting_response) {
    const p = lastUserPrompt(entries);
    if (p && p.text) {
      st.total_exchanges += 1;
      st.last_prompt_time = p.timestamp || now;
      if (st.total_exchanges === 1) st.first_prompt_time = st.last_prompt_time;
      st.last_prompt_text = p.text;
      out += entry('PROMPT', st.total_exchanges, st, st.last_prompt_time, model + ' (recovered from transcript at Stop)', p.text);
    }
  }
  if (st.total_exchanges === 0) st.total_exchanges = 1; // response with no known prompt at all

  // Real model name is now known; use it in the header if it was only assumed before.
  if (!st.model || / \(assumed|^unknown/.test(st.model)) st.model = model;
  st.awaiting_response = false;

  out += entry('RESPONSE', st.total_exchanges, st, ts, model, resp.text || '(no final text in transcript)');
  writeLog(st, out);
  saveState(st);
  if (model && model !== 'unknown') writeGlobalLastModel(model);
}

// ---------- main ----------
(function main() {
  try {
    const input = readStdinJson();
    if (!input || !input.session_id) { log('no session_id in input'); return; }
    const ev = input.hook_event_name;
    if (ev === 'UserPromptSubmit') handlePrompt(input);
    else if (ev === 'Stop') handleStop(input);
    else log('unhandled event: ' + ev);
  } catch (e) {
    log('capture failed: ' + (e && e.stack || e));
  } finally {
    process.exit(0);
  }
})();
