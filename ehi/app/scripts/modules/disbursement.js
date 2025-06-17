import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { openModal, closeModal } from "../components/modal.js";

// --- Mock Backend Data ---
// Mock users for PIN lookup (simulating fetching receiver details)
const MOCK_USERS_FOR_PIN_LOOKUP = [
  {
    pin: "659681",
    name: "CLARIS PAUL",
    imageUrl: "https://placehold.co/60/0000FF/FFFFFF?text=CP",
  },
  {
    pin: "358059",
    name: "VERO AKPOGUMA",
    imageUrl: "https://placehold.co/60/FF0000/FFFFFF?text=VA",
  },
  {
    pin: "979288",
    name: "LOVETH EDEH",
    imageUrl: "https://placehold.co/60/00FF00/FFFFFF?text=LE",
  },
  {
    pin: "112233",
    name: "JOHN DOE",
    imageUrl: "https://placehold.co/60/FFFF00/000000?text=JD",
  },
  {
    pin: "445566",
    name: "JANE SMITH",
    imageUrl: "https://placehold.co/60/00FFFF/000000?text=JS",
  },
];

// Mock full disbursement dataset with new structure
let MOCK_FULL_DISBURSEMENT_DATASET = [
  {
    id: 1,
    date_disbursed: "2025-03-28", // YYYY-MM-DD
    img_url: "https://placehold.co/60/0000FF/FFFFFF?text=CP",
    receiver_name: "CLARIS PAUL",
    pin: "659681",
    status: "CLAIMED",
    items: [{ item: "Rice", quantity: 10, unit: "kg" }],
  },
  {
    id: 2,
    date_disbursed: "2025-01-31",
    img_url: "https://placehold.co/60/0000FF/FFFFFF?text=CP",
    receiver_name: "CLARIS PAUL",
    pin: "659681",
    status: "CLAIMED",
    items: [{ item: "Beans", quantity: 5, unit: "bag" }],
  },
  {
    id: 3,
    date_disbursed: "2024-12-23",
    img_url: "https://placehold.co/60/0000FF/FFFFFF?text=CP",
    receiver_name: "CLARIS PAUL",
    pin: "659681",
    status: "CLAIMED",
    items: [{ item: "Garri", quantity: 20, unit: "kg" }],
  },
  {
    id: 4,
    date_disbursed: "2024-11-29",
    img_url: "https://placehold.co/60/0000FF/FFFFFF?text=CP",
    receiver_name: "CLARIS PAUL",
    pin: "659681",
    status: "CLAIMED",
    items: [{ item: "Oil", quantity: 2, unit: "liter" }],
  },
  {
    id: 5,
    date_disbursed: "2024-10-31",
    img_url: "https://placehold.co/60/0000FF/FFFFFF?text=CP",
    receiver_name: "CLARIS PAUL",
    pin: "659681",
    status: "CLAIMED",
    items: [{ item: "Sugar", quantity: 5, unit: "kg" }],
  },
  {
    id: 6,
    date_disbursed: "2025-03-28",
    img_url: "https://placehold.co/60/FF0000/FFFFFF?text=VA",
    receiver_name: "VERO AKPOGUMA",
    pin: "358059",
    status: "CLAIMED",
    items: [{ item: "Salt", quantity: 1, unit: "pack" }],
  },
  {
    id: 7,
    date_disbursed: "2025-01-31",
    img_url: "https://placehold.co/60/FF0000/FFFFFF?text=VA",
    receiver_name: "VERO AKPOGUMA",
    pin: "358059",
    status: "CLAIMED",
    items: [{ item: "Soap", quantity: 6, unit: "bar" }],
  },
  {
    id: 8,
    date_disbursed: "2024-12-23",
    img_url: "https://placehold.co/60/FF0000/FFFFFF?text=VA",
    receiver_name: "VERO AKPOGUMA",
    pin: "358059",
    status: "CLAIMED",
    items: [{ item: "Tomato Paste", quantity: 4, unit: "tin" }],
  },
  {
    id: 9,
    date_disbursed: "2024-11-29",
    img_url: "https://placehold.co/60/FF0000/FFFFFF?text=VA",
    receiver_name: "VERO AKPOGUMA",
    pin: "358059",
    status: "CLAIMED",
    items: [{ item: "Groundnut Oil", quantity: 3, unit: "liter" }],
  },
  {
    id: 10,
    date_disbursed: "2024-10-31",
    img_url: "https://placehold.co/60/FF0000/FFFFFF?text=VA",
    receiver_name: "VERO AKPOGUMA",
    pin: "358059",
    status: "CLAIMED",
    items: [{ item: "Millet", quantity: 15, unit: "kg" }],
  },
  {
    id: 11,
    date_disbursed: "2025-03-28",
    img_url: "https://placehold.co/60/00FF00/FFFFFF?text=LE",
    receiver_name: "LOVETH EDEH",
    pin: "979288",
    status: "CLAIMED",
    items: [{ item: "Flour", quantity: 10, unit: "kg" }],
  },
  {
    id: 12,
    date_disbursed: "2025-02-15",
    img_url: "https://placehold.co/60/00FF00/FFFFFF?text=LE",
    receiver_name: "LOVETH EDEH",
    pin: "979288",
    status: "PENDING", // Example of a pending status
    items: [{ item: "Milk Powder", quantity: 2, unit: "tin" }],
  },
];

