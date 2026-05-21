/** PM2: cd /ssd/www/teleworker && pm2 start ecosystem.config.cjs */
const path = require("path");

const appDir = __dirname;

module.exports = {
  apps: [
    {
      name: "teleagent",
      cwd: appDir,
      script: path.join(appDir, "node_modules/next/dist/bin/next"),
      args: "start -p 3000",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 15,
      min_uptime: "30s",
      restart_delay: 5000,
      exp_backoff_restart_delay: 2000,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      error_file: path.join(appDir, "logs/pm2-error.log"),
      out_file: path.join(appDir, "logs/pm2-out.log"),
      merge_logs: true,
      time: true,
    },
  ],
};
