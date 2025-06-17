import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { openModal, closeModal } from "../components/modal.js"; // Assuming modal.js is correctly imported

const MOCK_FULL_DONOR_DATASET = [
  {
    id: 1,
    last_name: "Anderson",
    first_name: "Michael",
    email: "m.anderson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Maple Street, Boston, MA 02108",
    gender: "Male",
    date_created: "2023-01-15",
    receipt_number: "RCPT-001",
    donor_type: "Ehi Center",
    receipt_url: "https://picsum.photos/seed/receipt1/300/200",
    items: [
      {
        date: "2023-01-15",
        item: "Rice",
        quantity: 50,
        amount: 100000,
        bags: 10,
      },
      {
        date: "2023-01-15",
        item: "Beans",
        quantity: 20,
        amount: 30000,
        bags: 4,
      },
    ],
  },
  {
    id: 2,
    last_name: "Smith",
    first_name: "Maria",
    email: "m.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Avenue, Springfield, IL 62704",
    gender: "Female",
    date_created: "2023-02-01",
    receipt_number: "RCPT-002",
    donor_type: "External Donor",
    receipt_url: "https://picsum.photos/seed/receipt2/300/200",
    items: [
      {
        date: "2023-02-01",
        item: "Cash",
        quantity: 0,
        amount: 50000,
        bags: 0,
      },
      {
        date: "2023-02-01",
        item: "Clothes",
        quantity: 100,
        amount: 0,
        bags: 0,
      },
    ],
  },
  {
    id: 3,
    last_name: "Johnson",
    first_name: "David",
    email: "d.johnson@example.com",
    phone: "+1 (555) 234-5678",
    address: "789 Pine Lane, Fairmount, GA 30711",
    gender: "Male",
    date_created: "2023-03-10",
    receipt_number: "RCPT-003",
    donor_type: "Ehi Center",
    receipt_url: "https://picsum.photos/seed/receipt3/300/200",
    items: [
      {
        date: "2023-03-10",
        item: "Medication",
        quantity: 30,
        amount: 0,
        bags: 0, // Bags not applicable for medication
      },
    ],
  },
  {
    id: 4,
    last_name: "Williams",
    first_name: "Sarah",
    email: "s.williams@example.com",
    phone: "+1 (555) 876-5432",
    address: "101 Elm Street, Pleasantville, NY 10570",
    gender: "Female",
    date_created: "2023-04-05",
    receipt_number: "RCPT-004",
    donor_type: "Ehi Center",
    receipt_url: "https://picsum.photos/seed/receipt4/300/200",
    items: [
      {
        date: "2023-04-05",
        item: "Books", // Example "Others"
        quantity: 25,
        amount: 0,
        bags: 5,
      },
    ],
  },
];

// --- Mock data for all individual donated items (for "View Total Items") ---
// This dataset is aggregated from the 'items' array within each donor.
const MOCK_FULL_DONOR_ITEMS_DATASET = MOCK_FULL_DONOR_DATASET.flatMap((donor) =>
  donor.items.map((item) => ({
    // Include donor info if needed, e.g., donor_id: donor.id,
    date: item.date,
    category: item.item, // Using 'item' from donor.items as category for clarity
    quantity: item.quantity,
    bag: item.bags, // Using 'bags' from donor.items as bag
    amount: item.amount, // Also include amount if relevant for total view
  }))
);

// Function to generate a blank donor object for "Add New Donor"
function generateBlankDonor() {
  return {
    id: null, // Will be assigned upon "save"
    last_name: "",
    first_name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    date_created: new Date().toISOString().split("T")[0], // Set current date
    receipt_number: "",
    donor_type: "",
    receipt_url: "",
    items: [], // Start with an empty array of items
  };
}

// --- Donor Table Configuration ---
const donorHeaders = [
  "Date",
  "Donor ID",
  "Last Name",
  "First Name",
  "Email",
  "Phone Number",
  "Address",
  "Gender",
];

const donorDropdownActions = [
  "Add Donor Item",
  "View Donor Items",
  "View Donor",
  "Edit Donor",
  "Delete Donor",
];

