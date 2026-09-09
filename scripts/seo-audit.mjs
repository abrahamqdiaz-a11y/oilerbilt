import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const site = "https://oilerbilt.netlify.app";
const failures = [];
const titles = new Map();
const descriptions = new Map();

const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
const valueOf = (html, pattern) => decode(html.match(pattern)?.[1] ?? "");

async function findHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? findHtml(path)
        : entry.name === "index.html"
          ? [path]
          : [];
    }),
  );
  return nested.flat();
}

for (const file of await findHtml(dist)) {
  const html = await readFile(file, "utf8");
  const parts = relative(dist, file).split(sep).slice(0, -1);
  const route = parts.length ? `/${parts.join("/")}/` : "/";
  const url = `${site}${route}`;
  const title = valueOf(html, /<title>(.*?)<\/title>/s);
  const description = valueOf(
    html,
    /<meta name="description" content="(.*?)"\s*\/?>/s,
  );
  const robots = valueOf(
    html,
    /<meta name="robots" content="(.*?)"\s*\/?>/s,
  );
  const canonical = valueOf(
    html,
    /<link rel="canonical" href="(.*?)"\s*\/?>/s,
  );
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  const headingLevels = [...html.matchAll(/<h([1-6])(?:\s|>)/g)].map((entry) => Number(entry[1]));
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);

  if (title.length < 50 || title.length > 60)
    failures.push(`${url}: title length ${title.length}`);
  if (description.length < 140 || description.length > 155)
    failures.push(`${url}: description length ${description.length}`);
  if (titles.has(title))
    failures.push(`${url}: duplicate title with ${titles.get(title)}`);
  if (descriptions.has(description))
    failures.push(`${url}: duplicate description with ${descriptions.get(description)}`);
  titles.set(title, url);
  descriptions.set(description, url);
  if (canonical !== url)
    failures.push(`${url}: canonical is ${canonical || "missing"}`);
  if (h1Count !== 1) failures.push(`${url}: found ${h1Count} H1 elements`);
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1)
      failures.push(`${url}: heading level jumps from H${headingLevels[index - 1]} to H${headingLevels[index]}`);
  }
  if (!html.includes('<html lang="en">')) failures.push(`${url}: missing lang=en`);
  if (!html.includes('content="width=device-width, initial-scale=1.0"'))
    failures.push(`${url}: incorrect viewport`);
  if (!robots) failures.push(`${url}: missing robots meta`);
  for (const name of [
    "og:title",
    "og:description",
    "og:image",
    "og:url",
    "og:type",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ]) {
    if (
      !html.includes(`property="${name}"`) &&
      !html.includes(`name="${name}"`)
    )
      failures.push(`${url}: missing ${name}`);
  }
  for (const tag of images) {
    if (!/\balt="[^"]+"/.test(tag))
      failures.push(`${url}: image missing meaningful alt text`);
  }
  const schemaTypes = [];
  for (const schema of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  )) {
    try {
      const parsed = JSON.parse(schema[1]);
      for (const item of parsed["@graph"] ?? [parsed]) {
        schemaTypes.push(...(Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]]));
      }
    } catch {
      failures.push(`${url}: invalid JSON-LD`);
    }
  }
  for (const type of ["WebSite", "WebPage", "Organization"]) {
    if (!schemaTypes.includes(type)) failures.push(`${url}: missing ${type} schema`);
  }
  if (route !== "/" && !schemaTypes.includes("BreadcrumbList"))
    failures.push(`${url}: missing BreadcrumbList schema`);
}

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (entry) => entry[1],
);
for (const url of titles.values()) {
  const isNoindex = url.endsWith("/thank-you/");
  if (!isNoindex && !sitemapUrls.includes(url))
    failures.push(`${url}: missing from sitemap`);
  if (isNoindex && sitemapUrls.includes(url))
    failures.push(`${url}: noindex URL is in sitemap`);
}
for (const field of ["lastmod", "changefreq", "priority"]) {
  if ((sitemap.match(new RegExp(`<${field}>`, "g")) ?? []).length !== sitemapUrls.length)
    failures.push(`sitemap.xml: ${field} count does not match URL count`);
}

if (failures.length) {
  console.error(`SEO audit failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `SEO audit passed: ${titles.size} pages checked, ${sitemapUrls.length} indexable URLs.`,
);
