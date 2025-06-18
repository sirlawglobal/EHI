// app/scripts/modules/programmes.js

import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { openModal, closeModal } from "../components/modal.js";

// --- Mock Backend Data ---
const MOCK_FULL_PROGRAMMES_DATASET = [
  {
    id: 1,
    creation_date: "2025-03-12",
    beneficiary_name: "Zainab Bako",
    pin: "123456",
    safety_net: {
      value: "Enrolled",
      date: { enrolled: "2024-03-25", exited: "" },
    },
    upliftment_project: {
      value: "Enrolled",
      date: { enrolled: "2024-04-01", exited: "" },
    },
    micro_credit_referral: "Yes",
    institution_referred_to: "Unity Touch",
  },
  {
    id: 2,
    creation_date: "2025-02-12",
    beneficiary_name: "Emeka Eze",
    pin: "654321",
    safety_net: {
      value: "Exited",
      date: { enrolled: "2023-01-15", exited: "2024-02-20" },
    },
    upliftment_project: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    micro_credit_referral: "No",
    institution_referred_to: "",
  },
  {
    id: 3,
    creation_date: "2025-01-12",
    beneficiary_name: "Adaobi Nnaji",
    pin: "789012",
    safety_net: {
      value: "Enrolled",
      date: { enrolled: "2024-01-10", exited: "" },
    },
    upliftment_project: {
      value: "Enrolled",
      date: { enrolled: "2024-02-05", exited: "" },
    },
    micro_credit_referral: "Yes",
    institution_referred_to: "Sunlight Org",
  },
  {
    id: 4,
    creation_date: "2025-03-15",
    beneficiary_name: "Samuel Ojo",
    pin: "345678",
    safety_net: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    upliftment_project: {
      value: "Exited",
      date: { enrolled: "2023-05-01", exited: "2024-01-30" },
    },
    micro_credit_referral: "No",
    institution_referred_to: "",
  },
  {
    id: 5,
    creation_date: "2025-02-20",
    beneficiary_name: "Nkechi Umeh",
    pin: "901234",
    safety_net: {
      value: "Enrolled",
      date: { enrolled: "2024-04-01", exited: "" },
    },
    upliftment_project: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    micro_credit_referral: "Yes",
    institution_referred_to: "Life Support",
  },
  {
    id: 6,
    creation_date: "2025-01-25",
    beneficiary_name: "Tope Adisa",
    pin: "567890",
    safety_net: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    upliftment_project: {
      value: "Exited",
      date: { enrolled: "2023-08-10", exited: "2024-03-15" },
    },
    micro_credit_referral: "No",
    institution_referred_to: "",
  },
  {
    id: 7,
    creation_date: "2025-03-01",
    beneficiary_name: "Favour Yakubu",
    pin: "112233",
    safety_net: {
      value: "Enrolled",
      date: { enrolled: "2024-05-01", exited: "" },
    },
    upliftment_project: {
      value: "Enrolled",
      date: { enrolled: "2024-05-10", exited: "" },
    },
    micro_credit_referral: "Yes",
    institution_referred_to: "Unity Dev",
  },
  {
    id: 8,
    creation_date: "2025-02-05",
    beneficiary_name: "Kolapo Ayo",
    pin: "445566",
    safety_net: {
      value: "Exited",
      date: { enrolled: "2023-02-01", exited: "2024-01-01" },
    },
    upliftment_project: {
      value: "Exited",
      date: { enrolled: "2023-03-01", exited: "2024-02-01" },
    },
    micro_credit_referral: "No",
    institution_referred_to: "",
  },
  {
    id: 9,
    creation_date: "2025-01-10",
    beneficiary_name: "Blessing Ndukwe",
    pin: "778899",
    safety_net: {
      value: "Enrolled",
      date: { enrolled: "2024-03-01", exited: "" },
    },
    upliftment_project: {
      value: "Enrolled",
      date: { enrolled: "2024-03-10", exited: "" },
    },
    micro_credit_referral: "Yes",
    institution_referred_to: "Strong Future",
  },
  {
    id: 10,
    creation_date: "2025-03-18",
    beneficiary_name: "Chinedu Okoro",
    pin: "001122",
    safety_net: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    upliftment_project: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    micro_credit_referral: "No",
    institution_referred_to: "",
  },
  {
    id: 11,
    creation_date: "2025-02-28",
    beneficiary_name: "Funke Alabi",
    pin: "223344",
    safety_net: {
      value: "Enrolled",
      date: { enrolled: "2024-04-15", exited: "" },
    },
    upliftment_project: {
      value: "Enrolled",
      date: { enrolled: "2024-04-20", exited: "" },
    },
    micro_credit_referral: "Yes",
    institution_referred_to: "Innovate Hub",
  },
  {
    id: 12,
    creation_date: "2025-01-30",
    beneficiary_name: "Kingsley Obi",
    pin: "556677",
    safety_net: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    upliftment_project: {
      value: "No",
      date: { enrolled: "", exited: "" },
    },
    micro_credit_referral: "No",
    institution_referred_to: "",
  },
];

