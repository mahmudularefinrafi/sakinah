(function(){
"use strict";
const $=s=>document.querySelector(s);
const KEYS={tasbih:"sakinah-tasbih-v1",tracker:"sakinah-amal-tracker-v1",targets:"sakinah-tasbih-targets-v1"};
const DHIKR={
subhanallah:{ar:"سُبْحَانَ اللَّهِ",bn:"সুবহানাল্লাহ",target:33},
alhamdulillah:{ar:"الْحَمْدُ لِلَّهِ",bn:"আলহামদুলিল্লাহ",target:33},
allahuakbar:{ar:"اللَّهُ أَكْبَرُ",bn:"আল্লাহু আকবার",target:34},
astaghfirullah:{ar:"أَسْتَغْفِرُ اللَّهَ",bn:"আস্তাগফিরুল্লাহ",target:100},
salawat:{ar:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",bn:"আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ",target:100},
custom:{ar:"ذِكْر",bn:"নিজের যিকির",target:33}
};
const TASKS=[
{id:"fajr",title:"ফজরের নামাজ",note:"আজকের নামাজের ব্যক্তিগত চেকলিস্ট"},
{id:"dhuhr",title:"যোহরের নামাজ",note:""},
{id:"asr",title:"আসরের নামাজ",note:""},
{id:"maghrib",title:"মাগরিবের নামাজ",note:""},
{id:"isha",title:"ইশার নামাজ",note:""},
{id:"quran",title:"কুরআন তিলাওয়াত / অধ্যয়ন",note:"নিজের সামর্থ্য অনুযায়ী"},
{id:"morning",title:"সকালবেলার যিকির",note:""},
{id:"evening",title:"সন্ধ্যার যিকির",note:""},
{id:"dhikr",title:"তাসবিহ / ইস্তিগফার",note:""},
{id:"kindness",title:"সদকা বা কারও উপকার",note:"সামর্থ্য অনুযায়ী ভালো কাজ"}
];
const bnDigits=n=>String(n).replace(/\d/g,d=>"০১২৩৪৫৬৭৮৯"[Number(d)]);
function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v&&typeof v==="object"?v:fallback}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function todayKey(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-")}
function toast(message){const el=$("#amalToast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2300)}
function todayRecord(){const all=read(KEYS.tasbih,{}),key=todayKey();if(!all.days)all.days={};if(!all.days[key])all.days[key]={total:0,byDhikr:{}};return {all,key,record:all.days[key]}}
function getCurrent(){const id=$("#dhikrSelect").value;return DHIKR[id]||DHIKR.custom}
function getTarget(){const value=Number($("#targetInput").value);return Number.isFinite(value)&&value>=1?Math.min(10000,Math.floor(value)):getCurrent().target}
function renderCounter(){const {all,record}=todayRecord(),id=$("#dhikrSelect").value,dhikr=getCurrent(),target=getTarget();const custom=$("#customDhikr").value.trim();$("#currentDhikr").textContent=dhikr.ar;$("#currentDhikrBn").textContent=id==="custom"&&custom?custom:dhikr.bn;const count=Number(record.byDhikr[id]||0);$("#counterValue").textContent=bnDigits(count);$("#counterTarget").textContent="লক্ষ্য: "+bnDigits(target)+" বার";$("#targetSummary").textContent=bnDigits(target);$("#todayCount").textContent=bnDigits(record.total||0);$("#counterProgressFill").style.width=Math.min(100,count/target*100)+"%";$("#counterMessage").textContent=count>=target?"লক্ষ্য পূর্ণ হয়েছে—ইচ্ছা হলে চালিয়ে যেতে পারেন।":count===0?"শুরু করতে +১ চাপুন।":bnDigits(Math.max(0,target-count))+" বার বাকি";const targets=read(KEYS.targets,{});targets[id]=target;write(KEYS.targets,targets)}
function renderTracker(){const key=todayKey(),all=read(KEYS.tracker,{}),record=all[key]||{};$("#trackerDate").textContent=new Intl.DateTimeFormat("bn-BD",{dateStyle:"full"}).format(new Date());$("#amalChecklist").innerHTML=TASKS.map(task=>'<label class="amal-check-item '+(record[task.id]?"is-done":"")+'"><input type="checkbox" data-task="'+task.id+'" '+(record[task.id]?"checked":"")+'><span>'+task.title+(task.note?'<small>'+task.note+'</small>':"")+'</span></label>').join("");updateTrackerProgress(record)}
function updateTrackerProgress(record){const done=TASKS.filter(task=>record[task.id]).length,total=TASKS.length,pct=Math.round(done/total*100);$("#trackerProgressText").textContent=bnDigits(done)+" / "+bnDigits(total)+" সম্পন্ন";$("#trackerProgressPercent").textContent=bnDigits(pct)+"%";$("#trackerProgressFill").style.width=pct+"%"}
function applyTheme(dark){document.documentElement.dataset.theme=dark?"dark":"light";const button=$("#themeToggle");button.textContent=dark?"☀":"☾";button.setAttribute("aria-pressed",String(dark));button.setAttribute("aria-label",dark?"লাইট মোড চালু করুন":"ডার্ক মোড চালু করুন");const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?"#111a15":"#f7f8f3"}
const savedTargets=read(KEYS.targets,{});$("#targetInput").value=savedTargets[$("#dhikrSelect").value]||getCurrent().target;
$("#dhikrSelect").addEventListener("change",()=>{const id=$("#dhikrSelect").value;$("#customDhikrWrap").hidden=id!=="custom";$("#targetInput").value=read(KEYS.targets,{})[id]||getCurrent().target;renderCounter()});
$("#customDhikr").addEventListener("input",renderCounter);
$("#targetInput").addEventListener("change",()=>{const id=$("#dhikrSelect").value,targets=read(KEYS.targets,{});targets[id]=getTarget();write(KEYS.targets,targets);$("#targetInput").value=getTarget();renderCounter()});
$("#countButton").addEventListener("click",()=>{const {all,key,record}=todayRecord(),id=$("#dhikrSelect").value;record.byDhikr[id]=Number(record.byDhikr[id]||0)+1;record.total=Number(record.total||0)+1;all.days[key]=record;if(!write(KEYS.tasbih,all))toast("ডেটা সেভ হয়নি—ব্রাউজারের স্টোরেজ পরীক্ষা করুন।");renderCounter();try{if(navigator.vibrate)navigator.vibrate(12)}catch{}});
$("#undoCount").addEventListener("click",()=>{const {all,key,record}=todayRecord(),id=$("#dhikrSelect").value;const count=Number(record.byDhikr[id]||0);if(!count)return;record.byDhikr[id]=count-1;record.total=Math.max(0,Number(record.total||0)-1);all.days[key]=record;write(KEYS.tasbih,all);renderCounter()});
$("#resetCounter").addEventListener("click",()=>{if(!confirm("এই যিকিরের আজকের গণনা শূন্য করবেন?"))return;const {all,key,record}=todayRecord(),id=$("#dhikrSelect").value,old=Number(record.byDhikr[id]||0);record.byDhikr[id]=0;record.total=Math.max(0,Number(record.total||0)-old);all.days[key]=record;write(KEYS.tasbih,all);renderCounter();toast("আজকের এই যিকিরের গণনা রিসেট হয়েছে")});
$("#amalChecklist").addEventListener("change",event=>{const input=event.target.closest("[data-task]");if(!input)return;const key=todayKey(),all=read(KEYS.tracker,{});all[key]=all[key]||{};all[key][input.dataset.task]=input.checked;if(!write(KEYS.tracker,all)){toast("ডেটা সেভ হয়নি—ব্রাউজারের স্টোরেজ পরীক্ষা করুন।");return}input.closest(".amal-check-item").classList.toggle("is-done",input.checked);updateTrackerProgress(all[key]);$("#trackerStatus").textContent="সেভ হয়েছে · "+new Intl.DateTimeFormat("bn-BD",{timeStyle:"short"}).format(new Date())});
$("#clearToday").addEventListener("click",()=>{if(!confirm("আজকের সব আমল-টিক মুছে ফেলবেন?"))return;const all=read(KEYS.tracker,{});delete all[todayKey()];write(KEYS.tracker,all);renderTracker();$("#trackerStatus").textContent="আজকের টিকগুলো মুছে ফেলা হয়েছে।"});
$("#exportData").addEventListener("click",()=>{const backup={app:"Sakinah",formatVersion:1,exportedAt:new Date().toISOString(),tasbih:read(KEYS.tasbih,{}),targets:read(KEYS.targets,{}),tracker:read(KEYS.tracker,{})};const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="sakinah-local-backup-"+todayKey()+".json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("ব্যাকআপ ফাইল তৈরি হয়েছে—নিজের কাছে নিরাপদে রাখুন।")});
$("#themeToggle").addEventListener("click",()=>{const dark=document.documentElement.dataset.theme!=="dark";applyTheme(dark);try{localStorage.setItem("sakinah-theme",dark?"dark":"light")}catch{}});
$("#year").textContent=new Date().getFullYear();applyTheme(document.documentElement.dataset.theme==="dark");renderTracker();renderCounter();
})();