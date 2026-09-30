# Changelog

## 7.1.2 — Deploy hardening after real Render errors

Fixed after seeing three actual failed Render deploys:
`npm error ENOENT ... package.json`, `bash: Npm: command not found` (status 127),
and a service accidentally created as a Static Site instead of a Web Service.

### Added
- `"engines": { "node": ">=18.18.0" }` in `package.json`, so Render (or any host)
  picks a compatible Node version instead of whatever its current default is.
- `RENDER.md` rewritten around a **Blueprint deploy** (New → Blueprint, not a
  manual Web Service): Render reads `render.yaml` and fills in the build/start
  commands itself, so there's nothing to mistype — which is exactly how
  `npm install` became `Npm install` (phone keyboard auto-capitalize) in one
  of the failed deploys. Also documents the repo-root/package.json check that
  fixes the `ENOENT` error, and how to tell Static Site and Web Service apart.

### Removed
- **`.env.example`** (per request). Note for anyone reading this later: Node's
  `dotenv` never reads `.env.example` automatically — only a file literally
  named `.env` is loaded — so this file was never a functional risk, just a
  second copy to keep in sync. `.env` alone (already shipping with every
  value blank) is now the only template.

### Changed
- Removed a stale warning in the dashboard's Deploy tab that said the shipped
  `.env` "looks like real credentials" — untrue since 7.1.0, when `.env` was
  rewritten to ship blank. Replaced with an accurate "never commit `.env`" note.

## 7.1.1 — Self-ping keep-awake

### Added
- **Self-pinging**: the bot now hits its own `/ping` endpoint every 10
  minutes via `node-cron`, using Render's auto-injected `RENDER_EXTERNAL_URL`
  (or a manual `SELF_PING_URL` on other hosts). Keeps a free Render service
  awake without an external uptime service. No-ops safely if neither env
  var is set (e.g. local runs).
- New lightweight `GET /ping` route (plain-text `pong`) alongside the
  existing JSON `/api/health`.
- `RENDER.md` rewritten to a short, numbered walkthrough with an explicit
  "why this won't error" checklist.

## 7.1.0 — More providers, real Telegram logging, keyless upgrades

### Added
- **Groq** (`.groq` — llama-3.3-70b-versatile, `.groqfast` — llama-3.1-8b-instant). Free tier: 14,400 requests/day.
- **Hugging Face chat** (`.hfchat`, Qwen2.5-7B-Instruct) alongside the existing `.hfimage`.
- **Telegram admin log**: every bot login, every first-seen WhatsApp user, and
  every command run (who, where) is streamed to your own Telegram chat,
  batched to respect rate limits. Check status or send a test line with
  `.tglogs` (owner only). Fully optional — everything no-ops with no
  `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` set.
- **New keyless commands**: `.country` (REST Countries), `.pokemon` (PokeAPI),
  `.arxiv` (arXiv search), `.hackernews`/`.hn` (HN Algolia).
