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
npm ci
npm run db:push
npm run db:seed
npm run build
```

## 5. PM2

```bash
npm install -g pm2
pm2 start npm --name teleagent -- start
pm2 save
pm2 startup
```

Приложение слушает порт **3000**.

## 6. Apache reverse proxy + SSL

```apache
<VirtualHost *:443>
    ServerName teleworker.fun
    SSLEngine on
    # SSLCertificateFile /path/to/fullchain.pem
    # SSLCertificateKeyFile /path/to/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
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
