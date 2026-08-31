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
  assert.match(html, /<title>The Wedding News \| 한원영·이나경<\/title>/);
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
  const [page, centerfold, delivery, audioBank, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/centerfold-gallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/newspaper-delivery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/audio-bank.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /^"use client";/);
  assert.match(page, /<AssetGate assets=\{INVITATION_ASSETS\}>/);
  assert.doesNotMatch(page, /OutdoorSunlight/);
  assert.match(page, /\.\.\.INTERACTION_SOUNDS/);
  assert.match(page, /\/couple-main\.webp/);
  assert.match(page, /\/couple-sample\.webp/);
  assert.match(page, /\/venue-sample\.webp/);
  assert.match(page, /\/paper-crumple\.png/);
  assert.match(page, /창가에 나란히 앉아 꽃다발을 든 한원영과 이나경/);
  assert.match(page, /function PhotoSlot/);
  assert.match(page, /PHOTO TO COME/);
  assert.doesNotMatch(page, /journey-page|archive-mosaic|milestone-rail|ARCHIVE 0[1-6]|views-page|schedule-page|back-page/);
  assert.doesNotMatch(page, /evidence-strip|ARCHIVE 07|ARCHIVE 08/);
  assert.match(page, /function CoverCarousel/);
  assert.match(page, /<CenterfoldGallery \/>/);
  assert.match(page, /aria-roledescription="carousel"/);
  assert.match(page, /aria-label="이전 사진"/);
  assert.match(page, /aria-label="다음 사진"/);
  assert.match(page, /onPointerDown=\{handleDragStart\}/);
  assert.match(page, /onPointerMove=\{handleDragMove\}/);
  assert.match(page, /key: "clone-last"/);
  assert.match(page, /key: "clone-first"/);
  assert.match(page, /settledIndex === COVER_SLIDES\.length \+ 1/);
  assert.match(page, /GD와 결혼하지 못한 신부의 한탄/);
  assert.match(page, /그 얘기를 왜 청첩장에까지 쓰는지 모르겠다/);
  assert.doesNotMatch(page, /<section className="paper-page people-page"|<section className="paper-page search-page"/);
  assert.match(page, /function WeddingSearchPuzzle/);
  assert.match(page, /tracePuzzleLine/);
  assert.match(page, /6\/6 취재 완료/);
  assert.match(page, /search-lower-correction/);
  assert.match(page, /CORRECTION \/ 편집국 정정 보도/);
  assert.match(page, /평생 동거인 모집,/);
  assert.match(page, /다 찾았으면 이제 간식 찾아/);
  assert.doesNotMatch(page, /puzzle-easter-egg/);
  assert.doesNotMatch(page, /celebrityDesk|celebrityPhotos|유명인들의|celebs\//);
  assert.doesNotMatch(page, /<img[^>]+src=["'{`]https?:\/\//i);
  assert.doesNotMatch(centerfold, /<img[^>]+src=["'{`]https?:\/\//i);
  assert.match(centerfold, /Observer\.create/);
  assert.match(centerfold, /ScrollTrigger\.create/);
  assert.match(centerfold, /onStopDelay/);
  assert.match(centerfold, /centerfold-locked/);
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
  assert.match(delivery, /OPENING_DURATION_MS = 760/);
  assert.match(delivery, /useLayoutEffect/);
  assert.match(delivery, /root\.classList\.add\("delivery-locked"\)/);
  assert.match(delivery, /root\.classList\.remove\("delivery-locked"\)/);
  assert.doesNotMatch(delivery, /document\.body\.classList\.(?:add|remove)\("delivery-locked"\)/);
  assert.match(delivery, /dataset\.delivery = "opening"/);
  assert.match(delivery, /className="delivery-brand-reveal"/);
  assert.match(delivery, /src="\/favicon\.svg"/);
  assert.doesNotMatch(delivery, /delivery-unfold|delivery-half|delivery-fold|<b>결혼<\/b>|<b>일보<\/b>/);
  assert.match(delivery, /playDecodedSound\(SANS_VOICE_SOUND, \.22\)/);
  assert.match(delivery, /강아지가 신문을 물고 죽어라 달려왔다\. 정작 도착하고 나니 왜 왔는지 모르는 눈치다\. 받아볼까\?/);
  assert.match(delivery, /is-hit/);
  assert.match(delivery, /playDecodedSound\(WILL_EXIT_SOUND/);
  assert.match(delivery, /playDecodedSound\(YOSHI_TONGUE_SOUND, \.84\)/);
  assert.match(delivery, /WILL_REVEAL_PAUSE_MS = 150/);
  assert.match(delivery, /introMusicRef\.current\?\.duck/);
  assert.match(delivery, /className="is-breaking"/);
  assert.doesNotMatch(delivery, /onPointerEnter/);
  assert.doesNotMatch(delivery, /THE COUPLE TIMES|오늘의 특종|나레이션|누군가 거절을 회수|선택지는 하나뿐/);
  assert.match(audioBank, /decodeAudioData/);
  assert.match(styles, /--paper: #f5f4f1;/);
  assert.match(styles, /^html \{[^}]*overflow-y: auto[^}]*scrollbar-width: none/m);
  assert.match(styles, /html::-webkit-scrollbar \{[^}]*display: none/s);
  assert.match(styles, /html\.delivery-locked \{[^}]*overflow-y: hidden[^}]*overscroll-behavior: none/s);
  assert.match(styles, /html\.delivery-locked body \{[^}]*touch-action: none/s);
  assert.doesNotMatch(styles, /body\.delivery-locked/);
  assert.match(styles, /html \{[^}]*background: var\(--paper\)/s);
  assert.match(styles, /\.edition \{[^}]*background: var\(--paper\)/s);
  assert.match(styles, /\.paper-page \{[^}]*box-shadow: 0 9px 26px rgb\(23 23 22 \/ 18%\)/s);
  assert.match(styles, /\.paper-page::before \{[^}]*opacity: \.16[^}]*url\("\/paper-crumple\.png"\)/s);
  assert.match(styles, /\.paper-page::after \{[^}]*linear-gradient/s);
  assert.match(styles, /\.photo-slot-frame \{[^}]*border: 1px solid var\(--line-strong\)[^}]*background: var\(--paper-soft\)/s);
  assert.doesNotMatch(styles, /\.photo-slot[^}]*box-shadow/s);
  assert.match(styles, /\.cover-page \{[^}]*display: flex[^}]*min-height: 770px/s);
  assert.match(styles, /\.cover-page > \.page-bottomline \{[^}]*margin-top: auto/s);
  assert.match(styles, /\.cover-photo-print \{[^}]*width: 100%/s);
  assert.match(styles, /\.cover-photo-viewport \{[^}]*padding: 0 16%[^}]*scroll-snap-type: x mandatory/s);
  assert.match(styles, /\.cover-photo-track \{[^}]*gap: 8px/s);
  assert.match(styles, /\.cover-reaction-copy \{[^}]*column-count: 3/s);
  assert.match(styles, /\.people-photo \.photo-slot-frame \{[^}]*height: 370px/s);
  assert.doesNotMatch(styles, /text-align:\s*justify/);
  assert.match(styles, /\.cover-reaction-copy \{[^}]*text-align: start/s);
  assert.match(styles, /\.lead-report p \{[^}]*text-align: start/s);
  assert.doesNotMatch(styles, /outdoor-sunlight|canvas-desktop/);
  assert.match(styles, /\.delivery-intro \{[^}]*background-color: var\(--paper\)/s);
  assert.match(styles, /@keyframes favicon-reveal/);
  assert.doesNotMatch(styles, /paper-unfold|fold-arrive|delivery-unfold|delivery-half|delivery-fold/);
  assert.match(audioBank, /\[\],\s*\[\[CLASSIC_HURT_SOUND, \.9\]\],\s*\[\[GUNSHOT_SOUND, \.7\]\],\s*\[\[FAHHHH_SOUND, \.78\]\],\s*\[\[GUNSHOT_SOUND, \.63\], \[FAHHHH_SOUND, \.72\]\]/s);

  const assets = [
    "favicon.svg",
    "paper-crumple.png",
    "dog-run-sprite-ddui-timid.webp",
    "will-smith-original.png",
    "couple-main.webp",
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
