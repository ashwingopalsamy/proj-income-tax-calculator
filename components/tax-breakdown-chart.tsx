"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { TaxResults } from "@/lib/tax-calculations"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/formatters"

interface TaxBreakdownChartProps {
  results: TaxResults
}

export default function TaxBreakdownChart({ results }: TaxBreakdownChartProps) {
  // Calculate tax breakdown by slabs
  const taxBreakdown = [
    {
      name: "0-4L",
      amount: 0,
    },
    {
      name: "4L-8L",
      amount: Math.min(Math.max(0, results.taxableIncome - 400000), 400000) * 0.05,
    },
    {
      name: "8L-12L",
      amount: Math.min(Math.max(0, results.taxableIncome - 800000), 400000) * 0.1,
    },
    {
      name: "12L-16L",
      amount: Math.min(Math.max(0, results.taxableIncome - 1200000), 400000) * 0.15,
    },
    {
      name: "16L-20L",
      amount: Math.min(Math.max(0, results.taxableIncome - 1600000), 400000) * 0.2,
    },
    {
      name: "20L-24L",
      amount: Math.min(Math.max(0, results.taxableIncome - 2000000), 400000) * 0.25,
    },
    {
      name: "Above 24L",
      amount: Math.max(0, results.taxableIncome - 2400000) * 0.3,
    },
  ].filter((slab) => slab.amount > 0)

  // Add CESS if there's any tax
  if (results.cess > 0) {
    taxBreakdown.push({
      name: "CESS (4%)",
      amount: results.cess,
    })
  }

  // Add PF deduction
  taxBreakdown.push({
    name: "PF (6%)",
    amount: results.pfDeduction,
  })

  // Prepare data for pie chart
  const chartData = [
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

  // Create config for chart
  const chartConfig = taxBreakdown.reduce(
    (acc, item, index) => {
      const key = item.name.replace(/\s/g, "_")
      acc[key] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 9) + 1}))`,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
          <ChartTooltip content={<ChartTooltipContent formatValue={(value) => formatCurrency(value)} />} />
          <Legend />
          {taxBreakdown.map((item, index) => (
            <Bar
              key={item.name}
              dataKey={item.name.replace(/\s/g, "_")}
              fill={`var(--color-${item.name.replace(/\s/g, "_")})`}
              name={item.name}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

