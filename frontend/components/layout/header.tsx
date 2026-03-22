"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  LayoutGrid,
  Menu,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocketConnection } from "@/hooks/use-socket-connection";

const PAGE_TITLES: Record<string, string> = {
  "/assignments": "Assignment",
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
  const showBack = pathname !== "/home";
  const { connected, reconnecting } = useSocketConnection();

  return (
    <header className="flex items-center justify-between bg-white px-3 sm:px-5 lg:px-6 h-15 shrink-0 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 rounded-xl"
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
            className="shrink-0 rounded-xl text-gray-700"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm min-w-0">
          <LayoutGrid className="size-4 text-gray-400 shrink-0 hidden sm:block stroke-[1.5]" />
          <span className="font-medium text-gray-500 truncate">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative rounded-xl text-gray-700"
        >
          <Bell className="size-5 stroke-[1.5]" />
          <span
            className="absolute top-1.5 right-1.5 size-2 rounded-full bg-orange-500 ring-2 ring-white"
            aria-hidden
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              className="hidden sm:inline-flex h-10 pl-1.5 pr-2.5 gap-2 rounded-full border-gray-200 bg-white shadow-none hover:bg-gray-50"
            >
              <Image
                src="/Avatar.png"
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-gray-900">
                John Doe
              </span>
              <ChevronDown className="size-4 text-gray-400 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
