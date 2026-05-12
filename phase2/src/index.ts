#!/usr/bin/env node
/**
 * AEGIS Phase 2 - AI-Powered Penetration Testing
 * 
 * Flow:
 * 1. AI generates attack payloads based on OWASP Top 10
 * 2. Attacks target via ngrok (public URL)
 * 3. AI analyzes responses to determine vulnerabilities
 * 4. HITL notification sent to AEGIS Phase 3
 * 5. Self-healing triggered if vulnerable
 * 6. REPORT.md generated
 * 
 * Usage:
 *   npx tsx src/index.ts --target https://xxxx.ngrok-free.dev --aegis http://localhost:5000
 */

import { runScan, quickScan } from "./scanner/index.js";
import { generateReport, generateJSONReport } from "./reporter/reportGenerator.js";
import * as path from "path";

// Parse command line arguments
function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
      args[key] = value;
      if (value !== "true") i++;
    }
  }
  
  return args;
}

function printBanner(): void {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     █████╗ ███████╗ ██████╗ ██╗███████╗                      ║
║    ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝                      ║
║    ███████║█████╗  ██║  ███╗██║███████╗                      ║
║    ██╔══██║██╔══╝  ██║   ██║██║╚════██║                      ║
║    ██║  ██║███████╗╚██████╔╝██║███████║                      ║
║    ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝                      ║
║                                                               ║
║    Phase 2: AI-Powered Penetration Testing                   ║
║    OWASP Top 10 Security Assessment                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
}

function printUsage(): void {
  console.log(`
Usage: npx tsx src/index.ts [options]

Options:
  --target <url>     Target URL to scan (e.g., https://xxx.ngrok-free.dev)
  --aegis <url>      AEGIS Phase 3 URL for HITL notifications (default: http://localhost:5000)
  --quick            Run quick scan (only high-impact tests)
  --verbose          Show detailed output
  --output <path>    Output path for REPORT.md (default: ./reports/REPORT.md)
  --json             Also generate JSON report
  --help             Show this help message

Examples:
  # Full OWASP Top 10 scan
  npx tsx src/index.ts --target https://xxx.ngrok-free.dev --verbose

  # Quick scan with HITL notifications
  npx tsx src/index.ts --target https://xxx.ngrok-free.dev --aegis http://localhost:5000 --quick

  # Generate reports
  npx tsx src/index.ts --target https://xxx.ngrok-free.dev --output ./reports/REPORT.md --json
`);
}

async function main(): Promise<void> {
  printBanner();

  const args = parseArgs();

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const targetUrl = args.target;
  if (!targetUrl) {
    console.error("Error: --target is required");
    printUsage();
    process.exit(1);
  }

  const aegisUrl = args.aegis || "http://localhost:5000";
  const outputPath = args.output || path.join(process.cwd(), "reports", "REPORT.md");
  const verbose = args.verbose === "true";
  const quick = args.quick === "true";
  const generateJson = args.json === "true";

  console.log(`[*] Target: ${targetUrl}`);
  console.log(`[*] AEGIS Phase 3: ${aegisUrl}`);
  console.log(`[*] Mode: ${quick ? "Quick Scan" : "Full OWASP Top 10"}`);
  console.log(`[*] Output: ${outputPath}`);
  console.log("");

  // Check environment
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error("Error: DEEPSEEK_API_KEY environment variable is required");
    process.exit(1);
  }

  try {
    // Run scan
    console.log("[*] Starting security scan...\n");
    
    const result = quick 
      ? await quickScan(targetUrl, (p) => {
          console.log(`[${p.current}/${p.total}] ${p.message}`);
        })
      : await runScan({
          targetUrl,
          endpoints: [
            "/api/login",
            "/api/search", 
            "/api/files",
            "/api/users",
            "/api/posts",
            "/api/posts/1/comments",
            "/api/tools/ping",
            "/api/transactions",
          ],
          timeout: 10000,
          verbose,
          notifyUrl: aegisUrl,
          telegramNotify: true,
        }, (p) => {
          console.log(`[${p.current}/${p.total}] ${p.message}`);
        });

    // Generate reports
    console.log("\n[*] Generating report...");
    const report = await generateReport(result, outputPath);
    
    if (generateJson) {
      const jsonPath = outputPath.replace(/\.md$/, ".json");
      const jsonReport = generateJSONReport(result);
      const fs = await import("fs");
      fs.writeFileSync(jsonPath, jsonReport);
      console.log(`[*] JSON report saved to: ${jsonPath}`);
    }

    console.log(`[*] Report saved to: ${outputPath}`);

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("SCAN COMPLETE");
    console.log("=".repeat(60));
    console.log(`Total Tests:        ${result.totalTests}`);
    console.log(`Vulnerabilities:    ${result.vulnerabilities.filter(v => v.vulnerable).length}`);
    console.log(`  - Critical:       ${result.summary.critical}`);
    console.log(`  - High:           ${result.summary.high}`);
    console.log(`  - Medium:         ${result.summary.medium}`);
    console.log(`  - Low:            ${result.summary.low}`);
    console.log(`Duration:           ${Math.round(result.duration / 1000)}s`);
    console.log("=".repeat(60));

    if (result.summary.critical > 0 || result.summary.high > 0) {
      console.log("\n[!] CRITICAL/HIGH vulnerabilities found!");
      console.log("[!] Self-healing has been triggered via AEGIS Phase 3");
      console.log("[!] Check Telegram for HITL approval requests");
    }

  } catch (err) {
    console.error("Scan failed:", err);
    process.exit(1);
  }
}

main();
