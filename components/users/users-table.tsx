"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type UserStatus = "Active" | "Suspended" | "Banned";
export type UserRole = "admin" | "operator" | "customer";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
};

type Props = {
  data: User[];
};

type StatusFilter = "all" | UserStatus;
type RoleFilter = "all" | UserRole;

const statusLabel: Record<UserStatus, string> = {
  Active: "فعال",
  Suspended: "معلق",
  Banned: "مسدود",
};

const roleLabel: Record<UserRole, string> = {
  admin: "ادمین",
  operator: "اپراتور",
  customer: "مشتری",
};

export function UsersTable({ data }: Props) {
  const [rows, setRows] = React.useState<User[]>(data);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] =
    React.useState<RoleFilter>("all");

  React.useEffect(() => setRows(data), [data]);

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "نام کامل",
        cell: ({ row }) => (
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-xs md:text-sm font-medium text-gray-900">
              {row.original.fullName}
            </span>
            <span className="text-[11px] text-gray-500 font-mono">
              {row.original.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "شماره تماس",
        cell: ({ getValue }) => (
          <span className="text-xs md:text-sm font-mono">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "totalOrders",
        header: "تعداد سفارش",
        cell: ({ getValue }) => (
          <span className="text-xs md:text-sm">
            {getValue<number>().toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: "مجموع پرداخت ($)",
        cell: ({ getValue }) => (
          <span className="font-medium">
            {getValue<number>().toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "نقش",
        cell: ({ row }) => (
          <Select
            value={row.original.role}
            onValueChange={(value) =>
              setRows((prev) =>
                prev.map((u) =>
                  u.id === row.original.id
                    ? { ...u, role: value as UserRole }
                    : u
                )
              )
            }
          >
            <SelectTrigger className="h-8 bg-muted text-xs">
              <SelectValue placeholder="نقش" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="admin">ادمین</SelectItem>
              <SelectItem value="operator">اپراتور</SelectItem>
              <SelectItem value="customer">مشتری</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "status",
        header: "وضعیت",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Badge
              variant={
                row.original.status === "Active"
                  ? "default"
                  : row.original.status === "Suspended"
                  ? "secondary"
                  : "destructive"
              }
              className="hidden md:inline-flex"
            >
              {statusLabel[row.original.status]}
            </Badge>
            <Select
              value={row.original.status}
              onValueChange={(value) =>
                setRows((prev) =>
                  prev.map((u) =>
                    u.id === row.original.id
                      ? { ...u, status: value as UserStatus }
                      : u
                  )
                )
              }
            >
              <SelectTrigger className="h-8 w-28 bg-muted text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="Active">فعال</SelectItem>
                <SelectItem value="Suspended">معلق</SelectItem>
                <SelectItem value="Banned">مسدود</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      globalFilter: search,
      columnFilters: [
        ...(statusFilter === "all"
          ? []
          : [{ id: "status", value: statusFilter }]),
        ...(roleFilter === "all"
          ? []
          : [{ id: "role", value: roleFilter }]),
      ],
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue ?? "").toLowerCase();
      if (!q) return true;

      return (
        row.original.fullName.toLowerCase().includes(q) ||
        row.original.email.toLowerCase().includes(q) ||
        row.original.phone.toLowerCase().includes(q)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setSearch,
  });

  return (
    <Card className="rounded-2xl shadow-soft border border-border/80 bg-surface">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">
            مدیریت کاربران
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            مشاهده لیست کاربران، وضعیت و نقش آن‌ها.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="جستجو بر اساس نام، ایمیل یا شماره..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white w-56"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* فیلترهای بالا */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as StatusFilter)
              }
            >
              <SelectTrigger className="bg-white h-9 w-40 text-xs">
                <SelectValue placeholder="همه وضعیت‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="Active">فعال</SelectItem>
                <SelectItem value="Suspended">معلق</SelectItem>
                <SelectItem value="Banned">مسدود</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={roleFilter}
              onValueChange={(v) =>
                setRoleFilter(v as RoleFilter)
              }
            >
              <SelectTrigger className="bg-white h-9 w-40 text-xs">
                <SelectValue placeholder="همه نقش‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه نقش‌ها</SelectItem>
                <SelectItem value="admin">ادمین</SelectItem>
                <SelectItem value="operator">اپراتور</SelectItem>
                <SelectItem value="customer">مشتری</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                    کاربری یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* pagination */}
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
