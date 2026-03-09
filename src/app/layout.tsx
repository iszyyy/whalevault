import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";

export const metadata: Metadata = {
  title: "WhaleVault - Crypto Whale Intelligence",
  description:
    "Institutional-grade crypto whale intelligence platform. Track on-chain wallet movements, detect accumulation signals, and stay ahead of the market.",
  keywords: ["crypto", "whale tracking", "blockchain analytics", "on-chain data", "DeFi"],
  authors: [{ name: "WhaleVault" }],
  openGraph: {
    title: "WhaleVault - Crypto Whale Intelligence",
    description:
      "Track crypto whale wallets, detect market signals, and gain an edge with institutional-grade on-chain analytics.",
    type: "website",
    url: "https://whalevault.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhaleVault - Crypto Whale Intelligence",
    description: "Institutional-grade crypto whale intelligence platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}