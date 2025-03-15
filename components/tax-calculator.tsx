"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TaxBreakdownChart from "@/components/tax-breakdown-chart"
import TaxResultsTable from "@/components/tax-results-table"
import { calculateTax } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"

export default function TaxCalculator() {
  const [salary, setSalary] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty input or valid numbers
    if (value === "" || /^\d+$/.test(value)) {
      setSalary(value)
      setError("")
    } else {
      setError("Please enter a valid number without commas or special characters")
    }
  }

  const salaryValue = salary ? Number.parseInt(salary) : 0
  const taxResults = calculateTax(salaryValue)

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Salary Details</CardTitle>
          <CardDescription>Provide your annual gross salary to calculate tax liability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Gross Salary (₹)</Label>
              <div className="relative">
                <Input
                  id="salary"
                  type="text"
                  placeholder="e.g. 1200000"
                  value={salary}
                  onChange={handleSalaryChange}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {salaryValue > 0 && (
                <p className="text-sm text-slate-500">
                  {formatCurrency(salaryValue)} ({formatLPA(salaryValue)})
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {salaryValue > 0 && (
        <>
          <TaxResultsTable results={taxResults} />

          <Card>
            <CardHeader>
              <CardTitle>Tax Breakdown</CardTitle>
              <CardDescription>Visual representation of your tax components</CardDescription>
            </CardHeader>
            <CardContent>
              <TaxBreakdownChart results={taxResults} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

