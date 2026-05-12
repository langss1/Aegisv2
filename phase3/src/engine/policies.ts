import type { AttackType, Severity, Policy } from "@/lib/types";
import { nid } from "@/lib/id";

const DEFAULT_POLICIES: Omit<Policy, "id">[] = [
  { attackType: "SQL Injection", minSeverity: "High", patchName: "WAF SQL Filter + Input Sanitizer", wafRuleId: "WAF-SQL-001", enabled: true },
  { attackType: "XSS", minSeverity: "High", patchName: "CSP Header + Output Encoding", wafRuleId: "WAF-XSS-001", enabled: true },
  { attackType: "Path Traversal", minSeverity: "High", patchName: "Path Validator Middleware", wafRuleId: "WAF-PT-001", enabled: true },
  { attackType: "Command Injection", minSeverity: "Medium", patchName: "Command Sanitizer", wafRuleId: "WAF-CMD-001", enabled: true },
  { attackType: "Brute Force", minSeverity: "High", patchName: "Rate Limiter + IP Ban", wafRuleId: "WAF-BF-001", enabled: true },
  { attackType: "SSRF", minSeverity: "High", patchName: "SSRF Blocker + URL Whitelist", wafRuleId: "WAF-SSRF-001", enabled: true },
  { attackType: "RCE", minSeverity: "Medium", patchName: "Sandbox Isolation + Process Kill", wafRuleId: "WAF-RCE-001", enabled: true },
  { attackType: "CSRF", minSeverity: "High", patchName: "CSRF Token Enforcer", wafRuleId: "WAF-CSRF-001", enabled: true },
  { attackType: "LFI", minSeverity: "High", patchName: "File Access Restrictor", wafRuleId: "WAF-LFI-001", enabled: true },
  { attackType: "Open Redirect", minSeverity: "High", patchName: "Redirect Whitelist", wafRuleId: "WAF-OR-001", enabled: true },
];

export function getDefaultPolicies(): Policy[] {
  return DEFAULT_POLICIES.map((p) => ({ ...p, id: nid("pol") }));
}

const SEVERITY_ORDER: Record<Severity, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export function shouldHeal(attackType: AttackType, severity: Severity, policies: Policy[]): Policy | null {
  const matched = policies.find(
    (p) => p.enabled && p.attackType === attackType && SEVERITY_ORDER[severity] >= SEVERITY_ORDER[p.minSeverity],
  );
  return matched ?? null;
}
