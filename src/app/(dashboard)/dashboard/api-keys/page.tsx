"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MOCK_API_KEY = "wv_sk_a7f3b2c1d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2";

function maskKey(key: string): string {
  const prefix = key.slice(0, 6);
  return `${prefix}_${"•".repeat(32)}`;
}

const USAGE_STATS = {
  requestsToday: 1247,
  requestsTodayLimit: 10000,
  requestsMonth: 34521,
  requestsMonthLimit: 300000,
  rateLimit: 100,
};

const CODE_EXAMPLES = {
  curl: `curl -X GET "https://api.whalevault.io/v1/transactions" \\
  -H "Authorization: Bearer ${maskKey(MOCK_API_KEY)}" \\
  -H "Content-Type: application/json" \\
  --data '{"chain": "ethereum", "limit": 20}'`,

  javascript: `import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.whalevault.io/v1',
  headers: {
    'Authorization': \`Bearer \${process.env.WHALEVAULT_API_KEY}\`,
  },
});

// Get recent whale transactions
const { data } = await client.get('/transactions', {
  params: { chain: 'ethereum', limit: 20, minUsd: 100000 },
});

console.log(data.transactions);`,

  python: `import requests

WHALEVAULT_API_KEY = "your_api_key_here"

headers = {
    "Authorization": f"Bearer {WHALEVAULT_API_KEY}",
    "Content-Type": "application/json",
}

response = requests.get(
    "https://api.whalevault.io/v1/transactions",
    headers=headers,
    params={"chain": "ethereum", "limit": 20, "minUsd": 100000},
)

data = response.json()
print(data["transactions"])`,
};

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [apiKey, setApiKey] = useState(MOCK_API_KEY);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateKey = () => {
    const chars = "abcdef0123456789";
    const newKey =
      "wv_sk_" +
      Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setApiKey(newKey);
    setShowRegenerateDialog(false);
    setShowKey(false);
  };

  const todayPct = (USAGE_STATS.requestsToday / USAGE_STATS.requestsTodayLimit) * 100;
  const monthPct = (USAGE_STATS.requestsMonth / USAGE_STATS.requestsMonthLimit) * 100;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* API Key card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-base">Your API Key</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">
            Keep this secret. Rotate it if you suspect it has been compromised.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-zinc-800 rounded-lg font-mono text-sm border border-zinc-700">
            <span className="flex-1 text-zinc-300 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
              {showKey ? apiKey : maskKey(apiKey)}
            </span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="shrink-0 p-1.5 text-zinc-400 hover:text-white transition-colors"
              title={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 text-zinc-400 hover:text-white transition-colors"
              title="Copy key"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors border border-zinc-700">
                <RefreshCw className="h-4 w-4" />
                Generate New Key
              </button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle>Regenerate API Key?</DialogTitle>
              </DialogHeader>
              <p className="text-zinc-400 text-sm">
                This will invalidate your existing key immediately. Any integrations using the old
                key will stop working.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={regenerateKey}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Yes, regenerate
                </button>
                <button
                  onClick={() => setShowRegenerateDialog(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Usage stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs text-zinc-400">Requests Today</p>
            <p className="text-xl font-bold text-white">
              {USAGE_STATS.requestsToday.toLocaleString()}
              <span className="text-xs font-normal text-zinc-500 ml-1">
                / {USAGE_STATS.requestsTodayLimit.toLocaleString()}
              </span>
            </p>
            <Progress value={todayPct} className="h-1.5 bg-zinc-800" />
            <p className="text-xs text-zinc-500">{todayPct.toFixed(1)}% used</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs text-zinc-400">This Month</p>
            <p className="text-xl font-bold text-white">
              {USAGE_STATS.requestsMonth.toLocaleString()}
              <span className="text-xs font-normal text-zinc-500 ml-1">
                / {USAGE_STATS.requestsMonthLimit.toLocaleString()}
              </span>
            </p>
            <Progress value={monthPct} className="h-1.5 bg-zinc-800" />
            <p className="text-xs text-zinc-500">{monthPct.toFixed(1)}% used</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs text-zinc-400">Rate Limit</p>
            <p className="text-xl font-bold text-white">
              {USAGE_STATS.rateLimit}
              <span className="text-xs font-normal text-zinc-500 ml-1">req/min</span>
            </p>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full w-full bg-emerald-500 rounded-full" />
            </div>
            <p className="text-xs text-emerald-400">Healthy</p>
          </CardContent>
        </Card>
      </div>

      {/* Code examples */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base">Code Examples</CardTitle>
            <a
              href="/docs"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
            >
              Full API Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl">
            <TabsList className="bg-zinc-800 border border-zinc-700 mb-4">
              <TabsTrigger value="curl" className="data-[state=active]:bg-zinc-700 text-xs">
                cURL
              </TabsTrigger>
              <TabsTrigger value="javascript" className="data-[state=active]:bg-zinc-700 text-xs">
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="python" className="data-[state=active]:bg-zinc-700 text-xs">
                Python
              </TabsTrigger>
            </TabsList>
            {(["curl", "javascript", "python"] as const).map((lang) => (
              <TabsContent key={lang} value={lang}>
                <div className="relative">
                  <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                    <code>{CODE_EXAMPLES[lang]}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
