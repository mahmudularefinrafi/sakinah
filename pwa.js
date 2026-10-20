(function () {
  "use strict";
  const installButton = document.getElementById("installApp");
  const offlineNotice = document.getElementById("offlineNotice");
  let installPrompt = null;

  function updateConnectionState() {
    if (!offlineNotice) return;
    offlineNotice.hidden = navigator.onLine;
    offlineNotice.textContent = navigator.onLine
      ? ""
      : "আপনি অফলাইনে আছেন। আগে লোড হওয়া দোয়া ও ব্যক্তিগত তালিকা ব্যবহার করতে পারবেন।";
  }

  window.addEventListener("online", updateConnectionState);
  window.addEventListener("offline", updateConnectionState);
  updateConnectionState();

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    if (installButton) installButton.hidden = false;
  });

  if (installButton) {
    installButton.addEventListener("click", async () => {
      if (!installPrompt) {
        if (window.matchMedia("(display-mode: standalone)").matches) {
          const toast = document.getElementById("toast");
          if (toast) { toast.textContent = "সাকীনা ইতিমধ্যে অ্যাপ হিসেবে খোলা আছে।"; toast.classList.add("show"); }
        }
        return;
      }
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.hidden = true;
    });
  }

  window.addEventListener("appinstalled", () => {
    if (installButton) installButton.hidden = true;
    installPrompt = null;
  });

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
        .catch(error => console.warn("Sakinah offline support could not be registered:", error));
    });
  }
})();
