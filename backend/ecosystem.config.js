/**
 * PM2 Ecosystem Config — Backend NestJS
 *
 * Deploy ke VPS Ubuntu:
 *   1. npm run build
 *   2. pm2 start ecosystem.config.js --env production
 *   3. pm2 save
 *   4. pm2 startup  (agar auto-start saat reboot)
 */

module.exports = {
  apps: [
    {
      name: 'rvtech-backend',
      script: 'dist/main.js',

      // ── Instance & Cluster ──────────────────────────────────────────────────
      // 'max' = gunakan semua CPU core. Ganti angka jika ingin membatasi.
      instances: 'max',
      exec_mode: 'cluster',

      // ── Auto Restart ────────────────────────────────────────────────────────
      autorestart: true,
      watch: false,           // jangan watch di production
      max_memory_restart: '512M',

      // ── Logging ─────────────────────────────────────────────────────────────
      // Winston sudah handle log ke file, PM2 log hanya untuk stdout/stderr
      out_file: './.pm2-logs/out.log',
      error_file: './.pm2-logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,

      // ── Graceful Shutdown ───────────────────────────────────────────────────
      kill_timeout: 5000,       // tunggu 5 detik sebelum SIGKILL
      wait_ready: true,         // tunggu sinyal 'ready' dari app
      listen_timeout: 10000,    // timeout menunggu app siap

      // ── Environment Variables ───────────────────────────────────────────────
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
