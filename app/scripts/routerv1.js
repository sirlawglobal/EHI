const contentArea = document.getElementById("main-content");
let currentStyle;

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

function getBasePath() {
  return isLocal ? "/app" : "";
}
function getAppContentRoot() {
  // If running on localhost and the URL contains /app/, then the base is /app
  // Otherwise, assume the root of the deployment (Vercel)
  if (isLocal && window.location.pathname.startsWith("/app")) {
    return "/app";
  }
  return ""; // On Vercel, or if local without /app prefix, assume root is app content root
}

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
  // Add other routes and their corresponding module paths
};

function loadAppContent(route) {
  if (isLocal) {
    console.log(`loadAppContent called with route: ${route}`);
  }

  const appContentRoot = getAppContentRoot();
  const templatePath = `${appContentRoot}/templates${route}.html`;
  const stylePath = `${appContentRoot}/styles/layouts/${route
    .split("/")
    .pop()}.css`;

  if (isLocal) {
    console.log(`Fetching template from: ${templatePath}`);
    console.log(`Fetching style from: ${stylePath}`);
  }
  
  const base = getBasePath();
  fetch(templatePath)
  // fetch(`${base}/templates${route}.html`)
    .then((response) => {
      if (!response.ok) {
        if (route !== "/dashboard") {
          // Avoid infinite loop
          console.warn(
            `Template not found for route ${route}. Redirecting to /dashboard.`
          );
          window.history.replaceState(null, "", "/dashboard");
          loadAppContent("/dashboard");
          throw new Error("Redirecting to dashboard");
        }
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
      style.href = `${base}/styles/layouts/${routeAfterLastSlash}.css`;
      document.head.appendChild(style);
      if (currentStyle) {
        document.head.removeChild(currentStyle);
      }
      currentStyle = style;
      document.getElementById("main-content").innerHTML = html;

      const functionRoute = `/${route.split("/")[1]}`;
      if (isLocal) {
        console.log(functionRoute);
      }

      // Load the module and execute initialization
      if (routeModules[route]) {
        routeModules[route]()
          .then((module) => {
            if (isLocal) {
              console.log(route);
            }

            let initFunctionName;

            // switch (route) {
            //   case "/reports/programme-domain":
            //     initFunctionName = "initProgrammes";
            //     break;
            //   case "/reports/receipt-report":
            //   case "/reports/expenses-report":
            //     initFunctionName = "initFinance";
            //     break;
            //   default:
            //     initFunctionName = `init${
            //       functionRoute.charAt(1).toUpperCase() + functionRoute.slice(2)
            //     }`;
            //     break;
            // }

            if (route.startsWith("/reports/programme-domain")) {
              initFunctionName = "initProgrammes";
            } else if (
              route.startsWith("/reports/receipt-report") ||
              route.startsWith("/reports/expenses-report")
            ) {
              initFunctionName = "initFinance";
            } else if (route.startsWith("/finance/")) {
              // All finance sub-routes use initFinance
              initFunctionName = "initFinance";
            } else {
              // Default naming convention: /dashboard -> initDashboard, /users -> initUsers
              initFunctionName = `init${
                route.charAt(1).toUpperCase() + route.slice(2)
              }`;
            }

            if (isLocal) {
              console.log(
                `Attempting to call: ${initFunctionName} from module for route ${route}`
              );
            }


            if (module[initFunctionName]) {
              module[initFunctionName]();
            } else {
              console.warn(
                `Module for route ${route} does not have an export named ${initFunctionName}`
              );
            }
          })
          .catch((error) => {
            console.error(`Failed to load module for route ${route}`, error);
          });
      }
    })
    .catch(() => {
      contentArea.innerHTML = "<p>Content not found.</p>";
    });
}

// Initialize with hash-based routing for local, path-based for production
if (isLocal) {
  window.location.hash = window.location.hash || "#/dashboard";
  const route = window.location.hash.substring(1);
  loadAppContent(route);

  window.addEventListener("hashchange", () => {
    loadAppContent(window.location.hash.substring(1));
  });
} else {
  const route = window.location.pathname.replace("/app", "") || "/dashboard";
  loadAppContent(route);
}

// // Initial load handling
// window.addEventListener("load", () => {
//   let initialPath = window.location.pathname;
//   console.log(`Window loaded. Initial path: ${initialPath}`);

//   // Handle Vercel's default behavior for root path
//   if (initialPath === "/") {
//       // If deployed to Vercel and accessing root, rewrite to /dashboard
//       // This assumes your Vercel project's root is 'ehi' and it serves 'app/index.html' for /dashboard
//       window.history.replaceState(null, "", "/dashboard");
//       console.log("Redirecting root path to /dashboard for SPA entry.");
//       loadAppContent("/dashboard");
//   } else if (initialPath.startsWith('/app')) {
//       // If accessing /app/ or /app/index.html directly (e.g., in local dev)
//       const route = initialPath.substring(initialPath.indexOf('/app') + 4) || '/dashboard';
//       window.history.replaceState(null, "", route); // Clean up URL
//       console.log(`Cleaning up /app path to: ${route}`);
//       loadAppContent(route);
//   } else {
//       // For direct access to /dashboard, /users etc. on Vercel
//       loadAppContent(initialPath);
//   }
// });


// document.addEventListener("click", (event) => {
//   // Only intercept clicks on internal links (starting with /)
//   const target = event.target.closest("a"); // Use closest to handle clicks on child elements of <a>
//   if (target && target.getAttribute("href") && target.getAttribute("href").startsWith("/")) {
//     event.preventDefault();
//     const newUrl = target.getAttribute("href");
//     console.log(`Link clicked: ${newUrl}`);
//     window.history.pushState(null, "", newUrl);
//     loadAppContent(newUrl);
//   }
// });

// window.addEventListener("popstate", () => {
//   const route = window.location.pathname;
//   console.log(`Popstate event: Route: ${route}`);
//   loadAppContent(route);
// }); 