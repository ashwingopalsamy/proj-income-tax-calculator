"use client"

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { type TaxResults, calculateTax } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PlusCircle, MinusCircle, LineChart } from "lucide-react"




export default function SalaryComparison({ employerPfIncluded }: { employerPfIncluded: boolean }) {
  const [salaries, setSalaries] = useState<string[]>(["", ""])

  const addSalary = () => {
    if (salaries.length < 4) {
      setSalaries([...salaries, ""])
    }
  }

  const removeSalary = (index: number) => {
    if (salaries.length > 2) {
      const newSalaries = [...salaries]
      newSalaries.splice(index, 1)
      setSalaries(newSalaries)
    }
  }

  const handleSalaryChange = (index: number, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      const newSalaries = [...salaries]
      newSalaries[index] = value
      setSalaries(newSalaries)
    }
  }

  // Calculate tax results for each salary
  const results: TaxResults[] = salaries.map((salary) => {
    const value = salary ? Number.parseInt(salary) : 0
    return calculateTax(value, employerPfIncluded)
  })

  const chartConfig = results.reduce(
      (acc, _, index) => {
        acc[`salary${index}`] = {
          label: `Salary ${index + 1}`,
          color: `hsl(var(--chart-${(index % 5) + 1}))`,
        }
        return acc
      },
      {} as Record<string, { label: string; color: string }>
  )

  const colorMapping = {
    grossSalary: "#3b82f6",   // Blue
    pfDeduction: "#f59e0b", // Orange
    totalTax: "#ef4444",      // Red
    inHandSalary: "#10b981",  // Green
  };


  // Prepare data for salary comparison chart
  const chartData = useMemo(() => {
    return results.map((result, index) => ({
      name: `Salary ${index + 1}`,
      grossSalary: result.grossSalary,
      pfDeduction: employerPfIncluded ? result.employeePF * 2 : result.employeePF,
      totalTax: result.totalTax,
      inHandSalary: result.inHandSalary,
    }));
  }, [results, employerPfIncluded]);


  const hasValidSalaries = results.some((result) => result.grossSalary > 0);

  return (
      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold tracking-tight">Compare Salaries</CardTitle>
          </div>
          <CardDescription>Compare tax calculations for different salary scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {salaries.map((salary, index) => (
                  <div key={index} className="relative">
                    <Label htmlFor={`salary-${index}`} className="text-sm font-medium">
                      Salary {index + 1}
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                          id={`salary-${index}`}
                          type="text"
                          placeholder="e.g. 1200000"
                          value={salary}
                          onChange={(e) => handleSalaryChange(index, e.target.value)}
                          className="pl-8"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    </div>
                    {salaries.length > 2 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-destructive"
                            onClick={() => removeSalary(index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                          <span className="sr-only">Remove salary {index + 1}</span>
                        </Button>
                    )}
                  </div>
              ))}

              {salaries.length < 4 && (
                  <div className="flex items-end">
                    <Button variant="outline" size="sm" className="h-10 mt-6" onClick={addSalary}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Salary
                    </Button>
                  </div>
              )}
            </div>

            {hasValidSalaries && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Comparison Chart</h3>
                  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-border p-4">
                    <div className="h-[400px] w-full">
                      <ChartContainer config={chartConfig} className="h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}  barGap={6} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                            <YAxis
                                tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                                stroke="var(--muted-foreground)"
                                fontSize={12}
                                tickMargin={10}
                            />

                            <ChartTooltip
                                content={({ payload, label }) => (
                                    <div className="bg-white shadow-md rounded-md p-2 border border-border text-xs min-w-[160px]">
                                      <div className="bg-gray-100 font-semibold text-center px-2 py-1 rounded-t-md">
                                        {label}
                                      </div>
                                      <div className="p-2 space-y-1">
                                        {payload?.map((entry, index) => (
                                            <div key={index} className="flex justify-between">
                                              <span className="text-gray-600">{entry.name}</span>
                                              <span className="font-semibold text-gray-900">{formatCurrency(entry.value)}</span>
                                            </div>
                                        ))}
                                      </div>
                                    </div>
                                )}
                            />

                            <Button variant="outline" size="sm" className="h-12 w-full mt-4">Calculate Tax</Button>

                            <Legend
                                align="center" // Centers the legend
                                verticalAlign="bottom" // Moves legend below the chart
                                layout="horizontal" // Ensures horizontal layout
                                wrapperStyle={{ paddingTop: "10px" }} // Adds spacing
                            />


                            <Bar dataKey="grossSalary" name="Gross Salary" fill={colorMapping.grossSalary}  radius={[4, 4, 0, 0]} />
                            <Bar dataKey="totalTax" name="Total Tax" fill={colorMapping.totalTax}  radius={[4, 4, 0, 0]} />
                            <Bar
                                dataKey="pfDeduction"
                                name={employerPfIncluded ? "Total PF Deduction" : "Employee PF Deduction"}
                                fill={colorMapping.pfDeduction}
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar dataKey="inHandSalary" name="In-Hand Salary" fill={colorMapping.inHandSalary} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>


                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Component
                          </th>
                          {results.map((result, index) => (
                              <th
                                  key={index}
                                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                              >
                                Salary {index + 1}
                              </th>
                          ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        <tr className="bg-muted/10">
                          <td className="px-4 py-3 text-sm font-medium">Gross Salary</td>
                          {results.map((result, index) => (
                              <td key={index} className="px-4 py-3 text-sm text-primary font-semibold">
                                {result.grossSalary > 0 ? formatCurrency(result.grossSalary) : "-"}
                              </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium">Taxable Income</td>
                          {results.map((result, index) => (
                              <td key={index} className="px-4 py-3 text-sm">
                                {result.grossSalary > 0 ? formatCurrency(result.taxableIncome) : "-"}
                              </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium">Total Tax</td>
                          {results.map((result, index) => (
                              <td key={index} className="px-4 py-3 text-sm">
                                {result.grossSalary > 0 ? formatCurrency(result.totalTax) : "-"}
                              </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium">Tax Percentage</td>
                          {results.map((result, index) => (
                              <td key={index} className="px-4 py-3 text-sm">
                                {result.grossSalary > 0
                                    ? `${((result.totalTax / result.grossSalary) * 100).toFixed(2)}%`
                                    : "-"}
                              </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium">In-hand Salary Per Month</td>
                          {results.map((result, index) => (
                              <td key={index} className="px-4 py-3 text-sm text-green-600 font-semibold">
                                {result.grossSalary > 0 ? formatCurrency(result.inHandSalaryPerMonth) : "-"}
                              </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium">In-hand Salary</td>
                          {results.map((result, index) => (
                              <td key={index} className="px-4 py-3 text-sm text-green-600 font-semibold">
                                {result.grossSalary > 0 ? formatCurrency(result.inHandSalary) : "-"}
                              </td>
                          ))}
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            )}

            {!hasValidSalaries && (
                <div className="text-center text-muted-foreground mt-6">
                  <p>Enter salary values to compare tax and in-hand salary.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
  )
}

