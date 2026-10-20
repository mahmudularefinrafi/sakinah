const test = require("node:test");
const assert = require("node:assert/strict");
const { parseReference, filterDuas, sanitizeCollections, addDuaToCollection, removeDuaFromCollection } = require("./library-core.js");

const duas = [
  { id: "2-201", category: "peace", categoryLabel: "সামগ্রিক কল্যাণ", arabic: "رَبَّنَا آتِنَا", transliteration: "রব্বানা আতিনা", meaning: "দুনিয়া ও আখিরাতের কল্যাণ দিন", reference: "সূরা আল-বাকারা, ২:২০১", keywords: ["কল্যাণ", "সুখ"] },
  { id: "20-25", category: "peace", categoryLabel: "কঠিন কাজ ও সাহস", arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", transliteration: "রব্বিশরাহ লি সদরি", meaning: "আমার বক্ষ প্রশস্ত করে দিন", reference: "সূরা ত্বা-হা, ২০:২৫–২৬", keywords: ["দুশ্চিন্তা", "পরীক্ষা", "সহজ"] },
  { id: "20-114", category: "knowledge", categoryLabel: "জ্ঞান ও পড়াশোনা", arabic: "رَبِّ زِدْنِي عِلْمًا", transliteration: "রব্বি যিদনি ইলমা", meaning: "আমার জ্ঞান বৃদ্ধি করুন", reference: "সূরা ত্বা-হা, ২০:১১৪", keywords: ["জ্ঞান", "পড়াশোনা"] }
];

test("parses an ayah range from Bengali-number references", () => {
  assert.deepEqual(parseReference(duas[1]), { surah: 20, startAyah: 25, endAyah: 26 });
});

test("search finds Bengali topic keywords and ignores common stop words", () => {
  assert.deepEqual(filterDuas(duas, { query: "দুশ্চিন্তা ও পরীক্ষা" }).map(d => d.id), ["20-25"]);
});

test("surah filter matches the selected surah only", () => {
  assert.deepEqual(filterDuas(duas, { surah: "২০" }).map(d => d.id), ["20-25", "20-114"]);
});

test("ayah filter includes an ayah inside a displayed range", () => {
  assert.deepEqual(filterDuas(duas, { surah: "20", ayah: "26" }).map(d => d.id), ["20-25"]);
});

test("category and text filters combine", () => {
  assert.deepEqual(filterDuas(duas, { category: "knowledge", query: "জ্ঞান" }).map(d => d.id), ["20-114"]);
  assert.deepEqual(filterDuas(duas, { category: "forgiveness" }), []);
});

test("invalid surah and ayah inputs fail closed", () => {
  assert.deepEqual(filterDuas(duas, { surah: "115" }), []);
  assert.deepEqual(filterDuas(duas, { ayah: "0" }), []);
});

test("collection storage drops unknown dua IDs and duplicate entries", () => {
  const clean = sanitizeCollections([
    { id: "one", name: "আমার দোয়া", duaIds: ["2-201", "2-201", "unknown"] },
    { id: "one", name: "duplicate", duaIds: ["20-25"] },
    { id: "empty", name: " ", duaIds: [] }
  ], new Set(duas.map(d => d.id)));
  assert.deepEqual(clean, [{ id: "one", name: "আমার দোয়া", duaIds: ["2-201"] }]);
});

test("adding and removing a dua changes only the selected collection", () => {
  const initial = [{ id: "one", name: "প্রথম", duaIds: ["2-201"] }, { id: "two", name: "দ্বিতীয়", duaIds: [] }];
  const added = addDuaToCollection(initial, "two", "20-25");
  assert.deepEqual(added[1].duaIds, ["20-25"]);
  assert.deepEqual(removeDuaFromCollection(added, "one", "2-201")[0].duaIds, []);
});
