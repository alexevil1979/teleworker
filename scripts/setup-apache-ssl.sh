#!/bin/bash
# Apache + Let's Encrypt SSL для teleworker.fun
# Запуск на VPS: sudo bash scripts/setup-apache-ssl.sh
set -euo pipefail

DOMAIN="teleworker.fun"
APP_PORT="3005"
APP_DIR="/ssd/www/teleworker"
EMAIL="${CERTBOT_EMAIL:-}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Запустите с sudo: sudo bash scripts/setup-apache-ssl.sh"
  exit 1
fi

echo "==> Модули Apache"
a2enmod proxy proxy_http ssl headers rewrite 2>/dev/null || true

echo "==> Проверка TeleAgent на :${APP_PORT}"
if ! curl -sf -o /dev/null "http://127.0.0.1:${APP_PORT}/"; then
  echo "WARN: http://127.0.0.1:${APP_PORT} не отвечает. Запустите: pm2 start ecosystem.config.cjs"
  read -r -p "Продолжить установку Apache? [y/N] " ans
  [[ "${ans,,}" == "y" ]] || exit 1
fi

echo "==> Certbot"
if ! command -v certbot >/dev/null 2>&1; then
  apt-get update
  apt-get install -y certbot python3-certbot-apache
fi

CONF_DIR="${APP_DIR}/deploy/apache"
SITE_AVAIL="/etc/apache2/sites-available/${DOMAIN}.conf"
SITE_ENABLED="/etc/apache2/sites-enabled/${DOMAIN}.conf"

if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  echo "==> Первый запуск: HTTP-only для выпуска сертификата"
  cp "${CONF_DIR}/teleworker.fun-http-only.conf" "${SITE_AVAIL}"
  a2dissite 000-default.conf 2>/dev/null || true
  a2ensite "${DOMAIN}.conf"
  apache2ctl configtest
  systemctl reload apache2

  if [ -z "$EMAIL" ]; then
    echo "Укажите email: export CERTBOT_EMAIL=you@example.com"
    read -r -p "Email для Let's Encrypt: " EMAIL
  fi

  certbot --apache -d "${DOMAIN}" -d "www.${DOMAIN}" \
    --non-interactive --agree-tos -m "${EMAIL}" --redirect
else
  echo "==> Сертификат уже есть, ставим полный vhost"
fi

cp "${CONF_DIR}/teleworker.fun.conf" "${SITE_AVAIL}"
a2ensite "${DOMAIN}.conf"
apache2ctl configtest
systemctl reload apache2

echo ""
echo "==> Готово"
echo "  https://${DOMAIN}"
echo "  https://www.${DOMAIN}"
echo ""
echo "Проверка:"
curl -sI "https://${DOMAIN}" | head -5
echo ""
echo "В .env на сервере:"
echo "  NEXT_PUBLIC_APP_URL=https://${DOMAIN}"
echo "  AUTH_URL=https://${DOMAIN}"
