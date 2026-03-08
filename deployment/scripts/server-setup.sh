#!/usr/bin/env bash
# =============================================================================
# server-setup.sh – Polymer Production Server Bootstrap
# =============================================================================
# Run once as root (or with sudo) on a fresh Ubuntu 22.04 LTS instance.
# Usage:
#   chmod +x server-setup.sh
#   sudo bash server-setup.sh
# =============================================================================
set -euo pipefail

# ── Configurable variables ────────────────────────────────────────────────────
DEPLOY_USER="deploy"
APP_ROOT="/var/www/polymer"
SSH_PORT=2222           # Change the default SSH port (22 → custom)
NODE_VERSION="20"       # LTS major version
PNPM_VERSION="9"

# ── Colour helpers ────────────────────────────────────────────────────────────
info()    { echo -e "\e[34m[INFO]\e[0m  $*"; }
success() { echo -e "\e[32m[OK]\e[0m    $*"; }
warn()    { echo -e "\e[33m[WARN]\e[0m  $*"; }
error()   { echo -e "\e[31m[ERROR]\e[0m $*"; exit 1; }

# ── 0. Root check ─────────────────────────────────────────────────────────────
[[ $EUID -ne 0 ]] && error "This script must be run as root."

info "Starting Polymer production server setup…"

# ── 1. System update ──────────────────────────────────────────────────────────
info "Updating system packages…"
apt-get update -y && apt-get upgrade -y
apt-get install -y curl wget git unzip software-properties-common \
                   build-essential ca-certificates gnupg lsb-release

success "System packages updated."

# ── 2. Create a non-root deploy user ─────────────────────────────────────────
if id "$DEPLOY_USER" &>/dev/null; then
    warn "User '$DEPLOY_USER' already exists – skipping."
else
    useradd -m -s /bin/bash -G sudo "$DEPLOY_USER"
    passwd -l "$DEPLOY_USER"          # lock password; SSH key only
    success "Created user '$DEPLOY_USER'."
fi

# Allow deploy user to run sudo without a password (needed by CI/CD)
echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/"$DEPLOY_USER"
chmod 0440 /etc/sudoers.d/"$DEPLOY_USER"

# ── 3. SSH hardening ──────────────────────────────────────────────────────────
info "Hardening SSH (port → $SSH_PORT)…"

SSHD_CFG="/etc/ssh/sshd_config"
cp "$SSHD_CFG" "${SSHD_CFG}.bak.$(date +%s)"

# Apply settings idempotently via sed / append-if-absent
_sshd_set() {
    local key="$1" val="$2"
    if grep -qE "^#?${key}" "$SSHD_CFG"; then
        sed -i -E "s|^#?${key}.*|${key} ${val}|" "$SSHD_CFG"
    else
        echo "${key} ${val}" >> "$SSHD_CFG"
    fi
}

_sshd_set Port                    "$SSH_PORT"
_sshd_set PermitRootLogin         no
_sshd_set PasswordAuthentication  no
_sshd_set PubkeyAuthentication    yes
_sshd_set AuthorizedKeysFile      ".ssh/authorized_keys"
_sshd_set X11Forwarding           no
_sshd_set MaxAuthTries            3
_sshd_set LoginGraceTime          30
_sshd_set ClientAliveInterval     300
_sshd_set ClientAliveCountMax     2
_sshd_set AllowUsers              "$DEPLOY_USER"
# Note: 'Protocol 2' is deprecated since OpenSSH 7.4+ – protocol 1 is no longer built-in

systemctl reload sshd
success "SSH hardened. New port: $SSH_PORT"
warn "⚠️  Open port $SSH_PORT in your cloud security group BEFORE closing this session!"

# ── 4. UFW firewall ───────────────────────────────────────────────────────────
info "Configuring UFW firewall…"
apt-get install -y ufw

ufw default deny incoming
ufw default allow outgoing

ufw allow "$SSH_PORT"/tcp comment "SSH custom port"
ufw allow 80/tcp  comment "HTTP"
ufw allow 443/tcp comment "HTTPS"

