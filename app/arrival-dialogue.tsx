"use client";

import { useEffect, useRef, useState } from "react";

const heading = "호외요, 호외~!";
const announcement = "형아랑 누나랑\n결혼한대요!";

// Short voiced syllables with vowel-like resonances, synthesized locally.
function chatter(context: AudioContext, letter: string) {
  if (context.state !== "running" || !/[가-힣a-z0-9]/i.test(letter)) return;
  const now = context.currentTime;
  const seed = letter.charCodeAt(0);
  const voice = context.createOscillator();
  const envelope = context.createGain();
  const vowel = context.createBiquadFilter();
  voice.type = "sawtooth";
  const pitch = 310 + (seed % 9) * 32;
  voice.frequency.setValueAtTime(pitch, now);
  voice.frequency.exponentialRampToValueAtTime(pitch * .78, now + .065);
  vowel.type = "bandpass";
  vowel.frequency.value = 850 + (seed % 5) * 260;
  vowel.Q.value = 2.4;
  envelope.gain.setValueAtTime(0, now);
  envelope.gain.linearRampToValueAtTime(.075, now + .009);
  envelope.gain.exponentialRampToValueAtTime(.001, now + .075);
  voice.connect(vowel).connect(envelope).connect(context.destination);
  voice.onended = () => { voice.disconnect(); vowel.disconnect(); envelope.disconnect(); };
  voice.start(now);
  voice.stop(now + .08);
}

export default function ArrivalDialogue({ active, hint, farewell }: { active: boolean; hint: string; farewell: boolean }) {
  const text = farewell ? "짝! 신문 받아 가세요~" : `${heading}\n${announcement}\n${hint}`;
  const [shown, setShown] = useState("");
  const [muted, setMuted] = useState(true);
  const [replay, setReplay] = useState(0);
  const visible = useRef("");
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    const Audio = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    const context = new Audio();
    audio.current = context;
    void context.resume().then(() => {
      if (audio.current === context && context.state === "running") setMuted(false);
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
      if (!muted && audio.current) chatter(audio.current, letter);
      timer = window.setTimeout(next, farewell ? 43 : /[!~.,\n]/.test(letter) ? 170 : 68);
    }
    timer = window.setTimeout(next, 60);
    return () => window.clearTimeout(timer);
  }, [active, text, muted, replay, farewell]);

  async function toggleVoice() {
    if (!muted) { setMuted(true); return; }
    const Audio = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    try {
      const context = audio.current ?? new Audio();
      audio.current = context;
      await context.resume();
      if (context.state !== "running") return;
      visible.current = "";
      setShown("");
      setMuted(false);
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
    {!farewell && <button className="arrival-voice-toggle" type="button" onClick={toggleVoice} aria-pressed={!muted}>{muted ? "목소리 듣기" : "소리 끄기"}</button>}
  </>;
}
