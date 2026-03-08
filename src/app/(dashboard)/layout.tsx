"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import type { UserPlan } from "@/types";

const mockUser = {
  name: "Demo User",
  email: "demo@whalevault.io",
  subscriptionTier: "free" as UserPlan,
  image: null,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={mockUser}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          user={mockUser}
        />
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
