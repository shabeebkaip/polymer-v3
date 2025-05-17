import * as React from "react";
import { cn } from "@/lib/utils";

const numberNoSpinner =
  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

function Input({
  className,
  type = "text",
  error = false,
  helperText,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        data-slot="input"
        aria-invalid={error || undefined}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          type === "number" && numberNoSpinner,
          error
            ? "border-red-500 focus-visible:ring-red-300"
            : "border-input dark:bg-input/30",
          className
        )}
        {...props}
      />
      {error && helperText && (
        <p className="text-sm text-red-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

export { Input };
