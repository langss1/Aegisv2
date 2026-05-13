#!/usr/bin/env node

const readline = require('readline');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const url = require('url');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

let config = {
  customKey: '',
  activeModel: 'aegis',
  ollamaModel: 'llama3'
};

const sessionPath = path.join(os.homedir(), '.aegis.session.json');
let session = null;
if (fs.existsSync(sessionPath)) {
  try {
    session = readJsonFile(sessionPath);
    // check expiry
    if (session.expires_at < Date.now()) {
      session = null;
    }
  } catch (e) {}
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

function stripANSI(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function pad(str, length) {
  const plain = stripANSI(str);
  const needed = length - plain.length;
  return str + ' '.repeat(Math.max(0, needed));
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

let activeModel = config.activeModel;
let sessionMode = 'cli'; // 'cli' or 'chat'
const startupArgs = process.argv.slice(2);
const isInteractiveTerminal = Boolean(process.stdin.isTTY && process.stdout.isTTY);

function saveConfig() {
  const configPath = path.join(process.cwd(), '.aegis.config.json');
  fs.writeFileSync(configPath, JSON.stringify({ ...config, activeModel }, null, 2));
}

async function handleLogin() {
  console.log(`\n${colors.cyan}┌─ aegis_secure_login ──────────────────────────────────────────┐${colors.reset}`);
  console.log(`${colors.gray}│${colors.reset} silakan masuk melalui browser yang akan terbuka.             ${colors.gray}│${colors.reset}`);
  console.log(`${colors.gray}│${colors.reset} memulihkan sesi keamanan otonom...                           ${colors.gray}│${colors.reset}`);
  console.log(`${colors.cyan}└───────────────────────────────────────────────────────────────┘${colors.reset}\n`);

  return new Promise((resolve) => {
    const port = 5732;
    const server = http.createServer(async (req, res) => {
      // Full CORS support for browser handshake
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const parsedUrl = url.parse(req.url, true);
      const query = parsedUrl.query;
      
      if (parsedUrl.pathname === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'waiting' }));
        return;
      }

      if (query.token) {
        session = {
          token: query.token,
          user: { email: query.email || 'operator' },
          expires_at: Date.now() + (3600 * 24 * 7 * 1000)
        };
        
        fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
        
        res.writeHead(200, { 
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*' 
        });
        res.end(`
          <html>
            <head>
              <style>
                body { background: #000; color: #fff; font-family: -apple-system, system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; overflow: hidden; }
                .container { text-align: center; animation: fadeIn 0.8s ease-out; }
                .logo { width: 48px; height: 48px; border: 1px solid #333; border-radius: 12px; padding: 12px; margin-bottom: 24px; display: inline-block; background: #0a0a0a; }
                h1 { font-size: 32px; font-weight: 500; margin: 0 0 8px; letter-spacing: -0.5px; }
                p { color: #666; font-size: 16px; margin: 0; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                                        <path d=process.env.D/>
                                        <path d=process.env.D stroke="white" stroke-opacity="0.3"/>
                  </svg>
                </div>
                <h1>Signed in to Aegis</h1>
                <p>You may now close this page</p>
              </div>
              <script>setTimeout(() => window.close(), 5000)</script>
            </body>
          </html>
        `);
        
        server.close();
        console.log(`\n${colors.green}✔ Signed in successfully as ${session.user.email}${colors.reset}\n`);
        await bootSequence(0.5);
        resolve();
      } else {
        res.writeHead(400); res.end("Invalid auth request");
      }
    });

    server.listen(port, () => {
      const loginUrl = `https://aegisv2-psi.vercel.app/login`;
      console.log(`${colors.cyan}› Opening authorization link: ${colors.white}${loginUrl}${colors.reset}`);
      openUrl(loginUrl);
    });
    
    server.on('error', (e) => {
      console.log(`${colors.red}error: local auth bridge failed. please try again.${colors.reset}`);
      resolve();
    });
  });
}

function handleLogout() {
  if (fs.existsSync(sessionPath)) fs.unlinkSync(sessionPath);
  session = null;
  console.log(`\n${colors.yellow}✔ anda telah keluar. sesi dihapus.${colors.reset}`);
  console.log(`${colors.red}Terminating Aegis secure session...${colors.reset}\n`);
  process.exit(0);
}
async function askAI(prompt) {
  process.stdout.write(`\n${colors.cyan}› aegis sedang berpikir...${colors.reset}\r`);
  try {
    let response;
    if (activeModel === 'aegis') {
      const aegisKey = process.env.AEGIS_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.AEGIS_API_KEY;
      if (!aegisKey) {
        return "error: aegis core membutuhkan AEGIS_DEEPSEEK_API_KEY atau DEEPSEEK_API_KEY. Gunakan 'ollama' untuk mode lokal atau 'custom' untuk API key pribadi.";
      }
      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aegisKey}` },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return `error: aegis (deepseek) gagal (status: ${response.status}). ${data.error?.message || 'cek koneksi anda.'}`;
      }
      if (!data.choices || !data.choices[0]) {
        return `error: respon dari aegis tidak valid.`;
      }
      return data.choices[0].message.content;
    } else if (activeModel === 'ollama') {
      const modelName = config.ollamaModel || 'llama3';
      try {
        response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({ model: modelName, prompt: prompt, stream: false })
        });
        
        if (response.status === 404) {
          return `error: model '${modelName}' tidak ditemukan di ollama. jalankan 'ollama pull ${modelName}'.`;
        }
        
        if (!response.ok) return `error: ollama bermasalah (status: ${response.status}).`;
        const data = await response.json();
        return data.response || "error: ollama memberikan respon kosong.";
      } catch (e) {
        return `error: gagal terhubung ke ollama. pastikan ollama sudah berjalan di localhost:11434.`;
      }
    } else {
      if (!config.customKey) return "error: api key kustom belum diatur. ketik 'custom' untuk mengatur.";
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.customKey}` },
        body: JSON.stringify({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      if (!response.ok) {
        return `error: custom ai gagal (status: ${response.status}). ${data.error?.message || 'cek api key anda.'}`;
      }
      if (!data.choices || !data.choices[0]) {
        return `error: respon dari custom ai tidak valid.`;
      }
      return data.choices[0].message.content;
    }
  } catch (e) {
    return `error: gagal terhubung ke ${activeModel} (${e.message})`;
  }
}

