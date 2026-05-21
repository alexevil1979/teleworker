# SEO и Google Search Console

## Что настроено в проекте

| URL | Назначение |
|-----|------------|
| `/robots.txt` | Индексация только публичных страниц |
| `/sitemap.xml` | `/`, `/shop`, `/demo` |
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
5. **URL inspection** → проверить главную → **Request indexing**

## Проверка

```bash
curl -s https://teleworker.fun/robots.txt
curl -s https://teleworker.fun/sitemap.xml
curl -sI https://teleworker.fun | grep -i cache
```

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
