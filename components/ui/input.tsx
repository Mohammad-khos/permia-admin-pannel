"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ❌ interface خالی → ESLint error
// export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// ✅ نسخه صحیح
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        {...props}
        className={cn(
          "flex h-9 w-full rounded-xl border border-border/70 bg-white px-3 text-xs md:text-sm text-gray-700 shadow-softer transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
