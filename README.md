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
