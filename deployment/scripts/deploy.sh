#!/usr/bin/env bash
# =============================================================================
# deploy.sh – Application deployment helper
# =============================================================================
# Run as the deploy user. Pulls latest code, installs deps, builds, and
# restarts the appropriate PM2 service.
#
# Usage:
#   bash deploy.sh [frontend|backend|dashboard] [branch]
#
# Examples:
#   bash deploy.sh frontend main
#   bash deploy.sh backend  main
#   bash deploy.sh dashboard main
# =============================================================================
set -euo pipefail

APP="${1:-frontend}"
BRANCH="${2:-main}"
APP_ROOT="/var/www/polymer"

info()    { echo -e "\e[34m[INFO]\e[0m  $*"; }
success() { echo -e "\e[32m[OK]\e[0m    $*"; }
error()   { echo -e "\e[31m[ERROR]\e[0m $*"; exit 1; }

case "$APP" in
  frontend)
    APP_DIR="${APP_ROOT}/frontend"
    PM2_NAME="polymer-frontend"
    ;;
  backend)
    APP_DIR="${APP_ROOT}/backend"
    PM2_NAME="polymer-backend"
    ;;
  dashboard)
    APP_DIR="${APP_ROOT}/dashboard"
    PM2_NAME="polymer-dashboard"
    ;;
  *)
    error "Unknown app '$APP'. Choose: frontend | backend | dashboard"
    ;;
esac

[[ -d "$APP_DIR" ]] || error "Directory $APP_DIR does not exist."

cd "$APP_DIR"

# ── 1. Pull latest code ───────────────────────────────────────────────────────
info "[$APP] Fetching origin/$BRANCH…"
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
success "[$APP] Code updated."

# ── 2. Install dependencies ───────────────────────────────────────────────────
info "[$APP] Installing dependencies (pnpm)…"
pnpm install --frozen-lockfile
success "[$APP] Dependencies installed."

# ── 3. Build ──────────────────────────────────────────────────────────────────
case "$APP" in
  frontend)
    info "[$APP] Building Next.js…"
    pnpm run build
    ;;
  backend)
    info "[$APP] No build step required for Node.js/Express."
    ;;
  dashboard)
    info "[$APP] Building Vite…"
    pnpm run build
    ;;
esac
success "[$APP] Build complete."

# ── 4. Restart PM2 service ────────────────────────────────────────────────────
info "[$APP] Restarting PM2 service '$PM2_NAME'…"
if pm2 describe "$PM2_NAME" &>/dev/null; then
    pm2 reload "$PM2_NAME" --update-env
else
    ECOSYSTEM="$(dirname "$0")/../pm2/ecosystem.config.js"
    pm2 start "$ECOSYSTEM" --only "$PM2_NAME" --env production
fi
pm2 save
success "[$APP] '$PM2_NAME' is running."

echo ""
echo "  Status:"
pm2 list
