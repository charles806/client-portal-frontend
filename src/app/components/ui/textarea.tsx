import * as React from "react";

import { cn } from "./utils";
import { sanitizeValue } from "./sanitization";

function Textarea({ className, onBlur, ...props }: React.ComponentProps<"textarea">) {
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.value = sanitizeValue(e.target.value);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      onBlur={handleBlur}
      {...props}
    />
  );
}

export { Textarea };
