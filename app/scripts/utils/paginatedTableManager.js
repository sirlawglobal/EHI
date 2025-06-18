// app/scripts/utils/paginatedTableManager.js

import { generateTable } from "../components/table.js";
import { renderPagination } from "../components/pagination.js";

/**
 * Creates and manages a paginated table view, handling data fetching,
 * pagination state, and rendering.
 *
 * @param {string} tableContainerId - The ID of the HTML element where the table will be rendered.
 * @param {string} paginationContainerId - The ID of the HTML element where pagination controls will be rendered.
 * @param {object} options - Configuration options for the paginated table.
 * @param {Function} options.fetchDataFunction - An async function that takes (limit, offset) as arguments
 * and returns a Promise resolving to { data: Array<object>, totalItems: number }.
 * @param {Array<string>} options.tableHeaders - The headers for the table.
 * @param {Array<string>} [options.dropdownActions=[]] - Actions for each row's dropdown menu.
 * @param {string} [options.pageKey=''] - A key identifying the page for event handling.
 * @param {number} [options.startSN=1001] - The starting serial number for the entire dataset.
 * @param {number} [options.defaultItemsPerPage=25] - The initial number of items to display per page.
 */
export function createPaginatedTableManager(
  tableContainerId,
  paginationContainerId,
  options
) {
  const {
    fetchDataFunction,
    tableHeaders,
    dropdownActions = [],
    pageKey = "",
    startSN = 1001,
    defaultItemsPerPage = 25,
    hasSelectColumn = false,
  } = options;

  // --- Internal State for Pagination ---
  let currentPage = 1;
  let itemsPerPage = defaultItemsPerPage;
  let totalItems = 0;

  const tableContainer = document.getElementById(tableContainerId);
  const paginationContainer = document.getElementById(paginationContainerId);

  if (!tableContainer || !paginationContainer) {
    console.error(
      `PaginatedTableManager: Required containers (table: #${tableContainerId}, pagination: #${paginationContainerId}) not found.`
    );
    return; // Exit if containers are missing
  }

  /**
   * Renders the table and pagination controls based on the current state.
   * This function initiates the backend API request.
   */
  async function renderTableAndPagination() {
    // Show loading message
    tableContainer.innerHTML = '<p class="loading">Loading data...</p>';
    paginationContainer.innerHTML = ""; // Clear pagination while loading

    try {
      const offset = (currentPage - 1) * itemsPerPage; // Calculate offset for API
      const response = await fetchDataFunction(itemsPerPage, offset); // Fetch data with limit and offset
      const paginatedData = response.data;
      totalItems = response.totalItems; // Update totalItems from backend response

      // Ensure currentPage is valid after fetch (e.g., if total items changed or page became empty)
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages; // Go to last page if current page is now out of bounds
        // Re-fetch if page changed due to bounds adjustment
        if (offset !== (currentPage - 1) * itemsPerPage) {
          await renderTableAndPagination();
          return; // Exit to prevent double-render
        }
      } else if (totalPages === 0) {
        currentPage = 1; // If no items, ensure page is 1
      }

      // Render the table
      generateTable(tableContainerId, {
        tableData: paginatedData,
        headers: tableHeaders,
        dropdownActions: dropdownActions,
        pageKey: pageKey,
        startSN: startSN,
        offset: offset,
        hasSelectColumn: hasSelectColumn,
      });

      // Render pagination controls
      renderPagination(paginationContainerId, {
        totalItems: totalItems,
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
      });

      // Re-attach event listeners to the pagination container
      // Remove previous listeners to prevent duplicates if this function is called multiple times
      paginationContainer.removeEventListener(
        "pagination:rowsPerPageChange",
        handleRowsPerPageChange
      );
      paginationContainer.removeEventListener(
        "pagination:pageChange",
        handlePageChange
      );

      paginationContainer.addEventListener(
        "pagination:rowsPerPageChange",
        handleRowsPerPageChange
      );
      paginationContainer.addEventListener(
        "pagination:pageChange",
        handlePageChange
      );
    } catch (error) {
      console.error(
        `PaginatedTableManager: Error rendering data for ${pageKey}:`,
        error
      );
      tableContainer.innerHTML = '<p class="error">Failed to load data.</p>';
      paginationContainer.innerHTML = "";
    }
  }

  /**
   * Event handler for when the "Rows per page" dropdown changes.
   * This triggers a new backend fetch with the new limit.
   * @param {CustomEvent} event - The custom event from the pagination component.
   */
  async function handleRowsPerPageChange(event) {
    const newItemsPerPage = event.detail.newItemsPerPage;
    itemsPerPage = newItemsPerPage;
    currentPage = 1; // Always reset to first page when items per page changes
    await renderTableAndPagination(); // Re-render with new settings (will trigger fetch)
  }

  /**
   * Event handler for when a page navigation button is clicked.
   * This triggers a new backend fetch with the new offset.
   * @param {CustomEvent} event - The custom event from the pagination component.
   */
  async function handlePageChange(event) {
    const newPage = event.detail.newPage;
    currentPage = newPage;
    await renderTableAndPagination(); // Re-render with new page (will trigger fetch)
  }

  // --- Public Interface ---
  return {
    /**
     * Initializes the paginated table. Should be called when the page/module loads.
     */
    init: () => {
      currentPage = 1; // Reset state on init
      itemsPerPage = defaultItemsPerPage;
      totalItems = 0;
      renderTableAndPagination(); // Perform initial fetch and render
    },
    /**
     * Allows forcing a re-render and re-fetch of data. Useful if external filters change.
     */
    refresh: () => {
      renderTableAndPagination();
    },
    /**
     * Allows setting a new current page and refreshing the view.
     * @param {number} pageNum - The page number to navigate to.
     */
    goToPage: (pageNum) => {
      if (pageNum > 0 && pageNum <= Math.ceil(totalItems / itemsPerPage)) {
        currentPage = pageNum;
        renderTableAndPagination();
      } else {
        console.warn(`PaginatedTableManager: Invalid page number: ${pageNum}`);
      }
    },
  };
}
