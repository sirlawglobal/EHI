// app/scripts/modules/finance.js

import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { openModal, closeModal } from "../components/modal.js";
import { formatDateForDisplay } from "../utils/formatters.js";

// --- MOCK DATA ---
let MOCK_FINANCE_DATASET = [
  {
    id: 1,
    name: "Office Equipment",
    category: "asset",
    amount: 5000,
    date: "2025-01-10",
  },
  {
    id: 2,
    name: "Cash on Hand",
    category: "asset",
    amount: 15000,
    date: "2025-01-01",
  },
  {
    id: 3,
    name: "Accounts Receivable",
    category: "asset",
    amount: 7500,
    date: "2025-02-01",
  },
  {
    id: 4,
    name: "Bank Loan",
    category: "liability",
    amount: 10000,
    date: "2025-01-05",
  },
  {
    id: 5,
    name: "Accounts Payable",
    category: "liability",
    amount: 3000,
    date: "2025-02-15",
  },
  {
    id: 6,
    name: "Inventory",
    category: "asset",
    amount: 8000,
    date: "2025-03-01",
  },
  {
    id: 7,
    name: "Credit Card Debt",
    category: "liability",
    amount: 2000,
    date: "2025-03-10",
  },
  {
    id: 8,
    name: "Investments",
    category: "asset",
    amount: 20000,
    date: "2025-04-01",
  },
];

let MOCK_RECEIPTS_DATASET = [
  {
    id: 1,
    date: "2025-04-20",
    receipt_type: "Bank Transfer",
    donor_name: "Roonil",
    amount: 300000,
  },
  {
    id: 2,
    date: "2025-04-21",
    receipt_type: "Cash",
    donor_name: "Wazlib",
    amount: 150000,
  },
  {
    id: 3,
    date: "2025-04-22",
    receipt_type: "Bank Transfer",
    donor_name: "Roolib",
    amount: 200000,
  },
  {
    id: 4,
    date: "2025-04-23",
    receipt_type: "Cash",
    donor_name: "Hermione",
    amount: 50000,
  },
  {
    id: 5,
    date: "2025-04-24",
    receipt_type: "Bank Transfer",
    donor_name: "Harry",
    amount: 100000,
  },
];

let MOCK_EXPENSES_DATASET = [
  {
    id: 1,
    date: "2025-04-20",
    payment_details: "Office Supplies",
    amount: 50000,
    payment_type: "Card Payment",
  },
  {
    id: 2,
    date: "2025-04-21",
    payment_details: "Rent",
    amount: 100000,
    payment_type: "Bank Transfer",
  },
  {
    id: 3,
    date: "2025-04-22",
    payment_details: "Salaries",
    amount: 250000,
    payment_type: "Bank Transfer",
  },
  {
    id: 4,
    date: "2025-04-23",
    payment_details: "Utilities",
    amount: 20000,
    payment_type: "Cash",
  },
  {
    id: 5,
    date: "2025-04-24",
    payment_details: "Consulting Fees",
    amount: 75000,
    payment_type: "Card Payment",
  },
];

// --- Route Detection ---
let isReceiptReportPage = false;
let isExpensesReportPage = false;
let financeInitialized = false;
let financeTableActionHandler = null;

function checkRoute() {
  const pathname = window.location.pathname;
  const title = document.title;
  isReceiptReportPage =
    pathname.includes("/reports/receipt-report") ||
    title === "Report > Receipt Report";
  isExpensesReportPage =
    pathname.includes("/reports/expenses-report") ||
    title === "Report > Expenses Report";
  return { isReceiptReportPage, isExpensesReportPage };
}

// --- TABLE HEADERS & ACTIONS ---
const financeHeaders = ["Name", "Category", "Amount", "Date"];
const receiptHeaders = ["Date", "Donor Name", "Amount", "Receipt Type"];
const expenseHeaders = ["Date", "Payment Details", "Amount", "Payment Type"];
const financeDropdownActions = ["view", "edit", "delete"];

// --- PAGINATION MANAGERS ---
let assetsTableManager;
let liabilityTableManager;
let receiptsTableManager;
let expensesTableManager;

// --- FILTER STATE ---
let financeFilters = { fromDate: "", toDate: "", search: "" };

// --- TRANSFORM FUNCTIONS (for table display) ---
function transformFinanceForTable(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    amount: `₦${item.amount.toLocaleString()}`,
    date: formatDateForDisplay(item.date),
    _original: item,
  };
}

function transformReceiptsForTable(item) {
  return {
    id: item.id,
    date: formatDateForDisplay(item.date),
    donor_name: item.donor_name,
    amount: `₦${item.amount.toLocaleString()}`,
    receipt_type: item.receipt_type,
    _original: item,
  };
}

function transformExpensesForTable(item) {
  return {
    id: item.id,
    date: formatDateForDisplay(item.date),
    payment_details: item.payment_details,
    amount: `₦${item.amount.toLocaleString()}`,
    payment_type: item.payment_type,
    _original: item,
  };
}

