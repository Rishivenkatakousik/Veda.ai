"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  FileText,
  Menu,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocketConnection } from "@/hooks/use-socket-connection";

const PAGE_TITLES: Record<string, string> = {
  "/assignments": "Assignments",
  "/assignments/create": "Create Assignment",
  "/home": "Home",
  "/groups": "My Groups",
  "/toolkit": "AI Teacher's Toolkit",
  "/library": "My Library",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/assignments/")) return "Assignment";
  return "VedaAI";
}

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export default function Header({ onOpenMobileNav }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const showBack = pathname !== "/assignments";
  const { connected, reconnecting } = useSocketConnection();

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-3 sm:px-4 lg:px-6 h-14 shrink-0 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
            className="hidden sm:inline-flex shrink-0"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm min-w-0">
          <FileText className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <span className="font-medium truncate">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {(!connected || reconnecting) && (
          <div
            className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800 border border-amber-200 max-w-[140px] sm:max-w-none"
            title="Real-time updates may be delayed until reconnected"
          >
            <WifiOff className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">
              {reconnecting ? "Reconnecting…" : "Offline"}
            </span>
          </div>
        )}

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>

        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-border">
          <div className="flex items-center justify-center size-8 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            JD
          </div>
          <span className="hidden sm:block text-sm font-medium">John Doe</span>
        </div>
      </div>
    </header>
  );
}
