"use client";

import { useEffect, useRef, useState } from "react";

const photos = [
  { src: "/couple-main.webp", alt: "창가에 나란히 앉아 꽃을 든 한원영과 이나경" },
  { src: "/history/2025.jpg", alt: "2025년, 함께한 한원영과 이나경" },
  { src: "/history/2026.jpg", alt: "2026년, 결혼을 앞둔 한원영과 이나경" },
];
const slides = [photos[photos.length - 1], ...photos, photos[0]];

export default function CoverCarousel() {
  const viewport = useRef<HTMLDivElement>(null);
  const active = useRef(1);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const settle = () => {
      const width = el.clientWidth;
      if (!width) return;
      let slot = Math.round(el.scrollLeft / width);
      if (slot === 0) slot = photos.length;
      else if (slot === slides.length - 1) slot = 1;
      active.current = slot;
      el.scrollTo({ left: slot * width, behavior: "instant" });
      setIndex(slot - 1);
    };
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(settle, 160); };
    const observer = new ResizeObserver(() => {
      el.scrollTo({ left: active.current * el.clientWidth, behavior: "instant" });
    });
    observer.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); el.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, []);
  const move = (direction: number) => {
    const el = viewport.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <div className="cover-photo-print" role="region" aria-roledescription="캐러셀" aria-label="두 사람의 사진">
    <div ref={viewport} className="cover-carousel-viewport" onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
    }} tabIndex={0} aria-label="좌우 방향키 또는 스와이프로 사진 넘기기">
      {slides.map((photo, i) => <img key={i} src={photo.src} alt={i === 0 || i === slides.length - 1 ? "" : photo.alt} aria-hidden={i === 0 || i === slides.length - 1 ? true : undefined} width="1200" height="1500" draggable={false} fetchPriority={i === 1 ? "high" : "auto"} />)}
    </div>
    <span className="cover-photo-mark" aria-hidden="true">FRONT PAGE <b>W × N</b></span>
    <div className="cover-carousel-controls">
      <button type="button" onClick={() => move(-1)} aria-label="이전 사진">‹</button>
      <span aria-live="polite" aria-atomic="true">{index + 1} / {photos.length}</span>
      <button type="button" onClick={() => move(1)} aria-label="다음 사진">›</button>
    </div>
  </div>;
}
