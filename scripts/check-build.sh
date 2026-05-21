#!/bin/bash
cd "$(dirname "$0")/.."
echo "PWD: $(pwd)"
if [ -f .next/standalone/server.js ]; then
  echo "OK: standalone server.js"
  [ -f .next/BUILD_ID ] && echo "BUILD_ID = $(cat .next/BUILD_ID)"
  exit 0
fi
if [ -f .next/BUILD_ID ]; then
  echo "OK: .next/BUILD_ID = $(cat .next/BUILD_ID) (без standalone)"
  exit 0
fi
echo "FAIL: .next/BUILD_ID отсутствует — нужен: npm run build"
ls -la .next 2>/dev/null || echo "(папки .next нет)"
exit 1
