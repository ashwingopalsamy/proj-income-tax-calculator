"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { TaxResults } from "@/lib/tax-calculations"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/formatters"
import { useMemo } from "react"

interface TaxBreakdownChartProps {
  results: TaxResults
  employerPfIncluded?: boolean
}

export default function TaxBreakdownChart({ results, employerPfIncluded = false }: TaxBreakdownChartProps) {
  // Calculate tax breakdown by slabs
  const taxBreakdown = useMemo(() => {
    const breakdown = [
      {
        name: "4L-8L",
        amount: Math.min(Math.max(0, results.taxableIncome - 400000), 400000) * 0.05,
        category: "tax",
      },
      {
        name: "8L-12L",
        amount: Math.min(Math.max(0, results.taxableIncome - 800000), 400000) * 0.1,
        category: "tax",
      },
      {
        name: "12L-16L",
        amount: Math.min(Math.max(0, results.taxableIncome - 1200000), 400000) * 0.15,
        category: "tax",
      },
      {
        name: "16L-20L",
        amount: Math.min(Math.max(0, results.taxableIncome - 1600000), 400000) * 0.2,
        category: "tax",
      },
      {
        name: "20L-24L",
        amount: Math.min(Math.max(0, results.taxableIncome - 2000000), 400000) * 0.25,
        category: "tax",
      },
      {
        name: "Above 24L",
        amount: Math.max(0, results.taxableIncome - 2400000) * 0.3,
        category: "tax",
      },
    ].filter((slab) => slab.amount > 0)

    // Add CESS if there's any tax
    if (results.cess > 0) {
      breakdown.push({
        name: "CESS (4%)",
        amount: results.cess,
        category: "cess",
      })
    }

    // Add Employee PF deduction
    breakdown.push({
      name: "Employee PF (6%)",
      amount: results.employeePF,
      category: "pf",
    })

    // Add Employer PF if it's included in the calculation
    if (employerPfIncluded) {
      breakdown.push({
        name: "Employer PF (6%)",
        amount: results.employeePF,
        category: "pf",
      })
    }

    return breakdown
  }, [results, employerPfIncluded])

  // Prepare data for chart
  const chartData = useMemo(() => {
    return [
      {
        name: "Tax Breakdown",
        ...taxBreakdown.reduce(
          (acc, item) => {
            acc[item.name.replace(/\s/g, "_")] = item.amount
            return acc
          },
          {} as Record<string, number>,
        ),
      },
    ]
  }, [taxBreakdown])

  // Create config for chart with custom colors
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}

    taxBreakdown.forEach((item, index) => {
      const key = item.name.replace(/\s/g, "_")
      let colorVar = ""

      // Assign colors based on category
      if (item.category === "tax") {
        const taxIndex = taxBreakdown.filter((i) => i.category === "tax").indexOf(item)
        const taxColors = [
          "--chart-blue",
          "--chart-indigo",
          "--chart-violet",
          "--chart-purple",
          "--chart-fuchsia",
          "--chart-pink",
        ]
        colorVar = taxColors[taxIndex % taxColors.length]
      } else if (item.category === "cess") {
        colorVar = "--chart-rose"
      } else if (item.category === "pf") {
        colorVar = item.name.includes("Employer") ? "--chart-orange" : "--chart-amber"
      }

      config[key] = {
        label: item.name,
        color: `hsl(var(${colorVar}))`,
      }
    })

    return config
  }, [taxBreakdown])

  return (
    <div className="w-full h-[400px] mt-2">
      <ChartContainer config={chartConfig} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.1 }}
              content={<ChartTooltipContent formatValue={(value) => formatCurrency(value)} />}
            />
            <Legend
              verticalAlign="bottom"
              height={72}
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => <span className="text-xs">{value}</span>}
            />
            {taxBreakdown.map((item) => {
              const key = item.name.replace(/\s/g, "_")
              return <Bar key={key} dataKey={key} fill={`var(--color-${key})`} name={item.name} radius={[4, 4, 0, 0]} />
            })}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

