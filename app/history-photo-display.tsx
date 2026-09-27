"use client";

import { useEffect, useState } from "react";
import { useAssetsReady } from "./asset-loader";

const additionalPhotos = [
  "/history-hanbok-playful.webp",
  "/history-hanbok-flute.webp",
  "/history-hanbok-together.webp",
];

export default function HistoryPhotoDisplay({ photoSrc }: { photoSrc: string }) {
  const ready = useAssetsReady();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => {
      setActive(current => (current + 1) % 4);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [ready]);

  return <div
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
      className={index === active ? "is-current" : undefined}
    />)}
  </div>;
}
