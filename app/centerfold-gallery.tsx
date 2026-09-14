"use client";

import { useEffect, useRef, useState } from "react";

const years = Array.from({ length: 12 }, (_, i) => 2015 + i);

// A–Z: each turn is authored explicitly. Resizing only scales this artwork;
// no wave, random walk, or procedural curve determines the route.
const ROUTE = [
  "M 34 0 C 34 24 62 14 62 42 C 62 78 16 65 24 100", // A: dash right
  "C 28 122 8 128 10 150 C 12 178 60 156 54 200", // B: sniff left
  "C 48 221 16 212 16 239 C 16 268 68 273 64 239 C 60 214 33 250 38 300", // C: loop
  "C 38 331 62 314 62 336 L 21 365 L 48 381 L 34 400", // D: zigzag
  "C 14 425 16 454 46 455 C 68 453 57 416 36 440 C 24 455 24 478 28 500", // E: double back
  "C 28 521 60 515 60 535 L 60 572 Q 60 590 18 600", // F: square corner
  "C 7 623 58 617 54 650 C 52 673 11 655 20 700", // G: sideways scamper
  "C 25 727 65 738 64 706 C 63 682 33 728 36 756 L 36 800", // H: look back
  "C 36 830 10 812 12 842 C 14 871 64 854 62 884 Q 60 902 42 900", // I: hook
  "L 15 926 L 55 946 L 20 970 Q 12 990 32 1000", // J: three steps
  "C 62 1010 63 1040 39 1042 C 12 1044 13 1012 33 1015 C 51 1018 55 1085 48 1100", // K: circle
  "C 44 1124 16 1117 16 1144 L 16 1170 Q 18 1196 57 1200", // L: long detour
  "C 70 1227 51 1245 33 1231 C 9 1212 5 1278 28 1300", // M: hesitate
  "C 28 1330 61 1305 62 1334 C 64 1360 18 1352 18 1379 Q 18 1398 40 1400", // N: cross lane
  "L 57 1425 Q 67 1444 49 1450 L 19 1455 Q 7 1467 26 1480 L 45 1500", // O: bounce
  "C 60 1528 12 1530 14 1552 C 16 1576 62 1541 61 1570 Q 60 1592 33 1600", // P: fake out
  "C 11 1610 10 1640 35 1640 C 64 1640 60 1610 39 1619 C 22 1628 24 1680 24 1700", // Q: loop left
  "L 24 1727 Q 24 1740 56 1740 L 56 1772 Q 56 1798 17 1800", // R: corner run
  "C 8 1829 54 1840 57 1814 C 60 1794 38 1836 35 1862 Q 32 1890 48 1900", // S: reverse
  "L 16 1925 L 56 1945 L 23 1962 C 13 1980 34 1988 34 2000", // T: mischief
  "C 34 2020 65 2011 63 2042 C 60 2074 8 2048 14 2080 Q 16 2095 37 2100", // U: wide swing
  "C 62 2117 61 2152 31 2148 C 5 2144 13 2114 32 2125 C 49 2138 38 2183 47 2200", // V: victory lap
  "Q 62 2224 42 2240 L 17 2255 Q 8 2274 29 2285 L 52 2300", // W: skip
  "C 64 2326 17 2314 17 2340 C 17 2372 62 2355 58 2400", // X: last detour
  "C 55 2424 13 2404 13 2437 C 13 2469 62 2472 61 2443 C 60 2426 36 2469 35 2500", // Y: one more spin
  "C 34 2524 53 2530 49 2551 C 45 2570 27 2577 34 2600", // Z: arrive
] as const;
const DIALOGUE = [
  { at:.045, text:"열아홉부터 쭉!" },
  { at:.17, text:"잠깐, 뭐지?" },
  { at:.29, text:"빙글~ 헤헤!" },
  { at:.43, text:"계속 함께였대!" },
  { at:.57, text:"간식 냄새…?" },
  { at:.71, text:"먼저 가 있을게!" },
  { at:.84, text:"스무 살도 함께 ♥" },
];