// --- Helper Functions ---
function formatDateForDisplay(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// --- Route Detection ---
let isProgrammeDomainPage = false;

function checkRoute() {
  const pathname = window.location.pathname;
  isProgrammeDomainPage =
    pathname.includes("/reports/programme-domain") ||
    document.title === "Report > Programme Domain";
  return isProgrammeDomainPage;
}

// --- Table Configurations ---
const defaultProgrammeHeaders = [
  "S/N",
  "Date",
  "Name of Beneficiary",
  "Safety Net",
  "Upliftment Project",
  "Referral to Micro-Credit",
];
const defaultProgrammeDropdownActions = ["edit", "view", "delete"];

const programmeDomainHeaders = [
  "S/N",
  "Date",
  "Name of Beneficiary",
  "Safety Net",
  "Upliftment Project",
  "Referral to Micro-Credit",
  "View",
];
const programmeDomainDropdownActions = [];

function transformProgramme(programme, isProgrammeDomain = false) {
  const baseData = {
    id: programme.id,
    date: formatDateForDisplay(programme.creation_date),
    name_of_beneficiary: programme.beneficiary_name,
    safety_net: programme.safety_net.value,
    upliftment_project: programme.upliftment_project.value,
    "referral_to_micro-credit":
      programme.institution_referred_to || programme.micro_credit_referral,
  };
  if (isProgrammeDomain) {
    baseData.view = `
      <svg class="view-icon" data-id="${programme.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>`;
  }
  return baseData;
}

// --- Filter State ---
let programmeFilters = { fromDate: "", toDate: "", search: "" };

// --- Fetch Function ---
async function fetchProgrammesDataFromAPI(limit, offset, searchFilter = "") {
  let filteredData = MOCK_FULL_PROGRAMMES_DATASET;

  // Apply date filters
  if (programmeFilters.fromDate || programmeFilters.toDate) {
    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.creation_date);
      const fromDate = programmeFilters.fromDate
        ? new Date(programmeFilters.fromDate)
        : new Date("1900-01-01");
      const toDate = programmeFilters.toDate
        ? new Date(programmeFilters.toDate)
        : new Date("9999-12-31");
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }

  // Apply search filter
  if (searchFilter) {
    searchFilter = searchFilter.toLowerCase();
    filteredData = filteredData.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchFilter)
      )
    );
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedRawData = filteredData.slice(offset, offset + limit);
      const transformedData = paginatedRawData.map((item) =>
        transformProgramme(item, isProgrammeDomainPage)
      );
      resolve({
        data: transformedData,
        totalItems: filteredData.length,
      });
    }, 500);
  });
}

