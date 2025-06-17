// app/scripts/router.js

const contentArea = document.getElementById("main-content");
let currentStyle; // Stores the currently loaded stylesheet link element
let globalListeners = []; // Track global event listeners

const APP_ROOT_PATH = "/ehi/app";

const routeModules = {
  "/ehi/dashboard": () => import("./modules/dashboard.js"),
  "/ehi/users": () => import("./modules/userData.js"),
  "/ehi/donors": () => import("./modules/donorData.js"),
  "/ehi/programmes": () => import("./modules/programmeData.js"),
  "/ehi/disbursement": () => import("./modules/disbursement.js"),
  "/ehi/finance/balance-sheet": () => import("./modules/finance.js"),
  "/ehi/finance/assets": () => import("./modules/finance.js"),
  "/ehi/finance/liabilities": () => import("./modules/finance.js"),
  "/ehi/finance/receipt": () => import("./modules/finance.js"),
  "/ehi/finance/expenses": () => import("./modules/finance.js"),
  "/ehi/reports/segregation": () => import("./modules/report.js"),
  "/ehi/reports/beneficiary-domain": () => import("./modules/report.js"),
  "/ehi/reports/donor-domain": () => import("./modules/report.js"),
  "/ehi/reports/programme-domain": () => import("./modules/programmeData.js"),
  "/ehi/reports/receipt-report": () => import("./modules/finance.js"),
  "/ehi/reports/expenses-report": () => import("./modules/finance.js"),
  "/ehi/archive": () => import("./modules/archive.js"),
  "/ehi/admin": () => import("./modules/admin.js"),
};

const routesWithoutCSS = [
  "/ehi/programmes",
  "/ehi/disbursement",
  "/ehi/finance/assets",
  "/ehi/finance/liabilities",
  "/ehi/finance/receipt",
  "/ehi/finance/expenses",
];

// Helper function to track and add global listeners
function addGlobalListener(element, type, handler) {
  element.addEventListener(type, handler);
  globalListeners.push({ element, type, handler });
}

// Helper function to remove all global listeners
function removeGlobalListeners() {
  globalListeners.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler);
  });
  globalListeners = [];
}

// Helper function to check if a stylesheet exists before loading
function loadStylesheet(href) {
  return new Promise((resolve, reject) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = href;

    style.onload = () => {
      resolve(style);
    };
    document.head.appendChild(style);

    style.onerror = () => {
      resolve(null);
    };
  });
}

