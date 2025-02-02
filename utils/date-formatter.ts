import { formatInTimeZone } from "date-fns-tz";
import { formatDistance, formatRelative } from "date-fns";

interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
  timeZoneName?:
    | "short"
    | "long"
    | "shortOffset"
    | "longOffset"
    | "shortGeneric"
    | "longGeneric";
  hour12?: boolean;
}

interface FormatConfig {
  includeRelative?: boolean;
  includeDistance?: boolean;
  format?: string;
}

/**
 * Gets the user's local timezone
 * @returns The local timezone string (e.g., 'America/New_York')
 */
export const getLocalTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Error getting local timezone:", error);
    return "UTC";
  }
};

/**
 * Formats a date according to the user's local timezone or a specified timezone
 * @param date - The date to format (ISO string or Date object)
 * @param options - Formatting options
 * @param targetTimezone - Optional target timezone (defaults to user's local timezone)
 * @returns Formatted date string
 */
export const formatToLocalTime = (
  date: string | Date,
  options: DateFormatterOptions = defaultOptions.shortDateTime,
  targetTimezone?: string
): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const timezone = targetTimezone || getLocalTimeZone();

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date provided");
    }

    return new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone: timezone
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Advanced date formatting with relative time and distance
 * @param date - The date to format
 * @param config - Configuration options
 * @param timezone - Optional target timezone
 * @returns Formatted date object with multiple formats
 */
export const formatAdvanced = (
  date: string | Date,
  config: FormatConfig = {},
  timezone?: string
) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const localTimezone = timezone || getLocalTimeZone();

  const result: Record<string, string> = {
    formatted: formatInTimeZone(dateObj, localTimezone, config.format || "PPpp")
  };

  if (config.includeRelative) {
    result.relative = formatRelative(dateObj, new Date());
  }

  if (config.includeDistance) {
    result.distance = formatDistance(dateObj, new Date(), { addSuffix: true });
  }

  return result;
};

// Preset format options
export const defaultOptions = {
  fullDateTime: {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "long",
    hour12: true
  },
  shortDateTime: {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    hour12: true
  },
  dateOnly: {
    year: "numeric",
    month: "long",
    day: "numeric"
  },
  timeOnly: {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hour12: false
  }
} as const;

export type DateFormatPreset = keyof typeof defaultOptions;

/**
 * Format a date using advanced patterns
 * @param date - The date to format
 * @param pattern - Format pattern (using date-fns format)
 * @param timezone - Optional timezone
 */
export const formatWithPattern = (
  date: string | Date,
  pattern: string,
  timezone?: string
): string => {
  const localTimezone = timezone || getLocalTimeZone();
  return formatInTimeZone(date, localTimezone, pattern);
};

// Example usage:
/*
// Basic local timezone formatting
const localDate = formatToLocalTime('2025-03-14T09:00:00.000Z');

// Advanced formatting with relative time
const advanced = formatAdvanced('2025-03-14T09:00:00.000Z', {
  includeRelative: true,
  includeDistance: true,
  format: 'PPPPp'
});

// Custom pattern formatting
const customPattern = formatWithPattern(
  '2025-03-14T09:00:00.000Z',
  'EEEE, MMMM do yyyy, h:mm a (zzz)'
);
*/
