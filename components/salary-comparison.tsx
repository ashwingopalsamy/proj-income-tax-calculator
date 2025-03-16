"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { type TaxResults, calculateTax } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PlusCircle, MinusCircle, BarChart2 } from "lucide-react"

export default function SalaryComparison() {
  const [salaries, setSalaries] = useState<string[]>(["", ""])
  const [employerPfIncluded, setEmployerPfIncluded] = useState<boolean>(false)

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

  // Prepare data for comparison chart
  const chartData = [
    {
      name: "Gross Salary",
      ...results.reduce(
        (acc, result, index) => {
          acc[`salary${index}`] = result.grossSalary
          return acc
        },
        {} as Record<string, number>,
      ),
    },
    {
      name: "Taxable Income",
      ...results.reduce(
        (acc, result, index) => {
          acc[`salary${index}`] = result.taxableIncome
          return acc
        },
        {} as Record<string, number>,
      ),
    },
    {
      name: "Total Tax",
      ...results.reduce(
        (acc, result, index) => {
          acc[`salary${index}`] = result.totalTax
          return acc
        },
        {} as Record<string, number>,
      ),
    },
    {
      name: "In-hand Salary",
      ...results.reduce(
        (acc, result, index) => {
          acc[`salary${index}`] = result.inHandSalary
          return acc
        },
        {} as Record<string, number>,
      ),
    },
  ]

  // Create chart config
  const chartConfig = results.reduce(
    (acc, _, index) => {
      acc[`salary${index}`] = {
        label: `Salary ${index + 1}`,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  const hasValidSalaries = results.some((result) => result.grossSalary > 0)

  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold tracking-tight">Salary Comparison</CardTitle>
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
              <div className="h-[400px] w-full">
                <ChartContainer config={chartConfig} className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                      />
                      <ChartTooltip
                        cursor={{ fill: "var(--muted)", opacity: 0.1 }}
                        content={<ChartTooltipContent formatValue={(value) => formatCurrency(value)} />}
                      />
                      <Legend />
                      {results.map((_, index) => (
                        <Bar
                          key={index}
                          dataKey={`salary${index}`}
                          name={`Salary ${index + 1}: ${results[index].grossSalary > 0 ? formatLPA(results[index].grossSalary) : "N/A"}`}
                          fill={`var(--color-salary${index})`}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
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
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium">Gross Salary</td>
                      {results.map((result, index) => (
                        <td key={index} className="px-4 py-3 text-sm">
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
                      <td className="px-4 py-3 text-sm font-medium">In-hand Salary</td>
                      {results.map((result, index) => (
                        <td key={index} className="px-4 py-3 text-sm font-medium text-primary">
                          {result.grossSalary > 0 ? formatCurrency(result.inHandSalary) : "-"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

