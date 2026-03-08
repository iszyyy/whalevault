"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

export default function ExecutePage() {
  // In this demo, user is "free" tier — always show upgrade gate
  const isEnterprise = false;

  if (!isEnterprise) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-5 rounded-full bg-zinc-800 border border-zinc-700">
              <Lock className="h-12 w-12 text-zinc-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Enterprise Feature</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-2">
            Algorithmic trade execution, whale-mirroring, stealth mode, and exchange integrations
            are available exclusively on the <span className="text-purple-400 font-medium">Enterprise</span> plan.
          </p>
          <p className="text-zinc-500 text-xs mb-8">
            Connect Binance, Bybit, and other exchanges to automatically mirror whale trades with
            configurable risk limits.
          </p>
          <div className="space-y-3">
            <Link
              href="/pricing"
              className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all"
            >
              Upgrade to Enterprise
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
            >
              Back to Overview
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 text-left">
            {[
              "Connect Binance & Bybit",
              "Auto-mirror whale trades",
              "Stealth execution mode",
              "Stop-loss & risk controls",
              "Trade history & P&L",
              "Max position size limits",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-purple-400">✓</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
