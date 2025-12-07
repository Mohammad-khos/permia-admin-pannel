import {
  CouponsTable,
  type Coupon,
} from "@/components/coupons/coupons-table";

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "PERMIA10",
    type: "percent",
    value: 10,
    maxUsage: 100,
    used: 25,
    expiresAt: "1403/10/01",
    active: true,
  },
  {
    id: "2",
    code: "WELCOME5",
    type: "fixed",
    value: 5,
    maxUsage: 50,
    used: 10,
    expiresAt: "1403/09/30",
    active: true,
  },
  {
    id: "3",
    code: "BLACKFRIDAY",
    type: "percent",
    value: 25,
    maxUsage: 200,
    used: 200,
    expiresAt: "1403/09/05",
    active: false,
  },
];

export default function CouponsPage() {
  return (
    <div className="space-y-4">
      <CouponsTable data={mockCoupons} />
    </div>
  );
}
