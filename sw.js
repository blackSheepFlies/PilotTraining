const CACHE_NAME = 'pilotentraining-v1';
const OFFLINE_URLS = [
'/',
'/index.html',
'/manifest.json',
// Add minimal critical assets & the root of core modules/tools you want offline
'/modules/cog-trainer/',
'/tools/wb/',
];
self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
);
});
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then(keys => Promise.all(
keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
))
);
});
self.addEventListener('fetch', (event) => {
const { request } = event;
if (request.method !== 'GET') return;
event.respondWith(
caches.match(request).then((cached) =>
cached || fetch(request).then((resp) => {
const copy = resp.clone();
// cache-as-you-go for same-origin GETs
if (request.url.startsWith(self.location.origin)) {
caches.open(CACHE_NAME).then(c => c.put(request, copy)).catch(()=>{});
}
return resp;
}).catch(() => caches.match('/index.html'))
)
);
});
