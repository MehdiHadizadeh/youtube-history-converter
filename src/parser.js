import {
  extractHeader,
  extractTitle,
  extractSubtitles,
  extractTime,
  extractProducts,
  extractActivityControls,
  isWatchedEntry,
  isValidActivityControl,
} from "./extractors.js";

let selectedFile = null;
let convertedData = null;

// DOM elements
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const statusSuccess = document.getElementById("statusSuccess");
const statusError = document.getElementById("statusError");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const statsDiv = document.getElementById("stats");
const totalEntries = document.getElementById("totalEntries");
const convertedEntries = document.getElementById("convertedEntries");
const skippedEntries = document.getElementById("skippedEntries");

// Parse a single entry card
function parseEntry(card) {
  try {
    const contentCells = card.querySelectorAll(".content-cell");
    const captionCell = card.querySelector(".mdl-typography--caption");

    if (contentCells.length === 0) return null;

    const firstContent = contentCells[0];

    // Skip non-"Watched" entries
    if (!isWatchedEntry(firstContent)) return null;

    // Validate activity controls
    if (!captionCell || !isValidActivityControl(captionCell)) return null;

    // Extract all fields
    const header = extractHeader(card);
    const title = extractTitle(firstContent);
    const subtitles = extractSubtitles(firstContent);
    const time = extractTime(firstContent);
    const products = extractProducts(captionCell);
    const activityControls = extractActivityControls(captionCell);

    // Validate required fields
    if (!title || !time) return null;

    return {
      header,
      title: title.text,
      titleUrl: title.url,
      subtitles,
      time,
      products,
      activityControls,
    };
  } catch (err) {
    console.error("Error parsing entry:", err);
    return null;
  }
}

// Convert HTML to JSON
function convertHTML(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  const cards = doc.querySelectorAll(".outer-cell");
  const entries = [];
  let skipped = 0;

  cards.forEach((card) => {
    const entry = parseEntry(card);
    if (entry) {
      entries.push(entry);
    } else {
      skipped++;
    }
  });

  return {
    entries,
    skipped,
    total: cards.length,
  };
}

// Show success message
function showSuccess(message) {
  statusSuccess.classList.remove("hidden");
  statusError.classList.add("hidden");
  successMessage.textContent = message;
}

// Show error message
function showError(message) {
  statusError.classList.remove("hidden");
  statusSuccess.classList.add("hidden");
  errorMessage.textContent = message;
}

// Hide all status messages
function hideStatus() {
  statusSuccess.classList.add("hidden");
  statusError.classList.add("hidden");
}

// Show stats
function showStats(stats) {
  totalEntries.textContent = stats.total;
  convertedEntries.textContent = stats.converted;
  skippedEntries.textContent = stats.skipped;
  statsDiv.classList.remove("hidden");
}

// Hide stats
function hideStats() {
  statsDiv.classList.add("hidden");
}

// File selection handler
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    fileName.textContent = file.name;
    convertBtn.disabled = false;
    hideStatus();
    hideStats();
    downloadBtn.classList.add("hidden");
    convertedData = null;
  }
});

// Convert button handler
convertBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  showSuccess("Processing...");
  convertBtn.disabled = true;
  hideStats();
  downloadBtn.classList.add("hidden");

  try {
    const text = await selectedFile.text();
    const result = convertHTML(text);

    convertedData = result.entries;

    showSuccess("Conversion complete!");
    showStats({
      total: result.total,
      converted: result.entries.length,
      skipped: result.skipped,
    });

    downloadBtn.classList.remove("hidden");
  } catch (err) {
    showError(`Error: ${err.message}`);
    console.error("Conversion error:", err);
  } finally {
    convertBtn.disabled = false;
  }
});

// Download button handler
downloadBtn.addEventListener("click", () => {
  if (!convertedData) return;

  const blob = new Blob([JSON.stringify(convertedData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "youtube-history.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showSuccess("JSON file downloaded!");
});
