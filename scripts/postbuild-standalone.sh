#!/bin/bash
# Копирует static/public для Next.js standalone (обязательно после next build)
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .next/standalone/server.js ]; then
  echo "WARN: .next/standalone/server.js не найден — пропуск postbuild-standalone"
  exit 0
fi

echo "==> postbuild-standalone: public + static"
mkdir -p .next/standalone/.next
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
echo "OK: standalone готов"
