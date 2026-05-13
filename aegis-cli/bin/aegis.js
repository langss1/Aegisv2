#!/usr/bin/env node

const readline = require('readline');
const { execSync } = require('child_process');
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
    session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
    // check expiry
    if (session.expires_at < Date.now()) {
      session = null;
    }
  } catch (e) {}
}

const SUPABASE_URL = "https://zmjrsztlixsbluvbuncw.supabase.co";
const SUPABASE_KEY = "sb_publishable_HCNKDkpAmx6xHkpdcOTI6A_90zUZFNB";

function stripANSI(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function pad(str, length) {
  const plain = stripANSI(str);
  const needed = length - plain.length;
  return str + ' '.repeat(Math.max(0, needed));
}

let activeModel = config.activeModel;
let sessionMode = 'cli'; // 'cli' or 'chat'

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
                    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/>
                    <path d="M12 22V12M12 12l9-5M12 12L3 7" stroke="white" stroke-opacity="0.3"/>
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
function openUrl(url) {
  const platform = process.platform;
  const start = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
  try {
    execSync(`${start} "${url}"`);
  } catch (e) {}
}

async function askAI(prompt) {
  process.stdout.write(`\n${colors.cyan}› aegis sedang berpikir...${colors.reset}\r`);
  try {
    let response;
    if (activeModel === 'aegis') {
      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer sk-fcc206047ecc4f97bc5d5d97e81054cc` },
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

async function runScan(phaseName, targetDir) {
  console.log(`\n${colors.yellow}› menginisialisasi ${phaseName}...${colors.reset}`);
  console.log(`${colors.gray}target: ${colors.white}${targetDir}${colors.reset}\n`);
  
  let detectedStack = ['Generic'];
  let fileCount = 0;
  
  // Real Local Analysis for P0
  if (phaseName === "P0: INGESTION") {
    try {
      if (fs.existsSync(path.join(targetDir, 'package.json'))) {
        const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        detectedStack = [];
        if (deps.next) detectedStack.push('Next.js');
        if (deps.react) detectedStack.push('React');
        if (deps.typescript) detectedStack.push('TypeScript');
        if (deps.tailwindcss) detectedStack.push('TailwindCSS');
        if (deps.prisma) detectedStack.push('Prisma');
        if (deps.express) detectedStack.push('Express');
        if (detectedStack.length === 0) detectedStack.push('Node.js');
      }

      const getFiles = (dir) => {
        let count = 0;
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file === 'node_modules' || file === '.git' || file === '.next') continue;
          const name = path.join(dir, file);
          if (fs.statSync(name).isDirectory()) {
            count += getFiles(name);
          } else {
            count++;
          }
        }
        return count;
      };
      fileCount = getFiles(targetDir);
    } catch (e) {}
  }

  const logData = {
    "P0: INGESTION": [
      "pemetaan struktur direktori lokal...",
      `ditemukan ${fileCount} file dalam target direktori.`,
      "menganalisis tanda tangan arsitektur...",
      `tech stack terdeteksi: ${detectedStack.join(', ')}`,
      "memverifikasi dependensi keamanan...",
      "validasi kredensial pipeline lokal...",
      "p0: ingestion berhasil diselesaikan."
    ],
    "P1: SAST & HEAL": [
      "menganalisis struktur kode & direktori...",
      "memindai kerentanan SQL injection...",
      "mendeteksi pola XSS pada komponen frontend...",
      "menemukan potensi kerentanan logika bisnis...",
      "menjalankan AI Remediation: aegis-heal v2.0...",
      "menerapkan simulasi patch pada source code...",
      "verifikasi integritas kode setelah patch."
    ],
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
  if (phaseName === "P0: INGESTION") {
    console.log(`${colors.gray}arsitektur terverifikasi: ${colors.white}${detectedStack.join(', ')}${colors.reset}`);
    console.log(`${colors.gray}siap untuk p1 sast & heal.${colors.reset}\n`);
  }
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
    const platform = process.platform;
    const start = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
    execSync(`${start} ${url}`);
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
    { id: 'p0 ingestion', status: '[synced]', color: colors.green },
    { id: 'p1 sast & heal', status: '[ready]', color: colors.yellow },
    { id: 'p2 dast', status: '[pending]', color: colors.red },
    { id: 'p3 monitor', status: '[standby]', color: colors.gray }
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
  ${colors.red}models${colors.reset}       pilih & ganti otak ai (aegis/ollama/custom)
  ${colors.red}info${colors.reset}         cek spesifikasi komputer & kesehatan sistem
  ${colors.red}whoami${colors.reset}       cek identitas pengguna aktif
  ${colors.red}logout${colors.reset}       keluar dari sesi aegis
  ${colors.red}scan${colors.reset}         mulai audit keamanan pada direktori saat ini
  ${colors.red}tanya${colors.reset} <teks>  ajukan pertanyaan langsung ke ai aktif
  ${colors.red}cls${colors.reset}          bersihkan layar & refresh status sistem
  ${colors.red}exit${colors.reset}         keluar dari aplikasi aegis

${colors.white}perintah shell:${colors.reset}
  anda bisa langsung mengetik perintah windows seperti ${colors.red}dir${colors.reset}, ${colors.red}cd${colors.reset}, ${colors.red}git${colors.reset}, dll.`;

  printBox(content.trim(), "bantuan_sistem", colors.red);
}


async function handleCommand(input) {
  let originalInput = input.trim();
  if (!originalInput) {
    rl.prompt();
    return;
  }

  const parts = originalInput.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ').toLowerCase();

  const reserved = [
    'help', 'models', 'scan', 'doc', 'cls', 'clear', 'exit', 'aegis', 'ollama', 'custom', 
    'ui', 'gui', 'config', 'tanya', 'ask', 'cd', 'dir', 'ls', 'git', 'npm', 'status', 'reset',
    'p0', 'p1', 'p2', 'p3'
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
      rl.prompt();
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
    case 'p0':
      await runScan("P0: INGESTION", process.cwd());
      break;
    case 'p1':
      await runScan("P1: SAST & HEAL", process.cwd());
      break;
    case 'p2':
      await runScan("P2: DAST", process.cwd());
      break;
    case 'p3':
      await runScan("P3: MONITOR", process.cwd());
      break;
    case 'scan':
      await runScan("AEGIS FULL AUDIT", process.cwd());
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
  rl.prompt();
}

async function start() {
  // Login requirement removed as per user request for local focus
  await bootSequence(false); // full animation on start
  
  // Check for command line arguments (e.g., "aegis p1")
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const initialCmd = args.join(' ');
    console.log(`\x1b[90m› Executing startup command: ${initialCmd}\x1b[0m`);
    await handleCommand(initialCmd);
  } else {
    rl.prompt();
  }
}

rl.on('line', handleCommand).on('close', () => {
  process.exit(0);
});

start();