// --- FETCH FUNCTIONS (for paginatedTableManager) ---
async function fetchFinanceData(type, limit, offset, searchFilter = "") {
  let filteredData = [];
  if (type === "asset") {
    filteredData = MOCK_FINANCE_DATASET.filter(
      (item) => item.category === "asset"
    );
  } else if (type === "liability") {
    filteredData = MOCK_FINANCE_DATASET.filter(
      (item) => item.category === "liability"
    );
  } else if (type === "receipt") {
    filteredData = MOCK_RECEIPTS_DATASET;
  } else if (type === "expense") {
    filteredData = MOCK_EXPENSES_DATASET;
  }

  // Apply date filters for report routes
  if (
    (type === "receipt" && isReceiptReportPage) ||
    (type === "expense" && isExpensesReportPage)
  ) {
    if (financeFilters.fromDate || financeFilters.toDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        const fromDate = financeFilters.fromDate
          ? new Date(financeFilters.fromDate)
          : new Date("1900-01-01");
        const toDate = financeFilters.toDate
          ? new Date(financeFilters.toDate)
          : new Date("9999-12-31");
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
  }

  // Apply search filter (case-insensitive, basic text search)
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
      let transformedData;
      if (type === "asset" || type === "liability") {
        transformedData = paginatedData.map(transformFinanceForTable);
      } else if (type === "receipt") {
        transformedData = paginatedData.map(transformReceiptsForTable);
      } else if (type === "expense") {
        transformedData = paginatedData.map(transformExpensesForTable);
      }

      resolve({
        data: transformedData,
        totalItems: filteredData.length,
      });
    }, 300);
  });
}

// --- SUMMARY METRICS ---
function updateSummaryMetrics() {
  let assetsValue = 0;
  let liabilityValue = 0;
  let totalReceipt = 0;
  let totalExpenses = 0;

  MOCK_FINANCE_DATASET.forEach((item) => {
    if (item.category === "asset") {
      assetsValue += item.amount;
    } else if (item.category === "liability") {
      liabilityValue += item.amount;
    }
  });

  MOCK_RECEIPTS_DATASET.forEach((item) => {
    totalReceipt += item.amount;
  });

  MOCK_EXPENSES_DATASET.forEach((item) => {
    totalExpenses += item.amount;
  });

  const balance = assetsValue - liabilityValue;

  const assetsValueDisplayElement = document.getElementById("assetValue");
  if (assetsValueDisplayElement) {
    assetsValueDisplayElement.textContent = `₦${assetsValue.toLocaleString()}`;
  }

  const liabilityValueDisplayElement =
    document.getElementById("liabilityValue");
  if (liabilityValueDisplayElement) {
    liabilityValueDisplayElement.textContent = `₦${liabilityValue.toLocaleString()}`;
  }

  const balanceDisplayElement = document.getElementById("balance");
  if (balanceDisplayElement) {
    balanceDisplayElement.classList.remove(
      "positive-balance",
      "negative-balance"
    );
    if (balance >= 0) {
      balanceDisplayElement.classList.add("positive-balance");
    } else {
      balanceDisplayElement.classList.add("negative-balance");
    }
    balanceDisplayElement.textContent = `₦${balance.toLocaleString()}`;
  }

  const totalReceiptValueDisplayElement =
    document.getElementById("totalReceipts");
  if (totalReceiptValueDisplayElement) {
    totalReceiptValueDisplayElement.textContent = `₦${totalReceipt.toLocaleString()}`;
  }

  const totalExpensesValueDisplayElement =
    document.getElementById("totalExpenses");
  if (totalExpensesValueDisplayElement) {
    totalExpensesValueDisplayElement.textContent = `₦${totalExpenses.toLocaleString()}`;
  }
}

