import { NextRequest, NextResponse } from "next/server";
import { analyzeCode } from "@/lib/codeAnalyzer";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Store for target config
let targetConfig = {
  ngrokUrl: "",
  localPath: process.env.VULNERABLE_APP_PATH || "D:/refactory/AEGIS/vulnerable-app",
  lastAnalysis: null as any,
  lastUpdated: 0,
};

/**
 * GET /api/code - Get source code and vulnerability analysis
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file") || "server.js";
  
  try {
    const filePath = path.join(targetConfig.localPath, file);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        error: "File not found",
        availableFiles: getAvailableFiles(targetConfig.localPath)
      }, { status: 404 });
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    
    // Get cached analysis or analyze fresh
    let analysis = targetConfig.lastAnalysis;
    if (!analysis || Date.now() - targetConfig.lastUpdated > 60000) {
      analysis = await analyzeCode(content, filePath);
      targetConfig.lastAnalysis = analysis;
      targetConfig.lastUpdated = Date.now();
    }
    
    return NextResponse.json({
      ok: true,
      config: {
        ngrokUrl: targetConfig.ngrokUrl,
        localPath: targetConfig.localPath,
      },
      file: {
        name: file,
        path: filePath,
        lines: lines.length,
        content: content,
      },
      analysis: {
        vulnerabilities: analysis.vulnerabilities,
        fixes: analysis.fixes,
        aiAnalysis: analysis.aiAnalysis,
        language: analysis.language,
      },
      availableFiles: getAvailableFiles(targetConfig.localPath),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * POST /api/code - Update target config (ngrok URL, path)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.ngrokUrl !== undefined) {
      targetConfig.ngrokUrl = body.ngrokUrl;
    }
    
    if (body.localPath !== undefined) {
      if (fs.existsSync(body.localPath)) {
        targetConfig.localPath = body.localPath;
        targetConfig.lastAnalysis = null; // Reset analysis
      } else {
        return NextResponse.json({ error: "Path not found" }, { status: 400 });
      }
    }
    
    // Force re-analyze if requested
    if (body.reanalyze) {
      const mainFile = path.join(targetConfig.localPath, "server.js");
      if (fs.existsSync(mainFile)) {
        const content = fs.readFileSync(mainFile, "utf-8");
        targetConfig.lastAnalysis = await analyzeCode(content, mainFile);
        targetConfig.lastUpdated = Date.now();
      }
    }
    
    return NextResponse.json({
      ok: true,
      config: {
        ngrokUrl: targetConfig.ngrokUrl,
        localPath: targetConfig.localPath,
      },
      message: "Configuration updated",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * Get list of JS/TS files in directory
 */
function getAvailableFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if ([".js", ".ts", ".jsx", ".tsx", ".php", ".py"].includes(ext)) {
          files.push(entry.name);
        }
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
  return files;
}
