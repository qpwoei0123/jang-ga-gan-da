"use client";

import { useEffect, useRef } from "react";

const FRAME_INTERVAL_MS = 1000 / 24;
const DAPPLES = [
  [0.08, 0.14, 0.22, 0.09, 0.72, 0.1],
  [0.29, 0.29, 0.16, 0.07, 0.94, 1.4],
  [0.74, 0.18, 0.24, 0.1, 0.66, 2.7],
  [0.91, 0.45, 0.18, 0.08, 0.83, 4.2],
  [0.16, 0.68, 0.27, 0.11, 0.58, 5.1],
  [0.68, 0.79, 0.2, 0.09, 0.78, 3.5],
] as const;

type ColorStop = readonly [offset: number, color: string];

function fillSoftOval(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  stops: readonly ColorStop[],
) {
  context.save();
  context.translate(x, y);
  context.scale(radiusX, radiusY);

  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  context.fillStyle = gradient;
  context.fillRect(-1, -1, 2, 2);
  context.restore();
}

export default function OutdoorSunlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let lastFrame = 0;
    let active = root.dataset.delivery === "complete";
    let reducedMotion = motionPreference.matches;

    function draw(time: number) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.round(width * pixelRatio);
      const pixelHeight = Math.round(height * pixelRatio);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const drift = reducedMotion ? 0.8 : time * 0.000045;
      const sunlightX = width * (0.34 + Math.sin(drift * 0.62) * 0.08);
      const sunlightY = height * (0.2 + Math.cos(drift * 0.48) * 0.05);

      fillSoftOval(context, sunlightX, sunlightY, width * 0.78, height * 0.58, [
        [0, "rgba(255, 248, 219, .32)"],
        [0.36, "rgba(255, 244, 207, .18)"],
        [1, "rgba(255, 247, 223, 0)"],
      ]);

      fillSoftOval(context, width * 0.88, height * 0.08, width * 0.42, height * 0.34, [
        [0, "rgba(255, 252, 235, .2)"],
        [1, "rgba(255, 252, 235, 0)"],
      ]);

      DAPPLES.forEach(([baseX, baseY, sizeX, sizeY, speed, phase]) => {
        const x = width * (baseX + Math.sin(drift * speed + phase) * 0.025);
        const y = height * (baseY + Math.cos(drift * speed * 0.74 + phase) * 0.018);

        fillSoftOval(context, x, y, width * sizeX, height * sizeY, [
          [0, "rgba(67, 78, 53, .075)"],
          [0.58, "rgba(72, 82, 58, .048)"],
          [1, "rgba(72, 82, 58, 0)"],
        ]);
      });
    }

    function stop() {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    function animate(time: number) {
      animationFrame = 0;
      if (!active || document.visibilityState === "hidden" || reducedMotion) return;

      if (time - lastFrame >= FRAME_INTERVAL_MS) {
        draw(time);
        lastFrame = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    }

    function start() {
      if (!active || document.visibilityState === "hidden") return;
      draw(performance.now());
      if (!reducedMotion && !animationFrame) animationFrame = window.requestAnimationFrame(animate);
    }

    function syncDeliveryState() {
      active = root.dataset.delivery === "complete";
      if (active) start();
      else {
        stop();
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "hidden") stop();
      else start();
    }

    function handleMotionPreference(event: MediaQueryListEvent) {
      reducedMotion = event.matches;
      stop();
      start();
    }

    const observer = new MutationObserver(syncDeliveryState);
    observer.observe(root, { attributes: true, attributeFilter: ["data-delivery"] });
    window.addEventListener("resize", start);
    document.addEventListener("visibilitychange", handleVisibility);
    motionPreference.addEventListener("change", handleMotionPreference);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", start);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionPreference.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="outdoor-sunlight" aria-hidden="true" />;
}
