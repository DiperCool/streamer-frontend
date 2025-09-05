"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, RotateCcw, Edit, Eye } from "lucide-react" // Removed Plus, Trash2
import { toast } from "sonner"
import "react-grid-layout/css/styles.css" // Keep for now if other components use it, but not directly for this layout
import "react-resizable/css/styles.css" // Keep for now if other components use it, but not directly for this layout
import { DashboardControlsSidebar } from "@/src/components/dashboard/dashboard-controls-sidebar"

const LOCAL_STORAGE_KEY = "dashboard_layout_";

export default function DashboardHomePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [isEditing, setIsEditing] = useState(false);

  // Function to reset layout to default by clearing localStorage for all panel groups
  const resetLayout = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the layout to default?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY + username + "-main-horizontal");
      localStorage.removeItem(LOCAL_STORAGE_KEY + username + "-left-vertical");
      localStorage.removeItem(LOCAL_STORAGE_KEY + username + "-right-vertical");
      localStorage.removeItem(LOCAL_STORAGE_KEY + username + "-top-right-horizontal");
      toast.success("Layout reset to default.");
      setIsEditing(false); // Exit edit mode after reset
      // Force a refresh to re-render with default sizes
      window.location.reload();
    }
  }, [username]);

  // Save layout is now handled automatically by autoSaveId, this just shows a toast
  const saveLayout = useCallback(() => {
    toast.success("Layout saved successfully!");
    setIsEditing(false); // Exit edit mode after saving
  }, []);

  return (
    <div className="flex-1 p-4 relative h-screen-minus-navbar"> {/* Added h-screen-minus-navbar */}
      <div className="flex items-center justify-between mb-6 pr-16"> {/* Added pr-16 for sidebar */}
        <h1 className="text-3xl font-bold text-white">Creator Dashboard for {username}</h1>
      </div>

      <div className="h-[calc(100%-4rem)]"> {/* Container for PanelGroup to take remaining height */}
        <PanelGroup direction="horizontal" className="h-full w-full" autoSaveId={LOCAL_STORAGE_KEY + username + "-main-horizontal"}>
          {/* Left Column */}
          <Panel id="left-column" defaultSize={50} minSize={20}>
            <PanelGroup direction="vertical" className="h-full w-full" autoSaveId={LOCAL_STORAGE_KEY + username + "-left-vertical"}>
              <Panel id="sessionInfo-1" defaultSize={22} minSize={10}>
                <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
                    <CardTitle className="text-white text-base">Session Info</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
                    Session details go here.
                  </CardContent>
                </Card>
              </Panel>
              <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-green-500 transition-colors" disabled={!isEditing} />
              <Panel id="streamPreview-1" defaultSize={44} minSize={20}>
                <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
                    <CardTitle className="text-white text-base">Stream Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
                    Stream Preview content goes here.
                  </CardContent>
                </Card>
              </Panel>
              <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-green-500 transition-colors" disabled={!isEditing} />
              <Panel id="activityFeed-1" defaultSize={34} minSize={10}>
                <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
                    <CardTitle className="text-white text-base">Activity Feed</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
                    Activity Feed content goes here.
                  </CardContent>
                </Card>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-green-500 transition-colors" disabled={!isEditing} />

          {/* Right Column */}
          <Panel id="right-column" defaultSize={50} minSize={20}>
            <PanelGroup direction="vertical" className="h-full w-full" autoSaveId={LOCAL_STORAGE_KEY + username + "-right-vertical"}>
              <Panel id="top-right-section" defaultSize={75} minSize={30}>
                <PanelGroup direction="horizontal" className="h-full w-full" autoSaveId={LOCAL_STORAGE_KEY + username + "-top-right-horizontal"}>
                  <Panel id="chat-1" defaultSize={50} minSize={20}>
                    <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
                        <CardTitle className="text-white text-base">Chat</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
                        Chat content goes here.
                      </CardContent>
                    </Card>
                  </Panel>
                  <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-green-500 transition-colors" disabled={!isEditing} />
                  <Panel id="streamInfo-1" defaultSize={50} minSize={20}>
                    <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
                        <CardTitle className="text-white text-base">Stream Info</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
                        Stream information goes here.
                      </CardContent>
                    </Card>
                  </Panel>
                </PanelGroup>
              </Panel>
              <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-green-500 transition-colors" disabled={!isEditing} />
              <Panel id="modActions-1" defaultSize={25} minSize={10}>
                <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
                    <CardTitle className="text-white text-base">Mod Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
                    Mod Actions content goes here.
                  </CardContent>
                </Card>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      <DashboardControlsSidebar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saveLayout={saveLayout}
        resetLayout={resetLayout}
      />
    </div>
  );
}