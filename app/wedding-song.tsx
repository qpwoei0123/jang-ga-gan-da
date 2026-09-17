"use client";

import { useEffect, useRef, useState } from "react";
import { useAssetsReady, useReportPlayerReady } from "./asset-loader";
import { loadYouTubeAPI, type YouTubePlayer } from "./youtube-player";

export default function WeddingSong() {
  const screen = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const started = useRef(false);
  const assetsReady = useAssetsReady();
  const reportReady = useReportPlayerReady();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const container = screen.current!;
    loadYouTubeAPI().then((api) => {
      if (!active) return;
      const mount = document.createElement("div");
      container.append(mount);
      player.current = new api.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId: "fvJKrvxu6SE", width: 200, height: 200,
        playerVars: { autoplay: 0, controls: 1, playsinline: 1, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (!active) return;
            target.getIframe().title = "하루상점 — 가을에 감 잡은 재즈";
            setReady(true);
            reportReady("ready");
          },
          onError: () => { if (active) reportReady("error"); },
        },
      });
    }).catch(() => { if (active) reportReady("error"); });
    return () => { active = false; player.current?.destroy(); player.current = null; container.replaceChildren(); };
  }, [reportReady]);

  useEffect(() => {
    if (!assetsReady || !ready) return;
    let visible = false;
    const sync = () => {
      if (document.hidden) player.current?.pauseVideo();
      else if (visible && !started.current) {
        started.current = true;
        player.current?.playVideo();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .6;
      sync();
    }, { threshold: [.6] });
    observer.observe(screen.current!);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [assetsReady, ready]);

  return <section className="wedding-song" aria-label="함께 듣는 음악">
    <div className="wedding-song-record" aria-hidden="true" />
    <div ref={screen} className="wedding-song-screen" />
  </section>;
}
