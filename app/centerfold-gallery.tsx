"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, Observer, ScrollTrigger } from "gsap/all";

const GALLERY_STOPS = [.14, .5, .86] as const;

export default function CenterfoldGallery() {
  const stageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    gsap.registerPlugin(Observer, ScrollTrigger);

    const book = stage.querySelector<HTMLElement>(".centerfold-book");
    const spreads = [...stage.querySelectorAll<HTMLElement>(".centerfold-spread")];
    const progress = stage.querySelector<HTMLElement>(".centerfold-progress");
    const frame = stage.querySelector<HTMLElement>("[data-centerfold-frame]");
    const cueText = stage.querySelector<HTMLElement>("[data-centerfold-cue]");
    const cueStep = stage.querySelector<HTMLElement>("[data-centerfold-step]");
    if (!book || !progress || !frame || !cueText || !cueStep) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchDevice = Boolean(ScrollTrigger.isTouch);
    const stepDuration = touchDevice ? .92 : 1.08;
    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

    let currentProgress = 0;
    let step = 0;
    let locked = false;
    let exiting = false;
    let gestureLatched = false;
    let savedScroll = 0;
    let gateTween: gsap.core.Timeline | undefined;
    let unlockCall: gsap.core.Tween | undefined;
    let intentObserver: ReturnType<typeof Observer.create> | undefined;
    let scrollObserver: ReturnType<typeof Observer.create> | undefined;
    let gateTrigger: ScrollTrigger | undefined;

    function render(nextProgress: number) {
      currentProgress = nextProgress;
      gsap.set(progress, { scaleX: nextProgress });
      gsap.set(book, {
        rotateX: mix(8, 0, clamp(nextProgress / .12)),
        scale: mix(.86, 1, clamp(nextProgress / .12)),
      });

      const spreadPosition = nextProgress * 2.999;
      const current = Math.min(2, Math.floor(spreadPosition));
      const local = spreadPosition - current;
      frame.textContent = String(current + 1).padStart(2, "0");

      spreads.forEach((spread, index) => {
        const leaves = spread.querySelectorAll<HTMLElement>(".centerfold-leaf");
        const incoming = clamp(local / .18);
        const outgoing = clamp((local - .72) / .28);
        gsap.set(spread, { autoAlpha: index === current ? 1 : 0, zIndex: index + 2 });
        gsap.set(leaves[0], {
          rotateY: index === current
            ? current === 0
              ? mix(56, 0, clamp(nextProgress / .12))
              : mix(72, 0, incoming)
            : 0,
        });
        gsap.set(leaves[1], {
          rotateY: index === current && current < 2 ? mix(0, -76, outgoing) : 0,
        });
      });
    }

    function updateCue() {
      cueStep.textContent = `${String(step + 1).padStart(2, "0")} / 03`;
      cueText.textContent = step === GALLERY_STOPS.length - 1
        ? "SCROLL ON TO PAGE 03"
        : "SCROLL TO TURN THE PAGE";
      stage.dataset.galleryStep = String(step);
      stage.dataset.galleryLocked = String(locked);
    }

    function deactivateInput() {
      intentObserver?.disable();
      scrollObserver?.disable();
      gestureLatched = false;
      stage.dataset.galleryActive = "false";
      document.documentElement.classList.remove("centerfold-locked");
      document.body.classList.remove("centerfold-locked");
    }

    function enableInput(trigger = gateTrigger) {
      if (!trigger?.isActive) return;
      scrollObserver?.enable();
      intentObserver?.enable();
      stage.dataset.galleryActive = "true";
      document.documentElement.classList.add("centerfold-locked");
      document.body.classList.add("centerfold-locked");
    }

    function goToStep(index: number, options: { force?: boolean; instant?: boolean; settle?: number; velocity?: number } = {}) {
      const { force = false, instant = false, settle = 0, velocity = 0 } = options;
      if (!gateTrigger || (locked && !force)) return;

      gateTween?.kill();
      unlockCall?.kill();
      step = clamp(index, 0, GALLERY_STOPS.length - 1);
      locked = true;
      updateCue();

      const target = GALLERY_STOPS[step];
      const unlock = () => {
        locked = false;
        updateCue();
      };
      const finish = () => {
        if (settle) unlockCall = gsap.delayedCall(settle, unlock);
        else unlock();
      };

      if (instant || Math.abs(target - currentProgress) < .001) {
        render(target);
        finish();
        return;
      }

      const direction = Math.sign(target - currentProgress) || 1;
      const speed = clamp(Math.abs(velocity) / 2400);
      const duration = mix(stepDuration, stepDuration * .88, speed);
      const overshoot = clamp(target + direction * mix(.006, .014, speed));
      const state = { progress: currentProgress };

      gateTween = gsap.timeline({ onComplete: finish })
        .to(state, {
          progress: overshoot,
          duration: duration * .84,
          ease: "power2.inOut",
          onUpdate: () => render(state.progress),
        })
        .to(state, {
          progress: target,
          duration: duration * .16,
          ease: "sine.out",
          onUpdate: () => render(state.progress),
        });
    }

    function leaveGallery(direction: number) {
      if (!gateTrigger || locked) return;
      locked = true;
      exiting = true;
      updateCue();
      deactivateInput();

      // 핀 경계 바로 바깥으로 옮겨 다음 입력부터 기본 스크롤을 이어간다.
      gateTrigger.scroll(direction > 0
        ? gateTrigger.end + 1
        : Math.max(0, gateTrigger.start - 1));

      locked = false;
      exiting = false;
      updateCue();
    }

    function next(input?: ReturnType<typeof Observer.create>) {
      if (locked) return;
      if (step < GALLERY_STOPS.length - 1) goToStep(step + 1, { velocity: input?.velocityY || 0 });
      else leaveGallery(1);
    }

    function previous(input?: ReturnType<typeof Observer.create>) {
      if (locked) return;
      if (step > 0) goToStep(step - 1, { velocity: input?.velocityY || 0 });
      else leaveGallery(-1);
    }

    function consumeIntent(direction: number, input: ReturnType<typeof Observer.create>) {
      if (gestureLatched) return;
      gestureLatched = true;
      if (direction > 0) next(input);
      else previous(input);
    }

    render(reducedMotion ? .5 : 0);
    updateCue();
    if (reducedMotion) return;

    scrollObserver = Observer.create({
      target: window,
      type: "wheel,scroll",
      preventDefault: true,
      allowClicks: true,
      onEnable: (self) => { savedScroll = self.scrollY(); },
      onChangeY: (self) => self.scrollY(savedScroll),
    });
    scrollObserver.disable();

    intentObserver = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: touchDevice ? 46 : 36,
      dragMinimum: 12,
      lockAxis: true,
      preventDefault: true,
      allowClicks: true,
      onUp: (self) => consumeIntent(1, self),
      onDown: (self) => consumeIntent(-1, self),
      onStop: () => { gestureLatched = false; },
      onStopDelay: touchDevice ? .26 : .2,
    });
    intentObserver.disable();

    gateTrigger = ScrollTrigger.create({
      trigger: stage,
      pin: true,
      start: "top top",
      end: () => `+=${window.innerHeight * (touchDevice ? 5.2 : 6.2)}`,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: (self) => {
        if (exiting) return;
        self.scroll(self.start + 1);
        step = 0;
        enableInput(self);
        const settled = Math.abs(currentProgress - GALLERY_STOPS[0]) < .002;
        goToStep(0, { force: true, instant: settled, settle: settled ? (touchDevice ? .48 : .36) : 0 });
      },
      onEnterBack: (self) => {
        if (exiting) return;
        self.scroll(self.end - 1);
        step = GALLERY_STOPS.length - 1;
        enableInput(self);
        const settled = Math.abs(currentProgress - GALLERY_STOPS[step]) < .002;
        goToStep(step, { force: true, instant: settled, settle: settled ? (touchDevice ? .48 : .36) : 0 });
      },
      onLeave: deactivateInput,
      onLeaveBack: deactivateInput,
    });

    const handleKeydown = (event: KeyboardEvent) => {
      if (!gateTrigger?.isActive) return;
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        previous();
      }
    };
    window.addEventListener("keydown", handleKeydown);

    const deliveryObserver = new MutationObserver(() => {
      if (document.documentElement.dataset.delivery === "complete") ScrollTrigger.refresh();
    });
    deliveryObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-delivery"] });
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      deliveryObserver.disconnect();
      window.removeEventListener("keydown", handleKeydown);
      deactivateInput();
      gateTween?.kill();
      unlockCall?.kill();
      gateTrigger?.kill();
      intentObserver?.kill();
      scrollObserver?.kill();
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className="centerfold-stage"
      id="photo-edition"
      aria-label="02면 웨딩 화보"
      data-gallery-active="false"
    >
      <div className="centerfold-shell">
        <header className="centerfold-header">
          <span>THE WEDDING NEWS · PHOTO EDITION</span>
          <span><b data-centerfold-frame>01</b> / 03 · PAGE 02</span>
        </header>
        <div className="centerfold-shadow" aria-hidden="true" />
        <div className="centerfold-book">
          <article className="centerfold-spread">
            <div className="centerfold-leaf">
              <div className="centerfold-grid centerfold-lead-grid">
                <div className="centerfold-section-bar"><b>The Wedding News</b><span>Special Photo Edition</span></div>
                <h2 className="centerfold-headline">둘의<br />가장 좋은<br />장면들</h2>
                <p className="centerfold-deck">열 해를 함께한 두 사람이 가장 좋아하는 사진을 한 면에 모았습니다.</p>
                <div className="centerfold-column-copy">
                  <figure className="centerfold-photo"><img src="/couple-sample.webp" alt="빛 속에서 부케를 든 모습" width="800" height="1200" /><figcaption>사진부가 먼저 고른 빛과 꽃의 장면.</figcaption></figure>
                  <div className="centerfold-brief-copy"><p>잘 나온 한 장보다 두 사람이 함께 웃는 순간을 먼저 골랐습니다. 이 지면의 주인공은 포즈가 아니라 둘 사이의 표정입니다.</p><p>가로와 세로, 가까운 장면과 넓은 장면을 섞었습니다. 넘길 때마다 사진의 호흡이 달라집니다.</p></div>
                </div>
                <div className="centerfold-byline"><b>Photo Desk</b><span>Han × Na Kyoung</span></div>
              </div>
              <span className="centerfold-page-no">02—A</span>
            </div>
            <div className="centerfold-leaf">
              <div className="centerfold-grid centerfold-hero-grid">
                <div className="centerfold-section-bar"><b>Lead Photograph</b><span>Frame 01 / 11</span></div>
                <figure className="centerfold-photo centerfold-lead-photo"><img src="/couple-main.webp" alt="창가에 함께 앉은 한원영과 이나경" width="1200" height="1800" /><figcaption>창가에서, 가장 익숙한 거리로 나란히.</figcaption></figure>
                <div className="centerfold-story-line"><h3>열 해를 지나,<br />오늘의 두 사람</h3><p>크게 남기고 싶은 건 꾸민 표정보다 서로를 바라보던 짧은 순간이었습니다.</p></div>
                <div className="centerfold-byline"><b>Selected 01</b><span>Wedding Portrait</span></div>
              </div>
              <span className="centerfold-page-no">02—B</span>
            </div>
          </article>

          <article className="centerfold-spread">
            <div className="centerfold-leaf">
              <div className="centerfold-grid centerfold-contact-grid">
                <div className="centerfold-section-bar"><b>Portraits</b><span>Selected 02—03</span></div>
                <h2 className="centerfold-section-title">웃는 쪽을<br />크게 쓰기로 했다</h2>
                <div className="centerfold-photo-pair">
                  <figure className="centerfold-photo crop-left"><img src="/couple-main.webp" alt="한원영의 모습" width="1200" height="1800" /><figcaption>02 · 기다리다 먼저 웃은 사람</figcaption></figure>
                  <figure className="centerfold-photo crop-right"><img src="/couple-main.webp" alt="이나경의 모습" width="1200" height="1800" /><figcaption>03 · 그 웃음을 보고 따라 웃은 사람</figcaption></figure>
                </div>
                <div className="centerfold-byline"><b>Close-up</b><span>Two Portraits</span></div>
              </div>
              <span className="centerfold-page-no">02—C</span>
            </div>
            <div className="centerfold-leaf">
              <div className="centerfold-grid centerfold-contact-grid">
                <div className="centerfold-section-bar"><b>Contact Sheet</b><span>Selected 04—06</span></div>
                <p className="centerfold-news-note">사진부 기록 — 큰 장면 하나와 짧은 표정 둘을 같은 면에 놓았습니다.</p>
                <div className="centerfold-photo-rail">
                  <figure className="centerfold-photo"><img src="/couple-sample.webp" alt="부케를 든 이나경" width="800" height="1200" /><figcaption>04 · 빛이 머문 자리</figcaption></figure>
                  <figure className="centerfold-photo crop-right"><img src="/couple-main.webp" alt="이나경의 모습" width="1200" height="1800" /><figcaption>05 · 한쪽을 바라보다</figcaption></figure>
                  <figure className="centerfold-photo crop-left"><img src="/couple-main.webp" alt="한원영의 모습" width="1200" height="1800" /><figcaption>06 · 같은 쪽을 바라보다</figcaption></figure>
                </div>
                <div className="centerfold-byline"><b>Photo Sequence</b><span>04 / 05 / 06</span></div>
              </div>
              <span className="centerfold-page-no">02—D</span>
            </div>
          </article>

          <article className="centerfold-spread">
            <div className="centerfold-leaf">
              <div className="centerfold-grid centerfold-contact-grid">
                <div className="centerfold-section-bar"><b>Picture Story</b><span>Selected 07—09</span></div>
                <h2 className="centerfold-section-title">빛이 머문<br />순서대로</h2>
                <div className="centerfold-photo-rail">
                  <figure className="centerfold-photo crop-low"><img src="/couple-main.webp" alt="한원영과 이나경의 웨딩 화보" width="1200" height="1800" /><figcaption>07 · 나란히 앉은 오후</figcaption></figure>
                  <figure className="centerfold-photo"><img src="/couple-sample.webp" alt="부케 화보" width="800" height="1200" /><figcaption>08 · 꽃을 건네기 전</figcaption></figure>
                  <figure className="centerfold-photo crop-left"><img src="/couple-main.webp" alt="한원영의 모습" width="1200" height="1800" /><figcaption>09 · 오래 볼 한 장</figcaption></figure>
                </div>
                <div className="centerfold-byline"><b>Sequence</b><span>07 / 08 / 09</span></div>
              </div>
              <span className="centerfold-page-no">02—E</span>
            </div>
            <div className="centerfold-leaf">
              <div className="centerfold-grid centerfold-closing-grid">
                <div className="centerfold-section-bar"><b>Last Frame</b><span>Selected 10 / 11</span></div>
                <h2 className="centerfold-headline">그리고,<br />오늘.</h2>
                <figure className="centerfold-photo centerfold-final-photo"><img src="/couple-main.webp" alt="결혼을 앞둔 한원영과 이나경" width="1200" height="1800" /><figcaption>10 · 다음 면에서 두 사람의 10년 기록이 이어집니다.</figcaption></figure>
                <p className="centerfold-deck">사진으로 먼저 전한 두 사람의 결혼 소식.</p>
                <div className="centerfold-byline"><b>Continued</b><span>Page 03</span></div>
              </div>
              <span className="centerfold-page-no">02—F</span>
            </div>
          </article>
        </div>
        <div className="centerfold-cue" aria-live="polite"><span data-centerfold-cue>SCROLL TO TURN THE PAGE</span><b data-centerfold-step>01 / 03</b></div>
        <div className="centerfold-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
