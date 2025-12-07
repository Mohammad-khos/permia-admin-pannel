"use client";

import * as React from "react";
import {
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SharedAccountStatus = "Active" | "Limited" | "Disabled";

export type SharedAccount = {
  id: string;
  service: string; // ChatGPT, Claude, ...
  email: string;
  password: string;
  maxSlots: number;
  usedSlots: number;
  status: SharedAccountStatus;
};

export type SharedAccountTableMeta = {
  onStatusChange?: (id: string, status: SharedAccountStatus) => void;
};

const statusMeta: Record<
  SharedAccountStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  Active: { label: "فعال", variant: "default" },
  Limited: { label: "ظرفیت محدود", variant: "secondary" },
  Disabled: { label: "غیرفعال", variant: "destructive" },
};

const capacityFilter: FilterFn<SharedAccount> = (row, _id, filterValue) => {
  if (!filterValue || filterValue === "all") return true;
  const value = row.original.usedSlots / row.original.maxSlots;
  if (filterValue === "low") return value <= 0.5; // ظرفیت آزاد زیاد
  if (filterValue === "high") return value >= 0.9; // تقریبا پر
  return true;
};

export type CapacityFilterValue = "all" | "low" | "high";

/**
 * سلکت وضعیت به صورت کامپوننت جدا + memo
 * تا فقط وقتی status یا id عوض شد رندر شود.
 */
type StatusCellProps = {
  id: string;
  status: SharedAccountStatus;
  onStatusChange?: (id: string, status: SharedAccountStatus) => void;
};

const StatusCell: React.FC<StatusCellProps> = React.memo(
  ({ id, status, onStatusChange }) => {
    const currentMeta = statusMeta[status];

    const handleChange = (value: string) => {
      const next = value as SharedAccountStatus;
      if (next !== status) {
        onStatusChange?.(id, next);
      }
    };

    return (
      <div className="flex items-center justify-end gap-2">
        <Badge
          variant={currentMeta.variant}
          className="hidden md:inline-flex"
        >
          {currentMeta.label}
        </Badge>
        <Select value={status} onValueChange={handleChange}>
          <SelectTrigger className="h-8 w-28 bg-muted border-border/70 text-xs">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="Active">فعال</SelectItem>
            <SelectItem value="Limited">ظرفیت محدود</SelectItem>
            <SelectItem value="Disabled">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

StatusCell.displayName = "StatusCell";

export function createSharedAccountColumns(): ColumnDef<SharedAccount>[] {
  return [
    {
      accessorKey: "service",
      header: "سرویس",
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-800">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "ایمیل",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs md:text-sm">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "password",
      header: "پسورد",
      cell: ({ row }) => {
        const password = row.original.password;
        return (
          <div className="flex items-center justify-end gap-2">
            <span className="font-mono text-xs tracking-wider">
              ••••••••
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => {
                navigator.clipboard.writeText(password);
                toast.success("پسورد کپی شد");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: "ظرفیت",
      filterFn: capacityFilter,
      cell: ({ row }) => {
        const { maxSlots, usedSlots } = row.original;
        const percent = Math.round((usedSlots / maxSlots) * 100);

        return (
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500">
              {usedSlots} / {maxSlots} کاربر
            </span>
            <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      cell: ({ row, table }) => {
        const meta = table.options.meta as SharedAccountTableMeta | undefined;
        return (
          <StatusCell
            id={row.original.id}
            status={row.original.status}
            onStatusChange={meta?.onStatusChange}
          />
        );
      },
    },
  ];
}
