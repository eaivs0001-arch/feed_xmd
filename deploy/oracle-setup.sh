#!/usr/bin/env bash
# FEED-XMD one-shot setup for an Ubuntu/Debian VM (e.g. Oracle Cloud Always Free).
# Run from inside the unzipped project folder:  bash deploy/oracle-setup.sh
set -euo pipefail

echo "==> Installing system packages"
sudo apt-get update -y
sudo apt-get install -y curl git ffmpeg build-essential python3

if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  echo "==> Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> Installing dependencies"
npm install --omit=dev --no-audit --no-fund

if [ ! -f .env ]; then
  cp .env.example .env
  # Keep the pairing dashboard private; reach it with an SSH tunnel instead.
  echo "DASHBOARD_HOST=127.0.0.1" >> .env
  echo "DASHBOARD_TOKEN=$(node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))")" >> .env
  echo "FEED_XMD_DATA_DIR=$HOME/feed-xmd-data" >> .env
  echo "==> Created .env — edit it now (set OWNER_NUMBER at least):  nano .env"
fi
mkdir -p "$HOME/feed-xmd-data"

echo "==> Installing PM2 and starting the bot"
sudo npm install -g pm2
pm2 start index.js --name feed-xmd --time
pm2 save
pm2 startup systemd -u "$USER" --hp "$HOME" | tail -n 1 | bash || true

cat <<MSG

Done. Pair your WhatsApp from your own computer with an SSH tunnel
(nothing is exposed to the internet):

  ssh -L 3000:localhost:3000 <user>@<server-ip>
  then open  http://localhost:3000  in your browser

Useful:  pm2 logs feed-xmd | pm2 restart feed-xmd | pm2 status
MSG
