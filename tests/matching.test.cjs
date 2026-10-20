const test = require("node:test");
const assert = require("node:assert/strict");
const matcher = require("../matching.js");

const duas = [
  { id: "2-201", keywords: ["কল্যাণ", "ভবিষ্যৎ"] },
  { id: "20-25", keywords: ["দুশ্চিন্তা", "পরীক্ষা", "কঠিন কাজ"] },
  { id: "21-87", keywords: ["বিপদ", "ক্ষমা", "কষ্ট"] },
  { id: "7-23", keywords: ["ক্ষমা", "গুনাহ", "তওবা"] },
  { id: "20-114", keywords: ["জ্ঞান", "পড়াশোনা", "শিক্ষা"] },
  { id: "3-173", keywords: ["ভয়", "ভরসা", "দুশ্চিন্তা"] },
  { id: "3-8", keywords: ["অন্তর", "শান্তি", "হিদায়াত"] },
  { id: "18-10", keywords: ["ভবিষ্যৎ", "সিদ্ধান্ত", "সাহায্য"] },
  { id: "21-83", keywords: ["কষ্ট", "অসুস্থ", "দুঃখ"] },
  { id: "2-286", keywords: ["ক্ষমা", "ভুল"] },
  { id: "2-250", keywords: ["ধৈর্য", "পরীক্ষা"] },
  { id: "14-40", keywords: ["পরিবার", "নামাজ"] }
];

test("normalizes Bengali text and punctuation", () => {
  assert.equal(matcher.normalize("  দুশ্চিন্তায়!  "), "দুশ্চিন্তায়");
});

test("matches study/exam intent and ranks a relevant dua first", () => {
  const results = matcher.matchDuas("পরীক্ষার জন্য খুব চিন্তিত", duas);
  assert.ok(results.some(result => result.dua.id === "20-114"));
  assert.ok(results.some(result => result.dua.id === "20-25"));
  assert.ok(results.every(result => result.score > 0));
});

test("matches forgiveness intent", () => {
  const results = matcher.matchDuas("আমি গুনাহ করেছি, ক্ষমা চাই", duas);
  assert.equal(results[0].dua.id, "7-23");
});

test("matches Bengali inflections for anxiety", () => {
  const results = matcher.matchDuas("ভবিষ্যৎ নিয়ে দুশ্চিন্তায় আছি", duas);
  assert.ok(results.some(result => result.dua.id === "20-25" && result.score > 0));
});

test("unmatched text returns clearly unranked fallback suggestions", () => {
  const results = matcher.matchDuas("আজ দুপুরে ভাত রান্না করেছি", duas);
  assert.ok(results.length > 0);
  assert.ok(results.every(result => result.score === 0));
});

test("empty input does not return unrelated suggestions", () => {
  assert.deepEqual(matcher.matchDuas("   ", duas), []);
});
