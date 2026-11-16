import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinship (കുടുംബം) — Family Tree Social Network",
  description: "A modern family-tree-based social network with interactive radial lineage, verified relationships, privacy-controlled feeds, and family memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-surface-muted min-h-screen">
        {children}
      </body>
    </html>
  );
}
