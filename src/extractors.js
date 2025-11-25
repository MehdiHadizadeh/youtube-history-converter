import { getTextContent, extractLinks, findTextMatch } from "./html-utils.js";
import { parseYouTubeDate, parsePersianDate } from "./date-utils.js";

export function extractHeader(card) {
  const headerCell = card.querySelector(".header-cell p");
  return getTextContent(headerCell) || "YouTube";
}

export function extractTitle(contentCell) {
  const titleLink = contentCell.querySelector("a");
  if (!titleLink) return null;

  const titleText = getTextContent(titleLink);
  return {
    text: `Watched ${titleText}`,
    url: titleLink.href,
  };
}

export function extractSubtitles(contentCell) {
  const links = Array.from(contentCell.querySelectorAll("a"));
  // First link is the video title, rest are subtitles (usually channel)
  return links.slice(1).map((link) => ({
    name: getTextContent(link),
    url: link.href,
  }));
}

export function extractTime(contentCell) {
  const textContent = getTextContent(contentCell);

  // Try English date format first
  const englishDatePattern =
    /[A-Z][a-z]+\s+\d+,\s+\d+,\s+\d+:\d+:\d+\s+[AP]M\s+GMT[+-]\d+:\d+/;
  const englishTimeStr = findTextMatch(textContent, englishDatePattern);

  if (englishTimeStr) {
    return parseYouTubeDate(englishTimeStr);
  }

  // Try Persian date format
  const persianDatePattern =
    /[۰-۹]+\s+[\u0600-\u06FF]+\s+[۰-۹]+،\s+[۰-۹]+:[۰-۹]+:[۰-۹]+\s+‎?[+-][۰-۹]+:[۰-۹]+\s+[\u0600-\u06FF]+/;
  const persianTimeStr = findTextMatch(textContent, persianDatePattern);

  if (persianTimeStr) {
    return parsePersianDate(persianTimeStr);
  }

  return null;
}

export function extractProducts(captionCell) {
  const captionText = getTextContent(captionCell);
  const products = [];

  if (
    (captionText.includes("Products:") || captionText.includes("محصولات:")) &&
    captionText.includes("YouTube")
  ) {
    products.push("YouTube");
  }

  return products.length > 0 ? products : ["YouTube"];
}

export function extractActivityControls(captionCell) {
  const captionText = getTextContent(captionCell);

  if (
    !captionText.includes("From Google Ads") &&
    !captionText.includes("از Google Ads")
  ) {
    return "YouTube watch history";
  }

  return "";
}

export function isWatchedEntry(contentCell) {
  const textContent = getTextContent(contentCell);
  if (textContent.startsWith("Watched")) {
    return true;
  }

  if (textContent.includes("تماشا")) {
    return true;
  }

  return false;
}

export function isValidActivityControl(captionCell) {
  const controls = extractActivityControls(captionCell);
  return controls.includes("YouTube watch history");
}
