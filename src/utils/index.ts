/**
 * Formats a number as USD currency.
 * @param {number} amount - The number to format.
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};
