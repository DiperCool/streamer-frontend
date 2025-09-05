"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DashboardWidgetType } from "@/app/dashboard/[username]/page"; // Import the enum

interface ManageWidgetsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeWidgets: DashboardWidgetType[];
  onUpdateWidgets: (newActiveWidgets: DashboardWidgetType[]) => void;
}

export const ManageWidgetsDialog: React.FC<ManageWidgetsDialogProps> = ({
  isOpen,
  onOpenChange,
  activeWidgets,
  onUpdateWidgets,
}) => {
  const [localActiveWidgets, setLocalActiveWidgets] = useState<DashboardWidgetType[]>(activeWidgets);

  useEffect(() => {
    if (isOpen) {
      setLocalActiveWidgets(activeWidgets);
    }
  }, [isOpen, activeWidgets]);

  const handleToggleWidget = (widgetType: DashboardWidgetType, checked: boolean) => {
    setLocalActiveWidgets((prev) => {
      if (checked) {
        return [...prev, widgetType];
      } else {
        return prev.filter((w) => w !== widgetType);
      }
    });
  };

  const handleSave = () => {
    onUpdateWidgets(localActiveWidgets);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const allWidgetTypes = Object.values(DashboardWidgetType);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Manage Dashboard Widgets</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select which widgets you want to display on your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {allWidgetTypes.map((widgetType) => (
            <div key={widgetType} className="flex items-center justify-between">
              <Label htmlFor={`widget-${widgetType}`} className="text-gray-300">
                {widgetType.replace(/([A-Z])/g, ' $1').trim()} {/* Format enum name for display */}
              </Label>
              <Switch
                id={`widget-${widgetType}`}
                checked={localActiveWidgets.includes(widgetType)}
                onCheckedChange={(checked) => handleToggleWidget(widgetType, checked)}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};