/**
 * Parse YouTube date format to ISO 8601 UTC
 * Supports both GMT offset and timezone abbreviation formats
 * Example 1: "Nov 23, 2025, 1:38:42 AM GMT+03:30" → "2025-11-22T22:08:42.888Z"
 * Example 2: "Nov 26, 2025, 2:34:02 PM CET" → "2025-11-26T13:34:02.000Z"
 */
export function parseYouTubeDate(dateStr) {
  // First try GMT offset format: "Nov 23, 2025, 1:38:42 AM GMT+03:30"
  const gmtRegex =
    /([A-Za-z]+)\s+(\d+),\s+(\d+),\s+(\d+):(\d+):(\d+)\s+(AM|PM)\s+GMT([+-]\d+):(\d+)/;
  const gmtMatch = dateStr.match(gmtRegex);

  if (gmtMatch) {
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
    ] = gmtMatch;
    return parseWithGMTOffset(
      month,
      day,
      year,
      hours,
      minutes,
      seconds,
      ampm,
      tzHours,
      tzMinutes
    );
  }

  // Try timezone abbreviation format: "Nov 26, 2025, 2:34:02 PM CET"
  // Updated regex to handle single or double digit hours
  const tzRegex =
    /([A-Za-z]+)\s+(\d+),\s+(\d+),\s+(\d{1,2}):(\d+):(\d+)\s+(AM|PM)\s+([A-Z]{3,5})/;
  const tzMatch = dateStr.match(tzRegex);

  if (tzMatch) {
    const [, month, day, year, hours, minutes, seconds, ampm, timezone] =
      tzMatch;
    return parseWithTimezone(
      month,
      day,
      year,
      hours,
      minutes,
      seconds,
      ampm,
      timezone
    );
  }

  console.warn("Could not parse date:", dateStr);
  return null;
}

/**
 * Parse date with GMT offset (e.g., GMT+03:30)
 */
function parseWithGMTOffset(
  month,
  day,
  year,
  hours,
  minutes,
  seconds,
  ampm,
  tzHours,
  tzMinutes
) {
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

/**
 * Parse date with timezone abbreviation (e.g., CET, EST, PST)
 */
function parseWithTimezone(
  month,
  day,
  year,
  hours,
  minutes,
  seconds,
  ampm,
  timezone
) {
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

  // Common timezone offsets in minutes from UTC
  const timezoneOffsets = {
    // Europe
    CET: 60, // Central European Time (UTC+1)
    CEST: 120, // Central European Summer Time (UTC+2)
    WET: 0, // Western European Time (UTC+0)
    WEST: 60, // Western European Summer Time (UTC+1)
    EET: 120, // Eastern European Time (UTC+2)
    EEST: 180, // Eastern European Summer Time (UTC+3)

    // Americas
    EST: -300, // Eastern Standard Time (UTC-5)
    EDT: -240, // Eastern Daylight Time (UTC-4)
    CST: -360, // Central Standard Time (UTC-6)
    CDT: -300, // Central Daylight Time (UTC-5)
    MST: -420, // Mountain Standard Time (UTC-7)
    MDT: -360, // Mountain Daylight Time (UTC-6)
    PST: -480, // Pacific Standard Time (UTC-8)
    PDT: -420, // Pacific Daylight Time (UTC-7)

    // Asia
    IST: 330, // India Standard Time (UTC+5:30)
    PKT: 300, // Pakistan Standard Time (UTC+5)
    JST: 540, // Japan Standard Time (UTC+9)
    KST: 540, // Korea Standard Time (UTC+9)
    SGT: 480, // Singapore Time (UTC+8)
    HKT: 480, // Hong Kong Time (UTC+8)

    // Middle East
    IRST: 210, // Iran Standard Time (UTC+3:30)
    IRDT: 270, // Iran Daylight Time (UTC+4:30)
    AST: 180, // Arabia Standard Time (UTC+3)

    // Australia
    AEST: 600, // Australian Eastern Standard Time (UTC+10)
    AEDT: 660, // Australian Eastern Daylight Time (UTC+11)
    ACST: 570, // Australian Central Standard Time (UTC+9:30)
    ACDT: 630, // Australian Central Daylight Time (UTC+10:30)
    AWST: 480, // Australian Western Standard Time (UTC+8)

    // Others
    GMT: 0, // Greenwich Mean Time (UTC+0)
    UTC: 0, // Coordinated Universal Time (UTC+0)
    BST: 60, // British Summer Time (UTC+1)
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

  // Get timezone offset in minutes
  const tzOffsetMinutes = timezoneOffsets[timezone];

  if (tzOffsetMinutes === undefined) {
    console.warn("Unknown timezone:", timezone);
    // Fallback: treat as UTC
    return localDate.toISOString();
  }

  // Convert to UTC
  const tzOffsetMs = tzOffsetMinutes * 60000;
  const utcTime = localDate.getTime() - tzOffsetMs;

  return new Date(utcTime).toISOString();
}

/**
 * Convert Persian digits to English digits
 */
function persianToEnglish(str) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(
      new RegExp(persianDigits[i], "g"),
      englishDigits[i]
    );
  }
  return result;
}

