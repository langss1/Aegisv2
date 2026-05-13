/**
 * Server-side healing state — backed by Supabase for production persistence.
 */
import { supabaseAdmin } from "@/lib/supabase";

export type ServerHealingStatus = "Applied" | "Reversed" | "Approved" | "Expired";

export interface ServerHealingAction {
  id: string;
  sessionId: string;
  attackType: string;
  severity: string;
  sourceIp: string;
  targetEndpoint: string;
  method: string;
  payload: string;
  patch: string;
  wafRuleId: string;
  blockPattern?: string;
  status: ServerHealingStatus;
  appliedAt: number;
  reverseDeadline: number;
  reversedAt?: number;
  reversedBy?: string;
  approvedAt?: number;
  approvedBy?: string;
  telegramMessageId?: number;
  telegramChatId?: string;
}

function toRow(a: ServerHealingAction) {
  return {
    id: a.id,
    session_id: a.sessionId,
    attack_type: a.attackType,
    severity: a.severity,
    source_ip: a.sourceIp,
    target_endpoint: a.targetEndpoint,
    method: a.method,
    payload: a.payload,
    patch: a.patch,
    waf_rule_id: a.wafRuleId,
    block_pattern: a.blockPattern,
    status: a.status,
    applied_at: a.appliedAt,
    reverse_deadline: a.reverseDeadline,
    reversed_at: a.reversedAt,
    reversed_by: a.reversedBy,
    approved_at: a.approvedAt,
    approved_by: a.approvedBy,
    telegram_message_id: a.telegramMessageId,
    telegram_chat_id: a.telegramChatId,
  };
}

function fromRow(r: any): ServerHealingAction {
  return {
    id: r.id,
    sessionId: r.session_id,
    attackType: r.attack_type,
    severity: r.severity,
    sourceIp: r.source_ip,
    targetEndpoint: r.target_endpoint,
    method: r.method,
    payload: r.payload,
    patch: r.patch,
    wafRuleId: r.waf_rule_id,
    blockPattern: r.block_pattern,
    status: r.status,
    appliedAt: r.applied_at,
    reverseDeadline: r.reverse_deadline,
    reversedAt: r.reversed_at,
    reversedBy: r.reversed_by,
    approvedAt: r.approved_at,
    approvedBy: r.approved_by,
    telegramMessageId: r.telegram_message_id,
    telegramChatId: r.telegram_chat_id,
  };
}

export async function registerHealing(action: ServerHealingAction): Promise<void> {
  const { error } = await supabaseAdmin.from("healing_actions").insert(toRow(action));
  if (error) console.error("[HealingState] Supabase insert error:", error.message);
  else console.log(`[HealingState] Persisted healing ${action.id} for session ${action.sessionId}`);
}

export async function getAllHealings(sessionId: string): Promise<ServerHealingAction[]> {
  const now = Date.now();

  // Auto-expire Applied healings past deadline
  await supabaseAdmin
    .from("healing_actions")
    .update({ status: "Expired" })
    .eq("session_id", sessionId)
    .eq("status", "Applied")
    .lt("reverse_deadline", now);

  const { data, error } = await supabaseAdmin
    .from("healing_actions")
    .select("*")
    .eq("session_id", sessionId)
    .order("applied_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[HealingState] Supabase read error:", error.message);
    return [];
  }
  return (data ?? []).map(fromRow);
}

export async function getHealing(id: string): Promise<ServerHealingAction | null> {
  const { data, error } = await supabaseAdmin
    .from("healing_actions")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return fromRow(data);
}

export async function approveHealing(id: string, by: string): Promise<ServerHealingAction | null> {
  const healing = await getHealing(id);
  if (!healing || healing.status !== "Applied") return null;

  const now = Date.now();
  const { error } = await supabaseAdmin
    .from("healing_actions")
    .update({ status: "Approved", approved_at: now, approved_by: by })
    .eq("id", id);

  if (error) { console.error("[HealingState] Approve error:", error.message); return null; }
  return { ...healing, status: "Approved", approvedAt: now, approvedBy: by };
}

export async function reverseHealing(id: string, by: string): Promise<ServerHealingAction | null> {
  const healing = await getHealing(id);
  if (!healing) return null;
  if (healing.status !== "Applied" && healing.status !== "Approved") return null;
  if (Date.now() > healing.reverseDeadline) {
    await supabaseAdmin.from("healing_actions").update({ status: "Expired" }).eq("id", id);
    return null;
  }

  const now = Date.now();
  const { error } = await supabaseAdmin
    .from("healing_actions")
    .update({ status: "Reversed", reversed_at: now, reversed_by: by })
    .eq("id", id);

  if (error) { console.error("[HealingState] Reverse error:", error.message); return null; }
  return { ...healing, status: "Reversed", reversedAt: now, reversedBy: by };
}

export async function clearAllHealings(sessionId: string): Promise<void> {
  const { error } = await supabaseAdmin.from("healing_actions").delete().eq("session_id", sessionId);
  if (error) console.error("[HealingState] Clear error:", error.message);
}
