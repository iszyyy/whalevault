"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Star,
  BarChart3,
  Bell,
  Zap,
  Key,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserPlan } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    subscriptionTier: UserPlan;
  };
}

const navSections = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/tracker", label: "Whale Tracker", icon: Activity },
      { href: "/dashboard/watchlist", label: "Watchlist", icon: Star },
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/dashboard/execute", label: "Trade Execute", icon: Zap },
      { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/admin", label: "Admin", icon: Shield },
    ],
  },
];

const PLAN_BADGE: Record<UserPlan, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-zinc-700 text-zinc-300" },
  pro: { label: "Pro", className: "bg-blue-500/20 text-blue-400" },
  enterprise: { label: "Enterprise", className: "bg-purple-500/20 text-purple-400" },
};

export function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname();

  const planBadge = PLAN_BADGE[user.subscriptionTier];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-40 transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🐋</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              WhaleVault
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="px-4 py-4 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
            <span
              className={cn(
                "shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full",
                planBadge.className
              )}
            >
              {planBadge.label}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
