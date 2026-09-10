import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const failures = [];
const forms = [];

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(path);
      continue;
    }
    if (entry.name !== "index.html") continue;
    const html = await readFile(path, "utf8");
    for (const match of html.matchAll(/<form\b[\s\S]*?<\/form>/g)) {
      forms.push({ path, html: match[0] });
    }
  }
}

await inspect(dist);
if (!forms.length) failures.push("No static forms found in the built HTML.");

const expectedFields = [
  "form-name",
  "bot-field",
  "name",
  "phone",
  "email",
  "service",
  "description",
  "photo",
];
const signatures = new Map();

for (const form of forms) {
  const openingTag = form.html.match(/^<form\b[^>]*>/)?.[0] ?? "";
  const name = openingTag.match(/\bname="([^"]+)"/)?.[1];
  const fields = [...form.html.matchAll(/<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g)].map(
    (match) => match[1],
  );
  if (!name) failures.push(`${form.path}: form has no name.`);
  if (!/\bmethod="POST"/i.test(openingTag)) failures.push(`${form.path}: method is not POST.`);
  if (!/\baction="\/thank-you\/"/.test(openingTag)) failures.push(`${form.path}: success action is incorrect.`);
  if (!/\bdata-netlify="true"/.test(openingTag)) failures.push(`${form.path}: data-netlify is missing.`);
  if (!/\bnetlify-honeypot="bot-field"/.test(openingTag)) failures.push(`${form.path}: honeypot declaration is missing.`);
  if (!/\benctype="multipart\/form-data"/.test(openingTag)) failures.push(`${form.path}: multipart encoding is missing.`);
  if (!form.html.includes('name="form-name" value="estimate"')) failures.push(`${form.path}: hidden form-name is missing or mismatched.`);
  if (expectedFields.some((field) => !fields.includes(field))) failures.push(`${form.path}: expected field set is incomplete.`);
  const signature = [...new Set(fields)].sort().join(",");
  if (signatures.has(name) && signatures.get(name) !== signature) failures.push(`${form.path}: field set differs for form ${name}.`);
  signatures.set(name, signature);
}

try {
  await access(join(dist, "thank-you", "index.html"));
} catch {
  failures.push("The /thank-you/ success page was not built.");
}

if (failures.length) {
  console.error(`Netlify Forms audit failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Netlify Forms audit passed: ${forms.length} static form instances share one valid \"estimate\" definition.`);
