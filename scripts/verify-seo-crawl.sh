#!/bin/bash
# Проверка SEO: сначала backend, потом домен
set -euo pipefail
BASE="${1:-https://teleworker.fun}"
PORT="${TELEAGENT_PORT:-3005}"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

echo "=== Backend http://127.0.0.1:${PORT}/sitemap.xml ==="
if curl -sf -m 5 "http://127.0.0.1:${PORT}/sitemap.xml" | head -3; then
  echo "OK: Next.js отвечает локально"
else
  echo "FAIL: PM2/Next.js не работает на :${PORT} — сначала: pm2 restart teleagent"
  echo "       bash scripts/diagnose-vps.sh"
  exit 1
fi
echo ""

echo "=== robots.txt (${BASE}) ==="
curl -sSI -A "$UA" -m 15 "${BASE}/robots.txt" | head -12
echo ""

echo "=== sitemap.xml (${BASE}) ==="
curl -sSI -A "$UA" -m 15 "${BASE}/sitemap.xml" | head -12
echo ""

echo "=== sitemap body ==="
curl -sS -A "$UA" -m 15 "${BASE}/sitemap.xml" | head -4
echo ""

echo "=== главная ==="
curl -sSI -A "$UA" -m 15 "${BASE}/" | head -8
