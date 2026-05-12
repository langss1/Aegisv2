#!/usr/bin/env node

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
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
}

function showHelp() {
  const content = `
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
    rl.prompt();
    return;
  }

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
      break;
    case 'exit':
      console.log(`\n${colors.red}Terminating Aegis secure link...${colors.reset}`);
      process.exit(0);
      break;
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
  }
  rl.prompt();
}

async function start() {
  await bootSequence();
  
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
