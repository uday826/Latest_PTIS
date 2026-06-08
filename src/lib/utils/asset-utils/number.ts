/**
 * Safely parses a string to an integer with a fallback value.
 * Prevents NaN from being sent to APIs.
 */
export function safeParseInt(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}
