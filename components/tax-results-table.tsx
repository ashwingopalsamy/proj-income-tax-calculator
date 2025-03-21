import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TaxResults } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"

interface TaxResultsTableProps {
  results: TaxResults
    gratuityIncluded?: boolean
  employerPfIncluded?: boolean
}

export default function TaxResultsTable({ results, gratuityIncluded = false, employerPfIncluded = false }: TaxResultsTableProps) {
  // Base rows that are always shown
  const baseRows = [
    { label: "Gross Salary", value: results.grossSalary },
    { label: "Standard Deduction", value: results.standardDeduction },
    { label: "Taxable Income", value: results.taxableIncome },
    { label: "Income Tax", value: results.incomeTax },
    { label: "Health & Education CESS (4%)", value: results.cess },
    { label: "Total Tax", value: results.totalTax, isHighlighted: true },
    { label: "Net Salary (Post Tax)", value: results.netSalary },
  ]

  // PF related rows
  const pfRows = employerPfIncluded
    ? [
        { label: "Employee PF Deduction (6%)", value: results.employeePF },
        { label: "Employer PF Deduction (6%)", value: results.employeePF },
        { label: "Total PF Deduction (12%)", value: results.employeePF * 2, isHighlighted: true },
      ]
    : [{ label: "Employee PF Deduction (6%)", value: results.employeePF }]

  const gratuityRow = gratuityIncluded
      ? [
        { label: "Gratuity Deduction (4.81%)", value: results.gratuityAmount, isHighlighted: true },
      ]
      : ""


  // Final row
  const finalRow = [{ label: "In-hand Salary Per Month", value: results.inHandSalaryPerMonth, isHighlighted: true, isFinal: true },{ label: "In-hand Salary Per Year", value: results.inHandSalary, isHighlighted: true, isFinal: true }]

  // Combine all rows
  const rows = [...baseRows, ...pfRows, ...gratuityRow,...finalRow]

  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight">Salary Breakdown</CardTitle>
        <CardDescription>
          {employerPfIncluded
            ? "Breakdown with Employer PF included in CTC (12% total PF deduction)"
            : "Breakdown with standard 6% PF deduction"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50%] font-medium">Component</TableHead>
                <TableHead className="font-medium">Amount (₹)</TableHead>
                <TableHead className="text-right font-medium">Lakhs Per Annum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={row.label}
                  className={`
                    ${row.isHighlighted ? "font-medium bg-muted/30 dark:bg-muted/10" : ""}
                    ${row.isFinal ? "text-primary dark:text-primary" : ""}
                    ${index === rows.length - 1 ? "border-t-2 border-border/50" : ""}
                    transition-colors
                  `}
                >
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{formatCurrency(row.value)}</TableCell>
                  <TableCell className="text-right">{formatLPA(row.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