// --- Modal Functions ---
function generateProgrammeFormHTML(programme = {}, mode = "add") {
  const isViewMode = mode === "view";
  const disabledAttr = isViewMode ? "disabled" : "";
  const beneficiaryName = programme.beneficiary_name || "";
  const pin = programme.pin || "";
  const safetyNetValue = programme.safety_net?.value || "No";
  const safetyNetEnrolledDate = programme.safety_net?.date?.enrolled || "";
  const safetyNetExitedDate = programme.safety_net?.date?.exited || "";
  const upliftmentProjectValue = programme.upliftment_project?.value || "No";
  const upliftmentProjectEnrolledDate =
    programme.upliftment_project?.date?.enrolled || "";
  const upliftmentProjectExitedDate =
    programme.upliftment_project?.date?.exited || "";
  const microCreditReferralValue = programme.micro_credit_referral || "No";
  const institutionReferredTo = programme.institution_referred_to || "";

  const getFormattedDate = (dateString) => dateString || "";
  const showSafetyNetEnrolledDate = safetyNetValue === "Enrolled";
  const showSafetyNetExitedDate = safetyNetValue === "Exited";
  const showUpliftmentProjectEnrolledDate =
    upliftmentProjectValue === "Enrolled";
  const showUpliftmentProjectExitedDate = upliftmentProjectValue === "Exited";
  const showInstitutionReferredTo = microCreditReferralValue === "Yes";

  return `
    <div class="modal-form-grid">
      <div class="form-group">
        <label for="programme-pin">Pin</label>
        <input type="text" id="programme-pin" value="${pin}" ${disabledAttr} ${
    mode === "edit" ? "readonly" : ""
  } />
      </div>
      <div class="form-group">
        <label for="programme-beneficiary-name">Name of Beneficiary</label>
        <input type="text" id="programme-beneficiary-name" value="${beneficiaryName}" ${disabledAttr} />
      </div>
      <div class="form-group">
        <label for="programme-safety-net">Safety Net</label>
        <select id="programme-safety-net" ${disabledAttr}>
          <option value="No" ${
            safetyNetValue === "No" ? "selected" : ""
          }>No</option>
          <option value="Enrolled" ${
            safetyNetValue === "Enrolled" ? "selected" : ""
          }>Enrolled</option>
          <option value="Exited" ${
            safetyNetValue === "Exited" ? "selected" : ""
          }>Exited</option>
        </select>
      </div>
      <div class="form-group dynamic-date-field" id="safety-net-enrolled-date-group" style="display: ${
        showSafetyNetEnrolledDate ? "flex" : "none"
      };">
        <label for="safety-net-date-enrolled">Date Enrolled</label>
        <input type="date" id="safety-net-date-enrolled" value="${getFormattedDate(
          safetyNetEnrolledDate
        )}" ${disabledAttr}>
      </div>
      <div class="form-group dynamic-date-field" id="safety-net-exited-date-group" style="display: ${
        showSafetyNetExitedDate ? "flex" : "none"
      };">
        <label for="safety-net-date-exited">Date Exited</label>
        <input type="date" id="safety-net-date-exited" value="${getFormattedDate(
          safetyNetExitedDate
        )}" ${disabledAttr}>
      </div>
      <div class="form-group">
        <label for="programme-upliftment-project">Upliftment Project</label>
        <select id="programme-upliftment-project" ${disabledAttr}>
          <option value="No" ${
            upliftmentProjectValue === "No" ? "selected" : ""
          }>No</option>
          <option value="Enrolled" ${
            upliftmentProjectValue === "Enrolled" ? "selected" : ""
          }>Enrolled</option>
          <option value="Exited" ${
            upliftmentProjectValue === "Exited" ? "selected" : ""
          }>Exited</option>
        </select>
      </div>
      <div class="form-group dynamic-date-field" id="upliftment-project-enrolled-date-group" style="display: ${
        showUpliftmentProjectEnrolledDate ? "flex" : "none"
      };">
        <label for="upliftment-project-date-enrolled">Date Enrolled</label>
        <input type="date" id="upliftment-project-date-enrolled" value="${getFormattedDate(
          upliftmentProjectEnrolledDate
        )}" ${disabledAttr}>
      </div>
      <div class="form-group dynamic-date-field" id="upliftment-project-exited-date-group" style="display: ${
        showUpliftmentProjectExitedDate ? "flex" : "none"
      };">
        <label for="upliftment-project-date-exited">Date Exited</label>
        <input type="date" id="upliftment-project-date-exited" value="${getFormattedDate(
          upliftmentProjectExitedDate
        )}" ${disabledAttr}>
      </div>
      <div class="form-group">
        <label for="programme-micro-credit-referral">Referral to Micro Credit</label>
        <select id="programme-micro-credit-referral" ${disabledAttr}>
          <option value="No" ${
            microCreditReferralValue === "No" ? "selected" : ""
          }>No</option>
          <option value="Yes" ${
            microCreditReferralValue === "Yes" ? "selected" : ""
          }>Yes</option>
        </select>
      </div>
      <div class="form-group" id="institution-referred-to-group" style="display: ${
        showInstitutionReferredTo ? "flex" : "none"
      };">
        <label for="programme-institution-referred-to">Institution Referred To</label>
        <input type="text" id="programme-institution-referred-to" value="${institutionReferredTo}" ${disabledAttr}>
      </div>
    </div>
  `;
}

