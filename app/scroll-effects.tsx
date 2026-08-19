"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-parallax]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.dataset.motion = "ready";

    let frame = 0;
    const updateParallax = () => {
      const scrollY = window.scrollY;
      const viewportCenter = window.innerHeight / 2;

      // 신문은 페이지가 나타나는 대신, 스크롤할 때 인쇄 띠와 종이 결이 함께 움직인다.
      root.style.setProperty("--paper-shift-x", `${((scrollY * -0.04) % 6).toFixed(2)}px`);
      root.style.setProperty("--paper-shift-y", `${((scrollY * 0.025) % 5).toFixed(2)}px`);
      root.style.setProperty("--ticker-shift", `${(((scrollY * 0.16) % 48) - 24).toFixed(2)}px`);
      root.style.setProperty("--folio-shift", `${(Math.sin(scrollY / 260) * 2.25).toFixed(2)}px`);
      root.style.setProperty("--stamp-rotate", `${(Math.sin(scrollY / 180) * 1.3).toFixed(2)}deg`);

      parallaxTargets.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const distance = (viewportCenter - (bounds.top + bounds.height / 2)) / window.innerHeight;
        const shift = reducedMotion ? 0 : Math.max(-1, Math.min(1, distance)) * 7;
        element.style.setProperty("--scroll-shift", `${shift.toFixed(2)}px`);
      });
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
