"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useHealingStore } from "@/store/healingStore";
import type { HealingAction } from "@/lib/types";

export function ReverseConfirm({
  action,
  onClose,
}: {
  action: HealingAction | null;
  onClose: () => void;
}) {
  const reverseAction = useHealingStore((s) => s.reverseAction);

  const handleConfirm = () => {
    if (!action) return;
    reverseAction(action.id, "Operator");
    onClose();
  };

  return (
    <Dialog
      open={!!action}
      onClose={onClose}
      title="Reverse Healing Action"
      description="This will rollback the applied patch and restore the previous state from snapshot."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleConfirm}>
            Confirm Reverse
          </Button>
        </>
      }
    >
      {action && (
        <div className="space-y-2 text-xs">
          <p>
            <span className="text-muted-foreground">Patch:</span>{" "}
            <span className="font-medium">{action.patch}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Attack type:</span>{" "}
            <span className="font-medium">{action.attackType}</span>
          </p>
          <p>
            <span className="text-muted-foreground">WAF Rule:</span>{" "}
            <span className="font-mono-tabular">{action.wafRuleId}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Snapshot:</span>{" "}
            <span className="font-mono-tabular">{action.snapshotId}</span>
          </p>
          <p className="rounded bg-destructive/10 border border-destructive/30 p-2 text-destructive">
            Warning: Reversing this patch will re-expose the vulnerability until a manual fix is applied.
          </p>
        </div>
      )}
    </Dialog>
  );
}
