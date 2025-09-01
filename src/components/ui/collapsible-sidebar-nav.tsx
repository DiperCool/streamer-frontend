"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { SidebarNavItem } from "./sidebar" // Import SidebarNavItem

interface CollapsibleSidebarNavProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  active?: boolean; // Prop to indicate if any child is active
}

const CollapsibleSidebarNav: React.FC<CollapsibleSidebarNavProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
  active = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  // If any child is active, ensure the collapsible is open
  React.useEffect(() => {
    if (active) {
      setIsOpen(true);
    }
  }, [active]);

  return (
    <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsiblePrimitive.Trigger asChild>
        <SidebarNavItem
          icon={icon}
          className={cn(
            "w-full justify-between",
            active && "bg-gray-800 text-white" // Highlight parent if any child is active
          )}
        >
          <span className="flex items-center">
            {icon && <span className="mr-3 h-4 w-4 flex items-center justify-center">{icon}</span>}
            {title}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
        </SidebarNavItem>
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="pl-8 space-y-1">
          {children}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
};

export { CollapsibleSidebarNav };