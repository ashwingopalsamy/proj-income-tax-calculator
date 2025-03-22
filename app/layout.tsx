import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/footer"
import "./globals.css"
import type { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Indian Salaried Income Tax Calculator",
    description: "Calculate your income tax, deductions, and in-hand salary as per announced New Tax Regime 2025 - 2026.",
    keywords: [
        "Indian Income Tax Calculator",
        "Salaried Tax Calculator",
        "New Tax Regime Calculator",
        "Income Tax New Regime",
        "Tax Calculator Without Deductions",
        "2024-25 Tax Calculator",
        "India Tax Calculator",
        "Income Tax for Salaried",
    ],
    creator: "Ashwin Gopalsamy",
    category: "Financial Tool",
    openGraph: {
        title: "Indian Salaried Income Tax Calculator",
        description: "Calculate your income tax, deductions, and in-hand salary as per announced New Tax Regime 2025 - 2026.",
        url: "https://simpleincometax.vercel.app",
        siteName: "Indian Tax Calculator",
        type: "website",
        images: [
            {
                url: "/banner.jpg",
                width: 1200,
                height: 630,
                alt: "Indian Salaried Income Tax Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Indian Salaried Income Tax Calculator",
        description: "Calculate your income tax, deductions, and in-hand salary as per announced New Tax Regime 2025 - 2026.",
        images: ["/banner.jpg"],
    },
    robots: {
       index: true,
       follow: true,
       "max-snippet": -1,
       "max-image-preview": "large",
       "max-video-preview": -1,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <main className="min-h-screen flex flex-col">
          <div className="flex-grow">{children}</div>
          <Footer />
        </main>
        <SpeedInsights />
        <Analytics />
      </ThemeProvider>
      </body>
      </html>
  )
}
