export interface TaxResults {
  grossSalary: number
  standardDeduction: number
  taxableIncome: number
  incomeTax: number
  cess: number
  totalTax: number
  netSalary: number
  pfDeduction: number
  inHandSalary: number
  inHandSalaryPerMonth: number
}

export function calculateTax(grossSalary: number): {
  grossSalary: number;
  standardDeduction: number;
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  netSalary: number;
  pfDeduction: number;
  inHandSalary: number;
  inHandSalaryPerMonth: number
} {
  // Constants
  const STANDARD_DEDUCTION = 75000
  const PF_RATE = 0.06
  const CESS_RATE = 0.04

  // Calculate taxable income
  const taxableIncome = Math.max(0, grossSalary - STANDARD_DEDUCTION)

  // Calculate income tax using the slabs
  const incomeTax =
    0.05 * Math.max(0, Math.min(taxableIncome, 800000) - 400000) +
    0.1 * Math.max(0, Math.min(taxableIncome, 1200000) - 800000) +
    0.15 * Math.max(0, Math.min(taxableIncome, 1600000) - 1200000) +
    0.2 * Math.max(0, Math.min(taxableIncome, 2000000) - 1600000) +
    0.25 * Math.max(0, Math.min(taxableIncome, 2400000) - 2000000) +
    0.3 * Math.max(0, taxableIncome - 2400000)

  // Calculate cess
  const cess = incomeTax * CESS_RATE

  // Calculate total tax
  const totalTax = incomeTax + cess

  // Calculate PF deduction
  const pfDeduction = grossSalary * PF_RATE

  // Calculate net salary (post-tax)
  const netSalary = grossSalary - totalTax

  // Calculate in-hand salary (post-tax and PF)
  const inHandSalary = netSalary - pfDeduction

  const inHandSalaryPerMonth = netSalary/12

  return {
    grossSalary,
    standardDeduction: STANDARD_DEDUCTION,
    taxableIncome,
    incomeTax,
    cess,
    totalTax,
    netSalary,
    pfDeduction,
    inHandSalary,
    inHandSalaryPerMonth
  }
}

