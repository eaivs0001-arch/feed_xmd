/* FEED-XMD dashboard — tabs, live status, command browser, guides */
const $ = (s, r = document) => r.querySelector(s);
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ── Content ─────────────────────────────────────────────── */
const FEATURES = [
  { icon: 'fa-robot', title: 'AI assistants', text: 'Keyless chat (.gemini / .gpt / .llama / .blackbox / .polli), keyless images (.imagine / .aiimg / .pimage), Gemini 2.5 Flash-Lite with your key (.ask / .brain / .persona), Groq (.groq / .groqfast), Hugging Face (.hfimage / .hfchat), and voice (.pvoice).', tag: ['Mostly keyless', 'good'] },
  { icon: 'fa-download', title: 'Media downloaders', text: 'YouTube audio/video, TikTok, Instagram, Facebook, Twitter/X, Spotify, SoundCloud, Pinterest, Threads, APK and more.', tag: ['Depends on third-party sites', 'warn'] },
  { icon: 'fa-icons', title: 'Stickers & image tools', text: 'Sticker maker, resize, crop, flip, rotate, compress, view-once saver (.vv), QR create/scan, text-to-speech.', tag: ['No key', 'good'] },
  { icon: 'fa-shield-halved', title: 'Group management', text: 'Warnings, welcome/goodbye messages, anti-link, anti-mention, anti-sticker, word filters, hidetag, group name/pic/description.', tag: ['No key', 'good'] },
  { icon: 'fa-gears', title: 'Automation', text: 'Auto-read, auto-typing, auto-react, auto-reply rules, always online/offline, anti-call, anti-edit.', tag: ['No key', 'good'] },
  { icon: 'fa-coins', title: 'Economy & games', text: 'Register, daily/weekly rewards, work, mine, shop, inventory, slots, blackjack, bets, RPS, riddles, trivia, leaderboards.', tag: ['No key', 'good'] },
  { icon: 'fa-face-laugh', title: 'Fun', text: '150+ jokes, 200+ quotes and facts, 8ball, roast, compliments, ship, truth or dare, memes and reaction GIFs.', tag: ['No key', 'good'] },
  { icon: 'fa-wand-magic-sparkles', title: 'Anime', text: 'Waifu, neko, wallpapers, anime lookup and safe reaction GIFs.', tag: ['No key', 'good'] },
  { icon: 'fa-newspaper', title: 'News', text: 'RSS-based headlines (BBC, international, Sri Lankan sources). Summaries use Gemini if a key is set.', tag: ['Optional key', 'warn'] },
  { icon: 'fa-paper-plane', title: 'Telegram admin log', text: 'Every bot login, every new WhatsApp user, and every command run is sent to your own Telegram chat in near real time. Run .tglogs to check status or send a test line.', tag: ['Set TELEGRAM_BOT_TOKEN', 'warn'] },
  { icon: 'fa-toolbox', title: 'Local tools', text: 'Calculator, unit converter, hash, encrypt/decrypt, base64, hex, UUID, password generator, JSON validator, timestamps, translate, currency.', tag: ['No key', 'good'] },
  { icon: 'fa-cloud-sun', title: 'Weather & lookups', text: 'Weather (wttr.in), 5-day forecast (Open-Meteo), dictionary with phonetics (.define), Wikipedia, countries (.country), GitHub repo info, crypto prices (.crypto), Pokemon (.pokemon), arXiv papers, Hacker News, trivia (Open Trivia DB), lyrics, movies.', tag: ['Keyless', 'good'] },
  { icon: 'fa-list-check', title: 'Productivity', text: 'Todos, reminders, timers, polls, pins, archives and scheduled jobs.', tag: ['No key', 'good'] },
  { icon: 'fa-user-shield', title: 'Owner & security', text: 'Broadcast, block/unblock, join/leave groups, bot info, lockdown, filters and security toggles. Owner-only commands check OWNER_NUMBER.', tag: ['Set OWNER_NUMBER', 'warn'] },
  { icon: 'fa-database', title: 'Storage', text: 'Local JSON files in your data folder (not SQLite). Backups via .backup and .restore. Needs a persistent disk to survive restarts.', tag: ['Needs persistent disk', 'warn'] },
  { icon: 'fa-qrcode', title: 'Web pairing', text: 'This site: scan a QR or request a pairing code from the browser instead of reading terminal logs.', tag: ['Protect it', 'warn'] }
];

