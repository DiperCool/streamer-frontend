"use client";

import React from "react";
import { BannedUsersTab } from "@/src/components/dashboard/chat/BannedUsersTab"; // Импортируем BannedUsersTab

export default function BannedUsersPage() {
  return (
    <div className="space-y-8">
      {/* Заголовок будет на родительской странице, но можно добавить и здесь, если нужно */}
      {/* <h2 className="text-2xl font-semibold mb-6 text-white">Banned Users</h2> */}
      <BannedUsersTab />
    </div>
  );
}