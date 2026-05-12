import { ShieldCheck, Activity, AlertTriangle, History } from "lucide-react";

export function StatsOverview({
  totalAttacks,
  activeHealings,
}: {
  totalAttacks: number;
  activeHealings: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">System Status</p>
          <p className="text-2xl font-bold text-green-500">Secure</p>
        </div>
        <ShieldCheck className="h-10 w-10 text-green-500 opacity-80" />
      </div>

      <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Live Traffic</p>
          <p className="text-2xl font-bold text-foreground">Monitoring</p>
        </div>
        <Activity className="h-10 w-10 text-blue-500 opacity-80 animate-pulse" />
      </div>

      <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Attacks Blocked</p>
          <p className="text-2xl font-bold text-primary">{totalAttacks}</p>
        </div>
        <AlertTriangle className="h-10 w-10 text-primary opacity-80" />
      </div>

      <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Active Snapshots</p>
          <p className="text-2xl font-bold text-foreground">{activeHealings}</p>
        </div>
        <History className="h-10 w-10 text-yellow-500 opacity-80" />
      </div>
    </div>
  );
}
