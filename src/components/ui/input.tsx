import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Below the page plane: inputs recede, they don't float.
          "flex h-10 w-full rounded-[var(--radius-sm)] border border-charcoal-2 bg-obsidian-sunken px-3 py-2 text-sm text-pearl shadow-[var(--elev-sunken)] placeholder:text-pearl-muted transition-colors",
          "focus-visible:outline-none focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-error aria-invalid:ring-error/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
