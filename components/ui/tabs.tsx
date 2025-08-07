"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  currentValue?: string; // Add prop to receive the current active tab value
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps // Use the new interface
>(({ className, children, currentValue, ...props }, ref) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Find the active tab based on data-state
    const activeTab = listRef.current?.querySelector("[data-state='active']");
    if (activeTab instanceof HTMLElement) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, [currentValue, children]); // Dependency changed to currentValue and children to trigger update on tab change or children change

  return (
    <TabsPrimitive.List
      ref={(node) => {
        // Assign both refs
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        "relative inline-flex h-10 items-center justify-start bg-gray-900 text-gray-400",
        className
      )}
      {...props}
    >
      {children}
      {/* Grey separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-700" />
      {/* Green animated indicator */}
      <div
        className="absolute bottom-0 h-[2px] bg-green-500 transition-all duration-300 ease-in-out"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "relative rounded-none text-white hover:text-white",
      "data-[state=active]:text-white",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }