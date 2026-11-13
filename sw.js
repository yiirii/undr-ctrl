// Undr Ctrl offline worker.
// Pages: try the network (so updates arrive) but never wait more than ~2.5 s on a weak signal:
// the cached copy opens instead. Built files have hashed names, so they're cached forever once fetched.
// Firebase traffic is never touched.
const CACHE = 'undr-ctrl-20261113114629';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/apple-touch-icon.png'];
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener('activate', (e) => {
  // drop the previous release's files
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.searchParams.has('fresh')) return; // the app's "is there a newer version?" check always asks the site
  if (req.mode === 'navigate') {
    const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); } return res; });
    const cached = () => caches.match('./index.html').then((r) => r || caches.match('./'));
    const slow = new Promise((ok) => setTimeout(ok, 2500)).then(cached);
    e.respondWith(Promise.race([net.catch(cached), slow.then((r) => r || net)]).then((r) => r || net));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })));
});
