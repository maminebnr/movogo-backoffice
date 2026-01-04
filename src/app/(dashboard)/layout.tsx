"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-dvh grid md:grid-cols-[16rem_1fr]">
        <AppSidebar />
        <div className="flex flex-col">
          <header className="h-16 border-b bg-white flex items-center px-4">
            <h1 className="text-lg font-medium">Backoffice</h1>
          </header>
          <main className="p-4">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}


