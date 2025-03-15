import TaxCalculator from "@/components/tax-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
          Indian Salaried Income Tax Calculator
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Calculate your income tax, deductions, and in-hand salary as per announced New Tax Regime 2025 - 2026.
        </p>
        <TaxCalculator />
      </div>
    </main>
  )
}