const KEYS = [
  { env: 'GEMINI_API_KEY', what: 'Gemini 2.5 Flash-Lite chat: .ask, .brain, AI news summaries. (.gemini/.gpt/.llama/.blackbox/.imagine need no key)', free: 'Yes, highest free-tier rate limit', req: 'Optional', url: 'https://aistudio.google.com/apikey' },
  { env: 'GROQ_API_KEY', what: 'Groq chat: .groq (llama-3.3-70b, best reasoning), .groqfast (llama-3.1-8b, fastest)', free: 'Yes, 14,400 requests/day', req: 'Optional', url: 'https://console.groq.com/keys' },
  { env: 'HF_TOKEN', what: 'Hugging Face: .hfimage (images), .hfchat (Qwen2.5-7B chat)', free: 'Free account, limited credits', req: 'Optional', url: 'https://huggingface.co/settings/tokens' },
  { env: 'POLLINATIONS_API_KEY', what: 'Faster Pollinations tier; required only for .pvoice (voice)', free: 'Text/image work without it', req: 'Optional', url: 'https://pollinations.ai' },
  { env: 'UNSPLASH_API_KEY', what: 'Real photos for .wallpaper (falls back to an AI-generated image without it)', free: 'Yes, 50 requests/hour', req: 'Optional', url: 'https://unsplash.com/oauth/applications' },
  { env: 'ALPHAVANTAGE_API_KEY', what: 'Stock quotes: .stock', free: 'Yes, low daily limit', req: 'Optional', url: 'https://www.alphavantage.co/support/#api-key' },
  { env: 'OMDB_API_KEY', what: 'Movie lookup: .movie', free: 'Yes, 1,000 requests/day', req: 'Optional', url: 'https://www.omdbapi.com/apikey.aspx' },
  { env: 'NEWSAPI_KEY / GNEWS_API_KEY', what: 'Extra news lookups in the fallback handlers (RSS news commands need neither)', free: 'Yes, limited', req: 'Optional', url: 'https://newsapi.org' },
  { env: 'TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID', what: 'Sends you a live log of every login, new user, and command run', free: 'Yes', req: 'Recommended', url: 'https://t.me/BotFather' },
  { env: 'OWNER_NUMBER', what: 'Your WhatsApp number, digits only (e.g. 2348012345678). Unlocks owner-only commands like .tglogs', free: 'n/a', req: 'Recommended', url: null },
  { env: 'DASHBOARD_TOKEN', what: 'Password for the protected stats API. Generate a long random string', free: 'n/a', req: 'Recommended', url: null },
  { env: 'FEED_XMD_DATA_DIR', what: 'Where sessions and data are stored. Point it at persistent storage', free: 'n/a', req: 'Recommended', url: null }
];

const DEPLOY = [
  { icon: 'fa-server', title: 'Oracle Cloud Always Free VM', tag: ['Best free option', 'good'], text: 'A real always-on Linux VM with a persistent disk. Install Node, run the bot with PM2 and it stays paired across restarts. Needs a card for sign-up; free-tier sign-ups are sometimes refused and capacity varies by region.', steps: 'deploy/oracle-setup.sh (in this project) automates the install.' },
  { icon: 'fa-house-signal', title: 'Your own machine', tag: ['Free, reliable', 'good'], text: 'An old laptop, Raspberry Pi or a phone running Termux. Zero hosting cost and full control. It only works while that device stays on and online.', steps: 'npm install && npm start' },
  { icon: 'fa-cloud', title: 'Render web service', tag: ['Testing only', 'warn'], text: 'Free web services sleep when idle and use a temporary disk, so the WhatsApp session is lost on every restart or redeploy and you have to re-pair. Background workers are not free.', steps: 'render.yaml is set up as a web service. Ping /api/health every 5 min to keep it awake.' },
  { icon: 'fa-triangle-exclamation', title: 'No longer free', tag: ['Avoid', 'bad'], text: 'Heroku, Fly.io, Railway (trial only), Glitch and Hugging Face Docker Spaces no longer offer a lasting free tier, per recent 2026 roundups. Koyeb needs a card on file.', steps: '' },
  { icon: 'fa-user-secret', title: 'Free "bot host" panels', tag: ['Not recommended', 'bad'], text: 'Small third-party panels offering free 24/7 bot hosting exist, but you would be giving strangers your WhatsApp session files, which is full access to your account.', steps: '' }
];

