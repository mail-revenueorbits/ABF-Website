/**
 * Generate a short unique ID (collision-safe for single-user admin).
 * Format: prefix + base-36 timestamp + random suffix
 */
export function generateId(prefix = '') {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 7);
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`;
}
