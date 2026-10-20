const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const read = name => fs.readFileSync(path.join(root, name), "utf8");

test("homepage stays focused on the feeling prompt and a small dua selection", () => {
  const html = read("index.html");
  assert.match(html, /<body data-page="home">/);
  assert.match(html, /id="feeling"/);
  assert.match(html, /id="dailyDuaCard"/);
  assert.match(html, /id="other-duas" class="home-daily-dua-link"/);
  assert.match(html, /href="other-duas\.html"/);
  assert.doesNotMatch(html, /href="daily-duas\.html">দৈনন্দিন দোয়া<\/a>/);
  assert.doesNotMatch(html, /আপনার জন্য নির্বাচিত/);
  assert.doesNotMatch(html, /class="home-featured-grid dua-grid" id="libraryGrid"/);
  assert.doesNotMatch(html, /href="library\.html">দোয়ার সংগ্রহ<\/a>/);
  assert.doesNotMatch(html, /id="libraryQuery"/);
  assert.doesNotMatch(html, /id="collectionGrid"/);
  assert.doesNotMatch(html, /id="collections" class="collections-section"/);
});

test("search results have their own page and explicit content-scope note", () => {
  const html = read("results.html");
  assert.match(html, /<body data-page="results">/);
  assert.match(html, /id="resultsGrid"/);
  assert.match(html, /id="searchedFeeling"/);
  assert.match(html, /যাচাইকৃত হাদিসের সংগ্রহ যোগ না হওয়া পর্যন্ত/);
  assert.match(html, /results-page\.js/);
});

test("full Quran library and personal collections live on their own page", () => {
  const html = read("library.html");
  assert.match(html, /<body data-page="library">/);
  assert.match(html, /id="libraryQuery"/);
  assert.match(html, /id="surahFilter"/);
  assert.match(html, /id="ayahFilter"/);
  assert.match(html, /id="collections" class="collections-section"/);
  assert.match(html, /id="collectionGrid"/);
});

test("search text is passed between pages through tab-scoped storage, not the URL", () => {
  const app = read("app.js");
  const results = read("results-page.js");
  assert.match(app, /sessionStorage\.setItem\("sakinah-pending-search-v1",query\)/);
  assert.match(results, /sessionStorage\.getItem\(KEY\)/);
  assert.match(results, /sessionStorage\.removeItem\(KEY\)/);
  assert.doesNotMatch(app, /location\.href\s*=\s*["'][^"']*\?[^"']*query/);
});

test("offline cache includes the separate pages and results script", () => {
  const sw = read("service-worker.js");
  assert.match(sw, /sakinah-shell-v13/);
  assert.match(sw, /"\.\/results\.html"/);
  assert.match(sw, /"\.\/other-duas\.html"/);
  assert.match(sw, /"\.\/library\.html"/);
  assert.match(sw, /"\.\/results-page\.js"/);
});


test("special surah page includes the selected surahs, verse meanings, filters, and source note", () => {
  const html = read("special-surahs.html");
  const js = read("special-surahs.js");
  const sw = read("service-worker.js");
  assert.match(html, /data-page="special-surahs"/);
  assert.match(html, /id="surahSearch"/);
  assert.match(html, /id="surahFilters"/);
  for (const name of ["আল-ফাতিহা", "আল-ইখলাস", "আল-ফালাক", "আন-নাস", "আল-আসর", "আদ-দুহা", "আশ-শারহ"]) assert.ok(js.includes(name), name);
  assert.match(js, /verse-meaning/);
  assert.match(html, /বাংলা অনুবাদ Al Quran Cloud-এর bn\.bengali সংস্করণ/);
  assert.match(sw, /"\.\/special-surahs\.html"/);
  assert.match(read("index.html"), /href="special-surahs\.html"/);
});


