# Hosting the dashboard on Netlify

The bot itself (`index.js`) must run somewhere that stays online 24/7 —
Render, a VM, your own machine (see `RENDER.md` / `DEPLOYMENT.md`). Netlify
only hosts static files, so it can't run the bot — but it **can** host the
pairing page and dashboard (`Frontend/`) permanently, even while your bot
service is asleep or restarting, as long as it can reach your bot's API.

## 1. Deploy
This project includes `netlify.toml` (publishes the `Frontend/` folder).

**Drag-and-drop (fastest):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `Frontend` folder onto the page
3. Netlify gives you a URL like `https://random-name-123.netlify.app`

**From Git (auto-redeploys on push):**
1. Push this project to GitHub (see `RENDER.md` step 1)
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Pick the repo — Netlify reads `netlify.toml` and publishes `Frontend/` automatically

## 2. Pick a nicer URL
Free Netlify sites get a random subdomain by default. To choose your own:
**Site settings → Domain management → Options → Edit site name**. Try:
- `feed-xmd.netlify.app`
- `feedxmd-bot.netlify.app`
- `feedxmd-dashboard.netlify.app`

(Whichever of these is still free — Netlify will tell you immediately.)
A custom domain you own can also be attached here for free.

## 3. Point it at your bot
Since Netlify only serves the static files, the page needs to know where
your actual bot (on Render, a VM, etc.) lives. Open your deployed Netlify
site once with `?api=` in the URL:
```
https://feed-xmd.netlify.app/?api=https://your-service.onrender.com
```
This is saved in your browser (localStorage) — every visit after that
works without the `?api=` parameter. You can also just type the URL into
the "Bot server" box that appears automatically on the page.

## 4. CORS
Your bot's dashboard server already allows cross-origin requests by
default (`DASHBOARD_ORIGIN=*` in `.env`). If you want to restrict it to
only your Netlify domain, set:
```
DASHBOARD_ORIGIN=https://feed-xmd.netlify.app
```

That's it — `index.html` (pairing) and `dashboard.html` (full dashboard)
both work the same way, whether opened from your bot's own server or from
Netlify.
