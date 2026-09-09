# OilerBilt Home Remodeling

Astro + Tailwind static website for OilerBilt Home Remodeling, configured for Netlify Forms and Netlify deployment.

## Local development

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. Netlify uses the same command and publishes `dist/`.

## Editing content

Service pages live in `src/content/services/`. Each Markdown file contains editable page copy plus frontmatter for the page title, summary, included work, estimate variables, internal links and FAQs. The shared layout in `src/pages/[...slug].astro` renders those fields and creates Service, FAQ and breadcrumb schema.

Location pages live in `src/content/locations/`. Keep every area page genuinely local. Add named neighborhoods, housing details and jurisdiction-specific context; do not duplicate a page and only swap the city name.

Supporting pages such as About, Contact, Gallery and Free Estimate live in `src/pages/`. Shared header, footer, metadata and mobile call controls live in `src/layouts/BaseLayout.astro`.

## Adding gallery images

1. Obtain the original, approved OilerBilt image. Do not hotlink Instagram.
2. Remove EXIF metadata, especially GPS coordinates.
3. Export responsive WebP files and a JPEG fallback into `public/images/`.
4. Use descriptive names such as `bathroom-remodel-mission-bend-houston-01.webp`.
5. Replace the matching placeholder in `src/pages/gallery.astro` and relevant service Markdown content.
6. Write literal alt text and only include a location when it is confirmed.

Never present stock or generated remodeling photography as OilerBilt project work. `public/og.png` is a generated brand-only social card, not a portfolio image.

## Forms

The shared estimate form is `src/components/EstimateForm.astro`. Netlify detects it during the static build. Submissions redirect to `/thank-you/`; verify file-upload limits and notification recipients in the Netlify project before launch.

## Before launch

Complete every item in `CONTENT-TODO.md`. The phone, email, listing URLs, hours, domain and project photography intentionally remain marked `[TK]`. Never add the owner’s home address to markup, schema, images, forms or maps.
