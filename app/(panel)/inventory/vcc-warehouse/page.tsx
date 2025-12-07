"use client";
import { VccInventoryTable } from "@/components/inventory/vcc/vcc-table";
import type { VccCard } from "@/components/inventory/vcc/vcc-columns";

const mockVccCards: VccCard[] = [
  {
    id: "1",
    pan: "4111 1111 1111 1111",
    expiry: "12/27",
    cvv: "123",
    balance: 500,
    provider: "Brocard",
    status: "Available",
  },
  {
    id: "2",
    pan: "5500 0000 0000 0004",
    expiry: "08/26",
    cvv: "456",
    balance: 250,
    provider: "Wise",
    status: "Used",
  },
  {
    id: "3",
    pan: "4000 1234 5678 9010",
    expiry: "05/25",
    cvv: "789",
    balance: 1000,
    provider: "Brocard",
    status: "Expired",
  },
  {
    id: "4",
    pan: "4444 3333 2222 1111",
    expiry: "03/28",
    cvv: "321",
    balance: 750,
    provider: "Stripe",
    status: "Available",
  },
];

export default function VccWarehousePage() {
  return (
    <div className="space-y-4">
      <VccInventoryTable
        data={mockVccCards}
        onAddSingle={() => {
          console.log("add single VCC card");
        }}
        onAddBulkExcel={() => {
          console.log("add bulk VCC cards via Excel");
        }}
      />
    </div>
  );
}
