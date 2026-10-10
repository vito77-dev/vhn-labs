/* VHN Labs: deixa o site instalável e guarda tudo para abrir sem internet. */
const V='vhn-v6',BASE=['./','./index.html','./manifest.webmanifest','./icone-192.png','./icone-512.png','./icone-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(BASE.map(u=>c.add(u).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&u.searchParams.has('v'))return; /* verificação de atualização: sempre da internet */
  if(u.origin===location.origin&&r.mode==='navigate'){
    e.respondWith(fetch(r).then(x=>{if(x.ok&&!u.search){const c=x.clone();caches.open(V).then(h=>h.put('./index.html',c))}return x}).catch(()=>caches.match('./index.html')));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>h)))}
});
