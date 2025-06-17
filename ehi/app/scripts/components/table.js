/**
 * Generates an HTML table from the provided data and headers.
 *
 * @param {string} containerId - The ID of the HTML element where the table will be rendered.
 * @param {object} options - Configuration object.
 * @param {Array<object>} options.tableData - The data to display in the table. REQUIRED.
 * @param {Array<string>} [options.headers] - The table headers. If not provided, they will be derived from the first data item.
 * @param {Array<string>} [options.dropdownActions] - The actions to show in the dropdown menu for each row.
 * @param {string} [options.pageKey] - A string identifying the page. Useful for event handling.
 * @param {number} [options.startSN = 1001] - The starting serial number for the entire dataset.
 * @param {number} [options.offset = 0] - The offset of the current page's data within the entire dataset.
 * @param {boolean} [options.hasSelectColumn = false] - Whether to include a Select checkbox column as the last column.
 *
 * @throws {Error} If tableData is not provided or is empty.
 */
export function generateTable(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Table container #${containerId} not found`);
    return;
  }

  const {
    tableData,
    headers,
    dropdownActions = [],
    pageKey = "",
    startSN = 1001,
    offset = 0,
    hasSelectColumn = false,
  } = options;

  if (!tableData || tableData.length === 0) {
    container.innerHTML = '<p class="no-data">No data available</p>';
    return;
  }

  // Determine the final headers
  let finalHeaders = [];
  if (headers && headers.length > 0) {
    if (headers[0] !== "S/N") {
      finalHeaders = ["S/N", ...headers.filter((h) => h !== "S/N")];
    } else {
      finalHeaders = [...headers];
    }
  } else {
    finalHeaders = [
      "S/N",
      ...Object.keys(tableData[0]).map((key) => key.replace(/_/g, " ")),
    ];
    finalHeaders = [...new Set(finalHeaders)]; // Remove duplicates
  }

  const table = document.createElement("table");
  table.className = "data-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  finalHeaders.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    if (header === "Receipt") {
      th.textContent += "(CR)";
    }
    headerRow.appendChild(th);
  });

  if (dropdownActions.length > 0) {
    const th = document.createElement("th");
    th.textContent = "Actions";
    headerRow.appendChild(th);
  }

  if (hasSelectColumn) {
    const th = document.createElement("th");
    th.textContent = "Select";
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  tableData.forEach((item, index) => {
    const row = document.createElement("tr");

    finalHeaders.forEach((header) => {
      const td = document.createElement("td");
      const dataKey = header.toLowerCase().replace(/\s+/g, "_");

      if (header === "S/N") {
        td.textContent = startSN + offset + index;
      } else {
        switch (dataKey) {
          case "image":
            const img = document.createElement("img");
            img.src = item[dataKey];
            img.alt = "Image";
            td.appendChild(img);
            break;
          case "email":
            td.classList.add("email", "clamp");
            td.textContent = item[dataKey] || "—";
            break;
          case "address":
          case "location":
          case "date":
            td.classList.add("clamp");
            td.textContent = item[dataKey] || "—";
            break;
          case "status":
            if (item[dataKey] && item[dataKey].toLowerCase() === "claimed") {
              td.classList.add("claimed");
            }
            td.textContent = item[dataKey] || "—";
            break;
          case "item_category":
            if (
              item[dataKey] &&
              Array.isArray(item[dataKey]) &&
              item[dataKey].length > 0
            ) {
              const categoryToggle = document.createElement("span");
              categoryToggle.classList.add("item-category-toggle");
              categoryToggle.textContent = "Click to preview...";
              td.appendChild(categoryToggle);

              const nestedTableDropdown = document.createElement("div");
              nestedTableDropdown.classList.add("nested-table-dropdown");

              function hideNest() {
                nestedTableDropdown.style.display = "none";
              }
              hideNest();

              const innerTable = createNestedTable(item[dataKey]);
              nestedTableDropdown.appendChild(innerTable);

              const closeButton = document.createElement("button");
              closeButton.classList.add("close", "button");
              closeButton.textContent = "Close";
              nestedTableDropdown.appendChild(closeButton);
              td.appendChild(nestedTableDropdown);

              categoryToggle.addEventListener("click", (e) => {
                document
                  .querySelectorAll(".nested-table-dropdown")
                  .forEach((otherDropdown) => {
                    if (otherDropdown !== nestedTableDropdown) {
                      otherDropdown.style.display = "none";
                    }
                  });

                nestedTableDropdown.style.display =
                  nestedTableDropdown.style.display === "block"
                    ? "none"
                    : "block";
              });
              closeButton.addEventListener("click", () => {
                nestedTableDropdown.style.display = "none";
              });
            } else {
              td.textContent = item[dataKey] ? item[dataKey].text || "—" : "—";
            }
            break;
          case "view":
            const viewLink = document.createElement("button");
            viewLink.innerHTML = item[dataKey] || "View";
            viewLink.className = item[dataKey] ? "" : "view-icon";
            td.appendChild(viewLink);
            break;
          default:
            td.textContent = item[dataKey] || "—";
            break;
        }
      }
      row.appendChild(td);
    });

    if (dropdownActions.length > 0) {
      const td = document.createElement("td");
      td.appendChild(createDropdownMenu(item.id, dropdownActions, pageKey));
      row.appendChild(td);
    }

    if (hasSelectColumn) {
      const td = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "select-checkbox";
      checkbox.dataset.itemId = item.id;
      td.appendChild(checkbox);
      row.appendChild(td);
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.innerHTML = "";
  container.appendChild(table);
}

/**
 * Creates a nested table for item categories.
 * @param {Array<object>} items - Array of objects with 'item', 'quantity', 'unit' keys.
 * @returns {HTMLTableElement} The generated nested table.
 */
function createNestedTable(items) {
  const nestedTable = document.createElement("table");
  nestedTable.classList.add("inner-table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Item", "Quantity", "Unit"].forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  nestedTable.appendChild(thead);

  const tbody = document.createElement("tbody");
  items.forEach((item) => {
    const row = document.createElement("tr");
    const itemTd = document.createElement("td");
    itemTd.textContent = item.item || "—";
    const quantityTd = document.createElement("td");
    quantityTd.textContent = item.quantity || "—";
    const unitTd = document.createElement("td");
    unitTd.textContent = item.unit || "—";

    row.append(itemTd, quantityTd, unitTd);
    tbody.appendChild(row);
  });
  nestedTable.appendChild(tbody);

  return nestedTable;
}

function createDropdownMenu(itemId, actions, pageKey) {
  const container = document.createElement("div");
  container.className = "dropdown-container";

  const button = document.createElement("button");
  button.className = "dropdown-toggle";
  button.innerHTML = "⋮";

  const menu = document.createElement("ul");
  menu.className = "dropdown-menu";

  actions.forEach((action) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = action;
    a.dataset.action = action.toLowerCase().replace(/\s+/g, "-");
    a.dataset.itemId = itemId;
    a.dataset.page = pageKey;
    li.appendChild(a);
    menu.appendChild(li);
  });

  container.append(button, menu);
  return container;
}

// Initialize dropdown handlers once
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-toggle")) {
    e.preventDefault();
    const menu = e.target.nextElementSibling;
    document.querySelectorAll(".dropdown-menu").forEach((m) => {
      if (m !== menu) m.style.display = "none";
    });
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }

  if (!e.target.closest(".dropdown-container")) {
    document.querySelectorAll(".dropdown-menu").forEach((m) => {
      m.style.display = "none";
    });
  }

  if (
    !e.target.classList.contains("item-category-toggle") &&
    !e.target.closest(".nested-table-dropdown")
  ) {
    document.querySelectorAll(".nested-table-dropdown").forEach((m) => {
      m.style.display = "none";
    });
  }

  if (e.target.hasAttribute("data-action")) {
    e.preventDefault();
    const action = e.target.dataset.action;
    const itemId = e.target.dataset.itemId;
    const pageKey = e.target.dataset.page;

    window.dispatchEvent(
      new CustomEvent("tableAction", {
        detail: { action, itemId, pageKey },
      })
    );
  }
});