function attachProgrammeModalListeners(mode) {
  const modalBody = document.getElementById("app-modal-body");
  const modalFooter = document.getElementById("app-modal-footer");

  const modalCancelBtn = modalFooter.querySelector(".modal-cancel-btn");
  const modalCloseBtn = modalFooter.querySelector(".modal-close-btn");

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", closeModal);
  }
  if (modalCloseBtn) {
    modalCancelBtn.addEventListener("click", closeModal);
  }

  const setupDateFieldVisibility = (
    selectId,
    enrolledDateGroupId,
    exitedDateGroupId
  ) => {
    const selectElement = modalBody.querySelector(`#${selectId}`);
    const enrolledDateGroup = modalBody.querySelector(
      `#${enrolledDateGroupId}`
    );
    const exitedDateGroup = modalBody.querySelector(`#${exitedDateGroupId}`);

    if (selectElement) {
      const updateVisibility = () => {
        if (enrolledDateGroup)
          enrolledDateGroup.style.display =
            selectElement.value === "Enrolled" ? "flex" : "none";
        if (exitedDateGroup)
          exitedDateGroup.style.display =
            selectElement.value === "Exited" ? "flex" : "none";
      };
      selectElement.addEventListener("change", updateVisibility);
      updateVisibility();
    }
  };

  setupDateFieldVisibility(
    "programme-safety-net",
    "safety-net-enrolled-date-group",
    "safety-net-exited-date-group"
  );
  setupDateFieldVisibility(
    "programme-upliftment-project",
    "upliftment-project-enrolled-date-group",
    "upliftment-project-exited-date-group"
  );

  const microCreditSelect = modalBody.querySelector(
    "#programme-micro-credit-referral"
  );
  const institutionGroup = modalBody.querySelector(
    "#institution-referred-to-group"
  );

  if (microCreditSelect && institutionGroup) {
    const updateInstitutionVisibility = () => {
      institutionGroup.style.display =
        microCreditSelect.value === "Yes" ? "flex" : "none";
    };
    microCreditSelect.addEventListener("change", updateInstitutionVisibility);
    updateInstitutionVisibility();
  }

  const saveUpdateBtn = document.getElementById("modal-save-update-btn");
  if (saveUpdateBtn) {
    saveUpdateBtn.addEventListener("click", () => {
      const programmeId = saveUpdateBtn.dataset.programmeId
        ? parseInt(saveUpdateBtn.dataset.programmeId)
        : null;
      const collectedData = {
        id: programmeId,
        beneficiary_name:
          modalBody.querySelector("#programme-beneficiary-name")?.value || "",
        pin: modalBody.querySelector("#programme-pin")?.value || "",
        safety_net: {
          value:
            modalBody.querySelector("#programme-safety-net")?.value || "No",
          date: {
            enrolled:
              modalBody.querySelector("#safety-net-date-enrolled")?.value || "",
            exited:
              modalBody.querySelector("#safety-net-date-exited")?.value || "",
          },
        },
        upliftment_project: {
          value:
            modalBody.querySelector("#programme-upliftment-project")?.value ||
            "No",
          date: {
            enrolled:
              modalBody.querySelector("#upliftment-project-date-enrolled")
                ?.value || "",
            exited:
              modalBody.querySelector("#upliftment-project-date-exited")
                ?.value || "",
          },
        },
        micro_credit_referral:
          modalBody.querySelector("#programme-micro-credit-referral")?.value ||
          "No",
        institution_referred_to:
          modalBody.querySelector("#programme-institution-referred-to")
            ?.value || "",
      };

      if (mode === "add") {
        const newId =
          Math.max(...MOCK_FULL_PROGRAMMES_DATASET.map((p) => p.id)) + 1;
        collectedData.id = newId;
        collectedData.creation_date = new Date().toISOString().slice(0, 10);
        MOCK_FULL_PROGRAMMES_DATASET.push(collectedData);
        alert(
          `Programme data for ${collectedData.beneficiary_name} added successfully!`
        );
      } else if (mode === "edit") {
        const index = MOCK_FULL_PROGRAMMES_DATASET.findIndex(
          (p) => p.id === collectedData.id
        );
        if (index !== -1) {
          collectedData.creation_date =
            MOCK_FULL_PROGRAMMES_DATASET[index].creation_date;
          MOCK_FULL_PROGRAMMES_DATASET[index] = collectedData;
          alert(
            `Programme data for ${collectedData.beneficiary_name} updated successfully!`
          );
        } else {
          console.warn("Programme not found for update:", collectedData);
        }
      }
      closeModal();
    });
  }
}

