"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, RotateCcw, Edit, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Re-define ContainerType here or import it if it's a shared type
type ContainerType = "chat" | "streamInfo" | "sessionInfo" | "streamPreview" | "activityFeed" | "modActions";

interface DashboardControlsSidebarProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  saveLayout: () => void;
  resetLayout: () => void;
  addContainer: (type: ContainerType) => void;
  getAvailableContainerTypes: () => ContainerType[];
}

export const DashboardControlsSidebar: React.FC<DashboardControlsSidebarProps> = ({
  isEditing,
  setIsEditing,
  saveLayout,
  resetLayout,
  addContainer,
  getAvailableContainerTypes,
}) => {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-2 p-2 bg-gray-800 border border-gray-700 rounded-l-lg shadow-lg">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(prev => !prev)}
        className="text-gray-300 hover:bg-gray-700 hover:text-white"
        title={isEditing ? "View Mode" : "Edit Mode"}
      >
        {isEditing ? <Eye className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
      </Button>

      {isEditing && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:bg-green-600 hover:text-white"
                title="Add Container"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-gray-800 border-gray-700 text-white">
              {getAvailableContainerTypes().length > 0 ? (
                getAvailableContainerTypes().map(type => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => addContainer(type)}
                    className="hover:bg-green-600 hover:text-white cursor-pointer"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  All containers added
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={saveLayout}
            className="text-gray-300 hover:bg-blue-600 hover:text-white"
            title="Save Layout"
          >
            <Save className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetLayout}
            className="text-gray-300 hover:bg-red-600 hover:text-white"
            title="Reset Layout"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
};