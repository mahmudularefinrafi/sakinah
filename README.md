# সাকীনা (Sakinah) — কুরআনের দোয়ায় প্রশান্তি

A minimal, responsive Bengali-first web app that helps people discover Quranic supplications related to their current feelings.

## Features
- Bengali feeling input with local keyword/category matching
- Curated Quranic dua cards with Arabic text, Bengali transliteration, meaning, and surah/ayah references
- Quick topic chips and category filters
- Copy and share actions
- Bookmarks stored locally in the user's browser
- Responsive mobile-first layout and reduced-motion support
- No backend, no API key, and no network submission of emotional text

## Run locally
No build step is needed. Open index.html in a browser, or serve this folder with any static file server. For example, run python -m http.server 8000 and visit http://localhost:8000.

## Publish with GitHub Pages
1. Open repository Settings.
2. Select Pages.
3. Under Build and deployment, choose Deploy from a branch.
4. Select branch main and folder /(root), then save.
5. Wait for GitHub Pages to finish deployment. The public URL will appear in Pages settings.

## Content accuracy note
The Arabic snippets and references are intended as a starter collection and should be checked against a trusted mushaf before public religious use. Bengali pronunciation is approximate, and Bengali meaning is a translation rather than the Arabic original. Some entries are excerpts of longer ayahs and are labeled accordingly. This MVP does not claim that a particular dua guarantees a particular outcome.

## Privacy and safety
The feeling text is processed locally in app.js and is not sent to a server. Bookmarks are saved in this browser's local storage. Avoid entering personal identifying information. This tool is not a diagnosis or a substitute for mental health support. If you may harm yourself or are in immediate danger, contact a trusted person and local emergency or professional support.

## Stack
- HTML
- CSS
- Vanilla JavaScript
- Browser localStorage

No third-party JavaScript libraries are required. Google Fonts are loaded from Google's font CDN; system fallbacks are provided.

## Author
Developed by M A Rafi.


## Matching and source transparency

- `matching.js` adds deterministic intent matching for common Bengali and English phrases, including common Bengali inflections.
- Low-confidence keyword overlaps are not presented as confirmed matches. If no relevant intent is detected, the app labels its output as general suggestions.
- Each dua card links to its corresponding Quran.com verse for readers to compare the Arabic text and context.
- The current Arabic snippets, Bengali transliterations, and Bengali meanings are a starter collection. Source links are provided for review, but this commit does **not** claim that every transliteration or Bengali translation has received scholarly verification. Review those items against a trusted mushaf and a reliable Bengali translation before presenting the collection as fully verified.
- The app continues to process feeling text locally in the browser; no backend or AI API is introduced.

## Run matching tests

Requires Node.js 18 or later.

```bash
npm test
```


## Daily Dua, content review, and share cards

- **Daily Dua:** selects one item deterministically for the visitor's local calendar date; consecutive dates rotate through the collection.
- **Dua Share Card:** creates a locally rendered PNG with Arabic text, Bengali meaning, optional transliteration, and the surah/ayah reference. Supported mobile browsers can share the image; otherwise it downloads.
- **Content review transparency:** each existing entry links to its Quran.com surah/ayah page. The app explicitly labels Bengali meaning and transliteration as awaiting independent review; it does not falsely mark the collection as fully verified.
- **Privacy:** share-card rendering happens in the browser. No emotional text or dua content is sent to a backend.

### Tests

Run `npm test` with Node.js 18 or later. The feature tests cover date-based selection, invalid dates, share text, source URL validation, and honest review labels.

**Content verification limitation:** source links make comparison possible, but a link alone is not proof that every Arabic excerpt, Bengali translation, and pronunciation has been independently reviewed. Complete that review against a trusted mushaf and reliable Bengali translation before describing the whole library as verified.


## Quran Library, private collections, and offline PWA

