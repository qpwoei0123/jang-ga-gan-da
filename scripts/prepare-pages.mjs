import { existsSync, readFileSync, readdirSync, renameSync, rmdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Pages mounts the artifact at /jang-ga-gan-da/. Vinext emits the assetPrefix
// as a directory, so remove that one extra nesting level from generated assets.
const root = "dist/client";
if (!existsSync(`${root}/index.html`)) throw new Error("Static export did not produce index.html");
if (existsSync(`${root}/jang-ga-gan-da/_next`)) {
  renameSync(`${root}/jang-ga-gan-da/_next`, `${root}/_next`);
  rmdirSync(`${root}/jang-ga-gan-da`);
}
// Vinext also prefixes public CSS URLs with its internal static directory.
// Public files live at the artifact root; generated chunks keep their own URLs.
const staticPrefix = "/jang-ga-gan-da/_next/static/";
for (const file of readdirSync(root, { recursive: true })) {
  if (!file.endsWith(".css")) continue;
  const target = path.join(root, file);
  const css = readFileSync(target, "utf8").replace(/url\((["']?)(\/jang-ga-gan-da\/_next\/static\/[^)"']+)\1\)/g, (match, quote, url) => {
    const relative = url.slice(staticPrefix.length);
    if (!existsSync(path.join("public", relative))) return match;
    return `url(${quote}/jang-ga-gan-da/${relative}${quote})`;
  });
  writeFileSync(target, css);
}
writeFileSync(`${root}/.nojekyll`, "");
