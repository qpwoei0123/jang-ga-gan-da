"use client";

import { publicAsset } from "./public-asset.ts";
import { useEffect, useRef, useState } from "react";
import { useAssetsReady } from "./asset-loader";

const additionalPhotos = [
  publicAsset("/history-hanbok-playful.webp"),
  publicAsset("/history-hanbok-flute.webp"),
  publicAsset("/history-hanbok-together.webp"),
];

export default function HistoryPhotoDisplay({ photoSrc }: { photoSrc: string }) {
  const ready = useAssetsReady();
  const frame = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!ready || !frame.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!ready || !visible) return;
    let current = true;
    const timer = window.setInterval(() => {
      const next = (active + 1) % 4;
      const photo = frame.current?.querySelectorAll("img")[next];
      // Keep the current photo visible until the next one has really decoded.
      void photo?.decode().then(() => { if (current) setActive(next); }, () => {});
    }, 3500);
    return () => { current = false; window.clearInterval(timer); };
  }, [ready, visible, active]);

  return <div
    ref={frame}
    className="article-photo-print article-photo-display"
    role="img"
    aria-label="한옥 앞에서 전통 혼례복을 입은 한원영과 이나경의 혼인 사진 네 장"
  >
    {[photoSrc, ...additionalPhotos].map((src, index) => <img
      key={src}
      src={src}
      alt=""
      aria-hidden="true"
      width={1365}
      height={2048}
      loading="lazy"
      decoding="async"
      className={index === active ? "is-current" : undefined}
    />)}
  </div>;
}
