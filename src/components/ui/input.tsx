import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-border/60 bg-background px-3.5 py-2 text-sm",
          "transition-all duration-200",
          "placeholder:text-muted-foreground/60",
          "hover:border-border",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/20 focus-visible:border-burgundy/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
