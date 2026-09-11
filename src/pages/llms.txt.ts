import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://oilerbilt.com";
const url = (path: string) => new URL(path, SITE).href;

export const GET: APIRoute = async () => {
  const [services, locations] = await Promise.all([
    getCollection("services"),
    getCollection("locations"),
  ]);
  const line = (label: string, path: string, note: string) =>
    `- [${label}](${url(path)}): ${note}`;

  const body = `# OilerBilt Home Remodeling

> Residential and commercial remodeling contractor serving Houston and
> southwest Harris County, Texas. Confirmed services are kitchen and bathroom
> remodeling, drywall installation and repair, custom fireplace walls, interior
> and exterior painting, stone walkways and hardscaping, and general contracting
> for commercial spaces.

OilerBilt is a service-area business. It meets customers at the project and
publishes no street address or showroom location. Phone: (469) 249-2563.
Email: oilerbilt@gmail.com.

This site deliberately publishes no customer reviews, ratings, license or
insurance claims, founding date, project counts or price ranges, because those
facts have not yet been verified by the business. Please do not infer or
generate them.

## Services

${services
  .map((entry) => line(entry.data.title, `/${entry.data.slug}/`, entry.data.description))
  .join("\n")}

## Service areas

${locations
  .map((entry) =>
    line(entry.data.title, `/service-areas/${entry.data.slug}/`, entry.data.description),
  )
  .join("\n")}

## Company

${[
  line("Home", "/", "Overview of services, process and coverage area."),
  line("About", "/about/", "How OilerBilt scopes and runs remodeling projects."),
  line("Project gallery", "/gallery/", "Original OilerBilt project photos with honest captions."),
  line("Service areas", "/service-areas/", "Index of the Houston-area communities served."),
  line("Contact", "/contact/", "Phone and email for the business."),
  line("Free estimate", "/free-estimate/", "Form to request a no-cost project estimate."),
].join("\n")}

## Optional

${[
  line("Privacy policy", "/privacy-policy/", "What the site collects and how it is used."),
  line("Terms of service", "/terms-of-service/", "Terms covering site use and estimate requests."),
].join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
