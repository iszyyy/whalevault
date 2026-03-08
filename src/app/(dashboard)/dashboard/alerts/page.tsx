"use client";

import { useState } from "react";
import { Plus, Trash2, Bell, AlertTriangle, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AlertWithHistory, AlertType, DeliveryMethod, Chain } from "@/types";

function formatUSD(value: number): string {
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

const ALERT_TYPE_CONFIG: Record<AlertType, { label: string; icon: React.ElementType; color: string }> = {
  large_transaction: { label: "Large Transaction", icon: ArrowUpRight, color: "bg-red-500/20 text-red-400" },
  wallet_activity: { label: "Wallet Activity", icon: Wallet, color: "bg-blue-500/20 text-blue-400" },
  token_accumulation: { label: "Token Accumulation", icon: TrendingUp, color: "bg-emerald-500/20 text-emerald-400" },
  price_impact: { label: "Price Impact", icon: AlertTriangle, color: "bg-amber-500/20 text-amber-400" },
  new_whale_wallet: { label: "New Whale Wallet", icon: Bell, color: "bg-purple-500/20 text-purple-400" },
};

const INITIAL_ALERTS: AlertWithHistory[] = [
  {
    id: "a1",
    userId: "u1",
    type: "large_transaction",
    config: { type: "large_transaction", thresholdUsd: 1000000, chain: "ethereum" },
    deliveryMethod: ["in_app", "email"],
    active: true,
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(Date.now() - 2 * 3600000),
    triggerCount: 47,
    lastTriggeredAt: new Date(Date.now() - 22 * 60000),
  },
  {
    id: "a2",
    userId: "u1",
    type: "wallet_activity",
    config: {
      type: "wallet_activity",
      walletAddress: "0x47ac0Fb4F2D84898e4D9e7b4DAb3C24507a6A895",
      chain: "ethereum",
    },
    deliveryMethod: ["in_app", "telegram"],
    active: true,
    createdAt: new Date(Date.now() - 14 * 86400000),
    updatedAt: new Date(Date.now() - 5 * 3600000),
    triggerCount: 128,
    lastTriggeredAt: new Date(Date.now() - 45 * 60000),
  },
  {
    id: "a3",
    userId: "u1",
    type: "token_accumulation",
    config: { type: "token_accumulation", token: "ETH", thresholdUsd: 500000, chain: "ethereum" },
    deliveryMethod: ["email"],
    active: false,
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(Date.now() - 24 * 3600000),
    triggerCount: 12,
    lastTriggeredAt: new Date(Date.now() - 2 * 86400000),
  },
];

const ALERT_HISTORY = [
  { id: "h1", type: "large_transaction" as AlertType, triggeredAt: new Date(Date.now() - 22 * 60000), description: "15,000 ETH moved from Binance Hot Wallet", chain: "ethereum" as Chain },
  { id: "h2", type: "wallet_activity" as AlertType, triggeredAt: new Date(Date.now() - 45 * 60000), description: "Binance Hot Wallet executed 12 transactions", chain: "ethereum" as Chain },
  { id: "h3", type: "large_transaction" as AlertType, triggeredAt: new Date(Date.now() - 2 * 3600000), description: "5,000 BTC moved from unknown wallet", chain: "bitcoin" as Chain },
  { id: "h4", type: "token_accumulation" as AlertType, triggeredAt: new Date(Date.now() - 5 * 3600000), description: "Whale accumulated $2.4M ETH in 1 hour", chain: "ethereum" as Chain },
  { id: "h5", type: "large_transaction" as AlertType, triggeredAt: new Date(Date.now() - 86400000), description: "$8.2M USDT moved to Coinbase Custody", chain: "ethereum" as Chain },
];

const FREE_TIER_LIMIT = 5;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertWithHistory[]>(INITIAL_ALERTS);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New alert form state
  const [newType, setNewType] = useState<AlertType>("large_transaction");
  const [newThreshold, setNewThreshold] = useState("");
  const [newChain, setNewChain] = useState<Chain | "all">("ethereum");
  const [newToken, setNewToken] = useState("");
  const [newDelivery, setNewDelivery] = useState<DeliveryMethod[]>(["in_app"]);
  const [newWebhook, setNewWebhook] = useState("");

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleDelivery = (method: DeliveryMethod) => {
    setNewDelivery((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const createAlert = () => {
    const alert: AlertWithHistory = {
      id: `a${Date.now()}`,
      userId: "u1",
      type: newType,
      config: {
        type: newType,
        thresholdUsd: Number(newThreshold) || undefined,
        chain: newChain === "all" ? undefined : newChain,
        token: newToken || undefined,
        webhookUrl: newWebhook || undefined,
      },
      deliveryMethod: newDelivery,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      triggerCount: 0,
    };
    setAlerts((prev) => [...prev, alert]);
    setShowCreateForm(false);
    setNewType("large_transaction");
    setNewThreshold("");
    setNewChain("ethereum");
    setNewToken("");
    setNewDelivery(["in_app"]);
    setNewWebhook("");
  };

  const atLimit = alerts.length >= FREE_TIER_LIMIT;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Alert Rules</h2>
          <p className="text-sm text-zinc-400">{alerts.length} / {FREE_TIER_LIMIT} alerts (Free tier)</p>
        </div>
        {atLimit ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-amber-400">Limit reached — </span>
            <a href="/pricing" className="text-xs text-amber-300 underline font-medium">Upgrade</a>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Alert
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <Card className="bg-zinc-900 border-zinc-800 border-blue-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm">New Alert Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Alert Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as AlertType)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="large_transaction">Large Transaction</SelectItem>
                    <SelectItem value="wallet_activity">Wallet Activity</SelectItem>
                    <SelectItem value="token_accumulation">Token Accumulation</SelectItem>
                    <SelectItem value="price_impact">Price Impact</SelectItem>
                    <SelectItem value="new_whale_wallet">New Whale Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Chain</Label>
                <Select value={newChain} onValueChange={(v) => setNewChain(v as Chain | "all")}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="all">All Chains</SelectItem>
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
                <Label className="text-zinc-300 text-xs">Threshold (USD)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1000000"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-sm placeholder-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Token (optional)</Label>
                <Input
                  placeholder="e.g. ETH"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-sm placeholder-zinc-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-zinc-300 text-xs">Delivery Methods</Label>
                <div className="flex flex-wrap gap-2">
                  {(["in_app", "email", "telegram", "webhook"] as DeliveryMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => toggleDelivery(method)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                        newDelivery.includes(method)
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      )}
                    >
                      {method === "in_app" ? "In-App" : method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {newDelivery.includes("webhook") && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-zinc-300 text-xs">Webhook URL</Label>
                  <Input
                    placeholder="https://..."
                    value={newWebhook}
                    onChange={(e) => setNewWebhook(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-sm placeholder-zinc-500"
                  />
                </div>
              )}

              <div className="md:col-span-2 flex gap-2 pt-2">
                <button
                  onClick={createAlert}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Create Alert
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {alerts.map((alert) => {
          const typeConfig = ALERT_TYPE_CONFIG[alert.type];
          const Icon = typeConfig.icon;
          return (
            <Card
              key={alert.id}
              className={cn("bg-zinc-900 border-zinc-800 transition-opacity", !alert.active && "opacity-60")}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("p-1.5 rounded-lg", typeConfig.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded", typeConfig.color)}>
                      {typeConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alert.active}
                      onCheckedChange={() => toggleAlert(alert.id)}
                      className="scale-75"
                    />
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400">
                  {alert.config.thresholdUsd && (
                    <p>Threshold: <span className="text-white">{formatUSD(alert.config.thresholdUsd)}</span></p>
                  )}
                  {alert.config.chain && (
                    <p>Chain: <span className="text-white capitalize">{alert.config.chain}</span></p>
                  )}
                  {alert.config.token && (
                    <p>Token: <span className="text-white">{alert.config.token}</span></p>
                  )}
                  {alert.config.walletAddress && (
                    <p>Wallet: <span className="text-white font-mono">{alert.config.walletAddress.slice(0, 10)}...</span></p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {alert.deliveryMethod.map((m) => (
                      <Badge key={m} variant="outline" className="border-zinc-700 text-zinc-500 text-xs py-0">
                        {m === "in_app" ? "In-App" : m}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-right text-xs text-zinc-500 shrink-0 ml-2">
                    <p>{alert.triggerCount} triggers</p>
                    {alert.lastTriggeredAt && (
                      <p>{timeAgo(alert.lastTriggeredAt)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert history */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Alert History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-500 text-xs">Type</TableHead>
                  <TableHead className="text-zinc-500 text-xs">Description</TableHead>
                  <TableHead className="text-zinc-500 text-xs">Chain</TableHead>
                  <TableHead className="text-zinc-500 text-xs">Triggered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ALERT_HISTORY.map((entry) => {
                  const typeConfig = ALERT_TYPE_CONFIG[entry.type];
                  return (
                    <TableRow key={entry.id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell>
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", typeConfig.color)}>
                          {typeConfig.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-300 max-w-xs">
                        {entry.description}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-400 capitalize">
                        {entry.chain}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {timeAgo(entry.triggeredAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
