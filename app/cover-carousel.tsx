"use client";

import { useEffect, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";

const photos = [
  { src: "/couple-main.webp", alt: "창가에 나란히 앉아 꽃을 든 한원영과 이나경" },
  { src: "/history/2025.jpg", alt: "2025년, 함께한 한원영과 이나경" },
  { src: "/history/2026.jpg", alt: "2026년, 결혼을 앞둔 한원영과 이나경" },
];

export default function CoverCarousel() {
  const [viewport, api] = useEmblaCarousel({ loop: true, align: "start", duration: 28 });
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!api) return;
    const sync = () => setIndex(api.selectedScrollSnap());
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => { api.off("select", sync).off("reInit", sync); };
  }, [api]);
  const move = (direction: number) => {
    const jump = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (direction < 0) api?.scrollPrev(jump);
    else api?.scrollNext(jump);
  };
  return <div className="cover-photo-print" role="region" aria-roledescription="캐러셀" aria-label="두 사람의 사진">
    <div ref={viewport} className="cover-carousel-viewport" onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
    }} tabIndex={0} aria-label="좌우 방향키 또는 스와이프로 사진 넘기기">
      <div className="cover-carousel-track">
        {photos.map((photo, i) => <div className="cover-carousel-slide" key={photo.src} role="group" aria-roledescription="슬라이드" aria-label={`${i + 1} / ${photos.length}`} aria-hidden={i !== index}>
          <img src={photo.src} alt={photo.alt} width="1200" height="1500" draggable={false} fetchPriority={i === 0 ? "high" : "auto"} />
        </div>)}
      </div>
    </div>
    <span className="cover-photo-mark" aria-hidden="true">FRONT PAGE <b>W × N</b></span>
    <div className="cover-carousel-controls">
      <button type="button" onClick={() => move(-1)} aria-label="이전 사진">‹</button>
      <span aria-live="polite" aria-atomic="true">{index + 1} / {photos.length}</span>
      <button type="button" onClick={() => move(1)} aria-label="다음 사진">›</button>
    </div>
  </div>;
}
