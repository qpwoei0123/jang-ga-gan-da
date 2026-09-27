"use client";

import { useEffect, useRef, useState } from "react";

export default function NewspaperArrival({ prepared, problem, opening, complete, total, onOpen }: {
  prepared: boolean;
  problem: boolean;
  opening: boolean;
  complete: number;
  total: number;
  onOpen: () => void;
}) {
  const [arrived, setArrived] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const greetingTimer = useRef<number | null>(null);
  const canOpen = prepared && arrived && !greeting && !opening;

  useEffect(() => {
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 2600;
    const timer = window.setTimeout(() => setArrived(true), duration);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => () => {
    if (greetingTimer.current !== null) clearTimeout(greetingTimer.current);
  }, []);

  function receiveNewspaper() {
    if (!canOpen || greetingTimer.current !== null) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onOpen();
      return;
    }
    setGreeting(true);
    greetingTimer.current = window.setTimeout(onOpen, 620);
  }

  return (
    <section className={`newspaper-arrival${arrived ? " is-arrived" : ""}${greeting ? " is-greeting" : ""}${opening ? " is-opening" : ""}${problem ? " has-problem" : ""}`} aria-label="강아지가 가져온 결혼 신문">
      <button type="button" className="arrival-receive" disabled={!canOpen} onClick={receiveNewspaper} aria-label={canOpen ? "강아지와 하이파이브하고 신문 펼치기" : "강아지가 신문을 준비하고 있어요"}>
        <span className="arrival-heading">
          <span className="arrival-kicker"><span>결혼 특별호</span><span>2026. 11. 01</span></span>
          <span className="arrival-title"><span>The</span> Wedding News</span>
          <span className="arrival-names">한원영 · 이나경</span>
        </span>
        <span className="arrival-hero" aria-hidden="true">
          <span className="arrival-halo" />
          <span className="arrival-walk" onAnimationEnd={event => {
            if (event.target === event.currentTarget && event.animationName === "arrival-approach") setArrived(true);
          }}>
            <span className="arrival-speech"><span>호외요, 호외~!</span><span>경사났어요, 여러분!</span></span>
            <span className="arrival-dog">
              <span className="arrival-shadow" />
              <span className="arrival-gait">
                <img className="arrival-pose arrival-pose-walking" src="/opening-dog.webp" alt="" width="480" height="408" fetchPriority="high" />
                <img className="arrival-pose arrival-pose-sitting" src="/opening-dog-sitting.webp" alt="" width="480" height="408" decoding="async" />
                <img className="arrival-pose arrival-pose-high-five" src="/opening-dog-high-five.webp" alt="" width="480" height="408" decoding="async" />
              </span>
              <span className="arrival-high-five-word">짝!</span>
            </span>
          </span>
        </span>
        <span className="arrival-footer">
          <span className="arrival-status" role="status">{opening ? "두 사람의 이야기를 펼칩니다." : greeting ? "하이파이브! 반가워요." : problem ? "신문이 조금 늦어지고 있어요." : canOpen ? "오늘의 신문이 도착했어요." : prepared ? "배달원이 다가오고 있어요." : "잠깐만요, 소식을 준비하고 있어요."}</span>
          <span className={`arrival-instruction${canOpen ? " is-ready" : ""}`}>
            {canOpen ? <>신문 펼쳐 보기 <span aria-hidden="true">→</span></> : opening || greeting ? "신문 펼치는 중" : problem ? "아래에서 다시 시도해 주세요" : "곧 도착합니다"}
          </span>
          <span className="arrival-footer-note">{canOpen ? "화면 어디든 터치해 주세요" : "11년의 이야기, 새로운 시작"}</span>
          {!prepared && !problem && !opening && <progress className="arrival-progress" max={total} value={complete} aria-label="신문 준비 진행률" />}
        </span>
      </button>
      {problem && !opening && <div className="arrival-retry">
        <button type="button" onClick={() => window.location.reload()}>다시 불러오기</button>
        <button type="button" onClick={onOpen}>먼저 읽기</button>
      </div>}
    </section>
  );
}
