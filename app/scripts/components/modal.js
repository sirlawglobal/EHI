// app/scripts/components/modal.js

// Get references to the main modal elements
const modalOverlay = document.getElementById("app-modal-overlay");
const modalContentWrapper = document.getElementById(
  "app-modal-content-wrapper"
);
const modalTitle = document.getElementById("app-modal-title");
const modalBody = document.getElementById("app-modal-body");
const modalFooter = document.getElementById("app-modal-footer"); // For optional buttons
const modalCloseButton = document.getElementById("app-modal-close-button");

// Store the element that had focus before the modal opened, for accessibility
let lastFocusedElement = null;

/**
 * Opens the modal with specified content and title.
 * @param {string | HTMLElement} content - The HTML string or HTMLElement to put inside the modal body.
 * @param {string} [title=''] - The title for the modal header.
 * @param {object} [options={}] - Additional options for the modal.
 * @param {boolean} [options.showFooter=false] - Whether to show the footer section.
 * @param {string} [options.footerContent=''] - HTML content for the footer.
 * @param {Function} [options.onCloseCallback=null] - A function to call when the modal is closed.
 */
export function openModal(content, title = "", options = {}) {
  if (!modalOverlay) {
    console.error(
      "Modal elements not found. Ensure 'app-modal-overlay' and its children are in index.html."
    );
    return;
  }

  const {
    showFooter = false,
    footerContent = "",
    onCloseCallback = null,
  } = options;

  // Store the currently focused element for accessibility
  lastFocusedElement = document.activeElement;

  // Set modal content
  modalTitle.textContent = title;
  if (typeof content === "string") {
    modalBody.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    modalBody.innerHTML = ""; // Clear previous content
    modalBody.appendChild(content);
  } else {
    modalBody.innerHTML = "<p>No content provided.</p>";
  }

  // Handle footer visibility and content
  if (showFooter) {
    modalFooter.innerHTML = footerContent;
    modalFooter.style.display = "flex"; // Or 'block', depending on your CSS
    setTimeout(() => {
      const closeButtons = [
        ...document.querySelectorAll(".modal-close-btn, .modal-cancel-btn"),
      ];
      closeButtons.forEach((btn) => {
        btn.addEventListener("click", closeModal);
      });
    }, 0); // Ensure buttons are added after content is set
  } else {
    modalFooter.innerHTML = "";
    modalFooter.style.display = "none";
  }

  // Make modal visible
  modalOverlay.style.display = "flex"; // Use flex to center
  // Add a class for CSS transitions (e.g., fade-in effect)
  setTimeout(() => {
    modalOverlay.classList.add("is-visible");
    modalContentWrapper.classList.add("is-visible");
    modalContentWrapper.focus(); // Focus the modal for accessibility
  }, 10); // Small delay to allow display:flex to apply before transition

  // Store the callback for when the modal closes
  modalOverlay._onCloseCallback = onCloseCallback;

  // Add event listeners (ensure they are only added once or managed properly)
  // For simplicity here, we rely on the global listeners set up below.
}

/**
 * Closes the modal.
 */
export function closeModal() {
  if (!modalOverlay) return;

  // Add class for CSS fade-out transition
  modalOverlay.classList.remove("is-visible");
  modalContentWrapper.classList.remove("is-visible");

  // After transition, hide and clear content
  // Use a timeout that matches your CSS transition duration
  setTimeout(() => {
    modalOverlay.style.display = "none";
    modalTitle.textContent = "";
    modalBody.innerHTML = "";
    modalFooter.innerHTML = "";
    modalFooter.style.display = "none";

    // Restore focus to the element that was focused before the modal opened
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }

    // Execute the optional close callback
    if (
      modalOverlay._onCloseCallback &&
      typeof modalOverlay._onCloseCallback === "function"
    ) {
      modalOverlay._onCloseCallback();
      modalOverlay._onCloseCallback = null; // Clear the callback
    }
  }, 300); // Match this duration to your CSS transition (e.g., 0.3s)
}

// --- Event Listeners for Closing Modal ---

// Close modal when clicking on the overlay (outside the content)
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    // Ensure click is directly on the overlay, not its children
    closeModal();
  }
});

// Close modal when clicking the close button
modalCloseButton.addEventListener("click", closeModal);

// Close modal when Escape key is pressed
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalOverlay.classList.contains("is-visible")) {
    closeModal();
  }
});

// Basic focus trapping (more advanced implementations exist)
// This helps keep keyboard focus within the modal when it's open.
modalOverlay.addEventListener("focusin", (event) => {
  if (
    modalOverlay.classList.contains("is-visible") &&
    !modalContentWrapper.contains(event.target)
  ) {
    // If focus goes outside the modal content, bring it back to the close button or first focusable element
    modalCloseButton.focus();
  }
});
