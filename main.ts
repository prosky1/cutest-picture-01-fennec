// Cutest Picture entry (cutest-picture-01), round 2 — Node 22, stdlib only.
//
// The picture is entry.png beside this file: a baby fennec fox hugging a
// tiny white bunny cheek to cheek. The program copies it, byte for byte,
// to /output/entry.png. The grader runs it twice and both runs must write
// identical bytes, so the copy is fully deterministic: no timestamps, no
// randomness, no network, no input besides the bundled image.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576; // 1 MiB, the competition's file cap
const MAX_SIDE = 1024; // 1024 px per side, the competition's dimension cap

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// Read pixel dimensions from the image's own header. The gate tells PNG
// from JPEG by magic bytes, so both are handled: PNG stores width/height at
// fixed offsets (bytes 16-23, big-endian); JPEG hides them in the first
// SOF marker (0xC0-0xCF except 0xC4/0xC8/0xCC). Anything else is refused.
function dimensions(buf: Buffer): { width: number; height: number } {
  const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (buf.length >= 24 && pngMagic.every((b, i) => buf[i] === b)) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      if (marker === 0xda || marker === 0xd9) break;
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  throw new Error('entry.png is not a whole PNG or JPEG');
}

const bundled = readFileSync(source);
if (bundled.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bundled.length} bytes, over the ${MAX_BYTES} cap`);
}
const { width, height } = dimensions(bundled);
if (width > MAX_SIDE || height > MAX_SIDE) {
  throw new Error(`entry.png is ${width}x${height}, over the ${MAX_SIDE}x${MAX_SIDE} cap`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Self-check: the written file must be byte-identical to the bundled image.
const written = readFileSync(target);
if (written.length !== bundled.length || !written.equals(bundled)) {
  throw new Error('entry.png mismatch: output differs from the bundled image');
}
console.log(`wrote ${target} (${written.length} bytes, ${width}x${height})`);
