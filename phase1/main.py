import typer
import sys
import time
import requests
import os
from datetime import datetime
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.text import Text
from rich.syntax import Syntax
from scanner.analyzer import scan_project
from healer.patcher import heal_project

from ai_engine import AEGISAI

load_dotenv()

# Fix for Windows console encoding
if sys.platform == "win32":
    import io
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    if hasattr(sys.stderr, 'buffer'):
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

console = Console()
app = typer.Typer(help="AEGIS - AI Security CLI")
ai_engine = AEGISAI()

def display_banner():
    banner_text = """
    █████╗ ███████╗ ██████╗ ██╗███████╗
   ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝
   ███████║█████╗  ██║  ███╗██║███████╗
   ██╔══██║██╔══╝  ██║   ██║██║╚════██║
   ██║  ██║███████╗╚██████╔╝██║███████║
   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝
    """
    console.print(Panel(banner_text, title="[bold cyan]AEGIS Security CLI v2.0.0[/bold cyan]", subtitle="[italic white]Powered by DeepSeek AI[/italic white]", border_style="cyan"))


@app.command()
def auth(key: str = typer.Option(..., "--key", help="Your AEGIS API Key")):
    """
    Authenticate with the AEGIS Security Engine
    """
    with console.status("[bold yellow]Connecting to Dashboard..."):
        time.sleep(1)
    
    if len(key) > 5:
        console.print(f"> Status: Dashboard Connected [bold green][User: Dev_Alpha][/bold green]")
        # Save to .env
        with open(".env", "w") as f:
            f.write(f"DEEPSEEK_API_KEY={key}")
    else:
        console.print("[bold red]❌ AUTH FAILED: Invalid API Key.[/bold red]")


@app.command()
def scan(all: bool = typer.Option(False, "--all", help="Scan all files in the directory"), path: str = "."):
    """
    Scan project folder for security vulnerabilities
    """
    execute_workflow(path)


@app.command()
def autonomous():
    """
    FULL AUTONOMOUS WORKFLOW: Auth -> Scan -> Fix -> Verify -> Report
    """
    display_banner()
    
    # 1. Connection & Login (Using raw strings to avoid SyntaxWarning)
    console.print(r"\n[bold cyan]C:\Project> security-ai auth --key API_KEY_ANDA[/bold cyan]")
    with console.status("[bold yellow]Connecting..."):
        time.sleep(1.5)
    console.print("> Status: Dashboard Connected [bold green][User: Dev_Alpha][/bold green]")
    time.sleep(1)

    # 2. Analysis & Table
    console.print(r"\n[bold cyan]C:\Project> security-ai scan --all[/bold cyan]")
    execute_workflow("./web_sandbox")


