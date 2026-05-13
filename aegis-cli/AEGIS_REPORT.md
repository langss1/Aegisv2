# 🛡️ AEGIS SECURITY AUDIT LOG

## 🕒 Audit Session: 13/05/2026, 09.11.10
- **Context:** Next.js@16.2.6, React@19.2.4, TypeScript@5 project detected.
- **Entry Point:** src/app (App Router)
- **Target:** `C:\Project Sems 6\aegis\aegis-cli`
- **Summary:** 5 vulnerabilities remediated.

### 🔍 Remediation Detail

#### [1] Hardcoded Sensitive Data
- **Location:** `bin\aegis.js:42`

**Code Transformation:**
```diff
- const SUPABASE_URL = "https://zmjrsztlixsbluvbuncw.supabase.co";
+ const SUPABASE_URL = process.env.SUPABASE_URL;
```

#### [2] Hardcoded Sensitive Data
- **Location:** `bin\aegis.js:43`

**Code Transformation:**
```diff
- const SUPABASE_KEY = "sb_publishable_HCNKDkpAmx6xHkpdcOTI6A_90zUZFNB";
+ const SUPABASE_KEY = process.env.SUPABASE_KEY;
```

#### [3] Hardcoded Sensitive Data
- **Location:** `bin\aegis.js:121`

**Code Transformation:**
```diff
- <path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/>
+                     <path d=process.env.D/>
```

#### [4] Hardcoded Sensitive Data
- **Location:** `bin\aegis.js:122`

**Code Transformation:**
```diff
- <path d="M12 22V12M12 12l9-5M12 12L3 7" stroke="white" stroke-opacity="0.3"/>
+                     <path d=process.env.D stroke="white" stroke-opacity="0.3"/>
```

#### [5] Hardcoded Sensitive Data
- **Location:** `bin\aegis.js:380`

**Code Transformation:**
```diff
- findings.push({ file: path.relative(targetDir, fullPath), line: i + 1, issue: 'SQL Injection Vulnerability', severity: 'High', currentCode: trimLine, fixedCode: "// AI_HEAL: Use parameterized query to prevent SQL Injection", description: 'Input dinamis dimasukkan langsung ke query database.' });
+                 findings.push({ file: path.relative(targetDir, fullPath), line: i + 1, issue: process.env.ISSUE, severity: 'High', currentCode: trimLine, fixedCode: "// AI_HEAL: Use parameterized query to prevent SQL Injection", description: 'Input dinamis dimasukkan langsung ke query database.' });
```



---

## 🕒 Audit Session: 13/05/2026, 09.19.07
- **Context:** Next.js@16.2.6, React@19.2.4, TypeScript@5 project detected.
- **Entry Point:** src/app (App Router)
- **Target:** `C:\Project Sems 6\aegis\aegis-cli`
- **Summary:** 7 vulnerabilities remediated.

### 🔍 Remediation Detail

#### [1] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:5`

**Code Transformation:**
```diff
- const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
+ const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
```

#### [2] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:6`

**Code Transformation:**
```diff
- const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
+ const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
```

#### [3] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:9`

**Code Transformation:**
```diff
- const JWT_SECRET = "super-secret-token-that-no-one-should-know-12345";
+ const JWT_SECRET = process.env.JWT_SECRET;
```

#### [4] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:12`

**Code Transformation:**
```diff
- const token = "fixed-session-token-abc-123";
+   const token = process.env.TOKEN;
```

#### [5] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\db.js:4`

**Code Transformation:**
```diff
- connectionString: "postgres://admin:password123@localhost:5432/mydb"
+   connectionString: process.env.CONNECTIONSTRING
```

#### [6] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:9`

**Code Transformation:**
```diff
- const query = `SELECT * FROM users WHERE id = ${id}`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [7] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:16`

**Code Transformation:**
```diff
- const query = `UPDATE users SET bio = '${bio}' WHERE username = '${username}'`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```



---

## 🕒 Audit Session: 13/05/2026, 09.20.35
- **Context:** Next.js@16.2.6, React@19.2.4, TypeScript@5 project detected.
- **Entry Point:** src/app (App Router)
- **Target:** `C:\Project Sems 6\aegis\aegis-cli`
- **Summary:** 13 vulnerabilities remediated.

### 🔍 Remediation Detail

#### [1] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:10`

**Code Transformation:**
```diff
- content: "Aegis operates in two primary modes: Core and Passthrough. Use 'terminal' to enter Passthrough mode for standard shell operations. Use 'ui' to launch the web dashboard synchronized with your current directory."
+       content: process.env.CONTENTterminal' to enter Passthrough mode for standard shell operations. Use 'ui' to launch the web dashboard synchronized with your current directory."
```

#### [2] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:14`

