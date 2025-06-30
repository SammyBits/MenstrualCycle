/**
 * Add days to a date and returns a new instance.
 * @param date Date to add days to.
 * @param days Number of days to add.
 * @returns New date instance with the days added.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
