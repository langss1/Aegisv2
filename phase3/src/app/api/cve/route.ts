/**
 * AEGIS Phase 3 - CVE Monitoring API
 * 
 * Endpoints:
 * - GET /api/cve - Get current CVE status
 * - POST /api/cve/scan - Trigger manual CVE scan
 * - POST /api/cve/update - Auto-update vulnerable package
 */

import { NextRequest, NextResponse } from "next/server";
import { searchCVE, analyzeCVE, CVEResult } from "@/lib/cveMonitor";
import { sendMessage, getChatId } from "@/lib/telegram";

// In-memory store for CVE findings
const cveFindings: CVEResult[] = [];
let lastScanTime: Date | null = null;
let isScanning = false;

export async function GET() {
  return NextResponse.json({
    ok: true,
    lastScan: lastScanTime?.toISOString() || null,
    isScanning,
    findings: cveFindings,
    summary: {
      total: cveFindings.length,
      critical: cveFindings.filter(c => c.severity === "CRITICAL").length,
      high: cveFindings.filter(c => c.severity === "HIGH").length,
      medium: cveFindings.filter(c => c.severity === "MEDIUM").length,
      low: cveFindings.filter(c => c.severity === "LOW").length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, keyword, packageName } = body;

    if (action === "scan") {
      // Manual CVE scan for specific keyword
      if (!keyword) {
        return NextResponse.json(
          { ok: false, error: "keyword is required" },
          { status: 400 }
        );
      }

      isScanning = true;
      console.log(`[CVE] Scanning for: ${keyword}`);

      const results = await searchCVE(keyword, 90);
      
      // Filter to high/critical
      const critical = results.filter(
        c => c.severity === "CRITICAL" || c.severity === "HIGH"
      );

      // Add to findings (avoid duplicates)
      for (const cve of critical) {
        if (!cveFindings.find(f => f.id === cve.id)) {
          cveFindings.push(cve);
        }
      }

      lastScanTime = new Date();
      isScanning = false;

      // Notify if critical CVEs found
      if (critical.length > 0) {
        const chatId = getChatId();
        if (chatId) {
          const msg = `🔍 <b>CVE Scan Complete</b>

Keyword: <code>${keyword}</code>
Found: ${critical.length} High/Critical CVEs

${critical.slice(0, 3).map(c => 
  `• <b>${c.id}</b> (${c.severity}, CVSS ${c.cvssScore})\n  ${c.description.substring(0, 100)}...`
).join('\n\n')}

${critical.length > 3 ? `\n<i>...and ${critical.length - 3} more</i>` : ''}`;

          await sendMessage(chatId, msg);
        }
      }

      return NextResponse.json({
        ok: true,
        keyword,
        found: results.length,
        critical: critical.length,
        cves: critical,
      });
    }

    if (action === "analyze") {
      // AI analysis for specific CVE
      const cve = cveFindings.find(c => c.id === body.cveId);
      if (!cve) {
        return NextResponse.json(
          { ok: false, error: "CVE not found in findings" },
          { status: 404 }
        );
      }

      const recommendation = await analyzeCVE(cve, packageName || "Node.js application");
      cve.recommendation = recommendation;

      return NextResponse.json({
        ok: true,
        cve,
        recommendation,
      });
    }

    if (action === "dismiss") {
      // Dismiss/ignore a CVE
      const index = cveFindings.findIndex(c => c.id === body.cveId);
      if (index !== -1) {
        cveFindings.splice(index, 1);
      }

      return NextResponse.json({
        ok: true,
        dismissed: body.cveId,
      });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid action. Use: scan, analyze, dismiss" },
      { status: 400 }
    );
  } catch (err) {
    console.error("[CVE] API error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
