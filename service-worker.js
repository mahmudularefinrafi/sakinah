/* Offline-first shell cache for the static Sakinah PWA. */
const CACHE_NAME = "sakinah-shell-v19";
const APP_SHELL = [
  "./",
  "./index.html",
  "./other-duas.html",
  "./quran-duas.html",
  "./quran-duas.css",
  "./quran-duas.js",
  "./other-duas.css",
  "./results.html",
  "./library.html",
  "./daily-duas.html",
  "./daily-duas.css",
  "./daily-duas.js",
  "./amal.html",
  "./amal.css",
  "./amal.js",
  "./islamic-tools.html",
  "./islamic-tools.css",
  "./islamic-tools.js",
  "./special-surahs.html",
  "./special-surahs.css",
  "./special-surahs.js",
  "./results-page.js",
  "./styles.css",
  "./matching.css",
  "./features.css",
  "./library.css",
  "./app.js",
  "./matching.js",
  "./features-core.js",
  "./features.js",
  "./library-core.js",
  "./library.js",
  "./pwa.js",
  "./reminders.js",
  "./mobile-nav.js",
  "./pwa-mobile-nav.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./app-icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const urls = APP_SHELL.map(path => new URL(path, self.registration.scope).href);
    await cache.addAll(urls);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith("sakinah-") && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(request)) ||
          (await cache.match(new URL("./index.html", self.registration.scope).href)) ||
          new Response("সাকীনা অফলাইনে পাওয়া যাচ্ছে না। আগে একবার ইন্টারনেটসহ অ্যাপটি খুলুন।", {
            status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === "basic") await cache.put(request, response.clone());
      return response;
    } catch {
      return new Response("", { status: 504, statusText: "Offline" });
    }
  })());
});
