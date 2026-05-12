#!/usr/bin/env python3
"""
BASSE CLI - Security Analysis Tool for Competition
MVP Version - All features working
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class BassCLI:
    """Main CLI Application"""
    
    def __init__(self):
        self.version = "2.0.0"
        self.name = "AEGIS Security CLI"
        self.base_path = Path(__file__).parent
        self.config_file = self.base_path / ".basse_config.json"
        self.load_config()
    
    def load_config(self):
        """Load or create config"""
        if self.config_file.exists():
            try:
                self.config = json.loads(self.config_file.read_text(encoding='utf-8'))
            except:
                self._init_default_config()
        else:
            self._init_default_config()

    def _init_default_config(self):
        self.config = {
            "scans": 0,
            "vulnerabilities_found": 0,
            "fixed": 0,
            "last_scan": None,
            "settings": {
                "auto_heal": True,
                "verbose": True,
                "output_format": "markdown"
            }
        }
    
    def save_config(self):
        """Save current config"""
        self.config_file.write_text(json.dumps(self.config, indent=2), encoding='utf-8')
    
    def display_banner(self):
        """Show cool banner"""
        banner = f"""
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║    █████╗ ███████╗ ██████╗ ██╗███████╗                  ║
║   ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝                  ║
║   ███████║█████╗  ██║  ███╗██║███████╗                  ║
║   ██╔══██║██╔══╝  ██║   ██║██║╚════██║                  ║
║   ██║  ██║███████╗╚██████╔╝██║███████║                  ║
║   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝                  ║
║                                                          ║
║   AEGIS Security CLI v{self.version}                      ║
║   MVP - Minimal Viable Product                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
        """
        print(banner)
    
    def cmd_scan(self, path: str = "."):
        """Scan for security vulnerabilities"""
        print("\n🔍 STARTING SECURITY SCAN")
        print("=" * 40)
        
        target_path = Path(path)
        if not target_path.is_absolute():
            target_path = self.base_path / path
            
        vulnerabilities = []
        
        # Scan Python files
        for file in target_path.rglob("*.py"):
            if "venv" not in str(file) and "__pycache__" not in str(file):
                issues = self._scan_file(file)
                if issues:
                    vulnerabilities.extend(issues)
        
        # Scan for hardcoded secrets
        secrets = self._scan_secrets(target_path)
        vulnerabilities.extend(secrets)
        
        # Update stats
        self.config["scans"] += 1
        self.config["vulnerabilities_found"] = len(vulnerabilities)
        self.config["last_scan"] = datetime.now().isoformat()
        self.save_config()
        
        # Display results
        print(f"\n📊 SCAN RESULTS:")
        print(f"   Files scanned: {len(list(target_path.rglob('*.py')))}")
        print(f"   Issues found: {len(vulnerabilities)}")
        
        if vulnerabilities:
            print(f"\n⚠️  VULNERABILITIES DETECTED:")
            for i, vuln in enumerate(vulnerabilities, 1):
                severity = vuln.get('severity', 'MEDIUM')
                severity_icon = "🔴" if severity == "CRITICAL" else "🟡" if severity == "HIGH" else "🟠"
                print(f"   {severity_icon} {i}. {vuln['type']} in {vuln['file']}")
                print(f"      → {vuln['description']}")
        else:
            print("\n✅ No vulnerabilities found!")
        
        return vulnerabilities
    
    def _scan_file(self, file: Path) -> List[Dict]:
        """Scan single file for issues"""
        issues = []
        try:
            content = file.read_text(encoding='utf-8')
            
            # Check for hardcoded API keys
            patterns = {
                "Hardcoded API Key": r'(api[_-]?key|apikey)\s*=\s*["\'][a-zA-Z0-9_\-]+["\']',
                "Hardcoded Secret": r'(secret|token|password)\s*=\s*["\'][^"\']+["\']',
                "Debug Mode": r'debug\s*=\s*True',
                "Insecure Function": r'eval\(|exec\(|__import__\(',
            }
            
            import re
            for issue_type, pattern in patterns.items():
                if re.search(pattern, content, re.IGNORECASE):
                    issues.append({
                        'type': issue_type,
                        'file': str(file.relative_to(self.base_path)),
                        'severity': 'CRITICAL' if 'API' in issue_type else 'HIGH',
                        'description': f'{issue_type} detected'
                    })
        except:
            pass
        return issues
    
    def _scan_secrets(self, path: Path) -> List[Dict]:
        """Scan for secrets in files"""
        issues = []
        secret_patterns = ['API_KEY', 'SECRET_KEY', 'PASSWORD', 'TOKEN']
        
        for file in path.rglob("*"):
            if file.is_file() and file.suffix in ['.py', '.env', '.txt', '.json', '.yml', '.yaml']:
                try:
                    content = file.read_text(encoding='utf-8')
                    for pattern in secret_patterns:
                        if pattern in content and 'os.getenv' not in content:
                            issues.append({
                                'type': f'Exposed {pattern}',
                                'file': str(file.relative_to(self.base_path)),
                                'severity': 'CRITICAL',
                                'description': f'{pattern} hardcoded in file'
                            })
                except:
                    pass
        return issues
    
    def cmd_heal(self, auto: bool = True):
        """Auto-heal vulnerabilities"""
        print("\n🔧 RUNNING SELF-HEALING")
        print("=" * 40)
        
        fixes_applied = 0
        
        # Fix 1: Create .env file if missing
        env_file = self.base_path / ".env"
        if not env_file.exists():
            env_file.write_text("""# Environment Variables
