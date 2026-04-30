// src/components/ui/toggle-group.tsx
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ---- Context ---------------------------------------------------
type ToggleGroupContextValue =
  | {
      type: "single";
      value: string | undefined;
      onChange: (v: string) => void;
      size?: "sm" | "md";
    }
  | {
      type: "multiple";
      value: string[];
      onChange: (v: string) => void;
      size?: "sm" | "md";
    };

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroup() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleGroup.Item must be used inside ToggleGroup");
  return ctx;
}

// ---- Root component --------------------------------------------
type SingleProps = {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};
type MultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type ToggleGroupProps = (SingleProps | MultipleProps) &
  Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
    size?: "sm" | "md";
  };

const ToggleGroupRoot = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, size = "md", children, ...rest }, ref) => {
    const { type } = rest;

    // Controlled / uncontrolled handled here for both modes
    const [internalSingle, setInternalSingle] = useState<string | undefined>(
      type === "single" ? rest.defaultValue : undefined,
    );
    const [internalMulti, setInternalMulti] = useState<string[]>(
      type === "multiple" ? (rest.defaultValue ?? []) : [],
    );

    const isControlled = rest.value !== undefined;

    let contextValue: ToggleGroupContextValue;

    if (type === "single") {
      const current = isControlled ? rest.value : internalSingle;
      const handleChange = (next: string) => {
        // Toggle off if clicking the active one
        const resolved = current === next ? undefined : next;
        if (!isControlled) setInternalSingle(resolved);
        rest.onValueChange?.(resolved as string);
      };
      contextValue = {
        type: "single",
        value: current,
        onChange: handleChange,
        size,
      };
    } else {
      const current = isControlled ? rest.value : internalMulti;
      const handleChange = (next: string) => {
        const exists = (current ?? []).includes(next);
        const resolved = exists
          ? (current ?? []).filter((v) => v !== next)
          : [...(current ?? []), next];
        if (!isControlled) setInternalMulti(resolved);
        rest.onValueChange?.(resolved);
      };
      contextValue = {
        type: "multiple",
        value: current ?? [],
        onChange: handleChange,
        size,
      };
    }

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role={type === "single" ? "radiogroup" : "group"}
          className={cn(
            "inline-flex items-center gap-1 rounded-md bg-surface-muted p-1",
            className,
          )}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);
ToggleGroupRoot.displayName = "ToggleGroup";

// ---- Item -----------------------------------------------------
const itemVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium " +
    "motion-safe:transition-colors focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-sm",
      },
      active: {
        true: "bg-surface text-ink shadow-sm",
        false: "text-ink-muted hover:text-ink",
      },
    },
    defaultVariants: { size: "md", active: false },
  },
);

interface ItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const ctx = useToggleGroup();
    const active =
      ctx.type === "single" ? ctx.value === value : ctx.value.includes(value);

    return (
      <button
        ref={ref}
        type="button"
        role={ctx.type === "single" ? "radio" : "checkbox"}
        aria-checked={active}
        data-state={active ? "on" : "off"}
        onClick={() => ctx.onChange(value)}
        className={cn(itemVariants({ size: ctx.size, active }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
ToggleGroupItem.displayName = "ToggleGroup.Item";

// ---- Compose --------------------------------------------------
export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});
