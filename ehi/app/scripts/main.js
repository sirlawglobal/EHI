// app/scripts/main.js

import { initializeHeader } from "./components/header.js";
import { initializeSidebar } from "./components/sidebar.js";
import { initializeFooter } from "./components/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();

  window.addEventListener("routeChangeCompleted", (e) => {
    const newTitle = e.detail.title;

    initializeHeader(newTitle); // Update the header
    document.title = `${newTitle} | Ehi Centre`; // Update the document title
  });
  initializeFooter();
});