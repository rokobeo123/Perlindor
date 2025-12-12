#!/bin/bash

echo "🔄 Testing the fixes..."

# Test if components exist
echo "✅ Checking component files..."
[ -f src/components/FloatingStickers.jsx ] && echo "  ✓ FloatingStickers.jsx exists"
[ -f src/pages/MomentsWallPage.jsx ] && echo "  ✓ MomentsWallPage.jsx exists"
[ -f src/pages/AdminPanel.jsx ] && echo "  ✓ AdminPanel.jsx exists"

# Check for z-index fixes
echo "🔍 Checking for z-index fixes..."
grep -n "z-20\|z-10\|z-0" src/components/FloatingStickers.jsx
grep -n "z-20\|z-10" src/pages/MomentsWallPage.jsx
grep -n "z-20\|z-10" src/pages/AdminPanel.jsx

echo "🎉 Test complete! Restart your dev server with:"
echo "   npm run dev"
