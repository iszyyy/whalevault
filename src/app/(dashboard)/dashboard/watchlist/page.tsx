"use client";

import { useState } from "react";
import { Plus, Trash2, Bell, Activity, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Chain, WalletActivity } from "@/types";

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "bg-blue-500/20 text-blue-400",
  bitcoin: "bg-orange-500/20 text-orange-400",
  solana: "bg-purple-500/20 text-purple-400",
  polygon: "bg-violet-500/20 text-violet-400",
  arbitrum: "bg-sky-500/20 text-sky-400",
  base: "bg-indigo-500/20 text-indigo-400",
};

const CHAIN_LABELS: Record<string, string> = {
  ethereum: "ETH",
  bitcoin: "BTC",
  solana: "SOL",
  polygon: "MATIC",
  arbitrum: "ARB",
  base: "BASE",
};

function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

interface WatchedWallet {
  id: string;
  address: string;
  chain: Chain;
  label: string;
  alertThreshold: number;
  activity: WalletActivity;
}

const INITIAL_WALLETS: WatchedWallet[] = [
  {
    id: "w1",
    address: "0x47ac0Fb4F2D84898e4D9e7b4DAb3C24507a6A895",
    chain: "ethereum",
    label: "Binance Hot Wallet",
    alertThreshold: 1000000,
    activity: {
      address: "0x47ac0Fb4F2D84898e4D9e7b4DAb3C24507a6A895",
      chain: "ethereum",
      label: "Binance Hot Wallet",
      totalVolumeUsd: 4200000000,
      transactionCount: 15234,
      lastActive: new Date(Date.now() - 5 * 60000),
      topTokens: [
        { symbol: "ETH", name: "Ethereum", amount: 125000, usdValue: 437500000, priceChange24h: 2.3 },
        { symbol: "USDT", name: "Tether", amount: 500000000, usdValue: 500000000, priceChange24h: 0.01 },
      ],
      recentTransactions: [
        {
          id: "rt1",
          hash: "0xabc123",
          chain: "ethereum",
          fromAddress: "0x47ac0Fb4F2D84898e4D9e7b4DAb3C24507a6A895",
          toAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          token: "ETH",
          amount: 500,
          usdValue: 1750000,
          timestamp: new Date(Date.now() - 10 * 60000),
          type: "transfer",
          fromLabel: "Binance Hot Wallet",
        },
      ],
    },
  },
  {
    id: "w2",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    chain: "solana",
    label: "Jump Trading",
    alertThreshold: 500000,
    activity: {
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      chain: "solana",
      label: "Jump Trading",
      totalVolumeUsd: 1850000000,
      transactionCount: 8921,
      lastActive: new Date(Date.now() - 32 * 60000),
      topTokens: [
        { symbol: "SOL", name: "Solana", amount: 2500000, usdValue: 375000000, priceChange24h: 5.7 },
        { symbol: "USDC", name: "USD Coin", amount: 100000000, usdValue: 100000000, priceChange24h: 0 },
      ],
      recentTransactions: [
        {
          id: "rt2",
          hash: "0xdef456",
          chain: "solana",
          fromAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
          toAddress: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
          token: "SOL",
          amount: 85000,
          usdValue: 12750000,
          timestamp: new Date(Date.now() - 45 * 60000),
          type: "transfer",
          fromLabel: "Jump Trading",
        },
      ],
    },
  },
  {
    id: "w3",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    chain: "bitcoin",
    label: "Grayscale Bitcoin Trust",
    alertThreshold: 2000000,
    activity: {
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      chain: "bitcoin",
      label: "Grayscale Bitcoin Trust",
      totalVolumeUsd: 2100000000,
      transactionCount: 3421,
      lastActive: new Date(Date.now() - 3 * 3600000),
      topTokens: [
        { symbol: "BTC", name: "Bitcoin", amount: 32450, usdValue: 2109250000, priceChange24h: -1.2 },
      ],
      recentTransactions: [
        {
          id: "rt3",
          hash: "0xghi789",
          chain: "bitcoin",
          fromAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          toAddress: "bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el",
          token: "BTC",
          amount: 50,
          usdValue: 3250000,
          timestamp: new Date(Date.now() - 2 * 3600000),
          type: "transfer",
          fromLabel: "Grayscale Bitcoin Trust",
        },
      ],
    },
  },
];

