(function initMenuPage(window, document) {
  if (document.body.dataset.page !== "menu") return;

  const {
    parseRange,
    debounce,
    createMenuCard,
    deepClone,
    formatYen,
    setImageFallback
  } = window.MenuUtils;

  const elements = {
    searchInput: document.getElementById("search-input"),
    filtersToggle: document.getElementById("filters-toggle"),
    filtersPanel: document.getElementById("filters-panel"),
    categoryChips: document.getElementById("category-chips"),
    categoryFilter: document.getElementById("category-filter"),
    priceFilter: document.getElementById("price-filter"),
    ratingFilter: document.getElementById("rating-filter"),
    sortFilter: document.getElementById("sort-filter"),
    menuGrid: document.getElementById("menu-grid"),
    loadingState: document.getElementById("loading-state"),
    errorState: document.getElementById("error-state"),
    emptyState: document.getElementById("empty-state"),
    resultsCount: document.getElementById("results-count"),
    modal: document.getElementById("item-modal"),
    modalClose: document.getElementById("modal-close"),
    modalCategory: document.getElementById("modal-category"),
    modalTitle: document.getElementById("modal-title"),
    modalPrice: document.getElementById("modal-price"),
    modalRating: document.getElementById("modal-rating"),
    modalDescription: document.getElementById("modal-description"),
    modalImage: document.getElementById("modal-image")
  };

  const compactViewportQuery = window.matchMedia("(max-width: 719px)");

  const state = {
    data: null,
    categoriesById: new Map()
  };

  function setFiltersPanelState(isExpanded) {
    elements.filtersPanel.hidden = !isExpanded;
    elements.filtersToggle.setAttribute("aria-expanded", String(isExpanded));
    elements.filtersToggle.setAttribute(
      "aria-label",
      isExpanded ? "Fechar filtros" : "Abrir filtros"
    );
  }

  function syncFiltersForViewport(isCompactViewport) {
    if (!isCompactViewport) {
      elements.filtersPanel.hidden = false;
      elements.filtersToggle.setAttribute("aria-expanded", "true");
    } else {
      setFiltersPanelState(false);
    }
  }

  function showError(message) {
    elements.loadingState.classList.add("hidden");
    elements.errorState.textContent = message;
    elements.errorState.classList.remove("hidden");
    elements.resultsCount.textContent = "";
  }

  function hideLoading() {
    elements.loadingState.classList.add("hidden");
    elements.errorState.classList.add("hidden");
  }

  function validateData(payload) {
    return (
      payload &&
      Array.isArray(payload.categories) &&
      Array.isArray(payload.items)
    );
  }

  function buildCategoryControls(categories) {
    const sorted = deepClone(categories).sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    for (const category of sorted) {
      state.categoriesById.set(category.id, category.name);

      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      elements.categoryFilter.append(option);

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.dataset.category = category.id;
      chip.setAttribute("aria-pressed", "false");
      chip.textContent = category.name;
      elements.categoryChips.append(chip);
    }
  }

  function setActiveChip(categoryId) {
    const chips = elements.categoryChips.querySelectorAll(".chip");
    chips.forEach((chip) => {
      const active = chip.dataset.category === categoryId;
      chip.setAttribute("aria-pressed", String(active));
      if (active) {
        chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
  }

  function getFilteredItems() {
    if (!state.data) return [];

    const searchValue = elements.searchInput.value.trim().toLowerCase();
    const selectedCategory = elements.categoryFilter.value;
    const { min, max } = parseRange(elements.priceFilter.value);
    const minRating = Number(elements.ratingFilter.value || 0);
    const sortValue = elements.sortFilter.value;

    const filtered = state.data.items.filter((item) => {
      const searchMatch =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue);
      const categoryMatch =
        selectedCategory === "all" || item.categoryId === selectedCategory;
      const priceMatch =
        Number(item.price) >= min && Number(item.price) <= max;
      const ratingMatch = Number(item.rating) >= minRating;
      return searchMatch && categoryMatch && priceMatch && ratingMatch;
    });

    filtered.sort((a, b) => {
      if (sortValue === "price-asc") return Number(a.price) - Number(b.price);
      if (sortValue === "price-desc") return Number(b.price) - Number(a.price);
      if (sortValue === "name-asc") return a.name.localeCompare(b.name, "pt-BR");
      return Number(b.rating) - Number(a.rating);
    });

    return filtered;
  }

  function renderItems(items) {
    elements.menuGrid.innerHTML = "";
    elements.emptyState.classList.toggle("hidden", items.length > 0);

    if (items.length === 0) {
      elements.resultsCount.textContent = "0 itens";
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const categoryName =
        state.categoriesById.get(item.categoryId) || "Sem categoria";
      const card = createMenuCard(item, categoryName, {
        onOpenDetails: openDetailsModal
      });
      card.style.animationDelay = `${Math.min(index, 12) * 0.04}s`;
      fragment.append(card);
    });

    const label = items.length === 1 ? "1 item" : `${items.length} itens`;
    elements.resultsCount.textContent = label;
    elements.menuGrid.append(fragment);
  }

  function applyFilters() {
    hideLoading();
    const items = getFilteredItems();
    renderItems(items);
  }

  function openDetailsModal(item) {
    const categoryName =
      state.categoriesById.get(item.categoryId) || "Sem categoria";

    elements.modalCategory.textContent = categoryName;
    elements.modalTitle.textContent = item.name;
    elements.modalPrice.textContent = formatYen(item.price, state.data.meta.locale);
    elements.modalRating.textContent = Number(item.rating).toFixed(1);
    elements.modalDescription.textContent = item.description;
    elements.modalImage.src = item.image;
    elements.modalImage.alt = item.name;
    setImageFallback(elements.modalImage);

    if (typeof elements.modal.showModal === "function") {
      elements.modal.showModal();
      return;
    }
    elements.modal.setAttribute("open", "open");
  }

  function closeDetailsModal() {
    if (elements.modal.open && typeof elements.modal.close === "function") {
      elements.modal.close();
      return;
    }
    elements.modal.removeAttribute("open");
  }

  function bindEvents() {
    const debouncedFilters = debounce(applyFilters, 180);

    elements.searchInput.addEventListener("input", debouncedFilters);

    elements.filtersToggle.addEventListener("click", () => {
      const isExpanded =
        elements.filtersToggle.getAttribute("aria-expanded") === "true";
      setFiltersPanelState(!isExpanded);
    });

    elements.categoryChips.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      const value = chip.dataset.category;
      elements.categoryFilter.value = value;
      setActiveChip(value);
      applyFilters();
    });

    elements.categoryFilter.addEventListener("change", () => {
      setActiveChip(elements.categoryFilter.value);
      applyFilters();
    });

    elements.priceFilter.addEventListener("change", applyFilters);
    elements.ratingFilter.addEventListener("change", applyFilters);
    elements.sortFilter.addEventListener("change", applyFilters);

    elements.modalClose.addEventListener("click", closeDetailsModal);
    elements.modal.addEventListener("click", (event) => {
      if (event.target === elements.modal) closeDetailsModal();
    });
    elements.modal.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDetailsModal();
    });

    const onViewportChange = (event) => syncFiltersForViewport(event.matches);
    if (typeof compactViewportQuery.addEventListener === "function") {
      compactViewportQuery.addEventListener("change", onViewportChange);
    } else {
      compactViewportQuery.addListener(onViewportChange);
    }
  }

  async function init() {
    bindEvents();
    syncFiltersForViewport(compactViewportQuery.matches);
    setActiveChip("all");

    try {
      const response = await fetch("data/menu.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Resposta inválida ao carregar JSON");

      const payload = await response.json();
      if (!validateData(payload)) throw new Error("Formato de JSON inválido");

      state.data = payload;
      buildCategoryControls(state.data.categories);
      applyFilters();
      hideLoading();
    } catch (error) {
      showError("Erro ao carregar o cardápio. Verifique data/menu.json.");
      console.error(error);
    }
  }

  init();
})(window, document);
