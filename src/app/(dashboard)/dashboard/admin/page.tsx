"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MockUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptionTier: string;
  createdAt: string;
  apiUsage: number;
}

const MOCK_USERS: MockUser[] = [
  { id: "1", email: "alice@example.com", name: "Alice", role: "user", subscriptionTier: "pro", createdAt: "2024-01-15", apiUsage: 4200 },
  { id: "2", email: "bob@example.com", name: "Bob", role: "user", subscriptionTier: "free", createdAt: "2024-02-10", apiUsage: 88 },
  { id: "3", email: "carol@example.com", name: "Carol", role: "admin", subscriptionTier: "enterprise", createdAt: "2023-11-01", apiUsage: 92000 },
  { id: "4", email: "dan@example.com", name: "Dan", role: "user", subscriptionTier: "pro", createdAt: "2024-03-05", apiUsage: 1900 },
  { id: "5", email: "eve@example.com", name: "Eve", role: "user", subscriptionTier: "free", createdAt: "2024-04-20", apiUsage: 12 },
];

const SYSTEM_HEALTH = [
  { name: "Database", status: "operational" },
  { name: "Redis", status: "operational" },
  { name: "Stripe API", status: "operational" },
  { name: "Blockchain API", status: process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? "demo" : "operational" },
];

const tierColor: Record<string, string> = {
  free: "bg-zinc-700 text-zinc-200",
  pro: "bg-blue-600 text-white",
  enterprise: "bg-purple-600 text-white",
};

const statusColor: Record<string, string> = {
  operational: "bg-green-500",
  demo: "bg-yellow-500",
  degraded: "bg-orange-500",
  down: "bg-red-500",
};

// Normally we'd check session server-side; using a simple role guard here via mock
const DEMO_ROLE = "admin"; // In production, read from session

export default function AdminPage() {
  const [isAdmin] = useState(DEMO_ROLE === "admin");

  // Stats derived from mock users
  const mrr =
    MOCK_USERS.reduce((sum, u) => {
      if (u.subscriptionTier === "pro") return sum + 49;
      if (u.subscriptionTier === "enterprise") return sum + 199;
      return sum;
    }, 0);

  const recentSignUps = [...MOCK_USERS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <div className="text-6xl">🚫</div>
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-zinc-400">You don&apos;t have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-zinc-400 text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">${mrr.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">+12% vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">2.4%</p>
            <p className="text-xs text-green-400 mt-1">-0.3% vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">New Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {MOCK_USERS.filter((u) => u.subscriptionTier !== "free").length}
            </p>
            <p className="text-xs text-zinc-400 mt-1">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-base">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SYSTEM_HEALTH.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${statusColor[s.status] ?? "bg-zinc-500"}`} />
                <span className="text-sm text-zinc-300">{s.name}</span>
                <span className="text-xs text-zinc-500 capitalize">{s.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sign-ups */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-base">Recent Sign-ups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSignUps.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{u.name ?? "Anonymous"}</p>
                  <p className="text-xs text-zinc-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[u.subscriptionTier] ?? ""}`}>
                    {u.subscriptionTier}
                  </span>
                  <span className="text-xs text-zinc-500">{u.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-800">
                  <th className="text-left py-2 pr-4">Email</th>
                  <th className="text-left py-2 pr-4">Plan</th>
                  <th className="text-left py-2 pr-4">API Usage</th>
                  <th className="text-left py-2 pr-4">Joined</th>
                  <th className="text-left py-2">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {MOCK_USERS.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2 pr-4 text-zinc-200">{u.email}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[u.subscriptionTier] ?? ""}`}>
                        {u.subscriptionTier}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-zinc-300">{u.apiUsage.toLocaleString()}</td>
                    <td className="py-2 pr-4 text-zinc-400">{u.createdAt}</td>
                    <td className="py-2">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                        {u.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
