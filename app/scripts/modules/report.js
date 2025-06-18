// app/scripts/modules/report.js

import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { formatDateForDisplay } from "../utils/formatters.js";
import { openModal, closeModal } from "../components/modal.js";

// --- MOCK DATA ---
let MOCK_SEGREGATION_DATA = [
  {
    id: 1,
    date: "2025-05-22",
    pin: 54124312,
    gender: "female",
    item: "rice",
  },
  // Added more data for testing dropdowns and sorting
  {
    id: 2,
    date: "2025-04-15",
    pin: 98765432,
    gender: "male",
    item: "beans",
  },
  {
    id: 3,
    date: "2025-03-10",
    pin: 12345678,
    gender: "female",
    item: "oil",
  },
];

let MOCK_BENEFICIARY_DATA = [
  {
    id: 1,
    date: "2025-03-28",
    first_name: "ron",
    last_name: "waz",
    pin: 1004343,
    gender: "female",
    age: 40,
    marital_status: "married",
    location: "Lagos",
  },
  {
    id: 2,
    date: "2025-02-15",
    first_name: "jane",
    last_name: "doe",
    pin: 2004343,
    gender: "female",
    age: 35,
    marital_status: "single",
    location: "Abuja",
  },
  {
    id: 3,
    date: "2025-01-10",
    first_name: "john",
    last_name: "smith",
    pin: 3004343,
    gender: "male",
    age: 50,
    marital_status: "married",
    location: "Lagos",
  },
];

let MOCK_DONOR_DATA = [
  {
    id: 1,
    date: "2025-03-28",
    name_of_donor: "ron",
    item: "waz",
    quantity: 1004343,
    amount: 765473865,
  },
  // Added more data for testing date filters
  {
    id: 2,
    date: "2025-02-20",
    name_of_donor: "alice",
    item: "rice",
    quantity: 50000,
    amount: 1000000,
  },
  {
    id: 3,
    date: "2025-01-05",
    name_of_donor: "bob",
    item: "oil",
    quantity: 2000,
    amount: 500000,
  },
];

// --- MOCK DATA FOR DONOR ANALYTICS ---
const MOCK_DONOR_ANALYTICS_DATA = [
  {
    id: 1,
    date: "2023-01-15",
    donor_name: "Michael Anderson",
    donor_type: "External Donor",
    item: "Rice",
    quantity: 50,
    amount: 100000,
    unit: "kg",
  },
  {
    id: 2,
    date: "2023-01-15",
    donor_name: "Michael Anderson",
    donor_type: "External Donor",
    item: "Beans",
    quantity: 20,
    amount: 30000,
    unit: "kg",
  },
  {
    id: 3,
    date: "2023-02-10",
    donor_name: "Sarah Johnson",
    donor_type: "External Donor",
    item: "Rice",
    quantity: 30,
    amount: 60000,
    unit: "kg",
  },
  {
    id: 4,
    date: "2023-03-05",
    donor_name: "Ehi Center",
    donor_type: "Ehi Center",
    item: "Oil",
    quantity: 10,
    amount: 50000,
    unit: "liter",
  },
];

const MOCK_DISBURSEMENT_DATA = [
  {
    id: 1,
    date_disbursed: "2023-01-20",
    receiver_name: "Claris Paul",
    items: [{ item: "Rice", quantity: 10, unit: "kg" }],
  },
  {
    id: 2,
    date_disbursed: "2023-02-15",
    receiver_name: "John Doe",
    items: [
      { item: "Rice", quantity: 5, unit: "kg" },
      { item: "Beans", quantity: 8, unit: "kg" },
    ],
  },
  {
    id: 3,
    date_disbursed: "2023-03-10",
    receiver_name: "Jane Smith",
    items: [{ item: "Oil", quantity: 2, unit: "liter" }],
  },
];

// --- TABLE HEADERS ---
const segregationHeaders = ["Date", "Pin", "Gender", "Item"];
const beneficiaryHeaders = [
  "Date",
  "First Name",
  "Last Name",
  "Pin",
  "Gender",
  "Age",
];
const donorHeaders = ["Date", "Name of Donor", "Item", "Quantity", "Amount"];

// --- PAGINATION MANAGERS ---
let segregationTableManager;
let beneficiaryTableManager;
let donorTableManager;

// --- FILTER STATES ---
let segregationFilters = { gender: "", item: "", search: "" };
let beneficiaryFilters = { fromDate: "", toDate: "", search: "" };
let donorFilters = { fromDate: "", toDate: "", search: "" };

// --- TRANSFORM FUNCTIONS (for table display) ---
function transformSegregationForTable(item) {
  return {
    id: item.id,
    date: formatDateForDisplay(item.date),
    pin: item.pin,
    gender: item.gender,
    item: item.item,
    _original: item,
  };
}

function transformBeneficiaryForTable(item) {
  return {
    id: item.id,
    date: formatDateForDisplay(item.date),
    first_name: item.first_name,
    last_name: item.last_name,
    pin: item.pin,
    gender: item.gender,
    age: item.age,
    _original: item,
  };
}

function transformDonorForTable(item) {
  return {
    id: item.id,
    date: formatDateForDisplay(item.date),
    name_of_donor: item.name_of_donor,
    item: item.item,
    quantity: item.quantity.toLocaleString(),
    amount: `₦${item.amount.toLocaleString()}`,
    _original: item,
  };
}

