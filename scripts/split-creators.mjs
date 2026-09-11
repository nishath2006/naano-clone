/**
 * Splits data/creators.json (output of extract-creators.mjs) into one JSON
 * file per creator under public/data/creators/<slug>.json, plus an index of
 * slugs, so profile pages fetch only the creator they need.
 */
import fs from 'node:fs'
import path from 'node:path'

const src = path.resolve('data/creators.json')
const outDir = path.resolve('public/data/creators')
const all = JSON.parse(fs.readFileSync(src, 'utf8'))
fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })
for (const c of all) fs.writeFileSync(path.join(outDir, `${c.slug}.json`), JSON.stringify(c))
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(all.map((c) => c.slug)))
console.log(`wrote ${all.length} creator files to public/data/creators`)
