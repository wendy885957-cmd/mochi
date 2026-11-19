const CACHE = 'jtf-v6';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('jtf-v') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});

/* Background reminder: only fires where the browser supports Periodic Background Sync
   (installed PWA on Chromium/Android). Not available on iOS. */
const ymd = d => { d = new Date(d); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
async function remind() {
  const data = await caches.open('jtf-data');
  const r = await data.match('./__jtf_dep'); if (!r) return;
  const { dep, notify } = await r.json(); if (!dep || !notify) return;
  const n = Math.round((new Date(dep + 'T00:00:00') - new Date(ymd(new Date()) + 'T00:00:00')) / 864e5);
  if (n !== 1 && n !== 0) return;
  const key = './__jtf_sent_' + dep + '_' + n;
  if (await data.match(key)) return;
  const [title, body] = n === 1
    ? ['明天出境', '退稅品別先託運：到機場先過海關確認，再託運。']
    : ['今天出境', '先到退稅機器掃護照（託運前），所有退稅品帶在身上。'];
  await self.registration.showNotification(title, { body, icon: 'icon-192.png', tag: 'jtf' });
  await data.put(key, new Response('1'));
}
self.addEventListener('periodicsync', e => { if (e.tag === 'jtf-remind') e.waitUntil(remind()); });
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(ws => ws.length ? ws[0].focus() : clients.openWindow('./')));
});