# Enable without prompting (non-interactive)
ufw --force enable
ufw status verbose
success "UFW firewall configured."

# ── 5. Fail2Ban ───────────────────────────────────────────────────────────────
info "Installing and configuring Fail2Ban…"
apt-get install -y fail2ban

# Copy our jail config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cp "${REPO_ROOT}/fail2ban/nginx-http-auth.conf" /etc/fail2ban/filter.d/nginx-http-auth.conf
cp "${REPO_ROOT}/fail2ban/nginx-req-limit.conf"  /etc/fail2ban/filter.d/nginx-req-limit.conf
cp "${REPO_ROOT}/fail2ban/nginx-botsearch.conf"  /etc/fail2ban/filter.d/nginx-botsearch.conf
cp "${REPO_ROOT}/fail2ban/jail.d-polymer.conf"   /etc/fail2ban/jail.d/polymer.conf

systemctl enable fail2ban
systemctl restart fail2ban
success "Fail2Ban configured."

# ── 6. Node.js (via NodeSource) ───────────────────────────────────────────────
info "Installing Node.js ${NODE_VERSION}.x…"
curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
apt-get install -y nodejs
node --version && npm --version
success "Node.js installed."

# ── 7. pnpm ───────────────────────────────────────────────────────────────────
info "Installing pnpm ${PNPM_VERSION}…"
npm install -g "pnpm@${PNPM_VERSION}"
pnpm --version
success "pnpm installed."

# ── 8. PM2 ────────────────────────────────────────────────────────────────────
info "Installing PM2…"
npm install -g pm2
pm2 --version

# Create log directory
mkdir -p /var/log/pm2
chown -R "$DEPLOY_USER":"$DEPLOY_USER" /var/log/pm2

# Generate startup script
pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/${DEPLOY_USER}"
success "PM2 installed."

# ── 9. Nginx ──────────────────────────────────────────────────────────────────
info "Installing Nginx…"
apt-get install -y nginx
systemctl enable nginx

# Copy site configurations
for conf in "${REPO_ROOT}/nginx/"*.conf; do
    base="$(basename "$conf")"
    # Skip the global rate-limit snippet; it needs manual placement
    [[ "$base" == "nginx-rate-limit.conf" ]] && continue
    cp "$conf" "/etc/nginx/sites-available/${base}"
    ln -sf "/etc/nginx/sites-available/${base}" "/etc/nginx/sites-enabled/${base}"
done

# Disable default site
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
success "Nginx configured."

# ── 10. Application directory structure ───────────────────────────────────────
info "Creating application directories…"
mkdir -p "${APP_ROOT}"/{frontend,backend,dashboard}
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_ROOT"
success "App directories created at $APP_ROOT."

# ── 11. Certbot (Let's Encrypt) ───────────────────────────────────────────────
info "Installing Certbot…"
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot
success "Certbot installed. Run 'sudo certbot --nginx' to obtain certificates."

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════"
success "Server setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Add deploy user SSH public key:"
echo "       sudo -u $DEPLOY_USER mkdir -p /home/$DEPLOY_USER/.ssh"
echo "       echo 'YOUR_PUBLIC_KEY' | sudo tee /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "       sudo chmod 700 /home/$DEPLOY_USER/.ssh"
echo "       sudo chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys"
echo ""
echo "  2. Clone repos into $APP_ROOT/{frontend,backend,dashboard}"
echo ""
echo "  3. Obtain SSL certificates:"
echo "       sudo certbot --nginx -d example.com -d www.example.com"
echo "       sudo certbot --nginx -d api.example.com"
echo "       sudo certbot --nginx -d admin.example.com"
echo ""
echo "  4. Start apps:"
echo "       cd $APP_ROOT && pm2 start ${REPO_ROOT}/pm2/ecosystem.config.js --env production"
echo "       pm2 save"
echo "════════════════════════════════════════════════════════"
