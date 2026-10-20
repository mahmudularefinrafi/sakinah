/* Installed-mobile navigation for Sakinah. The regular website navigation is untouched. */
(function () {
  "use strict";
  const standalone = () => (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  const mobile = () => window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
  let nav = null, sheet = null, backdrop = null, menuButton = null;
  function closeMenu() { if (!sheet || !menuButton) return; sheet.hidden = true; if (backdrop) backdrop.hidden = true; menuButton.setAttribute("aria-expanded", "false"); }
  function openMenu() { if (!sheet || !menuButton) return; sheet.hidden = false; if (backdrop) backdrop.hidden = false; menuButton.setAttribute("aria-expanded", "true"); sheet.querySelector("[data-pwa-menu-close]")?.focus(); }
  function showNotice(message) { const notice = document.getElementById("pwaMobileNotice"); if (!notice) return; notice.textContent = message; notice.hidden = false; }
  function mount() {
    if (!standalone() || !mobile() || document.body.classList.contains("pwa-mobile-app")) return;
    document.body.classList.add("pwa-mobile-app");
    nav = document.createElement("nav"); nav.className = "pwa-bottom-nav"; nav.setAttribute("aria-label", "অ্যাপ নেভিগেশন");
    const page = document.body.dataset.page || "";
    nav.innerHTML =
      '<a class="pwa-nav-item' + (page === "home" ? " is-active" : "") + '" href="index.html" aria-label="হোম"><span class="pwa-nav-icon" aria-hidden="true">⌂</span><span>হোম</span></a>' +
      '<a class="pwa-nav-item' + (page === "daily-duas" ? " is-active" : "") + '" href="daily-duas.html" aria-label="দৈনন্দিন দোয়া"><span class="pwa-nav-icon" aria-hidden="true">☾</span><span>দোয়া</span></a>' +
      '<a class="pwa-nav-item' + (page === "library" ? " is-active" : "") + '" href="index.html#saved" aria-label="সংরক্ষিত দোয়া"><span class="pwa-nav-icon" aria-hidden="true">♡</span><span>সংরক্ষিত</span></a>' +
      '<button class="pwa-nav-item" type="button" data-pwa-menu-toggle aria-expanded="false" aria-controls="pwaAppMenu"><span class="pwa-nav-icon" aria-hidden="true">☰</span><span>মেনু</span></button>';
    document.body.append(nav);
    backdrop = document.createElement("button"); backdrop.type = "button"; backdrop.className = "pwa-menu-backdrop"; backdrop.hidden = true; backdrop.setAttribute("aria-label", "মেনু বন্ধ করুন"); backdrop.addEventListener("click", closeMenu); document.body.append(backdrop);
    sheet = document.createElement("section"); sheet.id = "pwaAppMenu"; sheet.className = "pwa-app-menu"; sheet.hidden = true; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-labelledby", "pwaMenuTitle");
    sheet.innerHTML =
      '<div class="pwa-menu-grab" aria-hidden="true"></div><div class="pwa-menu-heading"><div><span class="section-kicker">সাকীনা অ্যাপ</span><h2 id="pwaMenuTitle">আপনার মেনু</h2></div><button class="icon-button" type="button" data-pwa-menu-close aria-label="মেনু বন্ধ করুন">×</button></div>' +
      '<div class="pwa-menu-links">' +
      '<a href="library.html#collections"><span aria-hidden="true">▤</span><span><strong>আমার দোয়ার তালিকা</strong><small>নিজের পছন্দের দোয়া সাজিয়ে রাখুন</small></span><b aria-hidden="true">›</b></a>' +
      '<a href="special-surahs.html"><span aria-hidden="true">۞</span><span><strong>কুরআন ও সূরা</strong><small>সূরা পড়ুন ও অর্থ দেখুন</small></span><b aria-hidden="true">›</b></a>' +
      '<a href="amal.html"><span aria-hidden="true">◉</span><span><strong>তাসবিহ ও আমল</strong><small>ব্যক্তিগত আমল ট্র্যাকার</small></span><b aria-hidden="true">›</b></a>' +
      '<a href="islamic-tools.html"><span aria-hidden="true">◷</span><span><strong>নামাজ ও ইসলামিক টুলস</strong><small>নামাজ, কিবলা ও হিজরি ক্যালেন্ডার</small></span><b aria-hidden="true">›</b></a>' +
      '<a href="daily-duas.html"><span aria-hidden="true">☾</span><span><strong>দৈনন্দিন দোয়া</strong><small>বিষয় ও ক্রমানুসারে দোয়া</small></span><b aria-hidden="true">›</b></a></div>' +
      '<div class="pwa-menu-settings"><h3>সেটিংস</h3><button type="button" data-pwa-theme><span aria-hidden="true">◐</span><span><strong>থিম পরিবর্তন</strong><small>লাইট / ডার্ক মোড</small></span><b aria-hidden="true">›</b></button>' +
      '<div class="pwa-offline-info"><span aria-hidden="true">◉</span><span><strong>ব্যক্তিগত ও অফলাইন ব্যবহার</strong><small>সংরক্ষিত দোয়া এই ডিভাইসে থাকে। আগে লোড হওয়া পেজ অফলাইনে খোলা যেতে পারে; আলাদা আয়াত/হাদিস ডাউনলোড এখনো সমর্থিত নয়।</small></span></div></div><p class="pwa-menu-footnote">আপনার ব্যক্তিগত তালিকা এই ডিভাইসের ব্রাউজার স্টোরেজে সংরক্ষিত থাকে।</p>';
    document.body.append(sheet); menuButton = nav.querySelector("[data-pwa-menu-toggle]");
    menuButton.addEventListener("click", () => sheet.hidden ? openMenu() : closeMenu());
    sheet.querySelector("[data-pwa-menu-close]").addEventListener("click", closeMenu);
    sheet.querySelectorAll(".pwa-menu-links a").forEach(link => link.addEventListener("click", closeMenu));
    sheet.querySelector("[data-pwa-theme]").addEventListener("click", () => { document.getElementById("themeToggle")?.click(); showNotice(document.documentElement.dataset.theme === "dark" ? "ডার্ক মোড চালু হয়েছে।" : "লাইট মোড চালু হয়েছে।"); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && sheet && !sheet.hidden) { closeMenu(); menuButton.focus(); } });
    const notice = document.createElement("p"); notice.id = "pwaMobileNotice"; notice.className = "pwa-mobile-notice"; notice.hidden = true; notice.setAttribute("role", "status"); notice.setAttribute("aria-live", "polite"); document.body.append(notice);
    if (location.hash === "#saved") document.getElementById("savedToggle")?.click();
  }
  function sync() {
    if (standalone() && mobile()) mount();
    else if (document.body.classList.contains("pwa-mobile-app")) { document.body.classList.remove("pwa-mobile-app"); [nav, sheet, backdrop, document.getElementById("pwaMobileNotice")].forEach(el => el && el.remove()); nav = sheet = backdrop = menuButton = null; }
  }
  sync(); window.addEventListener("resize", sync); window.addEventListener("orientationchange", sync);
})();