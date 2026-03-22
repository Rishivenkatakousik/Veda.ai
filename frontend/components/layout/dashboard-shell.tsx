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
    <div className="flex h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-[#eceef1] lg:p-4 lg:gap-4">
      {/* Desktop sidebar — white rounded panel */}
      <aside className="hidden lg:flex lg:w-[260px] shrink-0 self-stretch min-h-0">
        <div className="scrollbar-hide flex h-full min-h-0 w-full flex-col overflow-y-auto rounded-2xl border border-gray-200/70 bg-white shadow-sm">
          <SidebarNav />
        </div>
      </aside>

      <MobileSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Navbar and main are siblings — not one shared container (see reference layout) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 pt-3 pb-3 sm:gap-4 sm:px-4 sm:pt-4 sm:pb-4 min-w-0 lg:px-0 lg:pt-0 lg:pb-0">
        <div className="shrink-0 rounded-2xl border border-gray-200/70 bg-white shadow-sm overflow-hidden">
          <Header onOpenMobileNav={() => setMobileNavOpen(true)} />
        </div>

        <main className="scrollbar-hide min-h-0 flex flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