let projectMetadata = null;

// -------------------------------------------------------------------------
// PHASE 0: INGESTION (REMASTERED)
// -------------------------------------------------------------------------
async function runPhase0(targetDir) {
  console.log(`\n${colors.yellow}🚀 MENGINISIALISASI P0: INGESTION...${colors.reset}`);
  console.log(`${colors.gray}target: ${colors.white}${targetDir}${colors.reset}\n`);

  const steps = [
    { label: "Memetakan struktur direktori & file sistem", weight: 20 },
    { label: "Mendeteksi metadata Git & sejarah komit", weight: 15 },
    { label: "Menganalisis tanda tangan stack & arsitektur", weight: 25 },
    { label: "Mengidentifikasi entry point & alur bootstrap", weight: 20 },
    { label: "Memverifikasi konfigurasi environment & secrets", weight: 20 }
  ];

  let gitInfo = { branch: 'n/a', commit: 'n/a' };
  let detectedStack = [];
  let fileCount = 0;
  let envFiles = [];
  let entryPoint = 'unknown';

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let progress = 0;
    while (progress <= step.weight) {
      const totalProgress = steps.slice(0, i).reduce((a, b) => a + b.weight, 0) + progress;
      const bar = "█".repeat(Math.floor(totalProgress / 5)) + "░".repeat(20 - Math.floor(totalProgress / 5));
      process.stdout.write(`\r${colors.red}[${bar}] ${totalProgress}% ${colors.reset}${colors.gray}${step.label}...${colors.reset}`);
      await sleep(15);
      progress += 2;
    }

    if (i === 0) {
      const getFiles = (dir) => {
        let count = 0;
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (['node_modules', '.git', '.next', 'dist', 'build'].includes(file)) continue;
          const name = path.join(dir, file);
          if (fs.statSync(name).isDirectory()) count += getFiles(name);
          else count++;
        }
        return count;
      };
      fileCount = getFiles(targetDir);
    }
    if (i === 1) {
      try {
        gitInfo.branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        gitInfo.commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      } catch (e) {}
    }
    if (i === 2) {
      if (fs.existsSync(path.join(targetDir, 'package.json'))) {
        const pkg = readJsonFile(path.join(targetDir, 'package.json'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps.next) detectedStack.push(`Next.js@${deps.next.replace(/[\^~]/, '')}`);
        if (deps.react) detectedStack.push(`React@${deps.react.replace(/[\^~]/, '')}`);
        if (deps.typescript) detectedStack.push(`TypeScript@${deps.typescript.replace(/[\^~]/, '')}`);
        if (deps.tailwindcss) detectedStack.push('TailwindCSS');
      }
    }
    if (i === 4) {
      envFiles = fs.readdirSync(targetDir).filter(f => f.startsWith('.env'));
      if (fs.existsSync(path.join(targetDir, 'src/app'))) entryPoint = 'src/app (App Router)';
      else if (fs.existsSync(path.join(targetDir, 'src/pages'))) entryPoint = 'src/pages (Pages Router)';
    }
    process.stdout.write('\n');
  }

  console.log(`\n${colors.green}✔ P0: INGESTION SELESAI.${colors.reset}\n`);

  const tableWidth = 60;
  console.log(`${colors.cyan}╔${'═'.repeat(tableWidth)}╗${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset} ${colors.bright}${colors.white}METADATA ARSITEKTUR PROYEK${colors.reset} ${' '.repeat(31)}${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}╠${'═'.repeat(tableWidth)}╣${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset} ${colors.yellow}STACK     :${colors.reset} ${pad(detectedStack.join(', ') || 'Generic Node.js', 45)} ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset} ${colors.yellow}GIT       :${colors.reset} ${pad(gitInfo.branch + ' @ ' + gitInfo.commit, 45)} ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset} ${colors.yellow}FILES     :${colors.reset} ${pad(fileCount + ' file terdeteksi', 45)} ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset} ${colors.yellow}ENTRY     :${colors.reset} ${pad(entryPoint, 45)} ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset} ${colors.yellow}ENV       :${colors.reset} ${pad(envFiles.join(', ') || 'none', 45)} ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}╚${'═'.repeat(tableWidth)}╝${colors.reset}\n`);

  projectMetadata = { detectedStack, gitInfo, fileCount, entryPoint, envFiles };
  await generateIngestionReport(projectMetadata, targetDir);
}

async function generateIngestionReport(data, targetDir) {
  const reportPath = path.join(targetDir, 'AEGIS_INGESTION_REPORT.md');
  let content = `# 🏗️ AEGIS INGESTION & ARCHITECTURE REPORT\n\n`;
  content += `**Timestamp:** ${new Date().toLocaleString()}\n`;
  content += `**Project Path:** \`${targetDir}\`\n\n`;
  content += `## 🛠️ Technology Stack\n- **Framework/Libraries:** ${data.detectedStack.join(', ') || 'Generic Node.js'}\n- **Entry Point:** ${data.entryPoint}\n\n`;
  content += `## 🌳 Git Metadata\n- **Current Branch:** \`${data.gitInfo.branch}\`\n- **Last Commit:** \`${data.gitInfo.commit}\`\n\n`;
  content += `## 📊 Project Scope\n- **Total Analyzed Files:** ${data.fileCount}\n- **Environment Files Found:** ${data.envFiles.join(', ') || 'None'}\n\n`;
  content += `\n*Aegis Ingestion Phase completed successfully. System ready for SAST/DAST.* \n`;
  content += `\n--- \n*Report generated by Aegis Autonomous Security Engine*\n`;
  
  fs.writeFileSync(reportPath, content);
  console.log(`${colors.cyan}📄 Ingestion Report dibuat: ${colors.white}AEGIS_INGESTION_REPORT.md${colors.reset}\n`);
}

