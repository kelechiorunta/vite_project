import { format, isToday, isValid, isYesterday, parse } from 'date-fns';

export const formatDateLabel = (timestamp?: string | number) => {
  if (!timestamp) return '';

  let parsedDate: Date | null = null;

  if (typeof timestamp === 'string') {
    // Try parsing as ISO string
    const tryIso = new Date(timestamp);
    if (isValid(tryIso)) {
      parsedDate = tryIso;
    } else {
      // Try parsing stringified number
      const asNumber = Number(timestamp);
      if (!isNaN(asNumber)) {
        parsedDate = new Date(
          asNumber < 1e12 ? asNumber * 1000 : asNumber // seconds → ms
        );
      }
    }
  } else if (typeof timestamp === 'number') {
    // Detect if it's seconds (10 digits) vs ms (13 digits)
    parsedDate = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
  }

  if (!parsedDate || !isValid(parsedDate)) {
    console.warn('⚠️ Invalid date from timestamp:', timestamp, parsedDate);
    return '';
  }

  const time = format(parsedDate, 'p'); // "11:19 PM"

  if (isToday(parsedDate)) return `Today at ${time}`;
  if (isYesterday(parsedDate)) return `Yesterday at ${time}`;
  return `${format(parsedDate, 'MMM d, yyyy')} at ${time}`;
};

export const parseTimeToMinutes = (timestamp?: string | number): number => {
  if (!timestamp) return 0;

  let parsed: Date;

  if (typeof timestamp === 'number' || /^\d+$/.test(timestamp)) {
    // Handle numeric timestamp (ms since epoch)
    parsed = new Date(Number(timestamp));
  } else {
    // Handle formatted string
    parsed = parse(timestamp, "MMM d, yyyy 'at' h:mma", new Date());
  }

  if (!isValid(parsed)) {
    console.warn('⚠️ Invalid timestamp:', timestamp, parsed);
    return 0;
  }

  return Math.floor(parsed.getTime() / 60000); // ms → minutes
};
