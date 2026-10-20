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
  assert.match(html, /class="home-featured-grid dua-grid" id="libraryGrid"/);
  assert.match(html, /href="library\.html"/);
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
  assert.match(sw, /sakinah-shell-v3/);
  assert.match(sw, /"\.\/results\.html"/);
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
  assert.match(html, /অর্থগুলো পাঠ-সহায়ক খসড়া/);
  assert.match(sw, /"\.\/special-surahs\.html"/);
  assert.match(read("index.html"), /href="special-surahs\.html"/);
});
