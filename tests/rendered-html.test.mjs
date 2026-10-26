import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const { default: worker } = await import("../dist/server/index.js");
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

// Ignore the serialized React payload: these assertions concern actual HTML
// elements, not text that happens to occur again inside a hydration script.
function documentMarkup(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

function elementWithClass(html, tag, className) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))]
    .map(([element]) => element)
    .find(element => (element.match(/\bclass="([^"]*)"/)?.[1] ?? "").split(/\s+/).includes(className));
}

test("renders the current invitation once behind the unready high-five gate", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = documentMarkup(await response.text());

  // Copy approved for the shared invitation, rather than the original template.
  assert.match(html, /<title>두 사람의 특별호<\/title>/);
  assert.match(html, /<meta name="description" content="좋은 소식이라 한 장 가득 담았습니다\."/);
  assert.match(html, /저희 두 사람은 2026년 11월 1일 결혼합니다\./);
  assert.match(html, /미리 초대드린 분들과 작은 예식을 올립니다\./);
  assert.match(html, /보내주신 마음 소중히 간직하며 잘 살겠습니다\./);
  assert.match(html, /한동현 · 김현정의 아들 한원영/);
  assert.match(html, /이광범 · 성호숙의 딸 이나경/);
  assert.equal((html.match(/id="top"/g) ?? []).length, 1);

  const scene = elementWithClass(html, "div", "asset-scene");
  assert.ok(scene, "The newspaper must be present before assets finish loading");
  assert.match(scene, /\binert(?:="")?(?=[\s>])/);
  assert.match(scene, /aria-hidden="true"/);
  assert.match(html, /role="status" aria-label="열심히 만드는중\.\.\."/);
  const paw = elementWithClass(html, "button", "arrival-paw-touch");
  assert.ok(paw, "The high-five control must be available in the opening scene");
  assert.match(paw, /\bdisabled(?:="")?(?=[\s>])/);
  assert.match(paw, /aria-label="뚜이의 점선으로 표시된 앞발에 하이파이브하고 결혼 신문 펼치기"/);

  // Removed content must not return to this publicly shared version.
  assert.doesNotMatch(html, /PRICE: ONE BLESSING|The Grand Hall|축하의 마음 전하기|양가 부모님 계좌 안내/);
  assert.equal(elementWithClass(html, "section", "delivery-intro"), undefined);
  assert.equal(elementWithClass(html, "div", "page-print"), undefined);
});

test("renders the four-level guide behind its own asset gate", async () => {
  const response = await render("/asset-quality");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>에셋 적용 4단계 \| 결혼일보 편집 기준<\/title>/);
  assert.match(html, /에셋 적용 기준표 준비 중/);
  assert.doesNotMatch(html, /class="[^\"]*scene/);
});

test("serves the eleven-photo gallery and current opening media from local files", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = documentMarkup(await response.text());
  const photoNames = [
    "stair-wave", "stair-kiss", "hallway-embrace", "floor-wink", "stair-peek",
    "stair-laugh", "cafe-together", "2018", "peek-wall", "mirror-smile", "street-mirror",
  ];
  assert.equal((html.match(/aria-label="\d+번째 사진 크게 보기:/g) ?? []).length, 11);
  assert.match(html, /aria-label="뚜이 꾹 누르기"/);
  const sources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
  for (const name of photoNames) {
    assert.ok(sources.includes(`/gallery/thumbs/${name}.webp`), `Missing gallery thumbnail: ${name}`);
  }
  for (const source of sources) {
    if (source.startsWith("data:image/")) continue; // Small, self-contained loading previews.
    assert.match(source, /^\/(?!\/)/, `Invitation image must be hosted locally: ${source}`);
    const pathname = decodeURIComponent(new URL(source, "https://invitation.test").pathname);
    await access(new URL(`../public${pathname}`, import.meta.url));
  }

  // These load after hydration or on interaction and are absent from initial HTML.
  const assets = [
    "favicon.svg", "og.png", "paper-crumple.webp", "couple-main.webp",
    "opening-dog.webp", "opening-dog-high-five.webp", "dog-family/thanks.webp",
    "sounds/animalese.wav", "sounds/aurectheme-jazz-584847.mp3",
    "sounds/high-five-smack.wav", "sounds/paper-unfold.wav", "sounds/gallery-shutter.wav",
    ...photoNames.map(name => `gallery/mobile/${name}.webp`),
    ...photoNames.map(name => name === "2018" ? "history/2018.webp" : `gallery/${name}.webp`),
  ];
  await Promise.all(assets.map(asset => access(new URL(`../public/${asset}`, import.meta.url))));
});
