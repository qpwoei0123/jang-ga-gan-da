"use client";

import { useEffect, useState } from "react";

export default function NewspaperArrival({ prepared, problem, opening, complete, total, onOpen }: {
  prepared: boolean;
  problem: boolean;
  opening: boolean;
  complete: number;
  total: number;
  onOpen: () => void;
}) {
  const [arrived, setArrived] = useState(false);
  const canOpen = prepared && arrived && !opening;

  useEffect(() => {
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 2600;
    const timer = window.setTimeout(() => setArrived(true), duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`newspaper-arrival${opening ? " is-opening" : ""}${problem ? " has-problem" : ""}`} aria-label="강아지가 가져온 결혼 신문">
      <button type="button" className="arrival-receive" disabled={!canOpen} onClick={onOpen} aria-label={canOpen ? "신문을 받아 펼치기" : "강아지가 신문을 준비하고 있어요"}>
        <span className="arrival-heading">
          <span className="arrival-kicker">A LITTLE BIG NEWS</span>
          <span className="arrival-title">결혼 소식 도착!</span>
          <span className="arrival-names">한원영 &amp; 이나경</span>
        </span>
        <span className="arrival-halo" aria-hidden="true" />
        <span className="arrival-walk" aria-hidden="true" onAnimationEnd={event => {
          if (event.target === event.currentTarget && event.animationName === "arrival-approach") setArrived(true);
        }}>
          <span className="arrival-shadow" />
          <span className="arrival-gait">
            <img src="/opening-dog.webp" alt="" width="480" height="408" fetchPriority="high" />
          </span>
          <span className="arrival-speech">경사났어요,<br />여러분~!</span>
        </span>
        <span className={`arrival-instruction${canOpen ? " is-ready" : ""}`} role="status">
          {opening ? "신문 펼치는 중" : problem ? "신문이 조금 늦어지고 있어요." : canOpen ? "터치해서 신문 펼치기" : "잠깐만요, 신문 가져갈게요!"}
        </span>
      </button>
      {!prepared && !problem && !opening && <progress className="arrival-progress" max={total} value={complete} aria-label="신문 준비 진행률" />}
      {problem && !opening && <div className="arrival-retry">
        <button type="button" onClick={() => window.location.reload()}>다시 불러오기</button>
        <button type="button" onClick={onOpen}>먼저 읽기</button>
      </div>}
    </section>
  );
}
