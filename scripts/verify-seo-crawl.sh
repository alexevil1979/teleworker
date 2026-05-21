#!/bin/bash
# Проверка доступности SEO-файлов для Googlebot
set -euo pipefail
BASE="${1:-https://teleworker.fun}"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

echo "=== robots.txt ==="
curl -sSI -A "$UA" "$BASE/robots.txt" | head -15
echo ""
echo "=== sitemap.xml ==="
curl -sSI -A "$UA" "$BASE/sitemap.xml" | head -15
echo ""
echo "=== body (first 5 lines) ==="
curl -sS -A "$UA" "$BASE/sitemap.xml" | head -5
echo ""
echo "=== главная ==="
curl -sSI -A "$UA" "$BASE/" | head -8
