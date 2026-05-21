#!/bin/bash
# PM2 entrypoint — не стартует без production build
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .next/BUILD_ID ]; then
  echo ""
  echo "ERROR: Нет production-сборки (.next/BUILD_ID)"
  echo "Выполните на сервере:"
  echo "  cd /ssd/www/teleworker"
  echo "  pm2 stop teleagent"
  echo "  npm run build"
  echo "  pm2 restart teleagent"
  echo ""
  exit 1
fi

export NODE_ENV=production
export PORT="${PORT:-3005}"
exec node node_modules/next/dist/bin/next start -p "$PORT"
