const SURAH_NAMES = ["আল-ফাতিহা","আল-বাকারা","আলে ইমরান","আন-নিসা","আল-মায়িদা","আল-আনআম","আল-আরাফ","আল-আনফাল","আত-তাওবা","ইউনুস","হুদ","ইউসুফ","আর-রাদ","ইবরাহিম","আল-হিজর","আন-নাহল","আল-ইসরা","আল-কাহফ","মারইয়াম","ত্বা-হা","আল-আম্বিয়া","আল-হজ্জ","আল-মুমিনুন","আন-নূর","আল-ফুরকান","আশ-শুআরা","আন-নামল","আল-কাসাস","আল-আনকাবুত","আর-রূম","লুকমান","আস-সাজদা","আল-আহযাব","সাবা","ফাতির","ইয়াসিন","আস-সাফফাত","সাদ","আয-যুমার","গাফির","ফুসসিলাত","আশ-শূরা","আয-যুখরুফ","আদ-দুখান","আল-জাসিয়া","আল-আহকাফ","মুহাম্মদ","আল-ফাতহ","আল-হুজুরাত","কাফ","আয-যারিয়াত","আত-তূর","আন-নাজম","আল-কামার","আর-রহমান","আল-ওয়াকিয়া","আল-হাদিদ","আল-মুজাদিলা","আল-হাশর","আল-মুমতাহিনা","আস-সাফ","আল-জুমুআ","আল-মুনাফিকুন","আত-তাগাবুন","আত-তালাক","আত-তাহরিম","আল-মুলক","আল-কলম","আল-হাক্কাহ","আল-মাআরিজ","নূহ","আল-জিন","আল-মুযযাম্মিল","আল-মুদ্দাসসির","আল-কিয়ামাহ","আল-ইনসান","আল-মুরসালাত","আন-নাবা","আন-নাযিআত","আবাসা","আত-তাকভির","আল-ইনফিতার","আল-মুতাফফিফিন","আল-ইনশিকাক","আল-বুরুজ","আত-তারিক","আল-আলা","আল-গাশিয়াহ","আল-ফজর","আল-বালাদ","আশ-শামস","আল-লাইল","আদ-দুহা","আশ-শারহ","আত-তিন","আল-আলাক","আল-কদর","আল-বাইয়িনাহ","আয-যিলযাল","আল-আদিয়াত","আল-কারিআহ","আত-তাকাসুর","আল-আসর","আল-হুমাযাহ","আল-ফিল","কুরাইশ","আল-মাউন","আল-কাওসার","আল-কাফিরুন","আন-নাসর","আল-লাহাব","আল-ইখলাস","আল-ফালাক","আন-নাস"];
const FEATURED = [1,18,36,55,56,67,78,93,94,97,103,105,106,107,108,109,110,111,112,113,114];
const SHORT_SURAHS = Array.from({length:10},(_,i)=>105+i);
const API = "https://api.alquran.cloud/v1";
const $ = selector => document.querySelector(selector);
let activeFilter = "featured";
let selectedNumber = null;
let allMetadata = [];
const CACHE_PREFIX = "sakinah-surah-v1-";
const META_KEY = "sakinah-surah-meta-v1";
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function cleanTranslation(value){return String(value||"").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();}
function toast(message){const el=$("#surahToast");el.textContent=message;el.classList.add("show");clearTimeout(window.sakinahToastTimer);window.sakinahToastTimer=setTimeout(()=>el.classList.remove("show"),2400);}
function getCachedSurah(number){try{return JSON.parse(localStorage.getItem(CACHE_PREFIX+number)||"null")}catch{return null}}
function setCachedSurah(number,data){try{localStorage.setItem(CACHE_PREFIX+number,JSON.stringify(data));return true}catch{return false}}
function getMetadata(){try{const saved=JSON.parse(localStorage.getItem(META_KEY)||"null");if(Array.isArray(saved)&&saved.length===114)return saved}catch{}return null}
function makeMetadata(apiRows){return apiRows.map((row,i)=>({number:row.number,name:SURAH_NAMES[i]||row.englishName,englishName:row.englishName,arabicName:row.name,englishMeaning:row.englishNameTranslation,numberOfAyahs:row.numberOfAyahs,revelationType:row.revelationType}));}
async function loadMetadata(){
 const cached=getMetadata(); if(cached){allMetadata=cached;renderSurahList();return}
 try{const response=await fetch(API+"/surah");if(!response.ok)throw new Error("metadata");const json=await response.json();if(json.code!==200||!Array.isArray(json.data)||json.data.length!==114)throw new Error("metadata");allMetadata=makeMetadata(json.data);try{localStorage.setItem(META_KEY,JSON.stringify(allMetadata))}catch{}renderSurahList();}
 catch{allMetadata=SURAH_NAMES.map((name,i)=>({number:i+1,name,englishName:"",arabicName:"",numberOfAyahs:null}));renderSurahList();$("#surahCount").textContent="সূরার তালিকা দেখানো হচ্ছে · পূর্ণ তথ্য দেখতে ইন্টারনেট প্রয়োজন হতে পারে";}
}
function currentNumbers(){
 if(activeFilter==="short")return SHORT_SURAHS;
 if(activeFilter==="featured")return FEATURED;
 return allMetadata.map(s=>s.number);
}
function renderSurahList(){
 const query=($("#surahSearch").value||"").trim().toLocaleLowerCase("bn");
 const nums=currentNumbers();
 const filtered=allMetadata.filter(s=>nums.includes(s.number)&&[s.name,s.englishName,s.arabicName,String(s.number),s.englishMeaning].join(" ").toLocaleLowerCase("bn").includes(query));
 $("#surahCount").textContent=filtered.length+"টি সূরা · "+(activeFilter==="featured"?"নির্বাচিত গুরুত্বপূর্ণ সূরা":activeFilter==="short"?"সূরা আল-ফীল থেকে আন-নাস":"সম্পূর্ণ সূরা তালিকা");
 $("#surahList").innerHTML=filtered.map(s=>'<button class="surah-list-item '+(selectedNumber===s.number?"selected":"")+'" type="button" data-open-surah="'+s.number+'"><span class="surah-list-number">'+s.number+'</span><span class="surah-list-name"><strong>'+escapeHtml(s.name)+'</strong><small>'+escapeHtml(s.englishName||"Surah "+s.number)+(s.numberOfAyahs?" · "+s.numberOfAyahs+" আয়াত":"")+'</small></span><span class="surah-list-arabic" lang="ar" dir="rtl">'+escapeHtml(s.arabicName||"اقرأ")+'</span><span class="surah-list-arrow" aria-hidden="true">↗</span></button>').join("")||'<div class="surah-empty">এই খোঁজে কোনো সূরা পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।</div>';
}
function renderLoading(meta){$("#surahDetail").hidden=false;$("#surahDetail").innerHTML='<div class="surah-loading" role="status"><span class="loading-dot"></span><h2>'+escapeHtml(meta.name)+' লোড হচ্ছে...</h2><p>আরবি পাঠ ও বাংলা অর্থ আনা হচ্ছে। প্রথমবার ইন্টারনেট লাগবে।</p></div>';}
function renderDetail(meta,data,offline=false){
 const arabic=data.arabic||[], bangla=data.bangla||[];
 $("#surahDetail").hidden=false;
 $("#surahDetail").innerHTML='<article class="surah-card surah-reader"><div class="surah-card-head"><div class="surah-number">'+meta.number+'</div><div class="surah-heading"><span class="section-kicker">সূরা '+meta.number+' · '+(meta.numberOfAyahs||arabic.length)+' আয়াত</span><h2>'+escapeHtml(meta.name)+'</h2><p>'+escapeHtml(meta.englishName||"")+' · '+escapeHtml(meta.revelationType==="Meccan"?"মাক্কী":meta.revelationType==="Medinan"?"মাদানী":"কুরআনের সূরা")+'</p></div><div class="surah-arabic-name" lang="ar" dir="rtl">'+escapeHtml(meta.arabicName||"")+'</div></div><div class="reader-tools"><span>'+ (offline?"সংরক্ষিত পাঠ · অফলাইনে":"আরবি পাঠ ও বাংলা অনুবাদ") +'</span><button class="small-button" type="button" id="copySurah">সম্পূর্ণ সূরা কপি করুন</button><a class="small-button" href="https://quran.com/'+meta.number+'" target="_blank" rel="noopener noreferrer">Quran.com ↗</a></div><div class="verse-list">'+arabic.map((v,i)=>'<div class="verse-row"><span class="verse-number">'+(i+1)+'</span><div class="verse-content"><p class="verse-arabic" lang="ar" dir="rtl">'+escapeHtml(v)+'</p><p class="verse-meaning"><strong>অর্থ:</strong> '+escapeHtml(bangla[i]||"বাংলা অর্থ পাওয়া যায়নি।")+'</p></div></div>').join("")+'</div><div class="surah-card-footer"><span>আরবি ও বাংলা অনুবাদ: Al Quran Cloud · bn.bengali</span><span>অনুবাদ যাচাই করে পড়ুন</span></div></article>';
 $("#copySurah").addEventListener("click",async()=>{const text=meta.name+" ("+meta.arabicName+")\n"+arabic.map((v,i)=>(i+1)+". "+v+"\nঅর্থ: "+(bangla[i]||"")).join("\n\n")+"\nসূত্র: সূরা "+meta.number;try{await navigator.clipboard.writeText(text);toast("সম্পূর্ণ সূরার আরবি ও অর্থ কপি হয়েছে")}catch{const t=document.createElement("textarea");t.value=text;document.body.append(t);t.select();document.execCommand("copy");t.remove();toast("সূরার পাঠ কপি হয়েছে")}});
}
async function openSurah(number){
 const meta=allMetadata.find(s=>s.number===number)||{number,name:SURAH_NAMES[number-1],numberOfAyahs:null};
 selectedNumber=number;renderSurahList();renderLoading(meta);
 const cached=getCachedSurah(number);
 if(cached){renderDetail(meta,cached,!navigator.onLine);$("#surahDetail").scrollIntoView({behavior:"smooth",block:"start"});if(!navigator.onLine)return;}
 try{
  const response=await fetch(API+"/surah/"+number+"/editions/quran-uthmani,bn.bengali");
  if(!response.ok)throw new Error("surah");
  const json=await response.json();
  if(json.code!==200||!Array.isArray(json.data)||json.data.length<2)throw new Error("surah");
  const ar=json.data.find(x=>x.edition&&x.edition.identifier==="quran-uthmani")||json.data[0];
  const bn=json.data.find(x=>x.edition&&x.edition.identifier==="bn.bengali")||json.data[1];
  const data={arabic:(ar.ayahs||[]).map(x=>x.text),bangla:(bn.ayahs||[]).map(x=>cleanTranslation(x.text)),source:"Al Quran Cloud",cachedAt:Date.now()};
  if(!data.arabic.length)throw new Error("empty");
  setCachedSurah(number,data);
  const currentMeta=allMetadata.find(s=>s.number===number)||meta;
  renderDetail(currentMeta,data,false);
 }catch{
  if(cached){renderDetail(meta,cached,true);toast("ইন্টারনেট পাওয়া যায়নি; আগে সংরক্ষিত পাঠ দেখানো হচ্ছে");}
  else{$("#surahDetail").innerHTML='<div class="surah-empty"><strong>এই মুহূর্তে সূরা লোড করা যায়নি।</strong><p>ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন, অথবা Quran.com-এ সরাসরি পড়ুন।</p><a href="https://quran.com/'+number+'" target="_blank" rel="noopener noreferrer">Quran.com-এ সূরা খুলুন ↗</a> <button class="small-button" type="button" id="retrySurah">আবার চেষ্টা করুন</button></div>';$("#retrySurah").addEventListener("click",()=>openSurah(number));}
 }
 $("#surahDetail").scrollIntoView({behavior:"smooth",block:"start"});
}
$("#surahSearch").addEventListener("input",renderSurahList);
$("#surahFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;$("#surahFilters").querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderSurahList();});
$("#surahList").addEventListener("click",e=>{const b=e.target.closest("[data-open-surah]");if(b)openSurah(Number(b.dataset.openSurah));});
(function initTheme(){const b=$("#themeToggle"),meta=document.querySelector('meta[name="theme-color"]');function apply(dark){document.documentElement.dataset.theme=dark?"dark":"light";b.textContent=dark?"☀":"☾";b.setAttribute("aria-pressed",String(dark));b.setAttribute("aria-label",dark?"লাইট মোড চালু করুন":"ডার্ক মোড চালু করুন");if(meta)meta.content=dark?"#111a15":"#f7f8f3";}let dark=false;try{dark=localStorage.getItem("sakinah-theme")==="dark"}catch{}apply(dark);b.addEventListener("click",()=>{dark=!dark;apply(dark);try{localStorage.setItem("sakinah-theme",dark?"dark":"light")}catch{}})})();
$("#year").textContent=new Date().getFullYear();
loadMetadata();
