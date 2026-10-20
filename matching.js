(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SakinahMatching = api;

  // This file loads after app.js, so the existing UI can use the stronger
  // deterministic matcher without changing the app's event wiring.
  if (root && root.document) {
    root.matchDuas = function (query) {
      return api.matchDuas(query, DUAS);
    };
    root.card = function (d, matched = false, why = "") {
      const saved = getSaved().includes(d.id);
      const [surah, ayah] = d.id.split("-");
      const kind = d.id === "3-173" ? "প্রাসঙ্গিক আয়াত" : "কুরআনিক দোয়া";
      const sourceUrl = "https://quran.com/" + encodeURIComponent(surah) + "/" + encodeURIComponent(ayah);
      return '<article class="dua-card">' +
        '<div class="card-top"><span class="category-label">' + esc(d.categoryLabel) +
        '</span><span class="content-kind">' + kind + '</span>' +
        '<button class="save-button ' + (saved ? "saved" : "") + '" data-save="' + esc(d.id) +
        '" type="button" aria-label="' + (saved ? "সংরক্ষিত দোয়া থেকে সরান" : "দোয়া সংরক্ষণ করুন") + '">' +
        (saved ? "♥" : "♡") + '</button></div>' +
        '<div class="arabic" lang="ar" dir="rtl">' + d.arabic + '</div>' +
        '<p class="transliteration"><strong>উচ্চারণ:</strong> ' + esc(d.transliteration) + '</p>' +
        '<p class="meaning"><strong>অর্থ:</strong> ' + esc(d.meaning) + '</p>' +
        '<div class="reference">' + esc(d.reference) + '</div>' +
        '<a class="source-link" href="' + sourceUrl + '" target="_blank" rel="noopener noreferrer">কুরআনের সূত্র দেখুন ↗</a>' +
        (matched ? '<p class="why-match">' + esc(why) + '</p>' : '') +
        '<div class="card-actions"><button class="small-button" type="button" data-copy="' + esc(d.id) +
        '">কপি করুন</button><button class="small-button" type="button" data-share="' + esc(d.id) +
        '">শেয়ার করুন</button></div></article>';
    };
  }
  if (root && root.document && typeof root.renderLibrary === "function") root.renderLibrary();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const INTENTS = [
    { label: "দুশ্চিন্তা ও উদ্বেগ", weight: 8, phrases: [
      "দুশ্চিন্তা", "দুশ্চিন্তায়", "দুশ্চিন্তায়", "চিন্তিত", "চিন্তা হচ্ছে", "উদ্বেগ", "উদ্বিগ্ন",
      "টেনশন", "অস্থির", "ভয়", "ভয়", "ভীত", "anxiety", "anxious", "worry", "worried", "stress", "stressed"
    ], ids: ["20-25", "3-173", "3-8", "18-10"] },
    { label: "মন খারাপ ও দুঃখ", weight: 8, phrases: [
      "মন খারাপ", "মনটা খারাপ", "মন খুব খারাপ", "মনটা খুব খারাপ", "মন ভালো নেই", "মন ভালো লাগছে না", "খুব খারাপ লাগছে", "খারাপ লাগছে", "দুঃখ", "দুঃখিত", "কষ্ট পাচ্ছি", "কষ্ট হচ্ছে",
      "হতাশ", "হতাশা", "একাকী", "একা লাগছে", "sad", "sadness", "lonely", "loneliness", "feeling down"
    ], ids: ["21-83", "21-87", "3-8", "2-201"] },
    { label: "ক্ষমা ও তওবা", weight: 9, phrases: [
      "ক্ষমা", "ক্ষমা চাই", "ক্ষমা প্রার্থনা", "গুনাহ", "গুনাহ করেছি", "পাপ", "ভুল করেছি", "তওবা",
      "অনুতপ্ত", "অনুশোচনা", "forgive", "forgiveness", "sin", "repent", "repentance"
    ], ids: ["7-23", "2-286", "21-87"] },
    { label: "পড়াশোনা ও জ্ঞান", weight: 9, phrases: [
      "পড়াশোনা", "পড়াশোনা", "পড়াশোনায়", "পড়াশোনায়", "পড়তে", "পড়তে", "পরীক্ষা", "পরীক্ষার", "পরীক্ষায়", "পরীক্ষায়",
      "স্টাডি", "পড়ালেখা", "পড়ালেখা", "শেখা", "জ্ঞান", "শিক্ষা", "মেধা", "study", "studying", "exam", "exams", "learning"
    ], ids: ["20-114", "20-25", "2-250"] },
    { label: "ধৈর্য ও দৃঢ়তা", weight: 8, phrases: [
      "ধৈর্য", "সবর", "হাল ছেড়ে", "হাল ছেড়ে", "ভেঙে পড়েছি", "ভেঙে পড়েছি", "দৃঢ়", "দৃঢ়",
      "সংগ্রাম", "সহ্য করতে", "patience", "persevere", "give up", "giving up"
    ], ids: ["2-250", "21-87", "18-10"] },
    { label: "বিপদ ও সাহায্য", weight: 8, phrases: [
      "বিপদ", "বিপদে", "বিপদে পড়েছি", "বিপদে পড়েছি", "সমস্যা", "সমস্যায়", "সমস্যায়", "অসহায়", "অসহায়", "সাহায্য চাই", "উদ্ধার", "মুশকিল", "কঠিন সময়", "কঠিন সময়",
      "trouble", "help me", "hardship", "difficulty", "crisis"
    ], ids: ["21-87", "21-83", "18-10", "3-173"] },
    { label: "ভবিষ্যৎ ও সিদ্ধান্ত", weight: 7, phrases: [
      "ভবিষ্যৎ", "ভবিষ্যত", "সিদ্ধান্ত", "কোন পথে", "দিকনির্দেশনা", "অনিশ্চয়তা", "অনিশ্চয়তা",
      "কী করব", "কি করব", "future", "decision", "uncertain", "guidance"
    ], ids: ["18-10", "2-201", "20-25", "3-8"] },
    { label: "সফলতা ও কাজ সহজ হওয়া", weight: 7, phrases: [
      "সফলতা", "সফল হতে", "কাজ সহজ", "কাজটা সহজ", "ইন্টারভিউ", "চাকরি", "ক্যারিয়ার", "ক্যারিয়ার",
      "success", "succeed", "job interview", "make it easy"
    ], ids: ["20-25", "2-201", "2-250"] },
    { label: "অসুস্থতা ও কষ্ট", weight: 7, phrases: [
      "অসুস্থ", "অসুস্থতা", "শরীর খারাপ", "রোগ", "ব্যথা", "আরোগ্য", "sick", "illness", "pain", "healing"
    ], ids: ["21-83", "21-87"] },
    { label: "পরিবার ও ইবাদত", weight: 7, phrases: [
      "পরিবার", "সন্তান", "মা বাবা", "মা-বাবা", "নামাজ", "সালাত", "ইবাদত", "দ্বীন",
      "family", "children", "prayer", "worship"
    ], ids: ["14-40", "2-201", "3-8"] },
    { label: "কৃতজ্ঞতা ও কল্যাণ", weight: 6, phrases: [
      "কৃতজ্ঞ", "শুকরিয়া", "শুকরিয়া", "আলহামদুলিল্লাহ", "কল্যাণ", "বরকত", "সুখ", "ভালো চাই",
      "gratitude", "grateful", "blessing", "blessings", "wellbeing"
    ], ids: ["2-201", "14-40"] }
  ];

  const GENERIC_KEYWORDS = new Set([
    "মন", "দোয়া", "দোয়া", "আল্লাহ", "জীবন", "কষ্ট", "সাহায্য", "ভালো", "চাই", "দুনিয়া", "দুনিয়া",
    "peace", "help", "good", "dua", "quran", "allah"
  ]);

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("bn")
      .replace(/[.,!?;:।\u061f()[\]{}"'“”‘’]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsPhrase(query, phrase) {
    const q = normalize(query);
    const p = normalize(phrase);
    if (!q || !p) return false;
    return (" " + q + " ").includes(" " + p + " ");
  }

  function matchDuas(query, duas) {
    const q = normalize(query);
    if (!q) return [];

    const scores = new Map();
    const reasons = new Map();
    const addScore = (id, points, label) => {
      scores.set(id, (scores.get(id) || 0) + points);
      if (label) {
        const list = reasons.get(id) || [];
        if (!list.includes(label)) list.push(label);
        reasons.set(id, list);
      }
    };

    for (const intent of INTENTS) {
      const hits = intent.phrases.filter(phrase => containsPhrase(q, phrase));
      if (!hits.length) continue;
      intent.ids.forEach((id, index) => {
        addScore(id, intent.weight + Math.max(0, 3 - index) * 0.35 + Math.min(hits.length - 1, 2) * 0.25, intent.label);
      });
    }

    for (const dua of duas) {
      const matchedKeywords = (dua.keywords || []).filter(keyword => {
        const key = normalize(keyword);
        return key.length >= 3 && !GENERIC_KEYWORDS.has(key) && containsPhrase(q, key);
      });
      if (matchedKeywords.length) addScore(dua.id, Math.min(matchedKeywords.length, 2) * 1.5, null);
    }

    const byId = new Map(duas.map(dua => [dua.id, dua]));
    const ranked = [...scores.entries()]
      .filter(([, score]) => score >= 3)
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({ dua: byId.get(id), score, reason: (reasons.get(id) || []).join(" ও ") }))
      .filter(item => item.dua)
      .slice(0, 5);

    if (ranked.length) return ranked;

    // Keep fallback suggestions visibly unranked (score 0); the UI already labels
    // these as general suggestions rather than a confirmed emotional match.
    return ["2-201", "20-25", "18-10"]
      .map(id => byId.get(id))
      .filter(Boolean)
      .map(dua => ({ dua, score: 0, reason: "সাধারণ পরামর্শ, সরাসরি মিল নিশ্চিত নয়।" }));
  }

  return { normalize, containsPhrase, matchDuas };
});
