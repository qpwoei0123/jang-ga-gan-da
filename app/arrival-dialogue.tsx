"use client";

import { useEffect, useRef, useState } from "react";
import { syllableDelay } from "./animalese-voice";

const heading = "호외요, 호외~!";
const announcement = "형아랑 누나랑\n결혼한대요!";

export default function ArrivalDialogue({ active, hint, farewell }: { active: boolean; hint: string; farewell: boolean }) {
  const text = farewell ? "짝! 신문 받아 가세요~" : `${heading}\n${announcement}\n${hint}`;
  const [shown, setShown] = useState("");
  const [replay, setReplay] = useState(0);
  const visible = useRef("");
  const audio = useRef<HTMLAudioElement | null>(null);
  const blocked = useRef(false);
  const attempted = useRef(false);
  const activeNow = useRef(active);
  const farewellNow = useRef(farewell);

  useEffect(() => {
    activeNow.current = active;
    farewellNow.current = farewell;
  }, [active, farewell]);

  useEffect(() => {
    const player = new Audio("/sounds/animalese.wav");
    player.preload = "auto";
    player.volume = .8;
    audio.current = player;
    function retrySound() {
      if (!blocked.current || !activeNow.current || farewellNow.current) return;
      blocked.current = false;
      player.currentTime = 0;
      void player.play().then(() => {
        if (audio.current !== player) return;
        visible.current = "";
        setShown("");
        setReplay(value => value + 1);
      }).catch(() => { blocked.current = true; });
    }
    document.addEventListener("pointerdown", retrySound, true);
    document.addEventListener("keydown", retrySound, true);
    document.addEventListener("click", retrySound, true);
    return () => {
      document.removeEventListener("pointerdown", retrySound, true);
      document.removeEventListener("keydown", retrySound, true);
      document.removeEventListener("click", retrySound, true);
      audio.current = null;
      attempted.current = false;
      blocked.current = false;
      player.pause();
    };
  }, []);

  useEffect(() => {
    if (!active || farewell) {
      if (farewell) audio.current?.pause();
      return;
    }
    if (attempted.current || !audio.current) return;
    attempted.current = true;
    const player = audio.current;
    void player.play().then(() => { blocked.current = false; }).catch(() => { blocked.current = true; });
  }, [active, farewell]);

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
      timer = window.setTimeout(next, farewell ? 43 : syllableDelay(letter, "peppy"));
    }
    timer = window.setTimeout(next, 60);
    return () => window.clearTimeout(timer);
  }, [active, text, replay, farewell]);

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
  </>;
}
