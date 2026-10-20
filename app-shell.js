(function(){
"use strict";
const THEME="sakinah-theme", FONT="sakinah-large-text";
const $=(s,r=document)=>r.querySelector(s);
const navItems=[
["index.html","হোম","⌂","home"],["daily-duas.html","দোয়া","♡","dua"],
["special-surahs.html","আয়াত","۞","ayat"],["hadith.html","হাদিস","❞","hadith"],
["islamic-tools.html","ইসলামিক","☾","islamic"]
];
function current(){const p=document.body.dataset.page||"";if(p==="home"||p==="results"&&location.pathname.endsWith("index.html"))return"home";if(["daily-duas","library","results"].includes(p))return"dua";if(p==="special-surahs")return"ayat";if(p==="hadith")return"hadith";if(["islamic-tools","amal"].includes(p))return"islamic";return"home"}
function toast(t){let e=$("#appShellToast");if(!e){e=document.createElement("div");e.id="appShellToast";e.className="app-shell-toast";e.setAttribute("role","status");document.body.append(e)}e.textContent=t;e.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>e.classList.remove("show"),2500)}
function theme(t){let dark=t==="dark";document.documentElement.dataset.theme=dark?"dark":"light";try{localStorage.setItem(THEME,t)}catch{}const m=$('meta[name="theme-color"]');if(m)m.content=dark?"#111a15":"#f7f8f3";document.querySelectorAll("#themeToggle").forEach(b=>{b.textContent=dark?"☀":"☾";b.setAttribute("aria-pressed",String(dark));b.setAttribute("aria-label",dark?"লাইট মোড চালু করুন":"ডার্ক মোড চালু করুন")});const v=$("#menuThemeValue"),i=$("#menuThemeIcon"),b=$("#menuThemeToggle");if(v)v.textContent=dark?"ডার্ক মোড চালু":"লাইট মোড চালু";if(i)i.textContent=dark?"☀":"☾";if(b)b.setAttribute("aria-pressed",String(dark))}
function render(){
const nav=document.createElement("nav");nav.className="app-bottom-nav";nav.setAttribute("aria-label","অ্যাপ নেভিগেশন");
nav.innerHTML=navItems.map(([href,label,icon,id])=>'<a class="app-bottom-link" href="'+href+'"'+(current()===id?' aria-current="page"':'')+'><span class="app-bottom-icon" aria-hidden="true">'+icon+'</span><span>'+label+'</span></a>').join("")+'<button class="app-bottom-link" id="appMenuTrigger" type="button" aria-haspopup="dialog"><span class="app-bottom-icon" aria-hidden="true">☰</span><span>মেনু</span></button>';
document.body.append(nav);
const overlay=document.createElement("div");overlay.id="appMenuOverlay";overlay.className="app-menu-overlay";overlay.hidden=true;
overlay.innerHTML=`<button class="app-menu-scrim" id="appMenuScrim" aria-label="মেনু বন্ধ করুন"></button><section class="app-menu-panel" role="dialog" aria-modal="true" aria-labelledby="appMenuTitle"><div class="app-menu-head"><div><span class="section-kicker">আপনার সাকীনা</span><h2 id="appMenuTitle">মেনু ও সেটিংস</h2><p>আপনার পছন্দ ও সংরক্ষিত দোয়া এই ব্রাউজারেই থাকে।</p></div><button class="icon-button" id="appMenuClose" aria-label="বন্ধ করুন">×</button></div>
<a class="app-menu-feature" href="index.html?saved=1"><span class="app-menu-feature-icon">♥</span><span><strong>ফেভারিট / সংরক্ষিত দোয়া</strong><small>পছন্দের দোয়াগুলো আবার পড়ুন</small></span><b id="appMenuSavedCount">০</b></a>
<a class="app-menu-feature" href="library.html#collections"><span class="app-menu-feature-icon">▤</span><span><strong>আমার ব্যক্তিগত তালিকা</strong><small>নিজের দোয়া কালেকশন</small></span><span>›</span></a>
<div class="app-menu-section-title">সব সেকশন</div><div class="app-menu-links"><a href="index.html">⌂ <span>হোম</span></a><a href="daily-duas.html">♡ <span>দৈনন্দিন দোয়া</span></a><a href="library.html">▤ <span>দোয়ার সংগ্রহ</span></a><a href="special-surahs.html">۞ <span>কুরআনের আয়াত ও সূরা</span></a><a href="hadith.html">❞ <span>হাদিসের সূত্র</span></a><a href="islamic-tools.html">☾ <span>ইসলামিক টুলস ও ক্যালেন্ডার</span></a><a href="amal.html">◉ <span>তাসবিহ ও আমল</span></a></div>
<div class="app-menu-section-title">সেটিংস</div>
<button class="app-setting-row" id="menuThemeToggle" type="button"><span class="app-setting-icon" id="menuThemeIcon">☾</span><span class="app-setting-copy"><strong>ডার্ক / লাইট মোড</strong><small id="menuThemeValue">লাইট মোড চালু</small></span><span class="app-setting-switch"></span></button>
<button class="app-setting-row" id="menuFontToggle" type="button"><span class="app-setting-icon">Aa</span><span class="app-setting-copy"><strong>বড় লেখা</strong><small id="menuFontValue">সহজে পড়ার জন্য ফন্ট বড় করুন</small></span><span class="app-setting-switch"></span></button>
<button class="app-setting-row" id="menuInstall" type="button"><span class="app-setting-icon">⇩</span><span class="app-setting-copy"><strong>অ্যাপ ইনস্টল করুন</strong><small>হোম স্ক্রিনে সাকীনা রাখুন</small></span><span>›</span></button>
<p class="app-menu-note" id="appMenuConnection" role="status"></p><a class="app-menu-source" href="https://sunnah.com" target="_blank" rel="noopener noreferrer">হাদিসের সূত্র দেখুন: Sunnah.com ↗</a></section>`;
document.body.append(overlay);
function close(){overlay.hidden=true;document.body.classList.remove("app-menu-open");$("#appMenuTrigger").setAttribute("aria-expanded","false")}
$("#appMenuTrigger").addEventListener("click",()=>{overlay.hidden=false;document.body.classList.add("app-menu-open");$("#appMenuTrigger").setAttribute("aria-expanded","true");$("#appMenuClose").focus()});
$("#appMenuClose").addEventListener("click",close);$("#appMenuScrim").addEventListener("click",close);overlay.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)close()});
$("#menuThemeToggle").addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
$("#menuFontToggle").addEventListener("click",()=>{const on=!document.documentElement.classList.contains("large-text");document.documentElement.classList.toggle("large-text",on);try{localStorage.setItem(FONT,on?"1":"0")}catch{}$("#menuFontToggle").setAttribute("aria-pressed",String(on));$("#menuFontValue").textContent=on?"বড় লেখা চালু":"সহজে পড়ার জন্য ফন্ট বড় করুন"});
$("#menuInstall").addEventListener("click",()=>{if(window.SakinahInstallApp)window.SakinahInstallApp();else toast("ব্রাউজারের মেনু থেকে Install app / Add to Home screen বেছে নিন।")});
const savedButton=$("#savedToggle");if(savedButton&&!$("#savedDialog"))savedButton.addEventListener("click",()=>location.href="index.html?saved=1");
document.querySelectorAll("#themeToggle").forEach(b=>b.addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark")));
let count=0;try{const a=JSON.parse(localStorage.getItem("sakinah-bookmarks-v1")||"[]");count=Array.isArray(a)?a.length:0}catch{}$("#appMenuSavedCount").textContent=new Intl.NumberFormat("bn-BD").format(count);const hc=$("#savedCount");if(hc)hc.textContent=new Intl.NumberFormat("bn-BD").format(count);
const online=()=>$("#appMenuConnection").textContent=navigator.onLine?"অনলাইন আছেন। ফেভারিট ও সেটিংস এই ব্রাউজারেই রাখা হয়।":"অফলাইনে আছেন। আগে খোলা পেজ ও সংরক্ষিত দোয়া ব্যবহার করতে পারবেন।";online();addEventListener("online",online);addEventListener("offline",online);
let font=false,dark=false;try{font=localStorage.getItem(FONT)==="1";dark=localStorage.getItem(THEME)==="dark"}catch{}document.documentElement.classList.toggle("large-text",font);$("#menuFontToggle").setAttribute("aria-pressed",String(font));$("#menuFontValue").textContent=font?"বড় লেখা চালু":"সহজে পড়ার জন্য ফন্ট বড় করুন";theme(dark?"dark":"light");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();