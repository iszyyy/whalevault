import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "WhaleVault - Crypto Whale Intelligence",
  description:
    "Institutional-grade crypto whale intelligence platform. Track on-chain wallet movements, detect accumulation signals, and stay ahead of the market.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
