"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WhaleTransaction, Chain } from "@/types";

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  bitcoin: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  solana: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  polygon: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  arbitrum: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  base: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

const CHAIN_LABELS: Record<string, string> = {
  ethereum: "ETH",
  bitcoin: "BTC",
  solana: "SOL",
  polygon: "MATIC",
  arbitrum: "ARB",
  base: "BASE",
};

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getUsdRowClass(usdValue: number): string {
  if (usdValue >= 1_000_000) return "bg-red-500/5";
  if (usdValue >= 500_000) return "bg-amber-500/5";
  if (usdValue >= 100_000) return "bg-yellow-500/5";
  return "";
}

function getUsdTextClass(usdValue: number): string {
  if (usdValue >= 1_000_000) return "text-red-400 font-semibold";
  if (usdValue >= 500_000) return "text-amber-400 font-semibold";
  if (usdValue >= 100_000) return "text-yellow-400";
  return "text-zinc-200";
}

const CHAINS: { value: "all" | Chain; label: string }[] = [
  { value: "all", label: "All Chains" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bitcoin", label: "Bitcoin" },
  { value: "solana", label: "Solana" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "base", label: "Base" },
];

function generateMockTransactions(count: number = 20): WhaleTransaction[] {
  const chains: Chain[] = ["ethereum", "bitcoin", "solana", "polygon", "arbitrum", "base"];
  const tokens = ["ETH", "BTC", "SOL", "USDC", "USDT", "WBTC", "ARB", "MATIC", "BONK", "PEPE"];
  const labels = [
    "Binance Hot Wallet",
    "Coinbase Custody",
    "Jump Trading",
    "Wintermute",
    "Alameda Research",
    "Grayscale Trust",
    "FTX Estate",
    "Circle Treasury",
    undefined,
    undefined,
    undefined,
  ];

  return Array.from({ length: count }, (_, i) => {
    const chain = chains[Math.floor(Math.random() * chains.length)];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const usdValue = Math.floor(Math.random() * 20_000_000) + 50_000;
    const amount = usdValue / (token === "BTC" ? 65000 : token === "ETH" ? 3500 : 100);
    const fromLabel = labels[Math.floor(Math.random() * labels.length)];
    const toLabel = labels[Math.floor(Math.random() * labels.length)];
    const types = ["transfer", "swap", "stake", "unstake"] as const;

    return {
      id: `tx-${Date.now()}-${i}`,
      hash: `0x${Math.random().toString(16).slice(2, 18)}${Math.random().toString(16).slice(2, 18)}`,
      chain,
      fromAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      toAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      token,
      amount,
      usdValue,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
      type: types[Math.floor(Math.random() * types.length)],
      fromLabel: fromLabel || undefined,
      toLabel: toLabel || undefined,
    };
  });
}

export default function TrackerPage() {
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChain, setFilterChain] = useState<"all" | Chain>("all");
  const [minAmount, setMinAmount] = useState(0);
  const [tokenFilter, setTokenFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadTransactions = useCallback(() => {
    setTransactions(generateMockTransactions(30));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadTransactions, 600);
    return () => clearTimeout(timer);
  }, [loadTransactions]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setTransactions((prev) => {
        const newTxs = generateMockTransactions(3);
        return [...newTxs, ...prev].slice(0, 50);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = transactions.filter((tx) => {
    if (filterChain !== "all" && tx.chain !== filterChain) return false;
    if (minAmount > 0 && tx.usdValue < minAmount) return false;
    if (tokenFilter && !tx.token.toLowerCase().includes(tokenFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Chain filter */}
            <div className="flex flex-wrap gap-1.5">
              {CHAINS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setFilterChain(c.value)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                    filterChain === c.value
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {/* Min amount */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 shrink-0">Min $</span>
                <input
                  type="number"
                  placeholder="0"
                  value={minAmount || ""}
                  onChange={(e) => setMinAmount(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>

              {/* Token filter */}
              <input
                type="text"
                placeholder="Token..."
                value={tokenFilter}
                onChange={(e) => setTokenFilter(e.target.value)}
                className="w-24 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />

              {/* Auto-refresh */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  className="scale-90"
                />
                <div className="flex items-center gap-1.5">
                  {autoRefresh && (
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span className="text-xs text-zinc-400">
                    {autoRefresh ? (
                      <span className="text-emerald-400 font-semibold">LIVE</span>
                    ) : (
                      "Auto-refresh"
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={loadTransactions}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center justify-between">
            <span>Whale Transactions</span>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
              {filtered.length} results
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-500 text-xs">Chain</TableHead>
                  <TableHead className="text-zinc-500 text-xs">From</TableHead>
                  <TableHead className="text-zinc-500 text-xs">To</TableHead>
                  <TableHead className="text-zinc-500 text-xs">Token</TableHead>
                  <TableHead className="text-zinc-500 text-xs">Amount</TableHead>
                  <TableHead className="text-zinc-500 text-xs">USD Value</TableHead>
                  <TableHead className="text-zinc-500 text-xs">Time</TableHead>
                  <TableHead className="text-zinc-500 text-xs">TX</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i} className="border-zinc-800">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : filtered.map((tx) => {
                      const chainColor = CHAIN_COLORS[tx.chain] ?? "bg-zinc-700 text-zinc-300";
                      return (
                        <TableRow
                          key={tx.id}
                          className={cn(
                            "border-zinc-800 hover:bg-zinc-800/50 transition-colors",
                            getUsdRowClass(tx.usdValue)
                          )}
                        >
                          <TableCell>
                            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", chainColor)}>
                              {CHAIN_LABELS[tx.chain] ?? tx.chain}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {tx.fromLabel ? (
                                <span className="text-xs text-blue-400 max-w-[100px] truncate">
                                  {tx.fromLabel}
                                </span>
                              ) : (
                                <span className="text-xs font-mono text-zinc-400">
                                  {truncateAddress(tx.fromAddress)}
                                </span>
                              )}
                              <button
                                onClick={() => handleCopy(tx.fromAddress, `from-${tx.id}`)}
                                className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              {copiedId === `from-${tx.id}` && (
                                <span className="text-xs text-emerald-400">✓</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {tx.toLabel ? (
                                <span className="text-xs text-blue-400 max-w-[100px] truncate">
                                  {tx.toLabel}
                                </span>
                              ) : (
                                <span className="text-xs font-mono text-zinc-400">
                                  {truncateAddress(tx.toAddress)}
                                </span>
                              )}
                              <button
                                onClick={() => handleCopy(tx.toAddress, `to-${tx.id}`)}
                                className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              {copiedId === `to-${tx.id}` && (
                                <span className="text-xs text-emerald-400">✓</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-200 text-xs font-medium">
                            {tx.token}
                          </TableCell>
                          <TableCell className="text-zinc-300 text-xs">
                            {tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className={cn("text-xs", getUsdTextClass(tx.usdValue))}>
                            {formatUSD(tx.usdValue)}
                          </TableCell>
                          <TableCell className="text-zinc-500 text-xs">
                            {timeAgo(tx.timestamp)}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`https://etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No transactions match your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