/**
 * Convert Persian (Solar Hijri) date to Gregorian date
 * Based on accurate conversion algorithm
 */
function persianToGregorian(persianYear, persianMonth, persianDay) {
  // Persian calendar months (1-12)
  // Months 1-6 have 31 days, months 7-11 have 30 days, month 12 has 29/30 days

  const daysInMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  // Calculate days from Persian epoch
  let daysSinceEpoch = 0;

  // Days in complete years
  for (let y = 1; y < persianYear; y++) {
    // Check if leap year (complex algorithm, simplified here)
    const isLeap = (y * 683) % 2820 < 683;
    daysSinceEpoch += isLeap ? 366 : 365;
  }

  // Days in complete months of current year
  for (let m = 1; m < persianMonth; m++) {
    daysSinceEpoch += daysInMonths[m - 1];
  }

  // Days in current month
  daysSinceEpoch += persianDay;

  // Persian epoch is March 22, 622 CE (Gregorian)
  const persianEpoch = new Date(622, 2, 22); // March 22, 622
  const gregorianDate = new Date(
    persianEpoch.getTime() + (daysSinceEpoch - 1) * 86400000
  );

  return gregorianDate;
}

/**
 * Parse Persian date format to ISO 8601 UTC
 * Example: "۲۶ آبان ۱۴۰۴، ۲۲:۳۱:۲۵ ‎+۰۳:۳۰ گرینویچ" → correct UTC time
 */
export function parsePersianDate(dateStr) {
  try {
    // Convert Persian digits to English
    const normalized = persianToEnglish(dateStr);

    // Persian month names to month numbers (1-12)
    const persianMonthNumbers = {
      فروردین: 1, // Farvardin
      اردیبهشت: 2, // Ordibehesht
      خرداد: 3, // Khordad
      تیر: 4, // Tir
      مرداد: 5, // Mordad
      شهریور: 6, // Shahrivar
      مهر: 7, // Mehr
      آبان: 8, // Aban
      آذر: 9, // Azar
      دی: 10, // Dey
      بهمن: 11, // Bahman
      اسفند: 12, // Esfand
    };

    // Parse the Persian date string
    // Format: "26 آبان 1404، 22:31:25 ‎+03:30 گرینویچ"
    const parts = normalized.match(
      /(\d+)\s+([\u0600-\u06FF]+)\s+(\d+)،?\s+(\d+):(\d+):(\d+)\s+‎?([+-]\d+):(\d+)/
    );

    if (!parts) {
      console.warn("Could not parse Persian date:", dateStr);
      return null;
    }

    const [
      ,
      day,
      monthName,
      persianYear,
      hours,
      minutes,
      seconds,
      tzHours,
      tzMinutes,
    ] = parts;

    // Get month number
    const persianMonth = persianMonthNumbers[monthName];
    if (!persianMonth) {
      console.warn("Unknown Persian month:", monthName);
      return null;
    }

    // Convert Persian date to Gregorian
    const gregorianDate = persianToGregorian(
      parseInt(persianYear, 10),
      persianMonth,
      parseInt(day, 10)
    );

    // Set time
    gregorianDate.setHours(parseInt(hours, 10));
    gregorianDate.setMinutes(parseInt(minutes, 10));
    gregorianDate.setSeconds(parseInt(seconds, 10));
    gregorianDate.setMilliseconds(0);

    // Calculate timezone offset
    const tzOffsetHours = parseInt(tzHours, 10);
    const tzOffsetMinutes = parseInt(tzMinutes, 10);
    const tzOffsetMs =
      (tzOffsetHours * 60 + Math.sign(tzOffsetHours) * tzOffsetMinutes) * 60000;

    // Convert to UTC
    const utcTime = gregorianDate.getTime() - tzOffsetMs;

    return new Date(utcTime).toISOString();
  } catch (err) {
    console.error("Error parsing Persian date:", err);
    return null;
  }
}
