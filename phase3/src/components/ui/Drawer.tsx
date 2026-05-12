"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  width = "w-[440px]",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "pointer-events-none fixed inset-0 z-40 transition-opacity",
        open ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity",
          open ? "pointer-events-auto" : "",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute right-0 top-0 h-full bg-card border-l border-border shadow-xl transition-transform flex flex-col",
          width,
          open ? "pointer-events-auto translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-start justify-between gap-2 border-b border-border p-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">{children}</div>
      </aside>
    </div>
  );
}
