"use client"

import { Button } from "@/components/ui/button"
import type { TaxResults } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"
import { Download } from "lucide-react"
import { useState } from "react"

interface TaxReportDownloadProps {
  results: TaxResults
  employerPfIncluded: boolean
}

export default function TaxReportDownload({ results, employerPfIncluded }: TaxReportDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = () => {
    setIsGenerating(true)

    // Create the report content
    const reportContent = `
INDIAN INCOME TAX CALCULATION REPORT
===================================
Generated on: ${new Date().toLocaleDateString()}

SALARY DETAILS
-------------
Gross Salary: ${formatCurrency(results.grossSalary)} (${formatLPA(results.grossSalary)})
Standard Deduction: ${formatCurrency(results.standardDeduction)}
Taxable Income: ${formatCurrency(results.taxableIncome)} (${formatLPA(results.taxableIncome)})

TAX BREAKDOWN
------------
Income Tax:
- 5% on income between ₹4,00,000 and ₹8,00,000: ${formatCurrency(Math.min(Math.max(0, results.taxableIncome - 400000), 400000) * 0.05)}
- 10% on income between ₹8,00,001 and ₹12,00,000: ${formatCurrency(Math.min(Math.max(0, results.taxableIncome - 800000), 400000) * 0.1)}
- 15% on income between ₹12,00,001 and ₹16,00,000: ${formatCurrency(Math.min(Math.max(0, results.taxableIncome - 1200000), 400000) * 0.15)}
- 20% on income between ₹16,00,001 and ₹20,00,000: ${formatCurrency(Math.min(Math.max(0, results.taxableIncome - 1600000), 400000) * 0.2)}
- 25% on income between ₹20,00,001 and ₹24,00,000: ${formatCurrency(Math.min(Math.max(0, results.taxableIncome - 2000000), 400000) * 0.25)}
- 30% on income above ₹24,00,000: ${formatCurrency(Math.max(0, results.taxableIncome - 2400000) * 0.3)}

Total Income Tax: ${formatCurrency(results.incomeTax)}
Health & Education CESS (4%): ${formatCurrency(results.cess)}
Total Tax Liability: ${formatCurrency(results.totalTax)}

DEDUCTIONS
---------
Employee PF Deduction (6%): ${formatCurrency(results.employeePF)}
${employerPfIncluded ? `Employer PF Deduction (6%): ${formatCurrency(results.employeePF)}` : ""}

FINAL CALCULATION
---------------
Net Salary (Post Tax): ${formatCurrency(results.netSalary)}
In-hand Salary (Post Tax & PF): ${formatCurrency(results.inHandSalary)}
Effective Tax Rate: ${((results.totalTax / results.grossSalary) * 100).toFixed(2)}%

Note: This report is for informational purposes only and should not be considered as tax advice.
    `.trim()

    // Create a blob and download
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tax-report-${results.grossSalary}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={generateReport}
      disabled={isGenerating || results.grossSalary === 0}
    >
      <Download className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Download Tax Report"}
    </Button>
  )
}

