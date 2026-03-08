/**
 * PM2 Ecosystem Configuration
 * Manages all three Polymer applications:
 *   - polymer-frontend  (Next.js,  port 3000)
 *   - polymer-backend   (Express,  port 5000)
 *   - polymer-dashboard (Vite/Vue, port 5173)
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    // ─── Frontend (Next.js) ───────────────────────────────────────────────────
    {
      name: "polymer-frontend",
      cwd: "/var/www/polymer/frontend",
      script: "pnpm",
      args: "exec next start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logging
      out_file: "/var/log/pm2/polymer-frontend-out.log",
      error_file: "/var/log/pm2/polymer-frontend-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Restart policy
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 5000,
      // Memory limit – restart if exceeded
      max_memory_restart: "1G",
      watch: false,
    },

    // ─── Backend API (Node.js / Express) ─────────────────────────────────────
    {
      name: "polymer-backend",
      cwd: "/var/www/polymer/backend",
      script: "src/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      out_file: "/var/log/pm2/polymer-backend-out.log",
      error_file: "/var/log/pm2/polymer-backend-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 5000,
      max_memory_restart: "512M",
      watch: false,
    },

    // ─── Admin Dashboard (Vite / Vue – served via `vite preview`) ────────────
    {
      name: "polymer-dashboard",
      cwd: "/var/www/polymer/dashboard",
      script: "pnpm",
      args: "exec vite preview --port 5173 --host 0.0.0.0",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 5173,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5173,
      },
      out_file: "/var/log/pm2/polymer-dashboard-out.log",
      error_file: "/var/log/pm2/polymer-dashboard-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 5000,
      max_memory_restart: "512M",
      watch: false,
    },
  ],
};
