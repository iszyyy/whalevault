"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-zinc-400 mb-1">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {formatUSD(entry.value)}
        </p>
      ))}
    </div>
  );
}

function generateTimeSeriesData(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 86400000);
    const base = 800_000_000;
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ETH: base + Math.random() * 600_000_000 * (1 + i / days),
      BTC: (base * 0.7) + Math.random() * 400_000_000 * (1 + i / days),
      SOL: (base * 0.3) + Math.random() * 200_000_000 * (1 + i / days),
    };
  });
}

function generateTokenVolumeData() {
  const tokens = ["ETH", "BTC", "USDT", "USDC", "SOL", "WBTC", "BNB", "ARB", "MATIC", "LINK"];
  return tokens.map((token) => ({
    token,
    volume: Math.floor(Math.random() * 2_000_000_000) + 100_000_000,
  }));
}

const PIE_DATA = [
  { name: "Ethereum", value: 45 },
  { name: "Bitcoin", value: 25 },
  { name: "Solana", value: 15 },
  { name: "Others", value: 15 },
];

const EXCHANGE_DATA = [
  { name: "Binance", inflow: 1_200_000_000, outflow: 980_000_000 },
  { name: "Coinbase", inflow: 750_000_000, outflow: 620_000_000 },
  { name: "Uniswap", inflow: 580_000_000, outflow: 540_000_000 },
  { name: "Kraken", inflow: 320_000_000, outflow: 290_000_000 },
  { name: "OKX", inflow: 280_000_000, outflow: 240_000_000 },
];

type Period = "24h" | "7d" | "30d";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");

  const days = period === "24h" ? 1 : period === "7d" ? 7 : 30;
  const timeSeriesData = useMemo(() => generateTimeSeriesData(days === 1 ? 24 : days), [days]);
  const tokenVolumeData = useMemo(() => generateTokenVolumeData(), []);

  const accDistScore = 68;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Analytics</h2>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="bg-zinc-800 border border-zinc-700">
            <TabsTrigger value="24h" className="data-[state=active]:bg-zinc-700 text-xs">
              24H
            </TabsTrigger>
            <TabsTrigger value="7d" className="data-[state=active]:bg-zinc-700 text-xs">
              7D
            </TabsTrigger>
            <TabsTrigger value="30d" className="data-[state=active]:bg-zinc-700 text-xs">
              30D
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Row 1: Line chart + Acc/Dist */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Daily Whale Transaction Volume</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Volume by chain over selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(v) => formatUSD(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
                />
                <Area
                  type="monotone"
                  dataKey="ETH"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="BTC"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="SOL"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Accumulation/Distribution Score */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Accumulation / Distribution</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Whale sentiment score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center pt-4">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#27272a" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray={`${(accDistScore / 100) * 314} 314`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-white">{accDistScore}</p>
                  <p className="text-xs text-emerald-400 font-medium">Accumulation</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "ETH", score: 72, color: "bg-blue-500" },
                { label: "BTC", score: 65, color: "bg-amber-500" },
                { label: "SOL", score: 81, color: "bg-purple-500" },
                { label: "ARB", score: 54, color: "bg-sky-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="text-white font-medium">{item.score}</span>
                  </div>
                  <Progress value={item.score} className={cn("h-1.5 bg-zinc-800")} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Bar chart + Pie chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Top 10 Tokens by Whale Volume</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Total whale-size transaction volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={tokenVolumeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(v) => formatUSD(v)}
                />
                <YAxis
                  type="category"
                  dataKey="token"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {tokenVolumeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Volume Distribution by Chain</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Share of total whale volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PIE_DATA.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px" }}
                  itemStyle={{ color: "#e4e4e7", fontSize: 12 }}
                  formatter={(value) => [`${value}%`, ""]}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#a1a1aa", fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Exchange inflow/outflow */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">Exchange Inflow / Outflow</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">
            Whale capital flows across major exchanges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={EXCHANGE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                tickFormatter={(v) => formatUSD(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#a1a1aa", fontSize: 12 }}>{value}</span>
                )}
              />
              <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
