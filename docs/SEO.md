# SEO и Google Search Console

## Что настроено в проекте

| URL | Назначение |
|-----|------------|
| `/robots.txt` | Статический файл в `public/` (генерируется при `npm run build`) |
| `/sitemap.xml` | Статический XML — то же |
| `/manifest.webmanifest` | PWA-метаданные |
| `/opengraph-image` | OG-картинка 1200×630 |
| JSON-LD | Organization, WebSite, SoftwareApplication, FAQPage (главная) |

**Не индексируются:** `/admin`, `/dashboard`, `/api`, `/login`, `/register`, `/checkout`, `/forgot-password`.

## Переменные `.env`

```env
NEXT_PUBLIC_APP_URL=https://teleworker.fun
GOOGLE_SITE_VERIFICATION=код_из_search_console
YANDEX_VERIFICATION=код_опционально
```

После добавления: `npm run build && pm2 restart teleagent`.

## Google Search Console

1. https://search.google.com/search-console  
2. Добавить ресурс → **URL prefix** → `https://teleworker.fun`  
3. Подтверждение: **HTML tag** → скопировать `content="..."` в `GOOGLE_SITE_VERIFICATION` (только значение content)  
4. **Sitemaps** → отправить: `https://teleworker.fun/sitemap.xml`  
5. Если статус **«Не получено»**, а в браузере sitemap открывается:
   - Удалите старую запись sitemap в GSC → добавьте URL снова
   - На сервере: `git pull && npm run build && pm2 restart teleagent`
   - Проверка от имени Googlebot: `bash scripts/verify-seo-crawl.sh`
6. **URL inspection** → `https://teleworker.fun/sitemap.xml` → **Проверить опубликованную страницу**
7. **URL inspection** → главная → **Запросить индексирование**

## Проверка

```bash
# Сначала backend, потом домен
bash scripts/diagnose-vps.sh
bash scripts/verify-seo-crawl.sh
```

Если **503 Service Unavailable** от Apache:

1. `curl -I http://127.0.0.1:3005` — должен быть **200**
2. Если нет: `npm run build && pm2 restart teleagent`
3. Apache должен проксировать на **3005** (не 3000): `sudo bash scripts/fix-apache-proxy.sh`
4. Лог: `tail -20 /var/log/apache2/teleworker.fun-error.log`

[Rich Results Test](https://search.google.com/test/rich-results?url=https://teleworker.fun)  
[PageSpeed Insights](https://pagespeed.web.dev/?url=https://teleworker.fun)

## Семантика на главной

- Один `<main id="main-content">`
- Секции с `id`: `#features`, `#pricing`, `#cases`, `#faq` (якоря в меню)
- FAQ синхронизирован с Schema.org FAQPage

## Рекомендации

- Добавьте сайт в [Яндекс.Вебмастер](https://webmaster.yandex.ru/) с тем же sitemap  
- Обновляйте `lastModified` в sitemap при крупных релизах (автоматически при билде)  
- Для блога/статей — расширьте `SITEMAP_ROUTES` в `src/lib/seo.ts`
