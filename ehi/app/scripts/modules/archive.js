// app/scripts/modules/archive.js

import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { openModal, closeModal } from "../components/modal.js";
import { formatDateForDisplay } from "../utils/formatters.js";

// --- MOCK DATA ---
let archiveData = [
  {
    id: 1,
    date: "2025-03-28",
    s_n: "1001",
    image: "https://picsum.photos/20",
    first_name: "Ron",
    last_name: "Waz",
    pin: 1004343,
    gender: "female",
  },
  {
    id: 2,
    date: "2025-04-01",
    s_n: "1002",
    image: "https://picsum.photos/20",
    first_name: "Hermione",
    last_name: "Granger",
    pin: 1004344,
    gender: "female",
  },
  {
    id: 3,
    date: "2025-04-02",
    s_n: "1003",
    image: "https://picsum.photos/20",
    first_name: "Harry",
    last_name: "Potter",
    pin: 1004345,
    gender: "male",
  },
];

let donorData = []; // Mock donor dataset

// --- TABLE CONFIG ---
const archiveHeaders = [
  "Date",
  "S/N",
  "Image",
  "First Name",
  "Last Name",
  "Pin",
  "Gender",
];
const archiveDropdownActions = ["restore", "delete"];
let archiveTableManager;

// --- FETCH FUNCTION ---
async function fetchArchiveData(limit, offset, searchFilter = "") {
  let filteredData = [...archiveData];

  if (searchFilter) {
    searchFilter = searchFilter.toLowerCase();
    filteredData = filteredData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchFilter)
      )
    );
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedData = filteredData.slice(offset, offset + limit);
      const transformedData = paginatedData.map((item) => ({
        id: item.id,
        date: formatDateForDisplay(item.date),
        s_n: item.s_n,
        image: item.image,
        first_name: item.first_name,
        last_name: item.last_name,
        pin: item.pin,
        gender: item.gender,
        _original: item,
      }));
      
      resolve({
        data: transformedData,
        totalItems: filteredData.length,
      });
    }, 300);
  });
}

// --- MODAL HANDLER ---
function handleArchiveModal(action, ids) {
  const isBulk = Array.isArray(ids);
  const idArray = isBulk ? ids : [ids];

  if (idArray.length === 0) {
    console.warn("No items selected for action:", action);
    return;
  }

  const items = archiveData.filter((item) =>
    idArray.includes(parseInt(item.id))
  );
  if (items.length === 0) {
    console.warn(`No items found for IDs: ${idArray}`);
    return;
  }

  const isRestore = action === "restore";
  const actionText = isRestore ? "Restore" : "Delete";
  const count = items.length;
  const donorText = count === 1 ? "Donor" : "Donors";
  const itemNames =
    count === 1
      ? `${items[0].first_name} ${items[0].last_name}`
      : `${count} selected donors`;
  const buttonClass = isRestore ? "button-primary" : "button-danger";
  const buttonId = isRestore ? "confirm-restore-btn" : "confirm-delete-btn";

  openModal(
    `<p>Are you sure you want to ${actionText.toLowerCase()} <strong>${itemNames}</strong>?</p>`,
    `Confirm ${actionText} ${count} ${donorText}`,
    {
      showFooter: true,
      footerContent: `
        <button class="button ${buttonClass}" id="${buttonId}" data-item-ids="${idArray.join(
        ","
      )}" data-item-type="archive">${actionText}</button>
        <button class="button button-secondary modal-cancel-btn">Cancel</button>
      `,
      onCloseCallback: null,
    }
  );

  setTimeout(() => {
    const confirmBtn = document.getElementById(buttonId);
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        if (isRestore) {
          restoreArchiveEntry(idArray);
        } else {
          deleteArchiveEntry(idArray);
        }
        closeModal();
      });
    }
  }, 50);
}

// --- DATA OPERATIONS ---
function restoreArchiveEntry(ids) {
  const idArray = Array.isArray(ids)
    ? ids.map((id) => parseInt(id))
    : [parseInt(ids)];
  const items = archiveData.filter((item) => idArray.includes(item.id));

  if (items.length === 0) {
    console.warn(`No items found for restore with IDs: ${idArray}`);
    return;
  }

  archiveData = archiveData.filter((item) => !idArray.includes(item.id));
  donorData.push(...items);
  archiveTableManager.refresh();
}

