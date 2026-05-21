/**
 * Генерирует public/robots.txt и public/sitemap.xml при сборке.
 * Статические файлы надёжнее для Googlebot, чем только динамические routes.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const root = process.cwd();
const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://teleworker.fun").replace(
  /\/$/,
  ""
);

const lastmod = new Date().toISOString();

const routes: { path: string; changefreq: string; priority: string }[] = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  { path: "/shop", changefreq: "weekly", priority: "0.9" },
  { path: "/demo", changefreq: "monthly", priority: "0.8" },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /checkout
Disallow: /login
Disallow: /register
Disallow: /forgot-password

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /checkout
Disallow: /login
Disallow: /register
Disallow: /forgot-password

Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
`;

const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robotsTxt, "utf8");

console.log(`SEO static: ${siteUrl}/sitemap.xml, ${siteUrl}/robots.txt`);
