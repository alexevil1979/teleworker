#!/bin/bash
# Полный деплой на VPS: /ssd/www/teleworker
set -euo pipefail

cd "$(dirname "$0")/.."
APP_DIR="$(pwd)"

echo "==> $APP_DIR"

if [ ! -f .env ]; then
  echo "Ошибка: создайте .env из .env.example"
  exit 1
fi

echo "==> npm install"
npm install

echo "==> prisma db push"
npx prisma db push

echo "==> seed (опционально, безопасный upsert)"
npm run db:seed || true

echo "==> production build"
export NODE_ENV=production
npm run build

if [ ! -f .next/BUILD_ID ]; then
  echo "Ошибка: сборка не создала .next/BUILD_ID"
  exit 1
fi

echo "==> BUILD_ID: $(cat .next/BUILD_ID)"

mkdir -p logs
echo "==> pm2"
pm2 delete teleagent 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

sleep 3
pm2 status teleagent
curl -sf -o /dev/null -I http://127.0.0.1:3005 && echo "OK: http://127.0.0.1:3005" || echo "WARN: curl failed — см. pm2 logs teleagent"
