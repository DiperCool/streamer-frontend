"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { DashboardControlsSidebar } from "@/src/components/dashboard/dashboard-controls-sidebar"
import useLocalStorage from "use-local-storage";
import { ChatSection } from "@/src/components/chat-section"; // Import ChatSection
import { useDashboard } from "@/src/contexts/DashboardContext"; // Import useDashboard
import { StreamPreviewWidget } from "@/src/components/dashboard/widgets/stream-preview-widget"; // Import StreamPreviewWidget
import { StreamInfoWidget } from "@/src/components/dashboard/widgets/stream-info-widget"; // Import StreamInfoWidget
import { SessionInfoWidget } from "@/src/components/dashboard/widgets/session-info-widget"; // Import SessionInfoWidget

const LOCAL_STORAGE_KEY_PREFIX = "dashboard_layout_";
const ACTIVE_WIDGETS_KEY_SUFFIX = "_active_widgets";

// Define an enum for widget types
export enum DashboardWidgetType {
  SessionInfo = "SessionInfo",
  StreamPreview = "StreamPreview",
  ActivityFeed = "ActivityFeed",
  Chat = "Chat",
  StreamInfo = "StreamInfo",
  ModActions = "ModActions",
}

// Default active widgets
const DEFAULT_ACTIVE_WIDGETS: DashboardWidgetType[] = [
  DashboardWidgetType.SessionInfo,
  DashboardWidgetType.StreamPreview,
  DashboardWidgetType.ActivityFeed,
  DashboardWidgetType.Chat,
  DashboardWidgetType.StreamInfo,
  DashboardWidgetType.ModActions,
];

