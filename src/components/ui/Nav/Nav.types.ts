import type { HTMLAttributes } from "react";

export interface NavigationItem {
  /**
   * Unique identifier for the navigation item
   */
  id: string;

  /**
   * Display label for the navigation item
   */
  label: string;

  /**
   * Icon component (e.g., from lucide-react)
   */
  icon: React.ComponentType<{ className?: string }>;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * ARIA label for accessibility
   * @default undefined (falls back to label prop)
   */
  ariaLabel?: string;
}

export interface NavProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /**
   * Array of navigation items to display
   */
  items: NavigationItem[];

  /**
   * Currently selected item ID (controlled mode)
   */
  selected?: string;

  /**
   * Default selected item ID (uncontrolled mode)
   */
  defaultSelected?: string;

  /**
   * Callback fired when a navigation item is selected
   */
  onChange?: (itemId: string) => void;

  /**
   * Custom className to merge (merged last via cn())
   */
  className?: string;

  /**
   * Support for asChild pattern via Radix Slot
   */
  asChild?: boolean;
}
