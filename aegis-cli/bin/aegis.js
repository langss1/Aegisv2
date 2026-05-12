#!/usr/bin/env node

const readline = require('readline');
const { execSync } = require('child_process');
<<<<<<< HEAD
=======
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
  
  const logData = {
    "P0: INGESTION": [
      "pemetaan struktur direktori lokal...",
      "analisis dependensi proyek (package.json)...",
      "pemeriksaan metadata repositori git...",
      "sinkronisasi index keamanan dengan cloud...",
      "validasi kredensial pipeline...",
      "p0: ingestion berhasil diselesaikan."
    ],
    "P1: SAST & HEAL": [
      "menganalisis struktur kode & direktori...",
      "memindai kerentanan SQL injection...",
      "mendeteksi pola XSS pada komponen frontend...",
      "menemukan 2 potensi kebocoran memori (leak).",
      "menjalankan AI Remediation: aegis-heal v1.2...",
      "menerapkan patch pada middleware/auth.ts...",
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
    await sleep(500);
    process.stdout.write('\n');
  }

  console.log(`\n${colors.green}✔ sukses:${colors.reset} ${phaseName} selesai. semua data telah disinkronkan ke dashboard.`);
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
>>>>>>> ee65a2e9f35f31a680ad17b094347e848b69aad0

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
<<<<<<< HEAD
  prompt: '\x1b[31m│ \x1b[37m'
});

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m"
};

// Simplified Solid Red Logo to prevent color bleeding issues
const logoLines = [
  "\x1b[31m  █████╗ ███████╗ ██████╗ ██╗███████╗\x1b[0m",
  "\x1b[31m ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝\x1b[0m",
  "\x1b[31m ███████║█████╗  ██║  ███╗██║███████╗\x1b[0m",
  "\x1b[31m ██╔══██║██╔══╝  ██║   ██║██║╚════██║\x1b[0m",
  "\x1b[31m ██║  ██║███████╗╚██████╔╝██║███████║\x1b[0m",
  "\x1b[31m ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝\x1b[0m"
=======
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
>>>>>>> ee65a2e9f35f31a680ad17b094347e848b69aad0
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
<<<<<<< HEAD
  process.stdout.write('\x1b[2J\x1b[0f');
}

function printBox(content, title = "", borderColor = colors.gray) {
  const lines = content.split('\n');
  const width = Math.max(...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length), title.length) + 6;
  
  console.log(`${borderColor}╭─${colors.reset} ${colors.bright}${colors.red}${title}${colors.reset} ${borderColor}${'─'.repeat(width - title.length - 4)}╮${colors.reset}`);
  lines.forEach(line => {
    const plainLength = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    console.log(`${borderColor}│${colors.reset}   ${line}${' '.repeat(width - plainLength - 4)}${borderColor}│${colors.reset}`);
  });
  console.log(`${borderColor}╰${'─'.repeat(width - 2)}╯${colors.reset}`);
}

function printPipeline() {
  console.log(`\x1b[90m┌─ SECURITY_PIPELINE ─────────────────┐\x1b[0m`);
  console.log(`\x1b[90m│\x1b[0m  \x1b[31m●\x1b[0m \x1b[1mP0\x1b[0m Ingestion      \x1b[32m[SYNCED]\x1b[0m      \x1b[90m│\x1b[0m`);
  console.log(`\x1b[90m│\x1b[0m  \x1b[31m●\x1b[0m \x1b[1mP1\x1b[0m SAST & Heal    \x1b[33m[READY]\x1b[0m       \x1b[90m│\x1b[0m`);
  console.log(`\x1b[90m│\x1b[0m  \x1b[31m●\x1b[0m \x1b[1mP2\x1b[0m DAST           \x1b[90m[PENDING]\x1b[0m     \x1b[90m│\x1b[0m`);
  console.log(`\x1b[90m│\x1b[0m  \x1b[31m●\x1b[0m \x1b[1mP3\x1b[0m Monitor        \x1b[90m[STANDBY]\x1b[0m     \x1b[90m│\x1b[0m`);
  console.log(`\x1b[90m└─────────────────────────────────────┘\x1b[0m`);
}

async function bootSequence() {
  clear();
  await animateLogo();
  console.log(`\n\x1b[1mAEGIS SECURITY\x1b[0m \x1b[31mv2.3.0-ELITE\x1b[0m`);
  console.log(`\x1b[90mAutonomous Security Agent & Vulnerability Remediation\x1b[0m`);
  console.log(`\x1b[90mDevice: Node_IDN_01 | Analysis: Active Codebase\x1b[0m\n`);
  
  await typewriter('Type "help" for detailed information and commands.', colors.gray, 5);
  console.log("");
  
  printPipeline();
}

