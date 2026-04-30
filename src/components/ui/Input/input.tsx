import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const inputVariants = cva("border-2 border-line rounded-md bg-surface", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
    },
    error: {
      true: "border-danger",
      false: "",
    },
    disabled: {
      true: "cursor-not-allowed opacity-90",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    error: false,
    disabled: false,
  },
});

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "disabled">,
    VariantProps<typeof inputVariants> {
  className?: string;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, isLoading, disabled, size, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ size, error }), className)}
        disabled={disabled || isLoading}
        aria-invalid={error ?? undefined}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