function deleteArchiveEntry(ids) {
  const idArray = Array.isArray(ids)
    ? ids.map((id) => parseInt(id))
    : [parseInt(ids)];
  const initialLength = archiveData.length;

  archiveData = archiveData.filter((item) => !idArray.includes(item.id));

  if (archiveData.length < initialLength) {
    archiveTableManager.refresh();
  } else {
    console.warn(`No items found for deletion with IDs: ${idArray}`);
  }
}

// --- TABLE ACTION HANDLER ---
function handleTableAction(event) {
  const { action, itemId, pageKey } = event.detail;
  if (pageKey !== "archive") return;

  switch (action) {
    case "restore":
    case "delete":
      handleArchiveModal(action, parseInt(itemId));
      break;
    default:
      console.warn(`Unhandled action: ${action} for archive with ID ${itemId}`);
  }
}

// --- INITIALIZATION ---
export function initArchive() {

  const tableContainer = document.getElementById("table-container");
  if (tableContainer) {
    archiveTableManager = createPaginatedTableManager(
      "table-container",
      "archive-pagination-container",
      {
        fetchDataFunction: fetchArchiveData,
        tableHeaders: archiveHeaders,
        dropdownActions: archiveDropdownActions,
        pageKey: "archive",
        defaultItemsPerPage: 25,
        hasSelectColumn: true,
      }
    );
    archiveTableManager.init();

    // Search input
    const searchInput = document.querySelector(
      ".archive-content .search-input"
    );
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        archiveTableManager.setSearchFilter(e.target.value);
      });
    } else {
      console.warn("Search input (.archive-content .search-input) not found");
    }

    // Select All checkbox
    const selectAllCheckbox = document.getElementById("select");
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(".select-checkbox");
        checkboxes.forEach((checkbox) => {
          checkbox.checked = isChecked;
        });
      });
    } else {
      console.warn("Select All checkbox (#select) not found");
    }

    // Row checkbox listener (delegated)
    tableContainer.addEventListener("change", (e) => {
      if (e.target.classList.contains("select-checkbox")) {
        const checkboxes = document.querySelectorAll(".select-checkbox");
        const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
        const selectAll = document.getElementById("select");
        if (selectAll) {
          selectAll.checked = allChecked;
        }
      }
    });

    // Bulk action buttons
    const restoreButton = document.querySelector(
      ".archive-content .buttons .button:nth-child(1)"
    );
    const deleteButton = document.querySelector(
      ".archive-content .buttons .button:nth-child(2)"
    );

    if (restoreButton) {
      restoreButton.addEventListener("click", () => {
        const selectedIds = Array.from(
          document.querySelectorAll(".select-checkbox:checked")
        ).map((cb) => parseInt(cb.dataset.itemId));
        if (selectedIds.length > 0) {
          handleArchiveModal("restore", selectedIds);
        } else {
          console.warn("No items selected for bulk restore");
          openModal(
            `<p>Please select at least one donor to restore.</p>`,
            `No Donors Selected`,
            {
              showFooter: true,
              footerContent: `<button class="button button-secondary modal-cancel-btn">OK</button>`,
            }
          );
        }
      });
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        const selectedIds = Array.from(
          document.querySelectorAll(".select-checkbox:checked")
        ).map((cb) => parseInt(cb.dataset.itemId));
        if (selectedIds.length > 0) {
          handleArchiveModal("delete", selectedIds);
        } else {
          console.warn("No items selected for bulk delete");
          openModal(
            `<p>Please select at least one donor to delete.</p>`,
            `No Donors Selected`,
            {
              showFooter: true,
              footerContent: `<button class="button button-secondary modal-cancel-btn">OK</button>`,
            }
          );
        }
      });
    }
  } else {
    console.error("Table container (#table-container) not found");
  }

  // Attach table action listener
  window.removeEventListener("tableAction", handleTableAction);
  window.addEventListener("tableAction", handleTableAction);
}
