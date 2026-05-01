import { forwardRef } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import type { TabsRootProps, TabsListProps, TabsTriggerProps, TabsContentProps } from "./Tabs.types";

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Root
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  ),
);
TabsRoot.displayName = "Tabs.Root";

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.List
      ref={ref}
      className={cn(
        "flex border-b border-line",
        className,
      )}
      {...props}
    />
  ),
);
TabsList.displayName = "Tabs.List";

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        "relative px-4 py-2.5 text-sm font-medium text-ink-muted",
        "border-b-2 border-transparent -mb-px",
        "transition-colors duration-150",
        "hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-40",
        "data-[state=active]:text-ink data-[state=active]:border-accent",
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = "Tabs.Trigger";

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Content
      ref={ref}
      className={cn(
        "mt-4 text-sm text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
TabsContent.displayName = "Tabs.Content";

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
