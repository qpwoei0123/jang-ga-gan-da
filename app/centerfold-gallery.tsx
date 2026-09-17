"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import WeddingSong from "./wedding-song";
import { useDogSpeech } from "./dog-speech";
import { useAssetsReady } from "./asset-loader";

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
const YEAR_DIALOGUE: Record<number, string> = {
  2021: "내가 이때 태어났대요~",
  2022: "아닌가..? 이땐가...?",
};

export default function CenterfoldGallery() {
  const assetsReady = useAssetsReady();
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dogRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(2015);
  const [entranceDone, setEntranceDone] = useState(false);
  const [arrived, setArrived] = useState(false);
  const { layerRef: speechLayerRef, emit: emitSpeech } = useDogSpeech();
  const [petted, setPetted] = useState(false);
  const [pressed, setPressed] = useState(false);
  const petAnimation = useRef<Animation | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dog = dogRef.current;
    if (!arrived || !dog) return;
    const chooseSpin = () => { dog.style.setProperty("--celebration-turn", Math.random() < .1 ? "1080deg" : "0deg"); };
    const nextJump = (event: AnimationEvent) => {
      if (event.animationName === "chronicle-celebration-jump") chooseSpin();
    };
    chooseSpin();
    dog.addEventListener("animationiteration", nextJump);
    let visible = false;
    const sync = () => { dog.dataset.celebrating = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(dog);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      dog.removeEventListener("animationiteration", nextJump);
      document.removeEventListener("visibilitychange", sync);
      dog.dataset.celebrating = "false";
    };
  }, [arrived]);

  useEffect(() => {
    if (!arrived || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = requestAnimationFrame(() => {
      const bubble = sectionRef.current?.querySelector(".chronicle-finale-speech");
      if (!bubble || document.hidden) return;
      const rect = bubble.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const options = {
        particleCount: 28, spread: 65, startVelocity: 22, gravity: .85,
        ticks: 150, scalar: .7, disableForReducedMotion: true,
        colors: ["#bd8879", "#c7ae79", "#8e9e88", "#e2d5bd"],
      };
      const y = Math.min(1, (rect.top + rect.height * .6) / window.innerHeight);
      void confetti({ ...options, angle: 65, origin: { x: rect.left / window.innerWidth, y } });
      void confetti({ ...options, angle: 115, origin: { x: rect.right / window.innerWidth, y } });
    });
    return () => { cancelAnimationFrame(frame); confetti.reset(); };
  }, [arrived]);

  useEffect(() => {
    const section = sectionRef.current;
    const journey = journeyRef.current;
    const path = pathRef.current;
    const dog = dogRef.current;
    const song = section?.querySelector<HTMLElement>(".wedding-song");
    const screen = song?.querySelector<HTMLElement>(".wedding-song-screen");
    if (!assetsReady || !section || !journey || !path || !dog || !song || !screen) return;
    const rows = Array.from(section.querySelectorAll<HTMLElement>(".chronicle-year"));
    const paws = Array.from(journey.querySelectorAll<SVGGElement>(".chronicle-stream-paw"));
    const pawSeen = new Set<number>();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let length = 0;
    let stops: number[] = [];
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let phase: "waiting" | "lifting" | "following" = "waiting";
    let finished = false;
    let routeCursor = 0;
    const spoken = new Set<string>();
    let speechCues: { id:string; at:number; text:string }[] = [];
    let routePoints: { x:number; y:number }[] = [];
    let heading = 0;
    let walking = false;
    let backtracking = false;
    let trailCursor = 0;
    let chaseArmed = false;
    let chaseSweated = false;
    let sweatUntil = 0;
    let rowTops: number[] = [];
    // One persistent body, one clock, one transform writer for the entire journey.
    const body = { x:0, y:0, vx:0, vy:0 };
    const sample = (keys: number[][], t: number) => {
      const i = keys.findIndex(key => key[0] >= t);
      if (i <= 0) return keys[i < 0 ? keys.length - 1 : 0].slice(1);
      const a = keys[i-1], b = keys[i];
      const fraction = (t-a[0]) / (b[0]-a[0]);
      const ease = fraction * fraction * (3 - 2 * fraction);
      return a.slice(1).map((value, j) => value + (b[j+1]-value) * ease);
    };
    const update = (now: number) => {
      frame = 0;
      if (document.hidden) { lastTime = 0; dog.dataset.walking = "false"; return; }
      const dt = lastTime ? Math.min((now-lastTime)/1000, .032) : 1/60;
      lastTime = now;
      const reduced = motionPreference.matches;
      const rect = journey.getBoundingClientRect();
      const paper = song.getBoundingClientRect();
      const laneWidth = path.ownerSVGElement!.getBoundingClientRect().width;
      const scale = laneWidth / 72;
      const center = window.innerHeight * .45;
      const scrollProgress = Math.max(0, Math.min(1, (center-rect.top)/rect.height));
      const endX = -5.4 * scale;
      const originX = rect.left + dog.offsetLeft;
      const originY = rect.top + dog.offsetTop;
      const startX = paper.right-originX-48*scale*.9;
      const startY = paper.bottom-originY-48*scale*.8;
      if (phase === "waiting") {
        const visible = Math.max(0, Math.min(paper.bottom,window.innerHeight)-Math.max(paper.top,0))/paper.height;
        if (reduced || scrollProgress > 0) {
          phase = "following";
          body.x = endX;
          setEntranceDone(true);
        } else if (visible >= .65) {
          phase = "lifting";
          body.x = startX; body.y = startY;
        } else { lastTime = 0; return; }
      }
      if (reduced && phase === "lifting") {
        phase = "following";
        setEntranceDone(true);
      }
      let targetX = endX, targetY = 0, lean = 0;
      let moreWaypoints = false;
      let goalX = endX, goalY = 0;
      if (phase === "lifting") {
        elapsed += dt;
        const t = Math.min(1, elapsed / 4.2);
        [targetX,targetY,lean] = sample([
          [0,startX,startY,0],[.08,startX,startY,0],
          [.18,startX+7*scale,startY-2*scale,-7],[.25,startX,startY,0],
          [.42,startX+14*scale,startY-10*scale,9],
          [.58,endX,startY-25*scale,-10],[.76,endX,0,0],
          [.85,endX,-8*scale,4],[1,endX,0,0],
        ],t);
        const [angle,shadow] = sample([
          [0,0,0],[.16,-.7,2],[.23,0,0],[.43,-7,17],[.56,-7.5,17],
          [.70,0,1],[.79,-2.6,6],[.87,0,1],[.92,-.8,2],[1,0,0],
        ],t);
        screen.style.transform = `rotate(${angle}deg)`;
        screen.style.boxShadow = `0 ${shadow}px ${shadow*.8}px rgb(23 23 22 / 16%)`;
        dog.style.opacity = String(Math.min(1,t/.08));

        if (t === 1) {
          // Change only the destination source; never reset the body's position or velocity.
          phase = "following";
          setEntranceDone(true);
        }
      } else {
        screen.style.removeProperty("transform");
        screen.style.removeProperty("box-shadow");
        dog.style.opacity = "1";
        const chapter = Math.min(25,Math.floor(scrollProgress*26));
        const distance = stops[chapter]+(stops[chapter+1]-stops[chapter])*(scrollProgress*26-chapter);
        const goal = path.getPointAtLength(distance);
        goalX = goal.x*laneWidth/80-laneWidth/2;
        goalY = goal.y*rect.height/2600;
        const goalIndex = Math.round(distance/length*(routePoints.length-1));
        if (Math.abs(goalY-body.y)>window.innerHeight*.65) chaseArmed=true;
        // Cursor identifies the nearby path segment; it has no velocity or easing.
        // Only the dog's body is integrated. Nearby waypoints preserve loops and turns.
        let nearest = routeCursor;
        const forward = goalIndex >= routeCursor;
        const from = forward ? routeCursor : Math.max(goalIndex,routeCursor-8);
        const to = forward ? Math.min(goalIndex,routeCursor+8) : routeCursor;
        for (let i=from; i<=to; i++) {
          if (Math.hypot(routePoints[i].x-body.x,routePoints[i].y-body.y)<Math.hypot(routePoints[nearest].x-body.x,routePoints[nearest].y-body.y)) nearest=i;
        }
        routeCursor=nearest;
        const remaining = goalIndex-routeCursor;
        if (Math.abs(remaining)>8 && !reduced) {
          const waypoint = routePoints[routeCursor+Math.sign(remaining)*8];
          targetX=waypoint.x; targetY=waypoint.y;
          moreWaypoints=true;
        } else { targetX=goalX; targetY=goalY; }
        if (reduced) routeCursor=goalIndex;
        if (Math.abs(remaining)>3) backtracking=remaining<0;
        let closest = 0;
        rowTops.forEach((top,i) => { if (Math.abs(rect.top+top-center) < Math.abs(rect.top+rowTops[closest]-center)) closest=i; });
        const currentYear = Number(rows[closest].dataset.year);
        setActive(currentYear);

      }
      if (reduced) { body.x=targetX; body.y=targetY; body.vx=0; body.vy=0; }
      else {
        body.vx += ((targetX-body.x)*180-body.vx*25)*dt;
        body.vy += ((targetY-body.y)*180-body.vy*25)*dt;
        body.x += body.vx*dt; body.y += body.vy*dt;
        if (Math.hypot(targetX-body.x,targetY-body.y)<.25 && Math.hypot(body.vx,body.vy)<2) {
          body.x=targetX; body.y=targetY; body.vx=0; body.vy=0;
        }
      }
      dog.style.transform = `translate(${body.x}px, ${body.y}px) rotate(${lean}deg)`;
      if (phase === "lifting" && elapsed >= .8 && !spoken.has("intro")) {
        spoken.add("intro");
        emitSpeech("영차…!", "location", dog);
      }
      const speed = Math.hypot(body.vx,body.vy);
      if (phase === "following" && !reduced && chaseArmed && !chaseSweated && now>=sweatUntil && speed>220*scale) {
        sweatUntil=now+2000;
        chaseSweated=true;
      }
      if (phase === "following" && Math.hypot(body.x-goalX,body.y-goalY)<40*scale && speed<35) {
        chaseArmed=false;
        chaseSweated=false;
      }
      if (reduced) sweatUntil=0;
      dog.dataset.sweating=String(now<sweatUntil);
      const wantedHeading = Math.max(-7,Math.min(7,body.vx*.035));
      heading += (wantedHeading-heading)*(1-Math.exp(-8*dt));
      if (speed < 2) heading = 0;
      walking = phase === "following" && !reduced && speed > (walking ? 12 : 35);
      dog.style.setProperty("--dog-turn",`${heading}deg`);
      dog.dataset.backtracking = String(backtracking);
      dog.dataset.walking = String(walking);
      dog.dataset.motionPhase = phase;
      const atEnd = phase === "following" && scrollProgress === 1 && Math.hypot(body.x-goalX,body.y-goalY)<.25 && body.vy === 0 && body.vx === 0;
      if (atEnd !== finished) { finished=atEnd; setArrived(atEnd); setPetted(false); }
      if (phase === "following") {
        // Record crossed route intervals, regardless of visibility or frame rate.
        const low=Math.min(trailCursor,routeCursor)/(routePoints.length-1);
        const high=Math.max(trailCursor,routeCursor)/(routePoints.length-1);
        speechCues.forEach(cue => {
          if (!spoken.has(cue.id) && cue.at>=low && cue.at<=high) {
            spoken.add(cue.id);
            emitSpeech(cue.text, "location", dog);
          }
        });
        paws.forEach((paw,i) => {
          const position=i/paws.length;
          if (!pawSeen.has(i) && position>=low && position<=high) {
            pawSeen.add(i);
            paw.style.opacity=".55";
          }
        });
        trailCursor=routeCursor;
      }
      if (phase === "lifting" || now<sweatUntil || moreWaypoints || body.vx !== 0 || body.vy !== 0 || body.x !== targetX || body.y !== targetY) frame=requestAnimationFrame(update);
      else lastTime=0;
    };
    const schedule = () => { if (!frame) frame=requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule,{threshold:[0,.65,1]});
    observer.observe(song);
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
      const journeyRect = journey.getBoundingClientRect();
      rowTops = rows.map(row => row.getBoundingClientRect().top-journeyRect.top);
      routePoints = Array.from({length:801},(_,i) => {
        const point=path.getPointAtLength(length*i/800);
        return { x:point.x*laneWidth/80-laneWidth/2, y:point.y*journeyRect.height/2600 };
      });
      speechCues = DIALOGUE.map((cue,i) => {
        const chapter=Math.min(25,Math.floor(cue.at*26));
        return { id:`route-${i}`, text:cue.text, at:(stops[chapter]+(stops[chapter+1]-stops[chapter])*(cue.at*26-chapter))/length };
      });
      Object.entries(YEAR_DIALOGUE).forEach(([year,text]) => {
        const rowIndex=rows.findIndex(row=>row.dataset.year===year);
        const index=routePoints.findIndex(point=>point.y>=rowTops[rowIndex]+80*paperScale);
        speechCues.push({ id:year, text, at:Math.max(0,index)/(routePoints.length-1) });
      });
      paws.forEach((paw, i) => {
        const distance = length * i / paws.length;
        const point = path.getPointAtLength(distance);
        const next = path.getPointAtLength(Math.min(length, distance + 2));
        const scaleY = 2600 * paperScale / journeyRect.height;
        const angle = Math.atan2((next.y - point.y) / scaleY, (next.x - point.x) / (80 / 72)) * 180 / Math.PI + 90;
        paw.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${80 / 72} ${scaleY}) rotate(${angle}) translate(${i % 2 ? 3 : -3} 0)`);
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
      screen.style.removeProperty("transform");
      screen.style.removeProperty("box-shadow");
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motionPreference.removeEventListener("change", schedule);
      petAnimation.current?.cancel();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [assetsReady, emitSpeech]);

  const haptic = (pattern: number | number[]) => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  };
  const release = () => setPressed(false);
  const pet = () => {
    setPressed(false);
    setPetted(true);
    const faceSource=dogRef.current?.querySelector<HTMLElement>(".chronicle-dog-gait > img");
    if (faceSource) {
      const phrases=["헤헤, 또! ♥", "좋아아~", "간식도 줘~", "으헤헤!"];
      emitSpeech(phrases[Math.floor(Math.random()*phrases.length)], "interaction", faceSource);
    }
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
      <div ref={speechLayerRef} className="chronicle-speech-layer" aria-live="polite" aria-relevant="additions"/>
      <header className="section-kicker">우리의 시간</header>
      <div className="chronicle-heading"><h2 id="chronicle-title">열아홉에서<br/>서른까지</h2><p>2015—2026</p><div className="chronicle-intro">열아홉에 만나 이십 대의 모든 날을 함께했습니다.<br/>그리고 서른, 부부가 됩니다.</div></div>
      <WeddingSong />
      <div ref={journeyRef} className="chronicle-journey">
      <svg className="chronicle-stream" viewBox="0 0 80 2600" preserveAspectRatio="none" aria-hidden="true"><path ref={pathRef}/>{Array.from({length:120}, (_, i) => <g key={i} className="chronicle-stream-paw"><ellipse cx="0" cy="2" rx="2.6" ry="2.2"/><ellipse cx="-3" cy="-1" rx="1.1" ry="1.5" transform="rotate(-25 -3 -1)"/><ellipse cx="-1.2" cy="-3" rx="1.1" ry="1.5"/><ellipse cx="1.2" cy="-3" rx="1.1" ry="1.5"/><ellipse cx="3" cy="-1" rx="1.1" ry="1.5" transform="rotate(25 3 -1)"/></g>)}</svg>
      <ol className="chronicle-years">{years.map((year, index) => (
        <li key={year} className="chronicle-year" data-year={year} data-format={year === 2020 || year === 2023 ? "landscape" : [2016, 2018, 2021, 2024].includes(year) ? "small" : "portrait"} data-active={year === active} data-past={year < active} data-featured={index === 0 || index === 5 || index === 11}>
          <div className="chronicle-year-label"><h3>{year}{index === 0 ? <small> / 첫해</small> : index === 11 ? <small> / 오늘</small> : null}</h3></div>
          <figure>
            <img src={`/history/${year}.jpg`} alt={`${year}년 기록에 담은 두 사람의 사진`} width={year === 2020 || year === 2023 ? 1600 : 1066} height={year === 2020 || year === 2023 ? 1066 : 1600} loading="lazy"/>
            {(index === 0 || index === 11) && <figcaption>{index === 0 ? "열아홉, 우리의 첫해." : "함께한 날들 위에, 새로운 시작."}</figcaption>}
          </figure>

        </li>
      ))}</ol>
      <button ref={dogRef} className="chronicle-dog" data-entered={entranceDone} tabIndex={entranceDone ? 0 : -1} onClick={pet} aria-label="뚜이 쓰다듬기" type="button" data-petted={petted} data-pressed={pressed} data-arrived={arrived}
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
        <span className="chronicle-dog-sweat" aria-hidden="true"><i/><i/><i/></span>
        <span className="chronicle-dog-touch"><span className="chronicle-dog-gait"><img src="/history/ddui.webp" alt="" width="480" height="480" draggable="false"/></span></span>
      </button>
      </div>
      <footer className="chronicle-end" id="chronicle-finale" data-arrived={arrived}><p className="chronicle-finale-speech" aria-hidden={!arrived} aria-label="뚜이의 말: 그리고 지금 형누나가 결혼합니다!"><svg className="finale-balloon" viewBox="0 0 346 202" preserveAspectRatio="none" aria-hidden="true"><path d="M 34 24 C 90 18 204 23 268 24 Q 295 24 307 4 Q 312 26 303 31 C 330 33 338 45 339 65 L 339 159 Q 338 187 310 190 C 225 196 112 190 37 190 Q 8 190 7 162 L 7 58 Q 8 28 34 24 Z" /></svg><span className="finale-composition"><span className="finale-lead">그리고 지금,</span><strong className="finale-message">형누나가<br/>결혼합니다!</strong><span className="finale-charms" aria-hidden="true">
        <svg className="finale-charm finale-charm-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M12 20 3.8 12A5.2 5.2 0 0 1 12 5.7 5.2 5.2 0 0 1 20.2 12Z"/></svg>
        <svg className="finale-charm finale-charm-bone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M7 10C9 7 6 4 3.5 5.5C1 7 2 10 3.5 11.5C2 13 1 16 3.5 17.5C6 19 9 16 7 13H17C15 16 18 19 20.5 17.5C23 16 22 13 20.5 11.5C22 10 23 7 20.5 5.5C18 4 15 7 17 10Z"/></svg>
        <svg className="finale-charm finale-charm-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="m12 2 2.8 6.3L22 9l-5.4 4.8 1.6 7.2L12 17.2 5.8 21l1.6-7.2L2 9l7.2-.7Z"/></svg>
      </span></span></p></footer>
    </section>
  );
}
