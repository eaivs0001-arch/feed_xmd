/* ── Cross-origin server URL (for Netlify or any static host) ─────── */
(function initServerRow() {
  const row = document.getElementById("serverRow");
  const input = document.getElementById("serverInput");
  const isStatic = location.protocol === "file:" || (!location.port && /netlify|github\.io|vercel|pages\.dev/.test(location.hostname));
  const base = window.FXD_API ? FXD_API.getBase() : "";
  if (base || isStatic) {
    row.style.display = "block";
    input.value = base;
  }
  document.getElementById("serverBtn").addEventListener("click", () => {
    FXD_API.setBase(input.value.trim());
    location.reload();
  });
})();

let qrPollInterval = null;
let statusPollInterval = null;

/* ── Build feature chips + social icons from socials.js ── */
function renderChips() {
  const row = document.getElementById("chipRow");
  row.innerHTML = FEATURES.map(
    (f) => `<li><i class="fa-solid ${f.icon}"></i>${f.label}</li>`
  ).join("");
}

function renderSocials() {
  const row = document.getElementById("socialRow");
  row.innerHTML = SOCIALS.filter((s) => s.url && s.url !== "#")
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener" title="${s.name}" style="color:${s.color}">
          <i class="fa-brands ${s.icon}"></i>
        </a>`
    )
    .join("");
}

/* ── Tabs ── */
function switchTab(tab) {
  document.getElementById("tabQr").classList.toggle("active", tab === "qr");
  document.getElementById("tabPair").classList.toggle("active", tab === "pair");
  document.getElementById("tabQr").setAttribute("aria-selected", tab === "qr");
  document.getElementById("tabPair").setAttribute("aria-selected", tab === "pair");
  document.getElementById("qrTab").classList.toggle("active", tab === "qr");
  document.getElementById("pairTab").classList.toggle("active", tab === "pair");
  document.getElementById("segmented").classList.toggle("pair", tab === "pair");
}

/* ── Status polling ── */
function timeAgo(iso) {
  if (!iso) return "—";
  const secs = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

async function pollStatus() {
  try {
    const res = await fetch(apiUrl("/api/status"));
    const data = await res.json();
    const dot = document.getElementById("statusDot");
    const text = document.getElementById("statusText");

    if (data.status === "open") {
      dot.className = "pill__dot connected";
      text.textContent = "connected";
      document.getElementById("qrTab").style.display = "none";
      document.getElementById("pairTab").style.display = "none";
      document.getElementById("connectedTab").style.display = "block";
      document.getElementById("segmented").style.display = "none";
      if (qrPollInterval) clearInterval(qrPollInterval);
    } else if (data.status === "qr") {
      dot.className = "pill__dot waiting";
      text.textContent = "waiting for login";
    } else if (data.status === "connecting") {
      dot.className = "pill__dot connecting";
      text.textContent = "connecting";
    } else {
      dot.className = "pill__dot";
      text.textContent = data.status || "initializing";
    }

    document.getElementById("telReconnect").textContent = data.reconnectAttempt ?? 0;
    document.getElementById("telHealth").textContent = data.healthProbeFailures ?? 0;
    document.getElementById("telUpdated").textContent = timeAgo(data.lastConnectionUpdate);
  } catch (e) {
    // network hiccup — keep last known state on screen
  }
}

async function pollQr() {
  try {
    const res = await fetch(apiUrl("/api/qr"));
    const data = await res.json();
    const img = document.getElementById("qrImage");
    const loading = document.getElementById("qrLoading");

    if (data.status === "connected") {
      if (qrPollInterval) clearInterval(qrPollInterval);
      return;
    }

    if (data.status === "qr" && data.qr) {
      img.src = data.qr;
      img.style.display = "block";
      loading.style.display = "none";
    } else {
      img.style.display = "none";
      loading.style.display = "flex";
    }
  } catch (e) {
    // ignore
  }
}

/* ── Pairing code ── */
async function requestPairingCode() {
  const phone = document.getElementById("phoneInput").value.trim();
  const resultDiv = document.getElementById("pairResult");
  const errorDiv = document.getElementById("pairError");
  const btn = document.getElementById("pairBtn");

  resultDiv.style.display = "none";
  errorDiv.style.display = "none";

  if (!phone) {
    errorDiv.textContent = "Please enter a phone number.";
    errorDiv.style.display = "block";
    return;
  }

  btn.disabled = true;
  btn.querySelector(".button__text").textContent = "Requesting…";

  try {
    const res = await fetch(apiUrl("/api/pair"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (data.code) {
      document.getElementById("pairCode").textContent = data.code;
      resultDiv.style.display = "block";
    } else if (data.error) {
      errorDiv.textContent = data.error;
      errorDiv.style.display = "block";
    }
  } catch (e) {
    errorDiv.textContent = "Network error. Please try again.";
    errorDiv.style.display = "block";
  }

  btn.disabled = false;
  btn.querySelector(".button__text").textContent = "Get pairing code";
}

function copyPairCode() {
  const code = document.getElementById("pairCode").textContent;
  const btn = document.getElementById("copyBtn");
  navigator.clipboard?.writeText(code).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
    setTimeout(() => (btn.innerHTML = original), 1500);
  });
}

/* ── Boot ── */
renderChips();
renderSocials();
pollStatus();
pollQr();
statusPollInterval = setInterval(pollStatus, 3000);
qrPollInterval = setInterval(pollQr, 5000);