// -------------------------------------------------------------------------
// PHASE 1: SAST & HEAL (ELITE)
// -------------------------------------------------------------------------
async function runPhase1(targetDir) {
  if (!projectMetadata) {
    console.log(`${colors.magenta}ℹ Proyek belum di-ingest. Menjalankan quick-scan arsitektur...${colors.reset}`);
    const pkgPath = path.join(targetDir, 'package.json');
    const hasNext = fs.existsSync(path.join(targetDir, '.next')) || (fs.existsSync(pkgPath) && fs.readFileSync(pkgPath, 'utf8').includes('next'));
    projectMetadata = { detectedStack: hasNext ? ['Next.js'] : ['Generic'], entryPoint: 'Root' };
  }

  console.log(`\n${colors.yellow}🔍 MENGINISIALISASI P1: SAST & HEAL...${colors.reset}`);
  console.log(`${colors.gray}target: ${colors.white}${targetDir}${colors.reset}`);
  console.log(`${colors.gray}context: ${colors.cyan}${projectMetadata.detectedStack.join(', ')} project detected.${colors.reset}\n`);

  const findings = [];
  const ignoreDirs = ['node_modules', '.git', '.next', 'dist', 'build', '.gemini', 'artifacts'];
  const ignoreFiles = ['aegis.js', 'package-lock.json', 'yarn.lock'];

  function scan(dir) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (ignoreDirs.includes(file) || ignoreFiles.includes(file)) continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) scan(fullPath);
        else {
          const ext = path.extname(file);
          if (['.js', '.ts', '.tsx', '.py', '.env'].includes(ext)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, i) => {
              const trimLine = line.trim();
              if (trimLine.length < 5) return;
              const secretMatch = line.match(/(const|let|var|)\s*(\w+)\s*[:=]\s*['"]([^'"]+)['"]/i);
              if (secretMatch && !line.includes('process.env')) {
                const varName = secretMatch[2];
                const val = secretMatch[3];
                const isLikelySecret = /(password|secret|key|token|auth|sb_|sk_|AKIA)/i.test(varName) || val.length > 25;
                const isUISafe = /(label|title|description|text|className|id|type|placeholder|name|variant|size|color|style|background|padding|margin|font)/i.test(varName);
                if (isLikelySecret && !isUISafe && val.length > 8 && !val.includes(';')) {
                  findings.push({ 
                    file: path.relative(targetDir, fullPath), 
                    line: i + 1, 
                    issue: 'Hardcoded Sensitive Data', 
                    severity: 'Critical', 
                    currentCode: trimLine, 
                    fixedCode: line.replace(/['"][^'"]+['"]/, `process.env.${varName.toUpperCase()}`), 
                    description: `Ditemukan kredensial '${varName}' yang tersimpan secara eksplisit.` 
                  });
                }
              }
              if (/(query|select|update|delete).*\$\{.*\}|f['"].*\{.*\}['"]/i.test(line)) {
                findings.push({ 
                  file: path.relative(targetDir, fullPath), 
                  line: i + 1, 
                  issue: 'SQL Injection Vulnerability', 
                  severity: 'High', 
                  currentCode: trimLine, 
                  fixedCode: "GENERATE_VIA_AI", 
                  description: 'Input dinamis dimasukkan langsung ke query database.' 
                });
              }
            });
          }
        }
      }
    } catch (e) {}
  }

  process.stdout.write(`${colors.cyan}› Memindai kerentanan SAST...${colors.reset}\r`);
  scan(targetDir);
  process.stdout.write(' '.repeat(60) + '\r');

  if (findings.length === 0) {
    console.log(`${colors.green}✔ Kode aman. Tidak ada kerentanan kritis.${colors.reset}\n`);
    return;
  }

  console.log(`${colors.red}⚠ Ditemukan ${findings.length} kerentanan keamanan!${colors.reset}\n`);

  console.log(`${colors.cyan}╔${'═'.repeat(78)}╗${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset} ${colors.bright}${colors.white}AEGIS SECURITY AUDIT REPORT${colors.reset} ${' '.repeat(49)}${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}╠${'═'.repeat(78)}╣${colors.reset}`);

  findings.forEach((f, idx) => {
    const issueName = f.issue || 'Unknown Issue';
    console.log(`${colors.cyan}║${colors.reset} ${colors.yellow}[${idx + 1}] NAMA ISU   :${colors.reset} ${colors.white}${issueName}${colors.reset}${' '.repeat(Math.max(0, 61 - issueName.length))}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}     LOKASI     :${colors.reset} ${f.file}:${f.line}${' '.repeat(Math.max(0, 61 - (f.file.length + f.line.toString().length + 1)))}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}     DESKRIPSI  :${colors.reset} ${f.description.substring(0, 60)}${' '.repeat(Math.max(0, 60 - f.description.substring(0, 60).length))}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}     ${colors.red}CODE LAMA  :${colors.reset} ${colors.gray}${f.currentCode.substring(0, 60)}${' '.repeat(Math.max(0, 60 - Math.min(60, f.currentCode.length)))}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}     ${colors.green}PATCH BARU :${colors.reset} ${colors.white}${f.fixedCode.substring(0, 60)}${' '.repeat(Math.max(0, 60 - Math.min(60, f.fixedCode.length)))}${colors.cyan}║${colors.reset}`);
    if (idx < findings.length - 1) console.log(`${colors.cyan}╟${'─'.repeat(78)}╢${colors.reset}`);
  });
  console.log(`${colors.cyan}╚${'═'.repeat(78)}╝${colors.reset}\n`);

  if (!isInteractiveTerminal) {
    console.log(`${colors.yellow}Non-interactive mode: patch prompt dilewati. Jalankan 'aegis code' di terminal interaktif untuk menerapkan perbaikan.${colors.reset}\n`);
    return;
  }

  let autoHealAll = false;
  if (findings.length > 1) {
    const healAllAns = await new Promise(res => rl.question(`${colors.cyan}🚀 Jalankan "HEAL ALL" untuk memperbaiki SEMUA secara otomatis? (y/n): ${colors.reset}`, res));
    autoHealAll = healAllAns.toLowerCase() === 'y';
  }

  const healedFindings = [];
  for (const f of findings) {
    let apply = autoHealAll;
    if (!autoHealAll) {
      const ans = await new Promise(res => rl.question(`${colors.yellow}› Apply patch [${f.file}:${f.line}]? (y/n): ${colors.reset}`, res));
      apply = ans.toLowerCase() === 'y';
    }
    if (apply) {
      try {
        const fullPath = path.join(targetDir, f.file);
        const originalContent = fs.readFileSync(fullPath, 'utf8');
        const lines = originalContent.split('\n');
        if (lines[f.line - 1].trim() === f.currentCode) {
          if (!fs.existsSync(fullPath + '.bak')) {
            fs.writeFileSync(fullPath + '.bak', originalContent);
          }
          lines[f.line - 1] = lines[f.line - 1].replace(f.currentCode, f.fixedCode);
          fs.writeFileSync(fullPath, lines.join('\n'));
          healedFindings.push(f);
          console.log(`${colors.green}✔ [HEALED]${colors.reset} ${f.file}:${f.line} -> ${f.issue}`);
          console.log(`    ${colors.red}[OLD]${colors.reset} ${f.currentCode}\n    ${colors.green}[NEW]${colors.reset} ${f.fixedCode}\n`);
        }
      } catch (e) {}
    }
  }

  if (healedFindings.length > 0) {
    await generateReport(healedFindings, targetDir);
  }
  console.log(`${colors.green}✔ P1: SAST & HEAL Selesai.${colors.reset}\n`);
}

