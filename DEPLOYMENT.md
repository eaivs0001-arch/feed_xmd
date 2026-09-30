# Deploying FEED-XMD

The bot must stay running 24/7 and keep its WhatsApp session files
(`$FEED_XMD_DATA_DIR/auth`). That rules out most "free" platforms, which either
sleep when idle or wipe their disk on restart. Free tiers change often; these
notes reflect 2026 roundups, so re-check pricing before you commit.

## 1. Best free option: Oracle Cloud Always Free VM
Real Linux VM, persistent disk, no sleeping. Needs a payment card to sign up,
and free-tier availability varies by region.

1. Create an Always Free VM (Ubuntu). Upload/unzip this project on it.
2. `bash deploy/oracle-setup.sh` (installs Node 20, ffmpeg, PM2, starts the bot)
3. `nano .env` and set at least `OWNER_NUMBER`.
4. From your own computer: `ssh -L 3000:localhost:3000 <user>@<server-ip>`,
   open `http://localhost:3000`, scan the QR or request a pairing code.
   The dashboard stays private (`DASHBOARD_HOST=127.0.0.1`), nothing is exposed.
5. `pm2 logs feed-xmd` to watch it; it restarts automatically after reboots.

## 2. Free and simple: your own device
Old laptop, Raspberry Pi, or Android with Termux:
`npm install && npm start` (after filling in `.env`), then open `http://localhost:3000`.
Only works while the device is on and online.

## 3. Render free web service (testing only)
`render.yaml` is a free *web* service (background workers are not free).
Caveats: it sleeps after ~15 min idle, and its disk is temporary, so the session
is lost on every restart/redeploy and you must re-pair. Pinging `/api/health`
every 5 minutes (e.g. UptimeRobot) keeps it awake, but not the disk.

## Not recommended
Heroku, Fly.io, Railway (trial) and Hugging Face Docker Spaces no longer have a
lasting free tier. Koyeb's free tier needs a card. "Free bot hosting" panels from
unknown providers would hold your WhatsApp session files, which is full access
to your account.

## Security checklist
- The pairing page and `/api/qr`, `/api/pair` have **no login**. Keep them private
  (SSH tunnel / firewall / VPN) or reachable only while pairing.
- `/api/dashboard/*` needs `DASHBOARD_TOKEN` (`Authorization: Bearer <token>`).
- Never commit `.env`. Use a secondary WhatsApp number if you can: this uses the
  unofficial WhatsApp Web protocol and WhatsApp may restrict automated numbers.
