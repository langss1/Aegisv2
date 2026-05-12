"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function Topbar() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Badge tone="success" className="gap-1.5">
          <Activity className="h-3 w-3" />
          System Online
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-mono-tabular text-xs text-muted-foreground">
          {time}
        </span>
      </div>
    </header>
  );
}
