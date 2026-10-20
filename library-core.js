/* Pure helpers for Quran-library filtering and browser-local dua collections. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SakinahLibrary = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const STOP_WORDS = new Set(["ও", "এবং", "বা", "এর", "জন্য", "আমার", "একটি", "দোয়া", "দোয়া", "কুরআনের", "the", "and", "or", "for", "my", "a", "an"]);

  function latinDigits(value) {
    const digits = "০১২৩৪৫৬৭৮৯";
    return String(value == null ? "" : value).replace(/[০-৯]/g, digit => String(digits.indexOf(digit)));
  }

  function normalize(value) {
    return latinDigits(value).toLocaleLowerCase("bn")
      .normalize("NFKC")
      .replace(/[.,!?;:।\u061f()[\]{}"'“”‘’]/g, " ")
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseReference(dua) {
    if (!dua || !/^\d+-\d+$/.test(String(dua.id || ""))) return null;
    const [surah, idAyah] = dua.id.split("-").map(Number);
    const ref = normalize(dua.reference || "");
    const match = ref.match(/(\d+)\s*:\s*(\d+)(?:\s*-\s*(\d+))?/);
    const startAyah = match ? Number(match[2]) : idAyah;
    const endAyah = match && match[3] ? Number(match[3]) : startAyah;
    return { surah, startAyah, endAyah: Math.max(startAyah, endAyah) };
  }

  function filterDuas(duas, filters = {}) {
    if (!Array.isArray(duas)) return [];
    const query = normalize(filters.query || "");
    const terms = query.split(" ").filter(term => term && !STOP_WORDS.has(term));
    const surah = filters.surah === "" || filters.surah == null ? null : Number(latinDigits(filters.surah));
    const ayah = filters.ayah === "" || filters.ayah == null ? null : Number(latinDigits(filters.ayah));
    const category = filters.category && filters.category !== "all" ? String(filters.category) : null;

    if ((surah !== null && (!Number.isInteger(surah) || surah < 1 || surah > 114)) ||
        (ayah !== null && (!Number.isInteger(ayah) || ayah < 1 || ayah > 286))) return [];

    return duas.filter(dua => {
      if (category && dua.category !== category) return false;
      const reference = parseReference(dua);
      if (!reference) return false;
      if (surah !== null && reference.surah !== surah) return false;
      if (ayah !== null && (ayah < reference.startAyah || ayah > reference.endAyah)) return false;

      if (terms.length) {
        const haystack = normalize([
          dua.id, dua.arabic, dua.transliteration, dua.meaning, dua.reference,
          dua.categoryLabel, ...(Array.isArray(dua.keywords) ? dua.keywords : [])
        ].join(" "));
        if (!terms.every(term => haystack.includes(term))) return false;
      }
      return true;
    });
  }

  function sanitizeCollections(input, validDuaIds) {
    if (!Array.isArray(input)) return [];
    const valid = validDuaIds instanceof Set ? validDuaIds : new Set(validDuaIds || []);
    const seen = new Set();
    return input.filter(item => item && typeof item === "object")
      .map(item => ({
        id: String(item.id || "").slice(0, 80),
        name: String(item.name || "").trim().slice(0, 40),
        duaIds: Array.isArray(item.duaIds) ? item.duaIds.map(String).filter(id => valid.has(id)) : []
      }))
      .filter(item => {
        if (!item.id || !item.name || seen.has(item.id)) return false;
        seen.add(item.id);
        item.duaIds = [...new Set(item.duaIds)];
        return true;
      });
  }

  function addDuaToCollection(collections, collectionId, duaId) {
    return (Array.isArray(collections) ? collections : []).map(collection => {
      if (collection.id !== collectionId) return collection;
      return { ...collection, duaIds: [...new Set([...(collection.duaIds || []), String(duaId)])] };
    });
  }

  function removeDuaFromCollection(collections, collectionId, duaId) {
    return (Array.isArray(collections) ? collections : []).map(collection =>
      collection.id === collectionId
        ? { ...collection, duaIds: (collection.duaIds || []).filter(id => id !== String(duaId)) }
        : collection
    );
  }

  return { latinDigits, normalize, parseReference, filterDuas, sanitizeCollections, addDuaToCollection, removeDuaFromCollection };
});
