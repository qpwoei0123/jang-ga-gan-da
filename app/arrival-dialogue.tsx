"use client";

import { useEffect, useRef, useState } from "react";
import { prepareVoiceSample, speakSampledSyllable, speakSyllable, syllableDelay, type VoiceSample, type VoiceStyle } from "./animalese-voice";

const heading = "호외요, 호외~!";
const announcement = "형아랑 누나랑\n결혼한대요!";

export default function ArrivalDialogue({ active, hint, farewell, onPawHintStart, voiceStyle = "peppy" }: { active: boolean; hint: string; farewell: boolean; onPawHintStart: () => void; voiceStyle?: VoiceStyle }) {
  const text = farewell ? "짝! 신문 받아 가세요~" : `${heading}\n${announcement}\n${hint}`;
  const [shown, setShown] = useState("");
  const [soundReady, setSoundReady] = useState(false);
  const [replay, setReplay] = useState(0);
  const visible = useRef("");
  const audio = useRef<AudioContext | null>(null);
  const sample = useRef<VoiceSample | null>(null);
  const sampleFailed = useRef(false);

  useEffect(() => {
    const Audio = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    const context = new Audio();
    const controller = new AbortController();
    audio.current = context;
    function restartSpeech() {
      if (!visible.current) return;
      visible.current = "";
      setShown("");
      setReplay(value => value + 1);
    }
    void fetch("/sounds/animalese.wav", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Voice sample unavailable");
        return response.arrayBuffer();
      })
      .then(bytes => context.decodeAudioData(bytes))
      .then(buffer => {
        if (audio.current !== context) return;
        const prepared = prepareVoiceSample(buffer);
        if (!prepared.slots.length) throw new Error("Voice sample has no usable sound");
        sample.current = prepared;
        if (context.state === "running") restartSpeech();
      })
      .catch(() => {
        if (audio.current !== context) return;
        sampleFailed.current = true;
        if (context.state === "running") restartSpeech();
      });
    let enabled = false;
    function enableSound() {
      if (enabled || audio.current !== context || context.state !== "running") return;
      enabled = true;
      // A blocked first play repeats the visible line when sound becomes possible.
      if (sample.current || sampleFailed.current) restartSpeech();
      setSoundReady(true);
    }
    function trySound() {
      if (context.state === "running") { enableSound(); return; }
      void context.resume().then(enableSound).catch(() => {});
    }
    trySound();
    document.addEventListener("pointerdown", trySound, true);
    document.addEventListener("keydown", trySound, true);
    document.addEventListener("click", trySound, true);
    return () => {
      document.removeEventListener("pointerdown", trySound, true);
      document.removeEventListener("keydown", trySound, true);
      document.removeEventListener("click", trySound, true);
      controller.abort();
      audio.current = null;
      sample.current = null;
      void context.close().catch(() => {});
    };
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
      if (!farewell && hint.startsWith("제 앞발") && index === heading.length + announcement.length + 2) onPawHintStart();
      const letter = text[index++];
      visible.current = text.slice(0, index);
      setShown(visible.current);
      if (soundReady && audio.current) {
        if (sample.current) speakSampledSyllable(audio.current, sample.current, letter, index);
        else if (sampleFailed.current) speakSyllable(audio.current, letter, voiceStyle, index);
      }
      timer = window.setTimeout(next, farewell ? 43 : syllableDelay(letter, voiceStyle));
    }
    timer = window.setTimeout(next, 60);
    return () => window.clearTimeout(timer);
  }, [active, text, soundReady, replay, farewell, hint, onPawHintStart, voiceStyle]);

  let shownLength = 0;
  while (shownLength < shown.length && shown[shownLength] === text[shownLength]) shownLength++;

  function line(value: string, offset: number) {
    const count = Math.max(0, Math.min(value.length, shownLength - offset));
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
  </>;
}
