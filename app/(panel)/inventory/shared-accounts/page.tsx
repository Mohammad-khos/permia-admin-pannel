"use client";
import { SharedAccountsTable } from "@/components/inventory/shared/shared-accounts-table";
import type { SharedAccount } from "@/components/inventory/shared/shared-accounts-columns";

const mockSharedAccounts: SharedAccount[] = [
  {
    id: "1",
    service: "ChatGPT Plus",
    email: "chatgpt-shared-01@permia.ai",
    password: "P@ssw0rd-01",
    maxSlots: 10,
    usedSlots: 7,
    status: "Active",
  },
  {
    id: "2",
    service: "Claude Pro",
    email: "claude-shared-01@permia.ai",
    password: "P@ssw0rd-02",
    maxSlots: 8,
    usedSlots: 8,
    status: "Limited",
  },
  {
    id: "3",
    service: "Midjourney",
    email: "midjourney-shared-01@permia.ai",
    password: "P@ssw0rd-03",
    maxSlots: 5,
    usedSlots: 2,
    status: "Active",
  },
  {
    id: "4",
    service: "Gemini Advanced",
    email: "gemini-shared-01@permia.ai",
    password: "P@ssw0rd-04",
    maxSlots: 6,
    usedSlots: 0,
    status: "Disabled",
  },
];

export default function SharedAccountsPage() {
  return (
    <div className="space-y-4">
      <SharedAccountsTable
        data={mockSharedAccounts}
        onAddAccount={() => {
          // TODO: بعداً اینجا Dialog برای افزودن اکانت جدید باز می‌کنیم
          console.log("add shared account");
        }}
      />
    </div>
  );
}
