"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown, Menu, WifiOff } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocketConnection } from "@/hooks/use-socket-connection";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo%202.png";

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
      {/* Mobile: floating pill — same on every page */}
      <header className="flex h-auto min-h-0 shrink-0 items-center justify-between gap-2 rounded-full border border-gray-200/80 bg-white px-3 py-2 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.12)] lg:hidden">
        <Link
          href="/assignments"
          className="flex min-w-0 max-w-[55%] items-center gap-2"
          aria-label="VedaAI home"
        >
          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
            <div className="absolute inset-0 origin-top scale-[1.32]">
              <Image
                src={LOGO_SRC}
                alt=""
                fill
                className="object-contain object-top"
                sizes="36px"
                priority
              />
            </div>
          </div>
          <span className="truncate text-base font-bold tracking-tight text-gray-900">
            VedaAI
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {offlineDot}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative size-10 shrink-0 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            <Bell className="size-[18px] stroke-[1.75]" />
            <span
              className="absolute top-2 right-2 size-2 rounded-full bg-orange-500 ring-2 ring-gray-100"
              aria-hidden
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account menu"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-10 min-w-10 shrink-0 rounded-full border-gray-200 bg-white p-0 shadow-none hover:bg-gray-50",
              )}
            >
              <Image
                src="/Avatar.png"
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Account settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-full text-gray-900 hover:bg-gray-100"
            onClick={onOpenMobileNav}
            aria-label="Open navigation menu"
          >
            <Menu className="size-[22px] stroke-[1.75]" />
          </Button>
        </div>
      </header>

      {/* Desktop */}
      <header
        className={cn(
          "hidden h-15 shrink-0 items-center justify-between gap-2 bg-white px-3 sm:px-5 lg:flex lg:px-6",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
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
          {offlineDot}
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
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 gap-2 rounded-full border-gray-200 bg-white pl-1.5 pr-2.5 shadow-none hover:bg-gray-50",
              )}
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
