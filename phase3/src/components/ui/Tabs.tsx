"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TabsCtx {
  value: string;
  setValue: (v: string) => void;
}
const Ctx = createContext<TabsCtx | null>(null);

function useTabs() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Tabs.* must be used inside <Tabs>");
  return ctx;
}

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Ctx.Provider value={{ value, setValue: onValueChange }}>
      <div className={cn("flex flex-col gap-3", className)}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-start gap-1 rounded-md bg-secondary p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const { value: current, setValue } = useTabs();
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-xs font-medium transition-all",
        active
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const { value: current } = useTabs();
  if (current !== value) return null;
  return <div className={cn("animate-fade-in", className)}>{children}</div>;
}
