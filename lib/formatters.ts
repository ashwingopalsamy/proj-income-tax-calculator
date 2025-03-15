/**
 * Format a number as Indian currency (₹)
 */
export function formatCurrency(amount: number): string {
  // Format with Indian number system (lakhs, crores)
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })

  return formatter.format(amount)
}

/**
 * Format a number as Lakhs Per Annum (LPA)
 */
export function formatLPA(amount: number): string {
  const lakhs = amount / 100000
  return `${lakhs.toFixed(2)} LPA`
}

