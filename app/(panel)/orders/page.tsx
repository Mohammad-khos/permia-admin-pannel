import {
  OrdersTable,
  type Order,
} from "@/components/orders/orders-table";

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "PM-1001",
    customer: "علی رضایی",
    product: "اکانت اشتراکی ChatGPT Plus",
    amount: 25,
    createdAt: "1403/09/10 14:32",
    status: "Pending",
  },
  {
    id: "2",
    orderNumber: "PM-1002",
    customer: "مریم احمدی",
    product: "کارت VCC 500 دلاری",
    amount: 520,
    createdAt: "1403/09/10 15:10",
    status: "Paid",
  },
  {
    id: "3",
    orderNumber: "PM-1003",
    customer: "حسین موسوی",
    product: "اکانت اختصاصی Claude Pro",
    amount: 30,
    createdAt: "1403/09/09 19:45",
    status: "Completed",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <OrdersTable data={mockOrders} />
    </div>
  );
}
