"use client";

import { LogStream } from "@/components/logs/LogStream";

export default function LogsPage() {
  return (
    <div className="space-y-4 h-full">
      <div>
        <h1 className="text-lg font-bold text-foreground">Log Stream</h1>
        <p className="text-xs text-muted-foreground">
          Real-time log feed from all system components
        </p>
      </div>
      <LogStream />
    </div>
  );
}
