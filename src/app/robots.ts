import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://teleworker.fun";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/dashboard/", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
