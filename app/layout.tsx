// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { QueryClientProviderWrapper } from "@/lib/query-client";

const dana = localFont({
  src: [
    { path: "../public/fonts/Dana-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Dana-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Dana-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-dana",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Permia Admin",
  description: "پنل مدیریت فروش اکانت هوش مصنوعی Permia",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={dana.variable}>
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
      </body>
    </html>
  );
}
