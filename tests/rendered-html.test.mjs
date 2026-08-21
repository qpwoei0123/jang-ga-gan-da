import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the CSR asset gate before the invitation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>결혼일보 \| 한원영·이나경 특집호<\/title>/);
  assert.match(html, /신문 인쇄 준비 중/);
  assert.match(html, /사진과 종이 질감을 먼저 확인하고 있습니다/);
  assert.doesNotMatch(html, /class="delivery-intro/);
});

test("renders the four-level guide behind its own asset gate", async () => {
  const response = await render("/asset-quality");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>에셋 적용 4단계 \| 결혼일보 편집 기준<\/title>/);
  assert.match(html, /에셋 적용 기준표 준비 중/);
  assert.doesNotMatch(html, /class="[^\"]*scene/);
});

test("keeps every visible invitation image local and preloaded", async () => {
  const [page, delivery] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/newspaper-delivery.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /^"use client";/);
  assert.match(page, /<AssetGate assets=\{INVITATION_ASSETS\}>/);
  assert.doesNotMatch(page, /<img[^>]+src=["'{`]https?:\/\//i);
  assert.doesNotMatch(delivery, /<img[^>]+src=["'{`]https?:\/\//i);

  const assets = [
    "paper-crumple.png",
    "dog-run-sprite-ddui-timid.webp",
    "will-smith-cutout.webp",
    "couple-sample.webp",
    "venue-sample.webp",
    "celebs/trump.jpg",
    "celebs/taylor-swift.jpg",
    "celebs/son.jpg",
  ];

  await Promise.all(assets.map((asset) => access(new URL(`../public/${asset}`, import.meta.url))));
});
