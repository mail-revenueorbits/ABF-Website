/**
 * Format a number as Nepali Rupees.
 * e.g. 474999 => "Rs. 4,74,999"
 */
export function formatNPR(amount) {
  if (amount == null || isNaN(amount)) return 'Rs. 0';
  const num = Number(amount);
  const str = Math.abs(num).toFixed(0);

  // Indian/Nepali number grouping: last 3, then groups of 2
  if (str.length <= 3) {
    return `Rs. ${num < 0 ? '-' : ''}${str}`;
  }
  const last3 = str.slice(-3);
  let rest = str.slice(0, -3);
  const groups = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) groups.unshift(rest);
  return `Rs. ${num < 0 ? '-' : ''}${groups.join(',')},${last3}`;
}
