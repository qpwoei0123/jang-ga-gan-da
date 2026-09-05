"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPagePrintSurface } from "./print-page-surface";
import { createPrintSequence } from "./print-sequence";

export default function PagePrint({ sceneRef, complete, total, resourcesReady, onPrinted }: {
  sceneRef: RefObject<HTMLDivElement | null>;
  complete: number;
  total: number;
  resourcesReady: boolean;
  onPrinted: () => void;
}) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const printed = progress === 1;

  useEffect(() => {
    // The real page, including its carousel, must finish laying out before ink moves.
    if (!resourcesReady || !sceneRef.current || !controlsRef.current) return;
    let surface: ReturnType<typeof createPagePrintSurface> = null;
    try {
      surface = createPagePrintSurface(sceneRef.current, controlsRef.current);
    } catch {
      // Unsupported decorative effects must not block the prepared invitation.
    }
    const sequence = createPrintSequence({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onProgress: (next) => {
        try {
          surface?.paint(next);
        } catch {
          surface?.dispose();
          surface = null;
        }
        setProgress(next);
      },
      onComplete: onPrinted,
    });
    sequence.setTarget(1);
    return () => { sequence.dispose(); surface?.dispose(); };
  }, [resourcesReady, sceneRef, onPrinted]);

  const overall = resourcesReady ? .1 + progress * .9 : complete / (total + 1) * .1;
  const message = printed ? "인쇄 완료 · 이제 천천히 읽어보세요"
    : !resourcesReady ? "오늘의 소식을 준비합니다"
    : progress < .24 ? "두 사람의 소식을 조판하는 중"
    : progress < .64 ? "추억에 색을 입히는 중"
    : "색판을 맞추고 마지막 교정 중";

  return (
    <div ref={controlsRef} className={`page-print${printed ? " is-printed" : ""}`}>
      <div className="page-print-grain" aria-hidden="true" />
      <div className="page-print-scan" aria-hidden="true" />
      <div className="page-print-stamp" aria-hidden="true"><span>인쇄 완료</span><small>THE WEDDING NEWS</small></div>
      <div className="page-print-status">
        <div className="page-print-heading"><span>THE WEDDING PRESS</span><div className="print-inks" aria-hidden="true">{["C", "M", "Y", "K"].map((ink, index) => <span key={ink} className={progress > [.02, .24, .44, .64][index] ? "is-inked" : ""}>{ink}</span>)}</div></div>
        <div className="print-status-line"><span className="print-message" role="status">{message}</span><span className="print-count">{String(Math.floor(overall * 100)).padStart(2, "0")}<small>%</small></span></div>
        <progress max={1} value={overall} aria-label="신문 준비 진행률" />
      </div>
    </div>
  );
}
