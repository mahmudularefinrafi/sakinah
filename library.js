/* Quran Library, browser-local personal collections, and safe DOM enhancements. */
(function () {
  "use strict";
  const core = window.SakinahLibrary;
  if (!core || typeof DUAS === "undefined") return;

  const duas = DUAS;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const COLLECTIONS_KEY = "sakinah-collections-v1";
  let selectedDuaId = null;

  function toastMessage(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastMessage.timer);
    toastMessage.timer = window.setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function getCollections() {
    try {
      const stored = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || "[]");
      return core.sanitizeCollections(stored, new Set(duas.map(dua => dua.id)));
    } catch {
      return [];
    }
  }

  function saveCollections(collections) {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(
        core.sanitizeCollections(collections, new Set(duas.map(dua => dua.id)))
      ));
      return true;
    } catch {
      toastMessage("ব্রাউজারে সংরক্ষণ করা যায়নি। স্টোরেজ সেটিংস পরীক্ষা করুন।");
      return false;
    }
  }

  function newCollectionId() {
    return "collection-" + (window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
  }

  function createCollection(name) {
    const cleanName = String(name || "").trim().replace(/\s+/g, " ").slice(0, 40);
    if (!cleanName) return { ok: false, reason: "empty" };
    const collections = getCollections();
    if (collections.some(item => core.normalize(item.name) === core.normalize(cleanName))) {
      return { ok: false, reason: "duplicate" };
    }
    const next = [...collections, { id: newCollectionId(), name: cleanName, duaIds: [] }];
    if (!saveCollections(next)) return { ok: false, reason: "storage" };
    renderCollections();
    return { ok: true, collection: next[next.length - 1] };
  }

  function renderCollections() {
    const host = $("#collectionGrid");
    if (!host) return;
    const collections = getCollections();
    if (!collections.length) {
      host.innerHTML = '<div class="library-empty">এখনো কোনো ব্যক্তিগত তালিকা তৈরি হয়নি। উপরে একটি নাম লিখে তালিকা তৈরি করুন।</div>';
      return;
    }
    host.innerHTML = collections.map(collection => {
      const items = collection.duaIds.map(id => duas.find(dua => dua.id === id)).filter(Boolean);
      const list = items.length ? '<ul class="collection-items">' + items.map(dua =>
        '<li class="collection-item"><div><span class="collection-item-title">' + escapeHTML(dua.categoryLabel) +
        '</span><span class="collection-item-ref">' + escapeHTML(dua.reference) +
        '</span></div><button class="collection-remove-dua" type="button" data-collection-remove-dua="' +
        escapeHTML(collection.id) + '" data-dua-id="' + escapeHTML(dua.id) + '" aria-label="এই দোয়াটি তালিকা থেকে সরান">সরান</button></li>'
      ).join("") + "</ul>" : '<p class="collection-empty">এই তালিকায় এখনো কোনো দোয়া নেই। যেকোনো দোয়ার “তালিকায় রাখুন” বাটন ব্যবহার করুন।</p>';
      return '<article class="collection-card"><div class="collection-card-head"><div><h3>' +
        escapeHTML(collection.name) + '</h3><span class="collection-card-count">' + items.length +
        'টি দোয়া</span></div><button class="collection-delete" type="button" data-collection-delete="' +
        escapeHTML(collection.id) + '">তালিকা মুছুন</button></div>' + list + '</article>';
    }).join("");
  }

  function selectedCategory() {
    const active = $(".category-pill.active");
    return active ? active.dataset.category || "all" : "all";
  }

  function applyLibraryFilters() {
    const grid = $("#libraryGrid");
    if (!grid) return;
    const query = $("#libraryQuery") ? $("#libraryQuery").value : "";
    const surah = $("#surahFilter") ? $("#surahFilter").value : "";
    const ayah = $("#ayahFilter") ? $("#ayahFilter").value : "";
    const matches = core.filterDuas(duas, { query, surah, ayah, category: selectedCategory() });
    const ids = new Set(matches.map(dua => dua.id));
    let visible = 0;
    $$(".dua-card", grid).forEach(card => {
      const idButton = card.querySelector("[data-save], [data-copy], [data-share]");
      const id = idButton && (idButton.dataset.save || idButton.dataset.copy || idButton.dataset.share);
      const show = !!id && ids.has(id);
      card.hidden = !show;
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    let empty = $("#libraryEmpty");
    if (!empty) {
      empty = document.createElement("p");
      empty.id = "libraryEmpty";
      empty.className = "library-empty";
      empty.setAttribute("role", "status");
      grid.insertAdjacentElement("afterend", empty);
    }
    empty.hidden = visible > 0;
    empty.textContent = "এই ফিল্টারে কোনো দোয়া পাওয়া যায়নি। বানান, সূরা/আয়াত নম্বর বা বিষয় পরিবর্তন করে দেখুন।";
    const count = $("#libraryResultCount");
    if (count) count.textContent = "এই সংগ্রহে " + visible + "টি ফলাফল দেখানো হচ্ছে। এখানে বর্তমানে বাছাই করা কিছু কুরআনিক দোয়া রয়েছে, পূর্ণাঙ্গ কুরআন অনুসন্ধান নয়।";
  }

  function enhanceDuaCards(scope = document) {
    const cards = [];
    if (scope && scope.nodeType === 1 && scope.matches && scope.matches(".dua-card")) cards.push(scope);
    cards.push(...$(".dua-card", scope || document));
    [...new Set(cards)].forEach(card => {
      const actions = card.querySelector(".card-actions");
      const idButton = card.querySelector("[data-save], [data-copy], [data-share]");
      const id = idButton && (idButton.dataset.save || idButton.dataset.copy || idButton.dataset.share);
      if (!actions || !id || actions.querySelector("[data-add-collection]")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "small-button collection-add-button";
      button.dataset.addCollection = id;
      button.textContent = "তালিকায় রাখুন";
      button.setAttribute("aria-label", "এই দোয়াটি ব্যক্তিগত তালিকায় রাখুন");
      actions.append(button);
    });
  }

  function refreshPicker() {
    const select = $("#collectionSelect");
    const note = $("#collectionPickerNote");
    if (!select) return;
    const collections = getCollections();
    select.innerHTML = collections.map(collection =>
      '<option value="' + escapeHTML(collection.id) + '">' + escapeHTML(collection.name) + '</option>'
    ).join("");
    select.disabled = collections.length === 0;
    $("#addToCollection").disabled = collections.length === 0;
    if (note) note.textContent = collections.length
      ? "তালিকা বেছে নিয়ে দোয়াটি যোগ করুন। এই তথ্য শুধু এই ব্রাউজারেই থাকবে।"
      : "আগে নিচে একটি তালিকা তৈরি করুন, তারপর দোয়াটি যোগ করতে পারবেন।";
  }

  function openCollectionPicker(duaId) {
    selectedDuaId = duaId;
    refreshPicker();
    const dialog = $("#collectionPicker");
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    else toastMessage("তালিকা যোগ করার ডায়ালগ এই ব্রাউজারে সমর্থিত নয়।");
  }

  function addSelectedDua() {
    const select = $("#collectionSelect");
    const collectionId = select && select.value;
    if (!selectedDuaId || !collectionId) {
      toastMessage("আগে একটি ব্যক্তিগত তালিকা তৈরি করুন।");
      return;
    }
    const collections = core.addDuaToCollection(getCollections(), collectionId, selectedDuaId);
    if (saveCollections(collections)) {
      renderCollections();
      $("#collectionPicker").close();
      toastMessage("দোয়াটি ব্যক্তিগত তালিকায় যোগ হয়েছে।");
    }
  }

  const originalRenderLibrary = window.renderLibrary;
  if (typeof originalRenderLibrary === "function") {
    window.renderLibrary = function () {
      originalRenderLibrary();
      applyLibraryFilters();
      enhanceDuaCards($("#libraryGrid") || document);
    };
  }

  ["libraryQuery", "surahFilter", "ayahFilter"].forEach(id => {
    const input = $("#" + id);
    if (input) input.addEventListener("input", applyLibraryFilters);
  });

  const clearFilters = $("#clearLibraryFilters");
  if (clearFilters) clearFilters.addEventListener("click", () => {
    ["libraryQuery", "surahFilter", "ayahFilter"].forEach(id => {
      const input = $("#" + id);
      if (input) input.value = "";
    });
    applyLibraryFilters();
    $("#libraryQuery")?.focus();
  });

  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-collection]");
    if (addButton) {
      event.preventDefault();
      openCollectionPicker(addButton.dataset.addCollection);
      return;
    }

    if (event.target.closest("[data-category]")) {
      queueMicrotask(applyLibraryFilters);
      return;
    }

    const removeDua = event.target.closest("[data-collection-remove-dua]");
    if (removeDua) {
      const next = core.removeDuaFromCollection(getCollections(), removeDua.dataset.collectionRemoveDua, removeDua.dataset.duaId);
      if (saveCollections(next)) {
        renderCollections();
        toastMessage("দোয়াটি তালিকা থেকে সরানো হয়েছে।");
      }
      return;
    }

    const deleteButton = event.target.closest("[data-collection-delete]");
    if (deleteButton) {
      const next = getCollections().filter(item => item.id !== deleteButton.dataset.collectionDelete);
      if (saveCollections(next)) {
        renderCollections();
        toastMessage("ব্যক্তিগত তালিকাটি মুছে ফেলা হয়েছে।");
      }
    }
  });

  const createForm = $("#createCollectionForm");
  if (createForm) createForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#collectionName");
    const result = createCollection(input ? input.value : "");
    if (!result.ok) {
      toastMessage(result.reason === "duplicate" ? "এই নামে একটি তালিকা আগে থেকেই আছে।" : "তালিকার একটি নাম লিখুন।");
      return;
    }
    if (input) input.value = "";
    refreshPicker();
    toastMessage("নতুন ব্যক্তিগত তালিকা তৈরি হয়েছে।");
  });

  const pickerForm = $("#collectionPickerForm");
  if (pickerForm) pickerForm.addEventListener("submit", event => {
    event.preventDefault();
    addSelectedDua();
  });
  const quickCreateForm = $("#quickCollectionForm");
  if (quickCreateForm) quickCreateForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#quickCollectionName");
    const result = createCollection(input ? input.value : "");
    if (!result.ok) {
      toastMessage(result.reason === "duplicate" ? "এই নামে একটি তালিকা আগে থেকেই আছে।" : "তালিকার একটি নাম লিখুন।");
      return;
    }
    if (input) input.value = "";
    selectedDuaId && core.addDuaToCollection(getCollections(), result.collection.id, selectedDuaId);
    if (selectedDuaId) saveCollections(core.addDuaToCollection(getCollections(), result.collection.id, selectedDuaId));
    renderCollections();
    refreshPicker();
    $("#collectionPicker").close();
    toastMessage("তালিকা তৈরি করে দোয়াটি যোগ করা হয়েছে।");
  });

  const closePicker = $("#closeCollectionPicker");
  if (closePicker) closePicker.addEventListener("click", () => $("#collectionPicker").close());
  const pickerDialog = $("#collectionPicker");
  if (pickerDialog) pickerDialog.addEventListener("click", event => {
    if (event.target === pickerDialog) pickerDialog.close();
  });

  const installCollectionsLink = $("#collectionsNavLink");
  if (installCollectionsLink) installCollectionsLink.addEventListener("click", () => {
    window.setTimeout(() => $("#collectionName")?.focus(), 250);
  });

  enhanceDuaCards();
  renderCollections();
  refreshPicker();
  applyLibraryFilters();
  const observer = new MutationObserver(records => {
    let shouldFilter = false;
    for (const record of records) {
      if (record.type === "childList") {
        record.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            enhanceDuaCards(node);
            if (node.matches?.("#libraryGrid") || node.querySelector?.("#libraryGrid")) shouldFilter = true;
          }
        });
      }
    }
    if (shouldFilter) applyLibraryFilters();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
