import Link from "next/link";
import {
  Activity,
  Bell,
  ChevronRight,
  Code2,
  Globe,
  LineChart,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Activity,
    title: "Real-Time Whale Tracking",
    description:
      "Monitor large wallet movements the moment they happen. Get instant visibility into $1M+ transactions across all major chains.",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description:
      "Track whales across Ethereum, Bitcoin, Solana, Polygon, Arbitrum, and Base from a single unified dashboard.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Set threshold-based alerts delivered via email, Telegram, or webhooks. Never miss a significant whale move again.",
  },
  {
    icon: Shield,
    title: "Stealth Execution",
    description:
      "Mirror whale trades through integrated exchange connections without revealing your strategy to the market.",
  },
  {
    icon: LineChart,
    title: "Analytics & Insights",
    description:
      "Deep historical data, sentiment scoring, and accumulation pattern detection powered by on-chain analysis.",
  },
  {
    icon: Code2,
    title: "API Access",
    description:
      "Programmatic access to all whale data via REST API. Build custom strategies, bots, and integrations with ease.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For curious traders getting started",
    badge: null,
    features: [
      "5 wallet watches",
      "10 alerts per day",
      "100 API requests/day",
      "7-day historical data",
      "1 exchange connection",
      "Community support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    href: "/register",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For serious traders who need an edge",
    badge: "Most Popular",
    features: [
      "100 wallet watches",
      "500 alerts per day",
      "10,000 API requests/day",
      "90-day historical data",
      "5 exchange connections",
      "Real-time WebSocket feed",
      "Priority email support",
      "Stealth execution",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "default" as const,
    href: "/register?plan=pro",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/mo",
    description: "For funds and institutional traders",
    badge: null,
    features: [
      "Unlimited wallet watches",
      "Unlimited alerts",
      "Unlimited API requests",
      "Full historical data",
      "Unlimited exchange connections",
      "Dedicated WebSocket stream",
      "Custom alert thresholds",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    href: "/register?plan=enterprise",
  },
];

const steps = [
  {
    step: "01",
    title: "Connect & Configure",
    description:
      "Sign up in seconds, connect your exchange accounts, and add wallets to your watchlist.",
    icon: "🔗",
  },
  {
    step: "02",
    title: "Monitor Whale Activity",
    description:
      "Our engine scans millions of on-chain transactions in real time and surfaces the ones that matter.",
    icon: "🔍",
  },
  {
    step: "03",
    title: "Act on Intelligence",
    description:
      "Receive instant alerts, analyze patterns, and execute trades before the market reacts.",
    icon: "⚡",
  },
];

const testimonials = [
  {
    name: "Alex R.",
    role: "DeFi Trader",
    avatar: "AR",
    quote:
      "WhaleVault completely changed how I trade. I caught the last three major ETH accumulation events before they pumped. Paid for itself in the first week.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "Crypto Fund Manager",
    avatar: "SM",
    quote:
      "The multi-chain coverage and API access are exactly what our fund needed. The data quality is institutional grade and the latency is remarkably low.",
    rating: 5,
  },
  {
    name: "David K.",
    role: "Quantitative Analyst",
    avatar: "DK",
    quote:
      "We built our entire signal pipeline on top of the WhaleVault API. The accuracy of wallet labeling and the historical depth are unmatched.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "How does WhaleVault detect whale transactions?",
    a: "We index every on-chain transaction above configurable USD thresholds across 6+ blockchains in real time. Our labeling engine cross-references known exchange, DAO, and protocol wallets to give context to each movement.",
  },
  {
    q: "Which blockchains are supported?",
    a: "Currently we support Ethereum, Bitcoin, Solana, Polygon, Arbitrum, and Base. Additional chains including Avalanche and BNB Chain are on our roadmap for Q1.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes — Pro comes with a 14-day free trial, no credit card required. Enterprise plans include a guided 30-day pilot with a dedicated account manager.",
  },
  {
    q: "How do Smart Alerts work?",
    a: "You define alert rules (e.g., any wallet moves >$5M of ETH on Ethereum) and choose your delivery channels — email, Telegram bot, or HTTP webhook. Alerts fire within seconds of on-chain confirmation.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Absolutely. Subscriptions are billed monthly with no long-term commitment. You can cancel from your account settings at any time and retain access until the end of the billing period.",
  },
  {
    q: "What is Stealth Execution?",
    a: "Stealth Execution lets you mirror whale trades through your connected exchange accounts using iceberg orders and time-spread execution to avoid moving the market. Available on Pro and Enterprise plans.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-6 border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/10"
          >
            <Zap className="mr-1 h-3 w-3" />
            Real-time on-chain intelligence
          </Badge>

          {/* Animated whale emoji */}
          <div className="mb-6 flex justify-center">
            <span
              className="text-8xl drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              🐋
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Track Crypto Whales.
            </span>
            <br />
            <span className="text-foreground">Trade Smarter.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Institutional-grade on-chain analytics that surfaces large wallet movements, detects
            accumulation signals, and lets you act before the market reacts.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 text-base font-semibold hover:from-blue-500 hover:to-cyan-500"
              asChild
            >
              <Link href="/register">
                Start Free <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-base"
              asChild
            >
              <Link href="#how-it-works">View Demo</Link>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/50 backdrop-blur">
            {[
              { value: "50K+", label: "Whales Tracked" },
              { value: "$2.3T", label: "Monitored" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-16px); }
          }
        `}</style>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                front-run the market
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A complete intelligence suite built for traders who demand speed, accuracy, and depth.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/60 bg-card/50 transition-all duration-300 hover:border-blue-500/40 hover:bg-card hover:shadow-lg hover:shadow-blue-500/5"
              >
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 transition-colors group-hover:bg-blue-500/20">
                    <feature.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-card/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                minutes
              </span>
            </h2>
            <p className="text-muted-foreground">
              No blockchain expertise required — we handle the complexity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 hidden h-px w-full -translate-y-1/2 translate-x-1/2 bg-gradient-to-r from-border to-transparent md:block" />
                )}
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-4xl shadow-lg shadow-blue-500/10">
                  {step.icon}
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                transparent pricing
              </span>
            </h2>
            <p className="text-muted-foreground">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.badge
                    ? "border-blue-500/60 bg-gradient-to-b from-blue-950/40 to-card shadow-xl shadow-blue-500/10"
                    : "border-border/60 bg-card/50"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 px-3 text-white hover:bg-blue-600">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="mb-1 text-lg font-semibold">{plan.name}</h3>
                  <p className="mb-3 text-xs text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs">
                        ✓
                      </span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.ctaVariant}
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
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-card/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                serious traders
              </span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/60 bg-card/50">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-xs font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                questions
              </span>
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-cyan-900/80 p-12 text-center shadow-2xl ring-1 ring-blue-500/30">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>
            <span className="mb-4 block text-5xl">🐋</span>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to trade like a whale?
            </h2>
            <p className="mb-8 text-lg text-blue-200/80">
              Join 50,000+ traders who get ahead of the market with WhaleVault intelligence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white px-10 text-blue-900 font-bold hover:bg-blue-50"
                asChild
              >
                <Link href="/register">Start Free Today</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 px-10 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/pricing">See All Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
