# Деплой на VPS (teleworker.fun)

Путь на сервере: `/ssd/www/teleworker`  
Стек на VPS: Apache, MySQL 5.7, PHP 8.2 — **приложение TeleAgent — Node.js**, БД рекомендуется **PostgreSQL** (Neon или отдельный контейнер). MySQL с Prisma не используется в этой схеме.

## 1. Клонирование

```bash
cd /ssd/www
git clone https://github.com/alexevil1979/teleworker.git teleworker
cd teleworker
```

## 2. Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3. Переменные окружения

```bash
cp .env.example .env
nano .env
```

Обязательно: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL=https://teleworker.fun`, `NEXT_PUBLIC_APP_URL=https://teleworker.fun`

## 4. Сборка

```bash
# На Linux предпочтительно npm install (lockfile с optional deps для tailwind/oxide)
npm install
npm run db:push
npm run db:seed
npm run build
```

Если `npm ci` падает с `Missing: @emnapi/*` — выполните `git pull` и `npm install`.

## 5. PM2

```bash
npm install -g pm2
pm2 delete teleagent 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Запускать **только после** успешного `npm run build`.

```bash
mkdir -p logs
pm2 delete teleagent 2>/dev/null || true
# TeleAgent использует 3005. Диагностика 3000: bash scripts/find-port-3000.sh
pm2 start ecosystem.config.cjs
pm2 save
```

### PM2: много рестартов (↺) и CPU 100%

1. Логи: `pm2 logs teleagent --lines 80`
2. Сборка есть: `test -f .next/BUILD_ID && echo OK || npm run build`
3. Порт занят другим процессом:
   ```bash
   ss -tlnp | grep 3000
   kill <PID>   # не teleagent
   pm2 restart teleagent
   ```
4. `.env`: `DATABASE_URL`, `AUTH_SECRET` (≥32 символа), `AUTH_URL`, `NEXT_PUBLIC_APP_URL`

Приложение слушает порт **3005** (чтобы не конфликтовать с другими Next.js на 3000, например nio-frontend).

## 6. Apache reverse proxy + SSL

```apache
<VirtualHost *:443>
    ServerName teleworker.fun
    SSLEngine on
    # SSLCertificateFile /path/to/fullchain.pem
    # SSLCertificateKeyFile /path/to/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3005/
    ProxyPassReverse / http://127.0.0.1:3005/
</VirtualHost>
```

```bash
sudo a2enmod proxy proxy_http ssl
sudo systemctl reload apache2
```

## 7. Webhooks

- ЮKassa: `https://teleworker.fun/api/payments/yookassa/webhook`
- Stripe: `https://teleworker.fun/api/payments/stripe/webhook`

## 8. Обновление

```bash
cd /ssd/www/teleworker
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 restart teleagent
```
