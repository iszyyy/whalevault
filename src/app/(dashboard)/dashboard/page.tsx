"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TransactionRow } from "@/components/dashboard/transaction-row";
import type { WhaleTransaction } from "@/types";

function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

const MOCK_TRANSACTIONS: WhaleTransaction[] = [
  {
    id: "1",
    hash: "0xabc123def456",
    chain: "ethereum",
    fromAddress: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6a895",
    toAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    token: "ETH",
    amount: 4200,
    usdValue: 14700000,
    timestamp: new Date(Date.now() - 2 * 60000),
    type: "transfer",
    fromLabel: "Binance Hot Wallet",
  },
  {
    id: "2",
    hash: "0xdef456abc789",
    chain: "bitcoin",
    fromAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    toAddress: "bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el",
    token: "BTC",
    amount: 150,
    usdValue: 9750000,
    timestamp: new Date(Date.now() - 5 * 60000),
    type: "transfer",
    toLabel: "Coinbase Custody",
  },
  {
    id: "3",
    hash: "0xghi789jkl012",
    chain: "solana",
    fromAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    toAddress: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    token: "SOL",
    amount: 85000,
    usdValue: 12750000,
    timestamp: new Date(Date.now() - 8 * 60000),
    type: "transfer",
    fromLabel: "Jump Trading",
  },
  {
    id: "4",
    hash: "0xjkl012mno345",
    chain: "ethereum",
    fromAddress: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
    toAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    token: "USDC",
    amount: 5000000,
    usdValue: 5000000,
    timestamp: new Date(Date.now() - 12 * 60000),
    type: "transfer",
    fromLabel: "Binance Cold Wallet",
    toLabel: "Circle Treasury",
  },
  {
    id: "5",
    hash: "0xmno345pqr678",
    chain: "polygon",
    fromAddress: "0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE",
    toAddress: "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
    token: "MATIC",
    amount: 2500000,
    usdValue: 3000000,
    timestamp: new Date(Date.now() - 15 * 60000),
    type: "transfer",
  },
  {
    id: "6",
    hash: "0xpqr678stu901",
    chain: "arbitrum",
    fromAddress: "0xaB1cD2eF3456GH78IJ9K0LM1234NO5678PQ9012",
    toAddress: "0xBC2DE3FG4567HI89JK0L1MN2345OP6789QR0123",
    token: "ARB",
    amount: 10000000,
    usdValue: 8500000,
    timestamp: new Date(Date.now() - 22 * 60000),
    type: "transfer",
    fromLabel: "Arbitrum Foundation",
  },
  {
    id: "7",
    hash: "0xstu901vwx234",
    chain: "ethereum",
    fromAddress: "0xE0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    toAddress: "0xF47ac0Fb4F2D84898e4d9e7B4DAb3C24507a6A8",
    token: "WBTC",
    amount: 45,
    usdValue: 2925000,
    timestamp: new Date(Date.now() - 28 * 60000),
    type: "swap",
  },
  {
    id: "8",
    hash: "0xvwx234yza567",
    chain: "base",
    fromAddress: "0x1234567890abcdef1234567890abcdef12345678",
    toAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    token: "ETH",
    amount: 850,
    usdValue: 2975000,
    timestamp: new Date(Date.now() - 35 * 60000),
    type: "transfer",
  },
  {
    id: "9",
    hash: "0xyza567bcd890",
    chain: "solana",
    fromAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    toAddress: "8HoQnePLqPj4M7PUDzfw8e3Yy9mEYnV9T9DFstyClgt",
    token: "BONK",
    amount: 50000000000,
    usdValue: 1500000,
    timestamp: new Date(Date.now() - 42 * 60000),
    type: "transfer",
    fromLabel: "Alameda Research",
  },
  {
    id: "10",
    hash: "0xbcd890efg123",
    chain: "ethereum",
    fromAddress: "0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0",
    toAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    token: "USDT",
    amount: 8000000,
    usdValue: 8000000,
    timestamp: new Date(Date.now() - 55 * 60000),
    type: "transfer",
    fromLabel: "Kraken Exchange",
    toLabel: "Tether Treasury",
  },
];

const TOP_WHALES = [
  { address: "0x47ac0Fb4F2D844", label: "Binance Hot Wallet", volume: 4200000000, change: 12.3 },
  { address: "bc1qxy2kgdygjrs", label: "Grayscale Bitcoin Trust", volume: 2100000000, change: -3.4 },
  { address: "7xKXtg2CW87d97T", label: "Jump Trading", volume: 1850000000, change: 8.7 },
  { address: "0x3f5CE5FBFe3E9a", label: "Wintermute", volume: 1620000000, change: 5.1 },
  { address: "0x267be1c1d684f7", label: "Alameda Research", volume: 980000000, change: -1.2 },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Transactions (24h)"
          value="1,247"
          change={12.3}
          changeLabel="vs yesterday"
          icon={Activity}
          iconColor="text-blue-400"
          loading={loading}
        />
        <StatsCard
          title="Total USD Volume"
          value="$2.84B"
          change={8.7}
          changeLabel="vs yesterday"
          icon={DollarSign}
          iconColor="text-emerald-400"
          loading={loading}
        />
        <StatsCard
          title="Active Whales"
          value="3,891"
          change={-2.1}
          changeLabel="vs yesterday"
          icon={Users}
          iconColor="text-purple-400"
          loading={loading}
        />
        <StatsCard
          title="Market Sentiment"
          value="Bullish 72"
          change={5.4}
          changeLabel="score"
          icon={TrendingUp}
          iconColor="text-amber-400"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent large transactions */}
        <Card className="xl:col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-base flex items-center justify-between">
              Recent Large Transactions
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-normal">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="px-6 pb-6 space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full bg-zinc-800" />
                ))}
              </div>
            ) : (
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TransactionRow key={tx.id} transaction={tx} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top whale wallets */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-base">Top Whale Wallets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full bg-zinc-800" />
                ))
              : TOP_WHALES.map((whale, index) => {
                  const maxVolume = TOP_WHALES[0].volume;
                  const barWidth = (whale.volume / maxVolume) * 100;
                  const isPositive = whale.change >= 0;
                  return (
                    <div key={whale.address} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-medium text-zinc-500 w-4">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {whale.label}
                            </p>
                            <p className="text-xs text-zinc-500 font-mono">
                              {whale.address.slice(0, 10)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-xs font-semibold text-white">
                            {formatUSD(whale.volume)}
                          </p>
                          <p
                            className={`text-xs flex items-center justify-end gap-0.5 ${
                              isPositive ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            <ArrowUpRight
                              className={`h-3 w-3 ${
                                !isPositive ? "rotate-180" : ""
                              }`}
                            />
                            {Math.abs(whale.change)}%
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
