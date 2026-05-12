# AEGIS CLI - Competition Cheatsheet

## What is AEGIS?
**A**utomated **E**ngine for **G**eneric **I**nternal **S**ecurity
A CLI tool for automated security analysis and remediation.

## Key Features (MVP)

### 1. Security Scanner
- Detects hardcoded API keys
- Finds exposed secrets
- Identifies dangerous functions (eval/exec)

### 2. Auto-Healer
- Creates .env files automatically
- Moves hardcoded secrets to environment
- Adds proper imports and gitignore

### 3. Report Generator
- Markdown and JSON output
- Security score calculation
- Actionable recommendations

## Demo Commands

```bash
# Complete 2-minute demo
python aegis.py demo

# Quick scan
python aegis.py scan .

# Fix issues
python aegis.py heal

# Generate report
python aegis.py report
```

## Competition Value
✅ Working MVP - All features functional
✅ Impressive Demo - Single command shows everything
✅ Clean UI - Colored output, banners, progress bars
✅ Real Use Case - Solves actual security problems
✅ Extensible - Easy to add more scanners

## Time to Demo: ~90 seconds
1. `python aegis.py demo` (5 sec to type)
2. Watch scan run (30 sec)
3. See auto-healing (20 sec)
4. View generated report (20 sec)
5. Final status display (15 sec)
