"use client";

import { publicAsset } from "./public-asset.ts";
import { useEffect, useRef, useState, useMemo } from "react";
import { speechFlight } from "./ddui-speech-motion";
import { useAssetsReady, useReportPlayerReady } from "./asset-loader";

type Playback = "waiting" | "blocked" | "playing" | "error";

export default function WeddingSong({ showAnnouncement = true }: { showAnnouncement?: boolean }) {
  const ready = useAssetsReady();
  const reportReady = useReportPlayerReady();
  const engine = useRef<{ context: AudioContext; buffer: AudioBuffer | null; gain: GainNode; source: AudioBufferSourceNode | null } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<Playback>("waiting");
  const [attempt, setAttempt] = useState(0);
  const [hintGone, setHintGone] = useState(false);

  useEffect(() => {
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(context.destination);
    engine.current = { context, buffer: null, gain, source: null };
    // A real gesture can unlock sound while the entrance is still running.
    const unlock = () => { if (context.state === "suspended") void context.resume().catch(() => {}); };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      engine.current?.source?.stop(); engine.current = null;
      void context.close();
    };
  }, []);

  useEffect(() => {
    if (!engine.current) return;
    const audio = engine.current;
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    // Prepare in parallel with the entrance so the music can start when the paper opens.
    fetch(publicAsset("/sounds/aurectheme-jazz-584847.mp3"), { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Audio unavailable"); return response.arrayBuffer(); })
      .then(bytes => audio.context.decodeAudioData(bytes))
      .then(buffer => {
        if (!active) return;
        if (engine.current !== audio) return;
        audio.buffer = buffer;
        setLoaded(true);
        reportReady("ready");
      }).catch(() => { if (active) { setState("error"); reportReady("error"); } })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false; controller.abort(); clearTimeout(timeout);
    };
  }, [reportReady]);

  useEffect(() => {
    if (!ready || !loaded) return;
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => { if (!cancelled) fn(); }, ms));
    const delay = attempt === 0 ? 1600 : 0;
    later(() => {
      const audio = engine.current;
      if (!audio?.buffer || audio.source) return;
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
      setHintGone(false);
      setState("playing");
    }, delay);
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

  useEffect(() => {
    if (state !== "blocked") return;
    const start = () => toggle();
    document.addEventListener("pointerup", start);
    document.addEventListener("keydown", start);
    return () => {
      document.removeEventListener("pointerup", start);
      document.removeEventListener("keydown", start);
    };
  }, [state]);

  const flight = useMemo(speechFlight, [state]);
  if (!showAnnouncement || state === "waiting" || hintGone) return null;
  return <div className="ddui-music" style={flight}>
    <p key={state} className="ddui-flying-word" role="status" onAnimationEnd={event => { if(event.target === event.currentTarget) setHintGone(true); }}>
      <span className="ddui-speech-sway">{state === "playing" ? "뮤직 큐~~" : state === "error" ? "음악을 불러오지 못했어요." : "터치하면 노래 나와요~"}</span>
    </p>
  </div>;
}