export default function WatchlistPage() {
  const [wallets, setWallets] = useState<WatchedWallet[]>(INITIAL_WALLETS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newChain, setNewChain] = useState<Chain>("ethereum");
  const [newLabel, setNewLabel] = useState("");
  const [newThreshold, setNewThreshold] = useState("");

  const removeWallet = (id: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== id));
  };

  const addWallet = () => {
    if (!newAddress.trim()) return;
    const wallet: WatchedWallet = {
      id: `w${Date.now()}`,
      address: newAddress.trim(),
      chain: newChain,
      label: newLabel.trim() || truncateAddress(newAddress.trim()),
      alertThreshold: Number(newThreshold) || 100000,
      activity: {
        address: newAddress.trim(),
        chain: newChain,
        label: newLabel.trim() || undefined,
        totalVolumeUsd: 0,
        transactionCount: 0,
        lastActive: new Date(),
        topTokens: [],
        recentTransactions: [],
      },
    };
    setWallets((prev) => [...prev, wallet]);
    setNewAddress("");
    setNewChain("ethereum");
    setNewLabel("");
    setNewThreshold("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Watched Wallets</h2>
          <p className="text-sm text-zinc-400">{wallets.length} wallets monitored</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus className="h-4 w-4" />
              Add Wallet
            </button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Add Wallet to Watchlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Wallet Address</Label>
                <Input
                  placeholder="0x... or bc1q..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Chain</Label>
                <Select value={newChain} onValueChange={(v) => setNewChain(v as Chain)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Label (optional)</Label>
                <Input
                  placeholder="e.g. My Trading Wallet"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Alert Threshold (USD)</Label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={addWallet}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Add to Watchlist
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {wallets.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <div className="text-4xl mb-4">👀</div>
            <p className="text-zinc-400 text-sm">No wallets in your watchlist yet.</p>
            <p className="text-zinc-500 text-xs mt-1">Add a wallet to start monitoring whale activity.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {wallets.map((wallet) => {
            const chainColor = CHAIN_COLORS[wallet.chain] ?? "bg-zinc-700 text-zinc-300";
            return (
              <Card key={wallet.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-white text-sm">{wallet.label}</CardTitle>
                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium", chainColor)}>
                          {CHAIN_LABELS[wallet.chain]}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-500 mt-0.5">
                        {truncateAddress(wallet.address)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeWallet(wallet.id)}
                      className="shrink-0 p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-800/60 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Total Volume</p>
                      <p className="text-sm font-semibold text-white">
                        {formatUSD(wallet.activity.totalVolumeUsd)}
                      </p>
                    </div>
                    <div className="bg-zinc-800/60 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Transactions</p>
                      <p className="text-sm font-semibold text-white">
                        {wallet.activity.transactionCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-zinc-800/60 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Last Active</p>
                      <p className="text-sm font-semibold text-white">
                        {timeAgo(wallet.activity.lastActive)}
                      </p>
                    </div>
                  </div>

                  {/* Alert threshold */}
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Bell className="h-3 w-3 text-amber-400" />
                    <span>Alert threshold: <span className="text-white">{formatUSD(wallet.alertThreshold)}</span></span>
                  </div>

                  {/* Recent transactions */}
                  {wallet.activity.recentTransactions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Recent Activity
                      </p>
                      <div className="space-y-1.5">
                        {wallet.activity.recentTransactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between bg-zinc-800/40 rounded px-3 py-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs text-zinc-300 font-medium">{tx.token}</span>
                              <span className="text-xs text-zinc-500">
                                {tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-semibold text-amber-400">
                                {formatUSD(tx.usdValue)}
                              </span>
                              <span className="text-xs text-zinc-600">{timeAgo(tx.timestamp)}</span>
                              <a
                                href={`https://etherscan.io/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-600 hover:text-zinc-300"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top tokens */}
                  {wallet.activity.topTokens.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-400 mb-2">Top Holdings</p>
                      <div className="flex flex-wrap gap-1.5">
                        {wallet.activity.topTokens.map((token) => (
                          <Badge
                            key={token.symbol}
                            variant="outline"
                            className="border-zinc-700 text-zinc-300 text-xs"
                          >
                            {token.symbol} · {formatUSD(token.usdValue)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
