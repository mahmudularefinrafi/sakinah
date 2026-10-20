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
