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
    // If an already-installed app receives a new worker, reload once so the
    // newly activated HTML/CSS/JS is actually shown instead of the old page.
    let refreshing = false;
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }

    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./service-worker.js", {
          scope: "./",
          updateViaCache: "none"
        });
        // Browsers check on registration/navigation; explicitly request a fresh
        // check too, and repeat while the installed app is used.
        registration.update().catch(() => {});
        const checkForUpdates = () => {
          if (navigator.onLine && document.visibilityState === "visible") {
            registration.update().catch(() => {});
          }
        };
        document.addEventListener("visibilitychange", checkForUpdates);
        window.addEventListener("online", checkForUpdates);
        window.setInterval(checkForUpdates, 6 * 60 * 60 * 1000);
      } catch (error) {
        console.warn("Sakinah offline support could not be registered:", error);
      }
    });
  }
})();
