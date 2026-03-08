"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserPlan } from "@/types";

interface HeaderProps {
  onMenuClick: () => void;
  user: {
    name: string;
    email: string;
    subscriptionTier: UserPlan;
    image?: string | null;
  };
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/tracker": "Whale Tracker",
  "/dashboard/watchlist": "Watchlist",
  "/dashboard/analytics": "Analytics",
  "/dashboard/alerts": "Alerts",
  "/dashboard/execute": "Trade Execute",
  "/dashboard/api-keys": "API Keys",
  "/dashboard/settings": "Settings",
  "/dashboard/admin": "Admin",
};

export function Header({ onMenuClick, user }: HeaderProps) {
  const pathname = usePathname();

  const pageTitle =
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Dashboard";

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-white">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-blue-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-800 transition-colors outline-none">
              <Avatar className="h-7 w-7">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm text-zinc-300 max-w-[120px] truncate">
                {user.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-900 border-zinc-800 text-zinc-200 w-48"
          >
            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              className="hover:bg-zinc-800 cursor-pointer text-red-400"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
