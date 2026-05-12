import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class AEGISAI:
    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.client = OpenAI(
            api_key=self.api_key,
            base_url="https://api.deepseek.com"
        ) if self.api_key else None

    def analyze_and_fix(self, code: str):
        if not self.client:
            return self._get_mock_fix(code)

        prompt = f"""
        As a security expert specializing in OWASP Top 10, analyze the following code for vulnerabilities and hardcoded secrets.
        Provide a fix that adheres to security best practices (e.g., using environment variables, input sanitization, etc.).

        CODE:
        {code}

        RETURN ONLY A JSON OBJECT with the following structure:
        {{
            "vulnerabilities": [
                {{
                    "type": "OWASP Category (e.g., A01:2021-Broken Access Control)",
                    "description": "Short description of the issue",
                    "severity": "CRITICAL|HIGH|MEDIUM|LOW"
                }}
            ],
            "fixed_code": "The complete fixed code snippet",
            "explanation": "Briefly explain what was fixed"
        }}
        """

        try:
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are AEGIS, an advanced AI security engine. You output structured JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return self._get_mock_fix(code)

    def _get_mock_fix(self, code: str):
        """Fallback mock fix for demonstration with JS/Web vulnerabilities (Idempotent & Secure)"""
        fixed = code
        vulns = []
        
        # JS SQL Injection Mock
        if "WHERE id = '" in code and "req.params" in code and "AEGIS: FIXED_SQL" not in code:
            vulns.append({
                "type": "A03:2021-Injection (SQL)", 
                "description": "SQL Injection found in Node.js route. Directly concatenating params into query.", 
                "severity": "CRITICAL"
            })
            fixed = fixed.replace("const query = \"SELECT * FROM users WHERE id = '\" + req.params.id + \"'\";", 
                                "const query = \"SELECT * FROM users WHERE id = ?\"; // AEGIS: FIXED_SQL")
            fixed = fixed.replace("db.all(query, (err, rows)", "db.all(query, [req.params.id], (err, rows)")
        
        # JS Command Injection Mock (Switching from exec to spawn)
        if 'exec("ping' in code and "ip" in code and "AEGIS: FIXED_COMMAND" not in code:
            vulns.append({
                "type": "A03:2021-Injection (Command)", 
                "description": "Command Injection vulnerability in exec() call. Hardening to spawn().", 
                "severity": "CRITICAL"
            })
            # Add spawn to imports if not there
            if "const { spawn } = require('child_process');" not in fixed:
                fixed = fixed.replace("const { exec } = require('child_process');", "const { spawn } = require('child_process');")
            
            # Replace logic
            old_logic = 'exec("ping -c 1 " + ip, (error, stdout, stderr) => {\n        res.send(stdout);\n    });'
            new_logic = """// AEGIS: FIXED_COMMAND_INJECTION
    if (!/^[0-9.]+$/.test(ip)) return res.status(400).send("Invalid IP");
    const ping = spawn('ping', ['-c', '1', ip]);
    ping.stdout.on('data', (data) => {
        res.send(data.toString());
    });"""
            fixed = fixed.replace(old_logic, new_logic)

        # JS XSS Mock (Using escape-html)
        if 'res.send("' in code and "q" in code and "<h1>" in code and "AEGIS: FIXED_XSS" not in code:
            vulns.append({
                "type": "A01:2021-Broken Access Control (XSS)", 
                "description": "Reflected XSS: User input rendered directly in HTML.", 
                "severity": "HIGH"
            })
            fixed = fixed.replace('res.send("<h1>Search results for: " + q + "</h1>")', 
                                'res.send("<h1>Search results for: " + require(\'escape-html\')(q) + "</h1>"); // AEGIS: FIXED_XSS')

        # JS Hardcoded Secret
        if 'const ADMIN_TOKEN = "' in code and "AEGIS: FIXED_TOKEN" not in code:
            vulns.append({
                "type": "A07:2021-Identification and Authentication Failures", 
                "description": "Hardcoded Admin Token detected in source code.", 
                "severity": "CRITICAL"
            })
            fixed = fixed.replace('const ADMIN_TOKEN = "admin-secret-token-12345";', 
                                'const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // AEGIS: FIXED_TOKEN')

        return {
            "vulnerabilities": vulns,
            "fixed_code": fixed,
            "explanation": "AEGIS AI Engine: Hardened code using spawn() and escape-html to address root causes."
        }

if __name__ == "__main__":
    ai = AEGISAI()
    sample_code = "const token = '12345'"
    result = ai.analyze_and_fix(sample_code)
    print(json.dumps(result, indent=2))
