import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp } from "lucide-react"
import { calculateTax } from "@/lib/tax-calculations"
import { formatCurrency } from "@/lib/formatters"

interface HikeImpactTableProps {
    baseSalary: number
    employerPfIncluded: boolean
}

export default function HikeImpactTable({ baseSalary, employerPfIncluded }: HikeImpactTableProps) {
    const hikePercentages = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

    return (
        <Card className="border border-border/40 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-semibold tracking-tight">Hike Impact Table</CardTitle>
                </div>
                <CardDescription>See how different hike percentages impact your in-hand salary</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-medium">Hike %</TableHead>
                                <TableHead className="font-medium">New Gross Salary</TableHead>
                                <TableHead className="font-medium">New Monthly In-Hand</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hikePercentages.map((hike) => {
                                const newGrossSalary = baseSalary * (1 + hike / 100)
                                const newTaxResults = calculateTax(newGrossSalary, employerPfIncluded)

                                return (
                                    <TableRow key={hike}>
                                        <TableCell>{hike}%</TableCell>
                                        <TableCell>{formatCurrency(newGrossSalary)}</TableCell>
                                        <TableCell>{formatCurrency(newTaxResults.inHandSalaryPerMonth)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                        <strong>Note:</strong> These values are approximate and depend on tax slabs, deductions, and employer PF
                        inclusion.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