**Code Transformation:**
```diff
- content: "Switch between AI models by typing their ID (AEGIS-PRO, LOCAL-OLLAMA, CUSTOM-AI). Aegis Pro is best for complex security logic, while Ollama provides maximum privacy. You can configure custom API keys in the [AI Dashboard](/config)."
+       content: process.env.CONTENT
```

#### [3] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:18`

**Code Transformation:**
```diff
- content: "The P0-P3 pipeline represents the full security lifecycle: Ingestion (P0), Static Analysis (P1), Dynamic Analysis (P2), and Real-time Monitoring (P3). Use 'scan' to trigger the active phase."
+       content: process.env.CONTENTscan' to trigger the active phase."
```

#### [4] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:22`

**Code Transformation:**
```diff
- content: "When vulnerabilities are found in P1, Aegis generates AI patches. You can apply these patches directly through the CLI or review them in the web dashboard before deployment."
+       content: process.env.CONTENT
```

#### [5] Hardcoded Sensitive Data
- **Location:** `src\services\ai.ts:68`

**Code Transformation:**
```diff
- return { success: false, content: 'error: api key kustom tidak ditemukan. gunakan "config ai" untuk mengaturnya.' };
+             return { success: false, content: process.env.CONTENTconfig ai" untuk mengaturnya.' };
```

#### [6] Hardcoded Sensitive Data
- **Location:** `src\services\ai.ts:87`

**Code Transformation:**
```diff
- return { success: false, content: 'error: provider inteligensi tidak dikenal.' };
+           return { success: false, content: process.env.CONTENT };
```

#### [7] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:5`

**Code Transformation:**
```diff
- const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
+ const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
```

#### [8] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:6`

**Code Transformation:**
```diff
- const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
+ const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
```

#### [9] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:9`

**Code Transformation:**
```diff
- const JWT_SECRET = "super-secret-token-that-no-one-should-know-12345";
+ const JWT_SECRET = process.env.JWT_SECRET;
```

#### [10] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:12`

**Code Transformation:**
```diff
- const token = "fixed-session-token-abc-123";
+   const token = process.env.TOKEN;
```

#### [11] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\db.js:4`

**Code Transformation:**
```diff
- connectionString: "postgres://admin:password123@localhost:5432/mydb"
+   connectionString: process.env.CONNECTIONSTRING
```

#### [12] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:9`

**Code Transformation:**
```diff
- const query = `SELECT * FROM users WHERE id = ${id}`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [13] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:16`

**Code Transformation:**
```diff
- const query = `UPDATE users SET bio = '${bio}' WHERE username = '${username}'`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```


## Session: 13/05/2026, 09.27.21
- Remediated 13 issues.


---

## 🕒 Audit Session: 13/05/2026, 09.52.11
- **Context:** Next.js@16.2.6, React@19.2.4, TypeScript@5 project detected.
- **Entry Point:** src/app (App Router)
- **Target:** `C:\Project Sems 6\aegis\aegis-cli`
- **Summary:** 13 vulnerabilities remediated.

### 🔍 Remediation Detail

#### [1] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:10`

**Code Transformation:**
```diff
- content: "Aegis operates in two primary modes: Core and Passthrough. Use 'terminal' to enter Passthrough mode for standard shell operations. Use 'ui' to launch the web dashboard synchronized with your current directory."
+       content: process.env.CONTENTterminal' to enter Passthrough mode for standard shell operations. Use 'ui' to launch the web dashboard synchronized with your current directory."
```

#### [2] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:14`

**Code Transformation:**
```diff
- content: "Switch between AI models by typing their ID (AEGIS-PRO, LOCAL-OLLAMA, CUSTOM-AI). Aegis Pro is best for complex security logic, while Ollama provides maximum privacy. You can configure custom API keys in the [AI Dashboard](/config)."
+       content: process.env.CONTENT
```

#### [3] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:18`

**Code Transformation:**
```diff
- content: "The P0-P3 pipeline represents the full security lifecycle: Ingestion (P0), Static Analysis (P1), Dynamic Analysis (P2), and Real-time Monitoring (P3). Use 'scan' to trigger the active phase."
+       content: process.env.CONTENTscan' to trigger the active phase."
```

#### [4] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:22`

**Code Transformation:**
```diff
- content: "When vulnerabilities are found in P1, Aegis generates AI patches. You can apply these patches directly through the CLI or review them in the web dashboard before deployment."
+       content: process.env.CONTENT
```

#### [5] Hardcoded Sensitive Data
- **Location:** `src\services\ai.ts:68`

**Code Transformation:**
```diff
- return { success: false, content: 'error: api key kustom tidak ditemukan. gunakan "config ai" untuk mengaturnya.' };
+             return { success: false, content: process.env.CONTENTconfig ai" untuk mengaturnya.' };
```

#### [6] Hardcoded Sensitive Data
- **Location:** `src\services\ai.ts:87`

