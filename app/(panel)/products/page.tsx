import {
  ProductsTable,
  type Product,
} from "@/components/products/products-table";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "اکانت اشتراکی ChatGPT Plus",
    type: "shared",
    category: "ChatGPT",
    price: 15,
    stock: 20,
    status: "Active",
  },
  {
    id: "2",
    name: "اکانت اختصاصی Claude Pro",
    type: "private",
    category: "Claude",
    price: 30,
    stock: 5,
    status: "Active",
  },
  {
    id: "3",
    name: "کارت VCC 500 دلاری",
    type: "vcc",
    category: "VCC",
    price: 520,
    stock: 10,
    status: "Active",
  },
  {
    id: "4",
    name: "شارژ دستی OpenAI",
    type: "manual",
    category: "Custom",
    price: 5,
    stock: 0,
    status: "OutOfStock",
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <ProductsTable data={mockProducts} />
    </div>
  );
}
