// app/scripts/components/sidebar.js

const sidebarMenuData = [
  { label: "Dashboard", href: "/ehi/dashboard" },
  { label: "User Data", href: "/ehi/users" },
  { label: "Donor Data", href: "/ehi/donors" },
  { label: "Programme Data", href: "/ehi/programmes" },
  { label: "Disbursement", href: "/ehi/disbursement" },
  {
    label: "Finance",
    dropdown: true,
    items: [
      { label: "Balance Sheet", href: "/ehi/finance/balance-sheet" },
      { label: "Assets", href: "/ehi/finance/assets" },
      { label: "Liabilities", href: "/ehi/finance/liabilities" },
      { label: "Receipt", href: "/ehi/finance/receipt" },
      { label: "Expenses", href: "/ehi/finance/expenses" },
    ],
  },
  {
    label: "Report",
    dropdown: true,
    items: [
      { label: "Segregation", href: "/ehi/reports/segregation" },
      { label: "Beneficiary Domain", href: "/ehi/reports/beneficiary-domain" },
      { label: "Donor Domain", href: "/ehi/reports/donor-domain" },
      { label: "Programme Domain", href: "/ehi/reports/programme-domain" },
      { label: "Receipt Report", href: "/ehi/reports/receipt-report" },
      { label: "Expenses Report", href: "/ehi/reports/expenses-report" },
    ],
  },
  { label: "Archive", href: "/ehi/archive" },
  { label: "Admin", href: "/ehi/admin" },
];

