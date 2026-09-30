// Lets these pages be hosted anywhere (including a static host like Netlify)
// while still talking to your bot's real server. Same-origin by default —
// nothing to configure if you're opening these pages from the bot itself.
(function () {
  const KEY = 'fxd_api_base';
  const params = new URLSearchParams(location.search);
  if (params.get('api')) {
    localStorage.setItem(KEY, params.get('api').replace(/\/+$/, ''));
  }
  function getBase() {
    return localStorage.getItem(KEY) || '';
  }
  function setBase(url) {
    localStorage.setItem(KEY, String(url || '').replace(/\/+$/, ''));
  }
  window.apiUrl = (path) => getBase() + path;
  window.FXD_API = { getBase, setBase };
})();
