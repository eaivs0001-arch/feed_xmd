# Deploy on Render — error-proof version

Three real errors people hit deploying this (all avoidable — see below):
`npm error ENOENT ... package.json` (repo folder nested wrong), `bash: Npm: command not found`
(phone auto-capitalized "npm" while typing), and picking **Static Site** instead of **Web Service**
(a Static Site can't run a Node bot at all — it only serves files, like Netlify).

The steps below avoid all three by using a **Blueprint deploy**, which reads `render.yaml`
and fills in every field itself — you never type a build/start command by hand.

## Step 1 — Get the code onto GitHub (terminal)
Unzip the project first. **Push what's *inside* the folder, not the folder itself** —
`package.json` must sit at the repo root, or Render can't find it (this is the #1 cause of
the `ENOENT package.json` error).

```bash
cd FEED-XMD        # the folder that directly contains package.json
git init
git add .
git commit -m "FEED XMD"
git branch -M main
git remote add origin https://github.com/<you>/feed-xmd.git
git push -u origin main
```
No computer/terminal handy? On GitHub's mobile site, create the repo, then **Add file → Upload
files**, and select the *files inside* `FEED-XMD` (index.js, package.json, scr/, Frontend/, etc.) —
not the `FEED-XMD` folder as a single item. If GitHub's uploader nests everything under a
`FEED-XMD/` folder in the repo, that's the same error waiting to happen — fix it by moving those
files to the repo root in GitHub's web editor, or redo the upload from inside the folder.

**Check before moving on:** open your repo on GitHub — you should see `package.json`,
`index.js`, `render.yaml` etc. listed directly at the top level, *not* inside another folder.

## Step 2 — Deploy (dashboard, ~1 minute of clicking)
1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint** (not "Web Service")
2. Connect the repo. Render finds `render.yaml` and shows a service named `feed-xmd-bot`
   with the build/start commands **already filled in** — don't retype them.
3. Click through, then open the service → **Environment** tab → **Add from .env** → paste
   the attached `.env` file → fill in whichever keys you have (all optional; `OWNER_NUMBER`
   is the one worth setting).
4. Save → Render redeploys automatically. Wait for "Live", open the URL, scan the QR.

**If you already created a plain "Web Service" by hand and it's a Static Site or has the
wrong commands:** delete it and start over with Blueprint above — a Static Site can't be
converted, and it's faster to redo it than to fix each field.

## Build vs. start — these are two different fields, use both
- **Build Command:** `npm install --omit=dev --no-audit --no-fund` — installs dependencies
- **Start Command:** `npm start` — runs the bot
They're not alternatives; Blueprint sets both for you from `render.yaml`, so with Step 2 you
don't need to type either.

## Why this avoids the errors in your screenshots
- **`ENOENT package.json`** → fixed by Step 1's folder check (package.json at repo root)
- **`Npm: command not found` (status 127)** → Blueprint never makes you type the command,
  so a phone's auto-capitalize can't turn `npm` into `Npm`
- **Static Site instead of Web Service** → Blueprint always creates the right type from
  `render.yaml`, which declares `type: web`

## One thing to know
Render's **free** plan wipes the disk on every restart/redeploy — your WhatsApp session
resets and you re-pair. Add a paid Render Disk mounted at `/data` and set
`FEED_XMD_DATA_DIR=/data` if you want the session to persist. Self-pinging (built in,
via `/ping` every 10 minutes) keeps the service awake either way — no UptimeRobot needed.

---
Full command list: `COMMANDS.md`. Other hosts: `DEPLOYMENT.md`. Separate dashboard hosting: `NETLIFY.md`.