// --- ANALYTICS MODAL ---
function handleAnalyticsModal(reportType) {
  if (reportType === "Receipt Report") {
    const modalTitle = "Receipt Analytics";

    const modalContent = `
      <div class="modal-body-content">
        <div class="flex justify-between align-center" style="margin-bottom: 20px;">
          <p><strong>Total Receipts:</strong> <span id="totalReceipts">₦0</span></p>
          <select id="yearFilter" class="dropdown-filter">
            <!-- Populated dynamically -->
          </select>
        </div>
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Monthly Receipts</h3>
          <div id="receiptsChartContainer" class="chart-container">
            <canvas id="receiptsChart"></canvas>
          </div>
        </div>
      </div>
    `;

    const footerContent = `
      <button class="button button-primary download-btn">Download</button>
      <button class="button button-secondary modal-close-btn">Close</button>
    `;

    openModal(modalContent, modalTitle, {
      showFooter: true,
      footerContent,
      onCloseCallback: null,
    });

    function updateChart(selectedYear) {
      // Filter data by selected year
      const filteredData = MOCK_RECEIPTS_DATASET.filter((item) => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear === selectedYear;
      });

      // Calculate total receipts
      const totalReceipts = filteredData.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      // Aggregate receipts by month (1-12)
      const monthlyData = Array(12).fill(0);
      filteredData.forEach((item) => {
        const month = new Date(item.date).getMonth();
        monthlyData[month] += item.amount;
      });

      // Update total receipts display
      const totalReceiptsElement = document.getElementById("totalReceipts");
      if (totalReceiptsElement) {
        totalReceiptsElement.textContent = `₦${totalReceipts.toLocaleString()}`;
      }

      // Destroy existing chart if it exists
      const canvas = document.getElementById("receiptsChart");
      if (canvas && canvas.chart) {
        canvas.chart.destroy();
        canvas.chart = null;
      }

      // Check for data availability
      const chartContainer = document.getElementById("receiptsChartContainer");
      if (monthlyData.reduce((a, b) => a + b, 0) === 0) {
        chartContainer.innerHTML =
          "<p>No receipt data available for this year</p>";
        return;
      } else {
        chartContainer.innerHTML = '<canvas id="receiptsChart"></canvas>';
      }

      // Create new chart
      const newCanvas = document.getElementById("receiptsChart");
      if (newCanvas) {
        const chart = new Chart(newCanvas.getContext("2d"), {
          type: "line",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Receipts",
                data: monthlyData,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "#36A2EB",
                borderWidth: 2,
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Amount (₦)" },
                ticks: {
                  callback: function (value) {
                    return `₦${value.toLocaleString()}`;
                  },
                },
              },
              x: {
                title: { display: true, text: "Month" },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw;
                    return `Receipts: ₦${value.toLocaleString()}`;
                  },
                },
              },
            },
          },
        });
        newCanvas.chart = chart;
      }
    }

    setTimeout(() => {
      // Populate year dropdown
      const years = [
        ...new Set(
          MOCK_RECEIPTS_DATASET.map((item) => new Date(item.date).getFullYear())
        ),
      ];
      const currentYear = 2025;
      const earliestYear = Math.min(...years, currentYear);
      const yearOptions = [];
      for (let i = earliestYear; i <= currentYear; i++) {
        yearOptions.push(i);
      }

      const yearFilter = document.getElementById("yearFilter");
      if (yearFilter) {
        yearFilter.innerHTML = yearOptions
          .map(
            (year) =>
              `<option value="${year}" ${
                year === currentYear ? "selected" : ""
              }>${year}</option>`
          )
          .join("");

        // Initial chart render
        updateChart(currentYear);

        // Year filter change handler
        yearFilter.addEventListener("change", () => {
          updateChart(parseInt(yearFilter.value));
        });
      }

      // Download PDF
      const downloadBtn = document.querySelector(".download-btn");
      if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
          const modalBody = document.querySelector(".modal-body-content");
          if (!modalBody) {
            console.error("Modal body not found for PDF export");
            return;
          }

          const selectedYear = parseInt(yearFilter.value);
          const filename = `Receipt_Analytics_${selectedYear}.pdf`;
          const title = `Receipt Analytics - ${selectedYear}`;

          html2canvas(modalBody, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          })
            .then((canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const { jsPDF } = window.jspdf;
              const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
              });

              const margin = 10;
              const pageWidth = 210;
              const pageHeight = 297;
              const contentWidth = pageWidth - 2 * margin;
              const titleHeight = 10;
              const titleMargin = 5;
              const availableHeight =
                pageHeight - 2 * margin - titleHeight - titleMargin;

              const imgWidth = contentWidth;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              pdf.setFontSize(16);
              pdf.text(title, pageWidth / 2, margin + 5, { align: "center" });

              if (imgHeight <= availableHeight) {
                pdf.addImage(
                  imgData,
                  "PNG",
                  margin,
                  margin + titleHeight + titleMargin,
                  imgWidth,
                  imgHeight
                );
              } else {
                let position = 0;
                while (position < imgHeight) {
                  if (position > 0) {
                    pdf.addPage();
                    pdf.setFontSize(16);
                    pdf.text(title, pageWidth / 2, margin + 5, {
                      align: "center",
                    });
                  }
                  pdf.addImage(
                    imgData,
                    "PNG",
                    margin,
                    margin + titleHeight + titleMargin - position,
                    imgWidth,
                    imgHeight
                  );
                  position += availableHeight;
                }
              }

              pdf.save(filename);
            })
            .catch((error) => console.error("Error generating PDF:", error));
        });
      }
    }, 100);
  } else if (reportType === "Expenses Report") {
    const modalTitle = "Expenses Analytics";

    const modalContent = `
      <div class="modal-body-content">
        <div class="flex justify-between align-center" style="margin-bottom: 20px;">
          <p><strong>CR:</strong> <span id="totalReceipts">₦0</span> <strong>DR:</strong> <span id="totalExpenses">₦0</span></p>
          <select id="yearFilter" class="dropdown-filter">
            <!-- Populated dynamically -->
          </select>
        </div>
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Monthly Receipts and Expenses</h3>
          <div id="expensesChartContainer" class="chart-container">
            <canvas id="expensesChart"></canvas>
          </div>
        </div>
      </div>
    `;

    const footerContent = `
      <button class="button button-primary download-btn">Download</button>
      <button class="button button-secondary modal-close-btn">Close</button>
    `;

    openModal(modalContent, modalTitle, {
      showFooter: true,
      footerContent,
      onCloseCallback: null,
    });

    function updateChart(selectedYear) {
      // Filter data by selected year
      const filteredReceipts = MOCK_RECEIPTS_DATASET.filter((item) => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear === selectedYear;
      });
      const filteredExpenses = MOCK_EXPENSES_DATASET.filter((item) => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear === selectedYear;
      });

      // Calculate totals
      const totalReceipts = filteredReceipts.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const totalExpenses = filteredExpenses.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      // Aggregate by month (1-12)
      const monthlyReceipts = Array(12).fill(0);
      filteredReceipts.forEach((item) => {
        const month = new Date(item.date).getMonth();
        monthlyReceipts[month] += item.amount;
      });
      const monthlyExpenses = Array(12).fill(0);
      filteredExpenses.forEach((item) => {
        const month = new Date(item.date).getMonth();
        monthlyExpenses[month] += item.amount;
      });

      const totalReceiptsElement = document.getElementById("totalReceipts");
      const totalExpensesElement = document.getElementById("totalExpenses");
      if (totalReceiptsElement) {
        totalReceiptsElement.textContent = `₦${totalReceipts.toLocaleString()}`;
      }
      if (totalExpensesElement) {
        totalExpensesElement.textContent = `₦${totalExpenses.toLocaleString()}`;
      }

      // Destroy existing chart if it exists
      const canvas = document.getElementById("expensesChart");
      if (canvas && canvas.chart) {
        canvas.chart.destroy();
        canvas.chart = null;
      }

      // Check for data availability
      const chartContainer = document.getElementById("expensesChartContainer");
      if (
        monthlyReceipts.reduce((a, b) => a + b, 0) === 0 &&
        monthlyExpenses.reduce((a, b) => a + b, 0) === 0
      ) {
        chartContainer.innerHTML = "<p>No data available for this year</p>";
        return;
      } else {
        chartContainer.innerHTML = '<canvas id="expensesChart"></canvas>';
      }

      // Create new chart
      const newCanvas = document.getElementById("expensesChart");
      if (newCanvas) {
        const chart = new Chart(newCanvas.getContext("2d"), {
          type: "line",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Receipts",
                data: monthlyReceipts,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "#36A2EB",
                borderWidth: 2,
                fill: true,
                tension: 0.4,
              },
              {
                label: "Expenses",
                data: monthlyExpenses,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "#FF6384",
                borderWidth: 2,
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
              y: {
                beginAtZero: true,
                stacked: true,
                title: { display: true, text: "Amount (₦)" },
                ticks: {
                  callback: function (value) {
                    return `₦${value.toLocaleString()}`;
                  },
                },
              },
              x: {
                title: { display: true, text: "Month" },
              },
            },
            plugins: {
              legend: { position: "bottom" },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw;
                    const datasetLabel = context.dataset.label;
                    return `${datasetLabel}: ₦${value.toLocaleString()}`;
                  },
                },
              },
            },
          },
        });
        newCanvas.chart = chart;
      }
    }

    setTimeout(() => {
      // Populate year dropdown
      const receiptYears = [
        ...new Set(
          MOCK_RECEIPTS_DATASET.map((item) => new Date(item.date).getFullYear())
        ),
      ];
      const expenseYears = [
        ...new Set(
          MOCK_EXPENSES_DATASET.map((item) => new Date(item.date).getFullYear())
        ),
      ];
      const years = [...new Set([...receiptYears, ...expenseYears])];
      const currentYear = 2025;
      const earliestYear = Math.min(...years, currentYear);
      const yearOptions = [];
      for (let i = earliestYear; i <= currentYear; i++) {
        yearOptions.push(i);
      }

      const yearFilter = document.getElementById("yearFilter");
      if (yearFilter) {
        yearFilter.innerHTML = yearOptions
          .map(
            (year) =>
              `<option value="${year}" ${
                year === currentYear ? "selected" : ""
              }>${year}</option>`
          )
          .join("");

        // Initial chart render
        updateChart(currentYear);

        // Year filter change handler
        yearFilter.addEventListener("change", () => {
          updateChart(parseInt(yearFilter.value));
        });
      }

      // Download PDF
      const downloadBtn = document.querySelector(".download-btn");
      if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
          const modalBody = document.querySelector(".modal-body-content");
          if (!modalBody) {
            console.error("Modal body not found for PDF export");
            return;
          }

          const selectedYear = parseInt(yearFilter.value);
          const filename = `Expenses_Analytics_${selectedYear}.pdf`;
          const title = `Expenses Analytics - ${selectedYear}`;

          html2canvas(modalBody, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          })
            .then((canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const { jsPDF } = window.jspdf;
              const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
              });

              const margin = 10;
              const pageWidth = 210;
              const pageHeight = 297;
              const contentWidth = pageWidth - 2 * margin;
              const titleHeight = 10;
              const titleMargin = 5;
              const availableHeight =
                pageHeight - 2 * margin - titleHeight - titleMargin;

              const imgWidth = contentWidth;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              pdf.setFontSize(16);
              pdf.text(title, pageWidth / 2, margin + 5, { align: "center" });

              if (imgHeight <= availableHeight) {
                pdf.addImage(
                  imgData,
                  "PNG",
                  margin,
                  margin + titleHeight + titleMargin,
                  imgWidth,
                  imgHeight
                );
              } else {
                let position = 0;
                while (position < imgHeight) {
                  if (position > 0) {
                    pdf.addPage();
                    pdf.setFontSize(16);
                    pdf.text(title, pageWidth / 2, margin + 5, {
                      align: "center",
                    });
                  }
                  pdf.addImage(
                    imgData,
                    "PNG",
                    margin,
                    margin + titleHeight + titleMargin - position,
                    imgWidth,
                    imgHeight
                  );
                  position += availableHeight;
                }
              }

              pdf.save(filename);
            })
            .catch((error) => console.error("Error generating PDF:", error));
        });
      }
    }, 100);
  } else {
    openModal(
      `<p>Analytics content for ${reportType} will be displayed here.</p>`,
      `Analytics - ${reportType}`,
      {
        showFooter: true,
        footerContent: `<button class="button button-secondary modal-close-btn">Close</button>`,
        onCloseCallback: null,
      }
    );
  }
}

