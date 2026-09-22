"use client";

import { useEffect, useRef, useState } from "react";
import { useAssetsReady, useReportPlayerReady } from "./asset-loader";

type Playback = "waiting" | "counting" | "blocked" | "playing" | "error";

export default function WeddingSong() {
  const ready = useAssetsReady();
  const reportReady = useReportPlayerReady();
  const engine = useRef<{ context: AudioContext; buffer: AudioBuffer; gain: GainNode; source: AudioBufferSourceNode | null } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<Playback>("waiting");
  const [count, setCount] = useState<string | number>("노래 나옵니다");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(context.destination);
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    // A real gesture can unlock sound while the entrance/countdown is still running.
    const unlock = () => { if (context.state === "suspended") void context.resume().catch(() => {}); };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    fetch("/sounds/aurectheme-jazz-584847.mp3", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Audio unavailable"); return response.arrayBuffer(); })
      .then(bytes => context.decodeAudioData(bytes))
      .then(buffer => {
        if (!active) return;
        engine.current = { context, buffer, gain, source: null };
        setLoaded(true);
        reportReady("ready");
      }).catch(() => { if (active) { setState("error"); reportReady("error"); } })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false; controller.abort(); clearTimeout(timeout);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      engine.current?.source?.stop(); engine.current = null;
      void context.close();
    };
  }, [reportReady]);

  useEffect(() => {
    if (!ready || !loaded) return;
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => { if (!cancelled) fn(); }, ms));
    const delay = attempt === 0 ? 1600 : 0;
    later(() => { setState("counting"); setCount("노래 나옵니다"); }, delay);
    [3, 2, 1].forEach((n, i) => later(() => setCount(n), delay + 1100 + i * 1000));
    later(() => {
      const audio = engine.current;
      if (!audio) return;
      if (audio.context.state !== "running") { setState("blocked"); return; }
      const source = audio.context.createBufferSource();
      source.buffer = audio.buffer;
      source.loop = true;
      source.connect(audio.gain);
      audio.source = source;
      audio.gain.gain.cancelScheduledValues(audio.context.currentTime);
      audio.gain.gain.setValueAtTime(0, audio.context.currentTime);
      audio.gain.gain.linearRampToValueAtTime(.45, audio.context.currentTime + 3);
      source.start();
      setState("playing");
    }, delay + 4100);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [ready, loaded, attempt]);

  const toggle = () => {
    const audio = engine.current;
    if (!audio) return;
    void audio.context.resume().then(() => {
      if (engine.current !== audio) return;
      if (audio.context.state === "running") setAttempt(value => value + 1);
      else setState("blocked");
    }).catch(() => setState("blocked"));
  };

  if (state === "waiting" || state === "playing") return null;
  return <div className="ddui-music">
    {state === "counting" ? <p className="ddui-countdown" role="status" aria-live="polite"><span key={count}>{count}</span></p>
      : state === "error" ? <p className="ddui-music-error">음악을 불러오지 못했어요.</p>
      : <button type="button" onClick={toggle} aria-label="음악 재생">
        터치하면 노래 나와요
      </button>}
  </div>;
}