// --- Helper for Date Formatting (DD/MM/YYYY for display) ---
function formatDateForDisplay(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// --- Table Configuration (Page-specific) ---
const disbursementHeaders = [
  "Date",
  "Image",
  "Receiver",
  "Pin",
  "Status",
  "Item Category", // Will show 'Multiple Items' or the first item
];
const disbursementDropdownActions = [
  "Duplicate",
  "Edit",
  "View",
  "Print Voucher",
  "View All Items",
  "Archive",
];

function transformDisbursementForTable(disbursement) {
  return {
    id: disbursement.id,
    date: formatDateForDisplay(disbursement.date_disbursed),
    // image: `<img src="${disbursement.img_url}" alt="${disbursement.receiver_name}" class="table-img" />`,
    image: disbursement.img_url,
    receiver: disbursement.receiver_name,
    pin: disbursement.pin,
    status: disbursement.status,
    item_category: disbursement.items,
  };
}

async function fetchDisbursementDataFromAPI(limit, offset) {
  // --- REAL API FETCH EXAMPLE (Uncomment and modify when your API is ready) ---
  /*
  const API_BASE_URL = 'https://your-backend-api.com/api/disbursements'; // Replace with your actual API endpoint
  const url = `${API_BASE_URL}?limit=${limit}&offset=${offset}`;

  console.log(`Real API Request: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Add if your API requires authentication
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();

    const transformedData = result.data.map(transformDisbursementForTable);

    return {
      data: transformedData,
      totalItems: result.totalCount,
    };

  } catch (error) {
    console.error("Error fetching data from real API:", error);
    throw error;
  }
  */
  // --- END REAL API FETCH EXAMPLE ---

  console.log(
    `Mock API Request: /api/disbursements?limit=${limit}&offset=${offset}`
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedRawData = MOCK_FULL_DISBURSEMENT_DATASET.slice(
        offset,
        offset + limit
      );
      const transformedData = paginatedRawData.map(
        transformDisbursementForTable
      );
      resolve({
        data: transformedData,
        totalItems: MOCK_FULL_DISBURSEMENT_DATASET.length,
      });
    }, 500);
  });
}

// Create an instance of the paginated table manager for disbursements
const disbursementTableManager = createPaginatedTableManager(
  "disbursement-table-container",
  "disbursement-pagination-container",
  {
    fetchDataFunction: fetchDisbursementDataFromAPI,
    tableHeaders: disbursementHeaders,
    dropdownActions: disbursementDropdownActions,
    pageKey: "disbursement",
    defaultItemsPerPage: 25,
  }
);

// --- Modal Content and Logic ---

// Helper function to mock user data fetch by PIN
async function fetchUserByPin(pin) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS_FOR_PIN_LOOKUP.find((u) => u.pin === pin);
      resolve(user || null);
    }, 300); // Simulate network delay
  });
}