function handleProgrammeModal(programme = {}, mode = "add") {
  let modalTitle = "";
  let footerButtonText = "";
  let showFooter = true;

  if (mode === "add") {
    modalTitle = "Add Programme Data";
    footerButtonText = "Save";
  } else if (mode === "edit") {
    modalTitle = `Edit Programme Data for ${programme.beneficiary_name}`;
    footerButtonText = "Update";
  } else if (mode === "view") {
    modalTitle = `View Programme Data for ${programme.beneficiary_name}`;
    footerButtonText = "Close";
    showFooter = true;
  }

  const modalContent = generateProgrammeFormHTML(programme, mode);
  const footerContent =
    mode === "view"
      ? `<button class="button button-secondary modal-close-btn">Close</button>`
      : `<button class="button button-primary" id="modal-save-update-btn" data-programme-id="${
          programme.id || ""
        }">${footerButtonText}</button>
         <button class="button button-secondary modal-cancel-btn">Cancel</button>`;

  openModal(modalContent, modalTitle, {
    showFooter: showFooter,
    footerContent: footerContent,
    onCloseCallback: () => {
      programmeTableManager.refresh();
    },
  });

  if (mode !== "view") {
    setTimeout(() => attachProgrammeModalListeners(mode), 50);
  }
}

function handleAnalyticsModal() {
  const modalTitle = "Programme Analytics";

  const modalContent = `
    <div class="modal-body-content">
      <div class="card">
        <h3>Enrollment and Exit Status</h3>
        <div id="programmeChartContainer" class="chart-container">
          <canvas id="programmeChart"></canvas>
        </div>
      </div>
    </div>
  `;

  const footerContent = `
    <button class="button button-primary download-btn">Download</button>
    <button class="button button-secondary modal-close-btn">Close</button>
  `;

  openModal(modalContent, modalTitle, {
    showFooter: true,
    footerContent,
    onCloseCallback: null,
  });

  function renderChart() {
    // Aggregate data
    const upliftmentEnrolled = MOCK_FULL_PROGRAMMES_DATASET.filter(
      (item) => item.upliftment_project.value === "Enrolled"
    ).length;
    const upliftmentExited = MOCK_FULL_PROGRAMMES_DATASET.filter(
      (item) => item.upliftment_project.value === "Exited"
    ).length;
    const safetyNetEnrolled = MOCK_FULL_PROGRAMMES_DATASET.filter(
      (item) => item.safety_net.value === "Enrolled"
    ).length;
    const safetyNetExited = MOCK_FULL_PROGRAMMES_DATASET.filter(
      (item) => item.safety_net.value === "Exited"
    ).length;

    // Check for data availability
    const total =
      upliftmentEnrolled +
      upliftmentExited +
      safetyNetEnrolled +
      safetyNetExited;
    const chartContainer = document.getElementById("programmeChartContainer");
    if (total === 0) {
      chartContainer.innerHTML = "<p>No programme data available</p>";
      return;
    } else {
      chartContainer.innerHTML = '<canvas id="programmeChart"></canvas>';
    }

    // Create pie chart
    const canvas = document.getElementById("programmeChart");
    if (canvas) {
      const chart = new Chart(canvas.getContext("2d"), {
        type: "pie",
        data: {
          labels: [
            `Upliftment Enrolled: ${upliftmentEnrolled}`,
            `Upliftment Exited: ${upliftmentExited}`,
            `Safety Net Enrolled: ${safetyNetEnrolled}`,
            `Safety Net Exited: ${safetyNetExited}`,
          ],
          datasets: [
            {
              data: [
                upliftmentEnrolled,
                upliftmentExited,
                safetyNetEnrolled,
                safetyNetExited,
              ],
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)", // Blue
                "rgba(255, 99, 132, 0.6)", // Red
                "rgba(75, 192, 192, 0.6)", // Green
                "rgba(255, 159, 64, 0.6)", // Orange
              ],
              borderColor: ["#36A2EB", "#FF6384", "#4BC0C0", "#FF9F40"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.6,
          plugins: {
            legend: { position: "right" },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label;
                  const value = context.raw;
                  return `${label}`;
                },
              },
            },
          },
        },
      });
      canvas.chart = chart;
    }
  }

  setTimeout(() => {
    // Render chart
    renderChart();

    // Download PDF
    const downloadBtn = document.querySelector(".download-btn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const modalBody = document.querySelector(".modal-body-content");
        if (!modalBody) {
          console.error("Modal body not found for PDF export");
          return;
        }

        const filename = `Programme_Analytics.pdf`;
        const title = `Programme Analytics`;

        html2canvas(modalBody, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        })
          .then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
            });

            const margin = 10;
            const pageWidth = 210;
            const pageHeight = 297;
            const contentWidth = pageWidth - 2 * margin;
            const titleHeight = 10;
            const titleMargin = 5;
            const availableHeight =
              pageHeight - 2 * margin - titleHeight - titleMargin;

            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.setFontSize(16);
            pdf.text(title, pageWidth / 2, margin + 5, { align: "center" });

            pdf.addImage(
              imgData,
              "PNG",
              margin,
              margin + titleHeight + titleMargin,
              imgWidth,
              imgHeight
            );

            pdf.save(filename);
          })
          .catch((error) => console.error("Error generating PDF:", error));
      });
    }
  }, 100);
}

