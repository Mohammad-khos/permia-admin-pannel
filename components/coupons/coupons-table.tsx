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

/* ---------- سلول‌های ویرایشی جدا + memo ---------- */

type CodeCellProps = {
  id: string;
  code: string;
  onChange: (id: string, code: string) => void;
};

const CodeCell: React.FC<CodeCellProps> = React.memo(
  ({ id, code, onChange }) => {
    return (
      <Input
        className="h-8 bg-muted/50 font-mono text-xs"
        value={code}
        onChange={(e) => onChange(id, e.target.value)}
      />
    );
  }
);
CodeCell.displayName = "CodeCell";

type TypeCellProps = {
  id: string;
  type: CouponType;
  onChange: (id: string, type: CouponType) => void;
};

const TypeCell: React.FC<TypeCellProps> = React.memo(
  ({ id, type, onChange }) => {
    const handleChange = (value: string) => {
      const next = value as CouponType;
      if (next !== type) onChange(id, next);
    };

    return (
      <Select value={type} onValueChange={handleChange}>
        <SelectTrigger className="h-8 bg-muted/50 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="percent">درصدی (%)</SelectItem>
          <SelectItem value="fixed">مبلغ ثابت ($)</SelectItem>
        </SelectContent>
      </Select>
    );
  }
);
TypeCell.displayName = "TypeCell";

type ValueCellProps = {
  id: string;
  value: number;
  onChange: (id: string, value: number) => void;
  type: CouponType;
};

const ValueCell: React.FC<ValueCellProps> = React.memo(
  ({ id, value, onChange, type }) => {
    return (
      <div className="flex items-center justify-end gap-1">
        <Input
          className="h-8 bg-muted/50 text-right"
          type="number"
          value={value}
          onChange={(e) =>
            onChange(id, Number(e.target.value) || 0)
          }
        />
        <span className="text-[11px] text-gray-500">
          {type === "percent" ? "%" : "$"}
        </span>
      </div>
    );
  }
);
ValueCell.displayName = "ValueCell";

type ActiveCellProps = {
  id: string;
  active: boolean;
  onChange: (id: string, active: boolean) => void;
};

const ActiveCell: React.FC<ActiveCellProps> = React.memo(
  ({ id, active, onChange }) => {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-gray-600">
          {active ? "فعال" : "غیرفعال"}
        </span>
        <Switch
          checked={active}
          onCheckedChange={(checked) => onChange(id, checked)}
        />
      </div>
    );
  }
);
ActiveCell.displayName = "ActiveCell";

/* -------------------- جدول اصلی -------------------- */

export function CouponsTable({ data }: Props) {
  const [rows, setRows] = React.useState<Coupon[]>(data);

  React.useEffect(() => setRows(data), [data]);

  const handleCodeChange = React.useCallback(
    (id: string, code: string) => {
      setRows((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, code } : c
        )
      );
    },
    []
  );

  const handleTypeChange = React.useCallback(
    (id: string, type: CouponType) => {
      setRows((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, type } : c
        )
      );
    },
    []
  );

  const handleValueChange = React.useCallback(
    (id: string, value: number) => {
      setRows((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, value } : c
        )
      );
    },
    []
  );

  const handleActiveChange = React.useCallback(
    (id: string, active: boolean) => {
      setRows((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, active } : c
        )
      );
    },
    []
  );

  const columns = React.useMemo<ColumnDef<Coupon>[]>(
    () => [
      {
        accessorKey: "code",
        header: "کد",
        cell: ({ row }) => (
          <CodeCell
            id={row.original.id}
            code={row.original.code}
            onChange={handleCodeChange}
          />
        ),
      },
      {
        accessorKey: "type",
        header: "نوع",
        cell: ({ row }) => (
          <TypeCell
            id={row.original.id}
            type={row.original.type}
            onChange={handleTypeChange}
          />
        ),
      },
      {
        accessorKey: "value",
        header: "مقدار",
        cell: ({ row }) => (
          <ValueCell
            id={row.original.id}
            value={row.original.value}
            type={row.original.type}
            onChange={handleValueChange}
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
          <ActiveCell
            id={row.original.id}
            active={row.original.active}
            onChange={handleActiveChange}
          />
        ),
      },
    ],
    [handleCodeChange, handleTypeChange, handleValueChange, handleActiveChange]
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
        <Button className="bg-primary text-white/95">
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
