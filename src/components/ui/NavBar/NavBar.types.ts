import type { ComponentPropsWithoutRef } from "react";

/**
 * Union type for valid navigation item identifiers.
 * Constrains selected prop and onSelect callback to valid values.
 */
export type NavItemId = "home" | "search" | "profile";

/**
 * Internal shape of a navigation item in the NavBar.
 */
export interface NavItem {
  id: NavItemId;
  label: string;
  icon: React.ReactNode;
}

/**
 * Props for the NavBar component.
 * Controlled mode only: parent must provide selected + onSelect.
 */
export interface NavBarProps extends ComponentPropsWithoutRef<"nav"> {
  /**
   * Currently selected/active navigation item identifier.
   * Determines which item displays the active/selected visual state.
   */
  selected: NavItemId;

  /**
   * Callback triggered when the user clicks a navigation item.
   * Called with the id of the clicked item.
   */
  onSelect: (id: NavItemId) => void;

  /**
   * Icon component or element to display for the Home navigation item.
   */
  homeIcon?: React.ReactNode;

  /**
   * Icon component or element to display for the Search navigation item.
   */
  searchIcon?: React.ReactNode;

  /**
   * Icon component or element to display for the Profile navigation item.
   */
  profileIcon?: React.ReactNode;

  /**
   * Optional custom aria-label for the entire NavBar nav element.
   * @default "Main navigation"
   */
  ariaLabel?: string;

  /**
   * Optional array of labels for the Home, Search, and Profile items.
   * Must be an array of exactly three strings: [homeLabel, searchLabel, profileLabel].
   * @default ["Home", "Search", "Profile"]
   */
  itemLabels?: [string, string, string];

  /**
   * Additional CSS classes to merge into the root nav container.
   * Merged last via cn(); consumer classes always win.
   */
  className?: string;
}
