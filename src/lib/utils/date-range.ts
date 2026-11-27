const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** A date-only `from` starts at 00:00 UTC and a date-only `to` ends at 23:59:59.999 UTC; datetimes pass through. */
export function toTimestampRange(from?: string, to?: string) {
  return {
    from: from && DATE_ONLY.test(from) ? `${from}T00:00:00.000Z` : from,
    to: to && DATE_ONLY.test(to) ? `${to}T23:59:59.999Z` : to,
  };
}
