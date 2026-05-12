# AEGIS Phase 2 - AI-Powered Penetration Testing

## Overview

Phase 2 adalah modul **offensive security** yang menggunakan AI (DeepSeek) untuk melakukan penetration testing otomatis berdasarkan **OWASP Top 10**.

## Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AEGIS PHASE 2 FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. USER REQUEST                                                │
│     └─> "Scan kerentanan di https://xxx.ngrok-free.dev"        │
│                                                                 │
│  2. AI GENERATES ATTACKS                                        │
│     └─> DeepSeek generates OWASP Top 10 attack payloads        │
│         - SQL Injection                                         │
│         - XSS                                                   │
│         - Path Traversal                                        │
│         - Command Injection                                     │
│         - SSRF, etc.                                           │
│                                                                 │
│  3. EXECUTE ATTACKS                                             │
│     └─> Attack target via ngrok (public URL)                   │
│     └─> Record responses                                        │
│                                                                 │
│  4. AI ANALYZES RESPONSES                                       │
│     └─> Determine if vulnerable                                │
│     └─> Assess severity (Critical/High/Medium/Low)             │
│     └─> Generate recommendations                                │
│                                                                 │
│  5. HITL NOTIFICATION                                           │
│     └─> Notify AEGIS Phase 3: "Ada kerentanan ditemukan!"      │
│     └─> Telegram notification                                   │
│                                                                 │
│  6. SELF-HEALING                                                │
│     └─> Phase 3 applies WAF rules automatically                │
│     └─> User can Approve/Reverse via Telegram                  │
│                                                                 │
│  7. GENERATE REPORT                                             │
│     └─> REPORT.md with all findings                            │
│     └─> Executive summary                                       │
│     └─> Remediation priorities                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

```bash
cd phase2
npm install
```

## Usage

### Quick Scan (High-Impact Only)
```bash
# Set API key
export DEEPSEEK_API_KEY=sk-xxx

# Run quick scan
npx tsx src/index.ts --target https://xxx.ngrok-free.dev --quick --verbose
```

### Full OWASP Top 10 Scan
```bash
npx tsx src/index.ts \
  --target https://xxx.ngrok-free.dev \
  --aegis http://localhost:5000 \
  --output ./reports/REPORT.md \
  --verbose
```

### With JSON Report
```bash
npx tsx src/index.ts \
  --target https://xxx.ngrok-free.dev \
  --output ./reports/REPORT.md \
  --json
```

## Command Line Options

| Option | Description |
|--------|-------------|
| `--target <url>` | Target URL to scan (required) |
| `--aegis <url>` | AEGIS Phase 3 URL for HITL (default: http://localhost:5000) |
| `--quick` | Run quick scan (only high-impact tests) |
| `--verbose` | Show detailed output |
| `--output <path>` | Output path for REPORT.md |
| `--json` | Also generate JSON report |

## OWASP Top 10 Coverage

| ID | Category | Attacks |
|----|----------|---------|
| A01 | Broken Access Control | IDOR, Privilege Escalation, Path Traversal |
| A02 | Cryptographic Failures | Sensitive Data Exposure, Weak Encryption |
| A03 | Injection | SQL Injection, Command Injection, LDAP Injection |
| A04 | Insecure Design | Business Logic Flaws, Missing Rate Limits |
| A05 | Security Misconfiguration | Default Credentials, Verbose Errors |
| A06 | Vulnerable Components | Outdated Libraries, Known CVEs |
| A07 | Auth Failures | Brute Force, Session Fixation |
| A08 | Data Integrity Failures | Insecure Deserialization |
| A09 | Logging Failures | Missing Audit Logs, Log Injection |
| A10 | SSRF | Server-Side Request Forgery |

## Output

### REPORT.md
Full penetration test report with:
- Executive summary (AI-generated)
- Vulnerability details
- Evidence and payloads
- Remediation recommendations
- OWASP coverage matrix

### Integration with Phase 3
When vulnerabilities are found:
1. Automatically reported to Phase 3 `/api/attacks`
2. Phase 3 triggers self-healing
3. Telegram notification sent for HITL approval
4. WAF rules activated to block future attacks

## Architecture

```
phase2/
├── src/
│   ├── index.ts              # Main entry point
│   ├── ai/
│   │   └── pentestAI.ts      # DeepSeek AI integration
│   ├── scanner/
│   │   └── index.ts          # Attack execution engine
│   └── reporter/
│       └── reportGenerator.ts # REPORT.md generator
├── reports/                   # Generated reports
├── package.json
└── README.md
```
