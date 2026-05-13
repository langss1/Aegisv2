/**
 * Server-side attack state — backed by Supabase for production persistence.
 * Falls back to in-memory buffer for real-time (Supabase write is async).
 */
import { supabaseAdmin } from "@/lib/supabase";

export interface ServerAttackEvent {
  id: string;
  sessionId: string;
  type: string;
  severity: string;
  sourceIp: string;
  targetEndpoint: string;
  method: string;
  payload: string;
  timestamp: number;
  blocked: boolean;
  source?: string;
}

// In-memory write-through cache for real-time response
interface AttackGlobalStore {
  attacks: ServerAttackEvent[];
  maxAttacks: number;
}

const globalStore = globalThis as typeof globalThis & { __aegisAttackStore?: AttackGlobalStore };
if (!globalStore.__aegisAttackStore) {
  globalStore.__aegisAttackStore = { attacks: [], maxAttacks: 500 };
}
const store = globalStore.__aegisAttackStore;

export async function registerAttack(attack: ServerAttackEvent): Promise<void> {
  // Write to in-memory for immediate real-time display
  store.attacks.unshift(attack);
  if (store.attacks.length > store.maxAttacks) {
    store.attacks = store.attacks.slice(0, store.maxAttacks);
  }

  // Persist to Supabase asynchronously
  const { error } = await supabaseAdmin.from("attacks").insert({
    id: attack.id,
    session_id: attack.sessionId,
    type: attack.type,
    severity: attack.severity,
    source_ip: attack.sourceIp,
    target_endpoint: attack.targetEndpoint,
    method: attack.method,
    payload: attack.payload,
    timestamp: attack.timestamp,
    blocked: attack.blocked,
    source: attack.source ?? "live",
  });
  if (error) console.error("[AttackState] Supabase write error:", error.message);
  else console.log(`[AttackState] Persisted attack ${attack.id} for session ${attack.sessionId}`);
}

export async function getAllAttacks(sessionId: string): Promise<ServerAttackEvent[]> {
  const { data, error } = await supabaseAdmin
    .from("attacks")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[AttackState] Supabase read error:", error.message);
    // fallback to in-memory
    return store.attacks.filter((a) => a.sessionId === sessionId);
  }

  return (data ?? []).map((a) => ({
    id: a.id,
    sessionId: a.session_id,
    type: a.type,
    severity: a.severity,
    sourceIp: a.source_ip,
    targetEndpoint: a.target_endpoint,
    method: a.method,
    payload: a.payload,
    timestamp: a.timestamp,
    blocked: a.blocked,
    source: a.source,
  }));
}

export async function getAttacksSince(sessionId: string, since: number): Promise<ServerAttackEvent[]> {
  const { data, error } = await supabaseAdmin
    .from("attacks")
    .select("*")
    .eq("session_id", sessionId)
    .gt("timestamp", since)
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("[AttackState] Supabase read error:", error.message);
    return store.attacks.filter((a) => a.sessionId === sessionId && a.timestamp > since);
  }

  return (data ?? []).map((a) => ({
    id: a.id,
    sessionId: a.session_id,
    type: a.type,
    severity: a.severity,
    sourceIp: a.source_ip,
    targetEndpoint: a.target_endpoint,
    method: a.method,
    payload: a.payload,
    timestamp: a.timestamp,
    blocked: a.blocked,
    source: a.source,
  }));
}

export async function clearAllAttacks(sessionId: string): Promise<void> {
  store.attacks = store.attacks.filter((a) => a.sessionId !== sessionId);
  const { error } = await supabaseAdmin.from("attacks").delete().eq("session_id", sessionId);
  if (error) console.error("[AttackState] Supabase delete error:", error.message);
}
