"use client";

import { useEffect, useRef, useState } from "react";
import { speakSyllable, syllableDelay, type VoiceStyle } from "./animalese-voice";

const heading = "호외요, 호외~!";
const announcement = "형아랑 누나랑\n결혼한대요!";

export default function ArrivalDialogue({ active, hint, farewell, voiceStyle = "peppy" }: { active: boolean; hint: string; farewell: boolean; voiceStyle?: VoiceStyle }) {
  const text = farewell ? "짝! 신문 받아 가세요~" : `${heading}\n${announcement}\n${hint}`;
  const [shown, setShown] = useState("");
  const [soundReady, setSoundReady] = useState(false);
  const [replay, setReplay] = useState(0);
  const visible = useRef("");
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    const Audio = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    const context = new Audio();
    audio.current = context;
    void context.resume().then(() => {
      if (audio.current === context && context.state === "running") setSoundReady(true);
    }).catch(() => {});
    return () => { audio.current = null; void context.close().catch(() => {}); };
  }, []);

  useEffect(() => {
    if (!active) return;
    let index = 0;
    // Keep already spoken copy when the paw or loading hint changes.
    while (index < visible.current.length && visible.current[index] === text[index]) index++;
    let timer: number;
    function next() {
      if (document.hidden) { timer = window.setTimeout(next, 150); return; }
      if (index >= text.length) return;
      const letter = text[index++];
      visible.current = text.slice(0, index);
      setShown(visible.current);
      if (soundReady && audio.current) speakSyllable(audio.current, letter, voiceStyle, index);
      timer = window.setTimeout(next, farewell ? 43 : syllableDelay(letter, voiceStyle));
    }
    timer = window.setTimeout(next, 60);
    return () => window.clearTimeout(timer);
  }, [active, text, soundReady, replay, farewell, voiceStyle]);

  async function replayVoice() {
    const Audio = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    try {
      const context = audio.current ?? new Audio();
      audio.current = context;
      await context.resume();
      if (context.state !== "running") return;
      visible.current = "";
      setShown("");
      setSoundReady(true);
      setReplay(value => value + 1);
    } catch { /* The text remains available when audio is unavailable. */ }
  }

  function line(value: string, offset: number) {
    const count = Math.max(0, Math.min(value.length, shown.length - offset));
    return <><span>{value.slice(0, count)}</span><span style={{ visibility: "hidden" }}>{value.slice(count)}</span></>;
  }

  return <>
    <div className="arrival-dialogue-accessible" role="status" aria-live="polite" aria-atomic="true">{text}</div>
    <div aria-hidden="true">
      {farewell ? <p className="arrival-high-five-line">{line(text, 0)}</p> : <>
        <strong>{line(heading, 0)}</strong>
        <p style={{ whiteSpace: "pre-line" }}>{line(announcement, heading.length + 1)}</p>
        <span className="arrival-speech-hint">{line(hint, heading.length + announcement.length + 2)}</span>
      </>}
    </div>
    {!farewell && <button className="arrival-voice-toggle" type="button" onClick={replayVoice}>{soundReady ? "다시 듣기" : "목소리 듣기"}</button>}
  </>;
}