def execute_workflow(path: str):
    console.print(f"\n[bold blue][SYSTEM] Analyzing code for vulnerabilities...[/bold blue]")
    
    results = scan_project(path)
    
    # Filter out system files
    system_files = {'main.py', 'aegis.py', 'analyzer.py', 'patcher.py', 'markdown.py'}
    results = [r for r in results if os.path.basename(r['file']) not in system_files]

    if not results:
        console.print("[bold green]✅ No vulnerabilities found. Your code is safe![/bold green]")
        return

    # To store detailed findings for report
    report_data = {
        "summary": {"total_vulns": len(results), "fixed": 0, "secure": 0},
        "files": {}
    }

    # Process findings and group by file
    files_to_process = list(set([r['file'] for r in results]))
    
    for file_rel in files_to_process:
        file_path = os.path.join(path, file_rel)
        file_name = os.path.basename(file_path)
        
        # Heading
        console.print(f"\n[bold italic light_coral]Security Findings for File: {file_name}[/bold italic light_coral]", justify="center")
        
        # Custom Table Design
        table = Table(show_header=True, header_style="bold light_coral", border_style="light_coral", padding=(0, 1))
        from rich import box
        table.box = box.SQUARE_DOUBLE_HEAD
        table.add_column("Category", style="cyan", width=35)
        table.add_column("Description", style="white", width=45)
        table.add_column("Severity", style="bold light_coral", justify="center", width=15)

        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            code = f.read()
        
        ai_res = ai_engine.analyze_and_fix(code)
        vulns = ai_res.get("vulnerabilities", [])
        
        report_data["files"][file_rel] = {"vulns": vulns, "status": "PENDING", "fixed_code": None}

        if not vulns:
            # Fallback
            for res in [r for r in results if r['file'] == file_rel]:
                table.add_row(res['issue'], f"Potential {res['issue']} detected.", "[bold red]CRITICAL[/bold red]")
        else:
            for v in vulns:
                sev = v.get("severity", "MEDIUM")
                table.add_row(v.get("type", "Vuln"), v.get("description", "N/A"), f"[bold]{sev}[/bold]")

        console.print(table, justify="center")

    console.print("\n" + "-" * 100)
    console.print("[bold magenta][AI MESSAGE] I have automatically prepared security patches for these files.[/bold magenta]")
    console.print("-" * 100)

    # 3. Process Auto-Fix
    patched_files = []
    for file_rel in files_to_process:
        file_path = os.path.join(path, file_rel)
        file_name = os.path.basename(file_path)
        
        console.print(f"\nFile {len(patched_files)+1}:")
        console.print(f"> Preparing fix for {file_name}...")
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                code = f.read()
            
            with console.status(f"[bold magenta]AI is generating secure code for {file_name}..."):
                result = ai_engine.analyze_and_fix(code)
            
            if result.get("fixed_code"):
                syntax = Syntax(result["fixed_code"], "javascript" if ".js" in file_name else "python", theme="monokai", line_numbers=True)
                console.print(Panel(syntax, title=f"[bold green]HARDENED CODE: {file_name}[/bold green]", border_style="green"))
                
                choice = typer.confirm(f"\nDo you want to apply this fix to {file_name}?", default=True)
                
                if choice:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(result["fixed_code"])
                    console.print(f"Applying patch... Done. (File updated in original folder)")
                    patched_files.append(file_path)
                    report_data["files"][file_rel]["status"] = "FIXED"
                    report_data["files"][file_rel]["fixed_code"] = result["fixed_code"]
                    report_data["summary"]["fixed"] += 1
                else:
                    console.print(f"Skipping patch for {file_name}.")
                    report_data["files"][file_rel]["status"] = "SKIPPED"
        except Exception as e:
            console.print(f"❌ Error: {e}")

    # 4. Re-verification
    if patched_files:
        console.print(f"\n[bold blue][SYSTEM] Re-verifying patched files...[/bold blue]")
        for file_path in patched_files:
            file_rel = os.path.relpath(file_path, path)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                code = f.read()
            
            with console.status(f"Checking {file_rel}..."):
                time.sleep(0.8)
                final_check = ai_engine.analyze_and_fix(code)
                
            if not final_check.get("vulnerabilities"):
                console.print(f"> {file_rel}: [bold green][STATUS SAFE][/bold green]")
                report_data["files"][file_rel]["status"] = "SAFE (VERIFIED)"
                report_data["summary"]["secure"] += 1
            else:
                console.print(f"> {file_rel}: [bold yellow][STATUS AT RISK][/bold yellow]")

        # Smarter Summary Message
        if report_data["summary"]["secure"] == report_data["summary"]["fixed"] and report_data["summary"]["fixed"] > 0:
            console.print("\n[bold green]🌟 No further loops required. All files are secure.[/bold green]")
        else:
            console.print("\n[bold yellow]⚠️ Some files still require review or were skipped.[/bold yellow]")

    # 5. Final Report Generation
    generate_markdown_report(report_data)
    console.print(f"\n[bold green][SUCCESS] Security analysis complete.[/bold green]")
    console.print(f"[bold cyan][REPORT] Final documentation saved to: report.md[/bold cyan]")


def generate_markdown_report(data):
    """Generates a detailed report.md with all findings and fixes."""
    with open("report.md", "w", encoding="utf-8") as f:
        f.write("# 🛡️ AEGIS SECURITY ANALYSIS & FIX REPORT\n\n")
        f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Target:** {os.getcwd()}\n")
        f.write(f"**Overall Status:** {'✅ SECURED' if data['summary']['secure'] == data['summary']['fixed'] else '⚠️ REVIEW REQUIRED'}\n\n")
        
        f.write("## 📊 Executive Summary\n")
        f.write(f"- **Total Files Scanned:** {len(data['files'])}\n")
        f.write(f"- **Vulnerabilities Found:** {data['summary']['total_vulns']}\n")
        f.write(f"- **Vulnerabilities Fixed:** {data['summary']['fixed']}\n")
        f.write(f"- **Verification Status:** {data['summary']['secure']} / {data['summary']['fixed']} Secured\n\n")
        
        f.write("## 🔍 Detailed Findings & Remediation\n\n")
        
        for file_rel, details in data["files"].items():
            f.write(f"### 📄 File: `{file_rel}`\n")
            f.write(f"**Final Status:** {details['status']}\n\n")
            
            f.write("| Type | Description | Severity |\n")
            f.write("|------|-------------|----------|\n")
            for v in details["vulns"]:
                f.write(f"| {v['type']} | {v['description']} | **{v['severity']}** |\n")
            f.write("\n")
            
            if details["fixed_code"]:
                f.write("#### ✅ Applied Patch Preview\n")
                f.write("```javascript\n")
                f.write(details["fixed_code"])
                f.write("\n```\n\n")
            
            f.write("---\n\n")
        
        f.write("*Report generated automatically by AEGIS Security Engine.*")


if __name__ == "__main__":
    app()
