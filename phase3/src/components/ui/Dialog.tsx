"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn("fixed inset-0 z-50 flex items-center justify-center p-4")}
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card shadow-xl animate-fade-in">
        {(title || description) && (
          <div className="border-b border-border p-4">
            {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
            {description ? (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
        )}
        {children ? <div className="p-4">{children}</div> : null}
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border p-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
