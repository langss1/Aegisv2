import type { AttackEvent, TrafficTick, LogLine, HealingAction, AuditEntry } from "@/lib/types";

export type EventMap = {
  attack: AttackEvent;
  "traffic-tick": TrafficTick;
  log: LogLine;
  healing: HealingAction;
  "healing-update": HealingAction;
  audit: AuditEntry;
};

type Handler<T> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<Handler<unknown>>>();

  on<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as Handler<unknown>);
    return () => this.off(event, handler);
  }

  off<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>) {
    this.listeners.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]) {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }
}

export const bus = new EventBus();
