"use client";

import { useEffect, useRef, useState } from "react";
import ArrivalDialogue from "./arrival-dialogue";
import { arrivalMedley } from "./arrival-preview";
import { HIGH_FIVE_SOUND, playDecodedSound } from "./audio-bank";

export default function NewspaperArrival({ preloading, prepared, problem, opening, complete, total, onOpen }: {
  preloading: boolean;
  prepared: boolean;
  problem: boolean;
  opening: boolean;
  complete: number;
  total: number;
  onOpen: () => void;
}) {
  const [arrived, setArrived] = useState(false);
  const [walkingReady, setWalkingReady] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [highFiving, setHighFiving] = useState(false);
  const highFiveTimer = useRef<number | null>(null);
  const walkingImage = useRef<HTMLImageElement>(null);
  const entering = prepared && walkingReady;
  const offeringPaw = arrived && prepared;
  const canHighFive = offeringPaw && !highFiving && !opening;

  useEffect(() => {
    let active = true;
    const image = walkingImage.current;
    // An image can finish before hydration attaches its load handler.
    if (image?.complete && image.naturalWidth) {
      image.decode().then(() => { if (active) setWalkingReady(true); }).catch(() => {});
    }
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!entering) return;
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1350;
    const timer = window.setTimeout(() => setArrived(true), duration);
    return () => clearTimeout(timer);
  }, [entering]);

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
    playDecodedSound(HIGH_FIVE_SOUND, .75);
    setHighFiving(true);
    highFiveTimer.current = window.setTimeout(onOpen, 1000);
  }

  const speaking = highFiving || opening;

  return (
    <section className={`newspaper-arrival${preloading ? " is-preloading" : ""}${entering ? " is-dog-ready" : " is-loading"}${arrived ? " is-arrived" : ""}${offeringPaw ? " is-offering-paw" : ""}${highFiving ? " is-high-fiving" : ""}${opening ? " is-opening" : ""}${problem ? " has-problem" : ""}`} aria-label="뚜이가 전하는 한원영과 이나경의 결혼 소식">
      <div className="arrival-layout">
        <div className="arrival-hero">
          <div className="arrival-speech">
            <ArrivalDialogue active={(entering || problem) && !opening} farewell={speaking} hint={problem ? "앗, 신문이 늦어지고 있어요." : canHighFive ? waiting ? "제 앞발, 여기 있어요~ 하이파이브!" : "제 앞발에 하이파이브 해주세요!" : prepared ? "제가 지금 갈게요~" : "잠깐만요, 신문을 준비하고 있어요."} />
            {!prepared && !problem && !opening && <progress className="arrival-progress" max={total} value={complete} aria-label="신문 첫 장 준비 진행률" />}
            {problem && !opening && <div className="arrival-retry">
              <button type="button" onClick={() => window.location.reload()}>다시 불러오기</button>
              <button type="button" onClick={onOpen}>먼저 읽기</button>
            </div>}
          </div>
          <div className="arrival-walk">
            {!entering && !opening && !problem && <div className="arrival-medley" role="status" aria-label="열심히 만드는중...">
              <div className="arrival-medley-photos" aria-hidden="true">
                {arrivalMedley.map((photo, index) => <img key={photo.name} className="arrival-medley-frame" src={photo.src} alt="" width={photo.width} height={photo.height} style={{ animationDelay: `${index * 0.5}s` }} />)}
              </div>
              <p>열심히 만드는중...</p>
            </div>}
            <div className="arrival-dog">
              <span className="arrival-shadow" aria-hidden="true" />
              <div className="arrival-gait">
                <img ref={walkingImage} className="arrival-pose-walking" src={preloading ? "/opening-dog.webp" : undefined} alt="" width="480" height="408" fetchPriority="high" decoding="async" onLoad={event => {
                  event.currentTarget.decode().then(() => setWalkingReady(true)).catch(() => {});
                }} />
                <img className="arrival-pose-paw" src={preloading ? "/opening-dog-high-five.webp" : undefined} alt="" width="480" height="408" decoding="async" />
                <svg className="arrival-paw-outline" viewBox="0 0 480 408" aria-hidden="true">
                  <circle className="arrival-paw-ring" cx="244" cy="352" r="75" />
                  <circle className="arrival-paw-ripple" cx="244" cy="352" r="75" />
                </svg>
                <button type="button" className="arrival-paw-touch" disabled={!canHighFive} onPointerDown={event => {
                  if (event.isPrimary && event.button === 0) highFive();
                }} onClick={event => {
                  if (event.detail === 0) highFive();
                }} aria-label="뚜이의 점선으로 표시된 앞발에 하이파이브하고 결혼 신문 펼치기" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
