"use client";

import { useEffect, useRef, useState } from "react";

const years = Array.from({ length: 12 }, (_, i) => 2015 + i);

export default function CenterfoldGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(2015);
  const [petted, setPetted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rows = Array.from(section.querySelectorAll<HTMLElement>(".chronicle-year"));
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
      const gap = closest.querySelector<HTMLElement>(".chronicle-gap");
      if (gap) {
        const rect = gap.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * .8)));
        gap.style.setProperty("--walk", String(progress));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule, { rootMargin: "-20% 0px -20% 0px", threshold: [0, .25, .5, .75, 1] });
    rows.forEach(row => observer.observe(row));
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
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
      <ol className="chronicle-years">{years.map((year, index) => (
        <li key={year} className="chronicle-year" data-year={year} data-active={year === active} data-past={year < active} data-featured={index === 0 || index === 5 || index === 11}>
          <div className="chronicle-year-label"><h3>{year}{index === 0 ? <small> / 첫해</small> : index === 11 ? <small> / 오늘</small> : null}</h3><span>기록 {String(index + 1).padStart(2, "0")}</span></div>
          <figure>
            <img src={`/history/${year}.jpg`} alt={`${year}년 기록에 담은 두 사람의 사진`} width={year === 2020 || year === 2023 ? 1600 : 1066} height={year === 2020 || year === 2023 ? 1066 : 1600} loading="lazy"/>
            {(index === 0 || index === 11) && <figcaption>{index === 0 ? "열아홉, 우리의 첫해." : "함께한 날들 위에, 새로운 시작."}</figcaption>}
          </figure>
          <div className="chronicle-gap">
            <svg viewBox="0 0 200 36" aria-hidden="true"><path d="M 12 23 Q 55 4 98 22 T 188 14"/><text x="30" y="24">🐾</text><text x="87" y="24">🐾</text><text x="147" y="24">🐾</text></svg>
            <span className="chronicle-stamp" aria-hidden="true">🐾</span>
            {year === active && <button className="chronicle-dog" onClick={pet} aria-label="뚜이 쓰다듬기" type="button" data-petted={petted}>
              <img src="/history/ddui.webp" alt="" width="480" height="480"/>
              {petted && <span className="chronicle-dog-bubble" role="status">형 누나 최고! ♥</span>}
            </button>}
          </div>
        </li>
      ))}</ol>
      <footer className="chronicle-end"><span>OUR NEXT CHAPTER</span><p>그리고 지금,<br/>결혼합니다.</p><a href="#details">결혼식 안내 보기 ↓</a></footer>
    </section>
  );
}
