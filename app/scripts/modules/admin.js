// app/scripts/modules/admin.js

import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { openModal, closeModal } from "../components/modal.js";
import { formatDateForDisplay } from "../utils/formatters.js";

// --- Mock Data ---
let mockUsersRecordSummaryData = [
  {
    id: 1,
    date: "2023-01-01",
    s_n: "U001",
    last_name: "Smith",
    first_name: "John",
    email: "john.smith@example.com",
    role: "Admin",
  },
  {
    id: 2,
    date: "2023-01-05",
    s_n: "U002",
    last_name: "Doe",
    first_name: "Jane",
    email: "jane.doe@example.com",
    role: "User",
  },
  {
    id: 3,
    date: "2023-01-10",
    s_n: "U003",
    last_name: "Brown",
    first_name: "Michael",
    email: "michael.brown@example.com",
    role: "User",
  },
];

const mockCurrentUserDetails = {
  id: 1,
  s_n: "U001",
  date_registered: "2023-01-01",
  last_name: "Smith",
  first_name: "John",
  email: "john.smith@example.com",
  role: "Admin",
  last_login: "2024-05-21 10:30 AM",
  status: "Active",
  phone: "555-123-4567",
  address: "123 Main St, Anytown, USA",
};

// --- Configurations ---
const usersRecordSummaryHeaders = [
  "Date",
  "S/N",
  "Last Name",
  "First Name",
  "Email",
  "Role",
];
const usersRecordSummaryDropdownActions = ["View", "Edit", "Delete"];
let usersTableManager;

// --- Data Operations ---
async function fetchUsersData(limit, offset, searchFilter = "") {
  let filteredData = [...mockUsersRecordSummaryData];

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
        last_name: item.last_name,
        first_name: item.first_name,
        email: item.email,
        role: item.role,
      }));
      resolve({
        data: transformedData,
        totalItems: filteredData.length,
      });
    }, 300);
  });
}

function addUser(userData) {
  const newId = Math.max(...mockUsersRecordSummaryData.map((u) => u.id), 0) + 1;
  const newSN = `U${String(newId).padStart(3, "0")}`;
  const newUser = {
    id: newId,
    date: new Date().toISOString().split("T")[0], // Current date
    s_n: newSN,
    last_name: userData.lastName,
    first_name: userData.firstName,
    email: userData.email,
    role: userData.role,
  };
  mockUsersRecordSummaryData.push(newUser);
  if (
    usersTableManager &&
    document.getElementById("users-record-summary-table-container")
  ) {
    usersTableManager.refresh();
  }
}

function updateUser(id, userData) {
  const index = mockUsersRecordSummaryData.findIndex(
    (u) => u.id === parseInt(id)
  );
  if (index === -1) {
    console.warn(`User ID ${id} not found for update`);
    return false;
  }
  mockUsersRecordSummaryData[index] = {
    ...mockUsersRecordSummaryData[index],
    last_name: userData.lastName,
    first_name: userData.firstName,
    email: userData.email,
    role: userData.role,
  };
  if (usersTableManager) {
    usersTableManager.refresh();
  }
  return true;
}

function deleteUser(id) {
  const initialLength = mockUsersRecordSummaryData.length;
  mockUsersRecordSummaryData = mockUsersRecordSummaryData.filter(
    (u) => u.id !== parseInt(id)
  );
  if (mockUsersRecordSummaryData.length < initialLength) {
    if (usersTableManager) {
      usersTableManager.refresh();
    }
    return true;
  }
  console.warn(`User ID ${id} not found for deletion`);
  return false;
}

// --- Modal Handler ---
function handleUserModal(action, id) {
  const user = mockUsersRecordSummaryData.find((u) => u.id === parseInt(id));
  if (!user && action !== "view") {
    console.warn(`User ID ${id} not found`);
    return;
  }

  let modalContent, modalTitle, footerContent;
  const isView = action === "view";
  const isEdit = action === "edit";
  const actionText = isView ? "View" : isEdit ? "Edit" : "Delete";
  const buttonClass = isEdit ? "button-primary" : "button-danger";
  const buttonId = isEdit ? "confirm-edit-btn" : "confirm-delete-btn";

  if (isView || isEdit) {
    modalContent = `
      <form id="${isEdit ? "edit-user-form" : "view-user-form"}">
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value="${
            user?.last_name || ""
          }" ${isView ? "disabled" : ""} required>
        </div>
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value="${
            user?.first_name || ""
          }" ${isView ? "disabled" : ""} required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" value="${
            user?.email || ""
          }" ${isView ? "disabled" : ""} required>
        </div>
        ${
          isEdit
            ? `
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Leave blank to keep unchanged">
          </div>
        `
            : ""
        }
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" name="role" ${isView ? "disabled" : ""} required>
            <option value="user" ${
              user?.role === "User" ? "selected" : ""
            }>User</option>
            <option value="admin" ${
              user?.role === "Admin" ? "selected" : ""
            }>Admin</option>
            <option value="super-admin" ${
              user?.role === "Super Admin" ? "selected" : ""
            }>Super Admin</option>
          </select>
        </div>
      </form>
    `;
    modalTitle = `${actionText} User`;
    footerContent = isEdit
      ? `
      <button class="button ${buttonClass}" id="${buttonId}" data-item-id="${id}">Save Changes</button>
      <button class="button button-secondary modal-cancel-btn">Cancel</button>
    `
      : `
      <button class="button button-secondary modal-cancel-btn">Close</button>
    `;
  } else {
    modalContent = `<p>Are you sure you want to delete <strong>${user.first_name} ${user.last_name}</strong>?</p>`;
    modalTitle = `Confirm Delete User`;
    footerContent = `
      <button class="button ${buttonClass}" id="${buttonId}" data-item-id="${id}">Delete</button>
      <button class="button button-secondary modal-cancel-btn">Cancel</button>
    `;
  }

  openModal(modalContent, modalTitle, {
    showFooter: true,
    footerContent,
    onCloseCallback: null,
  });

  if (isEdit || action === "delete") {
    setTimeout(() => {
      const confirmBtn = document.getElementById(buttonId);
      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          if (isEdit) {
            const form = document.getElementById("edit-user-form");
            const formData = new FormData(form);
            const userData = {};
            for (let [key, value] of formData.entries()) {
              if (value) userData[key] = value; // Skip empty password
            }
            if (updateUser(id, userData)) {
              closeModal();
            }
          } else {
            if (deleteUser(id)) {
              closeModal();
            }
          }
        });
      }
    }, 50);
  }
}

