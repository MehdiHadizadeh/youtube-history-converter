export function getTextContent(element) {
  return element?.textContent?.trim() || "";
}

export function extractLinks(element) {
  const links = Array.from(element.querySelectorAll("a"));
  return links.map((link) => ({
    text: getTextContent(link),
    url: link.href,
  }));
}

export function findTextMatch(text, pattern) {
  const match = text.match(pattern);
  return match ? match[0] : null;
}
