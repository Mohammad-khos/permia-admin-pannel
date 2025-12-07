import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // بیس استایل: رادیوس نرم، ترنزیشن و فوکوس آبی
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // دکمه اصلی
        default:
          "bg-primary text-white/95 shadow-md hover:bg-primary-600 hover:shadow-lg",

        // دکمه خطرناک / حذف
        destructive:
          "bg-destructive text-white/95 shadow-md hover:bg-destructive/90",

        // دکمه حاشیه‌دار
        outline:
          "border border-border bg-surface text-gray-800 shadow-sm hover:bg-primary/5 hover:text-primary",

        // ثانویه نرم برای اکشن‌های فرعی
        secondary:
          "bg-muted text-gray-800 shadow-sm hover:bg-muted/80",

        // دکمه شبحی
        ghost:
          "text-primary hover:bg-primary/8 hover:text-primary-700",

        // لینک
        link:
          "text-primary hover:text-primary-700 underline underline-offset-4",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
