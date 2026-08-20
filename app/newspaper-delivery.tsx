"use client";

import { useEffect, useRef, useState } from "react";

type DeliveryPhase = "approaching" | "arrived" | "opening" | "complete";

export default function NewspaperDelivery() {
  const [phase, setPhase] = useState<DeliveryPhase>("approaching");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.delivery = "ready";
    document.body.classList.add("delivery-locked");
    window.scrollTo(0, 0);

    timerRef.current = window.setTimeout(() => setPhase("arrived"), 2100);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      delete root.dataset.delivery;
      document.body.classList.remove("delivery-locked");
    };
  }, []);

  const openNewspaper = () => {
    if (phase === "opening" || phase === "complete") return;
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setPhase("opening");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timerRef.current = window.setTimeout(() => {
      document.documentElement.dataset.delivery = "complete";
      document.body.classList.remove("delivery-locked");
      setPhase("complete");
    }, reducedMotion ? 120 : 900);
  };

  if (phase === "complete") return null;

  return (
    <div className={`delivery-intro phase-${phase}`} role="dialog" aria-modal="true" aria-labelledby="delivery-title">
      <button className="delivery-stage" type="button" onClick={openNewspaper}>
        <span className="delivery-dispatch">
          <span>THE COUPLE TIMES</span>
          <span>2026.10.17 · SEOUL</span>
        </span>

        <span className="delivery-heading" id="delivery-title">
          <small>오늘의 특종</small>
          <strong>결혼 소식<br />배달 왔습니다</strong>
        </span>

        <span className="delivery-dog-stage" aria-hidden="true">
          <span className="delivery-dog-sprite" />
          <span className="pant-mark pant-left">헥</span>
          <span className="pant-mark pant-right">헥</span>
        </span>

        <span className="delivery-speed-lines" aria-hidden="true">
          <i /><i /><i />
        </span>

        <span className="delivery-status" aria-live="polite">
          <small>{phase === "approaching" ? "SPECIAL DELIVERY · 배달 중" : "SPECIAL DELIVERY · 도착"}</small>
          <strong>{phase === "approaching" ? "강아지가 신문을 가져오는 중…" : "화면을 눌러 신문 펼치기"}</strong>
          <span>{phase === "approaching" ? "지금 눌러도 바로 받을 수 있어요" : "한원영 × 이나경의 결혼일보"}</span>
        </span>

        <span className="delivery-unfold" aria-hidden="true">
          <span className="delivery-half delivery-half-left"><b>결혼</b></span>
          <span className="delivery-half delivery-half-right"><b>일보</b></span>
          <span className="delivery-fold" />
        </span>
      </button>
    </div>
  );
}
