"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { HealingActionsList } from "@/components/healing/HealingActionsList";
import { useHealingStore } from "@/store/healingStore";

export default function HealingPage() {
  const [tab, setTab] = useState("Applied");
  const actions = useHealingStore((s) => s.actions);

  const counts = {
    Applied: actions.filter((a) => a.status === "Applied").length,
    Approved: actions.filter((a) => a.status === "Approved").length,
    Reversed: actions.filter((a) => a.status === "Reversed").length,
    Expired: actions.filter((a) => a.status === "Expired").length,
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Self-Healing Actions</h1>
        <p className="text-xs text-muted-foreground">
          Automated patches applied by AEGIS. Reverse within the 30-minute window if needed.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="Applied">
            Active ({counts.Applied})
          </TabsTrigger>
          <TabsTrigger value="Approved">
            Locked ({counts.Approved})
          </TabsTrigger>
          <TabsTrigger value="Reversed">
            Reversed ({counts.Reversed})
          </TabsTrigger>
          <TabsTrigger value="Expired">
            Expired ({counts.Expired})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Applied">
          <HealingActionsList filter="Applied" />
        </TabsContent>
        <TabsContent value="Approved">
          <HealingActionsList filter="Approved" />
        </TabsContent>
        <TabsContent value="Reversed">
          <HealingActionsList filter="Reversed" />
        </TabsContent>
        <TabsContent value="Expired">
          <HealingActionsList filter="Expired" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