// --- MOCK FETCH FUNCTIONS (with filters) ---
async function fetchSegregationData(limit, offset, searchFilter = "") {
  let filteredData = MOCK_SEGREGATION_DATA;

  // Apply gender and item filters
  if (segregationFilters.gender) {
    filteredData = filteredData.filter(
      (item) =>
        item.gender.toLowerCase() === segregationFilters.gender.toLowerCase()
    );
  }
  if (segregationFilters.item) {
    filteredData = filteredData.filter(
      (item) =>
        item.item.toLowerCase() === segregationFilters.item.toLowerCase()
    );
  }
  // Apply search filter
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
      const transformedData = paginatedData.map(transformSegregationForTable);
      resolve({
        data: transformedData,
        totalItems: filteredData.length,
      });
    }, 300); // Simulate API delay
  });
}

async function fetchBeneficiaryData(limit, offset, searchFilter = "") {
  let filteredData = MOCK_BENEFICIARY_DATA;

  // Apply date filters
  if (beneficiaryFilters.fromDate || beneficiaryFilters.toDate) {
    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = beneficiaryFilters.fromDate
        ? new Date(beneficiaryFilters.fromDate)
        : new Date("1900-01-01");
      const toDate = beneficiaryFilters.toDate
        ? new Date(beneficiaryFilters.toDate)
        : new Date("9999-12-31");
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }
  // Apply search filter
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
      const transformedData = paginatedData.map(transformBeneficiaryForTable);
      resolve({
        data: transformedData,
        totalItems: filteredData.length,
      });
    }, 300);
  });
}

async function fetchDonorData(limit, offset, searchFilter = "") {
  let filteredData = MOCK_DONOR_DATA;

  // Apply date filters
  if (donorFilters.fromDate || donorFilters.toDate) {
    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = donorFilters.fromDate
        ? new Date(donorFilters.fromDate)
        : new Date("1900-01-01");
      const toDate = donorFilters.toDate
        ? new Date(donorFilters.toDate)
        : new Date("9999-12-31");
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }
  // Apply search filter
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
      const transformedData = paginatedData.map(transformDonorForTable);
      resolve({
        data: transformedData,
        totalItems: filteredData.length,
      });
    }, 300);
  });
}

// --- HELPER FUNCTIONS ---
function populateDropdown(
  containerSelector,
  buttonSelector,
  field,
  data,
  tableManager
) {
  const button = document.querySelector(
    `${containerSelector} ${buttonSelector}`
  );
  if (!button) {
    console.warn(`Button not found: ${containerSelector} ${buttonSelector}`);
    return;
  }

  // Get unique values for the field
  const uniqueValues = [...new Set(data.map((item) => item[field]))];
  if (uniqueValues.length === 0) {
    button.disabled = true;
    return;
  }

  // Create dropdown
  const select = document.createElement("select");
  select.className = "dropdown-filter";
  select.innerHTML =
    `<option value="">All ${
      field.charAt(0).toUpperCase() + field.slice(1)
    }s</option>` +
    uniqueValues
      .map((value) => `<option value="${value}">${value}</option>`)
      .join("");

  // Replace button with dropdown
  button.parentNode.replaceChild(select, button);

  // Add change listener
  select.addEventListener("change", (e) => {
    if (field === "gender") {
      segregationFilters.gender = e.target.value;
    } else if (field === "item") {
      segregationFilters.item = e.target.value;
    }
    tableManager.refresh();
  });
}