export default function DashboardHomePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [isEditing, setIsEditing] = useState(false);
  const [activeWidgets, setActiveWidgets] = useLocalStorage<DashboardWidgetType[]>(
    LOCAL_STORAGE_KEY_PREFIX + username + ACTIVE_WIDGETS_KEY_SUFFIX,
    DEFAULT_ACTIVE_WIDGETS
  );
  const { activeStreamer } = useDashboard(); // Get activeStreamer from context

  // Helper to render widget content
  const renderWidgetContent = (widgetType: DashboardWidgetType) => {
    switch (widgetType) {
      case DashboardWidgetType.SessionInfo:
        return (
          <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-green-500" />
                <CardTitle className="text-white text-base">Session Info</CardTitle>
              </div>
            </CardHeader>
            <SessionInfoWidget />
          </Card>
        );
      case DashboardWidgetType.StreamPreview:
        return (
          <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
              <CardTitle className="text-white text-base">Stream Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <StreamPreviewWidget />
            </CardContent>
          </Card>
        );
      case DashboardWidgetType.ActivityFeed:
        return (
          <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
              <CardTitle className="text-white text-base">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center flex-col">
              Activity Feed content goes here.
            </CardContent>
          </Card>
        );
      case DashboardWidgetType.Chat:
        return (
          <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
              <CardTitle className="text-white text-base">Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 h-full flex flex-col"> 
                <ChatSection
                  streamerId={activeStreamer?.id ?? ""}
                  onScrollToBottom={() => { /* No-op for dashboard widget */ }}
                  hideCardWrapper={true}
                />
              </div>
            </CardContent>
          </Card>
        );
      case DashboardWidgetType.StreamInfo:
        return (
          <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
              <CardTitle className="text-white text-base">Stream Info</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <StreamInfoWidget />
            </CardContent>
          </Card>
        );
      case DashboardWidgetType.ModActions:
        return (
          <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
              <CardTitle className="text-white text-base">Mod Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center flex-col">
              Mod Actions content goes here.
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  // Define widget groups for dynamic rendering
  const leftColumnWidgetsOrder = [
    DashboardWidgetType.SessionInfo,
    DashboardWidgetType.StreamPreview,
    DashboardWidgetType.ActivityFeed,
  ];
  const topRightSectionWidgetsOrder = [
    DashboardWidgetType.Chat,
    DashboardWidgetType.StreamInfo,
  ];
  const bottomRightSectionWidget = DashboardWidgetType.ModActions; // Single widget for this section

  // Helper to render dynamic panels within a PanelGroup
  const renderDynamicPanels = (
    widgetsInGroup: DashboardWidgetType[],
    direction: "horizontal" | "vertical",
    autoSaveIdSuffix: string
  ) => {
    const visibleWidgetsInGroup = widgetsInGroup.filter((widget) =>
      activeWidgets.includes(widget)
    );

    if (visibleWidgetsInGroup.length === 0) {
      return null; // Render nothing if no widgets are active in this group
    }

    return (
      <PanelGroup direction={direction} className="h-full w-full" autoSaveId={LOCAL_STORAGE_KEY_PREFIX + username + autoSaveIdSuffix}>
        {visibleWidgetsInGroup.map((widgetType, index) => (
          <React.Fragment key={widgetType}>
            <Panel id={widgetType} defaultSize={100 / visibleWidgetsInGroup.length} minSize={10}>
              {renderWidgetContent(widgetType)}
            </Panel>
            {index < visibleWidgetsInGroup.length - 1 && (
              <PanelResizeHandle
                className={
                  direction === "horizontal"
                    ? "w-2 bg-gray-700 hover:bg-green-500 transition-colors"
                    : "h-2 bg-gray-700 hover:bg-green-500 transition-colors"
                }
                disabled={!isEditing}
              />
            )}
          </React.Fragment>
        ))}
      </PanelGroup>
    );
  };

  // Function to reset layout to default by clearing localStorage for all panel groups and active widgets
  const resetLayout = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the layout to default?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + username + "-main-horizontal");
      localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + username + "-left-vertical");
      localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + username + "-right-vertical");
      localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + username + "-top-right-horizontal");
      localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + username + ACTIVE_WIDGETS_KEY_SUFFIX); // Reset active widgets
      toast.success("Layout reset to default.");
      setIsEditing(false); // Exit edit mode after reset
      window.location.reload(); // Force a refresh to re-render with default sizes and widgets
    }
  }, [username]);

  // Save layout is now handled automatically by autoSaveId, this just shows a toast
  const saveLayout = useCallback(() => {
    toast.success("Layout saved successfully!");
    setIsEditing(false); // Exit edit mode after saving
  }, []);

  const handleUpdateWidgets = useCallback((newActiveWidgets: DashboardWidgetType[]) => {
    setActiveWidgets(newActiveWidgets);
    toast.success("Widgets updated successfully!");
  }, [setActiveWidgets]);

  // Determine if left column should be rendered
  const shouldRenderLeftColumn = leftColumnWidgetsOrder.some(widget => activeWidgets.includes(widget));
  // Determine if top-right section should be rendered
  const shouldRenderTopRightSection = topRightSectionWidgetsOrder.some(widget => activeWidgets.includes(widget));
  // Determine if bottom-right section (ModActions) should be rendered
  const shouldRenderBottomRightSection = activeWidgets.includes(bottomRightSectionWidget);
  // Determine if right column should be rendered at all
  const shouldRenderRightColumn = shouldRenderTopRightSection || shouldRenderBottomRightSection;

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pr-16">
        <h1 className="text-3xl font-bold text-white">Creator Dashboard for {username}</h1>
      </div>

      <div className="flex-1 overflow-x-auto lg:overflow-x-hidden">
        <div className="min-w-[1024px] h-full">
          <PanelGroup direction="horizontal" className="h-full w-full" autoSaveId={LOCAL_STORAGE_KEY_PREFIX + username + "-main-horizontal"}>
            {shouldRenderLeftColumn && (
              <Panel id="left-column" defaultSize={50} minSize={10} order={1}>
                {renderDynamicPanels(leftColumnWidgetsOrder, "vertical", "-left-vertical")}
              </Panel>
            )}

            {shouldRenderLeftColumn && shouldRenderRightColumn && (
              <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-green-500 transition-colors" disabled={!isEditing} />
            )}

            {shouldRenderRightColumn && (
              <Panel id="right-column" defaultSize={50} minSize={10} order={2}>
                <PanelGroup direction="vertical" className="h-full w-full" autoSaveId={LOCAL_STORAGE_KEY_PREFIX + username + "-right-vertical"}>
                  {shouldRenderTopRightSection && (
                    <Panel id="top-right-section" defaultSize={shouldRenderBottomRightSection ? 75 : 100} minSize={10} order={1}>
                      {renderDynamicPanels(topRightSectionWidgetsOrder, "horizontal", "-top-right-horizontal")}
                    </Panel>
                  )}

                  {shouldRenderTopRightSection && shouldRenderBottomRightSection && (
                    <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-green-500 transition-colors" disabled={!isEditing} />
                  )}

                  {shouldRenderBottomRightSection && (
                    <Panel id="modActions-1" defaultSize={shouldRenderTopRightSection ? 25 : 100} minSize={10} order={2}>
                      {renderWidgetContent(bottomRightSectionWidget)}
                    </Panel>
                  )}
                </PanelGroup>
              </Panel>
            )}
          </PanelGroup>
        </div>
      </div>

      <DashboardControlsSidebar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saveLayout={saveLayout}
        resetLayout={resetLayout}
        activeWidgets={activeWidgets}
        onUpdateWidgets={handleUpdateWidgets}
      />
    </div>
  );
}