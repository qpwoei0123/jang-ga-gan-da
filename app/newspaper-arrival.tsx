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

  const speaking = highFiving || opening;

  return (
    <section className={`newspaper-arrival${arrived ? " is-arrived" : ""}${offeringPaw ? " is-offering-paw" : ""}${highFiving ? " is-high-fiving" : ""}${opening ? " is-opening" : ""}${problem ? " has-problem" : ""}`} aria-label="뚜이가 전하는 한원영과 이나경의 결혼 소식">
      <div className="arrival-layout">
        <div className="arrival-hero">
          <div className="arrival-speech">
            <div role="status" aria-live="polite" aria-atomic="true">
              <strong>{speaking ? "짝! 반가워요!" : "호외요, 호외~!"}</strong>
              <p>{speaking ? "경사났어요, 여러분~!" : <>원영이랑 나경이가<br />결혼한대요!</>}</p>
              {!speaking && <span className="arrival-speech-date">11월 1일이에요!</span>}
              <span className="arrival-speech-hint">{opening ? "두 사람의 이야기를 펼칠게요!" : highFiving ? "하이파이브! 신문 받아 가세요~" : problem ? "앗, 신문이 늦어지고 있어요." : canHighFive ? waiting ? "제 앞발, 여기 있어요~ 하이파이브!" : "제 앞발에 하이파이브 해주세요!" : prepared ? "제가 지금 갈게요~" : "잠깐만요, 신문을 준비하고 있어요."}</span>
            </div>
            {!prepared && !problem && !opening && <progress className="arrival-progress" max={total} value={complete} aria-label="신문 첫 장 준비 진행률" />}
            {problem && !opening && <div className="arrival-retry">
              <button type="button" onClick={() => window.location.reload()}>다시 불러오기</button>
              <button type="button" onClick={onOpen}>먼저 읽기</button>
            </div>}
          </div>
          <div className="arrival-walk">
            <div className="arrival-dog">
              <span className="arrival-shadow" aria-hidden="true" />
              <div className="arrival-gait">
                <img className="arrival-pose-walking" src="/opening-dog.webp" alt="" width="480" height="408" fetchPriority="high" />
                <img className="arrival-pose-paw" src="/opening-dog-high-five.webp" alt="" width="480" height="408" decoding="async" />
                <svg className="arrival-paw-outline" viewBox="0 0 480 408" aria-hidden="true">
                  <path d="M215 307 C205 302 199 313 196 325 C182 333 185 350 191 359 C188 373 199 386 213 390 C226 403 252 405 267 395 C289 390 302 374 303 356 C308 338 298 319 283 313 C265 300 246 313 236 307 C226 298 220 303 215 307 Z" />
                </svg>
                <button type="button" className="arrival-paw-touch" disabled={!canHighFive} onClick={highFive} aria-label="뚜이의 점선으로 표시된 앞발에 하이파이브하고 결혼 신문 펼치기" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
