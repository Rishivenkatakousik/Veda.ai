"use client";

import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import { MobileSidebar } from "./mobile-sidebar";
import Header from "./header";
import MobileNav from "./mobile-nav";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border bg-white shrink-0">
        <SidebarNav />
      </aside>

      <MobileSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-3 sm:p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
