#!/usr/bin/env bash
# =============================================================================
# health-check.sh – Application health checks for all three services
# =============================================================================
# Usage:
#   bash health-check.sh          # check all apps
#   bash health-check.sh frontend # check a specific app
# =============================================================================
set -euo pipefail

TARGET="${1:-all}"
PASS=0
FAIL=0

check() {
    local name="$1" url="$2"
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")
    if [[ "$http_code" =~ ^[23] ]]; then
        echo "  ✅  $name ($url) → $http_code"
        ((PASS++)) || true
    else
        echo "  ❌  $name ($url) → $http_code"
        ((FAIL++)) || true
    fi
}

pm2_check() {
    local name="$1"
    if pm2 describe "$name" 2>/dev/null | grep -q "online"; then
        echo "  ✅  PM2 process '$name' is online"
        ((PASS++)) || true
    else
        echo "  ❌  PM2 process '$name' is NOT online"
        ((FAIL++)) || true
    fi
}

echo "════════════════════════════════════════════════════════"
echo " Polymer Production Health Check – $(date '+%Y-%m-%d %H:%M:%S')"
echo "════════════════════════════════════════════════════════"

if [[ "$TARGET" == "all" || "$TARGET" == "frontend" ]]; then
    echo ""
    echo "── Frontend (Next.js : 3000) ────────────────────────────"
    pm2_check "polymer-frontend"
    check "Frontend HTTP" "http://127.0.0.1:3000"
fi

if [[ "$TARGET" == "all" || "$TARGET" == "backend" ]]; then
    echo ""
    echo "── Backend API (Express : 5000) ─────────────────────────"
    pm2_check "polymer-backend"
    check "Backend /health" "http://127.0.0.1:5000/health"
fi

if [[ "$TARGET" == "all" || "$TARGET" == "dashboard" ]]; then
    echo ""
    echo "── Dashboard (Vite : 5173) ──────────────────────────────"
    pm2_check "polymer-dashboard"
    check "Dashboard HTTP" "http://127.0.0.1:5173"
fi

echo ""
echo "── Summary ──────────────────────────────────────────────"
echo "  Passed : $PASS"
echo "  Failed : $FAIL"
echo "════════════════════════════════════════════════════════"

[[ $FAIL -eq 0 ]] || exit 1
