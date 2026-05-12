import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone =
  | "default"
  | "secondary"
  | "destructive"
  | "warning"
  | "success"
  | "outline"
  | "info";

const toneClasses: Record<Tone, string> = {
  default: "bg-primary/15 text-primary border-primary/30",
  secondary: "bg-secondary text-secondary-foreground border-border",
  destructive: "bg-destructive/15 text-destructive border-destructive/40",
  warning: "bg-warning/15 text-warning border-warning/40",
  success: "bg-success/15 text-success border-success/40",
  outline: "bg-transparent text-foreground border-border",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/40",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

export function severityTone(sev: string): Tone {
  switch (sev) {
    case "Critical":
      return "destructive";
    case "High":
      return "warning";
    case "Medium":
      return "info";
    case "Low":
      return "secondary";
    default:
      return "secondary";
  }
}
