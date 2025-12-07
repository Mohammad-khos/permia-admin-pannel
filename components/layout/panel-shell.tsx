"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function PanelShell({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex min-h-screen flex-row bg-gray-50">
      {/* سایدبار سمت راست (به‌خاطر RTL، اولین آیتم flex میاد سمت راست) */}
      <Sidebar collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* محتوای اصلی */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar collapsed={isSidebarCollapsed} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
