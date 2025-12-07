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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type OrderStatus = "Pending" | "Paid" | "Completed";

export type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  createdAt: string;
  status: OrderStatus;
};

type Props = {
  data: Order[];
};

const statusLabel: Record<OrderStatus, string> = {
  Pending: "در انتظار پرداخت",
  Paid: "پرداخت شده",
  Completed: "تکمیل شده",
};

export function OrdersTable({ data }: Props) {
  const [rows, setRows] = React.useState<Order[]>(data);

  React.useEffect(() => setRows(data), [data]);

  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "شماره سفارش",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs md:text-sm">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "customer",
        header: "مشتری",
        cell: ({ getValue }) => (
          <span className="text-xs md:text-sm">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "product",
        header: "محصول",
        cell: ({ getValue }) => (
          <span className="text-xs md:text-sm">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: "مبلغ ($)",
        cell: ({ getValue }) => (
          <span className="font-medium">
            {getValue<number>().toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "تاریخ ثبت",
        cell: ({ getValue }) => (
          <span className="text-xs text-gray-500">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "وضعیت",
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            onValueChange={(value) =>
              setRows((prev) =>
                prev.map((o) =>
                  o.id === row.original.id
                    ? { ...o, status: value as OrderStatus }
                    : o
                )
              )
            }
          >
            <SelectTrigger className="h-8 bg-muted text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Pending">
                در انتظار پرداخت
              </SelectItem>
              <SelectItem value="Paid">پرداخت شده</SelectItem>
              <SelectItem value="Completed">
                تکمیل شده
              </SelectItem>
            </SelectContent>
          </Select>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="rounded-2xl shadow-soft border border-border/80 bg-surface">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          مدیریت سفارشات
        </CardTitle>
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
                    سفارشی یافت نشد.
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
