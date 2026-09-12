"use client";

import { useEffect, useRef, useState } from "react";

const years = Array.from({ length: 12 }, (_, i) => 2015 + i);

export default function CenterfoldGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dogRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(2015);
  const [petted, setPetted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rows = Array.from(section.querySelectorAll<HTMLElement>(".chronicle-year"));
    const journey = journeyRef.current;
    const path = pathRef.current;
    const dog = dogRef.current;
    if (!journey || !path || !dog) return;
    let length = 0;
    const paws = Array.from(journey.querySelectorAll<SVGTextElement>(".chronicle-stream-paw"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const center = window.innerHeight * .45;
      const closest = rows.reduce((best, row) => {
        const distance = (item: HTMLElement) => {
          const r = item.getBoundingClientRect();
          return Math.abs((r.top + r.bottom) / 2 - center);
        };
        return distance(row) < distance(best) ? row : best;
      }, rows[0]);
      setActive(Number(closest.dataset.year));
      const rect = journey.getBoundingClientRect();
      const y = Math.max(0, Math.min(journey.offsetHeight - 28, center - rect.top));
      let low = 0, high = length;
      for (let i = 0; i < 16; i++) {
        const mid = (low + high) / 2;
        if (path.getPointAtLength(mid).y < y) low = mid;
        else high = mid;
      }
      const distance = (low + high) / 2;
      const point = path.getPointAtLength(distance);
      dog.style.transform = `translate(${point.x - 24}px, ${point.y}px)`;
      paws.forEach((paw, i) => { paw.style.opacity = distance >= length * i / paws.length ? ".55" : ".12"; });

    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule, { rootMargin: "-20% 0px -20% 0px", threshold: [0, .25, .5, .75, 1] });
    rows.forEach(row => observer.observe(row));
    const measure = () => {
      const height = journey.offsetHeight;
      let d = "M 24 28";
      let previous = { x:24, y:28 };
      rows.forEach((row, i) => {
        const point = { x:i % 2 === 0 ? 12 : 36, y:row.offsetTop + row.offsetHeight / 2 };
        const middle = (previous.y + point.y) / 2;
        d += ` C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
        previous = point;
      });
      d += ` C ${previous.x} ${height - 50}, 24 ${height - 50}, 24 ${height - 28}`;
      path.setAttribute("d", d);
      length = path.getTotalLength();
      paws.forEach((paw, i) => {
        const point = path.getPointAtLength(length * i / paws.length);
        paw.setAttribute("x", String(point.x));
        paw.setAttribute("y", String(point.y));
      });
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(journey);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    update();
    return () => {
      observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => { setPetted(false); }, [active]);
  const pet = () => {
    setPetted(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPetted(false), 1800);
  };

  return (
    <section ref={sectionRef} id="photo-edition" className="chronicle" aria-labelledby="chronicle-title">
      <header className="chronicle-topline"><span>THE WEDDING NEWS</span><span>OUR STORY · 02</span></header>
      <div className="chronicle-heading"><h2 id="chronicle-title">열아홉에서<br/>서른까지</h2><p>2015—2026</p></div>
      <div className="chronicle-current" aria-hidden="true"><span>지금 펼친 기록</span><b>{active}</b></div>
      <div ref={journeyRef} className="chronicle-journey">
      <svg className="chronicle-stream" aria-hidden="true"><path ref={pathRef}/>{Array.from({length:80}, (_, i) => <text key={i} className="chronicle-stream-paw" textAnchor="middle" dominantBaseline="middle">🐾</text>)}</svg>
      <ol className="chronicle-years">{years.map((year, index) => (
        <li key={year} className="chronicle-year" data-year={year} data-active={year === active} data-past={year < active} data-featured={index === 0 || index === 5 || index === 11}>
          <div className="chronicle-year-label"><h3>{year}{index === 0 ? <small> / 첫해</small> : index === 11 ? <small> / 오늘</small> : null}</h3><span>기록 {String(index + 1).padStart(2, "0")}</span></div>
          <figure>
            <img src={`/history/${year}.jpg`} alt={`${year}년 기록에 담은 두 사람의 사진`} width={year === 2020 || year === 2023 ? 1600 : 1066} height={year === 2020 || year === 2023 ? 1066 : 1600} loading="lazy"/>
            {(index === 0 || index === 11) && <figcaption>{index === 0 ? "열아홉, 우리의 첫해." : "함께한 날들 위에, 새로운 시작."}</figcaption>}
          </figure>

        </li>
      ))}</ol>
      <button ref={dogRef} className="chronicle-dog" onClick={pet} aria-label="뚜이 쓰다듬기" type="button" data-petted={petted}>
        <img src="/history/ddui.webp" alt="" width="480" height="480"/>
        {petted && <span className="chronicle-dog-bubble" role="status">형 누나 최고! ♥</span>}
      </button>
      </div>
      <footer className="chronicle-end"><span>OUR NEXT CHAPTER</span><p>그리고 지금,<br/>결혼합니다.</p><a href="#details">결혼식 안내 보기 ↓</a></footer>
    </section>
  );
}
