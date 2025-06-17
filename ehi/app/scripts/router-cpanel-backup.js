// app/scripts/router.js

const contentArea = document.getElementById("main-content");
let currentStyle;

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

function loadAppContent(route) {
  const templatePath = `${APP_ROOT_PATH}/templates${route.replace(
    /^\/ehi/,
    ""
  )}.html`;

  fetch(templatePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} for ${templatePath}`
        );
      }
      return response.text();
    })
    .then((html) => {
      const style = document.createElement("link");
      style.rel = "stylesheet";
      const routeAfterLastSlash = route.split("/").pop();
      style.href = `${APP_ROOT_PATH}/styles/layouts/${routeAfterLastSlash}.css`;
      document.head.appendChild(style);

      if (currentStyle) {
        document.head.removeChild(currentStyle);
      }
      currentStyle = style;

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
              case "/ehi/admin":
                initFunctionName = "initAdmin";
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
    currentPath === "/app" ||
    currentPath === "/app/"
  ) {
    window.history.replaceState(null, "", "/ehi/dashboard");
    loadAppContent("/ehi/dashboard");
  } else {
    loadAppContent(currentPath);
  }
}

window.addEventListener("load", handleInitialLoad);

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

window.addEventListener("popstate", () => {
  const route = window.location.pathname;
  loadAppContent(route);
});