function generateItemRowHTML(item = {}, index, isViewMode = false) {
  const disabledAttr = isViewMode ? "disabled" : "";
  const displayStyle = isViewMode ? "" : `style="display: flex;"`; // Use flex for editable rows

  return `
    <tr class="item-row" data-item-index="${index}">
      <td>
        ${
          isViewMode
            ? `<span>${item.item || ""}</span>`
            : `<input type="text" value="${
                item.item || ""
              }" placeholder="Item Name" class="item-input" ${disabledAttr}>`
        }
      </td>
      <td>
        ${
          isViewMode
            ? `<span>${item.quantity || ""}</span>`
            : `<input type="number" value="${
                item.quantity || ""
              }" placeholder="Qty" class="quantity-input" ${disabledAttr}>`
        }
      </td>
      <td>
        ${
          isViewMode
            ? `<span>${item.unit || ""}</span>`
            : `<input type="text" value="${
                item.unit || ""
              }" placeholder="Unit" class="unit-input" ${disabledAttr}>`
        }
      </td>
      ${
        isViewMode
          ? ""
          : `<td><button class="button button-danger delete-item-btn" type="button">Delete</button></td>`
      }
    </tr>
  `;
}

function generateDisbursementFormHTML(disbursement = {}, mode = "add") {
  const isViewMode = mode === "view";
  const disabledAttr = isViewMode ? "disabled" : "";
  // const readOnlyAttr = isViewMode ? "readonly" : ""; // No longer explicitly needed for readOnly, disabled covers it

  // For 'add' mode, default values
  const defaultDisbursement = {
    date_disbursed: "",
    pin: "",
    receiver_name: "",
    img_url: "",
    status: "UNCLAIMED", // Default status for new entries
    items: [],
  };

  const currentDisbursement = { ...defaultDisbursement, ...disbursement };

  const showAddItemButton = !isViewMode;

  // Determine if the status dropdown should be disabled
  // It should be disabled in 'add' mode (default UNCLAIMED) and 'view' mode.
  // It should be enabled in 'edit' mode.
  const statusDisabledAttr = mode === "add" || isViewMode ? "disabled" : "";

  return `
    <div class="modal-form-top-row">
      <div class="form-group">
        <label for="disbursement-date-disbursed">Date Disbursed</label>
        <input type="date" id="disbursement-date-disbursed" value="${
          currentDisbursement.date_disbursed
        }" ${disabledAttr} />
      </div>
      <div class="form-group">
        <label for="disbursement-pin">Pin</label>
        <input type="text" id="disbursement-pin" value="${
          currentDisbursement.pin
        }" ${disabledAttr} />
      </div>
      <div class="form-group">
        <label for="disbursement-receiver-name">Receiver</label>
        <input type="text" id="disbursement-receiver-name" value="${
          currentDisbursement.receiver_name
        }" readonly />
      </div>
      <div class="form-group">
        <label for="disbursement-status">Status</label>
        <select id="disbursement-status" ${statusDisabledAttr}>
          <option value="UNCLAIMED" ${
            currentDisbursement.status === "UNCLAIMED" ? "selected" : ""
          }>UNCLAIMED</option>
          <option value="CLAIMED" ${
            currentDisbursement.status === "CLAIMED" ? "selected" : ""
          }>CLAIMED</option>
        </select>
      </div>
    </div>

    <div class="modal-form-items-section">
      <h3>Disbursed Items</h3>
      <div class="items-table-container">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit</th>
              ${isViewMode ? "" : "<th>Action</th>"}
            </tr>
          </thead>
          <tbody id="disbursement-items-tbody">
            ${currentDisbursement.items
              .map((item, index) =>
                generateItemRowHTML(item, index, isViewMode)
              )
              .join("")}
          </tbody>
        </table>
      </div>
      ${
        showAddItemButton
          ? `<button class="button button-secondary" id="add-item-btn" type="button" disabled>Add Item</button>`
          : ""
      }
    </div>
  `;
}

function attachDisbursementModalListeners(disbursementId, mode) {
  const modalBody = document.getElementById("app-modal-body");
  const modalFooter = document.getElementById("app-modal-footer");
  const pinInput = modalBody.querySelector("#disbursement-pin");
  const receiverNameInput = modalBody.querySelector(
    "#disbursement-receiver-name"
  );
  const imagePreview = modalBody.querySelector("#disbursement-image-preview");
  const dateDisbursedInput = modalBody.querySelector(
    "#disbursement-date-disbursed"
  );
  const addItemBtn = modalBody.querySelector("#add-item-btn");
  const itemsTbody = modalBody.querySelector("#disbursement-items-tbody");
  const saveUpdateBtn = document.getElementById("modal-save-update-btn");
  const modalCancelBtn = modalFooter.querySelector(".modal-cancel-btn");
  const modalCloseBtn = modalFooter.querySelector(".modal-close-btn");

  let currentItems =
    mode === "edit"
      ? [
          ...(MOCK_FULL_DISBURSEMENT_DATASET.find(
            (d) => d.id === disbursementId
          )?.items || []),
        ]
      : [];

  // --- Helper to validate if essential fields are filled (Date, PIN, Receiver Name)
  const checkTopRowCompleteness = () => {
    return (
      dateDisbursedInput &&
      dateDisbursedInput.value.trim() !== "" &&
      pinInput &&
      pinInput.value.trim() !== "" &&
      receiverNameInput &&
      receiverNameInput.value.trim() !== ""
    );
  };

  // --- Helper to validate if the last item row is completely filled
  const isLastItemRowComplete = () => {
    if (currentItems.length === 0) return true; // No items, so "add item" is enabled
    const lastItem = currentItems[currentItems.length - 1];
    return (
      lastItem.item &&
      lastItem.item.trim() !== "" &&
      lastItem.quantity &&
      lastItem.quantity !== null &&
      lastItem.quantity !== "" &&
      lastItem.unit &&
      lastItem.unit.trim() !== ""
    );
  };

  const updateAddItemButtonState = () => {
    if (addItemBtn) {
      addItemBtn.disabled = !(
        checkTopRowCompleteness() && isLastItemRowComplete()
      );
    }
  };

  // --- PIN Lookup Logic ---
  const handlePinLookup = async () => {
    const pin = pinInput.value.trim();
    if (pin.length > 0) {
      const user = await fetchUserByPin(pin);
      if (user) {
        receiverNameInput.value = user.name;
      } else {
        receiverNameInput.value = "User Not Found";
      }
    } else {
      receiverNameInput.value = "";
      imagePreview.src = "https://placehold.co/60x60?text=No+Image";
      imagePreview.alt = "No Image";
    }
    updateAddItemButtonState();
  };

  pinInput.addEventListener("blur", handlePinLookup); // Trigger on blur
  dateDisbursedInput.addEventListener("change", updateAddItemButtonState);
  // Also check if PIN is already filled on initial load (for edit mode)
  if (mode === "edit" && pinInput.value.trim() !== "") {
    handlePinLookup();
  } else {
    updateAddItemButtonState(); // Initial check for add mode
  }

  // --- Item Table Management ---
  const renderItems = () => {
    itemsTbody.innerHTML = currentItems
      .map((item, index) => generateItemRowHTML(item, index, mode === "view"))
      .join("");
    attachItemRowListeners(); // Re-attach listeners after rendering
    updateAddItemButtonState();
  };

  const attachItemRowListeners = () => {
    if (mode === "view") return; // No listeners needed in view mode

    // Attach listeners to newly added or existing rows
    itemsTbody.querySelectorAll(".item-row").forEach((row) => {
      const index = parseInt(row.dataset.itemIndex);

      const itemInput = row.querySelector(".item-input");
      const quantityInput = row.querySelector(".quantity-input");
      const unitInput = row.querySelector(".unit-input");
      const deleteButton = row.querySelector(".delete-item-btn");

      if (itemInput) {
        itemInput.oninput = (e) => {
          currentItems[index].item = e.target.value;
          updateAddItemButtonState();
        };
      }
      if (quantityInput) {
        quantityInput.oninput = (e) => {
          currentItems[index].quantity = parseFloat(e.target.value) || null; // Use null for empty/invalid number
          updateAddItemButtonState();
        };
      }
      if (unitInput) {
        unitInput.oninput = (e) => {
          currentItems[index].unit = e.target.value;
          updateAddItemButtonState();
        };
      }
      if (deleteButton) {
        deleteButton.onclick = () => {
          currentItems.splice(index, 1);
          renderItems(); // Re-render table to update indices and display
        };
      }
    });
  };

  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      currentItems.push({ item: "", quantity: null, unit: "" }); // Add a new blank item
      renderItems();
    });
  }

  // Initial render of items for edit mode
  renderItems();

  // --- Save/Update Button Logic ---
  if (saveUpdateBtn) {
    saveUpdateBtn.addEventListener("click", () => {
      // Basic validation for the top row fields
      if (!checkTopRowCompleteness()) {
        alert(
          "Please fill in Date, PIN, and ensure Receiver Name is resolved."
        );
        return;
      }
      // Basic validation for items
      if (currentItems.length > 0 && !isLastItemRowComplete()) {
        alert("Please complete the last item row or delete it.");
        return;
      }
      if (currentItems.length === 0) {
        alert("Please add at least one item.");
        return;
      }

      const collectedData = {
        id: disbursementId, // Will be null for 'add' mode
        date_disbursed: dateDisbursedInput.value,
        pin: pinInput.value,
        receiver_name: receiverNameInput.value,
        status:
          modalBody.querySelector("#disbursement-status")?.value || "UNCLAIMED", // Status remains disabled
        items: currentItems.filter(
          (item) => item.item && item.quantity && item.unit
        ), // Filter out incomplete items
      };

      if (mode === "add") {
        const newId =
          Math.max(...MOCK_FULL_DISBURSEMENT_DATASET.map((d) => d.id)) + 1;
        collectedData.id = newId;
        MOCK_FULL_DISBURSEMENT_DATASET.push(collectedData);
        alert(
          `Disbursement for ${collectedData.receiver_name} added successfully!`
        );
      } else if (mode === "edit") {
        const index = MOCK_FULL_DISBURSEMENT_DATASET.findIndex(
          (d) => d.id === collectedData.id
        );
        if (index !== -1) {
          MOCK_FULL_DISBURSEMENT_DATASET[index] = collectedData;
          alert(
            `Disbursement for ${collectedData.receiver_name} updated successfully!`
          );
        } else {
          console.warn("Disbursement not found for update:", collectedData);
        }
      }
      closeModal(); // This will trigger the onCloseCallback and refresh the table
    });
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", closeModal);
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }
}

function handleDisbursementModal(disbursement = {}, mode = "add") {
  let modalTitle = "";
  let footerButtonText = "";
  let showFooter = true;

  if (mode === "add") {
    modalTitle = "Add New Disbursement";
    footerButtonText = "Save";
  } else if (mode === "edit") {
    modalTitle = `Edit Disbursement for ${disbursement.receiver_name}`;
    footerButtonText = "Update";
  } else if (mode === "view") {
    modalTitle = `View Disbursement for ${disbursement.receiver_name}`;
    footerButtonText = "Close";
    showFooter = true;
  }

  const modalContent = generateDisbursementFormHTML(disbursement, mode);
  const footerContent =
    mode === "view"
      ? `<button class="button button-secondary modal-close-btn">Close</button>`
      : `<button class="button button-primary" id="modal-save-update-btn" data-disbursement-id="${
          disbursement.id || ""
        }">${footerButtonText}</button>
       <button class="button button-secondary modal-cancel-btn">Cancel</button>`;

  openModal(modalContent, modalTitle, {
    showFooter: showFooter,
    footerContent: footerContent,
    onCloseCallback: () => {
      disbursementTableManager.refresh();
    },
  });

  // Attach dynamic event listeners after modal is rendered
  if (mode !== "view") {
    // For 'add' and 'edit' modes, attach listeners
    attachDisbursementModalListeners(disbursement.id, mode);
  } else {
    // If it's a view mode, and you need to ensure the receiver name and image are populated on open
    const modalBody = document.getElementById("app-modal-body");
    const imagePreview = modalBody.querySelector("#disbursement-image-preview");
    const receiverNameInput = modalBody.querySelector(
      "#disbursement-receiver-name"
    );
    if (disbursement.receiver_name) {
      receiverNameInput.value = disbursement.receiver_name;
    }
    // if (disbursement.img_url) {
    //   imagePreview.src = disbursement.img_url;
    // }
  }
}

async function printModalContent(printDocumentTitle = "Print Document") {
  const modalBody = document.querySelector("#app-modal-body");

  if (!modalBody) {
    console.error("Modal body not found");
    alert("Error: Could not find modal content to print");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // This alert will now only show once per click if popups are blocked,
    // because we're ensuring only one listener triggers this.
    alert(
      "Please allow pop-ups for this site to print. If already allowed, please try clicking print again."
    );
    return;
  }

  const baseUrl =
    window.location.origin +
    window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/") + 1
    );
  const modalClone = modalBody.cloneNode(true);
  const images = modalClone.querySelectorAll("img");

  const imagePromises = Array.from(images).map(async (img) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const originalImg = new Image();
      // Optional: Add crossorigin if images can come from other domains
      // if (img.src.includes('://') && !img.src.startsWith(window.location.origin) && !img.src.startsWith('data:')) {
      //   originalImg.crossOrigin = "Anonymous";
      // }

      return new Promise((resolve) => {
        originalImg.onload = () => {
          canvas.width = originalImg.width;
          canvas.height = originalImg.height;
          ctx.drawImage(originalImg, 0, 0);
          try {
            const dataUrl = canvas.toDataURL(); // Specify image type e.g., 'image/png' or 'image/jpeg' if needed
            img.src = dataUrl;
          } catch (e) {
            console.warn("Could not convert image to base64:", img.src, e);
          }
          resolve();
        };
        originalImg.onerror = () => {
          console.warn("Could not load image for printing:", img.src);
          resolve(); // Resolve even if an image fails to load, to not block printing
        };

        if (img.src.startsWith("./") || !img.src.includes("://")) {
          originalImg.src = baseUrl + img.src.replace("./", "");
        } else {
          originalImg.src = img.src;
        }
      });
    } catch (e) {
      console.warn("Error processing image for printing:", img.src, e);
      return Promise.resolve();
    }
  });

  await Promise.all(imagePromises);

  const stylesheetLinks = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]')
  )
    .map((link) => `<link rel="stylesheet" href="${link.href}">`)
    .join("\n");

  const safeFileNameTitle = printDocumentTitle
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .replace(/_{2,}/g, "_");

  printWindow.document.write(`
    <html>
    <head>
      <title>${safeFileNameTitle}</title>
      ${stylesheetLinks}
      <style>
        body { 
          font-family: Arial, sans-serif;
          background: white !important;
          margin: 20px;
          color: black;
        }
        .voucher-modal-content { 
          max-width: 800px; 
          margin: 0 auto; 
        }
        .flex { 
          display: flex; 
        }
        
        .justify-between { 
          justify-content: space-between; 
        }
        
        .align-end { 
          align-items: flex-end; 
        }
        
        .voucher-header {
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        
        .voucher-section { 
          text-align: center; 
          padding: 10px; 
        }
        
        .voucher-section h2 {
          margin: 10px 0;
          font-size: 24px;
          color: #333;
        }
        
        .voucher-section p {
          margin: 5px 0;
          font-weight: bold;
        }
        
        .voucher-img, .logo-img {
          display: block;
          margin: 0 auto 10px auto;
          max-width: 60px;
          height: auto;
        }
        
        .voucher-content {
          margin: 20px 0;
        }
        
        .voucher-content p {
          margin: 15px 0;
          font-size: 16px;
        }
        
        .table_container {
          margin: 20px 0;
        }
        
        .voucher-items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 15px; 
        }
        
        .voucher-items-table th, 
        .voucher-items-table td { 
          border: 1px solid #333; 
          padding: 12px 8px; 
          text-align: left; 
        }
        
        .voucher-items-table th { 
          background-color: #f2f2f2; 
          font-weight: bold;
        }
        
        .signature-section { 
          margin-top: 50px; 
          padding-top: 20px; 
          text-align: right;
        }
        
        @media print {
          @page { 
            size: A4; 
            margin: 15mm; 
          }
          
          body { 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0 !important;
            padding: 10mm !important;
            height: auto;
            overflow: visible;
          }
            
          .voucher-modal-content {
            page-break-inside: avoid;
            height: auto;
            min-height: unset;
          }
          
          .voucher-items-table {
            page-break-inside: auto;
          }
          
          .voucher-items-table thead {
            display: table-header-group;
          }
          
          .voucher-items-table tr {
            page-break-inside: avoid;
          }
          
          .voucher-items-table th {
            background-color: #f2f2f2 !important;
          }
          
          .voucher-items-table th, 
          .voucher-items-table td { 
            border: 1px solid #333 !important; 
          }
          
          .signature-section {
            margin-top: 30px !important;
            page-break-inside: avoid;
          }
          
          /* Remove any unnecessary spacing that might cause page breaks */
          * {
            box-sizing: border-box;
          }
          
          /* Ensure no elements have excessive margins/padding */
          .voucher-header {
            margin-bottom: 20px !important;
          }
          
          .voucher-content {
            margin: 15px 0 !important;
          }
        }
      </style>
    </head>
    <body>
      ${modalClone.innerHTML}
      <script>
        window.onload = () => {
          // Wait a bit for content to render, especially images and styles
          setTimeout(() => {
            try {
              window.print();
            } catch (printError) {
              console.error("Error calling window.print():", printError);
              // alert("Could not initiate print dialog. Please try again."); // Optional user alert
            } finally {
              // Close the print window after the print dialog is handled (or after a delay)
              // Using onafterprint is more robust if available, but setTimeout is a fallback.
              if (typeof window.onafterprint !== 'undefined') {
                window.onafterprint = () => setTimeout(window.close, 100); // Small delay after print
              } else {
                setTimeout(() => window.close(), 2000); // Fallback close delay
              }
            }
          }, 1000); // Delay before calling print()
        };
      <\/script>
    </body>
    </html>
  `); 

  printWindow.document.close();
  printWindow.focus();
}

function handlePrintVoucherModal(disbursement = {}) {
  let showFooter = true;

  const voucherContent = `
    <div class="voucher-modal-content">
      <div class="flex justify-between align-end voucher-header">
        <div class="voucher-section">
          <img src="./assets/images/ngoPix.png" alt="${
            disbursement.receiver_name || "Receiver"
          }" class="voucher-img" style="width: 60px; height: 60px;">
          <p>PIN: ${disbursement.pin || "N/A"}</p>
        </div>
        <div class="voucher-section">
          <img src="./assets/images/printLogo.png" alt="Ehi Centre Logo" class="logo-img" style="width: 60px; height: 60px;">
          <h2>Ehi Centre Voucher</h2>
        </div>
        <div class="voucher-section">
          <p>Date: ${
            disbursement.date_disbursed
              ? formatDateForDisplay(disbursement.date_disbursed)
              : new Date().toLocaleDateString()
          }</p>
        </div>
      </div>

      <div class="voucher-content">
        <p><strong>Name:</strong> ${disbursement.receiver_name || "N/A"}</p>
        <div class="table_container">
          <table class="voucher-items-table">
            <thead>
              <tr>
                <th>Items</th>
                <th>Quantity</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              ${
                disbursement.items && disbursement.items.length > 0
                  ? disbursement.items
                      .map(
                        (item) => `
                  <tr>
                    <td>${item.item || ""}</td>
                    <td>${item.quantity || ""}</td>
                    <td>${item.unit || ""}</td>
                  </tr>`
                      )
                      .join("")
                  : '<tr><td colspan="3">No items listed.</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end" style="margin-top: 2rem;">
        <div class="signature-section">
          <p>Signature: ..................................</p>
        </div>
      </div>
    </div>
  `;

  // Assume your formatDateForDisplay function is defined elsewhere
  // function formatDateForDisplay(dateString) { /* ... */ return new Date(dateString).toLocaleDateString(); }

  const printButtonId = "print-voucher-btn"; // The ID of the button in your footer

  const footerContent = `
    <button class="button button-primary" id="${printButtonId}">Print</button>
    <button class="button button-secondary modal-cancel-btn">Cancel</button>
  `;

  openModal(voucherContent, "Print Voucher", {
    showFooter: showFooter,
    footerContent: footerContent,
  });

  // Use setTimeout to defer finding the button until after the current JS execution block,
  // giving the modal time to render.
  setTimeout(() => {
    const originalPrintBtn = document.getElementById(printButtonId);

    if (originalPrintBtn) {
      // --- Button Cloning Strategy to Prevent Multiple Listeners ---
      // 1. Clone the button to get a "clean" version without old listeners.
      const clonedPrintBtn = originalPrintBtn.cloneNode(true); // true for deep clone

      // 2. Replace the original button with the cloned one in the DOM.
      if (originalPrintBtn.parentNode) {
        originalPrintBtn.parentNode.replaceChild(
          clonedPrintBtn,
          originalPrintBtn
        );
      } else {
        // This case should be rare if getElementById found it.
        console.warn(
          "Print button's parent not found during cloning. Listener attached to detached clone."
        );
        // If this happens, the new button won't be visible/interactive.
      }

      // 3. Define the action for the click event.
      const printAction = async () => {
        clonedPrintBtn.textContent = "Preparing...";
        clonedPrintBtn.disabled = true;

        try {
          // Construct a dynamic and descriptive filename (used as the popup title)
          const today = new Date();
          const dateStr = `${today.getFullYear()}-${String(
            today.getMonth() + 1
          ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const filename = `Voucher-${(
            disbursement.receiver_name || "Recipient"
          ).replace(/\s+/g, "_")}-${disbursement.pin || "NoPIN"}-${dateStr}`;

          await printModalContent(filename);
        } catch (error) {
          console.error("Print error:", error);
          alert(
            "An error occurred while preparing to print. Please try again."
          );
        } finally {
          clonedPrintBtn.textContent = "Print";
          clonedPrintBtn.disabled = false;
        }
      };

      // 4. Add the event listener to the NEW (cloned) button.
      clonedPrintBtn.addEventListener("click", printAction);
    } else {
      console.warn(
        `Print button with ID '${printButtonId}' not found in modal footer. Print functionality will not be available.`
      );
    }
  }, 50);
}

