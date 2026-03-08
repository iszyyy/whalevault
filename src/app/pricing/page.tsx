import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PLANS } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Pricing — WhaleVault",
  description:
    "Simple, transparent pricing for every trader. Start free, upgrade when you need more power.",
};

// ─── Static UI config (only display metadata not in PLANS) ───────────────────

const planUiConfig = {
  free: {
    description: "For curious traders getting started with on-chain intelligence.",
    badge: null,
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    href: "/register",
  },
  pro: {
    description: "For serious traders who need institutional-grade intelligence.",
    badge: "Most Popular",
    cta: "Start 14-Day Free Trial",
    ctaVariant: "default" as const,
    href: "/register?plan=pro",
  },
  enterprise: {
    description: "For funds and institutional desks that need maximum coverage and SLAs.",
    badge: null,
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    href: "/register?plan=enterprise",
  },
} as const;

function formatLimit(value: number, unit: string) {
  return value === -1 ? `Unlimited ${unit}` : `${value.toLocaleString()} ${unit}`;
}

const plans = (["free", "pro", "enterprise"] as const).map((tier) => {
  const plan = PLANS[tier];
  const ui = planUiConfig[tier];
  const { limits } = plan;
  return {
    ...plan,
    ...ui,
    allFeatures: [
      formatLimit(limits.walletWatches, "wallet watches"),
      formatLimit(limits.alertsPerDay, "alerts per day"),
      `${limits.apiRequestsPerDay === -1 ? "Unlimited" : limits.apiRequestsPerDay.toLocaleString()} API requests/day`,
      `${limits.historicalDataDays === 365 ? "Full 365-day" : `${limits.historicalDataDays}-day`} historical data`,
      limits.exchangeConnections === 0
        ? "No exchange connections"
        : formatLimit(limits.exchangeConnections, "exchange connections"),
      ...plan.features,
    ],
  };
});

const faqItems = [
  {
    q: "Can I change plans at any time?",
    a: "Yes. You can upgrade or downgrade instantly from your account settings. Upgrades are prorated; downgrades take effect at the next billing cycle.",
  },
  {
    q: "Is the 14-day Pro trial really free?",
    a: "Absolutely — no credit card required to start. You'll only be charged after you decide to continue.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards via Stripe. Enterprise customers can also pay by bank transfer or crypto.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — annual billing saves you 20% compared to monthly. Toggle to annual billing on the checkout page.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <Badge
          variant="outline"
          className="mb-4 border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/10"
        >
          <Zap className="mr-1 h-3 w-3" />
          Simple, transparent pricing
        </Badge>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
            Pricing
          </span>{" "}
          for every trader
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Start free. Upgrade when you need more power. Cancel any time.
        </p>
      </section>

      {/* Plans */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.badge
                    ? "border-blue-500/60 bg-gradient-to-b from-blue-950/40 to-card shadow-2xl shadow-blue-500/10"
                    : "border-border/60 bg-card/50"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 px-4 text-white hover:bg-blue-600">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="mb-1 text-xl font-bold">{plan.name}</h2>
                  <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.allFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-blue-400" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.ctaVariant}
                  size="lg"
                  className={
                    plan.badge
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold hover:from-blue-500 hover:to-cyan-500"
                      : ""
                  }
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Annual billing note */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            💡 Save 20% with annual billing — available at checkout.
          </p>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="bg-card/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Full feature comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-4 py-4 text-center font-semibold">Free</th>
                  <th className="px-4 py-4 text-center font-semibold text-blue-400">Pro</th>
                  <th className="px-4 py-4 text-center font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Wallet watches",
                    String(PLANS.free.limits.walletWatches),
                    String(PLANS.pro.limits.walletWatches),
                    "Unlimited"],
                  ["Alerts per day",
                    String(PLANS.free.limits.alertsPerDay),
                    String(PLANS.pro.limits.alertsPerDay),
                    "Unlimited"],
                  ["API requests/day",
                    PLANS.free.limits.apiRequestsPerDay.toLocaleString(),
                    PLANS.pro.limits.apiRequestsPerDay.toLocaleString(),
                    "Unlimited"],
                  ["Historical data",
                    `${PLANS.free.limits.historicalDataDays} days`,
                    `${PLANS.pro.limits.historicalDataDays} days`,
                    "Full (365 days)"],
                  ["Exchange connections",
                    String(PLANS.free.limits.exchangeConnections),
                    String(PLANS.pro.limits.exchangeConnections),
                    "Unlimited"],
                  ["Real-time WebSocket", "—", "✓", "Dedicated"],
                  ["Stealth execution", "—", "✓", "✓"],
                  ["Advanced analytics", "—", "✓", "✓"],
                  ["Custom alert thresholds", "—", "—", "✓"],
                  ["API access", "—", "✓", "✓"],
                  ["Support", "Community", "Email (priority)", "Dedicated manager"],
                  ["SLA guarantee", "—", "—", "99.9%"],
                ].map(([feature, free, pro, enterprise]) => (
                  <tr key={feature} className="hover:bg-card/50">
                    <td className="px-6 py-3 font-medium">{feature}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{free}</td>
                    <td className="px-4 py-3 text-center text-blue-400 font-medium">{pro}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Pricing FAQ
          </h2>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-border/60 bg-card/50 px-6 py-5"
              >
                <h3 className="mb-2 font-semibold">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl bg-gradient-to-br from-blue-900/60 to-cyan-900/60 p-10 ring-1 ring-blue-500/30">
            <span className="mb-4 block text-4xl">🐋</span>
            <h2 className="mb-3 text-2xl font-bold text-white">Still have questions?</h2>
            <p className="mb-6 text-blue-200/70">
              Our team is happy to walk you through any plan or discuss custom pricing for larger
              teams.
            </p>
            <Button
              size="lg"
              className="bg-white px-8 font-bold text-blue-900 hover:bg-blue-50"
              asChild
            >
              <Link href="mailto:hello@whalevault.io">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
