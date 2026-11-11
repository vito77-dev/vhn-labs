/* VHN Labs: deixa o site instalável e guarda tudo para abrir sem internet. */
const V='vhn-v16',BASE=['./','./index.html','./jogos.js','./capas.js','./manifest.webmanifest','./icone-192.png','./icone-512.png','./icone-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(BASE.map(u=>c.add(u).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const same=u.origin===location.origin;
  /* arquivos do site (js e html): sempre tenta a internet primeiro, assim as atualizações chegam logo; sem internet usa o guardado */
  if(same&&/\.js$/.test(u.pathname)){
    const key=new Request(u.origin+u.pathname);
    e.respondWith(fetch(r,{cache:'no-cache'}).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put(key,c))}return x}).catch(()=>caches.match(key).then(h=>h||caches.match(r))));return}
  if(same&&u.searchParams.has('v'))return; /* verificação de atualização: sempre da internet */
  if(same&&r.mode==='navigate'){
    e.respondWith(fetch(r).then(x=>{if(x.ok&&!u.search){const c=x.clone();caches.open(V).then(h=>h.put('./index.html',c))}return x}).catch(()=>caches.match('./index.html')));return}
  if(same||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>h)))}
});