**Code Transformation:**
```diff
- return { success: false, content: 'error: provider inteligensi tidak dikenal.' };
+           return { success: false, content: process.env.CONTENT };
```

#### [7] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:5`

**Code Transformation:**
```diff
- const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
+ const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
```

#### [8] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:6`

**Code Transformation:**
```diff
- const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
+ const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
```

#### [9] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:9`

**Code Transformation:**
```diff
- const JWT_SECRET = "super-secret-token-that-no-one-should-know-12345";
+ const JWT_SECRET = process.env.JWT_SECRET;
```

#### [10] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:12`

**Code Transformation:**
```diff
- const token = "fixed-session-token-abc-123";
+   const token = process.env.TOKEN;
```

#### [11] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\db.js:4`

**Code Transformation:**
```diff
- connectionString: "postgres://admin:password123@localhost:5432/mydb"
+   connectionString: process.env.CONNECTIONSTRING
```

#### [12] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:9`

**Code Transformation:**
```diff
- const query = `SELECT * FROM users WHERE id = ${id}`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [13] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:16`

**Code Transformation:**
```diff
- const query = `UPDATE users SET bio = '${bio}' WHERE username = '${username}'`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```



---

## 🕒 Audit Session: 13/05/2026, 09.52.42
- **Context:** Next.js@16.2.6, React@19.2.4, TypeScript@5 project detected.
- **Entry Point:** src/app (App Router)
- **Target:** `C:\Project Sems 6\aegis\aegis-cli`
- **Summary:** 13 vulnerabilities remediated.

### 🔍 Remediation Detail

#### [1] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:10`

**Code Transformation:**
```diff
- content: "Aegis operates in two primary modes: Core and Passthrough. Use 'terminal' to enter Passthrough mode for standard shell operations. Use 'ui' to launch the web dashboard synchronized with your current directory."
+       content: process.env.CONTENTterminal' to enter Passthrough mode for standard shell operations. Use 'ui' to launch the web dashboard synchronized with your current directory."
```

#### [2] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:14`

**Code Transformation:**
```diff
- content: "Switch between AI models by typing their ID (AEGIS-PRO, LOCAL-OLLAMA, CUSTOM-AI). Aegis Pro is best for complex security logic, while Ollama provides maximum privacy. You can configure custom API keys in the [AI Dashboard](/config)."
+       content: process.env.CONTENT
```

#### [3] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:18`

**Code Transformation:**
```diff
- content: "The P0-P3 pipeline represents the full security lifecycle: Ingestion (P0), Static Analysis (P1), Dynamic Analysis (P2), and Real-time Monitoring (P3). Use 'scan' to trigger the active phase."
+       content: process.env.CONTENTscan' to trigger the active phase."
```

#### [4] Hardcoded Sensitive Data
- **Location:** `src\app\docs\usage\page.tsx:22`

**Code Transformation:**
```diff
- content: "When vulnerabilities are found in P1, Aegis generates AI patches. You can apply these patches directly through the CLI or review them in the web dashboard before deployment."
+       content: process.env.CONTENT
```

#### [5] Hardcoded Sensitive Data
- **Location:** `src\services\ai.ts:68`

**Code Transformation:**
```diff
- return { success: false, content: 'error: api key kustom tidak ditemukan. gunakan "config ai" untuk mengaturnya.' };
+             return { success: false, content: process.env.CONTENTconfig ai" untuk mengaturnya.' };
```

#### [6] Hardcoded Sensitive Data
- **Location:** `src\services\ai.ts:87`

**Code Transformation:**
```diff
- return { success: false, content: 'error: provider inteligensi tidak dikenal.' };
+           return { success: false, content: process.env.CONTENT };
```

#### [7] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:5`

**Code Transformation:**
```diff
- const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
+ const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
```

#### [8] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:6`

**Code Transformation:**
```diff
- const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
+ const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
```

#### [9] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:9`

**Code Transformation:**
```diff
- const JWT_SECRET = "super-secret-token-that-no-one-should-know-12345";
+ const JWT_SECRET = process.env.JWT_SECRET;
```

#### [10] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\api.js:12`

**Code Transformation:**
```diff
- const token = "fixed-session-token-abc-123";
+   const token = process.env.TOKEN;
```

#### [11] Hardcoded Sensitive Data
- **Location:** `vulnerable-app\db.js:4`

**Code Transformation:**
```diff
- connectionString: "postgres://admin:password123@localhost:5432/mydb"
+   connectionString: process.env.CONNECTIONSTRING
```

#### [12] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:9`

**Code Transformation:**
```diff
- const query = `SELECT * FROM users WHERE id = ${id}`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

#### [13] SQL Injection Vulnerability
- **Location:** `vulnerable-app\db.js:16`

**Code Transformation:**
```diff
- const query = `UPDATE users SET bio = '${bio}' WHERE username = '${username}'`;
+ // AI_HEAL: Use parameterized query to prevent SQL Injection
```

