"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useAssetsReady } from "./asset-loader";

const years = Array.from({ length: 12 }, (_, index) => 2015 + index);
const tilts = [-2.4, 1.8, -3.2, .8, -1.4, 2.2, -2.8, 1.2, -.6, 2.9, -1.9, .7];

export default function CenterfoldGallery() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const [activeYear, setActiveYear] = useState(2015);
  const [petted, setPetted] = useState(false);
  const petTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ready = useAssetsReady();

  useLayoutEffect(() => {
    if (!ready) return;
    const journey = journeyRef.current;
    const dog = dogRef.current;
    const path = pathRef.current;
    const trail = trailRef.current;
    if (!journey || !dog || !path || !trail) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let idle: ReturnType<typeof setTimeout>;
    let length = 0;
    let previousX = 0;
    const paws = Array.from(journey.querySelectorAll<SVGTextElement>(".chronicle-paw"));
    const rows = Array.from(journey.querySelectorAll<HTMLElement>(".chronicle-year"));
    const render = () => {
      frame = 0;
      const bounds = journey.getBoundingClientRect();
      const y = Math.max(0, Math.min(journey.offsetHeight, window.innerHeight * .58 - bounds.top));
      let low = 0, high = length;
      for (let i = 0; i < 18; i++) {
        const mid = (low + high) / 2;
        if (path.getPointAtLength(mid).y < y) low = mid;
        else high = mid;
      }
      const distance = (low + high) / 2;
      const point = path.getPointAtLength(distance);
      dog.style.transform = `translate(${point.x}px, ${point.y}px)`;
      dog.style.setProperty("--dog-facing", point.x < previousX ? "-1" : "1");
      previousX = point.x;
      trail.style.strokeDashoffset = String(length - distance);
      paws.forEach((paw, index) => { paw.style.opacity = index / paws.length <= distance / length ? ".6" : "0"; });
      dog.dataset.visible = String(bounds.top < window.innerHeight * .8 && bounds.bottom > 0);
      dog.dataset.side = point.x > journey.clientWidth / 2 ? "left" : "right";
      let closest = 0;
      rows.forEach((row, index) => {
        if (Math.abs(row.offsetTop + row.offsetHeight / 2 - y) < Math.abs(rows[closest].offsetTop + rows[closest].offsetHeight / 2 - y)) closest = index;
      });
      setActiveYear(years[closest]);
    };
    const measure = () => {
      const width = journey.clientWidth;
      const points = rows.map((row, i) => ({ x: width * (i % 2 === 0 ? .82 : .18), y: row.offsetTop + row.offsetHeight * .56 }));
      let d = `M ${width * .7} 0`;
      let previous = {x: width * .7, y: 0};
      for (const point of points) {
        const middle = (previous.y + point.y) / 2;
        d += ` C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
        previous = point;
      }
      d += ` C ${previous.x} ${journey.offsetHeight}, ${width * .5} ${journey.offsetHeight - 80}, ${width * .5} ${journey.offsetHeight - 20}`;
      path.setAttribute("d", d);
      trail.setAttribute("d", d);
      length = path.getTotalLength();
      paws.forEach((paw, index) => {
        const at = length * index / paws.length;
        const p = path.getPointAtLength(at);
        const next = path.getPointAtLength(Math.min(length, at + 4));
        paw.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${Math.atan2(next.y - p.y, next.x - p.x) * 180 / Math.PI + 90})`);
      });
      trail.style.strokeDasharray = String(length);
      render();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render);
      if (!media.matches) dog.dataset.walking = "true";
      clearTimeout(idle);
      idle = setTimeout(() => { dog.dataset.walking = "false"; }, 140);
    };
    const resize = new ResizeObserver(measure);
    resize.observe(journey);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      if (petTimer.current) clearTimeout(petTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [ready]);

  function petDog() {
    setPetted(true);
    if (petTimer.current) clearTimeout(petTimer.current);
    petTimer.current = setTimeout(() => setPetted(false), 1800);
  }

  return (
    <section id="photo-edition" className="chronicle" aria-labelledby="chronicle-title">
      <header className="chronicle-topline"><span>THE WEDDING NEWS · OUR STORY</span><span>PAGE 02</span></header>
      <div className="chronicle-heading"><p>두 사람의 연대기</p><h2 id="chronicle-title">2015—2026</h2><p>열아홉에서 서른까지</p></div>
      <div className="chronicle-rail" aria-hidden="true"><div>{years.map(year => <span key={year} data-current={year === activeYear} data-past={year < activeYear}>{year === activeYear && <b>🐾</b>}{year}</span>)}</div></div>
      <div ref={journeyRef} className="chronicle-journey">
        <svg className="chronicle-route" aria-hidden="true"><path ref={pathRef} className="chronicle-route-base"/><path ref={trailRef} className="chronicle-route-trail"/>{Array.from({length:120}, (_, i) => <text key={i} className="chronicle-paw" textAnchor="middle" dominantBaseline="middle">🐾</text>)}</svg>
        <ol className="chronicle-years">{years.map((year, index) => (
          <li key={year} className="chronicle-year" style={{ "--photo-tilt": `${tilts[index]}deg` } as CSSProperties}>
            <span className="chronicle-year-label">{year}</span>
            <figure><img src={`/history/${year}.jpg`} alt={`${year}년 대표사진 임시 이미지`} width="800" height="1000" loading="lazy"/>{index === 0 && <figcaption>열아홉, 우리의 첫해.</figcaption>}{index === 11 && <figcaption>그리고 지금, 결혼합니다.</figcaption>}</figure>
          </li>
        ))}</ol>
        <button ref={dogRef} className="chronicle-dog" type="button" aria-label="강아지 뚜이 쓰다듬기" onClick={petDog} data-petted={petted}>
          <span className="chronicle-dog-bubble" aria-live="polite">{petted ? "형 누나 최고~! ♥" : activeYear === 2026 ? "우리 이제 가족이야!" : "같이 걸어가요!"}</span>
          <img src="/history/ddui.webp" alt="" width="160" height="160"/>
          {petted && <span className="chronicle-heart" aria-hidden="true">♥</span>}
        </button>
      </div>
      <footer className="chronicle-end"><p>그리고 지금,<br/>결혼합니다.</p><span>2026. 11. 01</span><a href="#details">결혼식 안내 보기 ↓</a></footer>
    </section>
  );
}