// --- Table Action Handler ---
function handleTableAction(event) {
  const { action, itemId, pageKey } = event.detail;
  if (pageKey !== "admin-users-summary") return;

  switch (action.toLowerCase()) {
    case "view":
    case "edit":
    case "delete":
      handleUserModal(action.toLowerCase(), parseInt(itemId));
      break;
    default:
      console.warn(`Unhandled action: ${action} for user ID ${itemId}`);
  }
}

// --- Initialization ---
export function initAdmin() {
  const pageActionsContainer = document.querySelector(".page-actions");
  const activeViewContainer = document.getElementById("activeView");

  if (!pageActionsContainer || !activeViewContainer) {
    console.error("Admin module: Required containers not found.");
    return;
  }

  // Initialize table manager
  usersTableManager = createPaginatedTableManager(
    "users-record-summary-table-container",
    "users-pagination-container",
    {
      fetchDataFunction: fetchUsersData,
      tableHeaders: usersRecordSummaryHeaders,
      dropdownActions: usersRecordSummaryDropdownActions,
      pageKey: "admin-users-summary",
      defaultItemsPerPage: 25,
    }
  );

  // Event listener for action buttons
  pageActionsContainer.addEventListener("click", (event) => {
    const clickedButton = event.target.closest(".button");
    if (clickedButton && pageActionsContainer.contains(clickedButton)) {
      document.querySelectorAll(".page-actions .button").forEach((btn) => {
        btn.classList.remove("button-secondary");
      });
      clickedButton.classList.add("button-secondary");
      renderAdminView(clickedButton.textContent.trim(), activeViewContainer);
    }
  });

  // Table action listener
  window.removeEventListener("tableAction", handleTableAction);
  window.addEventListener("tableAction", handleTableAction);

  // Initial render
  const initialButton = pageActionsContainer.querySelector(
    ".button.button-secondary"
  );
  if (initialButton) {
    renderAdminView(initialButton.textContent.trim(), activeViewContainer);
  } else {
    const firstButton = pageActionsContainer.querySelector(".button");
    if (firstButton) {
      firstButton.classList.add("button-secondary");
      renderAdminView(firstButton.textContent.trim(), activeViewContainer);
    } else {
      activeViewContainer.innerHTML = "<p>No admin views configured.</p>";
    }
  }
}

// --- View Renderer ---
function renderAdminView(viewName, container) {
  container.innerHTML = "";

  switch (viewName) {
    case "Users Record Summary":
      container.innerHTML = `
        <div id="users-record-summary-table-container"></div>
        <div id="users-pagination-container"></div>
      `;
      usersTableManager.init();
      break;

    case "Current User":
      const currentUserCard = document.createElement("div");
      currentUserCard.className = "card";
      currentUserCard.innerHTML = `
        <h2>Current User Details</h2>
        <div class="grid" id="userDetails"></div>
      `;
      container.appendChild(currentUserCard);

      const userDetailsGrid = currentUserCard.querySelector("#userDetails");
      if (userDetailsGrid) {
        for (const key in mockCurrentUserDetails) {
          if (mockCurrentUserDetails.hasOwnProperty(key)) {
            const gridItem = document.createElement("div");
            gridItem.className = "grid-item";
            gridItem.innerHTML = `
              <p>${key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}</p>
              <p>${mockCurrentUserDetails[key]}</p>
            `;
            userDetailsGrid.appendChild(gridItem);
          }
        }
      }
      break;

    case "Add User":
      const addUserFormCard = document.createElement("div");
      addUserFormCard.className = "card";
      addUserFormCard.innerHTML = `
        <h2>Add New User</h2>
        <form id="add-user-form">
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required>
          </div>
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" name="role" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>
          <button type="submit" class="button button-secondary">Save User</button>
        </form>
      `;
      container.appendChild(addUserFormCard);

      const addUserForm = addUserFormCard.querySelector("#add-user-form");
      if (addUserForm) {
        addUserForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const formData = new FormData(addUserForm);
          const newUser = {};
          for (let [key, value] of formData.entries()) {
            newUser[key] = value;
          }
          addUser(newUser);
          addUserForm.reset();
          openModal(
            `<p>User <strong>${newUser.firstName} ${newUser.lastName}</strong> added successfully!</p>`,
            `User Added`,
            {
              showFooter: true,
              footerContent: `<button class="button button-secondary modal-cancel-btn">OK</button>`,
            }
          );
        });
      }
      break;

    default:
      container.innerHTML = "<p>Select an option from above.</p>";
      break;
  }
}