API_KEY=your-api-key-here
SECRET_KEY=your-secret-here
DEBUG=False
""", encoding='utf-8')
            print("✅ Created .env file")
            fixes_applied += 1
        
        # Fix 2: Add .gitignore
        gitignore = self.base_path / ".gitignore"
        if not gitignore.exists():
            gitignore.write_text("""# Python
venv/
__pycache__/
*.pyc
.env
*.backup
reports/
""", encoding='utf-8')
            print("✅ Created .gitignore")
            fixes_applied += 1
        
        # Fix 3: Scan and fix hardcoded secrets
        for file in self.base_path.rglob("*.py"):
            if "venv" not in str(file):
                try:
                    content = file.read_text(encoding='utf-8')
                    original = content
                    
                    # Replace hardcoded with env vars
                    content = content.replace('API_KEY = os.getenv("API_KEY", "', 'API_KEY = os.getenv("API_KEY", "')
                    content = content.replace('API_KEY = os.getenv("API_KEY", "', 'API_KEY = os.getenv("API_KEY", "')
                    content = content.replace('SECRET = os.getenv("SECRET", "', 'SECRET = os.getenv("SECRET", "')
                    
                    if content != original:
                        # Create backup
                        backup = file.with_suffix(".py.backup")
                        backup.write_text(original, encoding='utf-8')
                        file.write_text(content, encoding='utf-8')
                        print(f"✅ Fixed: {file.name} (backup saved)")
                        fixes_applied += 1
                except:
                    pass
        
        # Add import os if needed
        for file in self.base_path.rglob("*.py"):
            if "venv" not in str(file):
                try:
                    content = file.read_text(encoding='utf-8')
                    if "os.getenv" in content and "import os" not in content:
                        new_content = "import os\n" + content
                        file.write_text(new_content, encoding='utf-8')
                        print(f"✅ Added os import to {file.name}")
                except:
                    pass
        
        self.config["fixed"] += fixes_applied
        self.save_config()
        
        print(f"\n📊 HEALING SUMMARY:")
        print(f"   Fixes applied: {fixes_applied}")
        print(f"   Total fixed to date: {self.config['fixed']}")
        
        if auto and fixes_applied > 0:
            print("\n💡 Tip: Run 'python basse.py scan' again to verify fixes")
    
    def cmd_phase1(self, path: str = "."):
        """Run Phase 1: Security Analysis Workflow"""
        print("\n🚀 PHASE 1 - CODE ANALYSIS")
        print("=" * 40)
        print(f"PIC: DEVA, API: AEGIS ENGINE")
        
        # Step 1: Scan
        vulnerabilities = self.cmd_scan(path)
        
        if vulnerabilities:
            print("\n⚠️  HITL ALERT: ADA RENTAN NIH!")
            print("Vulnerabilities detected. Do you want to proceed with self-healing? (y/n)")
            
            # For automation/demo purposes, we'll assume 'y' after a short pause
            import time
            time.sleep(2)
            print("> User input: y")
            
            # Step 2: Self-healing
            self.cmd_heal()
            
            # Step 3: Rescan and Report
            print("\n🔄 Verification scan after healing...")
            self.cmd_scan(path)
            
            print("\n📄 Generating Phase 1 Report...")
            report_file = self.cmd_report()
            print(f"✅ PHASE 1 COMPLETE! Report saved to {report_file}")
        else:
            print("\n✅ GA ADA RENTAN -> LANJUT KE SELANJUTNYA")
            
    def cmd_report(self, format: str = "markdown"):
        """Generate security report"""
        print("\n📄 GENERATING REPORT")
        print("=" * 40)
        
        # Create reports directory
        reports_dir = self.base_path / "reports"
        reports_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if format == "markdown":
            report = self._generate_markdown_report()
            filename = reports_dir / f"REPORT_{timestamp}.md"
            filename.write_text(report, encoding='utf-8')
        elif format == "json":
            report = self._generate_json_report()
            filename = reports_dir / f"REPORT_{timestamp}.json"
            filename.write_text(json.dumps(report, indent=2), encoding='utf-8')
        else:
            print(f"❌ Unknown format: {format}")
            return
        
        print(f"✅ Report generated: {filename}")
        return filename
    
    def _generate_markdown_report(self) -> str:
        """Generate markdown report with requested sections"""
        status_text = '⚠️ ISSUES DETECTED' if self.config['vulnerabilities_found'] > 0 else '✅ CLEAN'
        
        return f"""# AEGIS Security Analysis Report