function loadAppContent(route) {
  // const templatePath = `${APP_ROOT_PATH}/templates${route}.html`;
  const templatePath = `${APP_ROOT_PATH}/templates${route.replace(
    /^\/ehi/,
    ""
  )}.html`;

  // Cleanup: Reset main-content and remove global listeners
  contentArea.innerHTML = ""; // Clear DOM to remove all listeners
  removeGlobalListeners(); // Remove all tracked global listeners

  // Clone and replace modal to remove any lingering listeners
  const modal = document.getElementById("app-modal");
  if (modal) {
    const newModal = modal.cloneNode(false); // Shallow clone to remove listeners
    modal.parentNode.replaceChild(newModal, modal);
  }

  fetch(templatePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} for ${templatePath}`
        );
      }
      return response.text();
    })
    .then(async (html) => {
      try {
        let newStyle = null;
        if (!routesWithoutCSS.includes(route)) {
          const routeAfterLastSlash = route.split("/").pop();
          const stylesheetPath = `${APP_ROOT_PATH}/styles/layouts/${routeAfterLastSlash}.css`;
          newStyle = await loadStylesheet(stylesheetPath);
        }

        if (currentStyle) {
          document.head.removeChild(currentStyle);
        }
        currentStyle = newStyle;

        contentArea.innerHTML = html;

        if (routeModules[route]) {
          routeModules[route]()
            .then((module) => {
              let initFunctionName;
              switch (route) {
                case "/ehi/finance/balance-sheet":
                case "/ehi/finance/assets":
                case "/ehi/finance/liabilities":
                case "/ehi/finance/receipt":
                case "/ehi/finance/expenses":
                case "/ehi/reports/receipt-report":
                case "/ehi/reports/expenses-report":
                  initFunctionName = "initFinance";
                  break;
                case "/ehi/reports/segregation":
                case "/ehi/reports/beneficiary-domain":
                case "/ehi/reports/donor-domain":
                  initFunctionName = "initReport";
                  break;
                case "/ehi/reports/programme-domain":
                  initFunctionName = "initProgrammes";
                  break;
                default:
                  const routeName = route
                    .replace(/^\/ehi\//, "")
                    .replace(/-([a-z])/g, (m, l) => l.toUpperCase());
                  initFunctionName = `init${
                    routeName.charAt(0).toUpperCase() + routeName.slice(1)
                  }`;
                  break;
              }

              if (module[initFunctionName]) {
                module[initFunctionName]();
              } else {
                console.warn(
                  `Router: Module for route ${route} does not export a function named ${initFunctionName}.`
                );
              }
            })
            .catch((error) => {
              console.error(
                `Router: Failed to load or initialize module for route ${route}:`,
                error
              );
            });
        } else {
          console.warn(`Router: No module defined for route: ${route}`);
        }

        window.dispatchEvent(
          new CustomEvent("contentLoaded", {
            detail: { path: route },
          })
        );
      } catch (styleError) {
        console.error(
          `Router: Error loading stylesheet for route ${route}:`,
          styleError
        );
        contentArea.innerHTML = html;

        if (routeModules[route]) {
          routeModules[route]()
            .then((module) => {
              let initFunctionName;
              switch (route) {
                case "/ehi/finance/balance-sheet":
                case "/ehi/finance/assets":
                case "/ehi/finance/liabilities":
                case "/ehi/finance/receipt":
                case "/ehi/finance/expenses":
                case "/ehi/reports/receipt-report":
                case "/ehi/reports/expenses-report":
                  initFunctionName = "initFinance";
                  break;
                case "/ehi/reports/segregation":
                case "/ehi/reports/beneficiary-domain":
                case "/ehi/reports/donor-domain":
                  initFunctionName = "initReport";
                  break;
                case "/ehi/reports/programme-domain":
                  initFunctionName = "initProgrammes";
                  break;
                default:
                  initFunctionName = `init${
                    route.charAt(1).toUpperCase() + route.slice(2)
                  }`;
                  break;
              }

              if (module[initFunctionName]) {
                module[initFunctionName]();
              } else {
                console.warn(
                  `Router: Module for route ${route} does not export a function named ${initFunctionName}.`
                );
              }
            })
            .catch((error) => {
              console.error(
                `Router: Failed to load or initialize module for route ${route}:`,
                error
              );
            });
        } else {
          console.warn(`Router: No module defined for route: ${route}`);
        }
        window.dispatchEvent(
          new CustomEvent("contentLoaded", {
            detail: { path: route },
          })
        );
      }
    })
    .catch((error) => {
      console.error(`Router: Error loading content for route ${route}:`, error);
      contentArea.innerHTML = `<p>Error: Could not load content for "${route}". Please try again or check the URL.</p>`;
      window.history.replaceState(null, "", "/ehi/dashboard");
      loadAppContent("/ehi/dashboard");
    });
}

function handleInitialLoad() {
  let currentPath = window.location.pathname;

  if (
    currentPath === "/" ||
    currentPath === "/ehi" ||
    currentPath === "/ehi/" ||
    currentPath === "/ehi/app" ||
    currentPath === "/ehi/app/"
  ) {
    window.history.replaceState(null, "", "/ehi/dashboard");
    loadAppContent("/ehi/dashboard");
  } else {
    loadAppContent(currentPath);
  }
}

// Track global listeners
window.addEventListener("load", handleInitialLoad);
globalListeners.push({
  element: window,
  type: "load",
  handler: handleInitialLoad,
});

document.addEventListener("click", (event) => {
  if (
    event.target.tagName === "A" &&
    event.target.getAttribute("href") &&
    event.target.getAttribute("href").startsWith("/ehi/")
  ) {
    event.preventDefault();
    const newUrl = event.target.getAttribute("href");
    window.history.pushState(null, "", newUrl);
    loadAppContent(newUrl);
  }
});
globalListeners.push({
  element: document,
  type: "click",
  handler: (event) => {
    if (
      event.target.tagName === "A" &&
      event.target.getAttribute("href") &&
      event.target.getAttribute("href").startsWith("/ehi/")
    ) {
      event.preventDefault();
      const newUrl = event.target.getAttribute("href");
      window.history.pushState(null, "", newUrl);
      loadAppContent(newUrl);
    }
  },
});

window.addEventListener("popstate", () => {
  const route = window.location.pathname;
  loadAppContent(route);
});
globalListeners.push({
  element: window,
  type: "popstate",
  handler: () => {
    const route = window.location.pathname;
    loadAppContent(route);
  },
});