export function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const overlay = document.getElementById("sidebar-overlay");

  if (!sidebar) {
    console.warn("Sidebar element not found. Skipping initialization.");
    return;
  }

  function createMenuLink(item) {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;

    if (item.icon) {
      const icon = document.createElement("i");
      icon.className = `icon-${item.icon}`;
      link.prepend(icon);
    }
    return link;
  }

  function buildSidebarMenu(menuItems, parentElement) {
    const ul = document.createElement("ul");
    ul.className = "sidebar-menu";
    if (parentElement.classList.contains("sidebar-dropdown-content")) {
      ul.classList.add("sidebar-submenu");
    }

    menuItems.forEach((item) => {
      const li = document.createElement("li");

      if (item.dropdown) {
        li.className = "sidebar-dropdown";

        const toggle = document.createElement("a");
        toggle.href = "#";
        toggle.className = "sidebar-dropdown-toggle";
        toggle.innerHTML = `
          <i class="icon-${item.icon || "folder"}"></i>
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

  sidebar.innerHTML = '<div class="sidebar-scroll-area"></div>';
  const sidebarScrollArea = sidebar.querySelector(".sidebar-scroll-area");
  buildSidebarMenu(sidebarMenuData, sidebarScrollArea);
sidebarScrollArea.insertAdjacentHTML(
    "beforeend",
    `<button class="button button-secondary sign-out" onclick="window.location.href = '/'">Sign Out</button>`
  );

  document.addEventListener("click", (e) => {
    if (e.target.id === "sidebar-toggle") {
      console.log("Sidebar toggle clicked (via event delegation)");

      sidebar.classList.toggle("open");
      if (overlay) {
        overlay.style.display = sidebar.classList.contains("open")
          ? "block"
          : "none";
        setTimeout(
          () =>
            overlay.classList.toggle(
              "visible",
              sidebar.classList.contains("open")
            ),
          10
        );
      }
    }
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        overlay.classList.remove("visible");
        setTimeout(() => (overlay.style.display = "none"), 300);
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
      if (overlay) {
        overlay.classList.remove("visible");
        setTimeout(() => (overlay.style.display = "none"), 300);
      }
    }
  });

  function setActiveLink() {
    const currentPath = window.location.pathname;

    document.querySelectorAll(".sidebar-menu a").forEach((link) => {
      link.classList.remove("active");
    });
    document.querySelectorAll(".sidebar-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("active-parent");
    });
    document
      .querySelectorAll(".sidebar-dropdown-content")
      .forEach((content) => {
        content.style.maxHeight = null;
        const toggle = content.previousElementSibling;
        if (toggle && toggle.classList.contains("sidebar-dropdown-toggle")) {
          toggle.classList.remove("active");
        }
      });

    let activeLinkFound = null;

    document.querySelectorAll(".sidebar-menu a").forEach((link) => {
      const linkHref = link.getAttribute("href");
      if (!linkHref) return;

      const normalizedCurrentPath =
        currentPath.endsWith("/ehi/") && currentPath.length > 1
          ? currentPath.slice(0, -1)
          : currentPath;
      const normalizedLinkHref =
        linkHref.endsWith("/ehi/") && linkHref.length > 1
          ? linkHref.slice(0, -1)
          : linkHref;

      const isDashboardRoute =
        normalizedCurrentPath === "/ehi/dashboard" || normalizedCurrentPath === "/ehi/";
      const isDashboardLink = normalizedLinkHref === "/ehi/dashboard";

      if (isDashboardRoute && isDashboardLink) {
        link.classList.add("active");
        activeLinkFound = link;
        return;
      }

      if (
        normalizedCurrentPath.startsWith(normalizedLinkHref) &&
        normalizedLinkHref !== "/ehi/"
      ) {
        if (normalizedCurrentPath === normalizedLinkHref) {
          link.classList.add("active");
          activeLinkFound = link;
        }
      }
    });

    if (activeLinkFound) {
      let parentDropdown = activeLinkFound.closest(".sidebar-dropdown");
      while (parentDropdown) {
        const toggle = parentDropdown.querySelector(".sidebar-dropdown-toggle");
        const content = parentDropdown.querySelector(
          ".sidebar-dropdown-content"
        );
        if (toggle && content) {
          toggle.classList.add("active");
          content.style.maxHeight = content.scrollHeight + "px";
          parentDropdown.classList.add("active-parent");
        }
        parentDropdown =
          parentDropdown.parentElement.closest(".sidebar-dropdown");
      }
    }

    const currentTitle = getActivePageTitle(activeLinkFound);

    // This event is now dispatched by sidebar.js after it has updated its state and determined the title.
    window.dispatchEvent(
      new CustomEvent("routeChangeCompleted", {
        detail: {
          path: currentPath,
          title: currentTitle,
        },
      })
    );
  }

  function getActivePageTitle(activeLink) {
    if (!activeLink) return "Ehi Center";

    const dropdownContentParent = activeLink.closest(
      ".sidebar-dropdown-content"
    );
    if (dropdownContentParent) {
      const dropdownToggle = dropdownContentParent.previousElementSibling;
      if (
        dropdownToggle &&
        dropdownToggle.classList.contains("sidebar-dropdown-toggle")
      ) {
        const dropdownLabelSpan = dropdownToggle.querySelector("span");
        const dropdownLabel = dropdownLabelSpan
          ? dropdownLabelSpan.textContent.trim()
          : "Category";
        return `${dropdownLabel} > ${activeLink.textContent.trim()}`;
      }
    }
    return activeLink.textContent.trim();
  }

  // Listen for 'contentLoaded' from router.js to trigger sidebar updates
  window.addEventListener("contentLoaded", setActiveLink);

  sidebar.addEventListener("click", (e) => {
    const toggle = e.target.closest(".sidebar-dropdown-toggle");
    if (toggle) {
      e.preventDefault();
      const content = toggle.nextElementSibling;

      if (content && content.classList.contains("sidebar-dropdown-content")) {
        const isOpening =
          !content.style.maxHeight || content.style.maxHeight === "0px";

        document
          .querySelectorAll(".sidebar-dropdown-content")
          .forEach((otherContent) => {
            if (otherContent !== content && otherContent.style.maxHeight) {
              otherContent.style.maxHeight = null;
              const otherToggle = otherContent.previousElementSibling;
              if (otherToggle) otherToggle.classList.remove("active");
            }
          });

        content.style.maxHeight = isOpening
          ? content.scrollHeight + "px"
          : null;
        toggle.classList.toggle("active", isOpening);

        const parentDropdown = toggle.closest(".sidebar-dropdown");
        if (parentDropdown) {
          if (
            isOpening ||
            parentDropdown.querySelector(".sidebar-menu a.active")
          ) {
            parentDropdown.classList.add("active-parent");
          } else {
            parentDropdown.classList.remove("active-parent");
          }
        }
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".dropdown-container") &&
      !e.target.closest(".sidebar-dropdown") &&
      !e.target.classList.contains("item-category-toggle")
    ) {
      document.querySelectorAll(".sidebar-dropdown-content").forEach((m) => {
        m.style.maxHeight = null;
        const toggle = m.previousElementSibling;
        if (toggle) toggle.classList.remove("active");
      });
    }
  });
}
