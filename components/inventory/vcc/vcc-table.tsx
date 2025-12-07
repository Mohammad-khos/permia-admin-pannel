/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  createVccColumns,
  type VccCard,
  type VccTableMeta,
} from "./vcc-columns";

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

type Props = {
  data: VccCard[];
  onAddSingle?: () => void;
  onAddBulkExcel?: () => void;
};

type StatusFilter = "all" | VccCard["status"];

export function VccInventoryTable({
  data,
  onAddSingle,
  onAddBulkExcel,
}: Props) {
  const [rows, setRows] = React.useState<VccCard[]>(data);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilter>("all");
  const [minBalance, setMinBalance] = React.useState<string>("");

  // sync با data بیرونی
  React.useEffect(() => {
    setRows(data);
  }, [data]);

  const columns = React.useMemo(() => createVccColumns(), []);

  // سرچ رو defer می‌کنیم تا UI موقع تایپ/کلیک Select سبک‌تر بشه
  const deferredGlobalFilter = React.useDeferredValue(globalFilter);

  // columnFilters رو memo می‌کنیم تا هر رندر آرایه جدید ساخته نشه
  const columnFilters = React.useMemo(
    () => [
      ...(statusFilter === "all"
        ? []
        : [{ id: "status", value: statusFilter }]),
      ...(minBalance
        ? [{ id: "balance", value: Number(minBalance) }]
        : []),
    ],
    [statusFilter, minBalance]
  );

  const table = useReactTable<VccCard>({
    data: rows,
    columns,
    state: {
      globalFilter: deferredGlobalFilter,
      columnFilters,
    },
    meta: {
      onStatusChange: (id, status) => {
        setRows((prev) =>
          prev.map((card) =>
            card.id === id ? { ...card, status } : card
          )
        );
      },
    } satisfies VccTableMeta,
    globalFilterFn: (row, _columnId, filterValue) => {
      const text = String(filterValue ?? "").toLowerCase();
      if (!text) return true;

      return (
        row.original.pan.toLowerCase().includes(text) ||
        row.original.provider.toLowerCase().includes(text)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Card className="rounded-2xl shadow-soft border border-border/80 bg-surface">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">
            انبار کارت‌های مجازی (VCC)
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            مشاهده، فیلتر و به‌روزرسانی وضعیت کارت‌های مجازی.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onAddSingle}
            className="bg-primary hover:bg-primary-500 text-white/95"
          >
            افزودن کارت تکی
          </Button>
          <Button variant="outline" onClick={onAddBulkExcel}>
            افزودن گروهی (Excel)
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* سرچ عمومی */}
          <Input
            placeholder="جستجو بر اساس PAN یا Provider..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="bg-white"
          />

          {/* فیلتر وضعیت */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (value === "all") setStatusFilter("all");
              else setStatusFilter(value as VccCard["status"]);
            }}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="فیلتر وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="Available">قابل استفاده</SelectItem>
              <SelectItem value="Used">مصرف‌شده</SelectItem>
              <SelectItem value="Expired">منقضی</SelectItem>
            </SelectContent>
          </Select>

          {/* حداقل موجودی */}
          <Input
            type="number"
            placeholder="حداقل موجودی ($)"
            value={minBalance}
            onChange={(e) => setMinBalance(e.target.value)}
            className="bg-white"
          />
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
                    نتیجه‌ای یافت نشد.
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
