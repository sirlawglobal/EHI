// app/scripts/components/header.js

export function initializeHeader(activePageTitle = "Ehi Center") {
  
  const header = document.querySelector("#header");

  if (!header) {
    console.error("Header element not found");
    return;
  }
  header.innerHTML = `
      <a class="logo">
        <img src="${window.location.origin}/app/assets/images/ehi-logo.png" alt="Ehi Centre" />
      </a>
      <h3 class="title">${activePageTitle}</h3>
      <div class="flex align-center justify-end">
        <button class="button button-primary" onclick="window.location.href = '/'">Sign Out</button>
      </div>
    `;
}
