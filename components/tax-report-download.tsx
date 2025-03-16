"use client";

import { Button } from "@/components/ui/button";
import type { TaxResults } from "@/lib/tax-calculations";
import { formatCurrencyToINR } from "@/lib/formatters";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

(jsPDF as any).autoTable = autoTable;

interface TaxReportDownloadProps {
    results: TaxResults;
    employerPfIncluded: boolean;
}

export default function TaxReportDownload({ results, employerPfIncluded }: TaxReportDownloadProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDFReport = () => {
        if (results.grossSalary === 0) return;

        setIsGenerating(true);
        const doc = new jsPDF();

        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.text(`Indian Salaried Income Tax Calculation Report`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        autoTable(doc, {
            startY: 35,
            head: [["Description", "Amount"]],
            body: [
                ["Gross Salary", formatCurrencyToINR(results.grossSalary)],
                ["Standard Deduction", formatCurrencyToINR(results.standardDeduction)],
                ["Taxable Income", formatCurrencyToINR(results.taxableIncome)],
            ],
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [33, 150, 243] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Tax Slab", "Tax Amount"]],
            body: [
                ["5% (INR 4,00,000 - INR 8,00,000)", formatCurrencyToINR(Math.min(Math.max(0, results.taxableIncome - 400000), 400000) * 0.05)],
                ["10% (INR 8,00,001 - INR 12,00,000)", formatCurrencyToINR(Math.min(Math.max(0, results.taxableIncome - 800000), 400000) * 0.1)],
                ["15% (INR 12,00,001 - INR 16,00,000)", formatCurrencyToINR(Math.min(Math.max(0, results.taxableIncome - 1200000), 400000) * 0.15)],
                ["20% (INR 16,00,001 - INR 20,00,000)", formatCurrencyToINR(Math.min(Math.max(0, results.taxableIncome - 1600000), 400000) * 0.2)],
                ["25% (INR 20,00,001 - INR 24,00,000)", formatCurrencyToINR(Math.min(Math.max(0, results.taxableIncome - 2000000), 400000) * 0.25)],
                ["30% (Above INR 24,00,000)", formatCurrencyToINR(Math.max(0, results.taxableIncome - 2400000) * 0.3)],
                ["Total Income Tax", formatCurrencyToINR(results.incomeTax)],
                ["Health & Education CESS (4%)", formatCurrencyToINR(results.cess)],
                ["Total Tax Liability", formatCurrencyToINR(results.totalTax)],
            ],
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 87, 34] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Deduction Type", "Amount"]],
            body: [
                ["Employee PF Deduction (6%)", formatCurrencyToINR(results.employeePF)],
                ...(employerPfIncluded ? [["Employer PF Deduction (6%)", formatCurrencyToINR(results.employeePF)]] : []),
            ],
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 193, 7] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Final Salary Calculation", "Amount"]],
            body: [
                ["In-Hand Salary Per Month", formatCurrencyToINR(results.inHandSalaryPerMonth)],
                ["Total In-Hand Salary", formatCurrencyToINR(results.inHandSalary)],
            ],
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [76, 175, 80] },
        });


        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
            "Disclaimer: This report is for informational purposes only and should not be considered tax advice.",
            14,
            doc.internal.pageSize.height - 10
        );

        doc.save(`Salary-Breakdown-Report-${results.grossSalary}.pdf`);
        setIsGenerating(false);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={generatePDFReport}
            disabled={isGenerating || results.grossSalary === 0}
        >
            <Download className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Download Tax Report (PDF)"}
        </Button>
    );
}
