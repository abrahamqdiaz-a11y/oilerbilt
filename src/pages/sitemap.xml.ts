import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://oilerbilt.com";
const LAST_MODIFIED = "2026-09-09";

type SitemapEntry = {
  path: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const GET: APIRoute = async () => {
  const [services, locations] = await Promise.all([
    getCollection("services"),
    getCollection("locations"),
  ]);
  const pages: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: 1.0 },
    { path: "/gallery/", changefreq: "monthly", priority: 0.8 },
    { path: "/service-areas/", changefreq: "monthly", priority: 0.8 },
    { path: "/about/", changefreq: "yearly", priority: 0.6 },
    { path: "/contact/", changefreq: "yearly", priority: 0.7 },
    { path: "/free-estimate/", changefreq: "yearly", priority: 0.8 },
    ...services.map((entry) => ({
      path: `/${entry.data.slug}/`,
      changefreq: "monthly" as const,
      priority: 0.9,
    })),
    ...locations.map((entry) => ({
      path: `/service-areas/${entry.data.slug}/`,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
  ].sort((a, b) => a.path.localeCompare(b.path));

  const urls = pages.map(({ path, changefreq, priority }) => `  <url>
    <loc>${new URL(path, SITE).href}</loc>
    <lastmod>${LAST_MODIFIED}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
