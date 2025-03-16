"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaxResultsTable from "@/components/tax-results-table"
import TaxSlabExplainer from "@/components/tax-slab-explainer"
import SalaryComparison from "@/components/salary-comparison"
import TaxReportDownload from "@/components/tax-report-download"
import { calculateTax } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"
import { motion } from "framer-motion"
import { LineChart, IndianRupee, Calculator, BarChart2, Info, TrendingUp } from "lucide-react"
import HikeImpactTable from "@/components/hike-impact-table"


export default function TaxCalculator() {
  const [salary, setSalary] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [employerPfIncluded, setEmployerPfIncluded] = useState<boolean>(false)

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/,/g, "") // Remove existing commas
    if (value === "" || /^\d+$/.test(value)) {
      setSalary(value)
      setError("")
    } else {
      setError("Please enter a valid number without commas or special characters")
    }
  }

  const salaryValue = salary ? Number(salary.replace(/,/g, "")) : 0
  const taxResults = calculateTax(salaryValue, employerPfIncluded)

  return (
      <div className="space-y-8">
        <Card className="border border-border/40 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight">Salary Details</CardTitle>
            <CardDescription>Provide your annual gross salary to calculate tax liability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Annual Gross Salary (₹)
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <Input
                      id="salary"
                      type="text"
                      placeholder="e.g. 1200000"
                      value={salary}
                      onChange={handleSalaryChange}
                      className="pl-10 h-11 transition-all border-border/60 focus-visible:ring-primary/20"
                  />
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive mt-1"
                    >
                      {error}
                    </motion.p>
                )}
                {salaryValue > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground mt-1"
                    >
                      {formatCurrency(salaryValue)} ({formatLPA(salaryValue)})
                    </motion.p>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                      id="employer-pf"
                      checked={employerPfIncluded}
                      onCheckedChange={setEmployerPfIncluded}
                      className="data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="employer-pf" className="cursor-pointer font-medium">
                    Employer PF is included in CTC
                  </Label>
                </div>

                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border/30">
                  <p>
                    {employerPfIncluded
                        ? "When Employer PF is included in CTC, an additional 6% of your salary is deducted as Employee PF contribution."
                        : "By default, we assume Employer PF is not included in CTC. Toggle the switch if your CTC includes Employer PF."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {salaryValue > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-8"
            >

              <Tabs defaultValue="results" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="results" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span className="hidden sm:inline">Salary Breakdown</span>
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Salary Comparison</span>
                  </TabsTrigger>
                  <TabsTrigger value="hike" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Hike Predictor</span>
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Tax Slabs</span>
                  </TabsTrigger>

                </TabsList>

                <TabsContent value="results" className="mt-0">
                  <TaxResultsTable results={taxResults} employerPfIncluded={employerPfIncluded} />
                </TabsContent>

                <TabsContent value="breakdown" className="mt-0">
                  <Card className="border border-border/40 shadow-sm overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold tracking-tight">Tax Breakdown</CardTitle>
                      <CardDescription>Visual representation of your tax components</CardDescription>
                    </CardHeader>
                  </Card>
                </TabsContent>

                <TabsContent value="hike">
                  <div className="mt-6">
                    <HikeImpactTable baseSalary={salaryValue} employerPfIncluded={employerPfIncluded} />
                  </div>
                </TabsContent>

                <TabsContent value="comparison">
                  <SalaryComparison employerPfIncluded={employerPfIncluded} />
                </TabsContent>

                <TabsContent value="info" className="mt-0">
                  <TaxSlabExplainer />
                </TabsContent>



              </Tabs>

              <div className="flex justify-center">
                <TaxReportDownload results={taxResults} employerPfIncluded={employerPfIncluded} />
              </div>

            </motion.div>
        )}
      </div>
  )
}

