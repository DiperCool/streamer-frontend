"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Edit, Eye, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardWidgetType } from "@/app/dashboard/[username]/page";
import { ManageWidgetsDialog } from "./manage-widgets-dialog";

interface DashboardControlsSidebarProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  saveLayout: () => void;
  resetLayout: () => void;
  activeWidgets: DashboardWidgetType[];
  onUpdateWidgets: (newActiveWidgets: DashboardWidgetType[]) => void;
}

export const DashboardControlsSidebar: React.FC<DashboardControlsSidebarProps> = ({
  isEditing,
  setIsEditing,
  saveLayout,
  resetLayout,
  activeWidgets,
  onUpdateWidgets,
}) => {
  const [isManageWidgetsDialogOpen, setIsManageWidgetsDialogOpen] = React.useState(false);
  const [isHovered, setIsHovered] = useState(false); // Новое состояние для отслеживания наведения курсора

  const handleToggleEditMode = () => {
    setIsEditing((prev) => !prev);
    // Сбрасываем состояние наведения, чтобы избежать нежелательных эффектов при переключении режима
    setIsHovered(false); 
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-2 p-2 bg-gray-800 border border-gray-700 rounded-l-lg shadow-lg transition-transform duration-300 ease-in-out",
        (isHovered || isEditing) ? "translate-x-0" : "translate-x-[90%]" // Применяем transform в зависимости от наведения или режима редактирования
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleEditMode}
        className="text-gray-300 hover:bg-gray-700 hover:text-white"
        title={isEditing ? "View Mode" : "Edit Mode"}
      >
        {isEditing ? <Eye className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
      </Button>

      {isEditing && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsManageWidgetsDialogOpen(true)}
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
            title="Manage Widgets"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
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

      <ManageWidgetsDialog
        isOpen={isManageWidgetsDialogOpen}
        onOpenChange={setIsManageWidgetsDialogOpen}
        activeWidgets={activeWidgets}
        onUpdateWidgets={onUpdateWidgets}
      />
    </div>
  );
};