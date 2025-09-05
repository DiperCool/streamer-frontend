import React from "react";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  // Применяем отступ, высоту и flex-контейнер здесь, чтобы все дочерние страницы дашборда имели одинаковый вид.
  return (
    <div className="flex-1 p-4 h-screen-minus-navbar flex flex-col">
      {children}
    </div>
  );
}