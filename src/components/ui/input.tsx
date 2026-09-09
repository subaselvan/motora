import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-sm)] border border-obsidian-lighter bg-obsidian px-3 py-2 text-sm text-pearl placeholder:text-pearl-muted transition-colors",
          "focus-visible:outline-none focus-visible:border-orange focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
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
