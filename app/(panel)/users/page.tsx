import { UsersTable, type User } from "@/components/users/users-table";
import { BroadcastForm } from "@/components/users/broadcast-form";

const mockUsers: User[] = [
  {
    id: "1",
    fullName: "علی رضایی",
    email: "ali.rezaei@example.com",
    phone: "09123456789",
    totalOrders: 5,
    totalSpent: 120,
    status: "Active",
    role: "customer",
    createdAt: "1403/01/10",
  },
  {
    id: "2",
    fullName: "مریم احمدی",
    email: "maryam.ahmadi@example.com",
    phone: "09351234567",
    totalOrders: 12,
    totalSpent: 520,
    status: "Active",
    role: "customer",
    createdAt: "1403/02/05",
  },
  {
    id: "3",
    fullName: "حسین موسوی",
    email: "hossein.mousavi@example.com",
    phone: "09201112233",
    totalOrders: 2,
    totalSpent: 45,
    status: "Suspended",
    role: "customer",
    createdAt: "1403/03/20",
  },
  {
    id: "4",
    fullName: "ادمین اصلی",
    email: "admin@permia.ai",
    phone: "09120000000",
    totalOrders: 0,
    totalSpent: 0,
    status: "Active",
    role: "admin",
    createdAt: "1402/12/01",
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-4">
      {/* پیام همگانی بالا */}
      <BroadcastForm defaultAudience="all" />

      {/* جدول کاربران */}
      <UsersTable data={mockUsers} />
    </div>
  );
}
