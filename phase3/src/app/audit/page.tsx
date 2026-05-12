"use client";

import { AuditTable } from "@/components/audit/AuditTable";

export default function AuditPage() {
  return (
    <div className="space-y-4 h-full">
      <div>
        <h1 className="text-lg font-bold text-foreground">Audit Trail</h1>
        <p className="text-xs text-muted-foreground">
          Complete history of system and operator actions for compliance and review
        </p>
      </div>
      <AuditTable />
    </div>
  );
}
