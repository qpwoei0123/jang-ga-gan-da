"use client";

import { useEffect, useRef, useState } from "react";
import { useAssetsReady } from "./asset-loader";
import { loadYouTubeAPI, type YouTubePlayer } from "./youtube-player";

const VIDEO_ID = "AoDRx16iEH0";

export default function DeliverySong() {
  const ready = useAssetsReady();
  const mount = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const [status, setStatus] = useState<"loading" | "waiting" | "playing" | "blocked" | "error">("loading");

  useEffect(() => {
    if (!ready || !mount.current) return;
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let fallbackTimer = 0;

    void loadYouTubeAPI().then(YT => {
      if (cancelled || !mount.current) return;
      player.current = new YT.Player(mount.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: VIDEO_ID,
        width: 480,
        height: 270,
        playerVars: { controls: 1, playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;
            const iframe = target.getIframe();
            iframe.title = "태진아 동반자 뮤직비디오";
            iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            setStatus("waiting");
            observer = new IntersectionObserver(entries => {
              const visible = entries[0]?.intersectionRatio ?? 0;
              if (visible <= .5 || document.hidden) return;
              observer?.disconnect();
              target.playVideo();
              fallbackTimer = window.setTimeout(() => {
                if (target.getPlayerState() !== 1) setStatus("blocked");
              }, 2500);
            }, { threshold: [.5, .51, .75] });
            observer.observe(iframe);
          },
          onStateChange: ({ data }) => {
            if (cancelled) return;
            if (data === 1) { clearTimeout(fallbackTimer); setStatus("playing"); }
          },
          onAutoplayBlocked: () => { if (!cancelled) setStatus("blocked"); },
          onError: () => { if (!cancelled) setStatus("error"); },
        },
      });
    }).catch(() => { if (!cancelled) setStatus("error"); });

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(fallbackTimer);
      player.current?.destroy();
      player.current = null;
    };
  }, [ready]);

  return <section className="delivery-song" aria-label="오늘의 배달곡">
    <div className="delivery-song-heading">
      <span className="delivery-song-kicker">EXTRA · 오늘의 배달곡</span>
      <p><strong>동반자</strong><span>태진아</span></p>
    </div>
    <div className="delivery-tv" aria-label="갈색 브라운관 텔레비전">
      <span className="delivery-tv-antenna" aria-hidden="true" />
      <div className="delivery-tv-face">
        <div className="delivery-tv-screen"><div className="delivery-song-player"><div ref={mount} /></div></div>
        <div className="delivery-tv-controls" aria-hidden="true">
          <span className="delivery-tv-knob" /><span className="delivery-tv-knob" />
          <span className="delivery-tv-speaker" />
        </div>
      </div>
      <div className="delivery-tv-label" aria-hidden="true"><span>THE WEDDING NEWS</span><span>CH · 11</span></div>
    </div>
    {status === "blocked" && <button className="delivery-song-start" type="button" onClick={() => player.current?.playVideo()}>노래 켜기 <span aria-hidden="true">↗</span></button>}
    {status === "error" && <a className="delivery-song-start" href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noopener noreferrer">유튜브에서 노래 듣기 <span aria-hidden="true">↗</span></a>}
    <p className="delivery-song-caption">신문을 펼치기 전, 함께 듣는 오늘의 노래</p>
  </section>;
}