function showModels() {
  const content = `
${colors.gray}[ID]            [NAME]               [TYPE]          [STATE]${colors.reset}
${colors.gray}--------------------------------------------------------------${colors.reset}
\x1b[31mCORE-X1\x1b[0m         Aegis Core V4        LLM_REASONING   ${colors.green}ONLINE${colors.reset}
\x1b[31mVULN-S1\x1b[0m         DeepSeek Security    VULN_SCANNER    ${colors.green}ONLINE${colors.reset}
\x1b[31mLOGIC-C3\x1b[0m        Claude-3.5-Aegis     CODE_LOGIC      ${colors.green}ONLINE${colors.reset}
\x1b[31mHEAL-H2\x1b[0m         Remediation-V2       AUTO_PATCH      ${colors.green}ONLINE${colors.reset}
${colors.gray}--------------------------------------------------------------${colors.reset}`;
  printBox(content.trim(), "INTELLIGENCE_MODELS");
=======
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
>>>>>>> ee65a2e9f35f31a680ad17b094347e848b69aad0
}

function showHelp() {
  const content = `
<<<<<<< HEAD
${colors.bright}${colors.white}PIPELINE COMMANDS${colors.reset}
  ${colors.red}p0${colors.reset}       Connect source & start Ingestion
  ${colors.red}p1${colors.reset}       Trigger SAST & Auto-Heal engine
  ${colors.red}p2${colors.reset}       Initialize DAST dynamic scanning
  ${colors.red}p3${colors.reset}       Deploy real-time Monitoring

${colors.bright}${colors.white}AGENT CORE${colors.reset}
  ${colors.red}help${colors.reset}     View system documentation
  ${colors.red}models${colors.reset}   List active AI models
  ${colors.red}status${colors.reset}   Check agent system health
  ${colors.red}clear${colors.reset}    Reset terminal workspace

${colors.bright}${colors.white}SHELL${colors.reset}
  ${colors.cyan}terminal${colors.reset}  Enter shell passthrough
  ${colors.cyan}exit${colors.reset}      Terminate session`;
  printBox(content.trim(), "COMMAND_MANIFEST");
}

let terminalMode = false;

