// Page-specific configurations
const TABLE_CONFIGS = {
  users: {
    headers: [
      "Date",
      "S/N",
      "Image",
      "Last Name",
      "First Name",
      "Location",
      "Poverty Status",
      "Pin",
      "Score",
    ],
    dropdownActions: ["Open Data", "View", "Delete"],
    dataKey: "users", // For API endpoint (/api/users)
  },
  donors: {
    headers: ["Donor ID", "Name", "Contact", "Total Donated", "Last Donation"],
    dropdownActions: ["View", "Edit", "Export"],
    dataKey: "donors",
  },
  programmes: {
    headers: ["Program ID", "Name", "Beneficiaries", "Start Date", "Status"],
    dropdownActions: ["View", "Manage", "Report"],
    dataKey: "programmes",
  },
  // Add configurations for all your pages
  default: {
    headers: [], // Will auto-detect from data keys
    dropdownActions: ["View", "Edit"],
    dataKey: null,
  },
};

export function generateTable(activePage, containerId = "table-container") {
  const container = document.getElementById(containerId);
  if (!container) {
    // console.error(`Table container #${containerId} not found`);
    return;
  }

  const pageKey = activePage.toLowerCase().replace(/\s+/g, "_");
  const config = TABLE_CONFIGS[pageKey] || TABLE_CONFIGS.default;

  container.innerHTML = '<div class="loading">Loading data...</div>';

  let sampleData = [];

  // In implementation, you would fetch from API:
  // fetch(`/api/${config.dataKey}`).then(...)
   sampleData = getSampleDataForPage(pageKey);

  if (!sampleData || sampleData.length === 0) {
    container.innerHTML = '<p class="no-data">No data available</p>';
    return;
  }

  const headers =
    config.headers.length > 0
      ? config.headers
      : Object.keys(sampleData[0]).map((key) => key.replace(/_/g, " "));

  const table = document.createElement("table");
  table.className = "data-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  if (config.dropdownActions.length > 0) {
    const th = document.createElement("th");
    th.textContent = "Actions";
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  sampleData.forEach((item) => {
    const row = document.createElement("tr");

    headers.forEach((header) => {
      const td = document.createElement("td");
      const dataKey = header.toLowerCase().replace(/\s+/g, "_");

      if (dataKey === "image") {
        const img = document.createElement("img");
        img.src = item[dataKey];
        img.alt = "Image";
        td.appendChild(img);
      } else {
        td.textContent = item[dataKey] || "—";
      }
      row.appendChild(td);
    });

    // Add dropdown if configured
    if (config.dropdownActions.length > 0) {
      const td = document.createElement("td");
      td.appendChild(
        createDropdownMenu(item.id, config.dropdownActions, pageKey)
      );
      row.appendChild(td);
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.innerHTML = "";
  container.appendChild(table);
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

// Sample data generators - Replace with API calls in production
function getSampleDataForPage(pageKey) {
  const samples = {
    users: [
      {
        id: 1,
        date: "2022-01-01",
        "s/n": "1001",
        image: "https://picsum.photos/20",
        last_name: "Doe",
        first_name: "John",
        location: "New York",
        poverty_status: "Rent",
        pin: "123456",
        score: 17,
      },
      {
        id: 2,
        date: "2022-02-15",
        "s/n": "1002",
        image: "https://picsum.photos/21",
        last_name: "Smith",
        first_name: "Alice",
        location: "Los Angeles",
        poverty_status: "Own",
        pin: "234567",
        score: 23,
      },
      {
        id: 3,
        date: "2022-03-10",
        "s/n": "1003",
        image: "https://picsum.photos/22",
        last_name: "Johnson",
        first_name: "Michael",
        location: "Chicago",
        poverty_status: "Rent",
        pin: "345678",
        score: 15,
      },
    ],
    donors: [
      {
        donor_id: "D1001",
        name: "Acme Corp",
        contact: "john@acme.com",
        total_donated: "$15,000",
        last_donation: "2023-09-15",
      },
      {
        donor_id: "D1002",
        name: "XYZ Foundation",
        contact: "mary@xyz.org",
        total_donated: "$8,500",
        last_donation: "2023-08-30",
      },
    ],
    programmes: [
      {
        program_id: "P2023-001",
        name: "Food Relief",
        beneficiaries: 250,
        start_date: "2023-01-15",
        status: "Active",
      },
      {
        program_id: "P2023-002",
        name: "Education Fund",
        beneficiaries: 180,
        start_date: "2023-03-01",
        status: "Active",
      },
    ],
  };

  return samples[pageKey] || [];
}

// Initialize dropdown handlers once
document.addEventListener("click", (e) => {
  // Toggle dropdown visibility
  if (e.target.classList.contains("dropdown-toggle")) {
    e.preventDefault();
    const menu = e.target.nextElementSibling;
    document.querySelectorAll(".dropdown-menu").forEach((m) => {
      if (m !== menu) m.style.display = "none";
    });
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }

  // Close dropdowns when clicking elsewhere
  if (!e.target.closest(".dropdown-container")) {
    document.querySelectorAll(".dropdown-menu").forEach((m) => {
      m.style.display = "none";
    });
  }

  // Handle action clicks
  if (e.target.hasAttribute("data-action")) {
    e.preventDefault();
    const action = e.target.dataset.action;
    const itemId = e.target.dataset.itemId;
    const pageKey = e.target.dataset.page;

    console.log(
      `${action} action triggered for item ${itemId} on ${pageKey} page`
    );
    // In real implementation, dispatch custom event or call handler
    // window.dispatchEvent(new CustomEvent('tableAction', {
    //   detail: { action, itemId, pageKey }
    // }));
  }
});
