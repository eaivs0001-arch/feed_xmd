# FEED XMD v7.1.0 — Unified Build

![FEED XMD](./Assets/feed-xmd-showcase.png)

FEED XMD is a WhatsApp automation bot built around Baileys, with hundreds of commands, group moderation, media utilities, games, productivity, an economy system, scheduling, persistent JSON storage, four AI providers, a **visual web dashboard**, and a live **Telegram admin log** of every login, new user, and command.

This build merges FEED XMD's bot-only engine with its AI-expanded command set and its pairing dashboard into one project — see `CHANGELOG.md` for exactly what was merged, and what was fixed.

## Included
- A web **dashboard** at `/dashboard.html` (status, command browser, features, API-key guide, deploy notes) and a real web pairing page at `http://localhost:3000/` (or your deployed URL) — scan a QR or type your number for a pairing code, no terminal access needed. Both can be hosted separately on Netlify — see `NETLIFY.md`
- **Telegram admin log**: every bot login, every new WhatsApp user, and every command run is sent to your own Telegram chat. Check status with `.tglogs`
- One environment file: `.env` (every value ships blank — see `RENDER.md` to deploy)
- Persistent data directory via `FEED_XMD_DATA_DIR`
- Branded FEED XMD media assets in `Assets/`
- Four AI providers: **Gemini 2.5 Flash-Lite** (`.ask`/`.brain`), **Groq** (`.groq` llama-3.3-70b, `.groqfast` llama-3.1-8b — 14,400 free requests/day), **Pollinations** (`.polli`/`.pimage`/`.pvoice`/`.pimodels` — works with **no key**), and **Hugging Face** (`.hfimage`, `.hfchat` — needs a free token)
- Weather (`.weather`, `.forecast` — both keyless), a keyless dictionary with phonetics and synonyms (`.define`), keyless crypto prices, GitHub lookup, country info (`.country`), Pokémon (`.pokemon`), arXiv search, Hacker News, and real Open Trivia DB questions (`.trivia`)
- Real photos on `.wallpaper` with a free `UNSPLASH_API_KEY`, or a free AI-generated image if you don't set one
- 150+ jokes, 200+ quotes, 200+ facts — all local, no API key, no network dependency
- Media conversion using Sharp, QR generation/decoding, calculator/unit conversion with mathjs
- DNS/domain inspection, random/choice/dice/coin utilities, text analysis (sort/dedupe/palindrome/anagram)
- Group moderation and automation, polls, reminders, scheduler, todo, and a full economy system
- A protected `/api/dashboard/*` JSON API (bearer token) alongside the public pairing page

## Docs
- `COMMANDS.md` — every command
- `RENDER.md` — step-by-step Render deployment (recommended for most people)
- `NETLIFY.md` — hosting the dashboard separately, permanently, for free
- `DEPLOYMENT.md` — all hosting options compared (VM, Render, your own device)
- `CHANGELOG.md` — what changed

## Start locally
```bash
npm install
# edit .env and fill in whichever keys you have — all optional
npm start
```

## Render (recommended)
See `RENDER.md` for the full walkthrough. Short version: push to GitHub,
create a Render Web Service pointing at the repo (or use the included
`render.yaml` as a Blueprint), paste `.env`'s contents into Render's
Environment tab, deploy, then open the service URL to pair.

## Railway
Set `FEED_XMD_DATA_DIR=/app/data` and mount a Railway Volume at `/app/data`.
Put the values from `.env` into Railway Variables. Do not commit `.env`.

## A note on `.env`
`.env` ships with every value **blank**. Fill in your real keys only in your
host's environment-variable settings (Render's "Add from .env" paste, Railway
Variables), not in a file you commit. `.gitignore` already excludes `.env` from
git, so a `git add .` won't accidentally include your real keys.

## Important
Do not run `npm audit fix --force` blindly. Review dependency advisories first because forced upgrades can break Baileys/media packages.
