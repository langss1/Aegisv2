"use client";

import { useMockEngine } from "@/lib/mockEngine";
import { StatsOverview } from "@/components/StatsOverview";
import { TrafficChart } from "@/components/TrafficChart";
import { AttackFeed } from "@/components/AttackFeed";
import { HealingPanel } from "@/components/HealingPanel";

export default function Phase3Dashboard() {
  const { traffic, attacks, healingEvents, reverseHealing } = useMockEngine();

  const activeHealings = healingEvents.filter(h => h.status === "Healed").length;

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-foreground flex items-center">
            <span className="text-primary mr-2">AEGIS</span> Phase 3 Monitoring
          </h1>
          <p className="text-muted-foreground">Real-time attack detection and automated self-healing dashboard.</p>
        </header>

        <StatsOverview totalAttacks={attacks.length} activeHealings={activeHealings} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TrafficChart data={traffic} />
            
            <div className="h-[400px]">
              <HealingPanel events={healingEvents} onReverse={reverseHealing} />
            </div>
          </div>
          
          <div className="h-[724px]">
            <AttackFeed attacks={attacks} />
          </div>
        </div>
      </div>
    </main>
  );
}
