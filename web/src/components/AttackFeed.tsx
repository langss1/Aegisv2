import type { AttackEvent } from "../lib/mockEngine";
import { ShieldAlert } from "lucide-react";

export function AttackFeed({ attacks }: { attacks: AttackEvent[] }) {
  return (
    <div className="bg-card border border-border p-4 rounded-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center text-foreground">
        <ShieldAlert className="text-primary mr-2" />
        Live Threat Alerts
      </h2>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="space-y-3">
          {attacks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No attacks detected.</p>
          ) : (
            attacks.map((attack) => (
              <div 
                key={attack.id} 
                className={`p-3 rounded border bg-background/50 animate-in fade-in slide-in-from-right-2
                  ${attack.severity === 'Critical' ? 'border-primary/50 border-l-4 border-l-primary' : 
                    attack.severity === 'High' ? 'border-orange-500/50 border-l-4 border-l-orange-500' : 
                    'border-yellow-500/50 border-l-4 border-l-yellow-500'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-foreground text-sm">{attack.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${attack.severity === 'Critical' ? 'bg-primary/20 text-primary' : 
                      attack.severity === 'High' ? 'bg-orange-500/20 text-orange-500' : 
                      'bg-yellow-500/20 text-yellow-500'}`}
                  >
                    {attack.severity}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1 mt-2">
                  <span>Source: <span className="text-foreground">{attack.sourceIp}</span></span>
                  <span>Target: <span className="text-foreground">{attack.targetEndpoint}</span></span>
                  <span className="col-span-2 text-[10px] mt-1">{attack.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
