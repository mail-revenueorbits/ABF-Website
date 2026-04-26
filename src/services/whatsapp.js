/**
 * WhatsApp integration utility for AB Furniture.
 * Generates pre-filled WhatsApp chat links.
 */

const WHATSAPP_NUMBER = '9779802322678'; // Primary sales number from brief

/**
 * Generate a WhatsApp click-to-chat URL with a pre-filled message.
 * @param {Object} params
 * @param {string} params.productName
 * @param {string} params.price
 * @param {string} [params.sku]
 * @param {number} [params.quantity]
 * @param {string} [params.variant]
 * @returns {string}
 */
export function getWhatsAppLink({ productName, price, sku, quantity = 1, variant }) {
  const lines = [
    `Hi! I'm interested in purchasing:`,
    ``,
    `*${productName}*`,
    `Price: ${price}`,
  ];

  if (sku) lines.push(`SKU: ${sku}`);
  if (variant) lines.push(`Variant: ${variant}`);
  if (quantity > 1) lines.push(`Quantity: ${quantity}`);

  lines.push('');
  lines.push('Please share more details and availability. Thank you!');

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

/**
 * Generate a general inquiry WhatsApp link.
 * @returns {string}
 */
export function getGeneralWhatsAppLink() {
  const message = encodeURIComponent(
    "Hi! I'm browsing the AB Furniture website and would like to know more about your products."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
