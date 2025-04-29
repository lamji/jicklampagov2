/** @format */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContentEditableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

const ContentEditable = React.forwardRef<HTMLDivElement, ContentEditableProps>(
  ({ className, value, onValueChange, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      onValueChange?.(target.innerText);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    return (
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        onInput={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        className={cn(
          "min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "placeholder:text-muted-foreground",
          !value &&
            !isFocused &&
            "before:content-[attr(data-placeholder)] before:text-muted-foreground",
          className
        )}
        data-placeholder={placeholder}
        {...props}
      />
    );
  }
);
ContentEditable.displayName = "ContentEditable";

export { ContentEditable };
