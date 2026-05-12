#!/bin/bash
# Complete Demo for Competition

echo "🎬 AEGIS CLI COMPETITION DEMO"
echo "================================"
echo ""

# Step 1: Show help
echo "1️⃣ SHOWING HELP MENU"
python aegis.py help
echo ""

# Step 2: Show status
echo "2️⃣ SYSTEM STATUS"
python aegis.py status
echo ""

# Step 3: Run scan
echo "3️⃣ SECURITY SCAN"
python aegis.py scan samples/
echo ""

# Step 4: Auto-heal
echo "4️⃣ AUTO-HEALING"
python aegis.py heal
echo ""

# Step 5: Generate report
echo "5️⃣ GENERATING REPORT"
python aegis.py report
echo ""

# Step 6: Show final status
echo "6️⃣ FINAL STATUS"
python aegis.py status
echo ""

echo "================================"
echo "✅ DEMO COMPLETE!"
echo "📄 Check reports/ for detailed report"
echo ""
