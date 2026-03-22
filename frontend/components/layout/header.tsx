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
import { cn } from "@/lib/utils";

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
  const showBack = pathname !== "/home";
  const isAssignmentsHome = pathname === "/assignments";
  const { connected, reconnecting } = useSocketConnection();


  const offlineDot =
    !connected || reconnecting ? (
      <div
        className="flex size-9 items-center justify-center rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-200"
        title={
          reconnecting
            ? "Reconnecting…"
            : "Real-time updates may be delayed until reconnected"
        }
      >
        <WifiOff className="size-4 shrink-0" />
      </div>
    ) : null;

  return (
    <>
      {isAssignmentsHome && (
        <header className="relative flex h-14 shrink-0 items-center justify-center bg-white px-3 lg:hidden">
          <div className="absolute left-3 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 shrink-0 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={onOpenMobileNav}
              aria-label="Open navigation menu"
            >
              <Menu className="size-4.5 stroke-[1.75]" />
            </Button>
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                aria-label="Go back"
                className="size-10 shrink-0 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                <ArrowLeft className="size-4.5 stroke-[1.75]" />
              </Button>
            )}
          </div>
          <h1 className="pointer-events-none text-base font-bold tracking-tight text-gray-900">
            Assignments
          </h1>
          <div className="absolute right-3 flex items-center gap-2">
            {offlineDot}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative size-10 shrink-0 rounded-full text-gray-800 hover:bg-gray-100"
            >
              <Bell className="size-4.5 stroke-[1.75]" />
              <span
                className="absolute top-2 right-2 size-2 rounded-full bg-orange-500 ring-2 ring-white"
                aria-hidden
              />
            </Button>
          </div>
        </header>
      )}

      <header
        className={cn(
          "h-15 shrink-0 items-center justify-between gap-2 bg-white px-3 sm:px-5 lg:px-6",
          isAssignmentsHome ? "hidden lg:flex" : "flex",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl lg:hidden"
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

          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="truncate font-medium text-gray-500">{title}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
                className="hidden h-10 gap-2 rounded-full border-gray-200 bg-white pl-1.5 pr-2.5 shadow-none hover:bg-gray-50 sm:inline-flex"
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
                <ChevronDown className="size-4 shrink-0 text-gray-400" />
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
    </>
  );
}