export default function CenterfoldGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dogRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(2015);
  const [arrived, setArrived] = useState(false);
  const [line, setLine] = useState("");
  const [petted, setPetted] = useState(false);
  const [pressed, setPressed] = useState(false);
  const petAnimation = useRef<Animation | null>(null);
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
    let stops: number[] = [];
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previousDistance: number | null = null;
    let walkingTimer: ReturnType<typeof setTimeout> | undefined;
    const paws = Array.from(journey.querySelectorAll<SVGTextElement>(".chronicle-stream-paw"));
    let frame = 0;
    let finished = false;
    const update = () => {
      frame = 0;
      const reduced = motionPreference.matches;
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
      const scrollProgress = Math.max(0, Math.min(1, (center - rect.top) / rect.height));
      if (!finished && scrollProgress >= 1) {
        finished = true;
        setArrived(true);
        setPetted(false);
      }
      const progress = finished ? 1 : scrollProgress;
      const chapter = Math.min(25, Math.floor(progress * 26));
      const local = progress * 26 - chapter;
      const distance = stops[chapter] + (stops[chapter + 1] - stops[chapter]) * local;
      const walking = !reduced && !finished && !document.hidden && rect.bottom > 0 && rect.top < window.innerHeight
        && previousDistance !== null && Math.abs(distance - previousDistance) > .15;
      previousDistance = distance;
      if (walking) {
        dog.dataset.walking = "true";
        clearTimeout(walkingTimer);
        walkingTimer = setTimeout(() => { dog.dataset.walking = "false"; }, 140);
      } else if (reduced || finished || document.hidden) {
        dog.dataset.walking = "false";
      }
      const point = path.getPointAtLength(distance);
      const next = path.getPointAtLength(Math.min(length, distance + 2));
      const laneWidth = path.ownerSVGElement!.getBoundingClientRect().width;
      const sx = laneWidth / 80, sy = journey.getBoundingClientRect().height / 2600;
      dog.style.transform = `translate(${point.x * sx - laneWidth / 2}px, ${point.y * sy}px)`;
      dog.style.setProperty("--dog-offset", `${point.x * sx - laneWidth / 2}px`);
      const turn = reduced || finished ? 0 : Math.max(-18, Math.min(18, (next.x - point.x) * 14));
      dog.style.setProperty("--dog-turn", `${turn}deg`);
      dog.dataset.backtracking = String(!reduced && !finished && next.y < point.y);
      setLine(finished ? "" : DIALOGUE.find(cue => Math.abs(cue.at - progress) < .018)?.text || "");
      paws.forEach((paw, i) => { paw.style.opacity = distance >= length * i / paws.length ? ".55" : ".12"; });

    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule, { rootMargin: "-20% 0px -20% 0px", threshold: [0, .25, .5, .75, 1] });
    rows.forEach(row => observer.observe(row));
    const measure = () => {
      let d = "";
      stops = [0];
      ROUTE.forEach(segment => {
        d += `${segment} `;
        path.setAttribute("d", d);
        stops.push(path.getTotalLength());
      });
      length = stops[stops.length - 1];
      const laneWidth = path.ownerSVGElement!.getBoundingClientRect().width;
      const paperScale = laneWidth / 72;
      paws.forEach((paw, i) => {
        const point = path.getPointAtLength(length * i / paws.length);
        paw.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${80 / 72} ${2600 * paperScale / journey.getBoundingClientRect().height})`);
      });
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(journey);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    motionPreference.addEventListener("change", schedule);
    return () => {
      observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motionPreference.removeEventListener("change", schedule);
      clearTimeout(walkingTimer);
      petAnimation.current?.cancel();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => { setPetted(false); }, [active]);
  const haptic = (pattern: number | number[]) => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  };
  const release = () => setPressed(false);
  const pet = () => {
    setPressed(false);
    setPetted(true);
    haptic([9, 45, 7, 55, 5]);
    petAnimation.current?.cancel();
    const face = dogRef.current?.querySelector(".chronicle-dog-touch");
    if (face && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      petAnimation.current = face.animate([
        { transform: "translateY(3px) scale(1.1, .84)", offset: 0 },
        { transform: "translateY(-7px) scale(.94, 1.08)", offset: .3 },
        { transform: "translateY(1px) scale(1.04, .96)", offset: .58 },
        { transform: "translateY(-2px) scale(.99, 1.02)", offset: .78 },
        { transform: "scale(1.06)", offset: 1 },
      ], { duration: 420, easing: "cubic-bezier(.22,.7,.32,1)" });
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPetted(false), 1800);
  };

  return (
    <section ref={sectionRef} id="photo-edition" className="chronicle" aria-labelledby="chronicle-title">
      <header className="chronicle-topline"><span>THE WEDDING NEWS</span><span>OUR STORY · 02</span></header>
      <div className="chronicle-heading"><h2 id="chronicle-title">열아홉에서<br/>서른까지</h2><p>2015—2026</p><div className="chronicle-intro">열아홉에 만나 이십 대의 모든 날을 함께했습니다.<br/>그리고 서른, 부부가 됩니다.</div></div>
      <div ref={journeyRef} className="chronicle-journey">
      <svg className="chronicle-stream" viewBox="0 0 80 2600" preserveAspectRatio="none" aria-hidden="true"><path ref={pathRef}/>{Array.from({length:80}, (_, i) => <text key={i} className="chronicle-stream-paw" textAnchor="middle" dominantBaseline="middle">🐾</text>)}</svg>
      <ol className="chronicle-years">{years.map((year, index) => (
        <li key={year} className="chronicle-year" data-year={year} data-format={year === 2020 || year === 2023 ? "landscape" : [2016, 2018, 2021, 2024].includes(year) ? "small" : "portrait"} data-active={year === active} data-past={year < active} data-featured={index === 0 || index === 5 || index === 11}>
          <div className="chronicle-year-label"><h3>{year}{index === 0 ? <small> / 첫해</small> : index === 11 ? <small> / 오늘</small> : null}</h3></div>
          <figure>
            <img src={`/history/${year}.jpg`} alt={`${year}년 기록에 담은 두 사람의 사진`} width={year === 2020 || year === 2023 ? 1600 : 1066} height={year === 2020 || year === 2023 ? 1066 : 1600} loading="lazy"/>
            {(index === 0 || index === 11) && <figcaption>{index === 0 ? "열아홉, 우리의 첫해." : "함께한 날들 위에, 새로운 시작."}</figcaption>}
          </figure>

        </li>
      ))}</ol>
      <button ref={dogRef} className="chronicle-dog" onClick={pet} aria-label="뚜이 쓰다듬기" type="button" data-petted={petted} data-pressed={pressed}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          petAnimation.current?.cancel();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          setPressed(true);
          haptic(6);
        }}
        onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onBlur={release}
        onKeyDown={event => {
          if ((event.key === " " || event.key === "Enter") && !event.repeat) {
            petAnimation.current?.cancel();
            setPressed(true);
          }
        }} onKeyUp={release}>
        <span className="chronicle-dog-touch"><span className="chronicle-dog-gait"><img src="/history/ddui.webp" alt="" width="480" height="480" draggable="false"/></span></span>
        {(petted || line) && <span className="chronicle-dog-bubble" role="status">{petted ? "헤헤, 또! ♥" : line}</span>}
      </button>
      </div>
      <footer className="chronicle-end" id="chronicle-finale" data-arrived={arrived}><p className="chronicle-finale-speech" aria-hidden={!arrived} aria-label="뚜이의 말: 그리고 지금 형누나가 결혼합니다!"><svg className="finale-balloon" viewBox="0 0 346 202" preserveAspectRatio="none" aria-hidden="true"><path d="M 34 24 C 90 18 204 23 268 24 Q 295 24 307 4 Q 312 26 303 31 C 330 33 338 45 339 65 L 339 159 Q 338 187 310 190 C 225 196 112 190 37 190 Q 8 190 7 162 L 7 58 Q 8 28 34 24 Z" /></svg><span className="finale-lead">그리고 지금,</span><strong className="finale-message">형누나가<br/>결혼합니다!</strong><span className="finale-charms" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M12 20 3.8 12A5.2 5.2 0 0 1 12 5.7 5.2 5.2 0 0 1 20.2 12Z"/></svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M7 10C9 7 6 4 3.5 5.5C1 7 2 10 3.5 11.5C2 13 1 16 3.5 17.5C6 19 9 16 7 13H17C15 16 18 19 20.5 17.5C23 16 22 13 20.5 11.5C22 10 23 7 20.5 5.5C18 4 15 7 17 10Z"/></svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="m12 2 2.8 6.3L22 9l-5.4 4.8 1.6 7.2L12 17.2 5.8 21l1.6-7.2L2 9l7.2-.7Z"/></svg>
      </span></p></footer>
    </section>
  );
}
