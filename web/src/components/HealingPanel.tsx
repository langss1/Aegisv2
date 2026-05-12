import { useState, useEffect } from "react";
import type { HealingEvent } from "../lib/mockEngine";
import { Undo2, CheckCircle2, XCircle } from "lucide-react";

export function HealingPanel({ 
  events, 
  onReverse 
}: { 
  events: HealingEvent[], 
  onReverse: (id: string) => void 
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (deadline: Date) => {
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-card border border-border p-4 rounded-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center text-foreground">
        <CheckCircle2 className="text-green-500 mr-2" />
        Self-Healing Actions
      </h2>
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-muted-foreground text-sm">No healing actions taken recently.</p>
          ) : (
            events.map((evt) => {
              const isExpired = now.getTime() > evt.reverseDeadline.getTime();
              const isReversed = evt.status === "Reversed";
              
              return (
                <div 
                  key={evt.id} 
                  className={`p-3 rounded border bg-background/50 animate-in fade-in
                    ${isReversed ? 'border-border/50 opacity-60' : 'border-green-500/30'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      {isReversed ? (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`font-bold text-sm ${isReversed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {evt.patchApplied}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{evt.timestamp.toLocaleTimeString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Trigger: {evt.attackType}</p>
                      {!isReversed && (
                        <p className={`text-xs mt-1 ${isExpired ? 'text-primary' : 'text-yellow-500'}`}>
                          Reverse: {isExpired ? "Expired" : formatTimeLeft(evt.reverseDeadline)}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onReverse(evt.id)}
                      disabled={isReversed || isExpired}
                      className={`text-xs px-3 py-1 rounded flex items-center transition-colors
                        ${isReversed || isExpired 
                          ? 'bg-secondary text-muted-foreground cursor-not-allowed' 
                          : 'bg-primary hover:bg-primary/80 text-primary-foreground'}`}
                    >
                      <Undo2 className="w-3 h-3 mr-1" />
                      {isReversed ? "Reversed" : "Reverse"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
