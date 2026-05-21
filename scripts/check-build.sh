#!/bin/bash
cd "$(dirname "$0")/.."
echo "PWD: $(pwd)"
if [ -f .next/BUILD_ID ]; then
  echo "OK: .next/BUILD_ID = $(cat .next/BUILD_ID)"
  ls -la .next/BUILD_ID .next/server 2>/dev/null | head -5
  exit 0
fi
echo "FAIL: .next/BUILD_ID отсутствует — нужен: npm run build"
ls -la .next 2>/dev/null || echo "(папки .next нет)"
exit 1
