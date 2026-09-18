import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 font-body text-xs font-medium leading-none",
  {
    variants: {
      variant: {
        /** Earned trust: verified, RTO-registered, score. */
        trust: "bg-lime/12 text-lime",
        /** Urgency, mode tags, anything time- or choice-bound. */
        urgent: "bg-orange/12 text-orange",
        neutral: "bg-obsidian-lighter text-pearl-dim",
        /** Gated by trust score — reads as unavailable. */
        locked: "bg-obsidian-lighter text-pearl-muted",
        /** Outlined pills. Border on all four sides: a partial stroke reads
         *  as a stray rule, not as a pill. */
        "outline-trust": "border border-lime/45 bg-lime/8 text-lime",
        "outline-urgent": "border border-orange/45 bg-orange/8 text-orange",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
