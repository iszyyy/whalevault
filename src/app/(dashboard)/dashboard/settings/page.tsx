"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const PLAN_FEATURES = [
  { feature: "Wallet Watches", free: "3", pro: "50", enterprise: "Unlimited" },
  { feature: "Alerts per Day", free: "5", pro: "50", enterprise: "Unlimited" },
  { feature: "API Requests / Day", free: "10,000", pro: "100,000", enterprise: "1,000,000" },
  { feature: "Historical Data", free: "7 days", pro: "90 days", enterprise: "365 days" },
  { feature: "Exchange Connections", free: "—", pro: "2", enterprise: "Unlimited" },
  { feature: "Trade Execution", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Priority Support", free: "—", pro: "Email", enterprise: "Dedicated" },
];

export default function SettingsPage() {
  const [name, setName] = useState("Demo User");
  const [saved, setSaved] = useState(false);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [telegramAlerts, setTelegramAlerts] = useState(false);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);

  // Security form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Tabs defaultValue="profile">
        <TabsList className="bg-zinc-800 border border-zinc-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-700 text-xs">
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-zinc-700 text-xs">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-zinc-700 text-xs">
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-zinc-700 text-xs">
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-xs text-zinc-500">demo@whalevault.io</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Display Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Email Address</Label>
                <Input
                  value="demo@whalevault.io"
                  disabled
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-500 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-600">Email cannot be changed in demo mode.</p>
              </div>

              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Email Alerts",
                  desc: "Receive whale alert notifications via email",
                  value: emailAlerts,
                  onChange: setEmailAlerts,
                },
                {
                  label: "Telegram Alerts",
                  desc: "Connect to @WhaleVaultBot on Telegram for instant notifications",
                  value: telegramAlerts,
                  onChange: setTelegramAlerts,
                  extra: (
                    <a
                      href="https://t.me/WhaleVaultBot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 mt-1 block"
                    >
                      → Connect @WhaleVaultBot
                    </a>
                  ),
                },
                {
                  label: "In-App Notifications",
                  desc: "Show real-time notification badges in the dashboard",
                  value: inAppNotifs,
                  onChange: setInAppNotifs,
                },
                {
                  label: "Weekly Summary",
                  desc: "Receive a weekly digest of whale activity and market trends",
                  value: weeklySummary,
                  onChange: setWeeklySummary,
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                      {item.extra}
                    </div>
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onChange}
                      className="shrink-0 mt-0.5"
                    />
                  </div>
                  {idx < 3 && <Separator className="mt-4 bg-zinc-800" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="••••••••"
                />
              </div>
              {pwError && <p className="text-xs text-red-400">{pwError}</p>}
              {saved && !pwError && (
                <p className="text-xs text-emerald-400">Password updated successfully!</p>
              )}
              <button
                onClick={handleChangePassword}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Update Password
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm">Two-Factor Authentication</CardTitle>
                <Badge className="bg-zinc-700 text-zinc-400 text-xs">Coming Soon</Badge>
              </div>
              <CardDescription className="text-zinc-500 text-xs">
                Add an extra layer of security to your account with TOTP-based 2FA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                disabled
                className="px-5 py-2 bg-zinc-800 text-zinc-500 text-sm font-medium rounded-lg cursor-not-allowed"
              >
                Enable 2FA
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing tab */}
        <TabsContent value="billing" className="mt-4 space-y-4">
          {/* Current plan */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm">Current Plan</CardTitle>
                <Badge className="bg-zinc-700 text-zinc-300 text-xs">Free</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Wallet Watches", used: 2, limit: 3 },
                  { label: "Alerts", used: 2, limit: 5 },
                  { label: "API Requests (today)", used: 1247, limit: 10000 },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-800/60 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{item.label}</span>
                      <span className="text-white font-medium">
                        {item.used} / {item.limit}
                      </span>
                    </div>
                    <Progress
                      value={(item.used / item.limit) * 100}
                      className="h-1.5 bg-zinc-700"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan comparison */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Plan Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2 text-zinc-500 font-normal">Feature</th>
                      <th className="text-center py-2 text-zinc-400 font-medium">Free</th>
                      <th className="text-center py-2 text-blue-400 font-medium">Pro</th>
                      <th className="text-center py-2 text-purple-400 font-medium">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLAN_FEATURES.map((row) => (
                      <tr key={row.feature} className="border-b border-zinc-800/50">
                        <td className="py-2.5 text-zinc-400">{row.feature}</td>
                        <td className="py-2.5 text-center text-zinc-300">{row.free}</td>
                        <td className="py-2.5 text-center text-blue-300">{row.pro}</td>
                        <td className="py-2.5 text-center text-purple-300">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <a
                  href="/pricing"
                  className={cn(
                    "py-2.5 text-center text-sm font-semibold rounded-lg transition-colors",
                    "bg-blue-600 hover:bg-blue-500 text-white"
                  )}
                >
                  Upgrade to Pro
                </a>
                <a
                  href="/pricing"
                  className={cn(
                    "py-2.5 text-center text-sm font-semibold rounded-lg transition-colors",
                    "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                  )}
                >
                  Upgrade to Enterprise
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
