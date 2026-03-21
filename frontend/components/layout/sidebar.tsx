"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border bg-white">
      <div className="flex flex-col h-full px-4 py-6">
        {/* Logo */}
        <Link href="/assignments" className="flex items-center gap-2 px-2 mb-6">
          <div className="flex items-center justify-center size-8 rounded-lg bg-linear-to-br from-orange-500 to-red-500">
            <span className="text-sm font-bold text-white">V</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">VedaAI</span>
        </Link>

        {/* Create Assignment CTA */}
        <Link href="/assignments/create" className="mb-6">
          <Button className="w-full gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 border-0 h-10 rounded-lg font-medium">
            <Plus className="size-4" />
            Create Assignment
          </Button>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className="size-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-orange-500 text-white text-xs font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <Separator className="my-4" />
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname.startsWith("/settings")
              ? "bg-orange-50 text-orange-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          <Settings className="size-5" />
          <span>Settings</span>
        </Link>

        {/* School Profile Card */}
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-border p-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
            SP
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">Springfield School</p>
            <p className="text-xs text-muted-foreground truncate">
              Springfield, IL
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
