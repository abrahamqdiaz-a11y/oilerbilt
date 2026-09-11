import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ImageSize = { width: number; height: number };

const cache = new Map<string, ImageSize>();

/**
 * Reads the intrinsic size of a baseline/progressive JPEG in `public/` at build
 * time, so `<img>` always carries the real aspect ratio instead of a hardcoded
 * guess that shifts layout while the photo loads.
 */
export function jpegSize(publicPath: string): ImageSize {
  const cached = cache.get(publicPath);
  if (cached) return cached;

  // Resolved against the project root rather than import.meta.url, which
  // points into the build output once this module is bundled.
  const file = join(process.cwd(), "public", publicPath);
  const bytes = readFileSync(file);
  if (bytes.readUInt16BE(0) !== 0xffd8)
    throw new Error(`${publicPath} is not a JPEG`);

  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff)
      throw new Error(`${publicPath}: malformed JPEG segment`);
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    // SOF0-SOF15, excluding the DHT/JPG/DAC markers that share the range.
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isStartOfFrame) {
      const size = {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
      cache.set(publicPath, size);
      return size;
    }
    offset += 2 + length;
  }
  throw new Error(`${publicPath}: no JPEG frame header found`);
}
