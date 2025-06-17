const sidebarMenuData = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "User Data",
    href: "/users",
  },
  {
    label: "Donor Data",
    href: "/donors",
  },
  {
    label: "Programme Data",
    href: "/programmes",
  },
  {
    label: "Disbursement",
    href: "/disbursement",
  },
  {
    label: "Finance",
    dropdown: true,
    items: [
      { label: "Balance Sheet", href: "/finance/balance-sheet" },
      { label: "Assets", href: "/finance/assets" },
      { label: "Liabilities", href: "/finance/liabilities" },
      { label: "Receipt", href: "/finance/receipt" },
      { label: "Expenses", href: "/finance/expenses" },
    ],
  },
  {
    label: "Report",
    dropdown: true,
    items: [
      { label: "Segregation", href: "/reports/segregation" },
      { label: "Beneficiary Domain", href: "/reports/beneficiary-domain" },
      { label: "Donor Domain", href: "/reports/donor-domain" },
      { label: "Programme Domain", href: "/reports/programme-domain" },
      { label: "Receipt Report", href: "/reports/receipt-report" },
      { label: "Expenses Report", href: "/reports/expenses-report" },
    ],
  },
  {
    label: "Archive",
    href: "/archive",
  },
  {
    label: "Admin",
    href: "/admin",
  },
];

export function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const overlay = document.getElementById("sidebar-overlay");

  if (!sidebar) {
    console.warn("Sidebar element not found. Skipping initialization.");
    return;
  }

  // Environment detection
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // Modified link builder
  function createMenuLink(item) {
    const link = document.createElement("a");

    if (isLocal) {
      link.href = `#${item.href}`; // Hash-based for local
    } else {
      link.href = item.href; // Path-based for production
    }

    link.textContent = item.label;

    // Add icon if present
    if (item.icon) {
      const icon = document.createElement("i");
      icon.className = `icon-${item.icon}`;
      link.prepend(icon);
    }

    return link;
  }

  // Modified menu builder
  function buildSidebarMenu(menuItems, parentElement) {
    const ul = document.createElement("ul");
    ul.className = "sidebar-menu";

    menuItems.forEach((item) => {
      const li = document.createElement("li");

      if (item.dropdown) {
        li.className = "sidebar-dropdown";

        const toggle = document.createElement("a");
        // toggle.href = "#";
        toggle.className = "sidebar-dropdown-toggle";
        toggle.innerHTML = `
          <i class="icon-${item.icon || "dropdown"}"></i>
          <span>${item.label}</span>
          <i class="dropdown-caret"></i>
        `;

        const dropdown = document.createElement("ul");
        dropdown.className = "sidebar-dropdown-content";

        buildSidebarMenu(item.items, dropdown);

        li.append(toggle, dropdown);
      } else {
        li.append(createMenuLink(item));
      }

      ul.appendChild(li);
    });

    parentElement.appendChild(ul);
  }

  // Clear and rebuild sidebar
  sidebar.innerHTML = '<div class="sidebar-scroll-area"></div>';
  buildSidebarMenu(
    sidebarMenuData,
    sidebar.querySelector(".sidebar-scroll-area")
  );

  // Modified active link detection
  function setActiveLink() {
    const currentPath = isLocal
      ? window.location.hash.substring(1) || "/dashboard"
      : window.location.pathname.replace("/app", "") || "/dashboard";

    document.querySelectorAll(".sidebar-menu a").forEach((link) => {
      link.classList.remove("active");

      const linkHref = link.getAttribute("href");
      if (!linkHref) return;

      const comparePath = isLocal ? linkHref.substring(1) : linkHref;

      if (currentPath.startsWith(comparePath)) {
        link.classList.add("active");

        // Keep parent dropdowns open
        let parent = link.closest(".sidebar-dropdown");
        while (parent) {
          const toggle = parent.querySelector(".sidebar-dropdown-toggle");
          const content = parent.querySelector(".sidebar-dropdown-content");
          if (toggle && content) {
            // toggle.classList.add("active");
            // content.style.maxHeight = content.scrollHeight + "px";
          }
          parent = parent.parentElement.closest(".sidebar-dropdown");
        }
      }
    });

    if (typeof initializeHeader === "function") {
      initializeHeader();
    }

    // Dispatch custom event for other components that might need to know
    const event = new CustomEvent("activePageChanged", {
      detail: {
        title: getActivePageTitle(),
        path: currentPath,
      },
    });
    window.activePage = event.detail.title;
    window.dispatchEvent(event);
    console.log(event);
    
  }

  function getActivePageTitle() {
    const activeLink = document.querySelector(".sidebar-menu a.active");
    if (!activeLink) return "Ehi Center";

    // Handle dropdown items
    const dropdownItem = activeLink.closest(".sidebar-dropdown-content");
    if (dropdownItem) {
      const dropdownToggle = dropdownItem.previousElementSibling;
      if (
        dropdownToggle &&
        dropdownToggle.classList.contains("sidebar-dropdown-toggle")
      ) {
        const dropdownLabel = dropdownToggle.querySelector("span");
        return `${dropdownLabel.textContent} > ${activeLink.textContent}`;
      }
    }

    return activeLink.textContent;
  }

  // Initialize
  setActiveLink();
  window.addEventListener(isLocal ? "hashchange" : "popstate", setActiveLink);

  // Toggle functionality remains the same
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      if (overlay) {
        overlay.style.display = sidebar.classList.contains("open")
          ? "block"
          : "none";
      }
    });
  }

  // Dropdown toggles
  sidebar.addEventListener("click", (e) => {
    const toggle = e.target.closest(".sidebar-dropdown-toggle");
    if (toggle) {
      e.preventDefault();
      const content = toggle.nextElementSibling;
      if (content) {
        const isOpening = !content.style.maxHeight;
        content.style.maxHeight = isOpening
          ? content.scrollHeight + "px"
          : null;
        toggle.classList.toggle("active", isOpening);
        // it's parent's closest sidebar-dropdown-togge too should have active
        const parent = toggle.closest(".sidebar-dropdown");
        parent
          .querySelector(".sidebar-dropdown-toggle")
          .classList.toggle("active", isOpening);
      }
    }
  });
}