// --- BALANCE SHEET MODAL ---
function handleBalanceSheetModal() {
  // Calculate totals
  const assets = MOCK_FINANCE_DATASET.filter(
    (item) => item.category === "asset"
  );
  const liabilities = MOCK_FINANCE_DATASET.filter(
    (item) => item.category === "liability"
  );
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Generate table rows
  const assetsRows = assets
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>₦${item.amount.toLocaleString()}</td>
      <td>${formatDateForDisplay(item.date)}</td>
    </tr>
  `
    )
    .join("");

  const liabilitiesRows = liabilities
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>₦${item.amount.toLocaleString()}</td>
      <td>${formatDateForDisplay(item.date)}</td>
    </tr>
  `
    )
    .join("");

  const modalContent = `
    <div class="modal-body-content">
      <div class="flex column align-center justify-center" style="margin-bottom: 20px;">
        <img src="./assets/images/printLogo.png" alt="Balance Sheet Logo" style="width: 100px; height: auto; margin-bottom: 20px;">
        <div class="flex align-center justify-between" style="width: 100%;">
          <input type="date" id="balance-sheet-date" style="margin-right: 10px;">
          <input type="text" id="balance-sheet-details" placeholder="Details">
        </div>
      </div>
      <div class="balance-sheet-table">
        <h3>Assets</h3>
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${assetsRows || '<tr><td colspan="3">No assets available</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total Assets:</td>
              <td>₦${totalAssets.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="balance-sheet-table" style="margin-top: 20px;">
        <h3>Liabilities</h3>
        <table>
          <thead>
            <tr>
              <th>Liability</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${
              liabilitiesRows ||
              '<tr><td colspan="3">No liabilities available</td></tr>'
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total Liabilities:</td>
              <td>₦${totalLiabilities.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;

  const footerContent = `
    <button class="button button-primary download-btn">Download</button>
    <button class="button button-secondary modal-close-btn">Close</button>
  `;

  openModal(modalContent, "Balance Sheet", {
    showFooter: true,
    footerContent,
    onCloseCallback: null,
  });

  setTimeout(() => {
    const downloadBtn = document.querySelector(".download-btn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const modalBody = document.querySelector(".modal-body-content");
        if (!modalBody) {
          console.error("Modal body not found for PDF export");
          return;
        }

        const dateInput = document.getElementById("balance-sheet-date");
        const detailsInput = document.getElementById("balance-sheet-details");
        const dateValue =
          dateInput.value || new Date().toISOString().split("T")[0];
        const detailsValue = detailsInput.value || "Balance Sheet Report";
        const filename = `Balance_Sheet_${dateValue}.pdf`;
        const title = `Balance Sheet - ${detailsValue}`;

        html2canvas(modalBody, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        })
          .then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
            });

            const margin = 10;
            const pageWidth = 210;
            const pageHeight = 297;
            const contentWidth = pageWidth - 2 * margin;
            const titleHeight = 10;
            const titleMargin = 5;
            const availableHeight =
              pageHeight - 2 * margin - titleHeight - titleMargin;

            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.setFontSize(16);
            pdf.text(title, pageWidth / 2, margin + 5, { align: "center" });

            if (imgHeight <= availableHeight) {
              pdf.addImage(
                imgData,
                "PNG",
                margin,
                margin + titleHeight + titleMargin,
                imgWidth,
                imgHeight
              );
            } else {
              let position = 0;
              while (position < imgHeight) {
                if (position > 0) {
                  pdf.addPage();
                  pdf.setFontSize(16);
                  pdf.text(title, pageWidth / 2, margin + 5, {
                    align: "center",
                  });
                }
                pdf.addImage(
                  imgData,
                  "PNG",
                  margin,
                  margin + titleHeight + titleMargin - position,
                  imgWidth,
                  imgHeight
                );
                position += availableHeight;
              }
            }

            pdf.save(filename);
          })
          .catch((error) => console.error("Error generating PDF:", error));
      });
    }
  }, 100);
}

// --- MODAL FUNCTIONS ---
function generateFinanceModalHTML(data = {}, type, mode = "add") {
  const isViewMode = mode === "view";
  const disabledAttr = isViewMode ? "disabled" : "";

  let titleText = "";
  let formFields = "";
  let submitButtonText = "";

  if (mode === "add") {
    submitButtonText = "Save";
  } else if (mode === "edit") {
    submitButtonText = "Update";
  } else if (mode === "view") {
    submitButtonText = "Close";
  }

  switch (type) {
    case "asset":
    case "liability":
      titleText = type === "asset" ? "Asset" : "Liability";
      formFields = `
        <div class="form-group">
          <label for="finance-name">Name</label>
          <input type="text" id="finance-name" value="${
            data.name || ""
          }" ${disabledAttr} required />
        </div>
        <div class="form-group">
          <label for="finance-category">Category</label>
          <select id="finance-category" ${disabledAttr} required>
            <option value="asset" ${
              data.category === "asset" ? "selected" : ""
            }>Asset</option>
            <option value="liability" ${
              data.category === "liability" ? "selected" : ""
            }>Liability</option>
          </select>
        </div>
        <div class="form-group">
          <label for="finance-amount">Amount</label>
          <input type="number" id="finance-amount" value="${
            data.amount || ""
          }" ${disabledAttr} required />
        </div>
        <div class="form-group">
          <label for="finance-date">Date</label>
          <input type="date" id="finance-date" value="${
            data.date || ""
          }" ${disabledAttr} required />
        </div>
      `;
      break;
    case "receipt":
      titleText = "Receipt";
      formFields = `
        <div class="form-group">
          <label for="receipt-type">Receipt (CR)</label>
          <select id="receipt-type" ${disabledAttr} required>
            <option value="Cash" ${
              data.receipt_type === "Cash" ? "selected" : ""
            }>Cash</option>
            <option value="Bank Transfer" ${
              data.receipt_type === "Bank Transfer" ? "selected" : ""
            }>Bank Transfer</option>
          </select>
        </div>
        <div class="form-group">
          <label for="receipt-donor-name">Donor Name</label>
          <input type="text" id="receipt-donor-name" value="${
            data.donor_name || ""
          }" ${disabledAttr} required />
        </div>
        <div class="form-group">
          <label for="receipt-amount">Amount</label>
          <input type="number" id="receipt-amount" value="${
            data.amount || ""
          }" ${disabledAttr} required />
        </div>
        <div class="form-group">
          <label for="receipt-date">Date</label>
          <input type="date" id="receipt-date" value="${
            data.date || ""
          }" ${disabledAttr} required />
        </div>
      `;
      break;
    case "expense":
      titleText = "Expense";
      formFields = `
        <div class="form-group">
          <label for="expense-payment-type">Payment (DR)</label>
          <select id="expense-payment-type" ${disabledAttr} required>
            <option value="Cash" ${
              data.payment_type === "Cash" ? "selected" : ""
            }>Cash</option>
            <option value="Bank Transfer" ${
              data.payment_type === "Bank Transfer" ? "selected" : ""
            }>Bank Transfer</option>
            <option value="Card Payment" ${
              data.payment_type === "Card Payment" ? "selected" : ""
            }>Card Payment</option>
          </select>
        </div>
        <div class="form-group">
          <label for="expense-amount">Amount</label>
          <input type="number" id="expense-amount" value="${
            data.amount || ""
          }" ${disabledAttr} required />
        </div>
        <div class="form-group">
          <label for="expense-date">Date</label>
          <input type="date" id="expense-date" value="${
            data.date || ""
          }" ${disabledAttr} required />
        </div>
        <div class="form-group">
          <label for="expense-payment-details">Payment Details</label>
          <input type="text" id="expense-payment-details" value="${
            data.payment_details || ""
          }" ${disabledAttr} required />
        </div>
      `;
      break;
  }

  return `
    <div class="modal-form-grid">
      ${formFields}
    </div>
  `;
}

function handleFinanceModal(action, type, id = null) {
  let modalTitle = "";
  let footerButtonText = "";
  let currentData = {};
  let showFooter = true;

  const getDataSet = (dataType) => {
    switch (dataType) {
      case "asset":
      case "liability":
        return MOCK_FINANCE_DATASET;
      case "receipt":
        return MOCK_RECEIPTS_DATASET;
      case "expense":
        return MOCK_EXPENSES_DATASET;
      default:
        return [];
    }
  };

  if (id) {
    const dataset = getDataSet(type);
    currentData = dataset.find((item) => item.id === parseInt(id));
    if (!currentData) {
      console.warn(`Item with ID ${id} not found in ${type} dataset.`);
      return;
    }
  }

  if (action === "add") {
    modalTitle = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    footerButtonText = "Save";
  } else if (action === "edit") {
    modalTitle = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    footerButtonText = "Update";
  } else if (action === "view") {
    modalTitle = `View ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    footerButtonText = "Close";
  } else if (action === "delete") {
    const dataset = getDataSet(type);
    const item = dataset.find((item) => item.id === parseInt(id));
    if (!item) {
      console.warn(
        `Item with ID ${id} not found in ${type} dataset for deletion.`
      );
      return;
    }

    const itemName =
      item.name || item.donor_name || item.payment_details || `ID ${id}`;
    openModal(
      `<p>Are you sure you want to delete ${type} <strong>${itemName}</strong>?</p>`,
      `Confirm Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      {
        showFooter: true,
        footerContent: `
          <button class="button button-danger" id="confirm-delete-btn" data-item-id="${id}" data-item-type="${type}">Delete</button>
          <button class="button button-secondary modal-cancel-btn">Cancel</button>
        `,
        onCloseCallback: null,
      }
    );

    setTimeout(() => {
      const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
          deleteFinanceEntry(type, parseInt(id));
          closeModal();
        });
      }
    }, 50);
    return;
  }

  const modalContent = generateFinanceModalHTML(currentData, type, action);
  const footerContent =
    action === "view"
      ? `<button class="button button-secondary modal-close-btn">Close</button>`
      : `<button class="button button-primary" id="modal-finance-save-update-btn" data-item-id="${
          id || ""
        }" data-item-type="${type}" data-mode="${action}">${footerButtonText}</button>
         <button class="modal-cancel-btn button button-secondary">Cancel</button>`;

  openModal(modalContent, modalTitle, {
    showFooter: true,
    footerContent: footerContent,
    onCloseCallback: () => {
      if (type === "asset") assetsTableManager.refresh();
      else if (type === "liability") liabilityTableManager.refresh();
      else if (type === "receipt") receiptsTableManager.refresh();
      else if (type === "expense") expensesTableManager.refresh();
      updateSummaryMetrics();
    },
  });

  // Attach dynamic event listeners after modal is rendered
  setTimeout(() => {
    attachFinanceModalListeners(type, id, action);
  }, 50);
}

function attachFinanceModalListeners(type, id, mode) {
  const modalFooter = document.getElementById("app-modal-footer");
  const newModalFooter = modalFooter.cloneNode(true);
  modalFooter.parentNode.replaceChild(newModalFooter, modalFooter);

  const modalCancelBtn = newModalFooter.querySelector(".modal-cancel-btn");
  const modalCloseBtn = newModalFooter.querySelector(".modal-close-btn");
  const saveUpdateBtn = newModalFooter.querySelector(
    "#modal-finance-save-update-btn"
  );

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", closeModal);
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (saveUpdateBtn && (mode === "add" || mode === "edit")) {
    const handler = () => {
      saveUpdateBtn.removeEventListener("click", handler);

      const modalBody = document.getElementById("app-modal-body");
      let formData = {};
      let isValid = true;

      const getInputValue = (id, required = true) => {
        const input = modalBody.querySelector(`#${id}`);
        if (input) {
          if (required && !input.value) {
            isValid = false;
            input.classList.add("error-input");
            return null;
          }
          input.classList.remove("error-input");
          return input.value;
        }
        return null;
      };

      switch (type) {
        case "asset":
        case "liability":
          formData = {
            name: getInputValue("finance-name"),
            category: getInputValue("finance-category"),
            amount: parseFloat(getInputValue("finance-amount")),
            date: getInputValue("finance-date"),
          };
          break;
        case "receipt":
          formData = {
            receipt_type: getInputValue("receipt-type"),
            donor_name: getInputValue("receipt-donor-name"),
            amount: parseFloat(getInputValue("receipt-amount")),
            date: getInputValue("receipt-date"),
          };
          break;
        case "expense":
          formData = {
            payment_type: getInputValue("expense-payment-type"),
            amount: parseFloat(getInputValue("expense-amount")),
            date: getInputValue("expense-date"),
            payment_details: getInputValue("expense-payment-details"),
          };
          break;
      }

      if (!isValid) {
        alert("Please fill in all required fields.");
        return;
      }

      saveFinanceEntry(type, id, formData);
    };
    saveUpdateBtn.addEventListener("click", handler);
  }
}

