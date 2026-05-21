#!/bin/bash
# Быстрый перезапуск после сборки
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> build"
npm run build

echo "==> pm2"
pm2 delete teleagent 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

sleep 6
echo ""
echo "==> check :3005"
curl -sI "http://127.0.0.1:3005/" | head -5
echo ""
pm2 status teleagent
