// Rasterizes assets/og-image.svg into public/og-image.png.
//
// Social crawlers (Twitter, Slack, LinkedIn, Discord) do not render SVG, so the
// shareable card has to ship as a PNG. The SVG stays in the repo as the source
// of truth; run `npm run og` after editing it.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = new URL('../', import.meta.url)
const source = new URL('assets/og-image.svg', root)
const output = new URL('public/og-image.png', root)

const svg = await readFile(source)
const png = await sharp(svg, { density: 144 }).resize(1200, 630).png({ quality: 90 }).toBuffer()

await writeFile(output, png)

console.log(`Wrote ${fileURLToPath(output)} (${(png.length / 1024).toFixed(1)} kB)`)
