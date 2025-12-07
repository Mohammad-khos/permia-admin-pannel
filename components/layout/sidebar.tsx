"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  CreditCard,
  ShoppingBag,
  ReceiptCent,
  Layers,
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "انبار و اکانت‌ها",
    href: "/inventory",
    icon: Boxes,
    children: [
      {
        label: "اکانت‌های اشتراکی",
        href: "/inventory/shared-accounts",
        icon: Layers,
      },
      {
        label: "انبار کارت‌های VCC",
        href: "/inventory/vcc-warehouse",
        icon: CreditCard,
      },
    ],
  },
    {
    label: "کاربران",          // 👈 آیتم جدید
    href: "/users",
    icon: Users,
  },
  {
    label: "محصولات",
    href: "/products",
    icon: ShoppingBag,
  },
  {
    label: "سفارشات",
    href: "/orders",
    icon: Boxes,
  },
  {
    label: "کدهای تخفیف",
    href: "/coupons",
    icon: ReceiptCent,
  },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "bg-white border-l border-border shadow-softer flex flex-col transition-[width] duration-200 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* هدر سایدبار */}
      <div className="h-16 flex items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            P
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">
                Permia Admin
              </span>
              <span className="text-xs text-gray-500">
                پنل مدیریت فروش اکانت
              </span>
            </div>
          )}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={onToggle}
          aria-label="تغییر اندازه سایدبار"
        >
          {/* چون سایدبار سمت راست است، جهت آیکن را برعکس در نظر می‌گیریم */}
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* ناوبری */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <div key={item.href} className="space-y-1">
              <Link
                href={
                  item.href === "/inventory" && item.children?.length
                    ? item.children[0].href
                    : item.href
                }
                className={cn(
                  "flex items-center rounded-xl px-2 py-2 text-sm transition",
                  collapsed ? "justify-center" : "justify-start gap-2",
                  active
                    ? "bg-primary/10 text-primary-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>

              {!collapsed && item.children && (
                <div className="pr-6 space-y-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition",
                          childActive
                            ? "bg-primary/10 text-primary-700 font-semibold"
                            : "text-gray-500 hover:bg-gray-50"
                        )}
                      >
                        {ChildIcon && (
                          <ChildIcon className="h-3 w-3 shrink-0" />
                        )}
                        <span className="truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* فوتر سایدبار */}
      <div className="border-t border-border p-3 text-[11px] text-gray-400 text-center">
        {!collapsed && "نسخه ۱.۰.۰ – Permia Core"}
        {collapsed && "v1.0"}
      </div>
    </aside>
  );
}
