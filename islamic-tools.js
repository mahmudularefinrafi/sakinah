(function () {
  "use strict";
  const DEFAULT = { name: "লাকসাম, বাংলাদেশ", lat: 23.24, lon: 91.12 };
  const KEY = "sakinah-islamic-tools-v1";
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const bn = { Fajr: "ফজর", Dhuhr: "যোহর", Asr: "আসর", Maghrib: "মাগরিব", Isha: "এশা" };
  const $ = id => document.getElementById(id);
  const state = { ...DEFAULT, method: 1, timings: null, qibla: null, hijriYear: null, reminders: [], timer: null, notified: new Set() };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch {}
  if (!Number.isFinite(Number(state.lat)) || !Number.isFinite(Number(state.lon))) Object.assign(state, DEFAULT);
  $("locationName").value = state.name || DEFAULT.name;
  $("calculationMethod").value = String(state.method || 1);

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ name: state.name, lat: state.lat, lon: state.lon, method: state.method, reminders: state.reminders })); } catch {}
  }
  function datePath(date = new Date()) {
    return String(date.getDate()).padStart(2, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + date.getFullYear();
  }
  function bengaliDate(date = new Date()) { return new Intl.DateTimeFormat("bn-BD", { dateStyle: "full" }).format(date); }
  function clock(value) {
    const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
    if (!match) return "—";
    const h24 = Number(match[1]), h = h24 % 12 || 12;
    return String(h).padStart(2, "0") + ":" + match[2] + (h24 >= 12 ? " PM" : " AM");
  }
  function apiUrl(path) {
    return "https://api.aladhan.com/v1/" + path + "?latitude=" + encodeURIComponent(state.lat) + "&longitude=" + encodeURIComponent(state.lon) + "&method=" + Number($("calculationMethod").value || state.method || 1);
  }
  async function api(path) {
    const response = await fetch(apiUrl(path), { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("API " + response.status);
    const json = await response.json();
    if (json.code !== 200 || !json.data) throw new Error("No data");
    return json.data;
  }
  function qiblaAngle(lat, lon) {
    const kLat = 21.422487 * Math.PI / 180, kLon = 39.826206 * Math.PI / 180;
    const phi = lat * Math.PI / 180, lambda = lon * Math.PI / 180;
    return (Math.atan2(Math.sin(kLon - lambda), Math.cos(phi) * Math.tan(kLat) - Math.sin(phi) * Math.cos(kLon - lambda)) * 180 / Math.PI + 360) % 360;
  }
  function renderQibla() {
    state.qibla = qiblaAngle(Number(state.lat), Number(state.lon));
    $("qiblaBearing").textContent = Math.round(state.qibla) + "° উত্তর থেকে";
    $("qiblaDirection").textContent = "কিবলার দিক: " + Math.round(state.qibla) + "°";
    $("compassNeedle").style.transform = "rotate(" + state.qibla + "deg)";
    $("qiblaInstructions").textContent = "নির্বাচিত অবস্থান থেকে কাবার দিক উত্তর থেকে ঘড়ির কাঁটার দিকে প্রায় " + Math.round(state.qibla) + "°। সেন্সর সমর্থিত হলে ফোন ঘোরালে নির্দেশকও ঘুরবে।";
  }
  function nextPrayer(timings) {
    const now = new Date(), current = now.getHours() * 60 + now.getMinutes();
    for (const key of prayers) {
      const m = String(timings[key] || "").match(/^(\d{1,2}):(\d{2})/);
      if (m && Number(m[1]) * 60 + Number(m[2]) > current) return key;
    }
    return "Fajr";
  }
  function showHijri(data) {
    const h = data.date && data.date.hijri;
    if (h) {
      state.hijriYear = parseInt(h.year, 10);
      $("hijriDate").textContent = [h.day, h.month?.en, h.year, "হিজরি"].filter(Boolean).join(" ");
      $("hijriLarge").textContent = [h.day, h.month?.ar || h.month?.en, h.year, "হিজরি"].filter(Boolean).join(" ");
      $("hijriGregorian").textContent = data.date?.readable || bengaliDate();
    } else {
      const value = new Intl.DateTimeFormat("bn-BD-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
      $("hijriDate").textContent = value; $("hijriLarge").textContent = value; $("hijriGregorian").textContent = bengaliDate();
    }
  }
  function renderPrayer(data) {
    state.timings = data.timings;
    $("gregorianDate").textContent = bengaliDate();
    showHijri(data);
    const next = nextPrayer(data.timings);
    $("prayerGrid").innerHTML = prayers.map(key => '<article class="prayer-card' + (key === next ? ' next-prayer' : '') + '"><span class="prayer-name">' + bn[key] + '</span><strong>' + clock(data.timings[key]) + '</strong><small>' + (key === next ? 'পরবর্তী নামাজ' : 'আজকের সময়') + '</small></article>').join("");
    updateReminderStatus();
  }
  async function loadPrayerTimes() {
    $("prayerGrid").innerHTML = "<p>নামাজের সময় লোড হচ্ছে…</p>";
    try {
      const data = await api("timings/" + datePath());
      renderPrayer(data);
      $("locationStatus").textContent = "সময় আপডেট হয়েছে: " + state.name + "।";
    } catch {
      $("prayerGrid").innerHTML = '<p class="tools-footnote">সময় লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p>';
      $("locationStatus").textContent = "সময় আনতে সমস্যা হয়েছে। লোকেশন ও ইন্টারনেট পরীক্ষা করুন।";
    }
  }
  function setLocation(name, lat, lon) {
    state.name = name; state.lat = Number(lat); state.lon = Number(lon); state.timings = null;
    $("locationName").value = name; save(); renderQibla(); loadPrayerTimes();
  }
  $("searchCity").addEventListener("click", async () => {
    const query = $("locationName").value.trim();
    if (!query) { $("locationStatus").textContent = "একটি শহরের নাম লিখুন।"; return; }
    $("locationStatus").textContent = "শহর খোঁজা হচ্ছে…";
    try {
      const response = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(query) + "&count=1&language=en&format=json");
      if (!response.ok) throw new Error("geocoding failed");
      const json = await response.json();
      const place = json.results && json.results[0];
      if (!place) throw new Error("not found");
      const label = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
      setLocation(label, place.latitude, place.longitude);
      $("locationStatus").textContent = "লোকেশন পাওয়া গেছে: " + label;
    } catch { $("locationStatus").textContent = "শহর পাওয়া যায়নি। বাংলা বা ইংরেজিতে শহরের নাম লিখে আবার চেষ্টা করুন।"; }
  });
  $("locationName").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); $("searchCity").click(); } });
  $("useLocation").addEventListener("click", () => {
    if (!navigator.geolocation) { $("locationStatus").textContent = "এই ব্রাউজারে লোকেশন সুবিধা নেই।"; return; }
    $("locationStatus").textContent = "লোকেশনের অনুমতি অপেক্ষা করছি…";
    navigator.geolocation.getCurrentPosition(pos => setLocation("আমার বর্তমান অবস্থান", pos.coords.latitude, pos.coords.longitude), () => { $("locationStatus").textContent = "লোকেশন পাওয়া যায়নি বা অনুমতি দেওয়া হয়নি। লাকসাম ব্যবহার করতে পারেন।"; }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 });
  });
  $("loadDefaultLocation").addEventListener("click", () => { $("calculationMethod").value = "1"; state.method = 1; setLocation(DEFAULT.name, DEFAULT.lat, DEFAULT.lon); });
  $("refreshPrayerTimes").addEventListener("click", () => { state.method = Number($("calculationMethod").value); save(); loadPrayerTimes(); });
  $("calculationMethod").addEventListener("change", () => { state.method = Number($("calculationMethod").value); save(); loadPrayerTimes(); });
  $("locationName").addEventListener("change", () => { state.name = $("locationName").value.trim() || DEFAULT.name; save(); });
  $("enableCompass").addEventListener("click", async () => {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        if (await DeviceOrientationEvent.requestPermission() !== "granted") throw new Error("denied");
      }
      window.addEventListener("deviceorientationabsolute", onOrientation, true);
      window.addEventListener("deviceorientation", onOrientation, true);
      $("qiblaInstructions").textContent = "কম্পাস সেন্সর চালু করার চেষ্টা হয়েছে। ফোন সমতল রেখে ধীরে ঘোরান।";
    } catch { $("qiblaInstructions").textContent = "কম্পাস অনুমতি পাওয়া যায়নি। উপরের ডিগ্রি দেখে দিক মিলিয়ে নিন।"; }
  });
  function onOrientation(event) {
    const heading = Number.isFinite(event.webkitCompassHeading) ? event.webkitCompassHeading : Number.isFinite(event.alpha) ? 360 - event.alpha : null;
    if (heading === null || !Number.isFinite(state.qibla)) return;
    $("compassNeedle").style.transform = "rotate(" + (state.qibla - heading) + "deg)";
    $("qiblaInstructions").textContent = "ফোনের সেন্সর অনুযায়ী কিবলার আপেক্ষিক দিক দেখানো হচ্ছে।";
  }
  function gregorianLabel(item) {
    const g = item.date?.gregorian;
    return g?.day && g?.month?.en ? g.day + " " + g.month.en : item.date?.readable || "—";
  }
  async function loadRamadan() {
    if (!state.hijriYear) {
      try { const current = await api("timings/" + datePath()); showHijri(current); } catch {}
    }
    if (!state.hijriYear) { $("ramadanCalendar").innerHTML = '<p class="tools-footnote">হিজরি বছর নির্ণয় করা যায়নি। ইন্টারনেট সংযোগ দিয়ে আবার চেষ্টা করুন।</p>'; return; }
    $("ramadanCalendar").innerHTML = '<p class="tools-footnote">রমজানের ক্যালেন্ডার লোড হচ্ছে…</p>';
    try {
      const rows = await api("hijriCalendar/" + state.hijriYear + "/9");
      if (!Array.isArray(rows) || !rows.length) throw new Error("empty");
      $("ramadanCalendar").innerHTML = '<table class="ramadan-table"><thead><tr><th>রমজান</th><th>তারিখ</th><th>সেহরির শেষ (ফজর)</th><th>ইফতার (মাগরিব)</th></tr></thead><tbody>' + rows.map((item, i) => '<tr><td>' + (item.date?.hijri?.day || i + 1) + '</td><td>' + gregorianLabel(item) + '</td><td>' + clock(item.timings?.Fajr) + '</td><td>' + clock(item.timings?.Maghrib) + '</td></tr>').join("") + '</tbody></table>';
    } catch { $("ramadanCalendar").innerHTML = '<p class="tools-footnote">রমজানের ক্যালেন্ডার আনা যায়নি। ইন্টারনেট সংযোগ দিয়ে আবার চেষ্টা করুন।</p>'; }
  }
  $("loadRamadan").addEventListener("click", loadRamadan);
  function chosenReminders() { return Array.from(document.querySelectorAll("#reminderOptions input:checked")).map(el => el.value); }
  function updateReminderStatus() {
    if (state.reminders?.length) $("reminderStatus").textContent = "চালু: " + state.reminders.map(key => bn[key]).join(", ") + "। পেজ খোলা থাকলে সময় পরীক্ষা হবে।";
  }
  $("enableReminders").addEventListener("click", async () => {
    if (!("Notification" in window)) { $("reminderStatus").textContent = "এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়।"; return; }
    if (!state.timings) { $("reminderStatus").textContent = "আগে নামাজের সময় লোড করুন।"; return; }
    const selected = chosenReminders();
    if (!selected.length) { $("reminderStatus").textContent = "অন্তত একটি নামাজ বেছে নিন।"; return; }
    let permission = Notification.permission;
    if (permission !== "granted") permission = await Notification.requestPermission();
    if (permission !== "granted") { $("reminderStatus").textContent = "নোটিফিকেশনের অনুমতি দেওয়া হয়নি।"; return; }
    state.reminders = selected; state.notified = new Set(); save();
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(checkReminders, 15000);
    $("reminderStatus").textContent = "রিমাইন্ডার চালু হয়েছে। পেজটি খোলা রাখুন।";
    checkReminders();
  });
  function checkReminders() {
    if (!state.timings || !state.reminders?.length || Notification.permission !== "granted") return;
    const now = new Date(), current = now.getHours() * 60 + now.getMinutes();
    const day = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
    for (const key of state.reminders) {
      const match = String(state.timings[key] || "").match(/^(\d{1,2}):(\d{2})/);
      if (!match || current !== Number(match[1]) * 60 + Number(match[2])) continue;
      const token = day + "-" + key;
      if (state.notified.has(token)) continue;
      state.notified.add(token);
      new Notification("সাকীনা · " + bn[key], { body: bn[key] + " নামাজের সময় হয়েছে।", icon: "./app-icon.svg", tag: token });
    }
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadPrayerTimes(); });
  renderQibla();
  loadPrayerTimes();
})();