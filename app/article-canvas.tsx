"use client";

import { useEffect, useRef } from "react";

const W = 346;
const layouts = {
  reaction: {
    height: 258,
    label: "BRIDE & GROOM / 단독 소감",
    title: ["GD와 결혼하지 못한 신부의 한탄,", "어이없어하는 남편의 소감"],
    blocks: [
      { x: 0, y: 100, lines: ["신부 이나경은 GD와의", "결혼이 무산돼 “계획에", "없던 결과라 유감”이라고", "밝혔다."] },
      { x: 184, y: 100, lines: ["“어쩌다 한원영과 식장까지", "잡았다”는 신부는", "말끝마다 웃음을", "참지 못했다."] },
      { x: 0, y: 212, lines: ["신랑은 “그걸 왜 청첩장에 쓰냐”며 어이없어했다.", "결혼식은 예정대로 진행된다."] },
    ],
  },
  history: {
    height: 355,
    label: "HISTORY / 역사 · 단독 보도",
    title: ["“전생에도 부부였다”"],
    blocks: [
      { x: 166, y: 112, lines: ["국립중앙말티푸박물관의 옛", "혼인 사진에서 두 사람과", "닮은 부부가 발견됐다."] },
      { x: 166, y: 193, lines: ["박물관 측은 “모자 없는 신랑,", "전생에도 안 어울렸던 듯”", "이라고 밝혔다."] },
      { x: 166, y: 274, lines: ["학예견이 사진을 물고 달아나", "연도 감정은 중단됐다."] },
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
      const serif = getComputedStyle(canvas).getPropertyValue("--text");
      const text = (lines: string[], x: number, y: number, size: number, step: number, sans = false, color = "#171716") => {
        ctx.fillStyle = color;
        ctx.font = `${sans ? 700 : 400} ${size}px ${sans ? 'Arial, sans-serif' : serif}`;
        ctx.textBaseline = "top";
        lines.forEach((line, i) => ctx.fillText(line, x, y + i * step));
      };
      const rule = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.strokeStyle = "#85847f"; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      };
      rule(0, 1, W, 1);
      text([layout.label], 0, 20, 9, 12, true);
      text(layout.title, 0, 46, 21, 28);
      layout.blocks.forEach(block => text(block.lines, block.x, block.y, 12, 23));
      if (kind === "reaction") {
        rule(173, 100, 173, 188);
        rule(0, 201, W, 201);
      } else {
        text(["국립중앙말티푸박물관서 혼인 사료 발견"], 0, 81, 11, 16, true, "#686762");
        if (photo?.naturalWidth) {
          ctx.save(); ctx.filter = "grayscale(1) contrast(1.08)";
          const cropHeight = photo.naturalWidth * 1.5;
          ctx.drawImage(photo, 0, Math.max(0, (photo.naturalHeight - cropHeight) / 2), photo.naturalWidth, Math.min(cropHeight, photo.naturalHeight), 0, 112, 140, 210);
          ctx.restore();
        }
        rule(153, 112, 153, 322);
        text(["국립중앙말티푸박물관 소장", "촬영 연도 미상"], 0, 329, 8, 12, true, "#686762");
      }
    }
    Promise.all([document.fonts.ready, photoReady]).then(draw);
    window.addEventListener("resize", draw);
    return () => { disposed = true; window.removeEventListener("resize", draw); };
  }, [kind, layout, photoSrc]);
  return <article id={kind === "history" ? "history-report" : undefined} className="canvas-article">
    <canvas ref={ref} width={W} height={layout.height} role="img" aria-label={[layout.label, ...layout.title, ...layout.blocks.flatMap(block => block.lines)].join(" ")} style={{ display: "block", width: "100%", height: "auto" }} />
  </article>;
}
