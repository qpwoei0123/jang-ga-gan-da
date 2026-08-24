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
  assert.match(html, /로딩중\.\.\./);
  assert.doesNotMatch(html, /사진, 종이 질감, 효과음을 먼저 준비하고 있습니다/);
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

test("keeps every runtime asset local and predecoded", async () => {
  const [page, delivery, audioBank, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/newspaper-delivery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/audio-bank.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /^"use client";/);
  assert.match(page, /<AssetGate assets=\{INVITATION_ASSETS\}>/);
  assert.match(page, /\.\.\.INTERACTION_SOUNDS/);
  assert.match(page, /이나경, ‘GD와 결혼’ 목표 무산… 아쉬움 감추지 못해/);
  assert.match(page, /결혼일보 연예부 확인 \/ 실제 보도 아님/);
  assert.match(page, /사랑은 완결이 아니라,/);
  assert.match(page, /이동진 평론가의 실제 원고 및 발언과 무관/);
  assert.doesNotMatch(page, /celebrityDesk|celebrityPhotos|유명인들의|celebs\//);
  assert.doesNotMatch(page, /<img[^>]+src=["'{`]https?:\/\//i);
  assert.doesNotMatch(delivery, /<img[^>]+src=["'{`]https?:\/\//i);
  assert.match(delivery, /playDecodedSound\(NO_DAMAGE_SOUND, \.72\)/);
  assert.match(delivery, /playDecodedSound\(YES_TADA_SOUND, \.82\)/);
  assert.match(delivery, /playDecodedLoop\(INTRO_BATTLE_SOUND, INTRO_MUSIC_VOLUME, INTRO_MUSIC_LOOP\)/);
  assert.match(delivery, /INTRO_MUSIC_LOOP = \{ start: 4\.185, end: 14\.631 \}/);
  assert.match(delivery, /introMusicRef\.current\?\.stop\(\)/);
  assert.match(delivery, /NO_ATTEMPT_LIMIT - visibleNoAttempts/);
  assert.match(delivery, /<NoLives count=\{noLives\} breaking=\{noHit\} \/>/);
  assert.match(delivery, /from "canvas-confetti"/);
  assert.match(delivery, /confetti\.create\(confettiCanvasRef\.current/);
  assert.match(delivery, /disableForReducedMotion: true/);
  assert.match(delivery, /className="delivery-confetti"/);
  assert.match(delivery, /NO_ATTEMPT_EXTRA_SOUNDS\[nextAttempt - 1\]\.forEach/);
  assert.match(delivery, /DAMAGE_FEEDBACK_MS = 200/);
  assert.match(delivery, /NO_HAPTIC_MS = 35/);
  assert.match(delivery, /navigator\.vibrate\(NO_HAPTIC_MS\)/);
  assert.match(delivery, /TYPE_INTERVAL_MS = 55/);
  assert.match(delivery, /useLayoutEffect/);
  assert.match(delivery, /dataset\.delivery = "opening"/);
  assert.match(delivery, /playDecodedSound\(SANS_VOICE_SOUND, \.22\)/);
  assert.match(delivery, /어디선가 강아지가 수상할정도로 수상한 물건을 물고 나에게 왔다, 받아볼까\?/);
  assert.match(delivery, /is-hit/);
  assert.match(delivery, /playDecodedSound\(WILL_EXIT_SOUND/);
  assert.match(delivery, /playDecodedSound\(YOSHI_TONGUE_SOUND, \.84\)/);
  assert.match(delivery, /WILL_REVEAL_PAUSE_MS = 150/);
  assert.match(delivery, /introMusicRef\.current\?\.duck/);
  assert.match(delivery, /className="is-breaking"/);
  assert.doesNotMatch(delivery, /onPointerEnter/);
  assert.doesNotMatch(delivery, /THE COUPLE TIMES|오늘의 특종|나레이션|누군가 거절을 회수|선택지는 하나뿐/);
  assert.match(audioBank, /decodeAudioData/);
  assert.match(styles, /--paper: #e9e5e6;/);
  assert.match(styles, /html, body \{ background: var\(--canvas\)/);
  assert.match(styles, /\.delivery-intro \{[^}]*background-color: var\(--paper\)/s);
  assert.match(audioBank, /\[\],\s*\[\[CLASSIC_HURT_SOUND, \.9\]\],\s*\[\[GUNSHOT_SOUND, \.7\]\],\s*\[\[FAHHHH_SOUND, \.78\]\],\s*\[\[GUNSHOT_SOUND, \.63\], \[FAHHHH_SOUND, \.72\]\]/s);

  const assets = [
    "paper-crumple.png",
    "dog-run-sprite-ddui-timid.webp",
    "will-smith-original.png",
    "couple-sample.webp",
    "venue-sample.webp",
    "sounds/no-1-classic-hurt.mp3",
    "sounds/no-2-fahhhh.mp3",
    "sounds/no-4-minecraft-hit.mp3",
    "sounds/no-5-yoshi-tongue.mp3",
    "sounds/no-extra-gunshot-jbudden.mp3",
    "sounds/voice-sans.mp3",
    "sounds/will-exit-get-out.mp3",
    "sounds/yes-ta-da.mp3",
    "sounds/intro-pokemon-battle.mp3",
  ];

  await Promise.all(assets.map((asset) => access(new URL(`../public/${asset}`, import.meta.url))));
});
