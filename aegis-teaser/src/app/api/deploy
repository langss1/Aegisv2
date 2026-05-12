/**
 * AEGIS Phase 2 - Project Deployment API
 * 
 * Handles:
 * 1. Upload project (zip file)
 * 2. Extract and setup
 * 3. Install dependencies
 * 4. Run the project
 * 5. Create ngrok tunnel
 * 6. Return public URL for AI pentest
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, rm } from "fs/promises";
import { existsSync } from "fs";
import { exec, spawn, ChildProcess } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

// Store deployment state
interface DeploymentState {
  id: string;
  status: "uploading" | "extracting" | "installing" | "starting" | "tunneling" | "ready" | "error" | "stopped";
  projectPath: string;
  projectName: string;
  port: number;
  ngrokUrl: string | null;
  localUrl: string | null;
  logs: string[];
  error: string | null;
  process: ChildProcess | null;
  startedAt: number;
}

// Global state (use globalThis for HMR persistence)
const g = globalThis as typeof globalThis & { 
  __aegisDeployments?: Map<string, DeploymentState>;
  __aegisCurrentDeployment?: DeploymentState | null;
};

if (!g.__aegisDeployments) {
  g.__aegisDeployments = new Map();
}

const deployments = g.__aegisDeployments;
const UPLOADS_DIR = path.join(process.cwd(), "..", "uploads");
const BASE_PORT = 4000;

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function addLog(deployment: DeploymentState, message: string) {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
  deployment.logs.push(`[${timestamp}] ${message}`);
  console.log(`[Deploy ${deployment.id}] ${message}`);
}

/**
 * GET /api/deploy - Get current deployment status
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  
  if (id) {
    const deployment = deployments.get(id);
    if (!deployment) {
      return NextResponse.json({ ok: false, error: "Deployment not found" }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      deployment: {
        id: deployment.id,
        status: deployment.status,
        projectName: deployment.projectName,
        port: deployment.port,
        ngrokUrl: deployment.ngrokUrl,
        localUrl: deployment.localUrl,
        logs: deployment.logs,
        error: deployment.error,
        startedAt: deployment.startedAt,
      },
    });
  }

  // Return current active deployment
  const current = g.__aegisCurrentDeployment;
  return NextResponse.json({
    ok: true,
    currentDeployment: current ? {
      id: current.id,
      status: current.status,
      projectName: current.projectName,
      ngrokUrl: current.ngrokUrl,
      localUrl: current.localUrl,
      port: current.port,
    } : null,
    allDeployments: Array.from(deployments.values()).map(d => ({
      id: d.id,
      status: d.status,
      projectName: d.projectName,
      ngrokUrl: d.ngrokUrl,
    })),
  });
}

/**
 * POST /api/deploy - Deploy a new project
 * 
 * Body can be:
 * - FormData with 'file' (zip file)
 * - JSON with 'repoUrl' (git clone)
 * - JSON with 'projectPath' (existing path)
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const deploymentId = `deploy_${randomId()}`;
    const port = BASE_PORT + deployments.size;

    const deployment: DeploymentState = {
      id: deploymentId,
      status: "uploading",
      projectPath: "",
      projectName: "",
      port,
      ngrokUrl: null,
      localUrl: `http://localhost:${port}`,
      logs: [],
      error: null,
      process: null,
      startedAt: Date.now(),
    };

    deployments.set(deploymentId, deployment);
    g.__aegisCurrentDeployment = deployment;

    // Ensure uploads directory exists
    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true });
    }

    let projectDir: string;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      addLog(deployment, "Receiving uploaded file...");
      
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      
      if (!file) {
        deployment.status = "error";
        deployment.error = "No file provided";
        return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
      }

      const fileName = file.name;
      deployment.projectName = fileName.replace(/\.(zip|tar\.gz|tgz)$/, "");
      projectDir = path.join(UPLOADS_DIR, `${deploymentId}_${deployment.projectName}`);
      
      addLog(deployment, `Received: ${fileName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

      // Save the file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const zipPath = path.join(UPLOADS_DIR, `${deploymentId}_${fileName}`);
      await writeFile(zipPath, buffer);

      // Extract
      deployment.status = "extracting";
      addLog(deployment, "Extracting archive...");
      
      await mkdir(projectDir, { recursive: true });

      if (fileName.endsWith(".zip")) {
        // Use PowerShell to extract on Windows
        await execAsync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${projectDir}' -Force"`, {
          timeout: 60000,
        });
      } else {
        await execAsync(`tar -xzf "${zipPath}" -C "${projectDir}"`, { timeout: 60000 });
      }

      // Clean up zip
      await rm(zipPath, { force: true });
      addLog(deployment, "Extraction complete");

    } else {
      // Handle JSON body
      const body = await req.json();
      
      if (body.repoUrl) {
        // Git clone
        addLog(deployment, `Cloning repository: ${body.repoUrl}`);
        deployment.projectName = body.repoUrl.split("/").pop()?.replace(".git", "") || "project";
        projectDir = path.join(UPLOADS_DIR, `${deploymentId}_${deployment.projectName}`);
        
        deployment.status = "extracting";
        await execAsync(`git clone "${body.repoUrl}" "${projectDir}"`, { timeout: 120000 });
        addLog(deployment, "Clone complete");
        
      } else if (body.projectPath) {
        // Use existing path
        projectDir = body.projectPath;
        deployment.projectName = path.basename(projectDir);
        addLog(deployment, `Using existing project: ${projectDir}`);
        
      } else {
        deployment.status = "error";
        deployment.error = "No file, repoUrl, or projectPath provided";
        return NextResponse.json({ ok: false, error: deployment.error }, { status: 400 });
      }
    }

    deployment.projectPath = projectDir;

    // Find the actual project directory (might be nested)
    const findPackageJson = async (dir: string, depth = 0): Promise<string | null> => {
      if (depth > 3) return null;
      if (existsSync(path.join(dir, "package.json"))) return dir;
      
      const { readdir } = await import("fs/promises");
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
          const found = await findPackageJson(path.join(dir, entry.name), depth + 1);
          if (found) return found;
        }
      }
      return null;
    };

    const actualProjectDir = await findPackageJson(projectDir);
    if (actualProjectDir) {
      deployment.projectPath = actualProjectDir;
      addLog(deployment, `Found package.json at: ${actualProjectDir}`);
    }

    // Install dependencies
    deployment.status = "installing";
    addLog(deployment, "Installing dependencies...");
    
    try {
      await execAsync("npm install", { 
        cwd: deployment.projectPath,
        timeout: 180000, // 3 minutes
      });
      addLog(deployment, "Dependencies installed");
    } catch (err: any) {
      addLog(deployment, `Warning: npm install had issues: ${err.message}`);
    }

    // Start the project
    deployment.status = "starting";
    addLog(deployment, `Starting project on port ${port}...`);

    // Determine start command
    let startCommand = "npm start";
    const pkgJsonPath = path.join(deployment.projectPath, "package.json");
    if (existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(await (await import("fs/promises")).readFile(pkgJsonPath, "utf-8"));
      if (pkgJson.scripts?.dev) {
        startCommand = "npm run dev";
      } else if (pkgJson.scripts?.start) {
        startCommand = "npm start";
      } else if (pkgJson.main) {
        startCommand = `node ${pkgJson.main}`;
      }
    }

    // Check for server.js or app.js
    if (existsSync(path.join(deployment.projectPath, "server.js"))) {
      startCommand = "node server.js";
    } else if (existsSync(path.join(deployment.projectPath, "app.js"))) {
      startCommand = "node app.js";
    } else if (existsSync(path.join(deployment.projectPath, "index.js"))) {
      startCommand = "node index.js";
    }

    addLog(deployment, `Running: PORT=${port} ${startCommand}`);

    // Start the server process
    const [cmd, ...args] = startCommand.split(" ");
    const serverProcess = spawn(cmd, args, {
      cwd: deployment.projectPath,
      env: { ...process.env, PORT: String(port) },
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    deployment.process = serverProcess;

    serverProcess.stdout?.on("data", (data) => {
      addLog(deployment, `[stdout] ${data.toString().trim()}`);
    });

    serverProcess.stderr?.on("data", (data) => {
      addLog(deployment, `[stderr] ${data.toString().trim()}`);
    });

    serverProcess.on("error", (err) => {
      addLog(deployment, `Process error: ${err.message}`);
      deployment.status = "error";
      deployment.error = err.message;
    });

    serverProcess.on("exit", (code) => {
      addLog(deployment, `Process exited with code ${code}`);
      if (deployment.status !== "stopped") {
        deployment.status = "error";
        deployment.error = `Process exited with code ${code}`;
      }
    });

    // Wait for server to be ready
    addLog(deployment, "Waiting for server to be ready...");
    await new Promise(r => setTimeout(r, 3000));

    // Start ngrok tunnel
    deployment.status = "tunneling";
    addLog(deployment, "Creating ngrok tunnel...");

    try {
      // Kill existing ngrok if any
      try {
        await execAsync("taskkill /F /IM ngrok.exe", { timeout: 5000 });
        await new Promise(r => setTimeout(r, 1000));
      } catch {}

      // Start ngrok
      spawn("ngrok", ["http", String(port)], {
        detached: true,
        stdio: "ignore",
        shell: true,
      });

      // Wait for ngrok to start
      await new Promise(r => setTimeout(r, 3000));

      // Get ngrok URL
      const ngrokRes = await fetch("http://localhost:4040/api/tunnels");
      const ngrokData = await ngrokRes.json();
      const tunnel = ngrokData.tunnels?.find((t: any) => t.proto === "https");
      
      if (tunnel) {
        deployment.ngrokUrl = tunnel.public_url;
        addLog(deployment, `Ngrok tunnel created: ${deployment.ngrokUrl}`);
      } else {
        addLog(deployment, "Warning: Could not get ngrok URL");
      }
    } catch (err: any) {
      addLog(deployment, `Ngrok error: ${err.message}`);
    }

    deployment.status = "ready";
    addLog(deployment, "Deployment ready!");

    return NextResponse.json({
      ok: true,
      deployment: {
        id: deployment.id,
        status: deployment.status,
        projectName: deployment.projectName,
        port: deployment.port,
        localUrl: deployment.localUrl,
        ngrokUrl: deployment.ngrokUrl,
        logs: deployment.logs,
      },
    });

  } catch (err: any) {
    console.error("[Deploy] Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/deploy - Stop a deployment
 */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  }

  const deployment = deployments.get(id);
  if (!deployment) {
    return NextResponse.json({ ok: false, error: "Deployment not found" }, { status: 404 });
  }

  // Kill the process
  if (deployment.process) {
    deployment.process.kill();
  }

  deployment.status = "stopped";
  addLog(deployment, "Deployment stopped");

  // Clean up
  if (g.__aegisCurrentDeployment?.id === id) {
    g.__aegisCurrentDeployment = null;
  }

  return NextResponse.json({
    ok: true,
    message: "Deployment stopped",
  });
}
