import { forwardRef, useCallback, useMemo } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { NavBarProps, NavItemId, NavItem } from "./NavBar.types";

const navBarVariants = cva(
  "flex items-center justify-between gap-0 w-full bg-surface border-t border-line px-md py-md",
  {
    variants: {
      // Reserved for future variants
    },
    defaultVariants: {},
  },
);

const navItemVariants = cva(
  "flex flex-col items-center justify-center gap-xs px-sm py-sm rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
  {
    variants: {
      isActive: {
        true: "text-accent",
        false: "text-ink-muted hover:text-ink",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export const NavBar = forwardRef<HTMLNavElement, NavBarProps>(
  (
    {
      selected,
      onSelect,
      homeIcon,
      searchIcon,
      profileIcon,
      ariaLabel = "Main navigation",
      itemLabels = ["Home", "Search", "Profile"],
      className,
      ...props
    },
    ref,
  ) => {
    const items: NavItem[] = useMemo(
      () => [
        { id: "home", label: itemLabels[0], icon: homeIcon },
        { id: "search", label: itemLabels[1], icon: searchIcon },
        { id: "profile", label: itemLabels[2], icon: profileIcon },
      ],
      [itemLabels, homeIcon, searchIcon, profileIcon],
    );

    const handleItemClick = useCallback(
      (id: NavItemId) => {
        onSelect(id);
      },
      [onSelect],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLNavElement>) => {
        const currentIndex = items.findIndex((item) => item.id === selected);

        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault();
            if (currentIndex < items.length - 1) {
              handleItemClick(items[currentIndex + 1].id);
            } else {
              handleItemClick(items[0].id);
            }
            break;

          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault();
            if (currentIndex > 0) {
              handleItemClick(items[currentIndex - 1].id);
            } else {
              handleItemClick(items[items.length - 1].id);
            }
            break;

          case "Home":
            e.preventDefault();
            handleItemClick(items[0].id);
            break;

          case "End":
            e.preventDefault();
            handleItemClick(items[items.length - 1].id);
            break;

          default:
            break;
        }
      },
      [items, selected, handleItemClick],
    );

    return (
      <nav
        ref={ref}
        className={cn(navBarVariants(), className)}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {items.map((item) => {
          const isActive = selected === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(navItemVariants({ isActive }))}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${item.label}${isActive ? " (current)" : ""}`}
            >
              {item.icon && (
                <div className="flex items-center justify-center size-lg">
                  {item.icon}
                </div>
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  },
);

NavBar.displayName = "NavBar";
