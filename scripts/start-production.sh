#!/bin/bash
# PM2 entrypoint для production (standalone или classic .next)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export NODE_ENV=production
export PORT="${PORT:-3005}"
# Важно: на Linux HOSTNAME часто = имя сервера (servv), тогда Next не слушает 127.0.0.1
export HOSTNAME="0.0.0.0"

if [ -f .next/standalone/server.js ]; then
  bash scripts/postbuild-standalone.sh
  [ -f .env ] && cp -f .env .next/standalone/.env
  cd .next/standalone
  echo "==> node server.js (cwd=$(pwd), port=$PORT)"
  exec node server.js
fi

if [ ! -f .next/BUILD_ID ]; then
  echo ""
  echo "ERROR: Нет production-сборки — выполните: npm run build"
  echo ""
  exit 1
fi

cd "$ROOT"
echo "==> next start (port $PORT)"
exec node node_modules/next/dist/bin/next start -p "$PORT" -H 0.0.0.0