// --- Table Action Handler ---
function handleProgrammeTableAction(event) {
  const { action, itemId, pageKey } = event.detail;

  const programme = MOCK_FULL_PROGRAMMES_DATASET.find(
    (p) => p.id === parseInt(itemId)
  );
  if (!programme && action !== "add") {
    console.warn(`Programme with ID ${itemId} not found for action.`);
    return;
  }

  switch (action) {
    case "edit":
      if (!isProgrammeDomainPage) {
        handleProgrammeModal(programme, "edit");
      }
      break;
    case "view":
      handleProgrammeModal(programme, "view");
      break;
    case "delete":
      if (!isProgrammeDomainPage) {
        openModal(
          `<p>Are you sure you want to delete programme data for <strong>${programme.beneficiary_name}</strong> (ID: ${programme.id})?</p>`,
          "Confirm Deletion",
          {
            showFooter: true,
            footerContent: `
              <button class="button button-danger" id="confirm-delete-btn">Delete</button>
              <button class="button button-secondary modal-cancel-btn">Cancel</button>
            `,
            onCloseCallback: null,
          }
        );

        setTimeout(() => {
          const confirmDeleteBtn =
            document.getElementById("confirm-delete-btn");
          if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener("click", () => {
              const index = MOCK_FULL_PROGRAMMES_DATASET.findIndex(
                (p) => p.id === parseInt(itemId)
              );
              if (index !== -1) {
                MOCK_FULL_PROGRAMMES_DATASET.splice(index, 1);
                closeModal();
                programmeTableManager.refresh();
              } else {
                console.warn("Programme not found for deletion in mock data.");
                closeModal();
              }
            });
          }
        }, 50);
      }
      break;
    default:
      console.warn(`Unhandled action: ${action}`);
  }
}