test("full Quran reader lists all 114 surahs and supports short and featured filters", () => {
  const html = read("special-surahs.html");
  const js = read("special-surahs.js");
  const sw = read("service-worker.js");
  assert.match(html, /সব ১১৪টি সূরা/);
  assert.match(html, /সূরা ফীল থেকে নাস/);
  assert.match(html, /id="surahDetail"/);
  assert.match(js, /"আল-ফিল"/);
  assert.match(js, /"আন-নাস"/);
  assert.match(js, /"ইয়াসিন"/);
  assert.match(js, /"আর-রহমান"/);
  assert.match(js, /bn\.bengali/);
  assert.match(js, /FEATURED = \[1,18,36,55,56,67/);
  assert.match(sw, /sakinah-shell-v13/);
});


test("mobile navigation is available on every page and the service worker caches each route separately", () => {
  for (const name of ["index.html", "library.html", "results.html", "special-surahs.html", "daily-duas.html", "other-duas.html", "amal.html"]) {
    const html = read(name);
    assert.match(html, /id="mobileMenuToggle"/, name + " has mobile menu button");
    assert.match(html, /id="primaryNavigation"/, name + " has navigation target");
    assert.match(html, /mobile-nav\.js/, name + " loads mobile navigation");
  }
  const nav = read("mobile-nav.js");
  assert.match(nav, /aria-expanded/);
  assert.match(nav, /Escape/);
  const sw = read("service-worker.js");
  assert.match(sw, /"\.\/mobile-nav\.js"/);
  assert.match(sw, /await cache\.put\(request, response\.clone\(\)\)/);
  assert.doesNotMatch(sw, /cache\.put\(new URL\("\.\/index\.html"/);
});


test("daily dua page provides topic filters, chronological entries, search, and authenticity notes", () => {
  const html = read("daily-duas.html");
  const js = read("daily-duas.js");
  const sw = read("service-worker.js");
  assert.match(html, /দৈনন্দিন জীবনের দোয়া/);
  assert.match(html, /id="topicFilters"/);
  assert.match(js, /title:"ঘুম থেকে ওঠার দোয়া"/);
  assert.match(js, /title:"খাওয়ার আগে"/);
  assert.match(js, /title:"পানি পান করার আগে ও পরে"/);
  assert.match(js, /title:"আয়না দেখার সময়"/);
  assert.match(js, /নির্ভরযোগ্য সহিহ হাদিসের প্রমাণ স্পষ্ট নয়/);
  assert.match(sw, /"\.\/daily-duas\.html"/);
});


test("local tasbih and daily amal tracker are private, navigable, and cached offline", () => {
  const html = read("amal.html");
  const js = read("amal.js");
  const css = read("amal.css");
  const sw = read("service-worker.js");
  assert.match(html, /<body data-page="amal">/);
  assert.match(html, /id="dhikrSelect"/);
  assert.match(html, /id="countButton"/);
  assert.match(html, /id="amalChecklist"/);
  assert.match(html, /id="exportData"/);
  assert.match(js, /sakinah-tasbih-v1/);
  assert.match(js, /sakinah-amal-tracker-v1/);
  assert.match(js, /localStorage\.setItem|localStorage\.getItem/);
  assert.match(js, /function todayKey/);
  assert.match(js, /ফজরের নামাজ/);
  assert.match(js, /সকালবেলার যিকির/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(sw, /sakinah-shell-v13/);
  for (const asset of ["amal.html", "amal.css", "amal.js"]) assert.ok(sw.includes('"./' + asset + '"'), asset + " is cached offline");
  for (const name of ["index.html", "results.html", "library.html", "special-surahs.html", "daily-duas.html"]) {
    assert.match(read(name), /href="amal\.html"/, name + " links to local tools");
  }
});

test("mobile navigation opens a dropdown on small screens", () => {
  const css = read("styles.css");
  const nav = read("mobile-nav.js");
  assert.match(css, /\.topbar\.menu-open nav/);
  assert.match(css, /\.mobile-menu-toggle\{display:none/);
  assert.match(nav, /button\.addEventListener\("click"/);
  assert.match(nav, /aria-expanded/);
});


test("Islamic tools page exposes prayer times, Qibla, Hijri/Ramadan calendar and optional reminders", () => {
  const html = read("islamic-tools.html");
  const js = read("islamic-tools.js");
  const sw = read("service-worker.js");
  assert.match(html, /id="prayerGrid"/);
  assert.match(html, /id="compassNeedle"/);
  assert.match(html, /id="hijriLarge"/);
  assert.match(html, /id="ramadanCalendar"/);
  assert.match(html, /id="enableReminders"/);
  assert.match(html, /পেজটি খোলা থাকতে হবে/);
  assert.ok(js.includes("hijriCalendar"));
  assert.ok(js.includes("Notification.requestPermission"));
  assert.ok(js.includes("localStorage.setItem(KEY"));
  assert.ok(sw.includes('"./islamic-tools.html"'));
  assert.ok(sw.includes('"./islamic-tools.js"'));
});


test("annual Hijri-Gregorian calendar and district-specific Ramadan calendar are available", () => {
  const html = read("islamic-tools.html");
  const js = read("islamic-tools.js");
  const css = read("islamic-tools.css");
  const sw = read("service-worker.js");
  const districtSelect = html.slice(html.indexOf('<select id="districtSelect"'), html.indexOf("</select>", html.indexOf('<select id="districtSelect"')) + 9);
  const districts = [...districtSelect.matchAll(/<option value="([^"]+)"/g)].map(match => match[1]).filter(value => value !== "custom");
  assert.equal(new Set(districts).size, 64);
  assert.match(html, /id="calendarYear"/);
  assert.match(html, /id="annualCalendar"/);
  assert.match(html, /id="ramadanHijriYear"/);
  assert.ok(js.includes("function renderAnnualCalendar"));
  assert.ok(js.includes("islamic-umalqura"));
  assert.ok(js.includes("countryCode=BD"));
  assert.ok(js.includes('api("hijriCalendar/" + ramadanYear + "/9")'));
  assert.match(html, /ইসলামিক ফাউন্ডেশনের প্রকাশিত সরকারি তালিকা নয়/);
  assert.ok(css.includes(".annual-calendar"));
  assert.ok(sw.includes("sakinah-shell-v13"));
});


test("Islamic tools opens focused single-page views from a dashboard and keeps all tools reachable", () => {
  const html = read("islamic-tools.html");
  const js = read("islamic-tools.js");
  const css = read("islamic-tools.css");
  const sw = read("service-worker.js");
  assert.match(html, /id="toolsDashboard"/);
  for (const view of ["prayer-times", "qibla", "hijri-calendar", "ramadan", "reminders"]) {
    assert.match(html, new RegExp('data-open-tool="' + view + '"'));
    assert.match(html, new RegExp('data-tool-view="' + view + '"'));
  }
  assert.match(html, /<details class="tools-location-settings">/);
  assert.match(js, /function showDashboard\(\)/);
  assert.match(js, /function showTool\(view\)/);
  assert.match(js, /history\.replaceState/);
  assert.match(js, /tool-back-button/);
  assert.match(css, /\.tools-dashboard-grid/);
  assert.match(css, /\.tools-section\[hidden\]/);
  assert.match(sw, /sakinah-shell-v13/);
  assert.match(html, /id="prayerGrid"/);
  assert.match(html, /id="compassNeedle"/);
  assert.match(html, /id="annualCalendar"/);
  assert.match(html, /id="ramadanCalendar"/);
  assert.match(html, /id="enableReminders"/);
});

test("installed mobile navigation is standalone-only, accessible, and cached", () => {
  const pages = ["index.html", "library.html", "results.html", "special-surahs.html", "daily-duas.html", "amal.html", "islamic-tools.html"];
  for (const page of pages) assert.match(read(page), /pwa-mobile-nav\.js/, page + " loads installed-app navigation");
  const nav = read("pwa-mobile-nav.js");
  const css = read("styles.css");
  const sw = read("service-worker.js");
  assert.match(nav, /display-mode: standalone/);
  assert.match(nav, /navigator\.standalone/);
  assert.match(nav, /max-width: 760px/);
  assert.match(nav, /aria-expanded/);
  assert.match(nav, /aria-modal/);
  assert.match(nav, /Escape/);
  for (const label of ["হোম", "দোয়া", "সংরক্ষিত", "মেনু", "কুরআন ও সূরা", "তাসবিহ ও আমল", "নামাজ ও ইসলামিক টুলস"]) assert.ok(nav.includes(label), label);
  assert.match(nav, /আলাদা আয়াত\/হাদিস ডাউনলোড এখনো সমর্থিত নয়/);
  assert.match(css, /body\.pwa-mobile-app \.pwa-bottom-nav/);
  assert.match(css, /env\(safe-area-inset-bottom/);
  assert.match(sw, /sakinah-shell-v13/);
  assert.match(sw, /"\.\/pwa-mobile-nav\.js"/);
});


test("installed PWA checks for service worker updates and reloads updated clients", () => {
  const pwa = read("pwa.js");
  const sw = read("service-worker.js");
  assert.match(pwa, /updateViaCache: "none"/);
  assert.match(pwa, /registration\.update\(\)/);
  assert.match(pwa, /controllerchange/);
  assert.match(pwa, /window\.location\.reload\(\)/);
  assert.match(pwa, /visibilitychange/);
  assert.match(sw, /sakinah-shell-v13/);
  assert.match(sw, /self\.skipWaiting\(\)/);
  assert.match(sw, /self\.clients\.claim\(\)/);
});


test("homepage has only the daily dua and unified Other Duas section", () => {
  const home = read("index.html");
  const hub = read("other-duas.html");
  const sw = read("service-worker.js");
  assert.match(home, /id="dailyDuaCard"/);
  assert.match(home, /id="other-duas"/);
  assert.match(home, /href="other-duas\.html"/);
  assert.doesNotMatch(home, /href="daily-duas\.html">দৈনন্দিন দোয়া<\/a>/);
  assert.doesNotMatch(home, /href="library\.html">দোয়ার সংগ্রহ<\/a>/);
  assert.match(hub, /দৈনন্দিন জীবনের দোয়া/);
  assert.match(hub, /কুরআনের দোয়া সংগ্রহ/);
  assert.match(hub, /বিশেষ সূরা ও অর্থ/);
  assert.match(sw, /sakinah-shell-v13/);
  assert.match(sw, /"\.\/other-duas\.html"/);
  assert.match(sw, /"\.\/other-duas\.css"/);
});
