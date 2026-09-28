/** Whole minutes to read a Markdown body at roughly 225 words per minute. */
export function readingMinutes(markdown = ""): number {
  const words = markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .split(/\s+/)
    .filter((word) => /\w/.test(word)).length;
  return Math.max(1, Math.round(words / 225));
}
