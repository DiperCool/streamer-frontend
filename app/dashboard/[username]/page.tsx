"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save, RotateCcw, Edit, Eye, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ResponsiveGridLayout = WidthProvider(Responsive)

// Define available container types
type ContainerType = "chat" | "streamInfo" | "sessionInfo";

interface DashboardItem {
  i: string; // Unique ID for the item (e.g., "chat-1", "streamInfo-1")
  x: number;
  y: number;
  w: number;
  h: number;
  type: ContainerType; // Type of the container
}

// Default layout for initial setup and reset
const DEFAULT_LAYOUT: DashboardItem[] = [
  { i: "chat-1", x: 0, y: 0, w: 4, h: 6, type: "chat" },
  { i: "streamInfo-1", x: 4, y: 0, w: 4, h: 3, type: "streamInfo" },
  { i: "sessionInfo-1", x: 4, y: 3, w: 4, h: 3, type: "sessionInfo" },
];

const LOCAL_STORAGE_KEY = "dashboard_layout_";

export default function DashboardHomePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [layout, setLayout] = useState<DashboardItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [nextId, setNextId] = useState(0); // To ensure unique IDs for new items

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY + username);
    if (savedLayout) {
      const parsedLayout: DashboardItem[] = JSON.parse(savedLayout);
      setLayout(parsedLayout);
      // Determine the next available ID based on existing items
      const maxId = parsedLayout.reduce((max, item) => {
        const num = parseInt(item.i.split('-')[1]);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      setNextId(maxId + 1);
    } else {
      setLayout(DEFAULT_LAYOUT);
      setNextId(DEFAULT_LAYOUT.length);
    }
  }, [username]);

  // Save layout to localStorage whenever it changes
  const saveLayout = useCallback(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + username, JSON.stringify(layout));
    toast.success("Layout saved successfully!");
    setIsEditing(false); // Exit edit mode after saving
  }, [layout, username]);

  // Handle layout changes (drag, resize)
  const onLayoutChange = useCallback((newLayout: any[]) => {
    // Merge new layout positions/sizes with existing item types
    const updatedLayout = layout.map(item => {
      const newLayoutItem = newLayout.find(l => l.i === item.i);
      return newLayoutItem ? { ...item, ...newLayoutItem } : item;
    });
    setLayout(updatedLayout);
  }, [layout]);

  // Add a new container
  const addContainer = useCallback((type: ContainerType) => {
    const newId = `${type}-${nextId}`;
    const newContainer: DashboardItem = {
      i: newId,
      x: (layout.length * 2) % 12, // Simple placement logic
      y: Infinity, // Puts it at the bottom
      w: 4,
      h: 3,
      type: type,
    };
    setLayout(prevLayout => [...prevLayout, newContainer]);
    setNextId(prevId => prevId + 1);
    toast.info(`Added ${type} container.`);
  }, [layout.length, nextId]);

  // Remove a container
  const removeContainer = useCallback((id: string) => {
    setLayout(prevLayout => prevLayout.filter(item => item.i !== id));
    toast.success("Container removed.");
  }, []);

  // Reset layout to default
  const resetLayout = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the layout to default?")) {
      setLayout(DEFAULT_LAYOUT);
      setNextId(DEFAULT_LAYOUT.length);
      localStorage.removeItem(LOCAL_STORAGE_KEY + username);
      toast.success("Layout reset to default.");
      setIsEditing(false); // Exit edit mode after reset
    }
  }, [username]);

  // Get available container types (not currently in layout)
  const getAvailableContainerTypes = useCallback(() => {
    const existingTypes = new Set(layout.map(item => item.type));
    const allTypes: ContainerType[] = ["chat", "streamInfo", "sessionInfo"];
    return allTypes.filter(type => !existingTypes.has(type));
  }, [layout]);

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Creator Dashboard for {username}</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(prev => !prev)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {isEditing ? (
              <>
                <Eye className="h-4 w-4 mr-2" /> View Mode
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" /> Edit Mode
              </>
            )}
          </Button>

          {isEditing && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Container
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
                variant="default"
                onClick={saveLayout}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" /> Save Layout
              </Button>
              <Button
                variant="destructive"
                onClick={resetLayout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Reset Layout
              </Button>
            </>
          )}
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }} // Use 'lg' breakpoint for simplicity
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={(_, allLayouts) => onLayoutChange(allLayouts.lg)}
        measureBeforeMount={true}
        compactType="vertical"
        preventCollision={!isEditing} // Prevent collision only in view mode
      >
        {layout.map(item => (
          <div key={item.i} data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h }}>
            <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
                <CardTitle className="text-white text-base">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </CardTitle>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => removeContainer(item.i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
                {/* Placeholder content for each container type */}
                {item.type === "chat" && "Chat content goes here."}
                {item.type === "streamInfo" && "Stream information goes here."}
                {item.type === "sessionInfo" && "Session details go here."}
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}