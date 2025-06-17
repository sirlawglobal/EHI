
const contentArea = document.getElementById("main-content");
let currentStyle;

// Define the base path for assets relative to the Vercel deployment root.
// On Vercel, your 'app' folder is directly accessible at '/app'.
// On localhost, if you run 'python -m http.server' from the 'ehi' root,
// then '/app' is also the correct absolute path from the server root.
function getAppRootPath() {
  return "/app";
}

// Map routes to their corresponding JavaScript modules
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
  "/reports/programme-domain": () => import("./modules/programmeData.js"),
  "/reports/receipt-report": () => import("./modules/finance.js"),
  "/reports/expenses-report": () => import("./modules/finance.js"),
  "/archive": () => import("./modules/archive.js"),
  "/admin": () => import("./modules/admin.js"),
  // Add other routes and their corresponding module paths here
};

/**
 * Loads the content for a given route into the main content area.
 * It fetches the HTML template, applies the layout CSS, and initializes the corresponding JS module.
 * @param {string} route - The application route (e.g., "/dashboard", "/users").
 */
function loadAppContent(route) {
  console.log(`loadAppContent: Attempting to load route: ${route}`);

  // Construct the path to the HTML template
  const appRoot = getAppRootPath();
  const templatePath = `${appRoot}/templates${route}.html`; // e.g., /app/templates/dashboard.html

  fetch(templatePath)
    .then((response) => {
      console.log(`Fetch response for ${templatePath}:`, response);
      if (!response.ok) {
        // If the template doesn't exist, log an error and show "Content not found"
        throw new Error(
          `HTTP error! Status: ${response.status} for ${templatePath}`
        );
      }
      return response.text();
    })
    .then((html) => {
      // 1. Load layout-specific CSS
      const style = document.createElement("link");
      style.rel = "stylesheet";
      const routeAfterLastSlash = route.split("/").pop(); // e.g., "dashboard", "users", "balance-sheet"
      // Construct path to layout CSS (e.g., /app/styles/layouts/dashboard.css)
      style.href = `${appRoot}/styles/layouts/${routeAfterLastSlash}.css`;
      document.head.appendChild(style);

      // Remove previous layout CSS if it exists
      if (currentStyle) {
        document.head.removeChild(currentStyle);
      }
      currentStyle = style;

      // 2. Inject HTML content
      contentArea.innerHTML = html;

      // 3. Dynamically load and initialize the corresponding JavaScript module
      if (routeModules[route]) {
        routeModules[route]() // Dynamically import the module
          .then((module) => {
            let initFunctionName;

            // Determine the correct initialization function name based on the route
            // This handles specific cases like finance sub-routes and reports
            switch (route) {
              case "/finance/balance-sheet":
              case "/finance/assets":
              case "/finance/liabilities":
              case "/finance/receipt":
              case "/finance/expenses":
              case "/reports/receipt-report":
              case "/reports/expenses-report":
                initFunctionName = "initFinance"; // All finance/report-expenses/receipt use initFinance
                break;
              case "/reports/programme-domain":
                initFunctionName = "initProgrammes"; // Specific report using initProgrammes
                break;
              case "/admin":
                initFunctionName = "initAdmin"; // Admin module
                break;
              default:
                // For top-level routes like /dashboard, /users, /donors, etc.
                // Converts "/dashboard" -> "initDashboard", "/users" -> "initUsers"
                initFunctionName = `init${
                  route.charAt(1).toUpperCase() + route.slice(2)
                }`;
                break;
            }

            console.log(
              `Attempting to call: ${initFunctionName} for route: ${route}`
            );
            if (module[initFunctionName]) {
              module[initFunctionName](); // Execute the initialization function
            } else {
              console.warn(
                `Module for route ${route} does not export a function named ${initFunctionName}.`
              );
            }
          })
          .catch((error) => {
            console.error(
              `Failed to load or initialize module for route ${route}:`,
              error
            );
          });
      } else {
        console.warn(`No module defined for route: ${route}`);
      }

      // Dispatch a custom event to notify other components (e.g., sidebar) of route change
      window.dispatchEvent(new CustomEvent("routeChanged"));
    })
    .catch((error) => {
      console.error(`Error loading content for route ${route}:`, error);
      contentArea.innerHTML = `<p>Error: Could not load content for "${route}". Please try again or check the URL.</p>`;
      // Optional: Redirect to a 404 page or dashboard as a fallback
      // window.history.replaceState(null, "", "/dashboard");
      // loadAppContent("/dashboard");
    });
}

/**
 * Handles the initial page load and navigations via browser history (back/forward buttons).
 * It determines the correct route and updates the URL if necessary.
 */
function handleInitialLoad() {
  let currentPath = window.location.pathname;
  console.log(`handleInitialLoad: Current browser path: ${currentPath}`);

  // If the user lands on the root of the app or the /app/ path, redirect to /dashboard
  if (
    currentPath === "/" ||
    currentPath === "/app/" ||
    currentPath === "/app"
  ) {
    console.log("handleInitialLoad: Redirecting to /dashboard");
    window.history.replaceState(null, "", "/dashboard"); // Use replaceState to avoid extra history entry
    loadAppContent("/dashboard");
  } else {
    // For other direct navigations (e.g., user types /dashboard or /users directly)
    console.log(
      `handleInitialLoad: Loading content for direct path: ${currentPath}`
    );
    loadAppContent(currentPath);
  }
}

// Event listener for initial page load
window.addEventListener("load", handleInitialLoad);

// Event listener for internal link clicks (client-side navigation)
document.addEventListener("click", (event) => {
  // Check if the clicked element is an anchor tag and its href starts with '/' (internal link)
  if (
    event.target.tagName === "A" &&
    event.target.getAttribute("href") &&
    event.target.getAttribute("href").startsWith("/")
  ) {
    event.preventDefault(); // Prevent default browser navigation (full page reload)
    const newUrl = event.target.getAttribute("href");
    console.log(`document.click: Navigating to: ${newUrl}`);
    window.history.pushState(null, "", newUrl); // Update URL in browser history
    loadAppContent(newUrl); // Load content for the new URL
  }
});

// Event listener for browser's back/forward buttons
window.addEventListener("popstate", () => {
  const route = window.location.pathname;
  console.log(`popstate: Navigating to: ${route}`);
  loadAppContent(route); // Load content for the new URL from history
});
