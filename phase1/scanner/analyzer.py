import os
import re

patterns = {
    "Hardcoded API Key": r"(api[_-]?key|apikey|token)\s*=\s*['\"].+['\"]",
    "Hardcoded Password": r"password\s*=\s*['\"].+['\"]",
    "Eval Usage": r"eval\(",
    "Exec Usage": r"exec\(",
    "Debug Mode": r"debug\s*=\s*True",
    "SQL Injection Risk": r"SELECT .* \+ .*",
    "Node Command Injection": r"exec\(.* \+ .*\)",
    "XSS Vulnerability": r"res\.send\(.*req\.query.*\)"
}

def scan_project(path):
    findings = []
    excluded_dirs = {'venv', '.git', '__pycache__', 'node_modules', 'env', 'reports'}

    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in excluded_dirs]
        
        for file in files:
            if file.endswith((".py", ".js", ".java", ".php", ".env", ".txt", ".yml", ".yaml")):
                full_path = os.path.join(root, file)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        lines = content.splitlines()
                        
                        file_findings = set()
                        
                        # Whole file check for context-aware scanning
                        has_escape = "escape-html" in content
                        has_spawn = "spawn(" in content
                        has_aegis_fix = "AEGIS: FIXED" in content

                        for i, line in enumerate(lines):
                            # Skip lines already hardened or explicitly marked
                            if "AEGIS: FIXED" in line or "// AEGIS: FIXED" in line:
                                continue
                            
                            for issue, pattern in patterns.items():
                                if re.search(pattern, line, re.IGNORECASE):
                                    # Smarter XSS: ignore if escape-html is present in the file/line
                                    if issue == "XSS Vulnerability" and has_escape:
                                        continue
                                    
                                    # Smarter Command Injection: ignore if spawn is used instead of exec
                                    if issue == "Node Command Injection" and has_spawn:
                                        continue
                                    
                                    # Don't report os.getenv calls as hardcoded secrets
                                    if "Hardcoded" in issue and ("os.getenv" in line or "process.env" in line):
                                        continue
                                    
                                    file_findings.add(issue)
                        
                        for issue in file_findings:
                            findings.append({
                                "file": os.path.relpath(full_path, path),
                                "issue": issue
                            })
                except Exception:
                    continue

    return findings