function handleDisbursementTableAction(event) {
  const { action, itemId, pageKey } = event.detail;

  const disbursement = MOCK_FULL_DISBURSEMENT_DATASET.find(
    (d) => d.id === parseInt(itemId)
  );

  // For actions that require an existing item
  if (!disbursement && action !== "add") {
    // 'add' action doesn't need an existing item
    console.warn(`Disbursement with ID ${itemId} not found for action.`);
    return;
  }

  switch (action) {
    case "add":
      handleDisbursementModal({}, "add");
      break;
    case "edit":
      handleDisbursementModal(disbursement, "edit");
      break;
    case "view":
      handleDisbursementModal(disbursement, "view");
      break;
    case "duplicate":
      if (disbursement) {
        const duplicatedDisbursement = JSON.parse(JSON.stringify(disbursement)); // Deep copy
        duplicatedDisbursement.id = Math.floor(Math.random() * 1000000) + 100; // New random ID
        // Ensure uniqueness for mock data (simple check for small dataset)
        while (
          MOCK_FULL_DISBURSEMENT_DATASET.some(
            (d) => d.id === duplicatedDisbursement.id
          )
        ) {
          duplicatedDisbursement.id = Math.floor(Math.random() * 1000000) + 100;
        }
        duplicatedDisbursement.date_disbursed = new Date()
          .toISOString()
          .slice(0, 10); // Current date
        MOCK_FULL_DISBURSEMENT_DATASET.push(duplicatedDisbursement);
        disbursementTableManager.refresh(); // Refresh table to show duplicated item
      }
      break;
    case "delete":
      openModal(
        `<p>Are you sure you want to delete disbursement data for <strong>${disbursement.receiver_name}</strong> (ID: ${disbursement.id})?</p>`,
        "Confirm Deletion",
        {
          showFooter: true,
          footerContent: `
            <button class="button button-danger" id="confirm-delete-btn">Delete</button>
            <button class="button button-secondary" onclick="closeModal()">Cancel</button>
          `,
          onCloseCallback: null,
        }
      );

      const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
          const index = MOCK_FULL_DISBURSEMENT_DATASET.findIndex(
            (d) => d.id === parseInt(itemId)
          );
          if (index !== -1) {
            MOCK_FULL_DISBURSEMENT_DATASET.splice(index, 1);
            closeModal();
            disbursementTableManager.refresh(); // Refresh table after deletion
          } else {
            console.warn("Disbursement not found for deletion in mock data.");
            closeModal();
          }
        });
      }
      break;
    case "print-voucher":
      handlePrintVoucherModal(disbursement);
      break;
    case "view-all-items":
      // Find all disbursements for this receiver
      const allDisbursementsForReceiver = MOCK_FULL_DISBURSEMENT_DATASET.filter(
        (d) =>
          d.receiver_name === disbursement.receiver_name &&
          d.pin === disbursement.pin
      );

      // Flatten all items across all disbursements with date and status
      const allItems = allDisbursementsForReceiver.flatMap((disb) =>
        disb.items.map((item) => ({
          date: disb.date_disbursed,
          status: disb.status,
          item: item.item,
          quantity: item.quantity,
          unit: item.unit,
        }))
      );

      // Generate the modal content
      const allItemsContent = `
          <div class="records-content">
            <p>All records for user: <strong>${
              disbursement.receiver_name
            }</strong> (User Pin: ${disbursement.pin})</p>
            <div class="records-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  ${allItems
                    .map(
                      (item) => `
                    <tr>
                      <td>${formatDateForDisplay(item.date)}</td>
                      <td>${item.status}</td>
                      <td>${item.item}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unit}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;

      openModal(allItemsContent, "Disbursement Records", {
        showFooter: true,
        footerContent: `
            <button class="button button-secondary modal-close-btn">Close</button>
          `,
        onOpenCallback: () => {
          document
            .querySelector(".modal-close-btn")
            ?.addEventListener("click", closeModal);
        },
      });
      break;
    case "archive":
      alert(`Archive ${disbursement.receiver_name} (ID: ${disbursement.id})`);
      break;
    default:
      console.warn(`Unhandled action: ${action}`);
  }
}

// --- New Functionality: Add New Disbursement ---
function handleAddNewDisbursement() {
  handleDisbursementModal({}, "add"); // Pass an empty object for a new disbursement
}

// --- Initialization Function Called by Router ---
export function initDisbursement() {
  disbursementTableManager.init();

  // Ensure only one listener for table actions
  window.removeEventListener("tableAction", handleDisbursementTableAction);
  window.addEventListener("tableAction", handleDisbursementTableAction);

  // Get the "Add New" button and attach its event listener
  const addNewButton = document.querySelector(
    ".disbursement-content .button-secondary"
  );
  if (addNewButton) {
    addNewButton.removeEventListener("click", handleAddNewDisbursement); // Prevent multiple listeners
    addNewButton.addEventListener("click", handleAddNewDisbursement);
  } else {
    console.warn(
      "Add New button not found in .disbursement-content. Make sure the HTML structure is correct."
    );
  }
}
