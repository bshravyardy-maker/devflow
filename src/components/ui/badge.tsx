import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground border-border",
        success:
          "border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
        warning:
          "border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
        info:
          "border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
        purple:
          "border-purple-200 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
        neutral:
          "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
