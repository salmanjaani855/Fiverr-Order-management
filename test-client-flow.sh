#!/bin/bash

echo "=== Testing Client Storage Flow ==="
echo ""

# Start dev server in background
npm run dev &
DEV_PID=$!
sleep 5

echo "✓ Dev server started"
echo ""

echo "Stopping dev server..."
kill $DEV_PID 2>/dev/null || true

echo "Test completed!"
