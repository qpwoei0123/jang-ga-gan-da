"use client";

import { useEffect, useRef, useState } from "react";
import { createPrintRenderer } from "./print-loading-canvas";
import { createPrintSequence, getPrintTarget } from "./print-sequence";

export default function PrintLoading({ complete, total, preparing, resourcesReady, onPrinted, photo }: {
  complete: number;
  total: number;
  preparing: boolean;
  resourcesReady: boolean;
  onPrinted: () => void;
  photo?: HTMLImageElement;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<ReturnType<typeof createPrintRenderer>>(null);
  const paintedRef = useRef(0);
  const sequenceRef = useRef<ReturnType<typeof createPrintSequence>>(null);
  const [progress, setProgress] = useState(0);
  const ready = progress === 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      rendererRef.current = createPrintRenderer(canvas, photo);
      rendererRef.current?.(paintedRef.current);
      canvas.dataset.rendered = rendererRef.current ? "true" : "false";
    } catch {
      // A decorative canvas failure must never prevent the invitation opening.
      rendererRef.current = null;
      canvas.dataset.rendered = "false";
    }
    return () => { rendererRef.current = null; };
  }, [photo]);

  useEffect(() => {
    const sequence = createPrintSequence({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onProgress: (next) => {
        paintedRef.current = next;
        try {
          rendererRef.current?.(next);
        } catch {
          rendererRef.current = null;
          if (canvasRef.current) canvasRef.current.dataset.rendered = "false";
        }
        setProgress(next);
      },
      onComplete: onPrinted,
    });
    sequenceRef.current = sequence;
    return () => { sequence.dispose(); sequenceRef.current = null; };
  }, [onPrinted]);

  useEffect(() => {
    // Complete the visible ink passes before handing control to the delivery intro.
    sequenceRef.current?.setTarget(getPrintTarget(complete, total, resourcesReady));
  }, [complete, total, resourcesReady, onPrinted]);

  const message = ready ? "따끈한 소식, 배달 준비 완료"
    : preparing && progress > .9 ? "마지막으로 지면을 정리하고 있어요."
    : progress > .86 ? "색판을 맞추고 마지막 교정 중"
    : progress > .49 ? "두 사람의 이야기를 조판하는 중"
    : progress > .09 ? "추억에 색을 입히는 중"
    : "오늘의 소식을 준비합니다";
  const percent = Math.floor(progress * 100);

  return (
    <div className={`print-loading${ready ? " is-printed" : ""}`}>
      <div className="print-masthead"><span>THE WEDDING PRESS</span><span>SEOUL · 2026</span></div>
      <div className="print-bed" aria-hidden="true">
        <i className="print-corner corner-tl" /><i className="print-corner corner-tr" />
        <i className="print-corner corner-bl" /><i className="print-corner corner-br" />
        <div className="print-sheet">
          <div className="print-fallback"><strong>Wedding News</strong><span>우리, 결혼합니다.</span><b>&amp;</b><small>한원영 · 이나경</small></div>
          <canvas ref={canvasRef} width="640" height="800" className="print-art" />
          <div className="print-stamp"><span>인쇄 완료</span><small>READY TO DELIVER</small></div>
        </div>
      </div>
      <div className="print-status">
        <div className="print-status-line"><span className="print-message" role="status">{message}</span><span className="print-count">{String(percent).padStart(2, "0")}<small>%</small></span></div>
        <progress max={1} value={progress} aria-label="신문 준비 진행률" />
        <div className="print-status-bottom">
          <div className="print-inks" aria-hidden="true">{["C", "M", "Y", "K"].map((ink, index) => <span key={ink} className={progress > [.04, .2, .36, .51][index] ? "is-inked" : ""}>{ink}</span>)}</div>
          <span className="print-caption">{ready ? "두 사람의 가장 특별한 호외" : `지면 준비 ${complete} / ${total}`}</span>
        </div>
      </div>
    </div>
  );
}
