"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Endpoint {
  method: "GET" | "POST" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  exampleResponse: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/v1/transactions",
    description: "Fetch recent whale transactions with pagination and filtering.",
    auth: true,
    params: [
      { name: "page", type: "number", required: false, description: "Page number (default: 1)" },
      { name: "limit", type: "number", required: false, description: "Items per page, max 100 (default: 20)" },
      { name: "chain", type: "string", required: false, description: "Filter by chain: ethereum | bitcoin | solana | polygon | arbitrum | base" },
      { name: "min_amount", type: "number", required: false, description: "Minimum USD value (default: 100000)" },
    ],
    exampleResponse: `{
  "transactions": [
    {
      "id": "clx1...",
      "hash": "0xabc...",
      "chain": "ethereum",
      "fromAddress": "0xd8dA...",
      "toAddress": "0x28C6...",
      "token": "USDC",
      "amount": 2400000,
      "usdValue": 2400000,
      "timestamp": "2024-06-01T12:00:00Z",
      "type": "transfer"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}`,
  },
  {
    method: "GET",
    path: "/api/v1/transactions/:chain",
    description: "Fetch transactions filtered to a specific chain.",
    auth: false,
    params: [
      { name: "chain", type: "string", required: true, description: "Chain name (path param)" },
      { name: "page", type: "number", required: false, description: "Page number" },
      { name: "limit", type: "number", required: false, description: "Results per page" },
    ],
    exampleResponse: `{ "transactions": [...], "total": 42, "page": 1, "limit": 20, "chain": "solana" }`,
  },
  {
    method: "GET",
    path: "/api/v1/wallets/:address/activity",
    description: "Get full activity history for a whale wallet address.",
    auth: false,
    params: [
      { name: "address", type: "string", required: true, description: "Wallet address (path param)" },
      { name: "chain", type: "string", required: false, description: "Chain context (default: ethereum)" },
      { name: "limit", type: "number", required: false, description: "Max transactions to return" },
    ],
    exampleResponse: `{
  "wallet": {
    "address": "0xd8dA...",
    "chain": "ethereum",
    "totalVolumeUsd": 14200000,
    "transactionCount": 48,
    "lastActive": "2024-06-01T10:30:00Z",
    "topTokens": [...],
    "recentTransactions": [...]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/analytics/top-tokens",
    description: "Get top tokens by whale trading volume.",
    auth: false,
    params: [
      { name: "period", type: "string", required: false, description: "Time window: 24h | 7d | 30d (default: 24h)" },
    ],
    exampleResponse: `{
  "tokens": [
    { "token": "ETH", "chain": "ethereum", "usdVolume": 820000000, "change24h": 4.2, "sentiment": "bullish" }
  ],
  "period": "24h"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/analytics/sentiment",
    description: "Get current market sentiment score driven by whale activity.",
    auth: false,
    params: [],
    exampleResponse: `{
  "score": 68,
  "label": "Bullish",
  "fearGreedIndex": 71,
  "dominantChain": "ethereum",
  "change24h": 3.5,
  "updatedAt": "2024-06-01T12:00:00Z"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/alerts",
    description: "List all alerts for the authenticated user.",
    auth: true,
    params: [],
    exampleResponse: `{ "alerts": [{ "id": "...", "type": "large_transaction", "active": true, ... }] }`,
  },
  {
    method: "POST",
    path: "/api/v1/alerts",
    description: "Create a new alert.",
    auth: true,
    params: [
      { name: "type", type: "string", required: true, description: "Alert type: large_transaction | wallet_activity | token_accumulation | price_impact | new_whale_wallet" },
      { name: "config", type: "object", required: true, description: "Alert configuration (thresholdUsd, walletAddress, chain, token, etc.)" },
      { name: "deliveryMethod", type: "string[]", required: false, description: "Delivery channels: email | telegram | webhook | in_app" },
    ],
    exampleResponse: `{ "alert": { "id": "clx2...", "type": "large_transaction", "active": true, "createdAt": "..." } }`,
  },
  {
    method: "DELETE",
    path: "/api/v1/alerts/:id",
    description: "Delete a specific alert by ID.",
    auth: true,
    params: [{ name: "id", type: "string", required: true, description: "Alert ID (path param)" }],
    exampleResponse: `{ "message": "Alert deleted." }`,
  },
];

const RATE_LIMITS = [
  { plan: "Free", requestsPerDay: "100", requestsPerMinute: "10" },
  { plan: "Pro", requestsPerDay: "5,000", requestsPerMinute: "100" },
  { plan: "Enterprise", requestsPerDay: "100,000", requestsPerMinute: "Unlimited" },
];

const methodColor: Record<string, string> = {
  GET: "bg-green-600",
  POST: "bg-blue-600",
  DELETE: "bg-red-600",
};

export default function DocsPage() {
  const [tryEndpoint, setTryEndpoint] = useState("/api/v1/analytics/sentiment");
  const [tryResult, setTryResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTry = async () => {
    setLoading(true);
    try {
      const res = await fetch(tryEndpoint);
      const data = await res.json();
      setTryResult(JSON.stringify(data, null, 2));
    } catch {
      setTryResult("Error: Could not fetch endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-white">API Documentation</h1>
          <p className="text-zinc-400 mt-2 text-lg">
            WhaleVault REST API — track whale movements, alerts, and market sentiment.
          </p>
        </div>

        {/* Authentication */}
        <section id="authentication" className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Authentication</h2>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 space-y-4">
              <p className="text-zinc-300">
                Authenticate by including your API key in the <code className="bg-zinc-800 px-1 rounded text-cyan-400">X-API-Key</code> header,
                or use a Bearer token from a session cookie.
              </p>
              <div className="bg-zinc-800 rounded-md p-4 font-mono text-sm text-green-400 overflow-x-auto">
                {`curl https://whalevault.io/api/v1/transactions \\
  -H "X-API-Key: YOUR_API_KEY"`}
              </div>
              <p className="text-zinc-400 text-sm">
                Retrieve your API key from <strong className="text-white">Dashboard → API Keys</strong>.
                Keep it secret — it grants access to your account.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Rate Limits</h2>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-700">
                    <th className="text-left py-2 pr-6">Plan</th>
                    <th className="text-left py-2 pr-6">Requests / Day</th>
                    <th className="text-left py-2">Requests / Minute</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {RATE_LIMITS.map((r) => (
                    <tr key={r.plan}>
                      <td className="py-2 pr-6 text-white font-medium">{r.plan}</td>
                      <td className="py-2 pr-6 text-zinc-300">{r.requestsPerDay}</td>
                      <td className="py-2 text-zinc-300">{r.requestsPerMinute}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* Endpoints */}
        <section id="endpoints" className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Endpoints</h2>
          {ENDPOINTS.map((ep) => (
            <Card key={`${ep.method}-${ep.path}`} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${methodColor[ep.method]}`}>
                    {ep.method}
                  </span>
                  <code className="text-cyan-400 font-mono text-sm">{ep.path}</code>
                  {ep.auth && (
                    <Badge variant="outline" className="text-xs border-yellow-600 text-yellow-400">
                      Auth required
                    </Badge>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mt-1">{ep.description}</p>
              </CardHeader>
              {ep.params && ep.params.length > 0 && (
                <CardContent className="pt-0 space-y-3">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Parameters</p>
                  <div className="space-y-1">
                    {ep.params.map((p) => (
                      <div key={p.name} className="flex items-start gap-2 text-sm">
                        <code className="text-green-400 font-mono min-w-[120px]">{p.name}</code>
                        <span className="text-zinc-500 min-w-[60px]">{p.type}</span>
                        <span className={p.required ? "text-red-400 min-w-[70px]" : "text-zinc-600 min-w-[70px]"}>
                          {p.required ? "required" : "optional"}
                        </span>
                        <span className="text-zinc-400">{p.description}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-3">Example Response</p>
                  <pre className="bg-zinc-800 rounded p-3 text-xs text-green-300 overflow-x-auto whitespace-pre-wrap">
                    {ep.exampleResponse}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </section>

        {/* Try It */}
        <section id="try" className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Try It</h2>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 space-y-4">
              <p className="text-zinc-400 text-sm">
                Test any GET endpoint directly from your browser (no auth required for public endpoints).
              </p>
              <div className="flex gap-2">
                <Input
                  value={tryEndpoint}
                  onChange={(e) => setTryEndpoint(e.target.value)}
                  className="font-mono text-sm bg-zinc-800 border-zinc-700 text-white flex-1"
                  placeholder="/api/v1/analytics/sentiment"
                />
                <Button onClick={handleTry} disabled={loading} className="shrink-0">
                  {loading ? "Loading…" : "Send"}
                </Button>
              </div>
              {tryResult && (
                <pre className="bg-zinc-800 rounded p-4 text-xs text-green-300 overflow-x-auto max-h-80 whitespace-pre-wrap">
                  {tryResult}
                </pre>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
