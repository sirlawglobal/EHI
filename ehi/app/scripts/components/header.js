// app/scripts/components/header.js

export function initializeHeader(activePageTitle = "Ehi Center") {
  
  const header = document.querySelector("#header");

  if (!header) {
    console.error("Header element not found");
    return;
  }
  header.innerHTML = `
      <a class="logo">
        <img src="${window.location.origin}/ehi/app/assets/images/ehi-logo.png" alt="Ehi Centre" />
      </a>
      <h3 class="title">${activePageTitle}</h3>
      <div class="flex align-center justify-end">
        <button id="sidebar-toggle" class="burger-menu">☰</button> 
        <button class="button button-primary" onclick="window.location.href = '/ehi/'">Sign Out</button>
      </div>
    `;
}
