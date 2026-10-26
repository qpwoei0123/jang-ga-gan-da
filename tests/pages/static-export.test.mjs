import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { publicAsset } from "../../app/public-asset.ts";

const root = path.resolve("dist/client");
const prefix = "/jang-ga-gan-da/";
function checkAsset(url) {
  if (!url.startsWith("/")) return;
  assert.ok(url.startsWith(prefix), `Asset escapes the Pages subdirectory: ${url}`);
  const file = decodeURIComponent(url.slice(prefix.length).split(/[?#]/)[0]);
  assert.ok(existsSync(path.join(root, file)), `Missing published asset: ${url}`);
}

test("asset paths support both Sites and GitHub Pages, including cache queries", () => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    assert.equal(publicAsset("/sounds/animalese.wav"), "/sounds/animalese.wav");
    process.env.NEXT_PUBLIC_BASE_PATH = "/jang-ga-gan-da";
    assert.equal(publicAsset("/sounds/animalese.wav"), "/jang-ga-gan-da/sounds/animalese.wav");
    assert.equal(publicAsset("/favicon.svg?v=2"), "/jang-ga-gan-da/favicon.svg?v=2");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = previous;
  }
});

test("static invitation includes the closing message and Pages sharing metadata", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /2026년 11월 1일 결혼합니다/);
  assert.match(html, /보내주신 마음 소중히 간직하며 잘 살겠습니다/);
  assert.match(html, /https:\/\/qpwoei0123.github.io\/jang-ga-gan-da\/og.png/);
  assert.doesNotMatch(html, /wedding-edition-newspaper.han-10.chatgpt.site/);
  for (const match of html.matchAll(/(?:src|href)="([^"<>]+)"/g)) checkAsset(match[1]);
});

test("exported styles and media resolve inside the Pages artifact", () => {
  assert.ok(existsSync(path.join(root, ".nojekyll")));
  for (const file of readdirSync(root, { recursive: true })) {
    if (!file.endsWith(".css")) continue;
    const css = readFileSync(path.join(root, file), "utf8");
    for (const match of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) checkAsset(match[1]);
  }
  for (const file of ["couple-main.webp", "opening-dog.webp", "opening-dog-high-five.webp", "gallery/thumbs/stair-wave.webp", "gallery/mobile/stair-wave.webp", "sounds/animalese.wav", "sounds/aurectheme-jazz-584847.mp3"]) checkAsset(prefix + file);
});
