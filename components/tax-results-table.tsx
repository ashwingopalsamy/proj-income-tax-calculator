import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TaxResults } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"

interface TaxResultsTableProps {
  results: TaxResults
}

export default function TaxResultsTable({ results }: TaxResultsTableProps) {
  const rows = [
    { label: "Gross Salary", value: results.grossSalary },
    { label: "Standard Deduction", value: results.standardDeduction },
    { label: "Taxable Income", value: results.taxableIncome },
    { label: "Income Tax", value: results.incomeTax },
    { label: "Health & Education CESS (4%)", value: results.cess },
    { label: "Total Tax", value: results.totalTax, isHighlighted: true },
    { label: "Net Salary (Post Tax)", value: results.netSalary },
    { label: "Employee PF Deduction (6%)", value: results.pfDeduction },
    { label: "In-hand Salary", value: results.inHandSalary, isHighlighted: true },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Calculation Results</CardTitle>
        <CardDescription>Breakdown of your tax liability and take-home salary</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Component</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead className="text-right">LPA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.label}
                className={row.isHighlighted ? "font-medium bg-slate-50 dark:bg-slate-800/50" : ""}
              >
                <TableCell>{row.label}</TableCell>
                <TableCell>{formatCurrency(row.value)}</TableCell>
                <TableCell className="text-right">{formatLPA(row.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

