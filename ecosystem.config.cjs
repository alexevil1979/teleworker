/** PM2: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "teleagent",
      cwd: "/ssd/www/teleworker",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
