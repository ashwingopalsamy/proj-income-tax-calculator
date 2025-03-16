import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full py-4 border-t border-border/40 text-sm text-muted-foreground text-center">
            <p>
                Ideated by{" "}
                <Link
                    href="https://ashwingopalsamy.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                >
                    Ashwin Gopalsamy
                </Link>
                , co-engineered with{" "}
                <span className="font-semibold">LLMs</span>, hosted in{" "}
                <span className="font-semibold">Vercel</span>.
            </p>
        </footer>
    )
}
