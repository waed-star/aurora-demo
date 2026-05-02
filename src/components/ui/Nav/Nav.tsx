import { forwardRef, useState, useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { NavProps } from "./Nav.types";

const navVariants = cva(
  "flex flex-row items-center justify-between gap-md bg-surface border-t border-line px-md py-sm w-full"
);

const navItemVariants = cva(
  "flex flex-col items-center gap-xs px-sm py-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      selected: {
        true: "text-accent",
        false: "text-ink-muted hover:text-ink",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
);

export const Nav = forwardRef<HTMLElement, NavProps>(
  (
    {
      items,
      selected: controlledSelected,
      defaultSelected,
      onChange,
      className,
      asChild,
      ...props
    },
    ref
  ) => {
    // Manage uncontrolled state
    const [uncontrolledSelected, setUncontrolledSelected] = useState(
      defaultSelected || items[0]?.id || ""
    );

    // Determine if component is controlled
    const isControlled = controlledSelected !== undefined;

    // Use controlled or uncontrolled selected value
    const selectedId = isControlled ? controlledSelected : uncontrolledSelected;

    // Handle item selection
    const handleSelect = (itemId: string) => {
      if (!isControlled) {
        setUncontrolledSelected(itemId);
      }
      onChange?.(itemId);
    };

    // Memoize item map for keyboard navigation
    const itemMap = useMemo(() => {
      const map = new Map<string, number>();
      items.forEach((item, index) => {
        map.set(item.id, index);
      });
      return map;
    }, [items]);

    // Handle keyboard navigation
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLElement>,
      currentItemId: string
    ) => {
      const currentIndex = itemMap.get(currentItemId);
      if (currentIndex === undefined) return;

      let nextIndex: number | undefined;

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex =
          currentIndex > 0
            ? currentIndex - 1
            : items.length - 1;
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex =
          currentIndex < items.length - 1
            ? currentIndex + 1
            : 0;
      }

      if (nextIndex !== undefined) {
        const nextItemId = items[nextIndex]?.id;
        if (nextItemId && !items[nextIndex]?.disabled) {
          handleSelect(nextItemId);
        }
      }
    };

    const Comp = asChild ? Slot : "nav";

    return (
      <Comp
        ref={ref}
        className={cn(navVariants(), className)}
        role={asChild ? undefined : "navigation"}
        {...props}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && handleSelect(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            className={cn(
              navItemVariants({
                selected: selectedId === item.id,
                disabled: item.disabled,
              })
            )}
            aria-current={selectedId === item.id ? "page" : undefined}
            aria-label={item.ariaLabel || item.label}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            tabIndex={selectedId === item.id ? 0 : -1}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </Comp>
    );
  }
);

Nav.displayName = "Nav";
