"use client";

import confetti from "canvas-confetti";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  NO_ATTEMPT_EXTRA_SOUNDS,
  NO_DAMAGE_SOUND,
  SANS_VOICE_SOUND,
  WILL_EXIT_SOUND,
  YES_TADA_SOUND,
  playDecodedSound,
} from "./audio-bank";

type DeliveryPhase = "approaching" | "arrived" | "opening" | "complete";
type Point = { x: number; y: number };

const NO_ATTEMPT_LIMIT = 5;
const DAMAGE_FEEDBACK_MS = 200;
const NO_HAPTIC_MS = 35;
const TYPE_INTERVAL_MS = 55;
const NARRATION = "어디선가 강아지가 수상할정도로 수상한 물건을 물고 나에게 왔다, 받아볼까?";
const NEWSPAPER_CONFETTI_COLORS = ["#b84435", "#275c78", "#e1bd63", "#60704b", "#f5eddb", "#2b241b"];

export default function NewspaperDelivery() {
  const [phase, setPhase] = useState<DeliveryPhase>("approaching");
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState<Point | null>(null);
  const [noHit, setNoHit] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [willActive, setWillActive] = useState(false);
  const [willDone, setWillDone] = useState(false);
  const timerRef = useRef<number | null>(null);
  const willTimerRef = useRef<number | null>(null);
  const willExitSoundTimerRef = useRef<number | null>(null);
  const noHitTimerRef = useRef<number | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const noHitLockedRef = useRef(false);
  const noAnimationRef = useRef<Animation | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiRef = useRef<ReturnType<typeof confetti.create> | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.delivery = "ready";
    document.body.classList.add("delivery-locked");
    window.scrollTo(0, 0);
    if (confettiCanvasRef.current) {
      confettiRef.current = confetti.create(confettiCanvasRef.current, {
        resize: true,
        disableForReducedMotion: true,
      });
    }

    timerRef.current = window.setTimeout(() => setPhase("arrived"), 2100);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (willTimerRef.current) window.clearTimeout(willTimerRef.current);
      if (willExitSoundTimerRef.current) window.clearTimeout(willExitSoundTimerRef.current);
      if (noHitTimerRef.current) window.clearTimeout(noHitTimerRef.current);
      if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
      noAnimationRef.current?.cancel();
      confettiRef.current?.reset();
      delete root.dataset.delivery;
      document.body.classList.remove("delivery-locked");
    };
  }, []);

  const typingComplete = typedLength >= NARRATION.length;

  useEffect(() => {
    if (phase !== "arrived" || typingComplete) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedLength(NARRATION.length);
      return;
    }

    typingTimerRef.current = window.setTimeout(() => {
      const character = NARRATION[typedLength];
      setTypedLength((length) => length + 1);
      if (!/\s/.test(character)) playDecodedSound(SANS_VOICE_SOUND, .22);
    }, TYPE_INTERVAL_MS);

    return () => {
      if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    };
  }, [phase, typedLength, typingComplete]);

  useEffect(() => {
    if (phase === "arrived" && typingComplete && !willActive) {
      yesButtonRef.current?.focus({ preventScroll: true });
    }
  }, [phase, typingComplete, willActive]);

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

    playDecodedSound(YES_TADA_SOUND, .82);
    void confettiRef.current?.({
      particleCount: 86,
      spread: 96,
      startVelocity: 34,
      decay: .91,
      gravity: 1,
      ticks: 52,
      scalar: .84,
      origin: { x: .5, y: .46 },
      colors: NEWSPAPER_CONFETTI_COLORS,
      shapes: ["square", "square", "circle"],
    });
    document.documentElement.dataset.delivery = "opening";
    setPhase("opening");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timerRef.current = window.setTimeout(() => {
      document.documentElement.dataset.delivery = "complete";
      document.body.classList.remove("delivery-locked");
      setPhase("complete");
    }, reducedMotion ? 120 : 900);
  };

  const evadeNo = () => {
    if (phase !== "arrived" || willActive || willDone || noHitLockedRef.current) return;

    const nextAttempt = noAttempts + 1;
    noHitLockedRef.current = true;
    setNoHit(true);
    if (typeof navigator.vibrate === "function") navigator.vibrate(NO_HAPTIC_MS);
    playDecodedSound(NO_DAMAGE_SOUND, .72);
    NO_ATTEMPT_EXTRA_SOUNDS[nextAttempt - 1].forEach(([source, volume]) => {
      playDecodedSound(source, volume);
    });

    noHitTimerRef.current = window.setTimeout(() => {
      setNoHit(false);
      setNoAttempts(nextAttempt);

      if (nextAttempt >= NO_ATTEMPT_LIMIT) {
        noHitLockedRef.current = false;
        setWillActive(true);
        return;
      }

      const stage = stageRef.current;
      if (!stage) {
        noHitLockedRef.current = false;
        return;
      }

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
      noHitLockedRef.current = false;
    }, DAMAGE_FEEDBACK_MS);
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
      aria-label="신문 배달"
      aria-describedby="delivery-narration"
    >
      <div className="delivery-stage" ref={stageRef}>
        <canvas className="delivery-confetti" ref={confettiCanvasRef} aria-hidden="true" />

        <span className="delivery-dog-stage" aria-hidden="true">
          <span className="delivery-dog-sprite" />
        </span>

        {willActive && (
          <span className="will-catcher" aria-hidden="true">
            <img src="/will-smith-original.png" alt="" width="348" height="542" draggable="false" />
          </span>
        )}

        <div className="visual-novel-box">
          <p id="delivery-narration" aria-label={NARRATION}>
            <span aria-hidden="true">
              {NARRATION.slice(0, typedLength)}
              {!typingComplete && <i className="stream-cursor" />}
            </span>
          </p>
          {typingComplete && (
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
                  className={`choice-button choice-no${noHit ? " is-hit" : ""}`}
                  type="button"
                  ref={noButtonRef}
                  aria-label="아니요. 다가가면 도망갑니다"
                  {...noButtonEvents}
                >
                  아니요
                </button>
              )}
            </div>
          )}
        </div>

        {!willDone && noPosition && (
          <button
            className={`choice-button choice-no is-fleeing${noHit ? " is-hit" : ""}${willActive ? " is-captured" : ""}`}
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
