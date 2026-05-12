import { NextRequest, NextResponse } from "next/server";
import { analyzeCode, applyFixes, generateReport, type AnalysisResult, type CodeFix } from "@/lib/codeAnalyzer";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Store for tracking fixes
interface FixRecord {
  id: string;
  filePath: string;
  originalContent: string;
  fixedContent: string;
  fixes: CodeFix[];
  appliedAt: number;
  healingId?: string;
  status: "applied" | "reverted" | "committed";
  gitCommit?: string;
}

const fixRecords = new Map<string, FixRecord>();

/**
 * POST /api/autofix - Analyze and fix vulnerable code
 * Body: { targetPath: string, healingId?: string, autoCommit?: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetPath, healingId, autoCommit = false, dryRun = false } = body;

    if (!targetPath) {
      return NextResponse.json({ error: "targetPath is required" }, { status: 400 });
    }

    // Resolve the path
    const resolvedPath = path.resolve(targetPath);
    
    // Check if path exists
    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: `Path not found: ${resolvedPath}` }, { status: 404 });
    }

    const stats = fs.statSync(resolvedPath);
    const filesToAnalyze: string[] = [];

    if (stats.isDirectory()) {
      // Recursively find all JS/TS files
      findFiles(resolvedPath, filesToAnalyze);
    } else {
      filesToAnalyze.push(resolvedPath);
    }

    console.log(`[AutoFix] Analyzing ${filesToAnalyze.length} files...`);

    const results: AnalysisResult[] = [];
    const appliedFixes: FixRecord[] = [];

    for (const filePath of filesToAnalyze) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        console.log(`[AutoFix] Analyzing ${filePath} with DeepSeek AI...`);
        const result = await analyzeCode(content, filePath);
        results.push(result);
        
        if (result.aiAnalysis) {
          console.log(`[AutoFix] AI Analysis: ${result.aiAnalysis}`);
        }

        if (result.vulnerabilities.length > 0 && result.fixes.length > 0) {
          console.log(`[AutoFix] Found ${result.vulnerabilities.length} vulnerabilities in ${filePath}`);

          if (!dryRun) {
            // Apply fixes
            const fixedContent = applyFixes(content, result.fixes);
            
            // Create fix record
            const fixId = `fix_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            const record: FixRecord = {
              id: fixId,
              filePath,
              originalContent: content,
              fixedContent,
              fixes: result.fixes,
              appliedAt: Date.now(),
              healingId,
              status: "applied",
            };

            // Write fixed content
            fs.writeFileSync(filePath, fixedContent, "utf-8");
            console.log(`[AutoFix] Applied ${result.fixes.length} fixes to ${filePath}`);

            // Git commit if requested
            if (autoCommit) {
              try {
                const commitMsg = `[AEGIS] Auto-fix: ${result.vulnerabilities.map(v => v.type).join(", ")} in ${path.basename(filePath)}`;
                await execAsync(`git add "${filePath}"`, { cwd: path.dirname(filePath) });
                const { stdout } = await execAsync(`git commit -m "${commitMsg}"`, { cwd: path.dirname(filePath) });
                record.gitCommit = stdout.trim();
                record.status = "committed";
                console.log(`[AutoFix] Committed fix: ${commitMsg}`);
              } catch (gitErr) {
                console.error(`[AutoFix] Git commit failed:`, gitErr);
              }
            }

            fixRecords.set(fixId, record);
            appliedFixes.push(record);
          }
        }
      } catch (fileErr) {
        console.error(`[AutoFix] Error processing ${filePath}:`, fileErr);
      }
    }

    // Generate report
    const report = generateReport(results);
    const totalVulns = results.reduce((sum, r) => sum + r.vulnerabilities.length, 0);
    const totalFixes = results.reduce((sum, r) => sum + r.fixes.length, 0);

    return NextResponse.json({
      ok: true,
      summary: {
        filesAnalyzed: filesToAnalyze.length,
        vulnerabilitiesFound: totalVulns,
        fixesGenerated: totalFixes,
        fixesApplied: dryRun ? 0 : appliedFixes.length,
        dryRun,
      },
      results: results.map(r => ({
        filePath: r.filePath,
        language: r.language,
        aiAnalysis: r.aiAnalysis,
        vulnerabilities: r.vulnerabilities.map(v => ({
          type: v.type,
          severity: v.severity,
          line: v.line,
          code: v.code,
          description: v.description,
        })),
        fixes: r.fixes.map(f => ({
          type: f.type,
          line: f.line,
          original: f.original,
          fixed: f.fixed,
          explanation: f.explanation,
        })),
      })),
      appliedFixes: appliedFixes.map(f => ({
        id: f.id,
        filePath: f.filePath,
        fixCount: f.fixes.length,
        status: f.status,
        gitCommit: f.gitCommit,
      })),
      report,
    });
  } catch (err) {
    console.error("[AutoFix] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * GET /api/autofix - Get fix history
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fixId = searchParams.get("id");

  if (fixId) {
    const record = fixRecords.get(fixId);
    if (!record) {
      return NextResponse.json({ error: "Fix not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, fix: record });
  }

  // Return all fix records
  const records = Array.from(fixRecords.values()).sort((a, b) => b.appliedAt - a.appliedAt);
  return NextResponse.json({ ok: true, fixes: records, count: records.length });
}

/**
 * DELETE /api/autofix - Revert a fix
 * Query: ?id=fix_xxx
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fixId = searchParams.get("id");

  if (!fixId) {
    return NextResponse.json({ error: "Fix ID is required" }, { status: 400 });
  }

  const record = fixRecords.get(fixId);
  if (!record) {
    return NextResponse.json({ error: "Fix not found" }, { status: 404 });
  }

  if (record.status === "reverted") {
    return NextResponse.json({ error: "Fix already reverted" }, { status: 400 });
  }

  try {
    // Restore original content
    fs.writeFileSync(record.filePath, record.originalContent, "utf-8");
    record.status = "reverted";
    
    console.log(`[AutoFix] Reverted fix ${fixId} for ${record.filePath}`);

    return NextResponse.json({
      ok: true,
      message: `Reverted fix for ${record.filePath}`,
      fix: {
        id: record.id,
        filePath: record.filePath,
        status: record.status,
      },
    });
  } catch (err) {
    console.error("[AutoFix] Revert error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * Recursively find JS/TS files
 */
function findFiles(dir: string, files: string[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules and hidden directories
    if (entry.name.startsWith(".") || entry.name === "node_modules") {
      continue;
    }
    
    if (entry.isDirectory()) {
      findFiles(fullPath, files);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".js", ".ts", ".jsx", ".tsx", ".php", ".py"].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
}
