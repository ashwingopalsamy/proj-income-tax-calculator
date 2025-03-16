import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Info } from "lucide-react"

export default function TaxSlabExplainer() {
  const slabs = [
    { range: "₹0 - ₹4,00,000", rate: "0%", example: "No tax on first ₹4,00,000" },
    { range: "₹4,00,001 - ₹8,00,000", rate: "5%", example: "₹20,000 on income of ₹8,00,000" },
    { range: "₹8,00,001 - ₹12,00,000", rate: "10%", example: "₹60,000 on income of ₹12,00,000" },
    { range: "₹12,00,001 - ₹16,00,000", rate: "15%", example: "₹1,20,000 on income of ₹16,00,000" },
    { range: "₹16,00,001 - ₹20,00,000", rate: "20%", example: "₹2,00,000 on income of ₹20,00,000" },
    { range: "₹20,00,001 - ₹24,00,000", rate: "25%", example: "₹3,00,000 on income of ₹24,00,000" },
    { range: "Above ₹24,00,000", rate: "30%", example: "₹4,80,000 on income of ₹30,00,000" },
  ]

  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold tracking-tight">Tax Slab Explanation</CardTitle>
        </div>
        <CardDescription>Understanding how progressive tax slabs work in India</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-medium">Income Range</TableHead>
                <TableHead className="font-medium">Tax Rate</TableHead>
                <TableHead className="font-medium">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slabs.map((slab) => (
                <TableRow key={slab.range}>
                  <TableCell>{slab.range}</TableCell>
                  <TableCell>{slab.rate}</TableCell>
                  <TableCell>{slab.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> India follows a progressive tax system. You pay different tax rates for different
            portions of your income.
          </p>
          <p className="mt-2">Additionally, a 4% Health & Education Cess is applied on the total tax amount.</p>
        </div>
      </CardContent>
    </Card>
  )
}