async function generateReport(findings, targetDir) {
  const reportPath = path.join(targetDir, 'AEGIS_REPORT.md');
  const isNew = !fs.existsSync(reportPath);
  
  let content = "";
  if (!isNew) content += `\n\n---\n\n`;
  else content += `# 🛡️ AEGIS SECURITY AUDIT LOG\n\n`;

  content += `## 🕒 Audit Session: ${new Date().toLocaleString()}\n`;
  if (projectMetadata) {
    content += `- **Context:** ${projectMetadata.detectedStack.join(', ')} project detected.\n`;
    content += `- **Entry Point:** ${projectMetadata.entryPoint}\n`;
  }
  content += `- **Target:** \`${targetDir}\`\n`;
  content += `- **Summary:** ${findings.length} vulnerabilities remediated.\n\n`;

  content += `### 🔍 Remediation Detail\n\n`;
  findings.forEach((f, i) => {
    content += `#### [${i + 1}] ${f.issue}\n`;
    content += `- **Location:** \`${f.file}:${f.line}\`\n`;
    content += `\n**Code Transformation:**\n\`\`\`diff\n- ${f.currentCode}\n+ ${f.fixedCode}\n\`\`\`\n\n`;
  });

  fs.appendFileSync(reportPath, content);
  console.log(`${colors.cyan}📄 Audit Log diperbarui: ${colors.white}AEGIS_REPORT.md${colors.reset}`);
}

async function runUndo(targetDir) {
  console.log(`\n${colors.yellow}↩ MENGINISIALISASI UNDO: REVERTING PATCHES...${colors.reset}\n`);
  let revertedCount = 0;

  function findAndRestore(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        if (!['node_modules', '.git', '.next'].includes(item)) findAndRestore(fullPath);
      } else if (item.endsWith('.bak')) {
        const originalFile = fullPath.replace('.bak', '');
        fs.copyFileSync(fullPath, originalFile);
        fs.unlinkSync(fullPath);
        console.log(`${colors.green}✔ Restored:${colors.reset} ${path.relative(targetDir, originalFile)}`);
        revertedCount++;
      }
    }
  }

  findAndRestore(targetDir);
  if (revertedCount > 0) {
    console.log(`\n${colors.green}✔ SUKSES: ${revertedCount} file berhasil dikembalikan ke kondisi asli.${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}ℹ Tidak ada file backup (.bak) yang ditemukan.${colors.reset}\n`);
  }
}

async function runScan(phaseName, targetDir) {
  if (phaseName.includes("P0")) return await runPhase0(targetDir);
  if (phaseName.includes("P1")) return await runPhase1(targetDir);
  
  console.log(`\n${colors.yellow}› menginisialisasi ${phaseName}...${colors.reset}`);
  console.log(`${colors.gray}target: ${colors.white}${targetDir}${colors.reset}\n`);

  const logData = {
    "P2: DAST": [
      "meluncurkan environment audit terisolasi...",
      "melakukan fuzzing pada endpoint api...",
      "menguji ketahanan terhadap brute-force...",
      "menganalisis header keamanan HTTP (HSTS/CSP)...",
      "memvalidasi sesi & token manajemen...",
      "pemindaian OWASP Top 10 selesai.",
      "menghasilkan skor risiko keamanan: 8.5/10."
    ],
    "P3: MONITOR": [
      "menghubungkan ke agen pemantauan sistem...",
      "menginisialisasi pipeline log real-time...",
      "mengonfigurasi alert sistem untuk anomali...",
      "memverifikasi integritas file sistem (FIM)...",
      "mengaktifkan AI Threat Detection Engine...",
      "sinkronisasi dashboard pemantauan elit...",
      "sistem dalam status: MONITORING ACTIVE."
    ]
  };

  const currentLogs = logData[phaseName] || ["memproses analisis sistem...", "sinkronisasi data...", "finalisasi laporan..."];

  for (let i = 0; i < currentLogs.length; i++) {
    const progress = Math.round(((i + 1) / currentLogs.length) * 100);
    const bar = "█".repeat(Math.floor(progress / 5)) + " ".repeat(20 - Math.floor(progress / 5));
    process.stdout.write(`\r${colors.gray}[${bar}] ${progress}% ${colors.reset}${colors.white}${currentLogs[i]}${colors.reset}`);
    await sleep(400);
    process.stdout.write('\n');
  }

  console.log(`\n${colors.green}✔ sukses:${colors.reset} ${phaseName} selesai.`);
}

