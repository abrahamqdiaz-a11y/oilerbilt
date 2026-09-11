import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://oilerbilt.com";
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * Last-modified date of a source file, taken from its last commit so the
 * sitemap reports when a page actually changed rather than when it was built.
 * Falls back to the file mtime, then the build date, when git is unavailable
 * (for example a build from a tarball rather than a clone).
 */
function lastModified(sourcePath: string): string {
  try {
    const stamp = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", sourcePath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    if (stamp) return stamp;
  } catch {
    // git not available; fall through to the mtime.
  }
  try {
    return statSync(sourcePath).mtime.toISOString().slice(0, 10);
  } catch {
    return BUILD_DATE;
  }
}

// Resolved against the project root: import.meta.url points into the build
// output once this route is bundled.
const pageSource = (name: string) => join(process.cwd(), "src", "pages", name);

type SitemapEntry = {
  path: string;
  source: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const GET: APIRoute = async () => {
  const [services, locations] = await Promise.all([
    getCollection("services"),
    getCollection("locations"),
  ]);
  const pages: SitemapEntry[] = [
    { path: "/", source: pageSource("index.astro"), changefreq: "weekly", priority: 1.0 },
    { path: "/gallery/", source: pageSource("gallery.astro"), changefreq: "monthly", priority: 0.8 },
    { path: "/privacy-policy/", source: pageSource("privacy-policy.astro"), changefreq: "yearly", priority: 0.3 },
    { path: "/service-areas/", source: pageSource("service-areas.astro"), changefreq: "monthly", priority: 0.8 },
    { path: "/terms-of-service/", source: pageSource("terms-of-service.astro"), changefreq: "yearly", priority: 0.3 },
    { path: "/about/", source: pageSource("about.astro"), changefreq: "yearly", priority: 0.6 },
    { path: "/contact/", source: pageSource("contact.astro"), changefreq: "yearly", priority: 0.7 },
    { path: "/free-estimate/", source: pageSource("free-estimate.astro"), changefreq: "yearly", priority: 0.8 },
    ...services.map((entry) => ({
      path: `/${entry.data.slug}/`,
      source: entry.filePath ?? "",
      changefreq: "monthly" as const,
      priority: 0.9,
    })),
    ...locations.map((entry) => ({
      path: `/service-areas/${entry.data.slug}/`,
      source: entry.filePath ?? "",
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
  ].sort((a, b) => a.path.localeCompare(b.path));

  const urls = pages.map(({ path, source, changefreq, priority }) => `  <url>
    <loc>${new URL(path, SITE).href}</loc>
    <lastmod>${lastModified(source)}</lastmod>
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
