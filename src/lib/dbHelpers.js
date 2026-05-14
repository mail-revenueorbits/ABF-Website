/**
 * Utility functions for converting between JavaScript camelCase
 * and PostgreSQL snake_case column naming conventions.
 */

/**
 * Convert a snake_case string to camelCase.
 * @param {string} str
 * @returns {string}
 */
function snakeToCamelStr(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert a camelCase string to snake_case.
 * @param {string} str
 * @returns {string}
 */
function camelToSnakeStr(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * JSONB fields that should always be arrays or objects.
 * If they arrive as strings, we auto-parse them.
 */
const JSONB_FIELDS = new Set([
  'images', 'tags', 'features', 'variants', 'dimensions',
]);

/**
 * If a value is a string that looks like JSON, parse it.
 */
function maybeParseJSON(key, value) {
  if (!JSONB_FIELDS.has(key)) return value;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * Convert all keys of an object from snake_case to camelCase.
 * Auto-parses known JSONB fields that may arrive as strings.
 * @param {Object} row — A database row
 * @returns {Object}
 */
export function rowToCamel(row) {
  if (!row || typeof row !== 'object') return row;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = snakeToCamelStr(key);
    result[camelKey] = maybeParseJSON(camelKey, value);
  }
  return result;
}

/**
 * Convert all keys of an object from camelCase to snake_case.
 * Does NOT recurse into nested objects (handles JSONB columns as-is).
 * @param {Object} obj — A JavaScript object
 * @returns {Object}
 */
export function objToSnake(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnakeStr(key)] = value;
  }
  return result;
}

/**
 * Convert an array of database rows to camelCase.
 * @param {Object[]} rows
 * @returns {Object[]}
 */
export function rowsToCamel(rows) {
  return (rows || []).map(rowToCamel);
}
