"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const showBack = pathname !== "/assignments";

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-4 lg:px-6 h-14 shrink-0">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm">
          <FileText className="size-4 text-muted-foreground" />
          <span className="font-medium">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="flex items-center justify-center size-8 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            JD
          </div>
          <span className="hidden sm:block text-sm font-medium">
            John Doe
          </span>
        </div>
      </div>
    </header>
  );
}
