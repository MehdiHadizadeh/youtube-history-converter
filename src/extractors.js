import { getTextContent, extractLinks, findTextMatch } from "./html-utils.js";
import { parseYouTubeDate } from "./date-utils.js";

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
  const datePattern =
    /[A-Z][a-z]+\s+\d+,\s+\d+,\s+\d+:\d+:\d+\s+[AP]M\s+GMT[+-]\d+:\d+/;
  const timeStr = findTextMatch(textContent, datePattern);

  if (!timeStr) return null;

  return parseYouTubeDate(timeStr);
}

export function extractProducts(captionCell) {
  const captionText = getTextContent(captionCell);
  const products = [];

  if (captionText.includes("Products:") && captionText.includes("YouTube")) {
    products.push("YouTube");
  }

  return products.length > 0 ? products : ["YouTube"];
}

export function extractActivityControls(captionCell) {
  const captionText = getTextContent(captionCell);

  if (!captionText.includes("From Google Ads")) {
    return captionText;
  }

  return "";
}

export function isWatchedEntry(contentCell) {
  const textContent = getTextContent(contentCell);
  return textContent.startsWith("Watched");
}

export function isValidActivityControl(captionCell) {
  const controls = extractActivityControls(captionCell);
  return controls.includes("YouTube watch history");
}
