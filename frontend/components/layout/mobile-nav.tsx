"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Inbox,
  FilePlus,
  Sparkles,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_TABS = [
  { icon: LayoutGrid, label: "Home", href: "/home" },
  { icon: Inbox, label: "Assignments", href: "/assignments" },
  { icon: FilePlus, label: "Library", href: "/library" },
  { icon: Sparkles, label: "AI Toolkit", href: "/toolkit" },
] as const;

function tabIsActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div
        className={cn(
          "pointer-events-auto mx-3 mb-2 flex flex-col items-stretch gap-2",
          "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        )}
      >
        <div className="flex justify-end pr-0.5">
          <Link
            href="/assignments/create"
            aria-label="Create new assignment"
            className={cn(
              "flex size-[3.25rem] items-center justify-center rounded-full bg-white",
              "text-orange-500 shadow-[0_4px_14px_rgba(0,0,0,0.14)]",
              "transition-transform active:scale-95",
            )}
          >
            <Plus className="size-7" strokeWidth={1.75} />
          </Link>
        </div>

        <nav
          className={cn(
            "grid w-full grid-cols-4 items-center rounded-full bg-[#1c1c1e] px-1 py-2.5",
            "shadow-[0_4px_24px_rgba(0,0,0,0.18)]",
          )}
          aria-label="Bottom navigation"
        >
          {MOBILE_TABS.map((tab) => {
            const isActive = tabIsActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-0.5"
              >
                <tab.icon
                  className={cn(
                    "size-[22px] shrink-0",
                    isActive ? "text-white" : "text-zinc-500",
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span
                  className={cn(
                    "max-w-full truncate text-center leading-tight",
                    isActive
                      ? "text-xs font-semibold text-white"
                      : "text-[11px] font-medium text-zinc-500",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
