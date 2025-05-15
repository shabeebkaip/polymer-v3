import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Extra Tailwind utilities that remove number-input spinners:
 *
 * [&::-webkit-inner-spin-button]:appearance-none       ← Chrome / Edge
 * [&::-webkit-outer-spin-button]:appearance-none
 * [-moz-appearance:textfield]                          ← Firefox
 */
const numberNoSpinner =
  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
        "transition-[color,box-shadow] outline-none md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        type === "number" && numberNoSpinner, // 👈 add the no-spinner utility
        className
      )}
      {...props}
    />
  );
}

export { Input };
