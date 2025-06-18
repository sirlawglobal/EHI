// app/scripts/router.js

const contentArea = document.getElementById("main-content");
let currentStyle; // Stores the currently loaded stylesheet link element
let globalListeners = []; // Track global event listeners

const APP_ROOT_PATH = "/app";

const routeModules = {
  "/dashboard": () => import("./modules/dashboard.js"),
  "/users": () => import("./modules/userData.js"),
  "/donors": () => import("./modules/donorData.js"),
  "/programmes": () => import("./modules/programmeData.js"),
  "/disbursement": () => import("./modules/disbursement.js"),
  "/finance/balance-sheet": () => import("./modules/finance.js"),
  "/finance/assets": () => import("./modules/finance.js"),
  "/finance/liabilities": () => import("./modules/finance.js"),
  "/finance/receipt": () => import("./modules/finance.js"),
  "/finance/expenses": () => import("./modules/finance.js"),
  "/reports/segregation": () => import("./modules/report.js"),
  "/reports/beneficiary-domain": () => import("./modules/report.js"),
  "/reports/donor-domain": () => import("./modules/report.js"),
  "/reports/programme-domain": () => import("./modules/programmeData.js"),
  "/reports/receipt-report": () => import("./modules/finance.js"),
  "/reports/expenses-report": () => import("./modules/finance.js"),
  "/archive": () => import("./modules/archive.js"),
  "/admin": () => import("./modules/admin.js"),
};

const routesWithoutCSS = [
  "/programmes",
  "/disbursement",
  "/finance/assets",
  "/finance/liabilities",
  "/finance/receipt",
  "/finance/expenses",
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
  const templatePath = `${APP_ROOT_PATH}/templates${route}.html`;
  // const templatePath = `${APP_ROOT_PATH}/templates${route.replace(
  //   /^\/ehi/,
  //   ""
  // )}.html`;

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
                case "/finance/balance-sheet":
                case "/finance/assets":
                case "/finance/liabilities":
                case "/finance/receipt":
                case "/finance/expenses":
                case "/reports/receipt-report":
                case "/reports/expenses-report":
                  initFunctionName = "initFinance";
                  break;
                case "/reports/segregation":
                case "/reports/beneficiary-domain":
                case "/reports/donor-domain":
                  initFunctionName = "initReport";
                  break;
                case "/reports/programme-domain":
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
                case "/finance/balance-sheet":
                case "/finance/assets":
                case "/finance/liabilities":
                case "/finance/receipt":
                case "/finance/expenses":
                case "/reports/receipt-report":
                case "/reports/expenses-report":
                  initFunctionName = "initFinance";
                  break;
                case "/reports/segregation":
                case "/reports/beneficiary-domain":
                case "/reports/donor-domain":
                  initFunctionName = "initReport";
                  break;
                case "/reports/programme-domain":
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
      window.history.replaceState(null, "", "/dashboard");
      loadAppContent("/dashboard");
    });
}

function handleInitialLoad() {
  let currentPath = window.location.pathname;

  if (
    currentPath === "/" ||
    // currentPath === "/ehi" ||
    // currentPath === "/ehi/" ||
    currentPath === "/app" ||
    currentPath === "/app/"
  ) {
    window.history.replaceState(null, "", "/dashboard");
    loadAppContent("/dashboard");
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
    event.target.getAttribute("href").startsWith("/")
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
      event.target.getAttribute("href").startsWith("/")
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
