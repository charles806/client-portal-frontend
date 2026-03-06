import * as React from "react";

import { cn } from "./utils";
import { sanitizeValue } from "./sanitization";

function Input({ className, type, onChange, onBlur, ...props }: React.ComponentProps<"input">) {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Sanitize on blur to trim and clean up final value without interfering with typing
    e.target.value = sanitizeValue(e.target.value);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      onBlur={handleBlur}
      onChange={onChange}
      {...props}
    />
  );
}

export { Input };