function transformDonorForTable(donor) {
  return {
    id: donor.id,
    date: donor.date_created,
    donor_id: donor.id,
    last_name: donor.last_name,
    first_name: donor.first_name,
    email: donor.email,
    phone_number: donor.phone,
    address: donor.address,
    gender: donor.gender,
  };
}

async function fetchDonorsDataFromAPI(limit, offset) {
  console.log(`Mock API Request: /api/donors?limit=${limit}&offset=${offset}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedRawData = MOCK_FULL_DONOR_DATASET.slice(
        offset,
        offset + limit
      );
      const transformedData = paginatedRawData.map(transformDonorForTable);
      resolve({
        data: transformedData,
        totalItems: MOCK_FULL_DONOR_DATASET.length,
      });
    }, 500);
  });
}

const donorTableManager = createPaginatedTableManager(
  "donors-table-container",
  "donors-pagination-container",
  {
    fetchDataFunction: fetchDonorsDataFromAPI,
    tableHeaders: donorHeaders,
    dropdownActions: donorDropdownActions,
    pageKey: "donors",
    defaultItemsPerPage: 25,
  }
);

function generateDonorItemTableRow(itemData, index, isEditable = true) {
  const itemOptions = [
    "Cash",
    "Medication",
    "Rice",
    "Beans",
    "Clothes",
    "Others",
  ];
  const currentItemValue = itemData.item || "";
  const isOtherSelected = itemOptions.includes(currentItemValue)
    ? false
    : currentItemValue !== "";

  let itemInputHtml = "";
  if (isEditable) {
    itemInputHtml = `
      <select class="item-select-dropdown" data-index="${index}" style="display: ${
      isOtherSelected ? "none" : "block"
    };">
        <option value="">Select Item</option>
        ${itemOptions
          .map(
            (option) =>
              `<option value="${option}" ${
                currentItemValue === option ? "selected" : ""
              }>${option}</option>`
          )
          .join("")}
      </select>
      <input type="text" class="item-text-input" data-index="${index}" value="${
      isOtherSelected ? currentItemValue : ""
    }" placeholder="Enter item name" style="display: ${
      isOtherSelected ? "block" : "none"
    };">
    `;
  } else {
    // For view-only, just display the item name
    itemInputHtml = `<span>${currentItemValue}</span>`; // Use span for view-only
  }

  // Determine disabled/readonly states for quantity, amount, bags based on item type
  let quantityReadonly = "";
  let quantityDisabled = "";
  let amountReadonly = "";
  let amountDisabled = "";
  let bagsReadonly = "";
  let bagsDisabled = "";

  if (isEditable) {
    if (currentItemValue === "Cash") {
      quantityReadonly = "readonly";
      quantityDisabled = "disabled";
      bagsReadonly = "readonly";
      bagsDisabled = "disabled";
    } else if (
      currentItemValue === "Rice" ||
      currentItemValue === "Beans" ||
      currentItemValue === "Others"
    ) {
      // All editable for Rice/Beans/Others
    } else {
      // Clothes, Medication (Bags are not applicable, set to 0 and disabled)
      bagsReadonly = "readonly";
      bagsDisabled = "disabled";
    }
  } else {
    // Not editable (View Donor Items modal or View Total Items modal)
    quantityReadonly = "readonly";
    quantityDisabled = "disabled";
    amountReadonly = "readonly";
    amountDisabled = "disabled";
    bagsReadonly = "readonly";
    bagsDisabled = "disabled";
  }

  // Set initial values for non-editable fields to 0 or empty string as per user's request
  const displayQuantity =
    isEditable && quantityDisabled === "disabled" ? 0 : itemData.quantity || "";
  const displayAmount = itemData.amount || "";
  const displayBags =
    isEditable && bagsDisabled === "disabled" ? 0 : itemData.bags || "";

  const updateButton = isEditable
    ? `<button class="button button-primary update-item-btn" data-index="${index}">Update</button>`
    : "";
  const deleteButton = isEditable
    ? `<button class="button button-danger delete-item-btn" data-index="${index}">X</button>`
    : "";

  // Date column is only shown in View Donor Items and View Total Items, not Add Donor Item/Add New Donor
  const dateColumnHtml = isEditable ? "" : `<td>${itemData.date || ""}</td>`; // Display date directly

  return `
    <tr data-index="${index}">
      ${dateColumnHtml}
      <td>${itemInputHtml}</td>
      <td><input type="number" class="item-quantity" value="${displayQuantity}" ${quantityReadonly} ${quantityDisabled}></td>
      <td><input type="number" class="item-amount" value="${displayAmount}" ${amountReadonly} ${amountDisabled}></td>
      <td><input type="number" class="item-bags" value="${displayBags}" ${bagsReadonly} ${bagsDisabled}></td>
      <td class="item-actions">
        ${deleteButton}
        ${updateButton}
      </td>
    </tr>
  `;
}

function attachItemRowListeners(modalBody, currentItems, reRenderCallback) {
  modalBody.querySelectorAll(".item-select-dropdown").forEach((select) => {
    select.addEventListener("change", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      const selectedValue = e.target.value;
      const row = e.target.closest("tr");
      const itemTextInput = row.querySelector(".item-text-input");
      const quantityInput = row.querySelector(".item-quantity");
      const amountInput = row.querySelector(".item-amount");
      const bagsInput = row.querySelector(".item-bags");

      // Update the item in currentItems
      currentItems[index].item = selectedValue;

      // Toggle visibility of text input for "Others"
      if (selectedValue === "Others") {
        if (itemTextInput) {
          // Check if element exists
          itemTextInput.style.display = "block";
          itemTextInput.focus();
        }
        select.style.display = "none";
      } else {
        if (itemTextInput) {
          // Check if element exists
          itemTextInput.style.display = "none";
        }
        select.style.display = "block";
      }

      // Apply conditional readonly/disabled states and reset values for non-editable fields
      if (selectedValue === "Cash") {
        quantityInput.value = 0; // Set to 0
        bagsInput.value = 0; // Set to 0
        quantityInput.readOnly = true;
        quantityInput.disabled = true;
        amountInput.readOnly = false;
        amountInput.disabled = false;
        bagsInput.readOnly = true;
        bagsInput.disabled = true;
      } else if (
        selectedValue === "Rice" ||
        selectedValue === "Beans" ||
        selectedValue === "Others"
      ) {
        quantityInput.readOnly = false;
        quantityInput.disabled = false;
        amountInput.readOnly = false;
        amountInput.disabled = false;
        bagsInput.readOnly = false;
        bagsInput.disabled = false;
      } else {
        // Clothes, Medication
        bagsInput.value = 0; // Set to 0
        quantityInput.readOnly = false;
        quantityInput.disabled = false;
        amountInput.readOnly = false;
        amountInput.disabled = false;
        bagsInput.readOnly = true;
        bagsInput.disabled = true;
      }
      // Ensure current values are captured for the current row after changing item type
      currentItems[index].quantity = parseInt(quantityInput.value, 10) || 0;
      currentItems[index].amount = parseInt(amountInput.value, 10) || 0;
      currentItems[index].bags = parseInt(bagsInput.value, 10) || 0;
    });
  });

  // Listener for 'Others' text input to update the item value
  modalBody.querySelectorAll(".item-text-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      currentItems[index].item = e.target.value;
    });
  });

  // Listeners for quantity, amount, bags inputs to update currentItems
  modalBody
    .querySelectorAll(".item-quantity, .item-amount, .item-bags")
    .forEach((input) => {
      input.addEventListener("input", (e) => {
        const index = parseInt(e.target.closest("tr").dataset.index, 10);
        const prop = e.target.classList.contains("item-quantity")
          ? "quantity"
          : e.target.classList.contains("item-amount")
          ? "amount"
          : "bags";
        currentItems[index][prop] =
          e.target.type === "number"
            ? parseInt(e.target.value, 10) || 0
            : e.target.value;
      });
    });

  // Event listeners for individual row delete/update buttons
  modalBody.querySelectorAll(".delete-item-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const indexToDelete = parseInt(e.target.dataset.index, 10);
      currentItems.splice(indexToDelete, 1);
      reRenderCallback(); // Re-render to show updated list
    });
  });

  modalBody.querySelectorAll(".update-item-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const indexToUpdate = parseInt(e.target.dataset.index, 10);
      const row = e.target.closest("tr");
      if (row) {
        const selectedItemType =
          row.querySelector(".item-select-dropdown")?.value === "Others"
            ? row.querySelector(".item-text-input")?.value
            : row.querySelector(".item-select-dropdown")?.value || "";

        let updatedItem = {
          date: currentItems[indexToUpdate].date || "", // Date is not in input, so use existing
          item: selectedItemType,
          quantity:
            parseInt(row.querySelector(".item-quantity")?.value, 10) || 0,
          amount: parseInt(row.querySelector(".item-amount")?.value, 10) || 0,
          bags: parseInt(row.querySelector(".item-bags")?.value, 10) || 0,
        };

        // Enforce rules on update
        if (selectedItemType === "Cash") {
          updatedItem.quantity = 0;
          updatedItem.bags = 0;
        } else if (
          !(
            selectedItemType === "Rice" ||
            selectedItemType === "Beans" ||
            selectedItemType === "Others"
          )
        ) {
          updatedItem.bags = 0;
        }

        currentItems[indexToUpdate] = updatedItem;
        reRenderCallback(); // Re-render to ensure conditional states are applied correctly after update
      }
    });
  });
}

function generateDonorForm(donorData, isEditable = true) {
  const readonlyAttr = isEditable ? "" : "readonly";
  const disabledAttr = isEditable ? "" : "disabled";

  return `
  ${
    donorData.receipt_url
      ? `
    <div class="form-group full-width">
      <label>Receipt Image:</label>
      <img src="${donorData.receipt_url}" alt="Receipt Image" 
           onerror="this.onerror=null;this.src='https://placehold.co/300x200/cccccc/000000?text=No+Image';">
    </div>
  `
      : ""
  }
  ${
    isEditable
    ? `
    <div class="form-group full-width">
      <label>Add Attachment:</label>
      <input type="file" name="receipt_image" accept="image/*"
             onchange="if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                  const img = document.querySelector('.donor-form img');
                  img.src = e.target.result;
                };
                reader.readAsDataURL(this.files[0]);
              }">
    </div>
    `
    : ""
  }
    <div class="grid donor-form">
      <div class="form-group">
        <label>First Name:</label>
        <input type="text" name="first_name" value="${
          donorData.first_name || ""
        }" ${readonlyAttr}>
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input type="text" name="last_name" value="${
          donorData.last_name || ""
        }" ${readonlyAttr}>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" name="email" value="${
          donorData.email || ""
        }" ${readonlyAttr}>
      </div>
      <div class="form-group">
        <label>Phone:</label>
        <input type="text" name="phone" value="${
          donorData.phone || ""
        }" ${readonlyAttr}>
      </div>
      <div class="form-group">
        <label>Gender:</label>
        <select name="gender" ${disabledAttr}>
          <option value="">Select Gender</option>
          <option value="Male" ${
            donorData.gender === "Male" ? "selected" : ""
          }>Male</option>
          <option value="Female" ${
            donorData.gender === "Female" ? "selected" : ""
          }>Female</option>
          <option value="Other" ${
            donorData.gender === "Other" ? "selected" : ""
          }>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Donor Type:</label>
        <select name="donor_type" ${disabledAttr}>
          <option value="">Choose</option>
          <option value="Ehi Center" ${
            donorData.donor_type === "Ehi Center" ? "selected" : ""
          }>Ehi Center</option>
          <option value="External Donor" ${
            donorData.donor_type === "External Donor" ? "selected" : ""
          }>External Donor</option>
        </select>
      </div>
      <div class="form-group">
        <label>Address:</label>
        <input type="text" name="address" value="${
          donorData.address || ""
        }" ${readonlyAttr}>
      </div>
      <div class="form-group">
        <label>Date:</label>
        <input type="date" name="date_created" value="${
          donorData.date_created || ""
        }" ${readonlyAttr}>
      </div>
      <div class="form-group">
        <label>Receipt/Cheque Number:</label>
        <input type="text" name="receipt_number" value="${
          donorData.receipt_number || ""
        }" ${readonlyAttr}>
      </div>
    </div>
  `;
}

function handleDonorTableAction(event) {
  const { action, itemId, pageKey } = event.detail;

  const donor = MOCK_FULL_DONOR_DATASET.find((d) => d.id === parseInt(itemId));

  if (!donor && action !== "add-new-donor") {
    // 'add-new-donor' doesn't need an existing donor
    console.warn(`Donor with ID ${itemId} not found for action ${action}.`);
    return;
  }

  switch (action) {
    case "add-donor-item":
      // Create a deep mutable copy of donor.items for editing in the modal
      let currentItems = JSON.parse(JSON.stringify(donor.items));

      /**
       * Renders the "Add Donor Item" modal content.
       */
      function renderAddDonorItemModal() {
        let tableRowsHtml = currentItems
          .map((item, index) => generateDonorItemTableRow(item, index, true))
          .join("");

        const modalContent = `
          <div class="add-donor-item-modal-content">
            <h4>Add Donation Items for ${donor.first_name} ${donor.last_name}</h4>
            <div class="table-responsive">
              <table class="items-table" id="add-item-table">
                <thead>
                  <tr>
                    <th>Item(s)</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Bags</th>
                    <th>Option</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRowsHtml}
                </tbody>
              </table>
            </div>
            <div class="modal-buttons-bottom">
              <button class="button button-secondary" id="add-item-row-btn">Add Row</button>
              <button class="button button-secondary" id="save-all-items-btn">Save All Items</button>
            </div>
          </div>
        `;

        openModal(
          modalContent,
          `Add Items for ${donor.first_name} ${donor.last_name}`,
          {
            showFooter: true,
            footerContent: `<button class="button button-secondary" id="add-item-close-btn">Close</button>`,
            onCloseCallback: () => {
              donorTableManager.refresh();
            },
          }
        );

        // Attach event listeners after modal is open and content is rendered
        const modalBodyElement = document.getElementById("app-modal-body"); // Get the actual modal body element
        if (modalBodyElement) {
          attachItemRowListeners(
            modalBodyElement,
            currentItems,
            renderAddDonorItemModal
          );
        }

        const addItemRowBtn = document.getElementById("add-item-row-btn");
        if (addItemRowBtn) {
          addItemRowBtn.addEventListener("click", () => {
            // Add a new item object with current date for the new row
            currentItems.push({
              date: new Date().toISOString().split("T")[0],
              item: "",
              quantity: 0,
              amount: 0,
              bags: 0,
            });
            renderAddDonorItemModal(); // Re-render the modal to show the new row
          });
        }

        const saveAllItemsBtn = document.getElementById("save-all-items-btn");
        if (saveAllItemsBtn) {
          saveAllItemsBtn.addEventListener("click", () => {
            // Filter out any completely empty rows (item, quantity, amount, bags are all empty/0)
            const filteredItems = currentItems.filter(
              (item) =>
                item.item ||
                item.quantity > 0 ||
                item.amount > 0 ||
                item.bags > 0
            );
            donor.items = filteredItems; 
            // In a real app, you'd send this to the backend
            closeModal(); 
          });
        }

        document
          .getElementById("add-item-close-btn")
          ?.addEventListener("click", closeModal);
      }
      renderAddDonorItemModal();
      break;

    case "view-donor-items":
      /**
       * Renders the "View Donor Items" modal content (read-only).
       */
      function renderViewDonorItemsModal() {
        const tableRowsHtml = donor.items
          .map(
            (item, index) => generateDonorItemTableRow(item, index, false) // Not editable
          )
          .join("");

        const modalContent = `
          <div class="view-donor-item-modal-content">
            <h4>Donation Items for ${donor.first_name} ${donor.last_name}</h4>
            ${
              donor.items.length === 0
                ? "<p>No donation items recorded for this donor.</p>"
                : `
              <div class="table-responsive">
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Item(s)</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Bags</th>
                      <th>Option</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRowsHtml}
                  </tbody>
                </table>
              </div>
            `
            }
          </div>
        `;

        openModal(
          modalContent,
          `View Items for ${donor.first_name} ${donor.last_name}`,
          {
            showFooter: true,
            footerContent: `<button class="button button-secondary" id="view-items-close-btn">Close</button>`,
            onCloseCallback: null,
          }
        );

        document
          .getElementById("view-items-close-btn")
          ?.addEventListener("click", closeModal);
      }
      renderViewDonorItemsModal();
      break;

    case "view-donor":
      // View donor (read-only)
      openModal(
        generateDonorForm(donor, false),
        `View Donor: ${donor.first_name} ${donor.last_name}`,
        {
          showFooter: true,
          footerContent:
            '<button class="button button-secondary" id="close-modal-btn">Close</button>',
          onCloseCallback: null,
        }
      );
      document
        .getElementById("close-modal-btn")
        ?.addEventListener("click", closeModal);
      break;

    case "edit-donor":
      const editModalContent = generateDonorForm(donor, true);

      openModal(
        editModalContent,
        `Edit Donor: ${donor.first_name} ${donor.last_name}`,
        {
          showFooter: true,
          footerContent: `
              <button class="button button-primary" id="save-donor-btn">Save Changes</button>
              <button class="button button-secondary" id="cancel-edit-btn">Cancel</button>
            `,
          onCloseCallback: null,
        }
      );

      document
        .getElementById("save-donor-btn")
        ?.addEventListener("click", () => {
          // Collect all form data
          const formData = {};
          document
            .querySelectorAll("#app-modal-body input, #app-modal-body select")
            .forEach((element) => {
              if (element.name) {
                formData[element.name] = element.value;
              }
            });

          // For edit donor modal, preserve existing items:
          formData.items = donor.items;

          // Update the donor in mock data
          const index = MOCK_FULL_DONOR_DATASET.findIndex(
            (d) => d.id === donor.id
          );
          if (index !== -1) {
            MOCK_FULL_DONOR_DATASET[index] = {
              ...MOCK_FULL_DONOR_DATASET[index], 
              ...formData,
            };
            donorTableManager.refresh();
          }

          closeModal();
        });

      document
        .getElementById("cancel-edit-btn")
        ?.addEventListener("click", closeModal);
      break;

    case "add-new-donor":
      const newDonor = generateBlankDonor();
      const addModalContent = generateDonorForm(newDonor, true);

      openModal(addModalContent, "Add New Donor", {
        showFooter: true,
        footerContent: `
              <button class="button button-primary" id="save-new-donor-btn">Save Donor</button>
              <button class="button button-secondary" id="cancel-add-btn">Cancel</button>
            `,
        onCloseCallback: null,
      });

      document
        .getElementById("save-new-donor-btn")
        ?.addEventListener("click", () => {
          // Collect all form data
          const formData = {};
          document
            .querySelectorAll("#app-modal-body input, #app-modal-body select")
            .forEach((element) => {
              if (element.name) {
                formData[element.name] = element.value;
              }
            });

          formData.items = [];

          // Add new donor to mock data
          const newId =
            MOCK_FULL_DONOR_DATASET.length > 0
              ? Math.max(...MOCK_FULL_DONOR_DATASET.map((d) => d.id)) + 1
              : 1;

          const newDonor = { id: newId, ...formData, receipt_url: "" };
          MOCK_FULL_DONOR_DATASET.push(newDonor);
          donorTableManager.refresh();

          closeModal();
        });

      document
        .getElementById("cancel-add-btn")
        ?.addEventListener("click", closeModal);
      break;

    case "delete-donor":
      openModal(
        `
        <p>Are you sure you want to delete donor <strong>${donor.first_name} ${donor.last_name}</strong>?</p>
      `,
        "Confirm Deletion",
        {
          showFooter: true,
          footerContent: `
          <button class="button button-danger" id="confirm-delete-btn">Delete</button>
          <button class="button button-secondary" id="cancel-delete-btn">Cancel</button>
        `,
          onCloseCallback: null,
        }
      );

      document
        .getElementById("confirm-delete-btn")
        ?.addEventListener("click", () => {
          const index = MOCK_FULL_DONOR_DATASET.findIndex(
            (d) => d.id === parseInt(itemId)
          );
          if (index > -1) {
            MOCK_FULL_DONOR_DATASET.splice(index, 1); // Remove from mock data
          }
          donorTableManager.refresh(); // Refresh the table
          closeModal();
        });
      document
        .getElementById("cancel-delete-btn")
        ?.addEventListener("click", closeModal);
      break;

    default:
      console.warn(`Unhandled action: ${action}`);
  }
}

// --- New Functionality: Add New Donor (using the multi-view modal) ---
function handleAddNewDonor() {
  window.dispatchEvent(
    new CustomEvent("tableAction", {
      detail: {
        action: "add-new-donor",
        itemId: null,
        pageKey: "donorData",
      },
    })
  );
}

// --- New Functionality: View Total Items ---
function handleViewTotalItems() {

  // Headers for the "View Total Items" modal table as specified: category (the item), quantity, and bag
  const headers = ["S/N", "Category (Item)", "Quantity", "Bag"];

  // Generate table rows HTML for the MOCK_FULL_DONOR_ITEMS_DATASET
  const tableRowsHtml = MOCK_FULL_DONOR_ITEMS_DATASET.map((item, index) => {
    let quantityDisplay = "N/A";
    if (item.quantity !== null && item.quantity !== undefined) {
      if (item.category === "Rice" || item.category === "Beans") {
        quantityDisplay = item.quantity + "kg";
      } else if (item.category === "Clothes") {
        quantityDisplay = item.quantity + "pcs";
      } else if (item.category === "Medication") {
        quantityDisplay = item.quantity + "packs";
      } else if (item.category === "Cash") {
        quantityDisplay = item.quantity; // Cash usually doesn't have a quantity unit
      } else {
        quantityDisplay = item.quantity;
      }
    }
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${item.category || "N/A"}</td>
        <td>${quantityDisplay}</td>
        <td>${item.bag !== null && item.bag !== undefined ? item.bag : "N/A"}</td>
      </tr>
    `;
  }).join("");

  // Construct the table HTML
  const tableHtml = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        ${headers
                          .map((header) => `<th>${header}</th>`)
                          .join("")}
                    </tr>
                </thead>
                <tbody>
                    ${tableRowsHtml}
                </tbody>
            </table>
        </div>
    `;

  openModal(tableHtml, "Total Donated Items", {
    showFooter: true,
    footerContent:
      '<button class="button button-primary" onclick="closeModal()">Close</button>',
  });
}

export function initDonors() {
  donorTableManager.init();

  // Add a global event listener for table actions specific to this page
  window.removeEventListener("tableAction", handleDonorTableAction);
  window.addEventListener("tableAction", handleDonorTableAction);

  // Get the "Add New Donor" button and attach its event listener
  const addNewDonorButton = document.getElementById("add-new-donor-btn");
  if (addNewDonorButton) {
    addNewDonorButton.removeEventListener("click", handleAddNewDonor);
    addNewDonorButton.addEventListener("click", handleAddNewDonor);
  } else {
    console.warn("Add New Donor button with ID 'add-new-donor-btn' not found.");
  }

  // Get the "View Total Items" button and attach its event listener
  const viewTotalItemsButton = document.getElementById("view-total-items-btn");
  if (viewTotalItemsButton) {
    viewTotalItemsButton.removeEventListener("click", handleViewTotalItems);
    viewTotalItemsButton.addEventListener("click", handleViewTotalItems);
  } else {
    console.warn(
      "View Total Items button with ID 'view-total-items-btn' not found."
    );
  }
}
