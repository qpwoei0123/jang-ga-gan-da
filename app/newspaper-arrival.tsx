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
  const [waiting, setWaiting] = useState(false);
  const [asideReady, setAsideReady] = useState(false);
  const canOpen = prepared && !opening;

  useEffect(() => {
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1000;
    const timer = window.setTimeout(() => setArrived(true), duration);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!prepared || opening) return;
    const timer = window.setTimeout(() => setWaiting(true), 8000);
    return () => clearTimeout(timer);
  }, [prepared, opening]);

  return (
    <section className={`newspaper-arrival${arrived ? " is-arrived" : ""}${opening ? " is-opening" : ""}${problem ? " has-problem" : ""}`} aria-label="우리 집 강아지가 전하는 결혼 특별호">
      <button type="button" className="arrival-receive" disabled={!canOpen} onClick={onOpen} aria-label={canOpen ? "한원영과 이나경의 결혼 신문 펼쳐 보기" : "결혼 신문 첫 장을 준비하고 있어요"}>
        <span className="arrival-heading">
          <span className="arrival-kicker"><span>결혼 특별호</span><span>2026. 11. 01</span></span>
          <span className="arrival-title"><span>The</span> Wedding News</span>
          <span className="arrival-headline"><span>호외요, 호외!</span><strong>우리 가족이 결혼한대요!</strong></span>
          <span className="arrival-names">한원영 · 이나경</span>
        </span>
        <span className="arrival-hero" aria-hidden="true">
          <span className="arrival-halo" />
          <span className="arrival-walk">
            <span className="arrival-dog">
              <span className="arrival-shadow" />
              <span className="arrival-gait"><img src="/opening-dog.webp" alt="" width="480" height="408" fetchPriority="high" /></span>
            </span>
          </span>
          {waiting && !opening && <span className={`arrival-aside${asideReady ? " is-visible" : ""}`}>
            <img src="/dog-family/side-eye.webp" alt="" width="120" height="144" decoding="async" onLoad={event => {
              void event.currentTarget.decode().then(() => setAsideReady(true), () => {});
            }} />
            <span>좋은 소식인데…<br />안 보실 거예요?</span>
          </span>}
          {opening && <span className="arrival-opening-call">경사났어요, 여러분~!</span>}
        </span>
        <span className="arrival-footer">
          <span className="arrival-status" role="status">{opening ? "두 사람의 이야기를 펼칩니다." : problem ? "신문 첫 장을 불러오지 못했어요." : prepared ? "11년의 이야기, 새로운 시작" : "결혼 특별호 첫 장을 준비하고 있어요."}</span>
          <span className={`arrival-instruction${canOpen ? " is-ready" : ""}`}>
            {canOpen ? <>신문 펼쳐 보기 <span aria-hidden="true">→</span></> : opening ? "신문 펼치는 중" : problem ? "아래에서 다시 시도해 주세요" : "잠깐만 기다려 주세요"}
          </span>
          <span className="arrival-footer-note">{canOpen ? "화면 어디든 터치해 주세요" : "배달 담당 · 우리 집 강아지 뚜이"}</span>
          {!prepared && !problem && !opening && <progress className="arrival-progress" max={total} value={complete} aria-label="신문 첫 장 준비 진행률" />}
        </span>
      </button>
      {problem && !opening && <div className="arrival-retry">
        <button type="button" onClick={() => window.location.reload()}>다시 불러오기</button>
        <button type="button" onClick={onOpen}>먼저 읽기</button>
      </div>}
    </section>
  );
}
