/**
 * AEGIS Phase 2 - Security Scanner
 * Executes penetration tests against target application
 */

import { 
  generateAttackPayloads, 
  analyzeResponse, 
  OWASP_TOP_10,
  type AttackPayload,
  type VulnerabilityResult 
} from "../ai/pentestAI.js";

export interface ScanConfig {
  targetUrl: string;
  endpoints: string[];
  categories?: string[];  // OWASP categories to test, defaults to all
  timeout?: number;
  verbose?: boolean;
  notifyUrl?: string;    // AEGIS Phase 3 URL for HITL notifications
  telegramNotify?: boolean;
}

export interface ScanProgress {
  phase: string;
  current: number;
  total: number;
  message: string;
}

export interface ScanResult {
  target: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalTests: number;
  vulnerabilities: VulnerabilityResult[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

type ProgressCallback = (progress: ScanProgress) => void;

/**
 * Execute HTTP request for attack
 */
async function executeAttack(
  targetUrl: string,
  attack: AttackPayload,
  timeout: number
): Promise<{ status: number; body: string; time: number }> {
  const url = `${targetUrl}${attack.endpoint}`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const options: RequestInit = {
      method: attack.method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AEGIS-PenTest/2.0",
        "ngrok-skip-browser-warning": "1",
        ...attack.headers,
      },
      signal: controller.signal,
    };

    if (attack.body && ["POST", "PUT", "PATCH"].includes(attack.method)) {
      options.body = JSON.stringify(attack.body);
    }

    const res = await fetch(url, options);
    clearTimeout(timeoutId);

    const body = await res.text();
    const time = Date.now() - startTime;

    return { status: res.status, body, time };
  } catch (err) {
    return { 
      status: 0, 
      body: `Error: ${err instanceof Error ? err.message : String(err)}`,
      time: Date.now() - startTime 
    };
  }
}

/**
 * Notify AEGIS Phase 3 about vulnerability found (HITL)
 */
async function notifyHITL(
  notifyUrl: string,
  vulnerability: VulnerabilityResult
): Promise<void> {
  if (!vulnerability.vulnerable) return;

  try {
    await fetch(`${notifyUrl}/api/attacks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attackType: vulnerability.category,
        severity: vulnerability.severity,
        payload: vulnerability.payload,
        endpoint: vulnerability.endpoint,
        method: "PENTEST",
        sourceIp: "AEGIS-Phase2",
        autoHeal: true,
      }),
    });
  } catch (err) {
    console.error("Failed to notify HITL:", err);
  }
}

/**
 * Main scanner function
 */
export async function runScan(
  config: ScanConfig,
  onProgress?: ProgressCallback
): Promise<ScanResult> {
  const startTime = new Date();
  const results: VulnerabilityResult[] = [];
  const timeout = config.timeout || 10000;

  // Determine which categories to test
  const categories = config.categories || OWASP_TOP_10.map(o => o.name);
  const totalCategories = categories.length;

  onProgress?.({
    phase: "init",
    current: 0,
    total: totalCategories,
    message: `Starting OWASP Top 10 scan against ${config.targetUrl}`,
  });

  // Test each OWASP category
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    
    onProgress?.({
      phase: "scanning",
      current: i + 1,
      total: totalCategories,
      message: `Testing: ${category}`,
    });

    try {
      // Generate attack payloads using AI
      const payloads = await generateAttackPayloads(
        config.targetUrl,
        category,
        config.endpoints
      );

      // Execute each attack
      for (const attack of payloads) {
        if (config.verbose) {
          console.log(`  [*] ${attack.name}: ${attack.method} ${attack.endpoint}`);
        }

        const response = await executeAttack(config.targetUrl, attack, timeout);
        
        // Analyze response with AI
        const result = await analyzeResponse(
          attack,
          response.status,
          response.body,
          response.time
        );

        results.push(result);

        // Notify HITL if vulnerability found
        if (result.vulnerable && config.notifyUrl) {
          await notifyHITL(config.notifyUrl, result);
        }

        if (config.verbose && result.vulnerable) {
          console.log(`  [!] VULNERABLE: ${result.severity} - ${result.evidence.substring(0, 100)}`);
        }
      }
    } catch (err) {
      console.error(`Error testing ${category}:`, err);
    }
  }

  const endTime = new Date();

  // Calculate summary
  const vulnerableResults = results.filter(r => r.vulnerable);
  const summary = {
    critical: vulnerableResults.filter(r => r.severity === "Critical").length,
    high: vulnerableResults.filter(r => r.severity === "High").length,
    medium: vulnerableResults.filter(r => r.severity === "Medium").length,
    low: vulnerableResults.filter(r => r.severity === "Low").length,
    info: vulnerableResults.filter(r => r.severity === "Info").length,
  };

  onProgress?.({
    phase: "complete",
    current: totalCategories,
    total: totalCategories,
    message: `Scan complete. Found ${vulnerableResults.length} vulnerabilities.`,
  });

  return {
    target: config.targetUrl,
    startTime,
    endTime,
    duration: endTime.getTime() - startTime.getTime(),
    totalTests: results.length,
    vulnerabilities: results,
    summary,
  };
}

/**
 * Quick scan - only test common high-impact vulnerabilities
 */
export async function quickScan(
  targetUrl: string,
  onProgress?: ProgressCallback
): Promise<ScanResult> {
  return runScan({
    targetUrl,
    endpoints: ["/api/login", "/api/search", "/api/files", "/api/users"],
    categories: ["Injection", "Broken Access Control", "Security Misconfiguration"],
    timeout: 5000,
    verbose: true,
  }, onProgress);
}
