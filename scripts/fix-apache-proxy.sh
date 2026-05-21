#!/bin/bash
# Обновить Apache vhost на порт 3005 и перезагрузить
set -euo pipefail
APP_DIR="${APP_DIR:-/ssd/www/teleworker}"
PORT="${TELEAGENT_PORT:-3005}"

if [ "$(id -u)" -ne 0 ]; then
  echo "sudo bash scripts/fix-apache-proxy.sh"
  exit 1
fi

if ! curl -sf -m 3 "http://127.0.0.1:${PORT}/" >/dev/null; then
  echo "ERROR: сначала поднимите backend на :${PORT}"
  echo "  cd ${APP_DIR} && pm2 restart teleagent"
  exit 1
fi

a2enmod proxy proxy_http ssl headers rewrite 2>/dev/null || true

cp "${APP_DIR}/deploy/apache/teleworker.fun.conf" /etc/apache2/sites-available/teleworker.fun.conf

# Если сертификата ещё нет — не ломать SSL-блок
if [ ! -f "/etc/letsencrypt/live/teleworker.fun/fullchain.pem" ]; then
  echo "WARN: нет SSL cert — используйте certbot или http-only conf"
fi

a2ensite teleworker.fun.conf 2>/dev/null || true
apache2ctl configtest
systemctl reload apache2

echo "OK: Apache → 127.0.0.1:${PORT}"
curl -sSI -m 10 "https://teleworker.fun/" | head -5
