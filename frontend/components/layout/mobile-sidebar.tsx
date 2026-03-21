"use client";

import { SidebarNav } from "./sidebar-nav";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close menu"
      />
      <aside className="absolute left-0 top-0 bottom-0 w-[min(18rem,85vw)] border-r border-border bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
        <SidebarNav onNavigate={onClose} />
      </aside>
    </div>
  );
}