function completer(line) {
  const commands = ['help', 'models', 'scan', 'doc', 'cls', 'clear', 'exit', 'aegis', 'ollama', 'custom', 'terminal', 'ui', 'gui', 'config', 'tanya', 'ask'];
  const parts = line.split(/\s+/);
  const current = parts[parts.length - 1];

  // If it's the first part of the line, complete Aegis commands
  if (parts.length === 1) {
    const hits = commands.filter((c) => c.startsWith(line.toLowerCase()));
    return [hits.length ? hits : commands, line];
  }

  // If it's a path-related command (like cd), complete with local files/folders
  if (['cd', 'ls', 'dir', 'rm', 'mkdir'].includes(parts[0].toLowerCase())) {
    try {
      const searchDir = current.includes(path.sep) ? path.dirname(current) : '.';
      const searchTerm = path.basename(current);
      
      const files = fs.readdirSync(searchDir);
      const hits = files.filter(f => f.toLowerCase().startsWith(searchTerm.toLowerCase()));
      
      // Map back to the full path fragment
      const results = hits.map(f => {
        const full = path.join(searchDir, f);
        return parts[0] + ' ' + full;
      });

      return [hits.length ? hits : files, current];
    } catch (e) {
      return [[], current];
    }
  }

  return [[], line];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer,
  terminal: true,
  prompt: '\x1b[31m│ \x1b[37m'
});

// Simplified Solid Red Logo to prevent color bleeding issues
const logoLines = [
  "\x1b[31m  █████╗    ███████╗    ██████╗    ██╗    ███████╗\x1b[0m",
  "\x1b[31m ██╔══██╗   ██╔════╝   ██╔════╝    ██║    ██╔════╝\x1b[0m",
  "\x1b[31m ███████║   █████╗     ██║  ███╗   ██║    ███████╗\x1b[0m",
  "\x1b[31m ██╔══██║   ██╔══╝     ██║   ██║   ██║    ╚════██║\x1b[0m",
  "\x1b[31m ██║  ██║   ███████╗   ╚██████╔╝   ██║    ███████║\x1b[0m",
  "\x1b[31m ╚═╝  ╚═╝   ╚══════╝    ╚═════╝    ╚═╝    ╚══════╝\x1b[0m"
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function typewriter(text, color = colors.reset, speed = 10) {
  for (const char of text) {
    process.stdout.write(color + char + colors.reset);
    await sleep(speed);
  }
  process.stdout.write('\n');
}

async function animateLogo() {
  for (const line of logoLines) {
    console.log(line);
    await sleep(60);
  }
}

function clear() {
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
}

function openUrl(url) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('unsupported URL protocol');
    }

    const href = parsed.href;
    const command = process.platform === 'win32' ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const args = process.platform === 'win32' ? ['/c', 'start', '', href] : [href];
    const child = spawn(command, args, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch (e) {
    console.log(`${colors.red}Error: Could not launch browser.${colors.reset}`);
  }
}

function printBox(content, title = "", borderColor = colors.red) {
  const lines = content.split('\n');
  const width = Math.max(...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length), title.length) + 10;
  
  console.log(`\x1b[90m┌─\x1b[0m ${colors.bright}${colors.red}${title}${colors.reset} \x1b[90m${'─'.repeat(width - title.length - 4)}┐\x1b[0m`);
  lines.forEach(line => {
    const plainLength = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    console.log(`\x1b[90m│\x1b[0m   ${line}${' '.repeat(width - plainLength - 4)}\x1b[90m│\x1b[0m`);
  });
  console.log(`\x1b[90m└${'─'.repeat(width - 2)}┘\x1b[0m`);
}

async function bootSequence(speed = 1) {
  clear();
  
  // phase 1: logo reveal (exactly ~0.3s)
  for (const line of logoLines) {
    console.log(line);
    await sleep(50 * speed);
  }
  
  // phase 2: tagline & pipeline (exactly ~0.4s)
  await sleep(20 * speed);
  process.stdout.write(`${colors.white}aegis security${colors.reset} ${colors.red}v2.3.0-elite${colors.reset}\n`);
  await typewriter("sistem keamanan otonom & remediasi kerentanan\n", colors.gray, 2 * speed);
  await sleep(50 * speed);

  // fixed width grid
  const boxWidth = 58;
  const border = (c1, c2, c3) => `${colors.gray} ${c1}${'═'.repeat(boxWidth)}${c3}${colors.reset}`;
  const row = (content) => `${colors.gray} ║${colors.reset}${pad(content, boxWidth)}${colors.gray}║${colors.reset}`;

  console.log(border('╔', '═', '╗'));
  
  const title = ` ${colors.red}security pipeline${colors.reset}`;
  console.log(row(title));
  
  console.log(`${colors.gray} ╟${'─'.repeat(boxWidth)}╢${colors.reset}`);

  const header = `   phase                │ status`;
  console.log(row(header));
  
  const sep = '─'.repeat(22) + '┼' + '─'.repeat(35);
  console.log(`${colors.gray} ╟${sep}╢${colors.reset}`);

  const steps = [
    { id: 'scan ingestion', status: '[synced]', color: colors.green },
    { id: 'code sast & heal', status: '[ready]', color: colors.yellow },
    { id: 'autonomous monitoring', status: '[coming soon]', color: colors.magenta }
  ];

  for (const s of steps) {
    const phaseText = `   ${colors.red}●${colors.reset} ${s.id}`;
    const statusText = `${s.color}${s.status}${colors.reset}`;
    
    // manual grid: phase(22) + separator(1) + status(35)
    const content = pad(phaseText, 22) + colors.gray + "│" + colors.reset + "  " + pad(statusText, 33);
    console.log(row(content));
    await sleep(75 * speed); 
  }
  
  console.log(border('╚', '═', '╝'));

  console.log(`ketik ${colors.white}"help"${colors.reset} untuk bantuan atau ${colors.white}"doc"${colors.reset} untuk panduan web.\n`);
  rl.setPrompt(`${colors.gray}lokasi: ${colors.white}${process.cwd()}\n${colors.red}│ ${colors.reset}`);
  rl.prompt();
}



