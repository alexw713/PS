import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "PS Performer Directory",
  description: "18+ adult performer directory — public bios and social links only. No pirated video.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AgeGate>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t border-ink-800/80 py-8 text-center text-xs text-ink-500">
            18+ directory · public social links only · no torrents, magnets, or pirated video hosting
          </footer>
        </AgeGate>
      </body>
    </html>
  );
}