const DEPLOY_NOTES = [
  '<strong>Pair once, keep the session.</strong> Sessions live in <code>FEED_XMD_DATA_DIR/auth</code>. If that folder is wiped, you re-pair.',
  '<strong>Protect this dashboard.</strong> The pairing page has no login. Put it behind a firewall rule, VPN or your platform\'s access control, or only leave it reachable while pairing.',
  '<strong>Use a secondary number if you can.</strong> This uses the unofficial WhatsApp Web protocol, and WhatsApp can restrict numbers that automate heavily.',
  '<strong>Never commit <code>.env</code>.</strong> It ships with every value blank — fill in real keys only in your host\u2019s environment-variable settings, not in a committed file.'
];

/* ── Tabs ─────────────────────────────────────────────────── */
document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + btn.dataset.tab));
    history.replaceState(null, '', '#' + btn.dataset.tab);
  });
});
const startTab = location.hash.slice(1);
if (startTab && $(`.tab[data-tab="${startTab}"]`)) $(`.tab[data-tab="${startTab}"]`).click();

/* ── Static sections ─────────────────────────────────────── */
$('#featureGrid').innerHTML = FEATURES.map((f) =>
  `<div class="feature"><i class="fa-solid ${f.icon}"></i><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><span class="tag ${f.tag[1]}">${esc(f.tag[0])}</span></div>`).join('');

$('#keyTable').innerHTML =
  '<thead><tr><th>Variable</th><th>Used for</th><th>Free?</th><th>Needed?</th><th>Get it</th></tr></thead><tbody>' +
  KEYS.map((k) => `<tr><td><code>${esc(k.env)}</code></td><td>${esc(k.what)}</td><td>${esc(k.free)}</td><td>${esc(k.req)}</td><td>${k.url ? `<a href="${k.url}" target="_blank" rel="noopener">Open</a>` : '—'}</td></tr>`).join('') +
  '</tbody>';

$('#deployGrid').innerHTML = DEPLOY.map((d) =>
  `<div class="feature"><i class="fa-solid ${d.icon}"></i><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p>${d.steps ? `<p style="margin-top:8px"><code>${esc(d.steps)}</code></p>` : ''}<span class="tag ${d.tag[1]}">${esc(d.tag[0])}</span></div>`).join('');
$('#deployNotes').innerHTML = DEPLOY_NOTES.map((n) => `<li>${n}</li>`).join('');

/* ── Cross-origin server URL (for Netlify or any static host) ─────── */
(function initServerCard() {
  const card = $('#serverCard');
  const input = $('#serverInput');
  const isStatic = location.protocol === 'file:' || !location.port && location.hostname.match(/netlify|github\.io|vercel|pages\.dev/);
  const base = FXD_API.getBase();
  if (base || isStatic) {
    card.style.display = 'block';
    input.value = base;
  }
  $('#serverBtn').addEventListener('click', () => {
    FXD_API.setBase(input.value.trim());
    location.reload();
  });
})();