- **Quran Library:** search the curated dua subset by Bengali/English text, Arabic snippet, meaning, keywords, topic category, surah number, and ayah number. An ayah-range reference such as 20:25–26 can match either ayah in that displayed range.
- **Scope transparency:** this is a small curated dua collection, not a full Quran text search engine. The app says so in the results count rather than implying it indexes all 114 surahs.
- **Personal Dua Collection:** create named lists and add/remove duas. Collections store only collection names and dua IDs in this browser's local storage; raw emotion queries are not stored or uploaded.
- **Offline / installable PWA:** the web app manifest and service worker cache the static app shell. Once the app has loaded online and the service worker has installed, the interface and curated dua data can be used offline. Google Fonts may fall back to system fonts offline.
- **Privacy:** bookmarks and custom lists stay in browser storage. Clearing site data removes them. No account, backend, or network sync is introduced by these features.
- **Tests:** `npm test` runs the existing matching/feature tests and the new library filtering and collection helper tests.
- **PWA references:** [MDN caching guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching) and [MDN service worker guide](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

**Content accuracy limitation:** filtering is only over the currently curated entries. The existing Bengali translations and transliterations remain labeled as needing independent review; this update does not claim scholarly verification.


## Full Quran Surah reader (v0.6.0)

- **All 114 Surahs:** browse and search by Bengali name, English name, Arabic name, or Surah number.
- **Featured Surahs:** includes Al-Fatiha, Al-Kahf, Ya-Sin, Ar-Rahman, Al-Waqiah, Al-Mulk, and selected short Surahs; a dedicated filter shows Surah Al-Fil (105) through An-Nas (114).
- **Complete text on demand:** loads the full Arabic text and verse-by-verse Bengali translation (`bn.bengali`) from Al Quran Cloud when a Surah is selected. First load needs an internet connection; previously opened Surahs are cached locally for later/offline reading where browser storage permits.
- **Source transparency:** links to Quran.com and labels the Bengali translation edition; users should compare religious text and interpretation with trusted sources.

## Special Surah reading section (v0.5.0)

- **Special Surahs (`special-surahs.html`)**: adds Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Asr, Ad-Duha, and Ash-Sharh with Arabic text and verse-by-verse Bengali meanings.
- Search by surah name, topic, and meaning; filter by faith, protection, hope, or worship.
- Copy Arabic text with Bengali meanings and open the corresponding surah on Quran.com.
- The page is available from the home page and dua library and is included in the offline app shell.
- Translation note: Bengali meanings are reading aids and should be compared with a trusted translation; no claims are made about unverified special virtues.

## Page structure (v0.5.0)

- **Home (`index.html`)**: calm hero and private feeling prompt, daily dua, three featured duas, and the “Sakinah is here with you” support section.
- **Search results (`results.html`)**: a focused results view opened after a visitor submits a feeling. The query moves between pages through tab-scoped `sessionStorage`, never a URL parameter, and is removed after it is read.
- **Dua library (`library.html`)**: full curated collection, topic/surah/ayah filters, and browser-local personal collections.
- **Hadith scope**: the current data set contains Quranic duas/ayah excerpts only. The results page explicitly avoids fabricating hadith quotes; a hadith library needs independently checked source data before it can be displayed.
- **Page regression tests**: `pages.test.js` checks page separation, private search navigation, and offline precaching.


## দৈনন্দিন দোয়া

- `daily-duas.html`-এ দৈনন্দিন কাজের দোয়া বিষয় ও ক্রমানুসারে সাজানো আছে—সকাল/ঘুম, ঘর থেকে বের হওয়া, খাবার-পানীয়, ওযু/মসজিদ, সফর এবং অন্যান্য পরিস্থিতি।
- অনুসন্ধান ও বিষয়ভিত্তিক ফিল্টার, আরবি পাঠ, বাংলা উচ্চারণ/অর্থ এবং সূত্রের লিংক রয়েছে।
- আয়না দেখার জন্য নির্দিষ্ট সহিহ দোয়ার প্রমাণ স্পষ্ট না হওয়ায় প্রচলিত বাক্যকে সহিহ হাদিস হিসেবে উপস্থাপন করা হয়নি।
- হোমপেজের “আরও কিছু দোয়া” কার্ড-সেকশন সরিয়ে আলাদা দৈনন্দিন দোয়ার পাতায় যাওয়ার CTA রাখা হয়েছে।
- Service worker cache version: `sakinah-shell-v6`.


## Local Tasbih and Daily Amal Tracker (v0.7.0)

- `amal.html` provides a digital tasbih counter with selectable dhikr, configurable targets, undo/reset, and a daily total.
- The daily amal checklist covers the five daily prayers, Quran reading/study, morning/evening adhkar, dhikr, and kindness/charity. Progress is saved per local date.
- All tasbih and checklist records are stored in browser localStorage. No login, server, analytics, or sync is introduced.
- A JSON backup can be downloaded and kept privately by the user. Clearing browser/site data can erase local records; use the backup if you want to preserve them.
- The new page is added to mobile navigation and the offline app shell. Previously opened Quran surahs can be available offline from the existing browser cache; loading a surah for the first time still requires internet.
- `npm test` includes regression checks for the new page, local storage, navigation, and offline shell.


## Annual Hijri-Gregorian and Ramadan calendar (v0.9.0)

- The Islamic tools page now renders all 12 Gregorian months with each day's approximate Hijri date, a year selector, and a highlight for today.
- Users can choose among all 64 districts of Bangladesh. District coordinates are resolved using the Open-Meteo Geocoding API filtered to Bangladesh; users can still search for a specific city/upazila or use device location.
- The Ramadan table can be selected by Hijri year. Sehri-end and iftar are calculated from Fajr and Maghrib timings returned by AlAdhan for the selected location, using the selected calculation method (Karachi by default).
- **Accuracy note:** these are calculation-based estimates, not a reproduction of the Islamic Foundation's official district timetable. Bangladesh's moon-sighting announcement and the local mosque/Islamic Foundation timetable take precedence; users should verify the times locally.
- The district selector, annual calendar, and Ramadan year selection are included in the static PWA shell; service worker cache version is sakinah-shell-v9.
- Run npm test with Node.js 18 or later to check page links, district options, calendar selectors, and cache version.
