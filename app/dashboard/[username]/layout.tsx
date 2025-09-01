import React from "react";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  // You can use params.username here if needed for layout-specific logic
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
}