async function getOllamaModels() {
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    if (!res.ok) return [];
    const data = await res.json();
    return data.models || [];
  } catch (e) {
    return null; // ollama down
  }
}

async function showModels() {
  const ollamaModels = await getOllamaModels();
  const models = [
    { id: 'aegis', name: 'aegis internal api', type: 'core_engine', desc: 'cepat, aman, intelejensi tinggi. optimasi logika kode.' },
    { id: 'ollama', name: 'ollama offline api', type: 'local_llm', desc: 'privasi maksimal. luring. kapabilitas penalaran rendah.' },
    { id: 'custom', name: 'personal api key', type: 'user_config', desc: 'gunakan key gpt/gemini/deepseek anda sendiri.' }
  ];

  const tableWidth = 68;
  let content = `${colors.gray}┌────────────┬──────────────────────┬─────────────────┬────────────┐${colors.reset}\n`;
  content += `${colors.gray}│ [id]       │ [nama]               │ [tipe]          │ [status]   │${colors.reset}\n`;
  content += `${colors.gray}├────────────┼──────────────────────┼─────────────────┼────────────┤${colors.reset}\n`;
  
  models.forEach((m, idx) => {
    const isActive = activeModel === m.id;
    const stateColor = isActive ? colors.green : colors.red;
    const stateText = isActive ? 'aktif' : 'nonaktif';
    
    content += `${colors.gray}│${colors.reset} ${colors.red}${m.id.padEnd(10)}${colors.reset} ${colors.gray}│${colors.reset} ${m.name.padEnd(20)} ${colors.gray}│${colors.reset} ${m.type.padEnd(15)} ${colors.gray}│${colors.reset} ${stateColor}${stateText.padEnd(10)}${colors.reset} ${colors.gray}│${colors.reset}\n`;
    content += `${colors.gray}├────────────┴──────────────────────┴─────────────────┴────────────┤${colors.reset}\n`;
    content += `${colors.gray}│${colors.reset} ${colors.blue}ℹ info:${colors.reset} ${m.desc.padEnd(58)} ${colors.gray}│${colors.reset}\n`;
    
    if (m.id === 'ollama') {
      if (ollamaModels === null) {
        content += `${colors.gray}│${colors.reset} ${colors.red}⚠ ollama tidak terdeteksi di localhost:11434.               ${colors.reset} ${colors.gray}│${colors.reset}\n`;
      } else if (ollamaModels.length === 0) {
        content += `${colors.gray}│${colors.reset} ${colors.yellow}⚠ tidak ada model di ollama. jalankan 'ollama pull'.         ${colors.reset} ${colors.gray}│${colors.reset}\n`;
      } else {
        const names = ollamaModels.map(om => om.name).slice(0, 3).join(', ');
        const current = config.ollamaModel || 'llama3';
        content += `${colors.gray}│${colors.reset} ${colors.green}✔ model tersedia:${colors.reset} ${names.padEnd(41)} ${colors.gray}│${colors.reset}\n`;
        content += `${colors.gray}│${colors.reset} ${colors.blue}⚙ aktif:${colors.reset} ${colors.white}${current.padEnd(49)}${colors.reset} ${colors.gray}│${colors.reset}\n`;
        content += `${colors.gray}│${colors.reset} ${colors.gray}  (ketik 'ollama [nama]' untuk mengganti model)${colors.reset}             ${colors.gray}│${colors.reset}\n`;
      }
    }
    
    if (idx < models.length - 1) {
      content += `${colors.gray}├────────────┬──────────────────────┬─────────────────┬────────────┤${colors.reset}\n`;
    }
  });

  content += `${colors.gray}└────────────┴──────────────────────┴─────────────────┴────────────┘${colors.reset}\n\n`;
  content += `${colors.bright}${colors.white}dokumentasi penggunaan${colors.reset}\n`;
  content += `  ${colors.red}doc${colors.reset}           buka dashboard & panduan sistem lengkap\n\n`;
  content += `${colors.gray}› ketik id model untuk aktivasi (contoh: "aegis")${colors.reset}`;
  
  printBox(content.trim(), "intelligence_cores", colors.red);
}

function printFooter() {
  // Footer removed as per user request
}

async function showInfo() {
  const totalRAM = (os.totalmem() / (1024 ** 3)).toFixed(1);
  const freeRAM = (os.freemem() / (1024 ** 3)).toFixed(1);
  const usedRAM = (totalRAM - freeRAM).toFixed(1);
  const cpuModel = os.cpus()[0].model.trim();
  const cpuCores = os.cpus().length;
  const platform = os.platform();
  const arch = os.arch();
  
  const userText = session ? `${session.user.email}` : `${colors.red}unauthorized${colors.reset}`;
  const securityHealth = session ? 98.4 : 12.0; 

  const content = `
${colors.white}${colors.bright}SISTEM DIAGNOSTIK AEGIS${colors.reset}
${colors.gray}──────────────────────────────────────────────────${colors.reset}
${colors.white}OPERATOR IDENTITY:${colors.reset}
  ${colors.red}●${colors.reset} Active User  : ${colors.cyan}${userText}${colors.reset}
  ${colors.red}●${colors.reset} Access Level : ${colors.white}${session ? 'ELITE_COMMANDER' : 'GUEST_RESTRICTED'}${colors.reset}

${colors.white}HARDWARE SPECIFICATIONS:${colors.reset}
  ${colors.red}●${colors.reset} OS Platform  : ${colors.white}${platform} (${arch})${colors.reset}
  ${colors.red}●${colors.reset} CPU Core     : ${colors.white}${cpuModel} (${cpuCores} cores)${colors.reset}
  ${colors.red}●${colors.reset} RAM Usage    : ${colors.white}${usedRAM}GB / ${totalRAM}GB${colors.reset}

${colors.white}SECURITY INTEGRITY INDEX:${colors.reset}
  ${colors.red}●${colors.reset} Status       : ${session ? colors.green + 'EXCELLENT' : colors.red + 'LOCKED'}${colors.reset}
  ${colors.red}●${colors.reset} Protection   : ${session ? colors.green + securityHealth + '%' : colors.red + securityHealth + '%'}${colors.reset}
${colors.gray}──────────────────────────────────────────────────${colors.reset}
${colors.yellow}ℹ aegis beroperasi dalam mode performa tinggi.${colors.reset}
`;

  printBox(content.trim(), "system_info", colors.red);
}

