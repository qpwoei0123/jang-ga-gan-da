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
  const [waiting, setWaiting] = useState(false);
  const [asideReady, setAsideReady] = useState(false);
  const [highFiving, setHighFiving] = useState(false);
  const highFiveTimer = useRef<number | null>(null);
  const offeringPaw = arrived && prepared;
  const canHighFive = offeringPaw && !highFiving && !opening;

  useEffect(() => {
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1350;
    const timer = window.setTimeout(() => setArrived(true), duration);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!canHighFive) return;
    const timer = window.setTimeout(() => setWaiting(true), 8000);
    return () => clearTimeout(timer);
  }, [canHighFive]);

  useEffect(() => () => {
    if (highFiveTimer.current !== null) clearTimeout(highFiveTimer.current);
  }, []);

  function highFive() {
    if (!canHighFive || highFiveTimer.current !== null) return;
    setHighFiving(true);
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 180 : 620;
    highFiveTimer.current = window.setTimeout(onOpen, duration);
  }

  return (
    <section className={`newspaper-arrival${arrived ? " is-arrived" : ""}${offeringPaw ? " is-offering-paw" : ""}${highFiving ? " is-high-fiving" : ""}${opening ? " is-opening" : ""}${problem ? " has-problem" : ""}`} aria-label="우리 집 강아지가 전하는 결혼 특별호">
      <div className="arrival-layout">
        <header className="arrival-heading">
          <span className="arrival-kicker"><span>결혼 특별호</span><span>2026. 11. 01</span></span>
          <span className="arrival-title"><span>The</span> Wedding News</span>
          <h1 className="arrival-headline"><span>호외요, 호외!</span><strong>우리 가족이 결혼한대요!</strong></h1>
          <span className="arrival-names">한원영 · 이나경</span>
        </header>
        <div className="arrival-hero">
          <span className="arrival-halo" aria-hidden="true" />
          <div className="arrival-walk">
            <div className="arrival-dog">
              <span className="arrival-shadow" aria-hidden="true" />
              <div className="arrival-gait">
                <img className="arrival-pose-walking" src="/opening-dog.webp" alt="" width="480" height="408" fetchPriority="high" />
                <img className="arrival-pose-paw" src="/opening-dog-high-five.webp" alt="" width="480" height="408" decoding="async" />
                <button type="button" className="arrival-paw-touch" disabled={!canHighFive} onClick={highFive} aria-label="뚜이의 앞발을 터치해 하이파이브하고 결혼 신문 펼치기" />
                {canHighFive && <span className="arrival-paw-hint" aria-hidden="true">앞발을 톡!<span>↖</span></span>}
                {highFiving && <span className="arrival-high-five-word" aria-hidden="true">짝!</span>}
              </div>
            </div>
          </div>
          {waiting && !highFiving && !opening && <span className={`arrival-aside${asideReady ? " is-visible" : ""}`} aria-hidden="true">
            <img src="/dog-family/side-eye.webp" alt="" width="120" height="144" decoding="async" onLoad={event => {
              void event.currentTarget.decode().then(() => setAsideReady(true), () => {});
            }} />
            <span>제 앞발에<br />하이파이브 해주세요!</span>
          </span>}
          {(highFiving || opening) && <span className="arrival-opening-call" aria-hidden="true">경사났어요, 여러분~!</span>}
        </div>
        <div className="arrival-footer">
          <span className="arrival-status" role="status">{opening ? "두 사람의 이야기를 펼칩니다." : highFiving ? "짝! 하이파이브!" : problem ? "신문 첫 장을 불러오지 못했어요." : canHighFive ? "뚜이의 앞발을 톡, 하이파이브하면 신문이 펼쳐져요." : "결혼 특별호 첫 장을 준비하고 있어요."}</span>
          <span className="arrival-footer-note">11년의 이야기, 새로운 시작</span>
          {!prepared && !problem && !opening && <progress className="arrival-progress" max={total} value={complete} aria-label="신문 첫 장 준비 진행률" />}
        </div>
      </div>
      {problem && !opening && <div className="arrival-retry">
        <button type="button" onClick={() => window.location.reload()}>다시 불러오기</button>
        <button type="button" onClick={onOpen}>먼저 읽기</button>
      </div>}
    </section>
  );
}
