/**
 * Formats a number as USD currency.
 * @param {number} amount - The number to format.
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount: number): string => {
  if (amount % 1 === 0) { // Check if the amount is a whole number
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } else {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};