function saveFinanceEntry(type, id, formData) {
  let targetDataset;
  let prefix = "";

  switch (type) {
    case "asset":
    case "liability":
      targetDataset = MOCK_FINANCE_DATASET;
      break;
    case "receipt":
      targetDataset = MOCK_RECEIPTS_DATASET;
      break;
    case "expense":
      targetDataset = MOCK_EXPENSES_DATASET;
      break;
    default:
      console.warn("Unknown finance type:", type);
      return;
  }

  if (id) {
    const index = targetDataset.findIndex((item) => item.id === parseInt(id));
    if (index !== -1) {
      targetDataset[index] = {
        ...targetDataset[index],
        ...formData,
        id: parseInt(id),
      };
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} entry updated`);
    } else {
      console.warn(`Item with ID ${id} not found for update.`);
      return;
    }
  } else {
    const newId = targetDataset.length
      ? Math.max(...targetDataset.map((item) => item.id)) + 1
      : 1;
    targetDataset.push({ ...formData, id: newId });
    alert(`New ${type} entry added`);
  }

  closeModal();
}

function deleteFinanceEntry(type, id) {
  let targetDataset;
  switch (type) {
    case "asset":
    case "liability":
      targetDataset = MOCK_FINANCE_DATASET;
      break;
    case "receipt":
      targetDataset = MOCK_RECEIPTS_DATASET;
      break;
    case "expense":
      targetDataset = MOCK_EXPENSES_DATASET;
      break;
    default:
      console.warn(`Unknown finance type: ${type}`);
      return;
  }

  const initialLength = targetDataset.length;
  targetDataset = targetDataset.filter((item) => item.id !== parseInt(id));

  if (targetDataset.length < initialLength) {
    if (type === "asset" || type === "liability")
      MOCK_FINANCE_DATASET = targetDataset;
    else if (type === "receipt") MOCK_RECEIPTS_DATASET = targetDataset;
    else if (type === "expense") MOCK_EXPENSES_DATASET = targetDataset;
  } else {
    console.warn(`Could not find ${type} with ID: ${id} for deletion.`);
  }

  if (type === "asset") assetsTableManager.refresh();
  else if (type === "liability") liabilityTableManager.refresh();
  else if (type === "receipt") receiptsTableManager.refresh();
  else if (type === "expense") expensesTableManager.refresh();
  updateSummaryMetrics();
}

// --- TABLE ACTION HANDLER ---
function handleTableAction(event) {
  const { action, itemId, pageKey } = event.detail;
  let type;

  if (pageKey === "assets") type = "asset";
  else if (pageKey === "liabilities") type = "liability";
  else if (pageKey === "receipts") type = "receipt";
  else if (pageKey === "expenses") type = "expense";
  else {
    console.warn("Unknown pageKey for finance action:", pageKey);
    return;
  }

  // Skip actions for report routes
  if (
    (pageKey === "receipts" && isReceiptReportPage) ||
    (pageKey === "expenses" && isExpensesReportPage)
  ) {
    return;
  }

  switch (action) {
    case "view":
      handleFinanceModal("view", type, parseInt(itemId));
      break;
    case "edit":
      handleFinanceModal("edit", type, parseInt(itemId));
      break;
    case "delete":
      handleFinanceModal("delete", type, parseInt(itemId));
      break;
    default:
      console.warn(`Unhandled action: ${action} for ${type} with ID ${itemId}`);
  }
}

// --- INITIALIZATION ---
export function initFinance() {
  financeInitialized = false;
  checkRoute();
  if (financeInitialized) return;
  financeInitialized = true;

  // Clean up previous listeners
  if (financeTableActionHandler) {
    window.removeEventListener("tableAction", financeTableActionHandler);
  }

  // Create new handler
  financeTableActionHandler = handleTableAction;
  window.addEventListener("tableAction", financeTableActionHandler);

  // Update summary metrics on module load
  updateSummaryMetrics();

  // Initialize Assets Table
  const assetsContainer = document.getElementById("assets-table-container");
  if (assetsContainer) {
    assetsTableManager = createPaginatedTableManager(
      "assets-table-container",
      "assets-pagination-container",
      {
        fetchDataFunction: (limit, offset, search) =>
          fetchFinanceData("asset", limit, offset, search),
        tableHeaders: financeHeaders,
        dropdownActions: financeDropdownActions,
        pageKey: "assets",
        defaultItemsPerPage: 25,
      }
    );
    assetsTableManager.init();
    document
      .getElementById("add-new-asset-btn")
      ?.addEventListener("click", () => handleFinanceModal("add", "asset"));
    document
      .getElementById("view-balance-sheet-btn")
      ?.addEventListener("click", handleBalanceSheetModal);
    document
      .querySelector(".assets-content .search-input")
      ?.addEventListener("input", (e) => {
        assetsTableManager.setSearchFilter(e.target.value);
      });
  }

  // Initialize Liabilities Table
  const liabilityContainer = document.getElementById(
    "liability-table-container"
  );
  if (liabilityContainer) {
    liabilityTableManager = createPaginatedTableManager(
      "liability-table-container",
      "liability-pagination-container",
      {
        fetchDataFunction: (limit, offset, search) =>
          fetchFinanceData("liability", limit, offset, search),
        tableHeaders: financeHeaders,
        dropdownActions: financeDropdownActions,
        pageKey: "liabilities",
        defaultItemsPerPage: 25,
      }
    );
    liabilityTableManager.init();
    document
      .getElementById("add-new-liability-btn")
      ?.addEventListener("click", () => handleFinanceModal("add", "liability"));
    document
      .getElementById("view-balance-sheet-btn")
      ?.addEventListener("click", handleBalanceSheetModal);
    document
      .querySelector(".liability-content .search-input")
      ?.addEventListener("input", (e) => {
        liabilityTableManager.setSearchFilter(e.target.value);
      });
  }

  // Initialize Receipts Table
  const receiptsContainer = document.getElementById("receipt-table-container");
  if (receiptsContainer) {
    const dropdownActions = isReceiptReportPage ? [] : financeDropdownActions;
    receiptsTableManager = createPaginatedTableManager(
      "receipt-table-container",
      "receipt-pagination-container",
      {
        fetchDataFunction: (limit, offset, search) =>
          fetchFinanceData("receipt", limit, offset, search),
        tableHeaders: receiptHeaders,
        dropdownActions: dropdownActions,
        pageKey: "receipts",
        defaultItemsPerPage: 25,
      }
    );
    receiptsTableManager.init();

    if (!isReceiptReportPage) {
      document
        .getElementById("add-new-receipt-btn")
        ?.addEventListener("click", () => handleFinanceModal("add", "receipt"));
      document
        .querySelector(".receipts-content .search-input")
        ?.addEventListener("input", (e) => {
          receiptsTableManager.setSearchFilter(e.target.value);
        });
    }

    if (isReceiptReportPage) {
      // Analytics button
      const analyticsButton = document.querySelector(
        ".receipts-content .buttons .button-secondary:nth-child(1)"
      );
      if (analyticsButton) {
        analyticsButton.addEventListener("click", () =>
          handleAnalyticsModal("Receipt Report")
        );
      }

      // Date filters
      const fromDateInput = document.querySelector(
        ".receipts-content #from_date"
      );
      const toDateInput = document.querySelector(".receipts-content #to_date");
      const submitButton = document.querySelector(
        ".receipts-content .buttons .button-secondary:nth-child(3)"
      );

      if (fromDateInput && toDateInput && submitButton) {
        submitButton.addEventListener("click", () => {
          financeFilters.fromDate = fromDateInput.value;
          financeFilters.toDate = toDateInput.value;
          receiptsTableManager.refresh();
        });
        fromDateInput.addEventListener("change", (e) => {
          if (!e.target.value) {
            financeFilters.fromDate = "";
            receiptsTableManager.refresh();
          }
        });
        toDateInput.addEventListener("change", (e) => {
          if (!e.target.value) {
            financeFilters.toDate = "";
            receiptsTableManager.refresh();
          }
        });
      }

      // Search input
      const searchInput = document.querySelector(
        ".receipts-content .search-input"
      );
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          financeFilters.search = e.target.value;
          receiptsTableManager.setSearchFilter(e.target.value);
        });
      }
    }
  }

  // Initialize Expenses Table
  const expensesContainer = document.getElementById("expense-table-container");
  if (expensesContainer) {
    const dropdownActions = isExpensesReportPage ? [] : financeDropdownActions;
    expensesTableManager = createPaginatedTableManager(
      "expense-table-container",
      "expense-pagination-container",
      {
        fetchDataFunction: (limit, offset, search) =>
          fetchFinanceData("expense", limit, offset, search),
        tableHeaders: expenseHeaders,
        dropdownActions: dropdownActions,
        pageKey: "expenses",
        defaultItemsPerPage: 25,
      }
    );
    expensesTableManager.init();

    if (!isExpensesReportPage) {
      document
        .getElementById("add-new-expense-btn")
        ?.addEventListener("click", () => handleFinanceModal("add", "expense"));
      document
        .querySelector(".expenses-content .search-input")
        ?.addEventListener("input", (e) => {
          expensesTableManager.setSearchFilter(e.target.value);
        });
    }

    if (isExpensesReportPage) {
      // Analytics button
      const analyticsButton = document.querySelector(
        ".expenses-content .buttons .button-secondary:nth-child(1)"
      );
      if (analyticsButton) {
        analyticsButton.addEventListener("click", () =>
          handleAnalyticsModal("Expenses Report")
        );
      }

      // Date filters
      const fromDateInput = document.querySelector(
        ".expenses-content #from_date"
      );
      const toDateInput = document.querySelector(".expenses-content #to_date");
      const submitButton = document.querySelector(
        ".expenses-content .buttons .button-secondary:nth-child(3)"
      );

      if (fromDateInput && toDateInput && submitButton) {
        submitButton.addEventListener("click", () => {
          financeFilters.fromDate = fromDateInput.value;
          financeFilters.toDate = toDateInput.value;
          expensesTableManager.refresh();
        });
        fromDateInput.addEventListener("change", (e) => {
          if (!e.target.value) {
            financeFilters.fromDate = "";
            expensesTableManager.refresh();
          }
        });
        toDateInput.addEventListener("change", (e) => {
          if (!e.target.value) {
            financeFilters.toDate = "";
            expensesTableManager.refresh();
          }
        });
      }

      // Search input
      const searchInput = document.querySelector(
        ".expenses-content .search-input"
      );
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          financeFilters.search = e.target.value;
          expensesTableManager.setSearchFilter(e.target.value);
        });
      }
    }
  }
}

// Initial route check
checkRoute();
