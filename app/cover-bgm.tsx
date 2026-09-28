"use client";

import { useAssetsReady } from "./asset-loader";

const videoId = "AoDRx16iEH0";

export default function CoverBgm() {
  const ready = useAssetsReady();

  return <section className="cover-bgm" aria-label="오늘의 배경음악">
    <div className="cover-bgm-heading"><span>THE SOUNDTRACK</span><strong>태진아 · 동반자</strong></div>
    <div className="cover-bgm-screen">
      {ready && <iframe
        title="태진아 - 동반자, MBC 아름다운 콘서트"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`}
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />}
    </div>
  </section>;
}
