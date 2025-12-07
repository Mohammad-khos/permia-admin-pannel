"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ❌ interface خالی
// export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// ✅ نسخه صحیح
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={cn(
          "flex min-h-[96px] w-full rounded-xl border border-border/70 bg-white px-3 py-2 text-xs md:text-sm text-gray-700 shadow-softer transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-60 resize-y",
          className
        )}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
