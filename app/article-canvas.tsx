"use client";

import { useEffect, useRef } from "react";

const W = 346;
const layouts = {
  reaction: {
    height: 360,
    label: "BRIDE & GROOM / 단독 소감",
    title: ["GD와 결혼하지 못한", "신부의 한탄"],
    blocks: [
      { x: 174, y: 158, lines: ["신부 이나경은 GD와의 결혼이", "무산돼 유감을 표했다.", "“어쩌다 식장까지", "잡았다”는 신부는 말끝마다", "웃음을 참지 못했다."] },
      { x: 0, y: 320, lines: ["신랑은 “그걸 왜 청첩장에 쓰냐”며 어이없어했다."] },
    ],
  },
  history: {
    height: 400,
    label: "HISTORY / 역사 · 단독 보도",
    title: ["“전생에도 부부였다”"],
    blocks: [
      { x: 176, y: 122, lines: ["국립중앙말티푸박물관이", "오래된 혼인 사진 한 장을", "새로 공개했다."] },
      { x: 176, y: 203, lines: ["박물관 측은 “어디선가", "본 듯한 수상한 부부다.", "전생에도 키 차이는", "어쩔 수 없나 보다ㅋ”라고", "밝혔다."] },
      { x: 176, y: 320, lines: ["정확한 감정을 하려 했으나", "괴도 강아지가 사진을 물고", "달아나 조사가 중단됐다."] },
    ],
  },
};

export default function ArticleCanvas({ kind, photoSrc }: { kind: keyof typeof layouts; photoSrc?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const layout = layouts[kind];
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    const photo = photoSrc ? new Image() : null;
    const photoReady = photo ? new Promise<void>((resolve) => {
      photo.onload = () => resolve();
      photo.onerror = () => resolve();
      photo.src = photoSrc!;
    }) : Promise.resolve();
    function draw() {
      if (disposed || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.ceil(W * ratio);
      canvas.height = Math.ceil(layout.height * ratio);
      ctx.scale(ratio, ratio);
      const style = getComputedStyle(canvas);
      const token = (name: string) => style.getPropertyValue(name).trim();
      const number = (name: string) => Number(token(name));
      const serif = token("--text");
      const text = (lines: string[], x: number, y: number, size: number, step: number, sans = false, color = token("--ink")) => {
        ctx.fillStyle = color;
        ctx.font = `${sans ? 700 : 400} ${size}px ${sans ? token("--sans") : serif}`;
        ctx.textBaseline = "top";
        lines.forEach((line, i) => ctx.fillText(line, x, y + i * step));
      };
      const rule = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.strokeStyle = token("--rule-color"); ctx.lineWidth = number("--rule-width");
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      };
      rule(0, 1, W, 1);
      text([layout.label], 0, 20, number("--type-caption"), 12, true);
      text(layout.title, 0, 44, number("--type-title"), 35);
      layout.blocks.forEach(block => text(block.lines, block.x, block.y, number("--type-body"), number("--leading-body")));
      if (kind === "reaction") {
        text(["어이없어하는 남편의 소감"], 1, 122, 11, 16, true, token("--muted"));
        text(["“딱 하나", "아쉬운 건,", "GD랑 결혼은", "꿈도 못 꾼다는", "것.”"], 0, 158, 18, 23);
        rule(0, 291, 28, 291);
        text(["신부 이나경"], 37, 285, 9, 12, true, token("--muted"));
        rule(158, 158, 158, 297);
        rule(0, 311, W, 311);
      } else {
        text(["국립중앙말티푸박물관서 혼인 사료 발견"], 0, 86, 11, 16, true, token("--muted"));
        if (photo?.naturalWidth) {
          ctx.save(); ctx.filter = "grayscale(1) contrast(1.08)";
          const cropHeight = photo.naturalWidth * 1.5;
          ctx.drawImage(photo, 0, Math.max(0, (photo.naturalHeight - cropHeight) / 2), photo.naturalWidth, Math.min(cropHeight, photo.naturalHeight), 0, 122, 150, 225);
          ctx.restore();
        }
        rule(163, 122, 163, 328);
        text(["국립중앙말티푸박물관 소장", "촬영 연도 미상"], 0, 354, 8, 12, true, token("--muted"));
      }
    }
    Promise.all([document.fonts.load('400 28px "MaruBuri"'), photoReady]).then(draw, draw);
    let viewportWidth = window.innerWidth;
    let pixelRatio = window.devicePixelRatio;
    const onResize = () => {
      const nextWidth = window.innerWidth;
      const nextRatio = window.devicePixelRatio;
      if (nextWidth === viewportWidth && nextRatio === pixelRatio) return;
      viewportWidth = nextWidth;
      pixelRatio = nextRatio;
      draw();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("edition-font-change", draw);
    return () => { disposed = true; window.removeEventListener("resize", onResize); window.removeEventListener("edition-font-change", draw); };
  }, [kind, layout, photoSrc]);
  return <article id={kind === "history" ? "history-report" : undefined} className="canvas-article" data-ddui-tip={kind === "history" ? "앗, 그 사진 물고 간 학예견… 저 아니에요!" : "GD 말고 우리 형도 꽤 괜찮아요~"}>
    <canvas ref={ref} width={W} height={layout.height} role="img" aria-label={[layout.label, ...layout.title, ...(kind === "reaction" ? ["딱 하나 아쉬운 건, GD랑 결혼은 꿈도 못 꾼다는 것. 신부 이나경. 어이없어하는 남편의 소감"] : []), ...layout.blocks.flatMap(block => block.lines)].join(" ")} style={{ display: "block", width: "100%", height: "auto" }} />
  </article>;
}
