// Offline support: the game shell is cached on first visit, fonts are cached as they load.
// Voice clips live in their own cache (filled by the page, see Voice.keep in index.html) so updates keep them.
const CACHE = 'zauber-kleiderschrank-v3';
const VOICE = 'zk-voice';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './voice/index.json', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== VOICE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page and voice index: try the network first so updates arrive, fall back to the cached copy offline.
  const fresh = req.mode === 'navigate' ? './index.html' : url.origin === location.origin && url.pathname.endsWith('/voice/index.json') ? './voice/index.json' : null;
  if (fresh) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      if (res.ok) caches.open(CACHE).then(c => c.put(fresh, copy));
      return res;
    }).catch(() => caches.match(fresh)));
    return;
  }

  // Voice clips never change (the file name is a hash of the sentence), so each is kept once loaded.
  if (url.origin === location.origin && /\/voice\/\w+\.mp3$/.test(url.pathname)) {
    e.respondWith(caches.open(VOICE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }

  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
    return;
  }

  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
  }
});