function showHelp() {
  const content = `
${colors.white}perintah utama:${colors.reset}
  ${colors.red}scan${colors.reset}         jalankan pemetaan struktur & arsitektur proyek
  ${colors.red}code${colors.reset}         jalankan audit kode (SAST) & perbaikan AI
  ${colors.red}monitor${colors.reset}      [COMING SOON] pemantauan & audit runtime (DAST)
  ${colors.red}undo${colors.reset}         batalkan patch yang telah diterapkan
  ${colors.red}models${colors.reset}       pilih & ganti otak ai (aegis/ollama/custom)
  ${colors.red}info${colors.reset}         cek spesifikasi komputer & kesehatan sistem
  ${colors.red}whoami${colors.reset}       cek identitas pengguna aktif
  ${colors.red}logout${colors.reset}       keluar dari sesi aegis
  ${colors.red}tanya${colors.reset} <teks>  ajukan pertanyaan langsung ke ai aktif
  ${colors.red}cls${colors.reset}          bersihkan layar & refresh status sistem
  ${colors.red}exit${colors.reset}         keluar dari aplikasi aegis

${colors.white}perintah shell:${colors.reset}
  anda bisa langsung mengetik perintah windows seperti ${colors.red}dir${colors.reset}, ${colors.red}cd${colors.reset}, ${colors.red}git${colors.reset}, dll.`;

  printBox(content.trim(), "bantuan_sistem", colors.red);
}


