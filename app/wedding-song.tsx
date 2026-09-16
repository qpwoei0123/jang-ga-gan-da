"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO = "fvJKrvxu6SE";
const HOST = "https://www.youtube-nocookie.com";

export default function WeddingSong() {
  const screen = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [source, setSource] = useState("");
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    let started = false;
    const pause = () => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), HOST);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= .6 && !document.hidden && !started) {
        started = true;
        const params = new URLSearchParams({ autoplay: "1", controls: "1", playsinline: "1", enablejsapi: "1", origin: window.location.origin });
        setSource(`${HOST}/embed/${VIDEO}?${params}`);
      }
    }, { threshold: [.6] });
    const visibility = () => { if (document.hidden) pause(); };
    observer.observe(el);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <section className="wedding-song" aria-labelledby="wedding-song-title">
    <header><h2 id="wedding-song-title">오늘의 선곡</h2><p>이 노래와 함께 읽어주세요.</p></header>
    <div ref={screen} className="wedding-song-screen">
      {source && <iframe ref={frame} src={source} onLoad={() => {
        const rect = screen.current?.getBoundingClientRect();
        if (document.hidden || (rect && Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) / rect.height < .6)) {
          frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), HOST);
        }
      }} title="하루상점 — 가을에 감 잡은 재즈" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
    </div>
    <p className="wedding-song-caption">가을에 감 잡은 재즈 · 하루상점<br /><a href={`https://www.youtube.com/watch?v=${VIDEO}`} target="_blank" rel="noopener">YouTube에서 듣기 ↗</a></p>
  </section>;
}
