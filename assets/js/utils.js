(function registerMenuUtils(window) {
  const FALLBACK_IMAGE = "assets/img/placeholder.svg";

  function formatYen(value, locale) {
    return new Intl.NumberFormat(locale || "ja-JP", {
      style: "currency",
      currency: "JPY",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function debounce(fn, wait) {
    let timer = null;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function slugify(input) {
    return String(input || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function isValidHttpUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function parseRange(rangeValue) {
    if (!rangeValue || rangeValue === "all") {
      return { min: 0, max: Number.POSITIVE_INFINITY };
    }
    const [min, max] = rangeValue.split("-").map(Number);
    return {
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : Number.POSITIVE_INFINITY
    };
  }

  function setImageFallback(img) {
    img.addEventListener("error", () => {
      if (img.src.endsWith(FALLBACK_IMAGE)) return;
      img.src = FALLBACK_IMAGE;
    });
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function createMenuCard(item, categoryName, options) {
    const callbacks = options || {};
    const interactive = typeof callbacks.onOpenDetails === "function";

    const card = createEl("article", "menu-card reveal");
    card.setAttribute("role", "listitem");

    if (interactive) {
      card.tabIndex = 0;
      card.setAttribute("aria-label", `${item.name}, ${formatYen(item.price)}`);
    }

    const imageWrap = createEl("div", "menu-card-image-wrap");
    const image = document.createElement("img");
    image.className = "menu-card-image";
    image.src = item.image;
    image.alt = item.name;
    image.loading = "lazy";
    image.decoding = "async";
    setImageFallback(image);
    imageWrap.append(image);

    const rating = createEl("span", "menu-card-rating", Number(item.rating).toFixed(1));
    const priceBadge = createEl("span", "menu-card-price-badge", formatYen(item.price));
    imageWrap.append(rating, priceBadge);

    const body = createEl("div", "menu-card-body");
    const tag = createEl("p", "menu-card-tag", categoryName || "Sem categoria");
    const title = createEl("h3", "menu-card-title", item.name);
    const description = createEl("p", "menu-card-description", item.description);
    body.append(tag, title, description);

    card.append(imageWrap, body);

    if (interactive) {
      const open = () => callbacks.onOpenDetails(item);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    }

    return card;
  }

  window.MenuUtils = {
    FALLBACK_IMAGE,
    formatYen,
    debounce,
    slugify,
    isValidHttpUrl,
    deepClone,
    parseRange,
    createMenuCard,
    setImageFallback
  };
})(window);
