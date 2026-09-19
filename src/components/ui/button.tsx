import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] font-body text-sm font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-[var(--duration-short)] ease-[var(--ease-base)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Tactile press, CRED's NeoPOP physics: a hard zero-blur ledge in
           the darker lime sits under the face, the hover raises it, and the
           press drives the face down into the ledge until they are flush.
           Zero blur is the whole point — a soft shadow reads as a floating
           card, a hard one reads as a physical key with a side wall. This is
           an affordance, not a new elevation tier: --elev still owns depth
           for cards and panels. */
        primary:
          "bg-lime text-lime-ink shadow-[0_3px_0_0_var(--color-lime-active)] hover:-translate-y-0.5 hover:bg-lime-dark hover:shadow-[0_5px_0_0_var(--color-lime-active)] active:translate-y-[3px] active:bg-lime-active active:shadow-[0_0_0_0_var(--color-lime-active)]",
        /* Secondary and ghost keep the plain lift: the tactile ledge is
           reserved for the one primary action, or it stops meaning anything. */
        secondary:
          "bg-transparent text-orange border border-orange hover:-translate-y-0.5 hover:bg-orange/10",
        ghost:
          "bg-transparent text-pearl hover:-translate-y-0.5 hover:bg-obsidian-lighter",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
