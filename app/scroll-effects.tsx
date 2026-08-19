"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.dataset.motion = "ready";

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => { element.dataset.revealed = "true"; });
      return () => { delete root.dataset.motion; };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.revealed = "true";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10%" });

    revealTargets.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 180)}ms`);
      observer.observe(element);
    });

    let frame = 0;
    const updateParallax = () => {
      const viewportCenter = window.innerHeight / 2;
      parallaxTargets.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const distance = (viewportCenter - (bounds.top + bounds.height / 2)) / window.innerHeight;
        const shift = Math.max(-1, Math.min(1, distance)) * 7;
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
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
