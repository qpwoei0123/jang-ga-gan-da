"use client";

import { useCallback, useEffect, useRef } from "react";

type SpeechKind = "location" | "interaction";

// Each utterance owns its birthplace and lifetime, never the moving dog's transform.
export function useDogSpeech() {
  const layerRef = useRef<HTMLDivElement>(null);
  const utterances = useRef(new Map<HTMLElement, { kind: SpeechKind; animation: Animation }>());
  const emit = useCallback((text: string, kind: SpeechKind, source: HTMLElement) => {
    const layer = layerRef.current;
    if (!layer) return;
    const siblings = [...utterances.current].filter(([, item]) => item.kind === kind);
    if (siblings.length >= (kind === "interaction" ? 4 : 2)) {
      const [element, item] = siblings[0];
      item.animation.cancel(); element.remove(); utterances.current.delete(element);
    }
    const rect = source.getBoundingClientRect(), paper = layer.getBoundingClientRect();
    const scale = rect.width / 48;
    const x = rect.left - paper.left + rect.width / 2;
    const y = rect.top - paper.top + rect.height / 2;
    const word = document.createElement("span");
    word.className = `chronicle-word chronicle-word-${kind}`;
    word.textContent = text;
    layer.append(word);
    const width = word.offsetWidth, height = word.offsetHeight;
    const left = kind === "location" ? Math.max(8, x-width-30*scale) : x-width/2;
    const top = y-height/2;
    word.style.left = `${left/paper.width*100}%`;
    word.style.top = `${top/paper.height*100}%`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frames: Keyframe[] = [{ opacity:0 }, { opacity:1, offset:.1 }, { opacity:1, offset:.35 }, { opacity:0 }];
    if (kind === "interaction" && !reduced) {
      const dx = -(65+Math.random()*35)*scale;
      const dy = -(35+Math.random()*60)*scale;
      const rotation = Math.random()*12-6;
      const pose = (fraction: number, sway: number, turn: number) => {
        const tx = Math.max(8-left, Math.min(paper.width-width-8-left, dx*fraction+sway*scale));
        return `translate(${tx}px, ${dy*fraction}px) rotate(${rotation+turn}deg)`;
      };
      frames = [
        { opacity:0, transform:"translate(0,0) scale(.65)", offset:0 },
        { opacity:1, transform:pose(.68,0,-5), offset:.15 },
        { opacity:1, transform:pose(.84,7,5), offset:.37 },
        { opacity:.65, transform:pose(.93,-5,-4), offset:.64 },
        { opacity:0, transform:pose(1,0,3), offset:1 },
      ];
    }
    const animation = word.animate(frames, {
      duration:kind === "location" ? 4200 : 2500,
      easing:kind === "location" ? "linear" : "ease-out", fill:"forwards",
    });
    utterances.current.set(word, { kind, animation });
    const remove = () => { word.remove(); utterances.current.delete(word); };
    void animation.finished.then(remove, remove);
  }, []);
  useEffect(() => () => {
    utterances.current.forEach(({ animation }, word) => { animation.cancel(); word.remove(); });
    utterances.current.clear();
  }, []);
  return { layerRef, emit };
}
