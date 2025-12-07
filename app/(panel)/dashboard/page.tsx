"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stats = [
  { title: "فروش کل", value: "۱,۲۵۰,۰۰۰ $" },
  { title: "کاربران فعال", value: "۳,۴۸۰" },
  { title: "سفارشات باز", value: "۹۲" },
];

const salesData = Array.from({ length: 30 }).map((_, i) => ({
  day: `${i + 1}`,
  sales: Math.floor(200 + Math.random() * 800),
}));

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="rounded-2xl shadow-soft border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="mt-2 text-xs text-gray-500">به‌روزرسانی لحظه‌ای</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* نمودار فروش */}
      <Card className="rounded-2xl shadow-soft border border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold">فروش ۳۰ روز گذشته</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickMargin={8} />
              <YAxis tickMargin={8} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                strokeWidth={3}
                dot={false}
                stroke="#F9B233"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* آخرین تراکنش‌ها – بعداً وصل به API می‌کنیم */}
      <Card className="rounded-2xl shadow-soft border border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold">آخرین تراکنش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">
            این بخش بعداً در اتصال به API تراکنش‌ها تکمیل می‌شود.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