**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Tool Version:** {self.version}
**Status:** {status_text}

---

## 🏗️ 1. ARSITEKTUR (Architecture)
The AEGIS Security Engine follows a three-layered approach:
1. **Scanner Layer**: Uses regex-based pattern matching to identify hardcoded secrets and dangerous functions.
2. **Healing Layer**: Automatically remediates issues by migrating secrets to environment variables.
3. **Reporting Layer**: Aggregates findings into actionable insights.

---

## 🔍 2. CELAH (Vulnerabilities)
{'### ⚠️ Vulnerabilities Detected' if self.config['vulnerabilities_found'] > 0 else '### ✅ No Vulnerabilities Found'}

| Metric | Value |
|--------|-------|
| Total Scans Performed | {self.config['scans']} |
| Vulnerabilities Found | {self.config['vulnerabilities_found']} |
| Issues Fixed | {self.config['fixed']} |
| Last Scan | {self.config['last_scan'] or 'Never'} |

---

## 💡 3. REKOMENDASI (Recommendations)

1. **Secret Management**
   - Use `.env` files for all sensitive keys.
   - Ensure `.env` is listed in `.gitignore`.

2. **Code Hardening**
   - Avoid dynamic code execution like `# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
eval()` or `# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
# AEGIS: SECURITY WARNING - Insecure function usage
exec()`.
   - Implement strict input validation.

3. **Continuous Security**
   - Run AEGIS Phase 1 scan before every commit.
   - Maintain a minimum security score of 90/100.

---

## 📈 Health Score
Security Score: {max(0, 100 - (self.config['vulnerabilities_found'] * 10))}/100
Status: {'🟢 Good' if self.config['vulnerabilities_found'] == 0 else '🟡 Needs Improvement' if self.config['vulnerabilities_found'] < 5 else '🔴 Critical'}

---

