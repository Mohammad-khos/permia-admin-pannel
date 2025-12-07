"use client";

import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type TopbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
};

export function Topbar({ collapsed, onToggleSidebar }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="border border-border rounded-full"
          onClick={onToggleSidebar}
          aria-label="باز و بسته کردن سایدبار"
        >
          <Menu className="h-4 w-4" />
        </Button>
        {!collapsed && (
          <span className="text-sm text-gray-500 hidden sm:inline">
            پنل مدیریت
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 w-64 text-sm"
            placeholder="جستجو در سفارشات، کاربران، تراکنش‌ها..."
          />
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-full border border-border h-9 w-9"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px]">م م</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}
