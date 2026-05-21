#!/bin/bash
# Диагностика 503: Apache → PM2 → Next.js
set -euo pipefail
PORT="${TELEAGENT_PORT:-3005}"
APP_DIR="${APP_DIR:-/ssd/www/teleworker}"

echo "========== TeleAgent VPS diagnose =========="
echo ""

echo "=== 1. PM2 teleagent ==="
pm2 describe teleagent 2>/dev/null | grep -E 'status|script path|exec cwd|restarts|uptime' || echo "teleagent не найден в PM2"
echo ""

echo "=== 2. Порт ${PORT} ==="
if ss -tlnp | grep -q ":${PORT} "; then
  ss -tlnp | grep ":${PORT} "
else
  echo "FAIL: ничего не слушает :${PORT}"
fi
echo ""

echo "=== 3. curl backend (локально) ==="
if curl -sf -o /dev/null -m 5 "http://127.0.0.1:${PORT}/"; then
  echo "OK: http://127.0.0.1:${PORT}/"
  curl -sI "http://127.0.0.1:${PORT}/sitemap.xml" | head -5
else
  echo "FAIL: backend не отвечает на :${PORT}"
  echo "  → cd ${APP_DIR} && npm run build && pm2 restart teleagent"
  echo "  → pm2 logs teleagent --lines 40"
fi
echo ""

echo "=== 4. Сборка ==="
if [ -f "${APP_DIR}/.next/BUILD_ID" ]; then
  echo "OK: BUILD_ID=$(cat "${APP_DIR}/.next/BUILD_ID")"
else
  echo "FAIL: нет ${APP_DIR}/.next/BUILD_ID → npm run build"
fi
if [ -f "${APP_DIR}/.next/standalone/server.js" ]; then
  echo "OK: standalone server.js"
else
  echo "WARN: нет standalone (используется next start)"
fi
echo ""

echo "=== 5. Apache vhost (порт в ProxyPass) ==="
if [ -f /etc/apache2/sites-enabled/teleworker.fun.conf ]; then
  grep -E 'ProxyPass|ServerName' /etc/apache2/sites-enabled/teleworker.fun.conf | head -6
else
  echo "WARN: нет /etc/apache2/sites-enabled/teleworker.fun.conf"
  ls /etc/apache2/sites-enabled/ 2>/dev/null || true
fi
echo ""

echo "=== 6. curl через домен ==="
curl -sSI -m 10 "https://teleworker.fun/" 2>/dev/null | head -8 || echo "HTTPS недоступен"
echo ""

echo "=== 7. Apache error log (последние строки) ==="
tail -5 /var/log/apache2/teleworker.fun-error.log 2>/dev/null \
  || tail -5 /var/log/apache2/error.log 2>/dev/null \
  || echo "(лог не найден)"
echo ""
echo "========== done =========="
