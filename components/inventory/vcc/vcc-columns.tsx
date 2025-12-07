"use client";

import * as React from "react";
import {
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type VccStatus = "Available" | "Used" | "Expired";

export type VccCard = {
  id: string;
  pan: string;
  expiry: string;
  cvv: string;
  balance: number;
  provider: "Brocard" | "Wise" | "Stripe" | string;
  status: VccStatus;
};

export type VccTableMeta = {
  onStatusChange?: (id: string, status: VccStatus) => void;
};

const statusMeta: Record<
  VccStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  Available: { label: "قابل استفاده", variant: "default" },
  Used: { label: "مصرف‌شده", variant: "secondary" },
  Expired: { label: "منقضی", variant: "destructive" },
};

const minBalanceFilter: FilterFn<VccCard> = (
  row,
  columnId,
  filterValue
) => {
  if (filterValue == null || filterValue === "") return true;

  const threshold = Number(filterValue as number | string);
  if (Number.isNaN(threshold)) return true;

  const value = (row.getValue<number>(columnId) ?? 0) as number;
  return value >= threshold;
};

/** سلول وضعیت به صورت memo جدا */
type StatusCellProps = {
  id: string;
  status: VccStatus;
  onStatusChange?: (id: string, status: VccStatus) => void;
};

const StatusCell: React.FC<StatusCellProps> = React.memo(
  ({ id, status, onStatusChange }) => {
    const currentMeta = statusMeta[status];

    const handleChange = (value: string) => {
      const next = value as VccStatus;
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
            <SelectItem value="Available">قابل استفاده</SelectItem>
            <SelectItem value="Used">مصرف‌شده</SelectItem>
            <SelectItem value="Expired">منقضی</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

StatusCell.displayName = "StatusCell";

export function createVccColumns(): ColumnDef<VccCard>[] {
  return [
    {
      accessorKey: "pan",
      header: "شماره کارت (PAN)",
      cell: ({ row }) => {
        const pan = row.original.pan;
        return (
          <div className="flex items-center justify-start gap-2">
            <span className="font-mono tracking-wider text-xs md:text-sm">
              {pan}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => {
                navigator.clipboard.writeText(pan);
                toast.success("شماره کارت کپی شد");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "expiry",
      header: "تاریخ انقضا",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs md:text-sm">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "cvv",
      header: "CVV",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs md:text-sm">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "balance",
      header: "موجودی اولیه",
      filterFn: minBalanceFilter,
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <div className="text-right font-medium">
            {v.toLocaleString("fa-IR")} $
          </div>
        );
      },
    },
    {
      accessorKey: "provider",
      header: "صادرکننده",
      cell: ({ getValue }) => (
        <span className="text-gray-700 text-xs md:text-sm">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      cell: ({ row, table }) => {
        const meta = table.options.meta as VccTableMeta | undefined;
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
