(function(){
  "use strict";
  const KEY="sakinah-pending-search-v1";
  document.addEventListener("DOMContentLoaded",function(){
    let query="";
    try{query=sessionStorage.getItem(KEY)||"";sessionStorage.removeItem(KEY)}catch{}
    const results=document.getElementById("results");
    if(!query){
      if(results)results.hidden=false;
      const title=document.getElementById("resultsTitle");
      const intro=document.getElementById("resultsIntro");
      if(title)title.textContent="আপনার মনের কথা দিয়ে শুরু করুন";
      if(intro)intro.textContent="হোম পেজে ফিরে আপনার অনুভূতি লিখুন। আপনার লেখা এই ব্রাউজারেই প্রক্রিয়াকরণ করা হয়।";
      const grid=document.getElementById("resultsGrid");if(grid)grid.innerHTML="";
      return;
    }
    if(typeof window.runSakinahSearch==="function")window.runSakinahSearch(query);
    else if(typeof runSearch==="function")runSearch(query);
  },{once:true});
})();
