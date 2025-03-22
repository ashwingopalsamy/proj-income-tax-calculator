import TaxCalculator from "@/components/tax-calculator"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image";
import {Calculator} from "lucide-react";
import type React from "react";
import {motion} from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-background/80 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary"/>
                Indian Salaried Income Tax Calculator
              </h1>
              <p className="text-muted-foreground">
                Calculate your income tax, deductions, and in-hand salary as per announced New Tax Regime 2025 - 2026.
              </p>
            </div>
            <ThemeToggle/>
        </div>
        <TaxCalculator/>
      </div>
    </main>
)
}

