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

  async function shareCard(duaId) {
    const dua = duas.find(item => item.id === duaId);
    if (!dua) return;
    try {
      const blob = await makeShareCard(dua);
      const file = new File([blob], "sakinah-dua-" + dua.id + ".png", { type: "image/png" });
      if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "সাকীনা — কুরআনের দোয়া", text: dua.reference, files: [file] });
        toast("দোয়ার কার্ড শেয়ার করার জন্য প্রস্তুত");
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast("দোয়ার ছবি ডাউনলোড হয়েছে");
      }
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
