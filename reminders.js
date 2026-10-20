(function(){
"use strict";
const button=document.getElementById("enableReminders");
const status=document.getElementById("reminderStatus");
const strip=document.getElementById("reminderStrip");
function hidePrompt(){if(strip){strip.hidden=true;}}
if(!button||!("Notification" in window)||!("serviceWorker" in navigator)){if(button){button.disabled=true;status.textContent="এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়।";}return;}
const messages=[
{time:"09:00",title:"সাকীনা • সকালের স্মরণ",body:"আজকের দিনটি আল্লাহর স্মরণে শুরু করেছেন তো? কিছু দরুদ পাঠের সময় করে নিন।"},
{time:"13:30",title:"সাকীনা • আমলের স্মরণ",body:"আজ কি দরুদ শরিফ পাঠ করেছেন? অল্প হলেও নিয়মিত আমল ধরে রাখুন।"},
{time:"18:00",title:"সাকীনা • দিনের হিসাব",body:"আজকের আমলগুলো একবার মনে করে দেখুন। আল্লাহর কাছে সাহায্য ও কবুলিয়াত চান।"},
{time:"09:00",day:5,title:"সাকীনা • জুমার স্মরণ",body:"আজ শুক্রবার—সূরা কাহাফ তিলাওয়াত ও বেশি বেশি দরুদ পাঠের কথা মনে রাখুন।"}
];
const key="sakinah-local-reminders-v1";
function say(t){status.textContent=t;}
function updateUI(){if(Notification.permission==="granted"){button.textContent="নোটিফিকেশন চালু আছে";say("রিমাইন্ডার চালু আছে। নির্ধারিত সময়ে নোটিফিকেশন পেতে অ্যাপটি খোলা রাখুন।");}else if(Notification.permission==="denied"){button.disabled=true;say("নোটিফিকেশন বন্ধ আছে। ফোনের ব্রাউজার/অ্যাপ সেটিংস থেকে অনুমতি চালু করতে হবে.");}}
async function fire(item,id){try{const reg=await navigator.serviceWorker.ready;await reg.showNotification(item.title,{body:item.body,icon:"./app-icon.svg",badge:"./app-icon.svg",tag:"sakinah-"+id,renotify:false,data:{url:"./"}});localStorage.setItem(key+":"+id,"1");}catch(e){console.warn("Sakinah reminder:",e);}}
function check(){if(Notification.permission!=="granted"||document.visibilityState!=="visible")return;const now=new Date(),day=now.getDay(),hh=String(now.getHours()).padStart(2,"0"),mm=String(now.getMinutes()).padStart(2,"0"),today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,"0"),String(now.getDate()).padStart(2,"0")].join("-");for(const item of messages){if(item.time!==hh+":"+mm)continue;if(item.day!==undefined&&item.day!==day)continue;const id=today+"-"+item.time+(item.day===undefined?"":"-fri");if(!localStorage.getItem(key+":"+id))fire(item,id);}}
button.addEventListener("click",async()=>{if(Notification.permission==="granted"){say("রিমাইন্ডার চালু আছে। নোটিফিকেশন পেতে অ্যাপটি খোলা রাখুন।");return;}try{const result=await Notification.requestPermission();if(result==="granted"){updateUI();check();}else say("নোটিফিকেশন অনুমতি দেওয়া হয়নি। পরে ফোনের অ্যাপ/ব্রাউজার সেটিংস থেকে চালু করতে পারবেন.");}catch(e){say("নোটিফিকেশন চালু করা যায়নি। HTTPS-এ অ্যাপটি খুলে আবার চেষ্টা করুন.");}});
if(Notification.permission==="granted")updateUI();
setInterval(check,15000);document.addEventListener("visibilitychange",check);window.addEventListener("focus",check);
})();