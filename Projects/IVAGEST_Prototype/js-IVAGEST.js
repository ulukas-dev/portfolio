const toast = document.getElementById("toast");
let toastTimeout;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function updateGreeting() {
  const title = document.getElementById("welcomeTitle");
  if (!title) return;

  const hour = new Date().getHours();

  if (hour < 12) {
    title.textContent = "Bom dia";
  } else if (hour < 18) {
    title.textContent = "Boa tarde";
  } else {
    title.textContent = "Boa noite";
  }
}

function setupMenu() {
  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");

  if (!menuButton || !sidebar) return;

  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 700) return;

    const clickedOutside = !sidebar.contains(event.target) &&
      !menuButton.contains(event.target);

    if (clickedOutside) {
      sidebar.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

function setupNotifications() {
  const button = document.getElementById("notifBtn");

  if (button) {
    button.addEventListener("click", () => {
      showToast("Tens 2 faturas pendentes por verificar.");
    });
  }
}

function setupPageActions() {
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.dataset.toast);
    });
  });

  const printButton = document.querySelector("[data-print]");
  if (printButton) {
    printButton.addEventListener("click", () => window.print());
  }

  const dateFilter = document.getElementById("dateFilter");
  if (dateFilter) {
    dateFilter.addEventListener("change", () => {
      showToast(`Filtro alterado para ${dateFilter.value}. Os dados são de demonstração.`);
    });
  }

  const newInvoiceLink = document.getElementById("goNewInvoice");
  if (newInvoiceLink) {
    newInvoiceLink.addEventListener("click", () => {
      window.location.href = "vendas-IVAGEST.html?nova=1";
    });
  }
}

function setupInvoiceForm() {
  const dialog = document.getElementById("invoiceDialog");
  const openButton = document.getElementById("newInvoice");
  const closeButton = document.getElementById("closeDialogBtn");
  const cancelButton = document.getElementById("cancelDialogBtn");
  const form = document.getElementById("invoiceForm");
  const rows = document.getElementById("invoiceRows");
  const countLabel = document.getElementById("invoiceCountLabel");

  if (!dialog || !form || !rows) return;

  let invoiceNumber = 5;

  function openDialog() {
    if (!dialog.open) dialog.showModal();
  }

  if (openButton) {
    openButton.addEventListener("click", openDialog);
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => dialog.close());
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", () => dialog.close());
  }

  if (new URLSearchParams(window.location.search).get("nova") === "1") {
    openDialog();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const clientInput = document.getElementById("clientName");
    const descriptionInput = document.getElementById("itemDescription");
    const amountInput = document.getElementById("invoiceAmount");

    const client = clientInput.value.trim();
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if (!client || !description || !Number.isFinite(amount) || amount <= 0) {
      form.reportValidity();
      return;
    }

    const documentNumber = `FT-2026-${String(invoiceNumber).padStart(3, "0")}`;
    const formattedAmount = `${amount.toLocaleString("pt-PT")} Kz`;
    const row = document.createElement("tr");

    const documentCell = document.createElement("td");
    const documentTitle = document.createElement("strong");
    const clientName = document.createElement("small");

    documentTitle.textContent = documentNumber;
    clientName.textContent = client;
    documentCell.append(documentTitle, clientName);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = description;

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = "status pending";
    status.textContent = "Pendente";
    statusCell.appendChild(status);

    const amountCell = document.createElement("td");
    amountCell.textContent = formattedAmount;

    row.append(documentCell, descriptionCell, statusCell, amountCell);
    rows.prepend(row);

    invoiceNumber += 1;

    if (countLabel) {
      const total = rows.querySelectorAll("tr").length;
      countLabel.textContent = `${total} documentos`;
    }

    form.reset();
    dialog.close();
    showToast(`Fatura ${documentNumber} criada.`);
  });
}

function loadIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

updateGreeting();
setupMenu();
setupNotifications();
setupPageActions();
setupInvoiceForm();
loadIcons();
