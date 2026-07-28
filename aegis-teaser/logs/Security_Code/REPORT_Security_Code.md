# 🔍 AEGIS SECURITY CODE REPORT - 15/05/2026, 21.37.14

> Fokus: kerentanan keamanan (SAST) — **bukan** kualitas/hygiene kode (gunakan QA / QualityCode).

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase0\page.tsx:195
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key="selection"`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase0\page.tsx:262
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key="analyzing"`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase0\page.tsx:331
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key="stack_confirm"`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:139
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `currentCode: `const AWS_KEY = "AKIAIOSFODNN7EXAMPLE"\nconst AWS_SECRET = "wJalrXUtnFEMI/K7MDENG"`,`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\app\(main)\phases\phase1\page.tsx:149
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `currentCode: `query = f"SELECT * FROM users WHERE id = {user_id}"`,`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:157
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `issue: 'Stripe API Key Hardcoded',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:159
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `currentCode: `const STRIPE_KEY = "sk_live_51ABC123xyz..."`,`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:162
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `description: 'Stripe secret key terekspos! Hacker bisa melakukan transaksi ilegal.'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:167
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `issue: 'Telegram Bot Token Exposed',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:169
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `currentCode: `BOT_TOKEN = "6789012345:AAHdqTcvZ..."`,`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:172
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `description: 'Token Telegram bot terekspos. Bot bisa diambil alih oleh pihak lain.'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase1\page.tsx:375
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key="dashboard"`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\app\(main)\phases\phase1\page.tsx:487
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `className={`${styles.vulnRow} ${selectedFinding?.id === f.id ? styles.selected : ''} ${f.patched ? styles.patched : ''}`}`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\app\(main)\phases\phase2\page.tsx:92
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `code: 'const query = `SELECT * FROM users WHERE id = ${userId}`',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\page.tsx:108
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `type: 'Hardcoded Secret',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\page.tsx:112
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `code: 'const API_KEY = "sk-1234567890abcdef"',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\page.tsx:113
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `description: 'API key hardcoded in source code',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\page.tsx:130
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `file: 'src/utils/token.ts',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\page.tsx:132
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `code: 'const token = Math.random().toString(36).substring(7)',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\page.tsx:133
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `description: 'Using Math.random() for security-sensitive token generation',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\page.tsx:413
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key="fix-detail"`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\report\page.tsx:8
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `const STORAGE_KEY = "aegis_pentest_state";`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\report\page.tsx:63
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `evidence: "Unauthorized access to other users' resources by manipulating object references",`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\report\page.tsx:67
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `evidence: "User able to access admin functions without proper authorization",`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\report\page.tsx:80
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `recommendation: "Use strong encryption (AES-256) and secure key management"`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\report\page.tsx:123
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `evidence: "Session ID not regenerated after authentication",`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase2\report\page.tsx:132
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `recommendation: "Implement comprehensive logging for authentication and authorization events"`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase3\page.tsx:382
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `<a href="https://github.com/settings/tokens/new?scopes=repo&description=AEGIS%20Security" target="_blank" rel="noopener noreferrer">`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\phase3\page.tsx:463
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key="monitoring"`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\review-findings\page.tsx:36
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `issue: 'MD5 used for password hashing. Transition to Argon2 recommended.',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\review-findings\page.tsx:38
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `oldCode: 'hash = hashlib.md5(password.encode()).hexdigest()',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\(main)\phases\review-findings\page.tsx:39
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `newCode: 'hash = argon2.PasswordHasher().hash(password)'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\actions\projects.ts:31
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if (!user) return { success: false, error: 'Unauthorized' }`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:95
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `explanation: 'Moved hardcoded secrets to environment variables. Add .env to .gitignore to prevent accidental commits.'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:120
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `explanation: 'Replaced weak cryptographic algorithm with a stronger alternative (SHA-256 or bcrypt for passwords).'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:178
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `return Response.json({ error: 'Unauthorized' }, { status: 401 })`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:183
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `return Response.json({ error: 'Invalid token' }, { status: 401 })`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:192
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `explanation: 'Added authentication check to protect sensitive endpoint. Always verify user identity before processing requests.'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:208
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `return Response.json({ error: 'Invalid CSRF token' }, { status: 403 })`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:220
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `explanation: 'Added CSRF token validation to prevent Cross-Site Request Forgery attacks.'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:322
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if (key === '__proto__' || key === 'constructor' || key === 'prototype') {`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:341
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `explanation: 'Added prototype pollution protection by filtering dangerous keys (__proto__, constructor, prototype).'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:349
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key: 'X-DNS-Prefetch-Control',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:353
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key: 'Strict-Transport-Security',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:357
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key: 'X-Frame-Options',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:361
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key: 'X-Content-Type-Options',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:365
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key: 'Referrer-Policy',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:369
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `key: 'Content-Security-Policy',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:431
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:474
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' },`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:518
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if (!token || token === 'your_github_pat_here') {`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:662
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `'Hardcoded Secret': 'hardcoded-secret',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:663
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `'hardcoded_secret': 'hardcoded-secret',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:664
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `'hardcoded-credentials': 'hardcoded-secret',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:672
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `'Missing Authentication': 'missing-auth',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\fix\route.ts:673
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `'missing_auth': 'missing-auth',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\github\pr\route.ts:79
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `return NextResponse.json({ error: 'GitHub access token required' }, { status: 401 })`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:98
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `result.file = 'api/auth.js'`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\app\api\pentest\route.ts:101
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `const query = \`SELECT * FROM users WHERE username = '\${username}'\`;`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:119
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`);``

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\app\api\pentest\route.ts:119
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`);``

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:188
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `name: 'CSRF Token Missing',`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:217
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `result.description = 'No CSRF token validation on state-changing endpoint'`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:295
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `{ key: 'X-Frame-Options', value: 'DENY' },`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:296
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `{ key: 'X-Content-Type-Options', value: 'nosniff' },`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:297
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `{ key: 'Strict-Transport-Security', value: 'max-age=31536000' },`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:298
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `{ key: 'Content-Security-Policy', value: "default-src 'self'" }`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\pentest\route.ts:334
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `body: JSON.stringify({ email: 'test@test.com', password: 'wrong' }),`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\scan\route.ts:8
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `description: "API keys should be stored in environment variables, not in source code.",`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\scan\route.ts:9
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `fix: "Use process.env.API_KEY or os.environ.get('API_KEY') instead of hardcoding."`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\scan\route.ts:55
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if (finalToken && finalToken !== 'your_github_pat_here') {`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\scan\route.ts:115
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if (!apiKey || apiKey === 'your_deepseek_api_key_here') {`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\scan\route.ts:145
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\scan\route.ts:198
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `type: "Hardcoded Secret",`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\api\scan\route.ts:203
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `description: "Hardcoded credential or secret key detected."`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\app\api\telegram\callback\route.ts:101
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `await answerCallbackQuery(cbId, reason === "not_found" ? "Healing not found" : `Already ${existing?.status?.toLowerCase()}`);`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\app\api\telegram\callback\route.ts:167
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `await answerCallbackQuery(cbId, reason === "not_found" ? "Healing not found" : `Already ${existing?.status?.toLowerCase()}`);`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\auth\github\actions.ts:12
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if ((!token || token === 'your_github_pat_here') && isDev) {`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\auth\github\actions.ts:27
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if (!token || token === 'your_github_pat_here') {`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\auth\github\actions.ts:28
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `return { error: 'GitHub Token tidak ditemukan! Silakan isi GITHUB_TOKEN di file .env untuk mengakses repo privat Anda.' }`

### ⚠ Hardcoded Sensitive Data (Critical)
- **File:** src\app\auth\github\actions.ts:68
- **Deskripsi:** Ditemukan kredensial yang tersimpan secara eksplisit.
- **Kode:** `if (token === 'your_github_pat_here') {`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\lib\codeAnalyzer.ts:351
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `explanation = `Use parameterized query with variables: ${vars.join(', ')}`;`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\lib\cveMonitor.ts:96
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `return `Update affected package to latest version. Check vendor advisory for ${cve.id}.`;`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\lib\cveMonitor.ts:142
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `return `Update affected package to latest version. Check vendor advisory for ${cve.id}.`;`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\lib\cveMonitor.ts:261
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `• <code>/update ${pkg}</code> to auto-update`

### ⚠ SQL Injection Vulnerability (High)
- **File:** src\lib\telegram.ts:30
- **Deskripsi:** Input dinamis dimasukkan langsung ke query database.
- **Kode:** `const res = await fetch(`${BASE}/getUpdates?${params}`, { cache: "no-store" });`

