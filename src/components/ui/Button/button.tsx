import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium hover:opacity hover:cursor-pointer" +
    "hover:cursor-pointer" +
    "disabled:cursor-not-allowed disabled:opacity-10",
  {
    variants: {
      variant: {
        primary: "bg-accent text-surface",
        secondary: "border border-accent text-ink",
        tertiary: "bg-transparent text-ink border-none",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading,
      asChild,
      disabled,
      children,
      className,
      variant,
      size,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={isLoading}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
