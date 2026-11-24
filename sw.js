const C='bplog-v15';
const A=['./','./index.html','./manifest.json','./icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const fallback=()=>caches.match(e.request).then(m=>m||caches.match('./index.html'));
  e.respondWith(fetch(e.request).then(r=>{
    if(r&&r.ok){const cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl));return r}
    return fallback().then(m=>m||r);
  }).catch(fallback));
});