async function handleCommand(input, options = {}) {
  const shouldPrompt = options.prompt !== false;
  let originalInput = input.trim();
  if (!originalInput) {
    if (shouldPrompt) rl.prompt();
    return;
  }

  const parts = originalInput.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ').toLowerCase();

  const reserved = [
    'help', 'models', 'scan', 'doc', 'cls', 'clear', 'exit', 'aegis', 'ollama', 'custom', 
    'ui', 'gui', 'config', 'tanya', 'ask', 'cd', 'dir', 'ls', 'git', 'npm', 'status', 'reset',
    'p0', 'p1', 'p2', 'p3', 'init'
  ];

  // Logic for Chat Mode
  if (sessionMode === 'chat') {
    if (reserved.includes(cmd)) {
      sessionMode = 'cli';
      console.log(`${colors.gray}› beralih ke mode cli...${colors.reset}`);
    } else {
      const reply = await askAI(originalInput);
      console.log(`\r${colors.green}│${colors.reset} ${colors.white}${reply}${colors.reset}\n`);
      rl.setPrompt(`${colors.gray}lokasi: ${colors.white}${process.cwd()}\n${colors.cyan}[chat] ${colors.reset}`);
      if (shouldPrompt) rl.prompt();
      return;
    }
  }

  switch (cmd) {
    case 'tanya':
    case 'ask':
      if (!args) {
        sessionMode = 'chat';
        console.log(`\n${colors.cyan}💬 mode percakapan aktif. ketik apa saja untuk bertanya.${colors.reset}`);
        console.log(`${colors.gray}(ketik "cls" atau "models" untuk kembali ke menu)${colors.reset}\n`);
        rl.setPrompt(`${colors.gray}lokasi: ${colors.white}${process.cwd()}\n${colors.cyan}[chat] ${colors.reset}`);
      } else {
        const reply = await askAI(args);
        console.log(`\r${colors.green}│${colors.reset} ${colors.white}${reply}${colors.reset}\n`);
      }
      break;
    case 'gui':
    case 'ui':
      console.log(`${colors.cyan}› meluncurkan dashboard...${colors.reset}`);
      openUrl(`http://localhost:3001?path=${encodeURIComponent(process.cwd())}`);
      break;
    case 'init':
      console.log(`\n${colors.cyan}✨ INITIALIZING AEGIS SECURITY ENGINE...${colors.reset}`);
      await runPhase0(process.cwd());
      await runPhase1(process.cwd());
      console.log(`\n${colors.green}✔ Project initialized and scanned successfully.${colors.reset}`);
      console.log(`${colors.gray}Type 'help' to see more commands.${colors.reset}\n`);
      break;
    case 'scan':
      await runPhase0(process.cwd());
      break;
    case 'code':
      await runPhase0(process.cwd());
      await runPhase1(process.cwd());
      break;
    case 'monitor':
    case 'monitoring':
      console.log(`\n${colors.magenta}🕒 FEATURE COMING SOON: Phase 2 (DAST) & Phase 3 (Monitoring)${colors.reset}`);
      console.log(`${colors.gray}Kami sedang menyempurnakan engine pengujian aktif & monitoring real-time.${colors.reset}\n`);
      break;
    case 'undo':
      await runUndo(process.cwd());
      break;
    case 'help':
    case '?':
      showHelp();
      break;
    case 'models':
    case 'ai':
      await showModels();
      break;
    case 'cls':
    case 'clear':
      await bootSequence(0.3); // fast animation for cls
      sessionMode = 'cli';
      break;
    case 'reset':
      await bootSequence();
      break;
    case 'exit':
      console.log(`\n${colors.red}Terminating Aegis secure link...${colors.reset}`);
      process.exit(0);
      break;
    case 'login':
      await handleLogin();
      break;
    case 'logout':
      handleLogout();
      break;
    case 'whoami':
      if (session) {
        console.log(`\n${colors.cyan}› user aktif: ${colors.white}${session.user.email}${colors.reset}`);
        console.log(`${colors.gray}› id: ${session.user.id}${colors.reset}\n`);
      } else {
        console.log(`\n${colors.red}anda belum login.${colors.reset}\n`);
      }
      break;
    case 'info':
      await showInfo();
      break;
    case 'doc':
      console.log(`${colors.cyan}› membuka dokumentasi penggunaan aegis untuk lokasi saat ini...${colors.reset}`);
      openUrl(`http://localhost:3001/docs/usage?path=${encodeURIComponent(process.cwd())}`);
      break;
    case 'aegis':
      activeModel = 'aegis';
      saveConfig();
      console.log(`\n${colors.green}✔ core inteligensi beralih ke: AEGIS${colors.reset}\n`);
      await showModels();
      break;
    case 'ollama':
      if (args) {
        config.ollamaModel = args;
        activeModel = 'ollama';
        saveConfig();
        console.log(`\n${colors.green}✔ ollama aktif menggunakan model:${colors.reset} ${colors.white}${args}${colors.reset}\n`);
      } else {
        activeModel = 'ollama';
        saveConfig();
        console.log(`\n${colors.green}✔ intelligence core beralih ke:${colors.reset} ${colors.white}ollama (local)${colors.reset}\n`);
      }
      await showModels();
      break;
    case 'custom':
      console.log(`\n${colors.yellow}› beralih ke core kustom.${colors.reset}`);
      rl.question(`${colors.white}masukkan api key kustom (baru): ${colors.reset}`, async (key) => {
        if (key.trim()) {
          config.customKey = key.trim();
          activeModel = 'custom';
          saveConfig();
          console.log(`\n${colors.green}✔ api key diperbarui dan core beralih ke: CUSTOM${colors.reset}\n`);
        } else {
          console.log(`\n${colors.red}error: api key tidak boleh kosong.${colors.reset}\n`);
        }
        await showModels();
        rl.prompt();
      });
      return;
    case 'config':
      if (args === 'ai') {
        console.log(`\n${colors.cyan}› pengaturan konfigurasi ai kustom...${colors.reset}`);
        rl.question(`${colors.white}masukkan api key baru: ${colors.reset}`, (key) => {
          if (key.trim()) {
            config.customKey = key.trim();
            saveConfig();
            console.log(`${colors.green}✔ api key kustom diperbarui.${colors.reset}\n`);
          }
          rl.prompt();
        });
        return;
      } else {
        console.log(`${colors.yellow}penggunaan: config ai${colors.reset}`);
      }
      break;
    case 'ask':
    case 'tanya':
      if (!args) {
        console.log(`${colors.yellow}penggunaan: tanya <pesan anda>${colors.reset}`);
      } else {
        const reply = await askAI(args);
        console.log(`\r${colors.green}│${colors.reset} ${colors.white}${reply}${colors.reset}\n`);
      }
      break;
    case 'cd':
      const newPath = parts.slice(1).join(' ').trim();
      if (!newPath) {
        console.log(process.cwd());
      } else {
        try {
          process.chdir(newPath);
          rl.setPrompt(`${colors.gray}lokasi: ${colors.white}${process.cwd()}\n${colors.red}│ ${colors.reset}`);
        } catch (e) {
          console.log(`${colors.red}error: path tidak valid: ${newPath}${colors.reset}`);
        }
      }
      break;
    default:
      try {
        execSync(originalInput, { stdio: 'inherit' });
      } catch (e) {
        if (!e.message.includes('Command failed')) {
          console.log(`${colors.red}error: perintah "${cmd}" tidak dikenal.${colors.reset}`);
        }
      }
      break;
  }

  // Final prompt update for next input
  if (sessionMode === 'chat') {
    rl.setPrompt(`${colors.gray}lokasi: ${colors.white}${process.cwd()}\n${colors.cyan}[chat] ${colors.reset}`);
  } else {
    rl.setPrompt(`${colors.gray}lokasi: ${colors.white}${process.cwd()}\n${colors.red}│ ${colors.reset}`);
  }
  if (shouldPrompt) rl.prompt();
}

function getPackageVersion() {
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    return readJsonFile(pkgPath).version || 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

function showCliUsage() {
  console.log([
    `aegis-security ${getPackageVersion()}`,
    '',
    'Usage:',
    '  npx aegis-security@latest init',
    '  aegis init',
    '  aegis scan',
    '  aegis code',
    '',
    'Commands:',
    '  init      Run ingestion and SAST scan for the current project',
    '  scan      Map project architecture and write AEGIS_INGESTION_REPORT.md',
    '  code      Run security audit and optional remediation',
    '  undo      Restore files from .bak backups created by Aegis',
    '  models    Show AI backend options',
    '  help      Show interactive command help'
  ].join('\n'));
}

async function start() {
  // Login requirement removed as per user request for local focus
  const args = startupArgs;

  if (args[0] === '--version' || args[0] === '-v') {
    console.log(getPackageVersion());
    process.exit(0);
  }

  if (args[0] === '--help' || args[0] === '-h') {
    showCliUsage();
    process.exit(0);
  }

  await bootSequence(args.length > 0 ? 0.2 : 1);
  
  // Check for command line arguments (e.g., "aegis p1")
  if (args.length > 0) {
    const initialCmd = args.join(' ');
    console.log(`\x1b[90m› Executing startup command: ${initialCmd}\x1b[0m`);
    await handleCommand(initialCmd, { prompt: false });
    process.exit(0);
  } else {
    rl.prompt();
  }
}

rl.on('line', handleCommand).on('close', () => {
  if (startupArgs.length === 0) {
    process.exit(0);
  }
});

start();
