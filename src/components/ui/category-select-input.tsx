"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "@/lib/utils";
import { getMinioUrl } from "@/utils/utils";
import { CategoryDto } from "@/graphql/__generated__/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CategorySelectInputProps {
  categories: CategoryDto[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const CategorySelectInput = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  CategorySelectInputProps
>(({ categories, value, onValueChange, placeholder, className, error, ...props }, ref) => {
  const selectedCategory = categories.find(cat => cat.id === value);

  return (
    <div className="relative">
      <SelectPrimitive.Root
        value={value || ""}
        onValueChange={(val) => onValueChange(val === "" ? null : val)}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            "bg-gray-700 border-gray-600 text-white focus:border-green-500",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          <SelectPrimitive.Value placeholder={placeholder}>
            {selectedCategory ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6 rounded-md">
                  <AvatarImage src={getMinioUrl(selectedCategory.image)} alt={selectedCategory.title} />
                  <AvatarFallback className="bg-gray-600 text-white text-xs">
                    {selectedCategory.title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedCategory.title}</span>
              </div>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-gray-800 border-gray-700 text-white">
            <SelectPrimitive.Viewport className="p-1">
              {categories.map((category) => (
                <SelectPrimitive.Item
                  key={category.id}
                  value={category.id}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-green-600 hover:text-white"
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <ChevronDown className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6 rounded-md">
                      <AvatarImage src={getMinioUrl(category.image)} alt={category.title} />
                      <AvatarFallback className="bg-gray-600 text-white text-xs">
                        {category.title.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <SelectPrimitive.ItemText>{category.title}</SelectPrimitive.ItemText>
                  </div>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

CategorySelectInput.displayName = "CategorySelectInput";

export { CategorySelectInput };