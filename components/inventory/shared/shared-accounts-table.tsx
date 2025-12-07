/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  createSharedAccountColumns,
  type SharedAccount,
  type CapacityFilterValue,
  type SharedAccountStatus,
  type SharedAccountTableMeta,
} from "./shared-accounts-columns";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: SharedAccount[];
  onAddAccount?: () => void;
};

type StatusFilter = "all" | SharedAccountStatus;

export function SharedAccountsTable({ data, onAddAccount }: Props) {
  const [rows, setRows] = React.useState<SharedAccount[]>(data);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilter>("all");
  const [capacityFilter, setCapacityFilter] =
    React.useState<CapacityFilterValue>("all");

  // اگر داده از بیرون عوض شد، جدول رو sync می‌کنیم
  React.useEffect(() => {
    setRows(data);
  }, [data]);

  // ستون‌ها فقط یک‌بار ساخته شوند
  const columns = React.useMemo(() => createSharedAccountColumns(), []);

  // سرچ را defer می‌کنیم که UI موقع تایپ یا کلیک Select قفل نشود
  const deferredGlobalFilter = React.useDeferredValue(globalFilter);

  // columnFilters را با useMemo می‌سازیم تا هر رندر آرایه جدید ساخته نشود
  const columnFilters = React.useMemo(
    () => [
      ...(statusFilter === "all"
        ? []
        : [{ id: "status", value: statusFilter }]),
      ...(capacityFilter === "all"
        ? []
        : [{ id: "capacity", value: capacityFilter }]),
    ],
    [statusFilter, capacityFilter]
  );

  const table = useReactTable<SharedAccount>({
    data: rows,
    columns,
    state: {
      globalFilter: deferredGlobalFilter,
      columnFilters,
    },
    meta: {
      onStatusChange: (id, status) => {
        setRows((prev) =>
          prev.map((acc) =>
            acc.id === id ? { ...acc, status } : acc
          )
        );
      },
    } satisfies SharedAccountTableMeta,
    globalFilterFn: (row, _columnId, filterValue) => {
      const text = String(filterValue ?? "").toLowerCase();
      if (!text) return true;

      return (
        row.original.service.toLowerCase().includes(text) ||
        row.original.email.toLowerCase().includes(text)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // این state فقط string سرچ را نگه می‌دارد
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Card className="rounded-2xl shadow-soft border border-border/80 bg-surface">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">
            انبار اکانت‌های اشتراکی
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            مدیریت ظرفیت و وضعیت اکانت‌های اشتراکی سرویس‌های مختلف.
          </p>
        </div>

        <Button
          className="bg-primary hover:bg-primary-500 text-white/95"
          onClick={onAddAccount}
        >
          افزودن اکانت جدید
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* سرچ */}
          <Input
            placeholder="جستجو بر اساس سرویس یا ایمیل..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="bg-white"
          />

          {/* فیلتر وضعیت */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (value === "all") {
                setStatusFilter("all");
              } else {
                setStatusFilter(value as SharedAccountStatus);
              }
            }}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="Active">فعال</SelectItem>
              <SelectItem value="Limited">ظرفیت محدود</SelectItem>
              <SelectItem value="Disabled">غیرفعال</SelectItem>
            </SelectContent>
          </Select>

          {/* فیلتر ظرفیت */}
          <Select
            value={capacityFilter}
            onValueChange={(value) =>
              setCapacityFilter(value as CapacityFilterValue)
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="فیلتر ظرفیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه ظرفیت‌ها</SelectItem>
              <SelectItem value="low">
                ظرفیت آزاد زیاد (&lt;= ۵۰٪)
              </SelectItem>
              <SelectItem value="high">
                تقریباً پر (&gt;= ۹۰٪)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* جدول */}
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
                      className="text-right font-semibold text-gray-700 text-xs md:text-sm"
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
                        className="text-right py-3 text-xs md:text-sm"
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
                    اکانتی یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
          <span>
            صفحه {table.getState().pagination.pageIndex + 1} از{" "}
            {table.getPageCount() || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              قبلی
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              بعدی
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
