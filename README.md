# TeleAgent

SaaS-платформа продажи готовых AI Telegram-аккаунтов (Gigachat / Grok / Claude).

**Домен:** [teleworker.fun](https://teleworker.fun)  
**Репозиторий:** [github.com/alexevil1979/teleworker](https://github.com/alexevil1979/teleworker)

## Стек

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- PostgreSQL + Prisma ORM
- NextAuth.js v5 (email + Telegram Login)
- ЮKassa + Stripe
- shadcn/ui (Radix), Framer Motion, Zod, React Hook Form

## Быстрый старт

```bash
cp .env.example .env
# Заполните DATABASE_URL, AUTH_SECRET

npm install
# на VPS не используйте npm ci, если lockfile ругается на @emnapi — только npm install
npm run db:push
npm run db:seed
npm run dev
```

Откройте http://localhost:3000

**Админ после seed:** `admin@teleworker.fun` / пароль из `ADMIN_PASSWORD` в `.env`

## Docker

```bash
docker compose up -d postgres
# DATABASE_URL=postgresql://teleagent:teleagent@localhost:5432/teleagent
npm run db:push && npm run db:seed
docker compose up app
```

## Деплой Vercel + Neon

1. Создайте проект на [Neon](https://neon.tech), скопируйте `DATABASE_URL`
2. Импортируйте репозиторий в Vercel
3. Переменные из `.env.example`
4. Build: `npm run build`
5. Webhooks: `https://teleworker.fun/api/payments/yookassa/webhook`, `.../stripe/webhook`

## VPS (Apache, /ssd/www/teleworker)

См. [DEPLOY.md](./DEPLOY.md)

## Структура

| Путь | Описание |
|------|----------|
| `/` | Лендинг |
| `/shop`, `/checkout` | Магазин и оплата |
| `/dashboard` | Личный кабинет |
| `/admin` | Админ-панель |
| `/api/payments/*` | Webhooks ЮKassa / Stripe |

## Лицензия

Proprietary © TeleAgent
