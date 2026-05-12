#!/bin/bash
# AEGIS CLI Setup Script for Competition

echo "🚀 Setting up AEGIS Security CLI..."
echo "======================================"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate and install
# Note: On Windows, activation is different, but this script is bash
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p reports
mkdir -p logs
mkdir -p samples

# Create sample vulnerable file for demo
cat > samples/vulnerable_sample.py << 'EOF'
# SAMPLE VULNERABLE FILE - FOR DEMO ONLY
API_KEY = "sk-1234567890abcdef"  # HARDCODED - BAD!
SECRET = "mysecret123"

def bad_function():
    user_input = input("Enter data: ")
    eval(user_input)  # DANGEROUS!

DEBUG = True
EOF

# Create .env template
cat > .env.example << 'EOF'
# Environment Variables Template
API_KEY=your-api-key-here
SECRET_KEY=your-secret-here
DATABASE_URL=postgresql://localhost/db
DEBUG=False
EOF

# Create README for competition
cat > README.md << 'EOF'
# AEGIS Security CLI - Competition Entry

## Quick Demo
```bash
python aegis.py demo
```

## Features
🔍 Security Scanner
🔧 Auto-Healer
📄 Report Generator
📊 Status Dashboard

## Commands
```bash
python aegis.py scan     # Scan for vulnerabilities
python aegis.py heal     # Auto-fix issues
python aegis.py report   # Generate report
python aegis.py status   # Show system status
```
EOF

# Make main script executable
chmod +x aegis.py

echo ""
echo "✅ SETUP COMPLETE!"
echo "======================================"
echo ""
echo "🎯 READY FOR COMPETITION DEMO:"
echo " python aegis.py demo"
echo ""
echo "📋 Other commands:"
echo " python aegis.py status"
echo " python aegis.py scan"
echo " python aegis.py report"
echo ""
