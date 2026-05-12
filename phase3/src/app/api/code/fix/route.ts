import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const VULNERABLE_APP_PATH = process.env.VULNERABLE_APP_PATH || "D:/refactory/AEGIS/vulnerable-app";

interface Fix {
  type: string;
  line: number;
  original: string;
  fixed: string;
  explanation: string;
}

/**
 * POST /api/code/fix - Apply a single fix to the code
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { file, fix } = body as { file: string; fix: Fix };

    if (!file || !fix) {
      return NextResponse.json({ error: "file and fix are required" }, { status: 400 });
    }

    const filePath = path.join(VULNERABLE_APP_PATH, file);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read current content
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    // Find and apply the fix
    const lineIndex = fix.line - 1;
    
    if (lineIndex < 0 || lineIndex >= lines.length) {
      return NextResponse.json({ error: `Invalid line number: ${fix.line}` }, { status: 400 });
    }

    const currentLine = lines[lineIndex];
    
    // Check if original matches (partial match is ok)
    if (fix.original && !currentLine.includes(fix.original.trim().split('\n')[0])) {
      // Try fuzzy match - the line might have been modified
      console.log(`[CodeFix] Original not found exactly, proceeding anyway`);
      console.log(`[CodeFix] Expected: ${fix.original}`);
      console.log(`[CodeFix] Found: ${currentLine}`);
    }

    // Apply the fix
    // If the fix is multi-line, handle it
    const fixedLines = fix.fixed.split('\n');
    
    if (fixedLines.length === 1) {
      // Single line replacement
      lines[lineIndex] = fix.fixed;
    } else {
      // Multi-line replacement - replace single line with multiple
      lines.splice(lineIndex, 1, ...fixedLines);
    }

    // Backup original file
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);

    // Write fixed content
    const fixedContent = lines.join("\n");
    fs.writeFileSync(filePath, fixedContent, "utf-8");

    console.log(`[CodeFix] Applied ${fix.type} fix at line ${fix.line} in ${file}`);
    console.log(`[CodeFix] Backup saved to ${backupPath}`);

    return NextResponse.json({
      ok: true,
      message: `Applied ${fix.type} fix at line ${fix.line}`,
      file: file,
      backup: backupPath,
      fix: {
        type: fix.type,
        line: fix.line,
        explanation: fix.explanation,
      },
    });
  } catch (err) {
    console.error("[CodeFix] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/code/fix - Revert to backup
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get("file");
    const backup = searchParams.get("backup");

    if (!file || !backup) {
      return NextResponse.json({ error: "file and backup are required" }, { status: 400 });
    }

    const filePath = path.join(VULNERABLE_APP_PATH, file);
    
    if (!fs.existsSync(backup)) {
      return NextResponse.json({ error: "Backup file not found" }, { status: 404 });
    }

    // Restore from backup
    fs.copyFileSync(backup, filePath);
    
    console.log(`[CodeFix] Reverted ${file} from backup ${backup}`);

    return NextResponse.json({
      ok: true,
      message: `Reverted ${file} from backup`,
    });
  } catch (err) {
    console.error("[CodeFix] Revert error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
