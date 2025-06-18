let keyIndicatorChart; // Keep the chart instance global
let mockStockData; // Store the generated mock data globally

// Helper function to generate distinct colors for chart bars
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// call get random color four times to get four distinct colors
const distinctColors = [];
for (let i = 0; i < 5; i++) {
  distinctColors.push(getRandomColor());
}

// Function to generate the mock data for items in stock per month per year
function generateMockStockData(startYear, endYear, items) {
  const data = [];
  const months = [
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

  for (let year = startYear; year <= endYear; year++) {
    const yearData = {
      year: year,
      months: {},
    };

    months.forEach((month) => {
      const monthStock = {};
      items.forEach((item) => {
        // Generate a random stock number between 50 and 2000
        monthStock[item] = Math.floor(Math.random() * 1951) + 50;
        // monthStock[item] = Math.floor(Math.random() * 151) + 50;
      });
      yearData.months[month] = monthStock;
    });
    data.push(yearData);
  }
  return data;
}

// Function to render or update the chart based on the selected year's data
function renderStockChart(selectedYearData, items) {
  const chartCtx = document.getElementById("keyIndicatorChart");
  if (!chartCtx) {
    console.error("Canvas element with id 'keyIndicatorChart' not found.");
    return;
  }

  const labels = Object.keys(selectedYearData.months); // e.g., ['January', 'February', ...]
  const datasets = [];

  items.forEach((item) => {
    datasets.push({
      label: item.charAt(0).toUpperCase() + item.slice(1), // Capitalize for legend
      data: labels.map((month) => selectedYearData.months[month][item]),
      backgroundColor: distinctColors[items.indexOf(item)],
      // borderColor: distinctColors[items.indexOf(item)],
      borderColor: "rgba(0, 0, 0, 0.1)",
      borderWidth: 1,
    });
  });

  if (keyIndicatorChart) {
    keyIndicatorChart.destroy(); // Destroy previous chart instance if it exists
  }

  keyIndicatorChart = new Chart(chartCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.8,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Monthly Stock Levels for ${selectedYearData.year}`,
          font: {
            size: 18,
          },
        },
      },
      scales: {
        x: {
          stacked: false, // Important for grouped bars
          title: {
            display: true,
            text: "Month",
          },
        },
        y: {
          stacked: false, // Important for grouped bars
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Items in Stock",
          },
        },
      },
    },
  });
}

// Main initialization function for the dashboard
export function initDashboard() {

  const items = ["beans", "rice", "clothes","tomato paste", "others"];
  // Generate mock data for a few years
  mockStockData = generateMockStockData(2024, 2025, items);

  const yearFilter = document.getElementById("yearFilter");
  if (!yearFilter) {
    console.error("Dropdown element with id 'yearFilter' not found.");
    return;
  }

  // Populate the year filter dropdown
  mockStockData.forEach((yearObj) => {
    const option = document.createElement("option");
    option.value = yearObj.year;
    option.textContent = yearObj.year;
    yearFilter.appendChild(option);
  });

  // Set initial year to the latest year available
  const initialYearData = mockStockData[mockStockData.length - 1];
  yearFilter.value = initialYearData.year;
  renderStockChart(initialYearData, items); // Render chart with initial data

  // Add event listener for filter change
  yearFilter.addEventListener("change", (event) => {
    const selectedYear = parseInt(event.target.value);
    const selectedYearData = mockStockData.find((d) => d.year === selectedYear);
    if (selectedYearData) {
      renderStockChart(selectedYearData, items);
    }
  });
}

// Make the initDashboard function accessible globally if needed outside a module system
window.initDashboard = initDashboard;
