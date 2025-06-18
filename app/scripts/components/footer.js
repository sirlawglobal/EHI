// app/scripts/components/footer.js

export function initializeFooter() {
  const footer = document.querySelector("#footer");

  if (!footer) {
    console.error("Footer element not found");
    return;
  }
  // <p>
  //   &copy; ${new Date().getFullYear()} Ehi Centre. All rights reserved.
  // </p>;
  footer.innerHTML = `
    <div class="footer-content flex justify-between align-center">
      <p> copyright &copy;ehicentre ${new Date().getFullYear()}</p>
      <p>Powered by <a href="https://example.com">GN128 Solutions</a></p>
    </div>
  `;
}
