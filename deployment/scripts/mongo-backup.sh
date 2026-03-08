#!/usr/bin/env bash
# =============================================================================
# mongo-backup.sh – MongoDB daily backup with rotation
# =============================================================================
# Schedule with cron (runs daily at 02:00 AM):
#   sudo crontab -e
#   0 2 * * * /var/www/polymer/deployment/scripts/mongo-backup.sh >> /var/log/mongo-backup.log 2>&1
# =============================================================================
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
MONGO_URI="${MONGO_URI:-mongodb://127.0.0.1:27017}"
DB_NAME="${MONGO_DB_NAME:-polymer}"
BACKUP_DIR="/var/backups/mongodb"
DATE="$(date +%Y%m%d_%H%M%S)"
BACKUP_PATH="${BACKUP_DIR}/${DB_NAME}_${DATE}"
RETENTION_DAYS=7          # Keep backups for this many days
S3_BUCKET="${S3_BACKUP_BUCKET:-}"  # Optional: s3://your-bucket/mongodb/

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  $*"; }
success() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [OK]    $*"; }
error()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*"; exit 1; }

# ── Check mongodump ───────────────────────────────────────────────────────────
command -v mongodump &>/dev/null || error "mongodump not found. Install mongodb-database-tools."

# ── Create backup directory ───────────────────────────────────────────────────
mkdir -p "$BACKUP_DIR"

# ── Dump database ─────────────────────────────────────────────────────────────
info "Starting backup of '$DB_NAME' → $BACKUP_PATH"
mongodump \
    --uri="$MONGO_URI" \
    --db="$DB_NAME" \
    --out="$BACKUP_PATH" \
    --gzip

success "Dump complete: $BACKUP_PATH"

# ── Compress to single archive ────────────────────────────────────────────────
ARCHIVE="${BACKUP_PATH}.tar.gz"
tar -czf "$ARCHIVE" -C "$BACKUP_DIR" "$(basename "$BACKUP_PATH")"
rm -rf "$BACKUP_PATH"
success "Archive created: $ARCHIVE"

# ── Upload to S3 (optional) ───────────────────────────────────────────────────
if [[ -n "$S3_BUCKET" ]]; then
    if command -v aws &>/dev/null; then
        info "Uploading to $S3_BUCKET…"
        aws s3 cp "$ARCHIVE" "${S3_BUCKET}/$(basename "$ARCHIVE")" \
            --storage-class STANDARD_IA
        success "Uploaded to S3."
    else
        info "aws CLI not found – skipping S3 upload."
    fi
fi

# ── Prune old backups ─────────────────────────────────────────────────────────
info "Removing backups older than ${RETENTION_DAYS} days…"
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +"$RETENTION_DAYS" -delete
success "Rotation complete."

info "Backup finished. Current backups:"
ls -lh "$BACKUP_DIR"