// --- DONOR OVERVIEW MODAL ---
function handleDonorOverviewModal() {
  // Define categories
  const categories = ["Rice", "Beans", "Medication", "Clothes"];

  // Calculate quantities
  const quantities = {
    rice: { original: 0, disbursed: 0, inStock: 0 },
    beans: { original: 0, disbursed: 0, inStock: 0 },
    medication: { original: 0, disbursed: 0, inStock: 0 },
    clothes: { original: 0, disbursed: 0, inStock: 0 },
  };

  // Aggregate original quantities from MOCK_DONOR_ANALYTICS_DATA
  MOCK_DONOR_ANALYTICS_DATA.forEach((item) => {
    const itemKey = item.item.toLowerCase();
    if (quantities[itemKey]) {
      quantities[itemKey].original += item.quantity;
    }
  });

  // Aggregate disbursed quantities from MOCK_DISBURSEMENT_DATA
  MOCK_DISBURSEMENT_DATA.forEach((disbursement) => {
    disbursement.items.forEach((disbursedItem) => {
      const itemKey = disbursedItem.item.toLowerCase();
      if (quantities[itemKey]) {
        quantities[itemKey].disbursed += disbursedItem.quantity;
      }
    });
  });

  // Calculate inStock
  Object.keys(quantities).forEach((key) => {
    quantities[key].inStock =
      quantities[key].original - quantities[key].disbursed;
  });

  // Generate table rows
  const tableRows = categories
    .map((category) => {
      const key = category.toLowerCase();
      return `
      <tr>
        <td>${category}</td>
        <td>${quantities[key].original.toLocaleString()}</td>
        <td>${quantities[key].disbursed.toLocaleString()}</td>
        <td>${quantities[key].inStock.toLocaleString()}</td>
      </tr>
    `;
    })
    .join("");

  const modalContent = `
    <div class="modal-body-content">
      <div style="display: flex;flex-wrap: wrap;gap: 1rem;margin-bottom: 2rem;">
        <div>
          <p><strong>Rice:</strong> Kilogram (kg)</p>
        </div>
        <div>
          <p><strong>Beans:</strong> Kilogram (kg)</p>
        </div>
        <div>
          <p><strong>Medication:</strong> Packs (packs)</p>
        </div>
        <div>
          <p><strong>Clothes:</strong> Pieces (pcs)</p>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Categories</th>
            <th>Original</th>
            <th>Disbursed</th>
            <th>In Stock</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;

  const footerContent = `
    <button class="button button-secondary modal-close-btn">Close</button>
  `;

  openModal(modalContent, "Overview", {
    showFooter: true,
    footerContent,
    onCloseCallback: null,
  });
}

function handleAnalyticsModal(section) {
  let modalContent = `<p>Analytics content for ${section} will be displayed here.</p>`;
  let modalTitle = `Analytics - ${
    section.charAt(0).toUpperCase() + section.slice(1)
  }`;

  if (section === "beneficiary") {
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11 (January-December)
    const currentYear = currentDate.getFullYear(); // 2025

    // Get earliest year from data
    const years = [
      ...new Set(
        MOCK_BENEFICIARY_DATA.map((item) => new Date(item.date).getFullYear())
      ),
    ];
    const earliestYear = Math.min(...years, currentYear);
    const yearOptions = Array.from(
      { length: currentYear - earliestYear + 1 },
      (_, i) => earliestYear + i
    );

    // Month names for dropdown and filename
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    modalTitle = `Beneficiaries (Total No Supported Per Period)`;

    // Modal content with dropdowns and scripts
    modalContent = `
      <div class="modal-body-content">
        <div style="margin-bottom: 20px;">
          <label for="monthFilter">Month: </label>
          <select id="monthFilter" class="dropdown-filter">
            ${monthNames
              .map(
                (name, index) =>
                  `<option value="${index}" ${
                    index === currentMonth ? "selected" : ""
                  }>${name}</option>`
              )
              .join("")}
          </select>
          <label for="yearFilter" style="margin-left: 20px;">Year: </label>
          <select id="yearFilter" class="dropdown-filter">
            ${yearOptions
              .map(
                (year) =>
                  `<option value="${year}" ${
                    year === currentYear ? "selected" : ""
                  }>${year}</option>`
              )
              .join("")}
          </select>
        </div>
        <div style="display: grid;grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));gap: 1rem;">
          <div class="card beneficiary-analytic-chart">
            <h3>Age Distribution</h3>
            <div id="ageChartContainer">
              <canvas id="ageChart"></canvas>
            </div>
          </div>
          <div class="card beneficiary-analytic-chart">
            <h3>Gender Distribution</h3>
            <div id="genderChartContainer">
              <canvas id="genderChart"></canvas>
            </div>
          </div>
          <div class="card beneficiary-analytic-chart">
            <h3>Marital Status Distribution</h3>
            <div id="maritalStatusChartContainer">
              <canvas id="maritalStatusChart"></canvas>
            </div>
          </div>
          <div class="card beneficiary-analytic-chart">
            <h3>Location Distribution</h3>
            <div id="locationChartContainer">
              <canvas id="locationChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    // Function to update charts based on selected month and year
    function updateCharts(selectedMonth, selectedYear) {
      // Filter data by selected month and year
      const filteredData = MOCK_BENEFICIARY_DATA.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getMonth() === selectedMonth &&
          itemDate.getFullYear() === selectedYear
        );
      });

      console.log("Filtered Data:", JSON.stringify(filteredData, null, 2));

      // Aggregate data for charts
      const ageGroups = {
        "0-20": 0,
        "21-30": 0,
        "31-40": 0,
        "41-50": 0,
        "51+": 0,
      };
      const genderCounts = { male: 0, female: 0 };
      const maritalStatusCounts = {
        single: 0,
        married: 0,
        divorced: 0,
        widowed: 0,
      };
      const locationCounts = {};

      filteredData.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          marital_status: item.marital_status,
          location: item.location,
          age: item.age,
          gender: item.gender,
          date: item.date,
        });

        // Age grouping
        if (item.age <= 20) ageGroups["0-20"]++;
        else if (item.age <= 30) ageGroups["21-30"]++;
        else if (item.age <= 40) ageGroups["31-40"]++;
        else if (item.age <= 50) ageGroups["41-50"]++;
        else ageGroups["51+"]++;

        // Gender
        if (
          item.gender &&
          genderCounts.hasOwnProperty(item.gender.toLowerCase())
        ) {
          genderCounts[item.gender.toLowerCase()]++;
        } else {
          console.warn(`Invalid gender in item ${index + 1}:`, item.gender);
        }

        // Marital Status
        if (item.marital_status) {
          const status = item.marital_status.toLowerCase().trim();
          if (maritalStatusCounts.hasOwnProperty(status)) {
            maritalStatusCounts[status]++;
          } else {
            console.warn(
              `Invalid marital_status in item ${index + 1}:`,
              item.marital_status
            );
          }
        } else {
          console.warn(`Missing marital_status in item ${index + 1}`);
        }

        // Location
        if (item.location) {
          const locKey = item.location.toLowerCase().trim();
          locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
        } else {
          console.warn(`Missing location in item ${index + 1}`);
        }
      });

      // Debug data
      console.log("Age Groups:", ageGroups);
      console.log("Gender Counts:", genderCounts);
      console.log("Marital Status Counts:", maritalStatusCounts);
      console.log("Location Counts:", locationCounts);

      // Prepare data for charts
      const ageData = [
        ageGroups["0-20"],
        ageGroups["21-30"],
        ageGroups["31-40"],
        ageGroups["41-50"],
        ageGroups["51+"],
      ];
      const genderData = [genderCounts.male, genderCounts.female];
      const maritalStatusLabels = ["Single", "Married", "Divorced", "Widowed"];
      const maritalStatusData = [
        maritalStatusCounts.single,
        maritalStatusCounts.married,
        maritalStatusCounts.divorced,
        maritalStatusCounts.widowed,
      ];
      const locationLabels = Object.keys(locationCounts)
        .map((loc) => loc.charAt(0).toUpperCase() + loc.slice(1))
        .sort();
      const locationData = locationLabels.map(
        (loc) => locationCounts[loc.toLowerCase()] || 0
      );

      console.log("Age Data:", ageData);
      console.log("Gender Data:", genderData);
      console.log("Marital Status Labels:", maritalStatusLabels);
      console.log("Marital Status Data:", maritalStatusData);
      console.log("Location Labels:", locationLabels);
      console.log("Location Data:", locationData);

      // Clear existing charts
      const canvases = [
        "ageChart",
        "genderChart",
        "maritalStatusChart",
        "locationChart",
      ];
      canvases.forEach((id) => {
        const canvas = document.getElementById(id);
        if (canvas && canvas.chart) {
          canvas.chart.destroy();
          canvas.chart = null; // Clear reference
        }
      });

      // Update chart containers
      const ageContainer = document.getElementById("ageChartContainer");
      const genderContainer = document.getElementById("genderChartContainer");
      const maritalStatusContainer = document.getElementById(
        "maritalStatusChartContainer"
      );
      const locationContainer = document.getElementById(
        "locationChartContainer"
      );

      if (ageData.reduce((a, b) => a + b, 0) === 0) {
        ageContainer.innerHTML = "<p>No age data available</p>";
      } else {
        ageContainer.innerHTML = '<canvas id="ageChart"></canvas>';
      }
      if (genderData.reduce((a, b) => a + b, 0) == 0) {
        genderContainer.innerHTML = "<p>No gender data available</p>";
      } else {
        genderContainer.innerHTML = '<canvas id="genderChart"></canvas>';
      }
      if (maritalStatusData.reduce((a, b) => a + b, 0) === 0) {
        maritalStatusContainer.innerHTML =
          "<p>No marital status data available</p>";
      } else {
        maritalStatusContainer.innerHTML =
          '<canvas id="maritalStatusChart"></canvas>';
      }
      if (locationData.length === 0) {
        locationContainer.innerHTML = "<p>No location data available</p>";
      } else {
        locationContainer.innerHTML = '<canvas id="locationChart"></canvas>';
      }

      // Age Chart (Bar)
      if (ageData.reduce((a, b) => a + b, 0) > 0) {
        const canvas = document.getElementById("ageChart");
        if (canvas) {
          const chart = new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
              labels: ["0-20", "21-30", "31-40", "41-50", "51+"],
              datasets: [
                {
                  label: "Number of Beneficiaries",
                  data: ageData,
                  backgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                  ],
                  borderColor: [
                    "#2A80B9",
                    "#CC4B67",
                    "#D4A017",
                    "#3A9A9A",
                    "#7A52CC",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Count" },
                },
                x: { title: { display: true, text: "Age Range" } },
              },
              plugins: { legend: { display: false } },
            },
          });
          canvas.chart = chart; // Store chart instance
        }
      }

      // Gender Chart (Pie)
      if (genderData.reduce((a, b) => a + b, 0) > 0) {
        const canvas = document.getElementById("genderChart");
        if (canvas) {
          const chart = new Chart(canvas.getContext("2d"), {
            type: "pie",
            data: {
              labels: ["Male", "Female"],
              datasets: [
                {
                  data: genderData,
                  backgroundColor: ["#36A2EB", "#FF6384"],
                  borderColor: ["#2A80B9", "#CC4B67"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                legend: { position: "bottom" },
              },
            },
          });
          canvas.chart = chart;
        }
      }

      // Marital Status Chart (Doughnut)
      if (maritalStatusData.reduce((a, b) => a + b, 0) > 0) {
        const canvas = document.getElementById("maritalStatusChart");
        if (canvas) {
          const chart = new Chart(canvas.getContext("2d"), {
            type: "doughnut",
            data: {
              labels: maritalStatusLabels,
              datasets: [
                {
                  data: maritalStatusData,
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                  borderColor: ["#CC4B67", "#2A80B9", "#D4A017", "#3A9A9A"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                legend: { position: "bottom" },
              },
            },
          });
          canvas.chart = chart;
        }
      }

      // Location Chart (Bar)
      if (locationData.length > 0) {
        const canvas = document.getElementById("locationChart");
        if (canvas) {
          const chart = new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
              labels: locationLabels,
              datasets: [
                {
                  label: "Number of Beneficiaries",
                  data: locationData,
                  backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
                  borderColor: ["#2A80B9", "#CC4B67", "#D4A017", "#3A9A9A"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Count" },
                },
                x: { title: { display: true, text: "Location" } },
              },
              plugins: { legend: { display: false } },
            },
          });
          canvas.chart = chart;
        }
      }
    }

    // Footer content with Download and Close buttons
    const footerContent = `
      <button class="button button-primary download-btn">Download</button>
      <button class="button button-secondary modal-close-btn">Close</button>
    `;

    openModal(modalContent, modalTitle, {
      showFooter: true,
      footerContent: footerContent,
      onCloseCallback: null,
    });

    // Initialize charts and add event listeners
    setTimeout(() => {
      updateCharts(currentMonth, currentYear);

      // Add dropdown event listeners
      const monthFilter = document.getElementById("monthFilter");
      const yearFilter = document.getElementById("yearFilter");

      if (monthFilter && yearFilter) {
        monthFilter.addEventListener("change", () => {
          updateCharts(parseInt(monthFilter.value), parseInt(yearFilter.value));
        });
        yearFilter.addEventListener("change", () => {
          updateCharts(parseInt(monthFilter.value), parseInt(yearFilter.value));
        });

        // Add download button event listener
        const downloadBtn = document.querySelector(".download-btn");
        if (downloadBtn) {
          downloadBtn.addEventListener("click", () => {
            const modalBody = document.querySelector(".modal-body-content");
            if (!modalBody) {
              console.error("Modal body not found for PDF export");
              return;
            }

            // Generate filename and title based on selected month and year
            const selectedMonth = parseInt(monthFilter.value);
            const selectedYear = parseInt(yearFilter.value);
            const monthName = monthNames[selectedMonth];
            const filename = `Beneficiary_Analytics_${monthName}_${selectedYear}.pdf`;
            const title = `Beneficiary Analytics - ${monthName} ${selectedYear}`;

            // Capture modal body as canvas
            html2canvas(modalBody, {
              scale: 2, // Improve resolution
              useCORS: true, // Handle external resources
              backgroundColor: "#ffffff", // White background
            })
              .then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                  orientation: "portrait",
                  unit: "mm",
                  format: "a4",
                });

                // Define margins and dimensions
                const margin = 10; // 10mm margin
                const pageWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const contentWidth = pageWidth - 2 * margin; // Width minus left and right margins
                const titleHeight = 10; // Approx height for title (16pt font)
                const titleMargin = 5; // Space below title
                const availableHeight =
                  pageHeight - 2 * margin - titleHeight - titleMargin; // Height minus margins and title

                // Calculate image dimensions
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Add title on first page
                pdf.setFontSize(16);
                pdf.text(title, pageWidth / 2, margin + 5, { align: "center" });

                if (imgHeight <= availableHeight) {
                  // Fits on one page
                  pdf.addImage(
                    imgData,
                    "PNG",
                    margin,
                    margin + titleHeight + titleMargin,
                    imgWidth,
                    imgHeight
                  );
                } else {
                  // Split across multiple pages
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

                // Save PDF
                pdf.save(filename);
              })
              .catch((error) => {
                console.error("Error generating PDF:", error);
              });
          });
        } else {
          console.warn("Download button not found");
        }
      } else {
        console.warn("Dropdowns not found:", { monthFilter, yearFilter });
      }
    }, 0);
  } else if (section === "donor") {
    // Modal title
    modalTitle = `Donor Analytics`;

    // Modal content with date range filter and scripts
    const modalContent = `
      <div class="modal-body-content">
        <div style="margin-bottom: 1rem;" class="date-range-filter flex align-center justify-end">
          <div class="date">
            <label for="fromDate">From: </label>
            <input type="date" id="fromDate" class="dropdown-filter">
          </div>
          <div class="date" style="margin-left: 1rem;">
            <label for="toDate">To: </label>
            <input type="date" id="toDate" class="dropdown-filter">
          </div>
          <button id="filterBtn" class="button button-secondary" style="margin-left: 1rem;">Filter</button>
        </div>
        
        <div style="display: grid;grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));gap: 1rem;">
          <div class="card beneficiary-analytic-chart">
            <h3>Items Received</h3>
            <div id="itemsReceivedChartContainer">
              <canvas id="itemsReceivedChart"></canvas>
            </div>
          </div>
          <div class="card beneficiary-analytic-chart">
            <h3>Cash Received by Donor Type</h3>
            <div id="cashReceivedChartContainer">
              <canvas id="cashReceivedChart"></canvas>
            </div>
          </div>
          <div class="card beneficiary-analytic-chart span-2">
            <h3>Items in Stock vs. Disbursed</h3>
            <div id="stockVsDisbursedChartContainer">
              <canvas id="stockVsDisbursedChart"></canvas>
            </div>
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

    function updateCharts(fromDate, toDate) {
      let filteredDonorData = MOCK_DONOR_ANALYTICS_DATA;
      if (fromDate || toDate) {
        filteredDonorData = filteredDonorData.filter((item) => {
          const itemDate = new Date(item.date);
          const startDate = fromDate
            ? new Date(fromDate)
            : new Date("1900-01-01");
          const endDate = toDate ? new Date(toDate) : new Date("9999-12-31");
          return itemDate >= startDate && itemDate <= endDate;
        });
      }

      let filteredDisbursementData = MOCK_DISBURSEMENT_DATA;
      if (fromDate || toDate) {
        filteredDisbursementData = filteredDisbursementData.filter((item) => {
          const itemDate = new Date(item.date_disbursed);
          const startDate = fromDate
            ? new Date(fromDate)
            : new Date("1900-01-01");
          const endDate = toDate ? new Date(toDate) : new Date("9999-12-31");
          return itemDate >= startDate && itemDate <= endDate;
        });
      }

      console.log(
        "Filtered Donor Data:",
        JSON.stringify(filteredDonorData, null, 2)
      );
      console.log(
        "Filtered Disbursement Data:",
        JSON.stringify(filteredDisbursementData, null, 2)
      );

      const itemQuantities = {};
      const itemUnits = {};
      filteredDonorData.forEach((item, index) => {
        console.log(`Donor Item ${index + 1}:`, {
          item: item.item,
          quantity: item.quantity,
          unit: item.unit,
          amount: item.amount,
          date: item.date,
        });
        const itemKey = item.item.toLowerCase().trim();
        itemQuantities[itemKey] =
          (itemQuantities[itemKey] || 0) + item.quantity;
        itemUnits[itemKey] = item.unit;
      });

      const cashByDonorType = {};
      filteredDonorData.forEach((item) => {
        const donorTypeKey = item.donor_type.trim();
        cashByDonorType[donorTypeKey] =
          (cashByDonorType[donorTypeKey] || 0) + item.amount;
      });

      const disbursedQuantities = {};
      filteredDisbursementData.forEach((item, index) => {
        item.items.forEach((disbursedItem) => {
          console.log(`Disbursed Item ${index + 1}:`, {
            item: disbursedItem.item,
            quantity: disbursedItem.quantity,
            date: item.date_disbursed,
          });
          const itemKey = disbursedItem.item.toLowerCase().trim();
          disbursedQuantities[itemKey] =
            (disbursedQuantities[itemKey] || 0) + disbursedItem.quantity;
        });
      });

      const stockQuantities = {};
      Object.keys(itemQuantities).forEach((itemKey) => {
        stockQuantities[itemKey] =
          itemQuantities[itemKey] - (disbursedQuantities[itemKey] || 0);
      });

      const itemLabels = Object.keys(itemQuantities)
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .sort();
      const itemsReceivedData = itemLabels.map(
        (item) => itemQuantities[item.toLowerCase()] || 0
      );
      const itemUnitsForTooltip = itemLabels.map(
        (item) => itemUnits[item.toLowerCase()] || "unknown"
      );

      const donorTypeLabels = Object.keys(cashByDonorType).sort();
      const cashReceivedData = donorTypeLabels.map(
        (type) => cashByDonorType[type] || 0
      );

      const stockVsDisbursedLabels = itemLabels;
      const stockData = stockVsDisbursedLabels.map(
        (item) => stockQuantities[item.toLowerCase()] || 0
      );
      const disbursedData = stockVsDisbursedLabels.map(
        (item) => disbursedQuantities[item.toLowerCase()] || 0
      );

      console.log("Items Received Labels:", itemLabels);
      console.log("Items Received Data:", itemsReceivedData);
      console.log("Item Units:", itemUnitsForTooltip);
      console.log("Cash Received Labels:", donorTypeLabels);
      console.log("Cash Received Data:", cashReceivedData);
      console.log("Stock vs. Disbursed Labels:", stockVsDisbursedLabels);
      console.log("Stock Data:", stockData);
      console.log("Disbursed Data:", disbursedData);

      const canvases = [
        "itemsReceivedChart",
        "cashReceivedChart",
        "stockVsDisbursedChart",
      ];
      canvases.forEach((id) => {
        const canvas = document.getElementById(id);
        if (canvas && canvas.chart) {
          canvas.chart.destroy();
          canvas.chart = null;
        }
      });

      const itemsReceivedContainer = document.getElementById(
        "itemsReceivedChartContainer"
      );
      const cashReceivedContainer = document.getElementById(
        "cashReceivedChartContainer"
      );
      const stockVsDisbursedContainer = document.getElementById(
        "stockVsDisbursedChartContainer"
      );

      if (itemsReceivedData.reduce((a, b) => a + b, 0) === 0) {
        itemsReceivedContainer.innerHTML =
          "<p>No items received data available</p>";
      } else {
        itemsReceivedContainer.innerHTML =
          '<canvas id="itemsReceivedChart"></canvas>';
      }
      if (cashReceivedData.reduce((a, b) => a + b, 0) === 0) {
        cashReceivedContainer.innerHTML =
          "<p>No cash received data available</p>";
      } else {
        cashReceivedContainer.innerHTML =
          '<canvas id="cashReceivedChart"></canvas>';
      }
      if (
        stockData.reduce((a, b) => a + b, 0) === 0 &&
        disbursedData.reduce((a, b) => a + b, 0) === 0
      ) {
        stockVsDisbursedContainer.innerHTML =
          "<p>No stock or disbursed data available</p>";
      } else {
        stockVsDisbursedContainer.innerHTML =
          '<canvas id="stockVsDisbursedChart"></canvas>';
      }

      if (itemsReceivedData.reduce((a, b) => a + b, 0) > 0) {
        const canvas = document.getElementById("itemsReceivedChart");
        if (canvas) {
          const chart = new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
              labels: itemLabels,
              datasets: [
                {
                  label: "Quantity Received",
                  data: itemsReceivedData,
                  backgroundColor: "#36A2EB",
                  borderColor: "#2A80B9",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Quantity" },
                },
                x: { title: { display: true, text: "Item" } },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const index = context.dataIndex;
                      const value = context.raw;
                      const unit = itemUnitsForTooltip[index];
                      return `${context.dataset.label}: ${value} ${unit}`;
                    },
                  },
                },
              },
            },
          });
          canvas.chart = chart;
        }
      }

      if (cashReceivedData.reduce((a, b) => a + b, 0) > 0) {
        const canvas = document.getElementById("cashReceivedChart");
        if (canvas) {
          const chart = new Chart(canvas.getContext("2d"), {
            type: "pie",
            data: {
              labels: donorTypeLabels,
              datasets: [
                {
                  label: "Cash Received (₦)",
                  data: cashReceivedData,
                  backgroundColor: ["#FF6384", "#36A2EB"],
                  borderColor: ["#CC4B67", "#2A80B9"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.label || "";
                      const value = context.raw;
                      return `${label}: ₦${value.toLocaleString()}`;
                    },
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 1.3,
            },
          });
          canvas.chart = chart;
        }
      }

      if (
        stockData.reduce((a, b) => a + b, 0) > 0 ||
        disbursedData.reduce((a, b) => a + b, 0) > 0
      ) {
        const canvas = document.getElementById("stockVsDisbursedChart");
        if (canvas) {
          const chart = new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
              labels: stockVsDisbursedLabels,
              datasets: [
                {
                  label: "In Stock",
                  data: stockData,
                  backgroundColor: "#4BC0C0",
                  borderColor: "#3A9A9A",
                  borderWidth: 1,
                },
                {
                  label: "Disbursed",
                  data: disbursedData,
                  backgroundColor: "#FFCE56",
                  borderColor: "#D4A017",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                x: { title: { display: true, text: "Item" } },
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Quantity" },
                },
              },
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const index = context.dataIndex;
                      const value = context.raw;
                      const unit = itemUnitsForTooltip[index];
                      return `${context.dataset.label}: ${value} ${unit}`;
                    },
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 2,
            },
          });
          canvas.chart = chart;
        }
      }
    }

    // Initialize charts and add event listeners
    setTimeout(() => {
      updateCharts(null, null); // Initial load with no filters

      // Add filter button event listener
      const fromDateInput = document.getElementById("fromDate");
      const toDateInput = document.getElementById("toDate");
      const filterBtn = document.getElementById("filterBtn");

      if (fromDateInput && toDateInput && filterBtn) {
        filterBtn.addEventListener("click", () => {
          updateCharts(fromDateInput.value, toDateInput.value);
        });

        // Reset filters on clear
        fromDateInput.addEventListener("change", (e) => {
          if (!e.target.value && !toDateInput.value) {
            updateCharts(null, null);
          }
        });
        toDateInput.addEventListener("change", (e) => {
          if (!e.target.value && !fromDateInput.value) {
            updateCharts(null, null);
          }
        });

        // Add download button event listener
        const downloadBtn = document.querySelector(".download-btn");
        if (downloadBtn) {
          downloadBtn.addEventListener("click", () => {
            const modalBody = document.querySelector(".modal-body-content");
            if (!modalBody) {
              console.error("Modal body not found for PDF export");
              return;
            }

            // Generate filename and title based on date range
            const fromDate = fromDateInput.value;
            const toDate = toDateInput.value;
            let filename = "Donor_Analytics_All.pdf";
            let title = "Donor Analytics - All Data";
            if (fromDate || toDate) {
              const fromStr = fromDate
                ? formatDateForDisplay(fromDate)
                : "Start";
              const toStr = toDate ? formatDateForDisplay(toDate) : "End";
              filename = `Donor_Analytics_${fromStr}_to_${toStr}.pdf`.replace(
                / /g,
                "_"
              );
              title = `Donor Analytics - ${fromStr} to ${toStr}`;
            }

            // Capture modal body as canvas
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

                // Define margins and dimensions
                const margin = 10;
                const pageWidth = 210;
                const pageHeight = 297;
                const contentWidth = pageWidth - 2 * margin;
                const titleHeight = 10;
                const titleMargin = 5;
                const availableHeight =
                  pageHeight - 2 * margin - titleHeight - titleMargin;

                // Calculate image dimensions
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Add title on first page
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

                // Save PDF
                pdf.save(filename);
              })
              .catch((error) => {
                console.error("Error generating PDF:", error);
              });
          });
        } else {
          console.warn("Download button not found");
        }
      } else {
        console.warn("Filter inputs or button not found:", {
          fromDateInput,
          toDateInput,
          filterBtn,
        });
      }
    }, 0);
  } else {
    openModal(modalContent, modalTitle, {
      showFooter: true,
      footerContent: `<button class="button button-secondary modal-close-btn">Close</button>`,
      onCloseCallback: null,
    });
  }
}

// --- INITIALIZATION ---
export function initReport() {
  // Initialize Segregation Table
  const segregationContainer = document.getElementById(
    "segregation-table-container"
  );
  if (segregationContainer) {
    segregationTableManager = createPaginatedTableManager(
      "segregation-table-container",
      "segregation-pagination-container",
      {
        fetchDataFunction: fetchSegregationData,
        tableHeaders: segregationHeaders,
        dropdownActions: [], // No row dropdowns
        pageKey: "segregation",
        defaultItemsPerPage: 25,
      }
    );
    segregationTableManager.init();

    // Populate Gender and Item dropdowns
    populateDropdown(
      ".segregation-content",
      ".buttons .button-secondary:nth-child(1)",
      "gender",
      MOCK_SEGREGATION_DATA,
      segregationTableManager
    );
    populateDropdown(
      ".segregation-content",
      ".buttons .button-secondary:nth-child(2)",
      "item",
      MOCK_SEGREGATION_DATA,
      segregationTableManager
    );

    // Search input
    const segregationSearchInput = document.querySelector(
      ".segregation-content .search-input"
    );
    if (segregationSearchInput) {
      segregationSearchInput.addEventListener("input", (e) => {
        segregationFilters.search = e.target.value;
        segregationTableManager.refresh();
      });
    }
  }

  // Initialize Beneficiary Table
  const beneficiaryContainer = document.getElementById(
    "beneficiary-table-container"
  );
  if (beneficiaryContainer) {
    beneficiaryTableManager = createPaginatedTableManager(
      "beneficiary-table-container",
      "beneficiary-pagination-container",
      {
        fetchDataFunction: fetchBeneficiaryData,
        tableHeaders: beneficiaryHeaders,
        dropdownActions: [], // No row dropdowns
        pageKey: "beneficiary",
        defaultItemsPerPage: 25,
      }
    );
    beneficiaryTableManager.init();

    // Analytics button
    const analyticsButton = document.querySelector(
      ".beneficiary-content .buttons .button-secondary:nth-child(1)"
    );
    if (analyticsButton) {
      analyticsButton.addEventListener("click", () =>
        handleAnalyticsModal("beneficiary")
      );
    }

    // Date filters
    const fromDateInput = document.querySelector(
      ".beneficiary-content #from_date"
    );
    const toDateInput = document.querySelector(".beneficiary-content #to_date");
    const submitButton = document.querySelector(
      ".beneficiary-content .buttons .button-secondary"
    );

    if (fromDateInput && toDateInput && submitButton) {
      submitButton.addEventListener("click", () => {
        beneficiaryFilters.fromDate = fromDateInput.value;
        beneficiaryFilters.toDate = toDateInput.value;
        beneficiaryTableManager.refresh();
      });
      // Reset filters on clear
      fromDateInput.addEventListener("change", (e) => {
        if (!e.target.value) {
          beneficiaryFilters.fromDate = "";
          beneficiaryTableManager.refresh();
        }
      });
      toDateInput.addEventListener("change", (e) => {
        if (!e.target.value) {
          beneficiaryFilters.toDate = "";
          beneficiaryTableManager.refresh();
        }
      });
    }

    // Search input
    const beneficiarySearchInput = document.querySelector(
      ".beneficiary-content .search-input"
    );
    if (beneficiarySearchInput) {
      beneficiarySearchInput.addEventListener("input", (e) => {
        beneficiaryFilters.search = e.target.value;
        beneficiaryTableManager.refresh();
      });
    }
  }

  // Initialize Donor Table
  const donorContainer = document.getElementById("donor-table-container");
  if (donorContainer) {
    donorTableManager = createPaginatedTableManager(
      "donor-table-container",
      "donor-pagination-container",
      {
        fetchDataFunction: fetchDonorData,
        tableHeaders: donorHeaders,
        dropdownActions: [], // No row dropdowns
        pageKey: "donor",
        defaultItemsPerPage: 25,
      }
    );
    donorTableManager.init();

    // Overview button
    const overviewButton = document.querySelector(
      ".donor-content .button-secondary:nth-child(1)"
    );
    if (overviewButton) {
      overviewButton.addEventListener("click", handleDonorOverviewModal);
    }

    // Analytics button
    const analyticsButton = document.querySelector(
      ".donor-content .buttons .button-secondary:nth-child(1)"
    );
    if (analyticsButton) {
      analyticsButton.addEventListener("click", () =>
        handleAnalyticsModal("donor")
      );
    }

    // Date filters
    const fromDateInput = document.querySelector(".donor-content #from_date");
    const toDateInput = document.querySelector(".donor-content #to_date");
    const submitButton = document.querySelector(
      ".donor-content .buttons .button-secondary:nth-child(3)"
    );

    if (fromDateInput && toDateInput && submitButton) {
      submitButton.addEventListener("click", () => {
        donorFilters.fromDate = fromDateInput.value;
        donorFilters.toDate = toDateInput.value;
        donorTableManager.refresh();
      });
      // Reset filters on clear
      fromDateInput.addEventListener("change", (e) => {
        if (!e.target.value) {
          donorFilters.fromDate = "";
          donorTableManager.refresh();
        }
      });
      toDateInput.addEventListener("change", (e) => {
        if (!e.target.value) {
          donorFilters.toDate = "";
          donorTableManager.refresh();
        }
      });
    }

    // Search input
    const donorSearchInput = document.querySelector(
      ".donor-content .search-input"
    );
    if (donorSearchInput) {
      donorSearchInput.addEventListener("input", (e) => {
        donorFilters.search = e.target.value;
        donorTableManager.refresh();
      });
    }
  }
}
