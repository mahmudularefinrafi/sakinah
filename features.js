/* Sakinah feature layer: daily selection, review transparency, shareable PNG cards. */
(function () {
  "use strict";
  const core = window.SakinahFeatures;
  if (!core || !Array.isArray(window.DUAS) && typeof DUAS === "undefined") return;
  const duas = typeof DUAS !== "undefined" ? DUAS : window.DUAS;
  const $ = (selector, scope = document) => scope.querySelector(selector);

  function localDateKey(date = new Date()) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function renderDailyDua() {
    const host = $("#dailyDuaCard");
    const dateLabel = $("#dailyDate");
    if (!host || !duas.length) return;
    const today = new Date();
    const dua = core.selectDailyDua(localDateKey(today), duas);
    if (!dua) return;
    if (dateLabel) dateLabel.textContent = new Intl.DateTimeFormat("bn-BD", { dateStyle: "full" }).format(today);
    host.innerHTML = typeof window.card === "function" ? window.card(dua) : "";
    enhanceCards(host);
  }

  function enhanceCards(scope = document) {
    scope.querySelectorAll(".dua-card").forEach(card => {
      const idButton = card.querySelector("[data-copy], [data-share]");
      const duaId = idButton && (idButton.dataset.copy || idButton.dataset.share);
      if (!duaId) return;

      if (!card.querySelector(".review-status")) {
        const status = document.createElement("p");
        status.className = "review-status";
        status.textContent = core.REVIEW.label + ".";
        const source = card.querySelector(".source-link");
        const reference = card.querySelector(".reference");
        (source || reference || card).insertAdjacentElement("afterend", status);
      }

      const actions = card.querySelector(".card-actions");
      if (actions && !actions.querySelector("[data-share-card]")) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "share-card-button";
        button.dataset.shareCard = duaId;
        button.textContent = "ছবি তৈরি";
        button.setAttribute("aria-label", "দোয়ার শেয়ার কার্ড তৈরি করুন");
        actions.append(button);
      }
    });
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? line + " " + word : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawTextBlock(ctx, text, x, y, maxWidth, lineHeight, maxLines = 5) {
    const lines = wrapText(ctx, text, maxWidth).slice(0, maxLines);
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight, maxWidth));
    return y + lines.length * lineHeight;
  }

  async function makeShareCard(dua) {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported");

    const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
    bg.addColorStop(0, "#f8faf5");
    bg.addColorStop(1, "#eaf2e8");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#d3e1d1";
    ctx.lineWidth = 2;
    roundedRect(ctx, 42, 42, 996, 1266, 34);
    ctx.stroke();
    ctx.fillStyle = "#28634b";
    roundedRect(ctx, 80, 84, 64, 64, 18);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 40px "Amiri", serif';
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    ctx.fillText("س", 112, 128);
    ctx.direction = "ltr";
    ctx.fillStyle = "#244d38";
    ctx.font = '700 30px "Hind Siliguri", sans-serif';
    ctx.textAlign = "left";
    ctx.fillText("সাকীনা", 164, 111);
    ctx.fillStyle = "#718174";
    ctx.font = '22px "Hind Siliguri", sans-serif';
    ctx.fillText("কুরআনের দোয়ায় প্রশান্তি", 164, 143);

    ctx.fillStyle = "#70866f";
    ctx.font = '600 22px "Hind Siliguri", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("কুরআনের দোয়া", 540, 240);

    ctx.fillStyle = "#214b36";
    ctx.font = '56px "Amiri", serif';
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    const arabicLines = wrapText(ctx, dua.arabic, 850).slice(0, 5);
    let y = 340;
    arabicLines.forEach(line => { ctx.fillText(line, 540, y, 850); y += 88; });
    ctx.direction = "ltr";

    y += 24;
    ctx.strokeStyle = "#d4e0d1";
    ctx.beginPath();
    ctx.moveTo(180, y);
    ctx.lineTo(900, y);
    ctx.stroke();
    y += 54;

    ctx.fillStyle = "#6f7d70";
    ctx.font = '600 22px "Hind Siliguri", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("বাংলা অর্থ", 540, y);
    y += 46;
    ctx.fillStyle = "#2d4133";
    ctx.font = '28px "Hind Siliguri", sans-serif';
    y = drawTextBlock(ctx, dua.meaning, 540, y, 830, 48, 5) + 16;

    if (dua.transliteration && y < 1110) {
      ctx.fillStyle = "#78867a";
      ctx.font = '21px "Hind Siliguri", sans-serif';
      y = drawTextBlock(ctx, "উচ্চারণ: " + dua.transliteration, 540, y, 830, 38, 2) + 12;
    }

    ctx.fillStyle = "#657966";
    ctx.font = '600 22px "Hind Siliguri", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(dua.reference || "", 540, 1190, 850);
    ctx.fillStyle = "#849487";
    ctx.font = '19px "Hind Siliguri", sans-serif';
    ctx.fillText("সূত্র মিলিয়ে পড়ুন · quran.com", 540, 1234);
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("PNG generation failed")), "image/png"));
  }

  let activeCardUrl = null;
  function ensureCardDialog() {
    let style = document.getElementById("dua-card-dialog-styles");
    if (!style) {
      style = document.createElement("style");
      style.id = "dua-card-dialog-styles";
      style.textContent = `
        .dua-card-dialog-backdrop[hidden]{display:none!important}.dua-card-dialog-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(10,20,14,.72);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
        .dua-card-dialog{width:min(100%,460px);max-height:92dvh;overflow:auto;background:var(--surface,#fff);color:var(--text,#17251b);border:1px solid var(--border,#dbe5dc);border-radius:20px;padding:16px;box-shadow:0 20px 70px #0004}
        .dua-card-dialog-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
        .dua-card-dialog-head h2{font-size:1.15rem;margin:0}
        .dua-card-dialog-close{font-size:1.4rem;line-height:1;border:0;background:transparent;color:inherit;padding:8px;cursor:pointer}
        .dua-card-preview{display:block;width:100%;height:auto;max-height:58dvh;object-fit:contain;border-radius:12px;background:#f8faf5}
        .dua-card-dialog-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
        .dua-card-dialog-actions button,.dua-card-dialog-actions a{display:flex;justify-content:center;align-items:center;text-align:center;min-height:46px;padding:10px;border-radius:12px;border:1px solid var(--border,#dbe5dc);font:inherit;font-weight:700;text-decoration:none;cursor:pointer}
        .dua-card-save{background:#28634b!important;color:#fff!important;border-color:#28634b!important}
        .dua-card-dialog-note{font-size:.84rem;line-height:1.5;opacity:.78;margin:10px 2px 0}
        @media(max-width:380px){.dua-card-dialog-actions{grid-template-columns:1fr}}
      `;
      document.head.append(style);
    }
    let backdrop = document.getElementById("duaCardDialog");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "duaCardDialog";
      backdrop.className = "dua-card-dialog-backdrop";
      backdrop.hidden = true;
      backdrop.innerHTML = '<section class="dua-card-dialog" role="dialog" aria-modal="true" aria-labelledby="duaCardDialogTitle"><div class="dua-card-dialog-head"><h2 id="duaCardDialogTitle">দোয়ার ছবি তৈরি হয়েছে</h2><button type="button" class="dua-card-dialog-close" data-close-dua-card aria-label="বন্ধ করুন">×</button></div><img class="dua-card-preview" alt="তৈরি করা কুরআনের দোয়ার ছবি"><div class="dua-card-dialog-actions"><button type="button" class="dua-card-save" data-download-dua-card>গ্যালারিতে সেভ করুন</button><button type="button" data-share-dua-card>শেয়ার করুন</button></div><p class="dua-card-dialog-note">সেভ বাটনে চাপলে PNG ছবিটি ডাউনলোড হবে। ফোনের Downloads/Photos অ্যাপে ছবিটি খুঁজে নিন।</p></section>';
      document.body.append(backdrop);
      backdrop.addEventListener("click", event => {
        if (event.target === backdrop || event.target.closest("[data-close-dua-card]")) closeCardDialog();
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !backdrop.hidden) closeCardDialog();
      });
      const saveImage = async () => {
        if (!activeCardUrl) return;
        const saveButton = backdrop.querySelector("[data-download-dua-card]");
        const filename = saveButton.dataset.filename || "sakinah-dua.png";
        try {
          const response = await fetch(activeCardUrl);
          const blob = await response.blob();
          const file = new File([blob], filename, { type: "image/png" });
          const standalone = window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

          // In installed Android PWAs, prefer the native file chooser/share sheet.
          if (standalone && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: "সাকীনা — কুরআনের দোয়া", files: [file] });
            return;
          }

          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = filename;
          link.style.display = "none";
          document.body.append(link);
          link.click();
          link.remove();
          window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
          toast("ছবিটি ডাউনলোড শুরু হয়েছে। Downloads/Photos-এ দেখুন");
        } catch (error) {
          if (error && error.name === "AbortError") return;
          if (activeCardUrl) window.open(activeCardUrl, "_blank", "noopener");
          toast("সেভ না হলে ছবিটি খুলে মেনু থেকে ডাউনলোড করুন");
        }
      };
      backdrop.querySelector("[data-download-dua-card]").addEventListener("click", saveImage);
      backdrop.querySelector("[data-share-dua-card]").addEventListener("click", async () => {
        if (!activeCardUrl) return;
        const link = backdrop.querySelector("[data-download-dua-card]");
        try {
          const response = await fetch(activeCardUrl);
          const blob = await response.blob();
          const file = new File([blob], link.dataset.filename || "sakinah-dua.png", { type: "image/png" });
          if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
            await navigator.share({ title: "সাকীনা — কুরআনের দোয়া", files: [file] });
          } else {
            window.open(activeCardUrl, "_blank", "noopener");
            toast("ছবিটি খুলে মেনু থেকে ডাউনলোড করুন");
          }
        } catch (error) {
          if (!error || error.name !== "AbortError") toast("শেয়ার করা যায়নি। সেভ বাটন ব্যবহার করুন");
        }
      });
    }
    return backdrop;
  }
  function closeCardDialog() {
    const backdrop = document.getElementById("duaCardDialog");
    if (backdrop) backdrop.hidden = true;
    if (activeCardUrl) URL.revokeObjectURL(activeCardUrl);
    activeCardUrl = null;
  }
  async function shareCard(duaId) {
    const dua = duas.find(item => item.id === duaId);
    if (!dua) return;
    try {
      const blob = await makeShareCard(dua);
      const filename = "sakinah-dua-" + dua.id + ".png";
      if (activeCardUrl) URL.revokeObjectURL(activeCardUrl);
      activeCardUrl = URL.createObjectURL(blob);
      const dialog = ensureCardDialog();
      const preview = dialog.querySelector(".dua-card-preview");
      const saveLink = dialog.querySelector("[data-download-dua-card]");
      preview.src = activeCardUrl;
      saveLink.dataset.filename = filename;
      dialog.hidden = false;
      dialog.querySelector("[data-close-dua-card]").focus();
    } catch (error) {
      if (error && error.name === "AbortError") return;
      toast("ছবি তৈরি করা যায়নি। আবার চেষ্টা করুন");
    }
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-share-card]");
    if (button) {
      event.preventDefault();
      shareCard(button.dataset.shareCard);
    }
  });

  renderDailyDua();
  enhanceCards();
  const observer = new MutationObserver(() => enhanceCards());
  observer.observe(document.body, { childList: true, subtree: true });
})();
