/**
 * Parse YouTube date format to ISO 8601 UTC
 * Example: "Nov 23, 2025, 1:38:42 AM GMT+03:30" → "2025-11-22T22:08:42.888Z"
 */
export function parseYouTubeDate(dateStr) {
  const regex =
    /([A-Za-z]+)\s+(\d+),\s+(\d+),\s+(\d+):(\d+):(\d+)\s+(AM|PM)\s+GMT([+-]\d+):(\d+)/;
  const match = dateStr.match(regex);

  if (!match) {
    console.warn("Could not parse date:", dateStr);
    return null;
  }

  const [
    ,
    month,
    day,
    year,
    hours,
    minutes,
    seconds,
    ampm,
    tzHours,
    tzMinutes,
  ] = match;

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  let hour = parseInt(hours, 10);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  // Create local date
  const localDate = new Date(
    parseInt(year, 10),
    monthMap[month],
    parseInt(day, 10),
    hour,
    parseInt(minutes, 10),
    parseInt(seconds, 10)
  );

  // Calculate timezone offset in milliseconds
  const tzOffsetHours = parseInt(tzHours, 10);
  const tzOffsetMinutes = parseInt(tzMinutes, 10);
  const tzOffsetMs =
    (tzOffsetHours * 60 + Math.sign(tzOffsetHours) * tzOffsetMinutes) * 60000;

  // Convert to UTC
  const utcTime = localDate.getTime() - tzOffsetMs;

  return new Date(utcTime).toISOString();
}
