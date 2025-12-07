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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CouponType = "percent" | "fixed";

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  maxUsage: number;
  used: number;
  expiresAt: string;
  active: boolean;
};

type Props = {
  data: Coupon[];
};

export function CouponsTable({ data }: Props) {
  const [rows, setRows] = React.useState<Coupon[]>(data);

  React.useEffect(() => setRows(data), [data]);

  const columns = React.useMemo<ColumnDef<Coupon>[]>(
    () => [
      {
        accessorKey: "code",
        header: "کد",
        cell: ({ row }) => (
          <Input
            className="h-8 bg-muted/50 font-mono text-xs"
            value={row.original.code}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((c) =>
                  c.id === row.original.id
                    ? { ...c, code: e.target.value }
                    : c
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
                prev.map((c) =>
                  c.id === row.original.id
                    ? { ...c, type: value as CouponType }
                    : c
                )
              )
            }
          >
            <SelectTrigger className="h-8 bg-muted/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">درصدی (%)</SelectItem>
              <SelectItem value="fixed">مبلغ ثابت ($)</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "value",
        header: "مقدار",
        cell: ({ row }) => (
          <Input
            className="h-8 bg-muted/50 text-right"
            type="number"
            value={row.original.value}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((c) =>
                  c.id === row.original.id
                    ? { ...c, value: Number(e.target.value) || 0 }
                    : c
                )
              )
            }
          />
        ),
      },
      {
        accessorKey: "usage",
        header: "مصرف / سقف",
        cell: ({ row }) => (
          <span className="text-xs text-gray-700">
            {row.original.used} / {row.original.maxUsage}
          </span>
        ),
      },
      {
        accessorKey: "expiresAt",
        header: "تاریخ انقضا",
        cell: ({ getValue }) => (
          <span className="text-xs text-gray-500">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "active",
        header: "وضعیت",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-600">
              {row.original.active ? "فعال" : "غیرفعال"}
            </span>
            <Switch
              checked={row.original.active}
              onCheckedChange={(checked) =>
                setRows((prev) =>
                  prev.map((c) =>
                    c.id === row.original.id
                      ? { ...c, active: checked }
                      : c
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

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="rounded-2xl shadow-soft border border-border/80 bg-surface">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">
            مدیریت کدهای تخفیف
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            ایجاد و مدیریت کدهای تخفیف درصدی و مبلغ ثابت.
          </p>
        </div>
        <Button className="bg-primary text-accent-50">
          ایجاد کد تخفیف جدید
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/80 bg-white overflow-hidden">
          <Table dir="rtl">
            <TableHeader className="bg-muted/70">
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="border-b border-border/60"
                >
                  {hg.headers.map((header) => (
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
                    کدی یافت نشد.
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
