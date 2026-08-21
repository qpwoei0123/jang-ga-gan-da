"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { NO_ATTEMPT_SOUNDS, WILL_EXIT_SOUND, playDecodedSound } from "./audio-bank";

type DeliveryPhase = "approaching" | "arrived" | "opening" | "complete";
type Point = { x: number; y: number };

const NO_ATTEMPT_LIMIT = 5;
const NO_SOUND_VOLUMES = [.95, .68, .55, .75, .9] as const;

export default function NewspaperDelivery() {
  const [phase, setPhase] = useState<DeliveryPhase>("approaching");
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState<Point | null>(null);
  const [willActive, setWillActive] = useState(false);
  const [willDone, setWillDone] = useState(false);
  const timerRef = useRef<number | null>(null);
  const willTimerRef = useRef<number | null>(null);
  const willExitSoundTimerRef = useRef<number | null>(null);
  const lastEvadeRef = useRef(0);
  const noAnimationRef = useRef<Animation | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.delivery = "ready";
    document.body.classList.add("delivery-locked");
    window.scrollTo(0, 0);

    timerRef.current = window.setTimeout(() => setPhase("arrived"), 2100);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (willTimerRef.current) window.clearTimeout(willTimerRef.current);
      if (willExitSoundTimerRef.current) window.clearTimeout(willExitSoundTimerRef.current);
      noAnimationRef.current?.cancel();
      delete root.dataset.delivery;
      document.body.classList.remove("delivery-locked");
    };
  }, []);

  useEffect(() => {
    if (phase === "arrived" && !willActive) {
      yesButtonRef.current?.focus({ preventScroll: true });
    }
  }, [phase, willActive]);

  const noScale = Math.max(.46, 1 - noAttempts * .12);

  useEffect(() => {
    if (!willActive) return;

    const stage = stageRef.current;
    const button = noButtonRef.current;
    if (!stage || !button) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      const stageRect = stage.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const targetX = stageRect.left + stageRect.width * .74;
      const targetY = stageRect.top + stageRect.height * .38;
      const buttonX = buttonRect.left + buttonRect.width / 2;
      const buttonY = buttonRect.top + buttonRect.height / 2;
      const dx = targetX - buttonX;
      const dy = targetY - buttonY;

      noAnimationRef.current = button.animate([
        { offset: 0, opacity: 1, transform: `translate3d(0, 0, 0) rotate(0deg) scale(${noScale})` },
        { offset: .25, opacity: 1, transform: `translate3d(${dx - 50}px, ${dy + 70}px, 0) rotate(-160deg) scale(${noScale})` },
        { offset: .45, opacity: 1, transform: `translate3d(${dx + 18}px, ${dy - 75}px, 0) rotate(-340deg) scale(${noScale * .92})` },
        { offset: .62, opacity: 1, transform: `translate3d(${dx - 35}px, ${dy + 45}px, 0) rotate(-520deg) scale(${noScale * .82})` },
        { offset: .78, opacity: 1, transform: `translate3d(${dx}px, ${dy}px, 0) rotate(-720deg) scale(.12)` },
        { offset: .9, opacity: 0, transform: `translate3d(${dx}px, ${dy}px, 0) rotate(-760deg) scale(.06)` },
        { offset: 1, opacity: 0, transform: `translate3d(${dx}px, ${dy}px, 0) rotate(-760deg) scale(.06)` },
      ], {
        duration: 2600,
        easing: "cubic-bezier(.45, 0, .55, 1)",
        fill: "forwards",
      });
    }

    willExitSoundTimerRef.current = window.setTimeout(() => {
      playDecodedSound(WILL_EXIT_SOUND, .82);
    }, reducedMotion ? 0 : 1900);

    willTimerRef.current = window.setTimeout(() => {
      setWillActive(false);
      setWillDone(true);
      setNoPosition(null);
    }, reducedMotion ? 260 : 2700);

    return () => {
      if (willTimerRef.current) window.clearTimeout(willTimerRef.current);
      if (willExitSoundTimerRef.current) window.clearTimeout(willExitSoundTimerRef.current);
      noAnimationRef.current?.cancel();
    };
  }, [willActive, noScale]);

  const openNewspaper = () => {
    if (phase === "opening" || phase === "complete" || willActive) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setPhase("opening");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timerRef.current = window.setTimeout(() => {
      document.documentElement.dataset.delivery = "complete";
      document.body.classList.remove("delivery-locked");
      setPhase("complete");
    }, reducedMotion ? 120 : 900);
  };

  const evadeNo = () => {
    if (phase !== "arrived" || willActive || willDone) return;

    const now = performance.now();
    if (now - lastEvadeRef.current < 120) return;
    lastEvadeRef.current = now;

    const nextAttempt = noAttempts + 1;
    playDecodedSound(NO_ATTEMPT_SOUNDS[nextAttempt - 1], NO_SOUND_VOLUMES[nextAttempt - 1]);
    setNoAttempts(nextAttempt);
    if (nextAttempt >= NO_ATTEMPT_LIMIT) {
      setWillActive(true);
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;

    const { width, height } = stage.getBoundingClientRect();
    const nextScale = Math.max(.46, 1 - nextAttempt * .12);
    const buttonWidth = 84 * nextScale;
    const minX = 16;
    const maxX = Math.max(minX, width - buttonWidth - 16);
    const minY = Math.min(118, Math.max(24, height * .15));
    const maxY = Math.max(minY, height - 220);
    let nextPoint = { x: minX, y: minY };

    for (let index = 0; index < 6; index += 1) {
      nextPoint = {
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
      };
      if (!noPosition || Math.hypot(nextPoint.x - noPosition.x, nextPoint.y - noPosition.y) > 86) break;
    }

    setNoPosition(nextPoint);
  };

  const handleNoPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    evadeNo();
  };

  const handleNoClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (event.detail === 0) evadeNo();
  };

  if (phase === "complete") return null;

  const narration = willActive
    ? "잠깐. 누군가 거절을 회수하러 왔다."
    : willDone
      ? "…이제 선택지는 하나뿐이다."
      : "어디선가 하얀 말티푸가 신문을 물고 나에게 왔다. 신문을 받아볼까?";
  const noButtonStyle = noPosition
    ? ({ left: noPosition.x, top: noPosition.y, "--no-scale": noScale } as CSSProperties)
    : undefined;
  const noButtonEvents = {
    onPointerDown: handleNoPointerDown,
    onClick: handleNoClick,
  };

  return (
    <div
      className={`delivery-intro phase-${phase}${willActive ? " has-will" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-title"
    >
      <div className="delivery-stage" ref={stageRef}>
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

        {willActive && (
          <span className="will-catcher" aria-hidden="true">
            <img src="/will-smith-original.png" alt="" width="348" height="542" draggable="false" />
          </span>
        )}

        <div className="visual-novel-box" aria-live="polite">
          <span className="novel-nameplate">나레이션</span>
          <p>{narration}</p>
          <div className="delivery-choices">
            <button
              className="choice-button choice-yes"
              type="button"
              ref={yesButtonRef}
              onClick={openNewspaper}
              disabled={willActive}
            >
              예
            </button>
            {!willDone && !noPosition && (
              <button
                className="choice-button choice-no"
                type="button"
                ref={noButtonRef}
                aria-label="아니요. 다가가면 도망갑니다"
                {...noButtonEvents}
              >
                아니요
              </button>
            )}
          </div>
          <span className="novel-progress" aria-hidden="true">
            {phase === "approaching" ? "…" : willDone ? "▶" : "▼"}
          </span>
        </div>

        {!willDone && noPosition && (
          <button
            className={`choice-button choice-no is-fleeing${willActive ? " is-captured" : ""}`}
            type="button"
            ref={noButtonRef}
            style={noButtonStyle}
            aria-label="아니요. 다가가면 도망갑니다"
            {...noButtonEvents}
          >
            아니요
          </button>
        )}

        <span className="delivery-unfold" aria-hidden="true">
          <span className="delivery-half delivery-half-left"><b>결혼</b></span>
          <span className="delivery-half delivery-half-right"><b>일보</b></span>
          <span className="delivery-fold" />
        </span>
      </div>
    </div>
  );
}