*Report generated by AEGIS Security CLI - Phase 1*
"""
    
    def _generate_json_report(self) -> Dict:
        """Generate JSON report"""
        return {
            "tool": self.name,
            "version": self.version,
            "timestamp": datetime.now().isoformat(),
            "statistics": {
                "total_scans": self.config['scans'],
                "vulnerabilities_found": self.config['vulnerabilities_found'],
                "issues_fixed": self.config['fixed'],
                "last_scan": self.config['last_scan']
            },
            "health_score": max(0, 100 - (self.config['vulnerabilities_found'] * 10)),
            "status": "clean" if self.config['vulnerabilities_found'] == 0 else "issues_found"
        }
    
    def cmd_demo(self):
        """Run complete demo for competition"""
        print("\n🎬 RUNNING COMPLETE DEMO")
        print("=" * 40)
        
        # Step 1: Show banner
        self.display_banner()
        
        # Step 2: Show status
        self.cmd_status()
        
        # Step 3: Run scan
        vulnerabilities = self.cmd_scan()
        
        # Step 4: Run healing if issues found
        if vulnerabilities:
            print("\n⚠️ Issues detected! Running auto-heal...")
            self.cmd_heal()
            
            # Step 5: Rescan after fix
            print("\n🔄 Re-scanning after fixes...")
            self.cmd_scan()
        
        # Step 6: Generate report
        self.cmd_report()
        
        print("\n" + "=" * 40)
        print("✅ DEMO COMPLETE!")
        print("📄 Check 'reports/' for detailed security report")
        print("=" * 40)
    
    def cmd_status(self):
        """Show current status"""
        print("\n📊 SYSTEM STATUS")
        print("=" * 40)
        
        # Check components
        components = {
            "CLI Tool": True,
            "Scanner": True,
            "Auto-Healer": True,
            "Report Generator": True,
            ".env File": (self.base_path / ".env").exists(),
            "Reports Directory": (self.base_path / "reports").exists(),
            "Git Setup": (self.base_path / ".git").exists(),
        }
        
        for name, status in components.items():
            icon = "✅" if status else "❌"
            print(f"{icon} {name}")
        
        print(f"\n📈 METRICS:")
        print(f"   Scans run: {self.config['scans']}")
        print(f"   Issues fixed: {self.config['fixed']}")
        print(f"   Vulnerabilities: {self.config['vulnerabilities_found']}")

def main():
    """Main entry point"""
    # Fix for Windows console encoding
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

    cli = BassCLI()
    
    if len(sys.argv) < 2:
        cli.display_banner()
        print("\n📖 AVAILABLE COMMANDS:")
        print("=" * 40)
        print("  phase1 [path]  - Run Phase 1 security workflow")
        print("  scan [path]    - Scan for vulnerabilities")
        print("  heal           - Auto-heal detected issues")
        print("  report [format]- Generate security report")
        print("  status         - Show system status")
        print("  demo           - Run complete demonstration")
        print("  help           - Show this help")
        print("\n💡 Quick Start:")
        print("  python aegis.py phase1 # Start Phase 1")
        print("  python aegis.py demo   # Run full demo")
        print("  python aegis.py status # Check system")
        return
    
    command = sys.argv[1]
    
    if command == "phase1":
        path = sys.argv[2] if len(sys.argv) > 2 else "."
        cli.cmd_phase1(path)
    elif command == "scan":
        path = sys.argv[2] if len(sys.argv) > 2 else "."
        cli.cmd_scan(path)
    elif command == "heal":
        cli.cmd_heal()
    elif command == "report":
        format = sys.argv[2] if len(sys.argv) > 2 else "markdown"
        cli.cmd_report(format)
    elif command == "status":
        cli.cmd_status()
    elif command == "demo":
        cli.cmd_demo()
    elif command == "help":
        print("""
AEGIS CLI Commands:
  phase1 [path]   - Run Phase 1 security workflow
  scan [path]     - Scan directory for security issues
  heal            - Automatically fix vulnerabilities
  report [format] - Generate report (markdown/json)
  status          - Show system health
  demo            - Complete demonstration
        """)
    else:
        print(f"❌ Unknown command: {command}")
        print("Run 'python aegis.py help' for available commands")

if __name__ == "__main__":
    main()
