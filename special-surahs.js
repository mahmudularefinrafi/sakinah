const SURAHS = [
{id:"fatiha",number:1,name:"আল-ফাতিহা",arabicName:"الفاتحة",meaningTitle:"সূচনা",category:"worship",tags:"ইবাদত,হেদায়াত,প্রার্থনা,নামাজ",intro:"আল্লাহর প্রশংসা, তাঁর দয়া ও সঠিক পথের প্রার্থনা।",verses:[
["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ","পরম করুণাময়, অতি দয়ালু আল্লাহর নামে।"],
["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ","সমস্ত প্রশংসা আল্লাহর, যিনি সকল জগতের প্রতিপালক।"],
["الرَّحْمَٰنِ الرَّحِيمِ","তিনি পরম করুণাময়, অতি দয়ালু।"],
["مَالِكِ يَوْمِ الدِّينِ","প্রতিফল দিবসের মালিক।"],
["إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ","আমরা শুধু আপনারই ইবাদত করি এবং শুধু আপনারই সাহায্য চাই।"],
["اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ","আমাদের সরল পথ দেখান।"],
["صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ","তাদের পথ, যাদের আপনি অনুগ্রহ করেছেন; তাদের পথ নয়, যারা ক্রোধের পাত্র হয়েছে, আর নয় পথভ্রষ্টদের পথ।"]]},
{id:"ikhlas",number:112,name:"আল-ইখলাস",arabicName:"الإخلاص",meaningTitle:"একনিষ্ঠতা",category:"iman",tags:"ঈমান,তাওহিদ,আল্লাহ,একত্ব",intro:"আল্লাহর একত্ব ও অদ্বিতীয়তা সম্পর্কে সংক্ষিপ্ত ঘোষণা।",verses:[
["قُلْ هُوَ اللَّهُ أَحَدٌ","বলুন, তিনি আল্লাহ, এক ও অদ্বিতীয়।"],
["اللَّهُ الصَّمَدُ","আল্লাহ অমুখাপেক্ষী; সকলেই তাঁর মুখাপেক্ষী।"],
["لَمْ يَلِدْ وَلَمْ يُولَدْ","তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি।"],
["وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ","আর তাঁর সমতুল্য কেউ নেই।"]]},
{id:"falaq",number:113,name:"আল-ফালাক",arabicName:"الفلق",meaningTitle:"প্রভাত",category:"protection",tags:"আশ্রয়,সুরক্ষা,ভয়,অন্ধকার,হিংসা",intro:"সৃষ্টির অনিষ্ট, অন্ধকার, কুমন্ত্রণা ও হিংসা থেকে আল্লাহর আশ্রয় চাওয়া।",verses:[
["قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ","বলুন, আমি আশ্রয় চাই প্রভাতের রবের কাছে।"],
["مِنْ شَرِّ مَا خَلَقَ","তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে।"],
["وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ","আর রাতের অন্ধকারের অনিষ্ট থেকে, যখন তা গভীর হয়।"],
["وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ","আর গিঁটে ফুঁ দেয় এমনদের অনিষ্ট থেকে।"],
["وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ","আর হিংসুকের অনিষ্ট থেকে, যখন সে হিংসা করে।"]]},
{id:"nas",number:114,name:"আন-নাস",arabicName:"الناس",meaningTitle:"মানবজাতি",category:"protection",tags:"আশ্রয়,সুরক্ষা,কুমন্ত্রণা,শয়তান",intro:"অন্তরে কুমন্ত্রণা সৃষ্টিকারীর অনিষ্ট থেকে আল্লাহর আশ্রয় প্রার্থনা।",verses:[
["قُلْ أَعُوذُ بِرَبِّ النَّاسِ","বলুন, আমি আশ্রয় চাই মানবজাতির রবের কাছে।"],
["مَلِكِ النَّاسِ","মানবজাতির অধিপতির কাছে।"],
["إِلَٰهِ النَّاسِ","মানবজাতির উপাস্যের কাছে।"],
["مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ","আত্মগোপনকারী কুমন্ত্রণাদাতার অনিষ্ট থেকে।"],
["الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ","যে মানুষের অন্তরে কুমন্ত্রণা দেয়।"],
["مِنَ الْجِنَّةِ وَالنَّاسِ","জিন ও মানুষের মধ্য থেকে।"]]},
{id:"asr",number:103,name:"আল-আসর",arabicName:"العصر",meaningTitle:"সময়",category:"hope",tags:"সময়,ধৈর্য,সৎকাজ,সত্য,জীবন",intro:"সময় ও মানুষের ক্ষতি থেকে বাঁচার জন্য ঈমান, সৎকাজ, সত্য ও ধৈর্যের গুরুত্ব।",verses:[
["وَالْعَصْرِ","সময়ের শপথ।"],
["إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ","নিশ্চয়ই মানুষ ক্ষতির মধ্যে রয়েছে।"],
["إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ","তবে তারা ছাড়া, যারা ঈমান এনেছে, সৎকাজ করেছে এবং পরস্পরকে সত্যের ও ধৈর্যের উপদেশ দিয়েছে।"]]},
{id:"duha",number:93,name:"আদ-দুহা",arabicName:"الضحى",meaningTitle:"পূর্বাহ্নের আলো",category:"hope",tags:"আশা,দুঃখ,নিরাশা,রহমত,এতিম",intro:"কষ্টের সময় আল্লাহর অনুগ্রহ স্মরণ এবং অসহায় মানুষের প্রতি সদয় হওয়ার শিক্ষা।",verses:[
["وَالضُّحَىٰ","শপথ পূর্বাহ্নের আলোর।"],
["وَاللَّيْلِ إِذَا سَجَىٰ","আর রাতের, যখন তা নিস্তব্ধ হয়।"],
["مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ","আপনার রব আপনাকে পরিত্যাগ করেননি এবং অসন্তুষ্টও হননি।"],
["وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ","আর আপনার জন্য পরবর্তী অবস্থা প্রথম অবস্থার চেয়ে উত্তম।"],
["وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ","আপনার রব আপনাকে অবশ্যই দান করবেন, ফলে আপনি সন্তুষ্ট হবেন।"],
["أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ","তিনি কি আপনাকে এতিম অবস্থায় পাননি, তারপর আশ্রয় দিয়েছেন?"],
["وَوَجَدَكَ ضَالًّا فَهَدَىٰ","আর আপনাকে পথের সন্ধানহীন পেয়েছেন, তারপর পথ দেখিয়েছেন।"],
["وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ","আর আপনাকে অভাবগ্রস্ত পেয়েছেন, তারপর অভাবমুক্ত করেছেন।"],
["فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ","সুতরাং এতিমের প্রতি কঠোর হবেন না।"],
["وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ","আর সাহায্যপ্রার্থীকে ধমক দেবেন না।"],
["وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ","আর আপনার রবের অনুগ্রহের কথা প্রকাশ করুন।"]]},
{id:"sharh",number:94,name:"আশ-শারহ",arabicName:"الشرح",meaningTitle:"বক্ষ প্রশস্তকরণ",category:"hope",tags:"প্রশান্তি,কষ্ট,সহজতা,আশা",intro:"কষ্টের সঙ্গে সহজতা রয়েছে—এই স্মরণ এবং আল্লাহর দিকে মনোনিবেশের আহ্বান।",verses:[
["أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ","আমি কি আপনার বক্ষ প্রশস্ত করে দিইনি?"],
["وَوَضَعْنَا عَنْكَ وِزْرَكَ","আর আপনার থেকে আপনার বোঝা নামিয়ে দিয়েছি।"],
["الَّذِي أَنْقَضَ ظَهْرَكَ","যা আপনার পিঠ ভারী করে তুলেছিল।"],
["وَرَفَعْنَا لَكَ ذِكْرَكَ","আর আপনার স্মরণকে সমুন্নত করেছি।"],
["فَإِنَّ مَعَ الْعُسْرِ يُسْرًا","নিশ্চয়ই কষ্টের সঙ্গেই স্বস্তি রয়েছে।"],
["إِنَّ مَعَ الْعُسْرِ يُسْرًا","নিশ্চয়ই কষ্টের সঙ্গেই স্বস্তি রয়েছে।"],
["فَإِذَا فَرَغْتَ فَانْصَبْ","অতএব যখন অবসর পান, তখন ইবাদতে পরিশ্রম করুন।"],
["وَإِلَىٰ رَبِّكَ فَارْغَبْ","আর আপনার রবের দিকেই মনোনিবেশ করুন।"]]}
];
const $=s=>document.querySelector(s);
let activeFilter="all";
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderSurahs(){
 const q=($("#surahSearch").value||"").trim().toLocaleLowerCase("bn");
 const list=SURAHS.filter(s=>(activeFilter==="all"||s.category===activeFilter)&&[s.name,s.arabicName,s.meaningTitle,s.intro,s.tags,s.verses.flat().join(" ")].join(" ").toLocaleLowerCase("bn").includes(q));
 $("#surahCount").textContent=list.length+"টি সূরা দেখানো হচ্ছে";
 $("#surahList").innerHTML=list.length?list.map(s=>'<article class="surah-card" id="surah-'+s.id+'"><div class="surah-card-head"><div class="surah-number">'+s.number+'</div><div class="surah-heading"><span class="section-kicker">সূরা '+s.number+' · '+s.meaningTitle+'</span><h2>'+escapeHtml(s.name)+'</h2><p>'+escapeHtml(s.intro)+'</p></div><div class="surah-arabic-name" lang="ar" dir="rtl">'+s.arabicName+'</div></div><div class="verse-list">'+s.verses.map((v,i)=>'<div class="verse-row"><span class="verse-number">'+(i+1)+'</span><div class="verse-content"><p class="verse-arabic" lang="ar" dir="rtl">'+v[0]+'</p><p class="verse-meaning"><strong>অর্থ:</strong> '+escapeHtml(v[1])+'</p></div></div>').join("")+'</div><div class="surah-card-footer"><span>সূরা '+s.number+' · আয়াত '+s.verses.length+'টি</span><div><button class="small-button" type="button" data-copy="'+s.id+'">আরবি ও অর্থ কপি</button> <a class="small-button" href="https://quran.com/'+s.number+'" target="_blank" rel="noopener noreferrer">Quran.com-এ পড়ুন ↗</a></div></div></article>').join(""):'<div class="surah-empty">এই খোঁজে কোনো সূরা পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।</div>';
}
function toast(message){const el=$("#surahToast");el.textContent=message;el.classList.add("show");clearTimeout(window.sakinahToastTimer);window.sakinahToastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
$("#surahSearch").addEventListener("input",renderSurahs);
$("#surahFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;$("#surahFilters").querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderSurahs()});
$("#surahList").addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(!b)return;const s=SURAHS.find(x=>x.id===b.dataset.copy);const text=s.name+" ("+s.arabicName+")\n"+s.verses.map((v,i)=>(i+1)+". "+v[0]+"\nঅর্থ: "+v[1]).join("\n\n")+"\nসূত্র: সূরা "+s.number;try{await navigator.clipboard.writeText(text);toast("সূরার আরবি ও অর্থ কপি হয়েছে")}catch{const t=document.createElement("textarea");t.value=text;document.body.append(t);t.select();document.execCommand("copy");t.remove();toast("সূরার আরবি ও অর্থ কপি হয়েছে")}});
(function theme(){const b=$("#themeToggle"),meta=document.querySelector('meta[name="theme-color"]');function apply(dark){document.documentElement.dataset.theme=dark?"dark":"light";b.textContent=dark?"☀":"☾";b.setAttribute("aria-pressed",String(dark));b.setAttribute("aria-label",dark?"লাইট মোড চালু করুন":"ডার্ক মোড চালু করুন");if(meta)meta.content=dark?"#111a15":"#f7f8f3"}let dark=false;try{dark=localStorage.getItem("sakinah-theme")==="dark"}catch{}apply(dark);b.addEventListener("click",()=>{dark=!dark;apply(dark);try{localStorage.setItem("sakinah-theme",dark?"dark":"light")}catch{}})})();
$("#year").textContent=new Date().getFullYear();renderSurahs();
