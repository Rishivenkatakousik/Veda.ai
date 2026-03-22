"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LOGO_SRC = "/logo%202.png";

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full px-4 py-6">
      <Link
        href="/assignments"
        onClick={onNavigate}
        className="inline-flex w-fit max-w-full items-center gap-2 mb-6 self-start"
        aria-label="VedaAI home"
      >
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 origin-top scale-[1.38]">
            <Image
              src={LOGO_SRC}
              alt=""
              fill
              className="object-contain object-top"
              sizes="56px"
              priority
            />
          </div>
        </div>
        <span className="text-xl font-bold tracking-tight mb-2 text-gray-900 whitespace-nowrap">
          VedaAI
        </span>
      </Link>

      <Link href="/assignments/create" onClick={onNavigate} className="mb-6">
        <Button
          size="lg"
          className={cn(
            "w-full gap-2 h-11 rounded-full bg-neutral-900 text-white",
            "hover:bg-neutral-800 border border-orange-400/45",
            "shadow-[0_0_0_1px_rgba(251,146,60,0.25)]",
            "font-medium",
          )}
        >
          <Plus className="size-4" strokeWidth={2.5} />
          Create Assignment
        </Button>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="size-5 stroke-[1.5]" />
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

      <Separator className="my-4 bg-gray-200/80" />
      <Link
        href="/settings"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
          pathname.startsWith("/settings")
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        )}
      >
        <Settings className="size-5 stroke-[1.5]" />
        <span>Settings</span>
      </Link>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-100 p-3">
        <Image
          src="/Avatar.png"
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">
            Delhi Public School
          </p>
          <p className="text-xs text-gray-500 truncate">Bokaro Steel City</p>
        </div>
      </div>
    </div>
  );
}
