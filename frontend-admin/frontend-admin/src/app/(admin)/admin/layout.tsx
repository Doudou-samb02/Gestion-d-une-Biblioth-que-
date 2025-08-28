"use client";
import React from "react";
import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
       
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
