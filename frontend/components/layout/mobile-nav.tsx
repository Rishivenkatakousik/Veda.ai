"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Library, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_TABS = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Users, label: "My Groups", href: "/groups" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Sparkles, label: "AI Toolkit", href: "/toolkit" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden">
      {/* FAB */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2">
        <Link
          href="/assignments/create"
          className="flex items-center justify-center size-14 rounded-full bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-transform"
        >
          <Plus className="size-6" />
        </Link>
      </div>

      {/* Tab Bar */}
      <nav className="flex items-center justify-around border-t border-border bg-white px-2 pb-[env(safe-area-inset-bottom)] h-16">
        {MOBILE_TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "text-orange-600"
                  : "text-gray-500 active:text-gray-700",
              )}
            >
              <tab.icon className="size-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
