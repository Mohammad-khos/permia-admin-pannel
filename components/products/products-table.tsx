"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type ProductType = "shared" | "private" | "vcc" | "manual";
export type ProductStatus = "Active" | "Hidden" | "OutOfStock";

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
};

type Props = {
  data: Product[];
};

const typeLabel: Record<ProductType, string> = {
  shared: "اکانت اشتراکی",
  private: "اکانت اختصاصی",
  vcc: "کارت VCC",
  manual: "محصول دستی",
};

const statusLabel: Record<ProductStatus, string> = {
  Active: "فعال",
  Hidden: "مخفی",
  OutOfStock: "ناموجود",
};

export function ProductsTable({ data }: Props) {
  const [rows, setRows] = React.useState<Product[]>(data);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => setRows(data), [data]);

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "نام محصول",
        cell: ({ row, getValue }) => (
          <Input
            className="h-8 bg-muted/50"
            value={row.original.name}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((p) =>
                  p.id === row.original.id
                    ? { ...p, name: e.target.value }
                    : p
                )
              )
            }
          />
        ),
      },
      {
        accessorKey: "type",
        header: "نوع",
        cell: ({ row }) => (
          <Select
            value={row.original.type}
            onValueChange={(value) =>
              setRows((prev) =>
                prev.map((p) =>
                  p.id === row.original.id
                    ? { ...p, type: value as ProductType }
                    : p
                )
              )
            }
          >
            <SelectTrigger className="h-8 bg-muted/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shared">اکانت اشتراکی</SelectItem>
              <SelectItem value="private">اکانت اختصاصی</SelectItem>
              <SelectItem value="vcc">کارت VCC</SelectItem>
              <SelectItem value="manual">محصول دستی</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "category",
        header: "دسته‌بندی",
        cell: ({ row }) => (
          <Input
            className="h-8 bg-muted/50"
            value={row.original.category}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((p) =>
                  p.id === row.original.id
                    ? { ...p, category: e.target.value }
                    : p
                )
              )
            }
          />
        ),
      },
      {
        accessorKey: "price",
        header: "قیمت ($)",
        cell: ({ row }) => (
          <Input
            className="h-8 bg-muted/50 text-right"
            type="number"
            value={row.original.price}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((p) =>
                  p.id === row.original.id
                    ? { ...p, price: Number(e.target.value) || 0 }
                    : p
                )
              )
            }
          />
        ),
      },
      {
        accessorKey: "stock",
        header: "موجودی",
        cell: ({ row }) => (
          <Input
            className="h-8 bg-muted/50 text-right"
            type="number"
            value={row.original.stock}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((p) =>
                  p.id === row.original.id
                    ? { ...p, stock: Number(e.target.value) || 0 }
                    : p
                )
              )
            }
          />
        ),
      },
      {
        accessorKey: "status",
        header: "وضعیت",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-600">
              {statusLabel[row.original.status]}
            </span>
            <Switch
              checked={row.original.status === "Active"}
              onCheckedChange={(checked) =>
                setRows((prev) =>
                  prev.map((p) =>
                    p.id === row.original.id
                      ? {
                          ...p,
                          status: checked ? "Active" : "Hidden",
                        }
                      : p
                  )
                )
              }
            />
          </div>
        ),
      },
    ],
    []
  );

  const filteredRows = React.useMemo(
    () =>
      rows.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search]
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="rounded-2xl shadow-soft border border-border/80 bg-surface">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">
            مدیریت محصولات
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            ویرایش سریع نام، نوع، قیمت و موجودی محصولات.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="جستجو بر اساس نام یا دسته‌بندی..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white w-56"
          />
          <Button className="bg-primary text-accent-50">
            افزودن محصول
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/80 bg-white overflow-hidden">
          <Table dir="rtl">
            <TableHeader className="bg-muted/70">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border/60"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-right text-xs md:text-sm font-semibold text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-border/40 last:border-b-0 hover:bg-muted/60"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-right py-2 text-xs md:text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    محصولی یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
