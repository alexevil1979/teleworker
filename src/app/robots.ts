import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    "/admin/",
    "/dashboard/",
    "/api/",
    "/checkout",
    "/checkout/",
    "/login",
    "/register",
    "/forgot-password",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/og", "/icon", "/apple-icon"],
        disallow: privatePaths,
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
