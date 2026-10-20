/* Pure helpers for Sakinah's daily dua and content-review UI. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SakinahFeatures = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const REVIEW = Object.freeze({
    status: "source-linked-review-needed",
    label: "সূত্রযুক্ত · বাংলা অর্থ ও উচ্চারণ পর্যালোচনাধীন",
    note: "এই এন্ট্রির কুরআনিক সূত্রের লিংক দেওয়া আছে। বাংলা অর্থ ও উচ্চারণ বিশেষজ্ঞ দিয়ে স্বাধীনভাবে যাচাই না হওয়া পর্যন্ত এটিকে সম্পূর্ণ যাচাইকৃত বলা হচ্ছে না।"
  });

  function selectDailyDua(dateKey, duas) {
    if (!Array.isArray(duas) || duas.length === 0) return null;
    const match = String(dateKey || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) throw new TypeError("dateKey must use YYYY-MM-DD");
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new TypeError("dateKey must be a valid calendar date");
    }
    const dayNumber = Math.floor(date.getTime() / 86400000);
    return duas[((dayNumber % duas.length) + duas.length) % duas.length];
  }

  function selectDailyDuas(dateKey, duas, count = 2) {
    if (!Array.isArray(duas) || duas.length === 0) return [];
    if (!Number.isInteger(count) || count < 1 || count > 2) throw new TypeError("count must be 1 or 2");
    const first = selectDailyDua(dateKey, duas);
    if (!first) return [];
    if (count === 1 || duas.length === 1) return [first];
    const index = duas.indexOf(first);
    return [first, duas[(index + 1) % duas.length]];
  }

  function buildShareText(dua) {
    if (!dua) throw new TypeError("A dua record is required");
    return [
      dua.arabic || "",
      dua.transliteration ? "উচ্চারণ: " + dua.transliteration : "",
      dua.meaning ? "অর্থ: " + dua.meaning : "",
      dua.reference ? "সূত্র: " + dua.reference : "",
      "সাকীনা · কুরআনের দোয়ায় প্রশান্তি"
    ].filter(Boolean).join("\n\n");
  }

  function sourceUrl(dua) {
    if (!dua || !/^\d+-\d+$/.test(String(dua.id || ""))) return null;
    const parts = dua.id.split("-");
    return "https://quran.com/" + parts[0] + "/" + parts[1];
  }

  return { REVIEW, selectDailyDua, selectDailyDuas, buildShareText, sourceUrl };
});
