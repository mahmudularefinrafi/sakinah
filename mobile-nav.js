(function () {
  "use strict";
  const button = document.getElementById("mobileMenuToggle");
  const nav = document.getElementById("primaryNavigation");
  const topbar = document.querySelector(".topbar");
  if (!button || !nav || !topbar) return;

  function setOpen(open) {
    topbar.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "মেনু বন্ধ করুন" : "মেনু খুলুন");
    const icon = button.querySelector("span");
    if (icon) icon.textContent = open ? "×" : "☰";
  }

  button.addEventListener("click", function () {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", function (event) {
    if (!topbar.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setOpen(false);
      button.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 561px)").matches) setOpen(false);
  });
})();
