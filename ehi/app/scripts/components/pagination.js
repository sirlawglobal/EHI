// app/scripts/components/pagination.js

/**
 * Renders pagination controls including a "Rows per page" dropdown.
 * This component emits custom events for changes:
 * - 'pagination:rowsPerPageChange' when the dropdown value changes.
 * - 'pagination:pageChange' when a page navigation button is clicked.
 *
 * @param {string} containerId - The ID of the HTML element where pagination controls will be rendered.
 * @param {object} options - Configuration options for pagination.
 * @param {number} options.totalItems - The total number of items in the dataset.
 * @param {number} options.currentPage - The current active page number (1-indexed).
 * @param {number} options.itemsPerPage - The current number of items to display per page.
 */
export function renderPagination(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Pagination container #${containerId} not found.`);
    return;
  }

  const { totalItems, currentPage, itemsPerPage } = options;

  // Calculate total pages based on the full dataset and current items per page
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  container.innerHTML = ""; // Clear previous pagination controls

  const paginationWrapper = document.createElement("div");
  paginationWrapper.className = "pagination-wrapper";

  // --- Rows per page Dropdown ---
  const rowsPerPageDiv = document.createElement("div");
  rowsPerPageDiv.className = "rows-per-page-control";
  rowsPerPageDiv.innerHTML = `
    <label for="items-per-page-select">Rows per page:</label>
    <select id="items-per-page-select" class="pagination-select">
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  `;
  const selectElement = rowsPerPageDiv.querySelector("#items-per-page-select");
  selectElement.value = itemsPerPage; // Set current value
  selectElement.addEventListener("change", (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    // Dispatch custom event for rows per page change
    container.dispatchEvent(
      new CustomEvent("pagination:rowsPerPageChange", {
        detail: { newItemsPerPage: newItemsPerPage },
      })
    );
  });
  paginationWrapper.appendChild(rowsPerPageDiv);

  // --- Page Navigation Controls ---
  const paginationNav = document.createElement("nav");
  paginationNav.className = "pagination-nav";
  paginationNav.setAttribute("aria-label", "Table Pagination");

  const ul = document.createElement("ul");
  ul.className = "pagination-list";

  if (totalPages > 1) {
    // Only render page buttons if more than one page
    // --- Previous Button ---
    const prevLi = document.createElement("li");
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.className = "pagination-button";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
      container.dispatchEvent(
        new CustomEvent("pagination:pageChange", {
          detail: { newPage: currentPage - 1 },
        })
      );
    });
    prevLi.appendChild(prevButton);
    ul.appendChild(prevLi);

    // --- Page Numbers ---
    const maxPageButtons = 5; // Max number of page buttons to show (e.g., 1 2 3 ... 10)
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust startPage if we hit the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    if (startPage > 1) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = "1";
      button.className = "pagination-button";
      button.addEventListener("click", () => {
        container.dispatchEvent(
          new CustomEvent("pagination:pageChange", {
            detail: { newPage: 1 },
          })
        );
      });
      li.appendChild(button);
      ul.appendChild(li);
      if (startPage > 2) {
        const ellipsis = document.createElement("li");
        ellipsis.textContent = "...";
        ellipsis.className = "pagination-ellipsis";
        ul.appendChild(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = i;
      button.className = "pagination-button";
      if (i === currentPage) {
        button.classList.add("active");
        button.setAttribute("aria-current", "page");
      }
      button.addEventListener("click", () => {
        container.dispatchEvent(
          new CustomEvent("pagination:pageChange", {
            detail: { newPage: i },
          })
        );
      });
      li.appendChild(button);
      ul.appendChild(li);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement("li");
        ellipsis.textContent = "...";
        ellipsis.className = "pagination-ellipsis";
        ul.appendChild(ellipsis);
      }
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = totalPages;
      button.className = "pagination-button";
      button.addEventListener("click", () => {
        container.dispatchEvent(
          new CustomEvent("pagination:pageChange", {
            detail: { newPage: totalPages },
          })
        );
      });
      li.appendChild(button);
      ul.appendChild(li);
    }

    // --- Next Button ---
    const nextLi = document.createElement("li");
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = "pagination-button";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
      container.dispatchEvent(
        new CustomEvent("pagination:pageChange", {
          detail: { newPage: currentPage + 1 },
        })
      );
    });
    nextLi.appendChild(nextButton);
    ul.appendChild(nextLi);
  }

  paginationNav.appendChild(ul);
  paginationWrapper.appendChild(paginationNav);
  container.appendChild(paginationWrapper);
}