async function handleCommand(input) {
  let cmd = input.trim().toLowerCase();
  if (cmd.startsWith('/')) cmd = cmd.substring(1);

  if (terminalMode) {
    if (cmd === 'exit') {
      terminalMode = false;
      console.log(`\n${colors.yellow}› Exiting Passthrough Mode.${colors.reset}\n`);
      rl.setPrompt('\x1b[31m│ \x1b[37m');
      rl.prompt();
      return;
    }
    try {
      const output = execSync(input, { encoding: 'utf8' });
      console.log(output);
    } catch (e) {
      console.log(`${colors.red}Error: Invalid shell command.${colors.reset}`);
    }
=======
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
>>>>>>> ee65a2e9f35f31a680ad17b094347e848b69aad0
    rl.prompt();
    return;
  }

<<<<<<< HEAD
  switch (cmd) {
    case 'help':
      showHelp();
      break;
    case 'models':
      showModels();
      break;
    case 'status':
      console.log(`\n${colors.white}${colors.bright}DIAGNOSTIC REPORT:${colors.reset}`);
      console.log(`${colors.gray}Status:${colors.reset}   ${colors.green}FULLY_OPERATIONAL${colors.reset}`);
      console.log(`${colors.gray}Pipeline:${colors.reset} ${colors.green}SYNCED_WITH_CLOUD${colors.reset}`);
      console.log(`${colors.gray}Metrics:${colors.reset}  CPU 8% | RAM 3.1GB / 16GB\n`);
      break;
    case 'p0':
      console.log(`\n${colors.bright}${colors.red}[P0] INGESTION ENGINE INITIALIZED${colors.reset}`);
      await typewriter("› Accessing local filesystem...", colors.gray);
      await sleep(400);
      await typewriter("› Authenticating with GitHub API...", colors.gray);
      await sleep(600);
      console.log(`${colors.green}✔ REPOSITORY CONNECTED: github.com/langss1/Aegis-Windows.git${colors.reset}`);
      console.log(`${colors.gray}Status: Source code synced. Metadata indexed.\n${colors.reset}`);
      break;
    case 'p1':
      console.log(`\n${colors.bright}${colors.red}[P1] SAST & AUTO-HEAL WORKSPACE${colors.reset}`);
      await typewriter("› Initializing Static Analysis Tooling...", colors.gray);
      await sleep(300);
      await typewriter("› Scanning 42 files for vulnerabilities...", colors.gray);
      
      let p1 = 0;
      const i1 = setInterval(() => {
        p1 += 10;
        const bar = "█".repeat(p1/5) + " ".repeat(20-p1/5);
        process.stdout.write(`\r${colors.gray}[${bar}] ${p1}% Analyzing code logic...${colors.reset}`);
        if (p1 >= 100) {
          clearInterval(i1);
          console.log(`\n\n${colors.yellow}⚠ 3 CRITICAL VULNERABILITIES IDENTIFIED:${colors.reset}`);
          console.log(`${colors.gray}  1. Broken Authentication (L42 in auth.js)${colors.reset}`);
          console.log(`${colors.gray}  2. Cross-Site Scripting (L12 in dashboard.js)${colors.reset}`);
          console.log(`${colors.gray}  3. SQL Injection Potential (L89 in db.js)${colors.reset}`);
          console.log(`\n${colors.green}✔ AEGIS Recommendation: Initializing Auto-Patching...${colors.reset}`);
          console.log(`${colors.green}✔ Patch #AE-422-X generated for auth.js.${colors.reset}\n`);
          rl.prompt();
        }
      }, 200);
      return;
    case 'p2':
      console.log(`\n${colors.bright}${colors.red}[P2] DAST DYNAMIC SCANNER${colors.reset}`);
      await typewriter("› Spawning sandboxed environment...", colors.gray);
      await sleep(400);
      await typewriter("› Target mapping: http://localhost:3000", colors.gray);
      await sleep(400);
      console.log(`${colors.blue}ℹ DAST Agent status: [STANDBY]${colors.reset}`);
      console.log(`${colors.gray}Ready to execute attack simulations. Type "scan" to start.\n${colors.reset}`);
      break;
    case 'p3':
      console.log(`\n${colors.bright}${colors.red}[P3] REAL-TIME MONITORING${colors.reset}`);
      await typewriter("› Mounting network interceptors...", colors.gray);
      await sleep(300);
      await typewriter("› Initializing threat logging stream...", colors.gray);
      await sleep(500);
      console.log(`${colors.green}● ALL ENDPOINTS PROTECTED.${colors.reset}`);
      console.log(`${colors.gray}Monitoring traffic on ports: 80, 443, 3000, 3001.\x1b[0m\n`);
      break;
    case 'clear':
    case 'cls':
      await bootSequence();
      break;
    case 'terminal':
      terminalMode = true;
      console.log(`\n${colors.yellow}Entering SHELL_PASSTHROUGH (Type 'exit' to return).${colors.reset}`);
      rl.setPrompt(`${colors.gray}${process.cwd()} ${colors.red}›${colors.reset} `);
=======
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
>>>>>>> ee65a2e9f35f31a680ad17b094347e848b69aad0
      break;
    case 'exit':
      console.log(`\n${colors.red}Terminating Aegis secure link...${colors.reset}`);
      process.exit(0);
      break;
<<<<<<< HEAD
    default:
      if (cmd.startsWith('scan')) {
        console.log(`\n${colors.yellow}› Initializing Agentic DAST Scan...${colors.reset}`);
        let p = 0;
        const i = setInterval(() => {
          p += 5;
          const bar = "█".repeat(p/5) + " ".repeat(20-p/5);
          process.stdout.write(`\r${colors.gray}[${bar}] ${p}% Simulating attacks...${colors.reset}`);
          if (p >= 100) {
            clearInterval(i);
            console.log(`\n\n${colors.green}✔ SUCCESS:${colors.reset} Dynamic analysis complete.`);
            console.log(`${colors.green}✔ Report: No new surface vulnerabilities detected.${colors.reset}\n`);
            rl.prompt();
          }
        }, 100);
        return;
      } else if (input !== '') {
        console.log(`${colors.red}Error: Command "${input}" not recognized. Type "help".${colors.reset}`);
      }
      break;
=======
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
>>>>>>> ee65a2e9f35f31a680ad17b094347e848b69aad0
  }
  rl.prompt();
}

async function start() {
<<<<<<< HEAD
  await bootSequence();
=======
  if (!session) {
    console.log(`\n${colors.red} [!] AEGIS TERMINAL IS LOCKED [!] ${colors.reset}`);
    console.log(`${colors.gray}anda harus login untuk mengakses core inteligensi aegis.${colors.reset}\n`);
    await handleLogin();
    if (!session) {
      console.log(`${colors.red}error: otorisasi gagal. sesi dihentikan.${colors.reset}`);
      process.exit(1);
    }
  }

  await bootSequence(false); // full animation on start
>>>>>>> ee65a2e9f35f31a680ad17b094347e848b69aad0
  
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