// --- Initialization ---
let programmeTableManager;

export function initProgrammes() {
  isProgrammeDomainPage = false;

  // Check if the current route is for Programme Domain
  isProgrammeDomainPage = checkRoute();
  
  // Determine table configuration based on route
  const headers = isProgrammeDomainPage
    ? programmeDomainHeaders
    : defaultProgrammeHeaders;
  const dropdownActions = isProgrammeDomainPage
    ? programmeDomainDropdownActions
    : defaultProgrammeDropdownActions;

  // Re-create table manager with appropriate configuration
  programmeTableManager = createPaginatedTableManager(
    "programme-table-container",
    "programme-pagination-container",
    {
      fetchDataFunction: fetchProgrammesDataFromAPI,
      tableHeaders: headers,
      dropdownActions: dropdownActions,
      pageKey: isProgrammeDomainPage ? "programme-domain" : "programmes",
      defaultItemsPerPage: 25,
    }
  );
  programmeTableManager.init();

  // Attach table action listener
  window.removeEventListener("tableAction", handleProgrammeTableAction);
  window.addEventListener("tableAction", handleProgrammeTableAction);

  // Add New button (only for default page)
  if (!isProgrammeDomainPage) {
    const addNewButton = document.querySelector(
      ".programmes-content .button-secondary"
    );
    if (addNewButton) {
      addNewButton.removeEventListener("click", handleAddNewProgramme);
      addNewButton.addEventListener("click", handleAddNewProgramme);
    } else {
      console.warn("Add New button not found in .programmes-content.");
    }
  }

  // Programme Domain features
  if (isProgrammeDomainPage) {
    // Analytics button
    const analyticsButton = document.querySelector(
      ".programmes-content .buttons .button-secondary:nth-child(1)"
    );
    if (analyticsButton) {
      analyticsButton.addEventListener("click", handleAnalyticsModal);
    }

    // Date filters
    const fromDateInput = document.querySelector(
      ".programme-domain-content #from_date"
    );
    const toDateInput = document.querySelector(
      ".programme-domain-content #to_date"
    );
    const submitButton = document.querySelector(
      ".programme-domain-content .buttons .button-secondary:nth-child(3)"
    );

    if (fromDateInput && toDateInput && submitButton) {
      submitButton.addEventListener("click", () => {
        programmeFilters.fromDate = fromDateInput.value;
        programmeFilters.toDate = toDateInput.value;
        programmeTableManager.refresh();
      });
      fromDateInput.addEventListener("change", (e) => {
        if (!e.target.value) {
          programmeFilters.fromDate = "";
          programmeTableManager.refresh();
        }
      });
      toDateInput.addEventListener("change", (e) => {
        if (!e.target.value) {
          programmeFilters.toDate = "";
          programmeTableManager.refresh();
        }
      });
    }

    // Search input
    const searchInput = document.querySelector(
      ".programme-domain-content .search-input"
    );
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        programmeFilters.search = e.target.value;
        programmeTableManager.refresh();
      });
    }

    // Event delegation for view icons
    const tableContainer = document.getElementById("programme-table-container");
    if (tableContainer) {
      tableContainer.addEventListener("click", (e) => {
        const viewIcon = e.target.closest(".view-icon");
        if (viewIcon) {
          const itemId = viewIcon.dataset.id;
          const event = new CustomEvent("tableAction", {
            detail: { action: "view", itemId, pageKey: "programme-domain" },
          });
          window.dispatchEvent(event);
        }
      });
    } else {
      console.warn("Table container #programme-table-container not found.");
    }
  }
}

function handleAddNewProgramme() {
  handleProgrammeModal({}, "add");
}

// Initial route check
checkRoute();
// export { initProgrammes };
