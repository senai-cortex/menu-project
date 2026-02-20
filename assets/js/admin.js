(function initAdminPage(window, document) {
  if (document.body.dataset.page !== "admin") {
    return;
  }

  const {
    createMenuCard,
    deepClone,
    isValidHttpUrl,
    slugify,
    debounce,
    formatYen
  } = window.MenuUtils;

  const elements = {
    importBtn: document.getElementById("import-btn"),
    importInput: document.getElementById("import-input"),
    exportBtn: document.getElementById("export-btn"),
    resetBtn: document.getElementById("reset-btn"),
    adminSearch: document.getElementById("admin-search"),
    adminCategoryFilter: document.getElementById("admin-category-filter"),
    adminStatus: document.getElementById("admin-status"),
    diffSummary: document.getElementById("diff-summary"),
    itemList: document.getElementById("admin-item-list"),
    itemForm: document.getElementById("item-form"),
    formTitle: document.getElementById("form-title"),
    itemId: document.getElementById("item-id"),
    itemName: document.getElementById("item-name"),
    itemCategory: document.getElementById("item-category"),
    itemPrice: document.getElementById("item-price"),
    itemRating: document.getElementById("item-rating"),
    itemImage: document.getElementById("item-image"),
    itemDescription: document.getElementById("item-description"),
    newBtn: document.getElementById("new-btn"),
    deleteBtn: document.getElementById("delete-btn"),
    previewCard: document.getElementById("preview-card")
  };

  const state = {
    originalData: null,
    workingData: null,
    selectedItemId: null,
    categoriesById: new Map()
  };

  function setStatus(message, isError) {
    elements.adminStatus.textContent = message;
    elements.adminStatus.style.color = isError ? "#ffbaba" : "var(--text-soft)";
  }

  function validatePayload(payload) {
    return payload && Array.isArray(payload.categories) && Array.isArray(payload.items);
  }

  function clearErrors() {
    const errorNodes = elements.itemForm.querySelectorAll("[data-error-for]");
    for (const node of errorNodes) {
      node.textContent = "";
    }
  }

  function showErrors(errors) {
    clearErrors();
    for (const [field, message] of Object.entries(errors)) {
      const node = elements.itemForm.querySelector(`[data-error-for="${field}"]`);
      if (node) {
        node.textContent = message;
      }
    }
  }

  function readFormValues() {
    return {
      id: elements.itemId.value.trim(),
      name: elements.itemName.value.trim(),
      categoryId: elements.itemCategory.value,
      price: elements.itemPrice.value.trim(),
      rating: elements.itemRating.value.trim(),
      image: elements.itemImage.value.trim(),
      description: elements.itemDescription.value.trim()
    };
  }

  function validateItem(values, editingId) {
    const errors = {};

    if (values.name.length < 2 || values.name.length > 80) {
      errors.name = "Nome deve ter entre 2 e 80 caracteres.";
    }

    if (!values.categoryId || !state.categoriesById.has(values.categoryId)) {
      errors.categoryId = "Selecione uma categoria válida.";
    }

    const price = Number(values.price);
    if (!Number.isInteger(price) || price < 1) {
      errors.price = "Preço deve ser inteiro positivo em yen.";
    }

    const rating = Number(values.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      errors.rating = "Avaliação deve estar entre 0 e 5.";
    }

    if (!isValidHttpUrl(values.image)) {
      errors.image = "Informe uma URL http(s) válida.";
    }

    if (values.description.length < 10 || values.description.length > 280) {
      errors.description = "Descrição deve ter entre 10 e 280 caracteres.";
    }

    const generatedId = values.id || slugify(values.name);
    if (!generatedId) {
      errors.name = "Nome inválido para gerar ID.";
    }

    const existing = state.workingData.items.find((item) => item.id === generatedId);
    if (existing && generatedId !== editingId) {
      errors.name = "Já existe item com este ID. Ajuste nome ou ID.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      normalized: {
        id: generatedId,
        name: values.name,
        categoryId: values.categoryId,
        price,
        image: values.image,
        rating: Number(rating.toFixed(1)),
        description: values.description
      }
    };
  }

  function buildCategoryOptions() {
    const sorted = deepClone(state.workingData.categories).sort((a, b) => (a.order || 0) - (b.order || 0));

    elements.adminCategoryFilter.innerHTML = '<option value="all">Todas</option>';
    elements.itemCategory.innerHTML = "";

    for (const category of sorted) {
      state.categoriesById.set(category.id, category.name);

      const filterOption = document.createElement("option");
      filterOption.value = category.id;
      filterOption.textContent = category.name;
      elements.adminCategoryFilter.append(filterOption);

      const formOption = document.createElement("option");
      formOption.value = category.id;
      formOption.textContent = category.name;
      elements.itemCategory.append(formOption);
    }
  }

  function setFormMode(editing) {
    elements.formTitle.textContent = editing ? "Editar item" : "Novo item";
    elements.deleteBtn.classList.toggle("hidden", !editing);
  }

  function fillForm(item) {
    elements.itemId.value = item.id;
    elements.itemName.value = item.name;
    elements.itemCategory.value = item.categoryId;
    elements.itemPrice.value = item.price;
    elements.itemRating.value = item.rating;
    elements.itemImage.value = item.image;
    elements.itemDescription.value = item.description;
    setFormMode(true);
    renderPreview(item);
  }

  function resetForm() {
    elements.itemForm.reset();
    if (elements.itemCategory.options.length > 0) {
      elements.itemCategory.selectedIndex = 0;
    }
    clearErrors();
    state.selectedItemId = null;
    setFormMode(false);
    renderPreview();
    renderList();
  }

  function getVisibleItems() {
    if (!state.workingData) {
      return [];
    }

    const query = elements.adminSearch.value.trim().toLowerCase();
    const categoryId = elements.adminCategoryFilter.value;

    return state.workingData.items
      .filter((item) => {
        const queryMatch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);
        const categoryMatch = categoryId === "all" || item.categoryId === categoryId;
        return queryMatch && categoryMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  function renderList() {
    if (!state.workingData) {
      elements.itemList.innerHTML = "";
      return;
    }

    elements.itemList.innerHTML = "";
    const visibleItems = getVisibleItems();

    if (visibleItems.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhum item encontrado.";
      li.style.padding = "0.7rem";
      elements.itemList.append(li);
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const item of visibleItems) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "admin-item-btn";
      if (item.id === state.selectedItemId) {
        button.classList.add("active");
      }

      const name = document.createElement("strong");
      name.textContent = item.name;
      const meta = document.createElement("span");
      const categoryName = state.categoriesById.get(item.categoryId) || "Sem categoria";
      meta.textContent = `${categoryName} | ${formatYen(item.price)}`;

      button.append(name, meta);
      button.addEventListener("click", () => {
        state.selectedItemId = item.id;
        fillForm(item);
        renderList();
      });

      li.append(button);
      fragment.append(li);
    }

    elements.itemList.append(fragment);
  }

  function renderDiffSummary() {
    if (!state.originalData || !state.workingData) {
      elements.diffSummary.textContent = "";
      return;
    }

    const originalById = new Map(state.originalData.items.map((item) => [item.id, item]));
    const workingById = new Map(state.workingData.items.map((item) => [item.id, item]));

    let created = 0;
    let updated = 0;
    let deleted = 0;

    for (const [id, item] of workingById.entries()) {
      if (!originalById.has(id)) {
        created += 1;
      } else {
        const original = originalById.get(id);
        if (JSON.stringify(original) !== JSON.stringify(item)) {
          updated += 1;
        }
      }
    }

    for (const id of originalById.keys()) {
      if (!workingById.has(id)) {
        deleted += 1;
      }
    }

    elements.diffSummary.textContent = `Alterações locais: ${created} criado(s), ${updated} editado(s), ${deleted} removido(s).`;
  }

  function renderPreview(sourceItem) {
    const values = sourceItem || readFormValues();
    elements.previewCard.innerHTML = "";

    if (!values.name || !values.description || !values.image) {
      const msg = document.createElement("p");
      msg.className = "status-message";
      msg.textContent = "Preencha nome, imagem e descrição para pré-visualizar o card.";
      elements.previewCard.append(msg);
      return;
    }

    const previewItem = {
      id: values.id || slugify(values.name),
      categoryId: values.categoryId,
      name: values.name,
      price: Number(values.price) || 0,
      rating: Number(values.rating) || 0,
      image: values.image,
      description: values.description
    };

    const categoryName = state.categoriesById.get(previewItem.categoryId) || "Sem categoria";
    const card = createMenuCard(previewItem, categoryName);
    elements.previewCard.append(card);
  }

  function saveItem(event) {
    event.preventDefault();

    if (!state.workingData) {
      return;
    }

    const values = readFormValues();
    const validation = validateItem(values, state.selectedItemId);

    if (!validation.isValid) {
      showErrors(validation.errors);
      setStatus("Corrija os erros para salvar.", true);
      renderPreview(values);
      return;
    }

    clearErrors();

    const existingIndex = state.workingData.items.findIndex((item) => item.id === state.selectedItemId);
    if (existingIndex >= 0) {
      state.workingData.items.splice(existingIndex, 1, validation.normalized);
      setStatus("Item atualizado localmente.", false);
    } else {
      state.workingData.items.push(validation.normalized);
      setStatus("Item criado localmente.", false);
    }

    state.selectedItemId = validation.normalized.id;
    fillForm(validation.normalized);
    renderList();
    renderDiffSummary();
  }

  function removeItem() {
    if (!state.selectedItemId) {
      return;
    }

    const confirmed = window.confirm("Remover este item localmente?");
    if (!confirmed) {
      return;
    }

    state.workingData.items = state.workingData.items.filter((item) => item.id !== state.selectedItemId);
    setStatus("Item removido localmente.", false);
    resetForm();
    renderDiffSummary();
  }

  function exportJson() {
    if (!state.workingData) {
      setStatus("Aguarde o carregamento para exportar.", true);
      return;
    }

    const exportPayload = deepClone(state.workingData);
    exportPayload.meta.lastUpdated = new Date().toISOString();

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json"
    });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = "menu.updated.json";
    document.body.append(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(href);
    setStatus("JSON exportado com sucesso.", false);
  }

  function applyImportedPayload(payload) {
    state.originalData = deepClone(payload);
    state.workingData = deepClone(payload);
    state.categoriesById.clear();

    buildCategoryOptions();
    resetForm();
    renderList();
    renderDiffSummary();
    setStatus("JSON importado e pronto para edição.", false);
  }

  async function importJsonFromFile(file) {
    const raw = await file.text();
    const payload = JSON.parse(raw);

    if (!validatePayload(payload)) {
      throw new Error("Estrutura inválida");
    }

    applyImportedPayload(payload);
  }

  function bindEvents() {
    elements.itemForm.addEventListener("submit", saveItem);
    elements.newBtn.addEventListener("click", resetForm);
    elements.deleteBtn.addEventListener("click", removeItem);
    elements.exportBtn.addEventListener("click", exportJson);
    elements.resetBtn.addEventListener("click", () => {
      if (!state.originalData) {
        setStatus("Aguarde o carregamento para resetar.", true);
        return;
      }

      state.workingData = deepClone(state.originalData);
      state.selectedItemId = null;
      resetForm();
      renderList();
      renderDiffSummary();
      setStatus("Alterações locais descartadas.", false);
    });

    const debouncedList = debounce(renderList, 120);
    elements.adminSearch.addEventListener("input", debouncedList);
    elements.adminCategoryFilter.addEventListener("change", renderList);

    const livePreview = debounce(() => renderPreview(), 150);
    elements.itemForm.addEventListener("input", livePreview);

    elements.importBtn.addEventListener("click", () => elements.importInput.click());
    elements.importInput.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      try {
        await importJsonFromFile(file);
      } catch (error) {
        setStatus("Falha ao importar JSON. Verifique o formato do arquivo.", true);
        console.error(error);
      } finally {
        elements.importInput.value = "";
      }
    });
  }

  async function loadInitialData() {
    try {
      const response = await fetch("data/menu.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Resposta inválida");
      }

      const payload = await response.json();
      if (!validatePayload(payload)) {
        throw new Error("JSON inválido");
      }

      state.originalData = deepClone(payload);
      state.workingData = deepClone(payload);

      buildCategoryOptions();
      resetForm();
      renderList();
      renderDiffSummary();
      setStatus("Dados carregados. Você pode editar e exportar.", false);
    } catch (error) {
      setStatus("Não foi possível carregar data/menu.json.", true);
      console.error(error);
    }
  }

  bindEvents();
  loadInitialData();
})(window, document);