/* ── Status ───────────────────────────────────────────────── */
function timeAgo(iso) {
  if (!iso) return '—';
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`;
}
async function pollStatus() {
  try {
    const d = await (await fetch(apiUrl('/api/status'))).json();
    const dot = $('#statusDot'), txt = $('#statusText');
    const map = { open: ['connected', 'connected'], qr: ['waiting', 'waiting for login'], connecting: ['connecting', 'connecting'] };
    const m = map[d.status] || ['', d.status || 'initializing'];
    dot.className = 'pill__dot ' + m[0]; txt.textContent = m[1];
    $('#statGrid').innerHTML =
      `<dl class="stat"><dt>Connection</dt><dd>${esc(m[1])}</dd></dl>` +
      `<dl class="stat"><dt>Reconnect attempts</dt><dd>${d.reconnectAttempt ?? 0}</dd></dl>` +
      `<dl class="stat"><dt>Health checks failed</dt><dd>${d.healthProbeFailures ?? 0}</dd></dl>` +
      `<dl class="stat"><dt>Last update</dt><dd>${timeAgo(d.lastConnectionUpdate)}</dd></dl>`;
  } catch (_) { /* keep last state */ }
}
pollStatus(); setInterval(pollStatus, 4000);

/* ── Protected stats ─────────────────────────────────────── */
async function loadLive() {
  const token = $('#tokenInput').value.trim() || sessionStorage.getItem('fxd_token') || '';
  const err = $('#tokenError'); err.style.display = 'none';
  if (!token) return;
  try {
    const res = await fetch(apiUrl('/api/dashboard/overview'), { headers: { Authorization: 'Bearer ' + token } });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || 'Request failed');
    sessionStorage.setItem('fxd_token', token);
    $('#liveGrid').innerHTML = [
      ['Messages seen', d.stats.messages], ['Commands run', d.stats.commands], ['Groups', d.stats.groups], ['Users', d.stats.users],
      ['Memory', d.runtime.memory], ['CPU load', d.runtime.cpu], ['Uptime', d.runtime.uptimeHuman], ['Node', d.runtime.node]
    ].map(([k, v]) => `<dl class="stat"><dt>${k}</dt><dd>${esc(v)}</dd></dl>`).join('');
  } catch (e) { err.textContent = e.message; err.style.display = 'block'; }
}
$('#tokenBtn').addEventListener('click', loadLive);
if (sessionStorage.getItem('fxd_token')) loadLive();

/* ── Command browser ─────────────────────────────────────── */
let ALL = [], PREFIX = '/', cat = 'all';
function renderCommands() {
  const q = $('#cmdSearch').value.trim().toLowerCase();
  const st = $('#statusFilter').value;
  const list = ALL.filter((c) => (cat === 'all' || c.category === cat) && (st === 'all' || c.status === st) &&
    (!q || c.name.includes(q) || c.description.toLowerCase().includes(q)));
  $('#cmdSummary').textContent = `${list.length} of ${ALL.length} commands · prefix "${PREFIX}"`;
  $('#cmdList').innerHTML = list.map((c) =>
    `<div class="cmd"><b>${esc(PREFIX + c.name)}</b>` +
    (c.status !== 'active' ? `<span class="badge ${c.status}">${c.status}</span>` : '') +
    (c.key ? `<span class="badge key" title="Needs ${esc(c.key)}">key</span>` : '') +
    `<span class="badge cat">${esc(c.category)}</span><p>${esc(c.description || 'No description yet.')}</p></div>`).join('') ||
    '<p class="muted">No commands match.</p>';
}
async function loadCommands() {
  try {
    const d = await (await fetch(apiUrl('/api/commands'))).json();
    if (!d.ok) throw new Error(d.error || 'failed');
    ALL = d.commands; PREFIX = d.prefix || '/';
    const s = d.summary;
    $('#statGrid').insertAdjacentHTML('afterend',
      `<div class="grid stats"><dl class="stat"><dt>Commands registered</dt><dd>${s.total}</dd></dl>` +
      `<dl class="stat"><dt>Working</dt><dd>${s.active}</dd></dl>` +
      `<dl class="stat"><dt>Intentionally disabled</dt><dd>${s.restricted}</dd></dl>` +
      `<dl class="stat"><dt>Placeholders</dt><dd>${s.placeholder}</dd></dl></div>`);
    const cats = Object.entries(d.categories).sort((a, b) => b[1] - a[1]);
    $('#catChips').innerHTML = `<button class="active" data-cat="all">all<span>${s.total}</span></button>` +
      cats.map(([k, n]) => `<button data-cat="${esc(k)}">${esc(k)}<span>${n}</span></button>`).join('');
    $('#catChips').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      cat = b.dataset.cat;
      document.querySelectorAll('#catChips button').forEach((x) => x.classList.toggle('active', x === b));
      renderCommands();
    });
    renderCommands();
  } catch (e) { $('#cmdSummary').textContent = 'Could not load commands: ' + e.message; }
}
$('#cmdSearch').addEventListener('input', renderCommands);
$('#statusFilter').addEventListener('change', renderCommands);
loadCommands();
