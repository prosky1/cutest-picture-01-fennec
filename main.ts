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

// Read pixel dimensions from the image's own header. PNG stores them at
// fixed offsets (bytes 16-23, big-endian width then height). Anything that
// is not a whole PNG is refused here.
function pngDimensions(buf: Buffer): { width: number; height: number } {
  const magic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (buf.length < 24 || !magic.every((b, i) => buf[i] === b)) {
    throw new Error('entry.png is not a whole PNG');
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const bundled = readFileSync(source);
if (bundled.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bundled.length} bytes, over the ${MAX_BYTES} cap`);
}
const { width, height } = pngDimensions(bundled);
if (width > MAX_SIDE || height > MAX_SIDE) {
  throw new Error(`entry.png is ${width}x${height}, over the ${MAX_SIDE}x${MAX_SIDE} cap`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`wrote ${target} (${bundled.length} bytes, ${width}x${height})`);
