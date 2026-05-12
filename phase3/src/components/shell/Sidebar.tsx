"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  ShieldCheck,
  ScrollText,
  ClipboardList,
  Settings,
  Shield,
  Zap,
  Crosshair,
  FileText,
  Bug,
  Eye,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_PHASE2 = [
  { href: "/pentest", label: "AI Pentest", icon: Crosshair },
  { href: "/pentest/report", label: "Pentest Report", icon: FileText },
] as const;

const NAV_PHASE3 = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/healing", label: "Self-Healing", icon: ShieldCheck },
  { href: "/cve", label: "CVE Monitor", icon: Bug },
  { href: "/logs", label: "Logs", icon: ScrollText },
  { href: "/audit", label: "Audit Trail", icon: ClipboardList },
  { href: "/report", label: "Monitor Report", icon: FileSearch },
] as const;

const NAV_TOOLS = [
  { href: "/simulate", label: "Simulate Attack", icon: Zap },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  const renderNavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const active = pathname === href || pathname?.startsWith(href + "/");
    return (
      <li key={href}>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
            active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      </li>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-sm font-bold tracking-tight text-foreground">
          AEGIS
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        {/* Phase 2: AI Pentest */}
        <div className="mb-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <Crosshair className="h-3 w-3 text-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">
              Phase 2: AI Pentest
            </span>
          </div>
          <ul className="space-y-0.5">
            {NAV_PHASE2.map(renderNavItem)}
          </ul>
        </div>

        {/* Phase 3: Defend & Monitor */}
        <div className="mb-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <Eye className="h-3 w-3 text-green-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-green-500">
              Phase 3: Defend
            </span>
          </div>
          <ul className="space-y-0.5">
            {NAV_PHASE3.map(renderNavItem)}
          </ul>
        </div>

        {/* Tools */}
        <div className="mb-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tools
            </span>
          </div>
          <ul className="space-y-0.5">
            {NAV_TOOLS.map(renderNavItem)}
          </ul>
        </div>
      </nav>

      <div className="border-t border-border px-4 py-3">
        <p className="text-[10px] text-muted-foreground">
          AEGIS Security Platform v1.0
        </p>
      </div>
    </aside>
  );
}