- **Real `.trivia`/.quiz`**: replaced the single hardcoded "capital of
  Nigeria" question with live Open Trivia DB questions.
- **`.define` enhanced**: now shows phonetics and synonyms, not just a bare definition.
- **Netlify-ready frontend**: `Frontend/config.js` lets `index.html` and
  `dashboard.html` be hosted anywhere (e.g. Netlify) and still reach your
  bot's API — see `NETLIFY.md`. A "Bot server URL" field appears
  automatically when the page isn't served by the bot itself.
- `RENDER.md` — a full step-by-step Render deployment guide.
- Gemini upgraded to `gemini-2.5-flash-lite` (highest free-tier RPM), with
  automatic fallback to `gemini-2.5-flash` on rate limits.

### Fixed
- **`.wallpaper` was broken** — it used `source.unsplash.com`, which Unsplash
  shut down in 2025. Now uses the real Unsplash Search API
  (`UNSPLASH_API_KEY`) with a free AI-generated-image fallback when no key
  is set, so the command always works either way.

### Changed
- `.env` now ships as a real, ready-to-use template with every value blank
  (previously it shipped with values that looked like live credentials).
  `.env.example` is kept identical to `.env` for reference.

## 7.0.1 — Dashboard + critical fixes

### Added
- **Web dashboard** (`/dashboard.html`): live connection status, protected live
  stats (paste `DASHBOARD_TOKEN`), a searchable browser for every command with
  status badges, a features overview, the API-key guide, and free-hosting notes.
- Public read-only `/api/commands` (names, descriptions, working/disabled/
  placeholder status, which key a command needs).
- `deploy/oracle-setup.sh` for Oracle Cloud Always Free (or any Ubuntu VM),
  `DASHBOARD_HOST` to keep the dashboard private, `DEPLOYMENT.md` rewritten.

### Fixed
- **`core/mega.js` never exported its handlers** (its only `module.exports` sat
  inside a commented-out line), so every command backed by it silently failed.
  It now exports `{ handlers, disabledNames }`. The loader also stops treating
  `mega.js` as a command file.
- **Regression from 7.0.0:** `ai/_pollinations.js` had been deleted, which broke
  `.aiimg .blackbox .gemini .gpt .imagine .llama`. Restored.
- `render.yaml` used a paid `worker` type; now a free `web` service.

### Honest command count
555 registered: ~406 working, 108 intentionally disabled (destructive
session/remote names), 41 placeholders with no real behaviour yet.

## 7.0.0 — Unified build

This version merges everything from the FEED XMD project into one build. Five
uploaded archives were audited and turned out to collapse into two real
lineages:

- **Bot-only engine** (`FEED-XMD-v6.3-BOT-ONLY-PERFECTED`, `FEED-XMD-1.0.0-OPEN-AI-EXPANDED`)
  — the 400+ command engine, JSON database, economy/games/moderation system.
  Used as the base for this build since it was the most complete.
- **Atlas-derived rebrand** (`Atlas-MD-main`, `FEED-XMD`, `FEED-XMD-updated`)
  — an unrelated WhatsApp bot framework (different plugin architecture,
  Mongoose-based) that had been rebranded to FEED XMD and given a polished
  QR/pairing web dashboard. That framework is **not** used as the engine here
  (two different bot frameworks can't run as one process), but its dashboard
  design, its branding image work, and its showcase artwork were ported over.

### Added
- **Visual web pairing dashboard** — `/` now serves a real QR-code-or-pairing-code
  page instead of requiring terminal access. Wired `index.js` connection state
  into `scr/lib/dashboard/server.js` via new `/api/status`, `/api/qr`, and
  `/api/pair` routes.
- **Pollinations AI** (`.polli`, `.pimage`, `.pimodels`, `.pvoice`) — free,
  keyless by default; an API key only unlocks the faster authenticated tier.
  This finishes what the dormant, never-wired `ai/_pollinations.js` stub was
  reaching for (removed in favor of the complete version).
- **Hugging Face image generation** (`.hfimage`) — needs a free HF token.
- **Keyless GitHub repo lookup** (`.github`) and a keyless 5-day forecast
  (`.forecast`, via Open-Meteo) alongside the existing keyless `.weather`.
- `render.yaml` for one-click Render deploys.
- `Assets/feed-xmd-showcase.png` banner, referenced from the README.
- `.env.example` — a safe, secret-free template (the real `.env` has values
  that look like live credentials; see the security note in `README.md`).

### Fixed
- `.joke` was completely broken — `fun/jokes.js` referenced an array called
  `jokes` that was never defined (only `additionalJokes` existed). One-line
  fix; the command now returns a random joke from the 150+ local list as
  intended.

### Notes
- `scr/commands/v1/*` and its supporting `lib/utils/{anime,giphy,media,message,permissions}.js`
  from the OPEN-AI-EXPANDED archive were **not** ported: they duplicate
  command names already implemented elsewhere in this build (`hash`, `uuid`,
  `password`, `base64`, `ping`, `help`, etc.) and would have silently
  overridden the existing, equally-good implementations depending on
  directory load order. Nothing of unique value was lost by leaving them out.
