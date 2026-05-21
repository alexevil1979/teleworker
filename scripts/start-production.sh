#!/bin/bash
# PM2 entrypoint для production (standalone или classic .next)
set -euo pipefail
cd "$(dirname "$0")/.."

export NODE_ENV=production
export PORT="${PORT:-3005}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

if [ -f .next/standalone/server.js ]; then
  bash scripts/postbuild-standalone.sh
  echo "==> node .next/standalone/server.js (port $PORT)"
  exec node .next/standalone/server.js
fi

if [ ! -f .next/BUILD_ID ]; then
  echo ""
  echo "ERROR: Нет production-сборки"
  echo "  cd /ssd/www/teleworker && pm2 stop teleagent && npm run build && pm2 restart teleagent"
  echo ""
  exit 1
fi

echo "==> next start (port $PORT)"
exec node node_modules/next/dist/bin/next start -p "$PORT"
