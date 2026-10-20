const test = require("node:test");
const assert = require("node:assert/strict");
const { selectDailyDua, buildShareText, sourceUrl, REVIEW } = require("./features-core.js");

const duas = [
  { id: "2-201", arabic: "رَبَّنَا آتِنَا", transliteration: "রব্বানা", meaning: "হে আমাদের রব", reference: "সূরা আল-বাকারা, ২:২০১" },
  { id: "20-114", arabic: "رَبِّ زِدْنِي عِلْمًا", transliteration: "রব্বি যিদনি ইলমা", meaning: "আমার জ্ঞান বৃদ্ধি করুন", reference: "সূরা ত্বা-হা, ২০:১১৪" },
  { id: "21-87", arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ", transliteration: "লা ইলাহা", meaning: "আপনি ছাড়া উপাস্য নেই", reference: "সূরা আল-আম্বিয়া, ২১:৮৭" }
];

test("daily dua is stable for the same date", () => {
  assert.equal(selectDailyDua("2026-10-20", duas).id, selectDailyDua("2026-10-20", duas).id);
});

test("daily dua advances to a different item on the next calendar day", () => {
  assert.notEqual(selectDailyDua("2026-10-20", duas).id, selectDailyDua("2026-10-21", duas).id);
});

test("daily dua returns null for an empty collection", () => {
  assert.equal(selectDailyDua("2026-10-20", []).id, undefined);
});

test("invalid dates are rejected", () => {
  assert.throws(() => selectDailyDua("2026-02-30", duas), /valid calendar date/);
  assert.throws(() => selectDailyDua("20-10-2026", duas), /YYYY-MM-DD/);
});

test("share text includes Arabic, meaning, and exact reference", () => {
  const text = buildShareText(duas[0]);
  assert.match(text, /رَبَّنَا آتِنَا/);
  assert.match(text, /হে আমাদের রব/);
  assert.match(text, /সূরা আল-বাকারা, ২:২০১/);
  assert.match(text, /সাকীনা/);
});

test("source links only accept surah-ayah IDs", () => {
  assert.equal(sourceUrl(duas[0]), "https://quran.com/2/201");
  assert.equal(sourceUrl({ id: "invalid" }), null);
});

test("review status does not falsely claim scholarly verification", () => {
  assert.match(REVIEW.label, /পর্যালোচনাধীন/);
  assert.match(REVIEW.note, /যাচাই না হওয়া পর্যন্ত/);
});
