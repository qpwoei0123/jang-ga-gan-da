"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import AssetGate from "./asset-loader";
import { INTERACTION_SOUNDS } from "./audio-bank";
import CenterfoldGallery from "./centerfold-gallery";
import NewspaperDelivery from "./newspaper-delivery";

const INVITATION_ASSETS = [
  "/favicon.svg",
  "/paper-crumple.png",
  "/dog-run-sprite-ddui-timid.webp",
  "/will-smith-original.png",
  "/couple-main.webp",
  "/couple-sample.webp",
  "/venue-sample.webp",
  ...INTERACTION_SOUNDS,
] as const;

const COVER_SLIDES = [
  {
    src: "/couple-main.webp",
    alt: "창가에 나란히 앉아 꽃다발을 든 한원영과 이나경",
    label: "EXCLUSIVE",
    caption: "10년을 함께한 한원영과 이나경이 2026년 가을 가족 앞에서 결혼한다.",
    position: "50% 53%",
  },
  {
    src: "/couple-sample.webp",
    alt: "햇살 아래 부케를 든 신랑과 신부",
    label: "MOMENT 02",
    caption: "빛이 번진 오후, 두 사람의 결혼을 기억할 한 장면.",
    position: "54% 50%",
  },
  {
    src: "/venue-sample.webp",
    alt: "웨딩 장식 위에 놓인 두 개의 금색 반지",
    label: "DETAIL 03",
    caption: "오래 함께한 두 사람이 나눠 낄 약속의 반지.",
    position: "50% 50%",
  },
] as const;

const reports = [
  ["친구 제보 01", "결혼 발표, 사실상 뒤늦은 신고", "둘은 이미 서로의 주문을 대신하고 메뉴판도 한 장만 본다. 결혼은 새 소식이지만 생활은 오래전부터 그랬다."],
  ["친구 제보 02", "한 명 웃으면 다른 한 명도 웃음", "원영이 먼저 웃어도 나경이 먼저 웃어도 잠시 뒤엔 둘 다 웃고 있다. 옆 사람만 영문을 모른다."],
  ["친구 제보 03", "축하보다 먼저 나온 말, ‘드디어’", "소식을 들은 지인들은 한 박자 쉬고 ‘드디어’라고 했다. 편집국도 그대로 적었다."],
];

const PUZZLE_ROWS = [
  "한원영사랑함께웃음",
  "오늘도꽃십약속밥집",
  "여행사진년경나이봄",
  "서로사진마음축하봄",
  "뚜추억함께오늘도꽃",
  "봄이반지사진약속밥",
  "서울예식마음함께혼",
  "오늘밥족축하사진결",
  "웃음가약속봄날집꽃",
] as const;

const PUZZLE_SIZE = 9;
const PUZZLE_LETTERS = PUZZLE_ROWS.flatMap((row) => [...row]);
const PUZZLE_WORDS = [
  { word: "한원영", cells: [0, 1, 2] },
  { word: "이나경", cells: [25, 24, 23] },
  { word: "뚜이", cells: [36, 46] },
  { word: "결혼", cells: [71, 62] },
  { word: "가족", cells: [74, 66] },
  { word: "십년", cells: [13, 22] },
] as const;

function PhotoSlot({ code, marker, caption, className = "" }: { code: string; marker: string; caption: string; className?: string }) {
  return (
    <figure className={`photo-slot ${className}`.trim()}>
      <div className="photo-slot-frame" aria-hidden="true">
        <span>{code}</span>
        <strong>{marker}</strong>
        <small>PHOTO TO COME</small>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function PageTop({ page, section }: { page: string; section: string }) {
  return (
    <header className="page-topline">
      <span>The Wedding News</span>
      <span>{section}</span>
      <span>{page}</span>
    </header>
  );
}

function PageBottom({ next }: { next: string }) {
  return (
    <footer className="page-bottomline">
      <span>HAN WON-YOUNG · LEE NA-KYUNG</span>
      <span>{next}</span>
    </footer>
  );
}

function CoverCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, startLeft: 0, moved: false });
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const slide = COVER_SLIDES[activeSlide];
  const loopedSlides = [
    { item: COVER_SLIDES[COVER_SLIDES.length - 1], logicalIndex: COVER_SLIDES.length - 1, clone: true, key: "clone-last" },
    ...COVER_SLIDES.map((item, logicalIndex) => ({ item, logicalIndex, clone: false, key: item.src })),
    { item: COVER_SLIDES[0], logicalIndex: 0, clone: true, key: "clone-first" },
  ];

  function getPhysicalSlides() {
    return [...(viewportRef.current?.querySelectorAll<HTMLElement>(".cover-photo-slide") ?? [])];
  }

  function getClosestPhysicalIndex() {
    const viewport = viewportRef.current;
    if (!viewport) return 1;

    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    return getPhysicalSlides().reduce((best, item, index) => {
      const distance = Math.abs(item.offsetLeft + item.clientWidth / 2 - viewportCenter);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 1, distance: Number.POSITIVE_INFINITY }).index;
  }

  function scrollToPhysicalSlide(index: number, behavior: ScrollBehavior = "smooth") {
    const viewport = viewportRef.current;
    const target = getPhysicalSlides()[index];
    if (!viewport || !target) return;

    viewport.scrollTo({
      left: target.offsetLeft - (viewport.clientWidth - target.clientWidth) / 2,
      behavior,
    });
  }

  function scrollToSlide(index: number, behavior: ScrollBehavior = "smooth") {
    scrollToPhysicalSlide(index + 1, behavior);
    setActiveSlide(index);
  }

  function moveSlide(direction: -1 | 1) {
    const nextPhysicalIndex = Math.min(COVER_SLIDES.length + 1, Math.max(0, getClosestPhysicalIndex() + direction));
    scrollToPhysicalSlide(nextPhysicalIndex);
  }

  function syncActiveSlide() {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const physicalIndex = getClosestPhysicalIndex();
    setActiveSlide((physicalIndex - 1 + COVER_SLIDES.length) % COVER_SLIDES.length);

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    if (dragRef.current.pointerId !== -1) return;

    settleTimerRef.current = setTimeout(() => {
      const settledIndex = getClosestPhysicalIndex();
      const loopTarget = settledIndex === 0
        ? COVER_SLIDES.length
        : settledIndex === COVER_SLIDES.length + 1
          ? 1
          : null;
      if (loopTarget === null || !viewportRef.current) return;

      viewportRef.current.style.scrollBehavior = "auto";
      scrollToPhysicalSlide(loopTarget, "auto");
      requestAnimationFrame(() => viewportRef.current?.style.removeProperty("scroll-behavior"));
    }, 120);
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.style.scrollBehavior = "auto";
    scrollToPhysicalSlide(1, "auto");
    requestAnimationFrame(() => viewport.style.removeProperty("scroll-behavior"));

    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  function handleDragStart(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || dragRef.current.pointerId !== -1) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startLeft: event.currentTarget.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  }

  function handleDragMove(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId !== event.pointerId) return;
    const distance = event.clientX - dragRef.current.startX;
    if (Math.abs(distance) > 3) dragRef.current.moved = true;
    event.currentTarget.scrollLeft = dragRef.current.startLeft - distance;
  }

  function handleDragEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current.pointerId = -1;
    setIsDragging(false);
    syncActiveSlide();
  }

  return (
    <figure className="cover-photo" aria-roledescription="carousel" aria-label="웨딩 사진 모음">
      <div className="cover-photo-print">
        <div
          ref={viewportRef}
          className={`cover-photo-viewport${isDragging ? " is-dragging" : ""}`}
          onScroll={syncActiveSlide}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className="cover-photo-track">
            {loopedSlides.map(({ item, logicalIndex, clone, key }) => (
              <div className="cover-photo-slide" key={key} aria-hidden={clone || logicalIndex !== activeSlide} data-clone={clone || undefined}>
                <img src={item.src} alt={!clone && logicalIndex === activeSlide ? item.alt : ""} draggable="false" style={{ objectPosition: item.position }} width="1200" height="1500" />
              </div>
            ))}
          </div>
        </div>
        <span className="cover-photo-mark" aria-hidden="true">FRONT PAGE <b>W × N</b></span>
        <button type="button" className="cover-photo-arrow cover-photo-prev" onClick={() => moveSlide(-1)} aria-label="이전 사진">‹</button>
        <button type="button" className="cover-photo-arrow cover-photo-next" onClick={() => moveSlide(1)} aria-label="다음 사진">›</button>
        <span className="cover-photo-count" aria-hidden="true">{String(activeSlide + 1).padStart(2, "0")} / {String(COVER_SLIDES.length).padStart(2, "0")}</span>
      </div>
      <div className="cover-photo-meta">
        <figcaption aria-live="polite"><b>{slide.label}</b> {slide.caption}</figcaption>
        <div className="cover-photo-dots" aria-label="사진 선택">
          {COVER_SLIDES.map((item, index) => (
            <button
              type="button"
              key={item.src}
              className={index === activeSlide ? "is-active" : ""}
              aria-label={`${index + 1}번 사진 보기`}
              aria-current={index === activeSlide ? "true" : undefined}
              onClick={() => scrollToSlide(index)}
            />
          ))}
        </div>
      </div>
    </figure>
  );
}

function tracePuzzleLine(start: number, end: number) {
  const startRow = Math.floor(start / PUZZLE_SIZE);
  const startColumn = start % PUZZLE_SIZE;
  const endRow = Math.floor(end / PUZZLE_SIZE);
  const endColumn = end % PUZZLE_SIZE;
  const rowDistance = endRow - startRow;
  const columnDistance = endColumn - startColumn;
  const isStraight = rowDistance === 0 || columnDistance === 0 || Math.abs(rowDistance) === Math.abs(columnDistance);

  if (!isStraight) return [start];

  const rowStep = Math.sign(rowDistance);
  const columnStep = Math.sign(columnDistance);
  const steps = Math.max(Math.abs(rowDistance), Math.abs(columnDistance));

  return Array.from({ length: steps + 1 }, (_, index) => (
    (startRow + rowStep * index) * PUZZLE_SIZE + startColumn + columnStep * index
  ));
}

function WeddingSearchPuzzle() {
  const gridRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<number[]>([]);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [selection, setSelection] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [activeCell, setActiveCell] = useState(0);
  const [keyboardStart, setKeyboardStart] = useState<number | null>(null);

  const foundCells = new Set(
    PUZZLE_WORDS.filter(({ word }) => foundWords.includes(word)).flatMap(({ cells }) => cells),
  );
  const isComplete = foundWords.length === PUZZLE_WORDS.length;

  function updateSelection(nextSelection: number[]) {
    selectionRef.current = nextSelection;
    setSelection(nextSelection);
  }

  function finishSelection(path = selectionRef.current) {
    const selectedWord = path.map((index) => PUZZLE_LETTERS[index]).join("");
    const reversedWord = [...selectedWord].reverse().join("");
    const match = PUZZLE_WORDS.find(({ word }) => word === selectedWord || word === reversedWord);

    if (match && !foundWords.includes(match.word)) {
      setFoundWords((current) => [...current, match.word]);
      if ("vibrate" in navigator) navigator.vibrate(18);
    }

    setDragStart(null);
    setKeyboardStart(null);
    updateSelection([]);
  }

  function handlePointerDown(event: PointerEvent<HTMLSpanElement>, index: number) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart(index);
    setKeyboardStart(null);
    setActiveCell(index);
    updateSelection([index]);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStart === null) return;

    const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-cell-index]");
    if (!element || !gridRef.current?.contains(element)) return;

    const end = Number(element.dataset.cellIndex);
    if (Number.isNaN(end)) return;
    updateSelection(tracePuzzleLine(dragStart, end));
  }

  function handleGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const row = Math.floor(activeCell / PUZZLE_SIZE);
    const column = activeCell % PUZZLE_SIZE;
    let nextCell = activeCell;

    if (event.key === "ArrowUp") nextCell = Math.max(0, row - 1) * PUZZLE_SIZE + column;
    else if (event.key === "ArrowDown") nextCell = Math.min(PUZZLE_SIZE - 1, row + 1) * PUZZLE_SIZE + column;
    else if (event.key === "ArrowLeft") nextCell = row * PUZZLE_SIZE + Math.max(0, column - 1);
    else if (event.key === "ArrowRight") nextCell = row * PUZZLE_SIZE + Math.min(PUZZLE_SIZE - 1, column + 1);
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (keyboardStart === null) {
        setKeyboardStart(activeCell);
        updateSelection([activeCell]);
      } else {
        finishSelection(tracePuzzleLine(keyboardStart, activeCell));
      }
      return;
    } else if (event.key === "Escape") {
      setKeyboardStart(null);
      updateSelection([]);
      return;
    } else return;

    event.preventDefault();
    setActiveCell(nextCell);
    if (keyboardStart !== null) updateSelection(tracePuzzleLine(keyboardStart, nextCell));
  }

  return (
    <div className={`wedding-search-puzzle${isComplete ? " is-complete" : ""}`}>
      <div className="puzzle-progress" aria-live="polite">
        <span>{foundWords.length === 0 ? "드래그해서 취재 시작" : `${foundWords.length}/6 취재 완료`}</span>
        <i aria-hidden="true">{Array.from({ length: 6 }, (_, index) => index < foundWords.length ? "●" : "○").join(" ")}</i>
      </div>
      <div className="puzzle-layout">
        <div
          ref={gridRef}
          className="letter-grid"
          role="grid"
          tabIndex={0}
          aria-label="결혼 낱말찾기. 터치나 마우스로 글자를 드래그하세요. 키보드는 방향키로 이동하고 엔터로 시작점과 끝점을 선택합니다."
          aria-activedescendant={`puzzle-cell-${activeCell}`}
          onPointerMove={handlePointerMove}
          onPointerUp={() => finishSelection()}
          onPointerCancel={() => finishSelection([])}
          onKeyDown={handleGridKeyDown}
        >
          {PUZZLE_LETTERS.map((letter, index) => {
            const classNames = [
              selection.includes(index) ? "is-selected" : "",
              foundCells.has(index) ? "is-found" : "",
              activeCell === index ? "is-active" : "",
            ].filter(Boolean).join(" ");

            return (
              <span
                id={`puzzle-cell-${index}`}
                key={index}
                role="gridcell"
                className={classNames}
                data-cell-index={index}
                aria-selected={foundCells.has(index) || selection.includes(index)}
                onPointerDown={(event) => handlePointerDown(event, index)}
              >
                {letter}
              </span>
            );
          })}
        </div>
        <aside className="answer-bank">
          <h3>FIND</h3>
          {PUZZLE_WORDS.map(({ word }) => (
            <span className={foundWords.includes(word) ? "is-found" : ""} key={word}>
              {word}<b aria-hidden="true">{foundWords.includes(word) ? "✓" : ""}</b>
            </span>
          ))}
          <p>가로·세로·대각선, 거꾸로도 숨어 있습니다.</p>
        </aside>
      </div>
      <div className={`search-lower${isComplete ? " search-lower-correction" : ""}`} aria-live="polite">
        {isComplete ? (
          <>
            <div className="correction-stamp">정정 보도<small>6/6 취재 완료</small></div>
            <figure className="dog-editorial-photo">
              <span role="img" aria-label="신문을 물고 있는 뚜이 편집장" />
              <figcaption>편집장 뚜이. 직접 정답을 확인하고 정정 보도를 승인했다.</figcaption>
            </figure>
            <article>
              <span>CORRECTION / 편집국 정정 보도</span>
              <h3>평생 동거인 모집,<br />10년 심사 끝에 둘 다 합격</h3>
              <p>지원자 한원영과 이나경은 장기 심사를 무사히 통과했다. 재공고는 없으며 계약 기간은 평생이다.</p>
              <blockquote>뚜이 편집장 “다 찾았으면 이제 간식 찾아.”</blockquote>
            </article>
          </>
        ) : (
          <>
            <figure className="dog-editorial-photo">
              <span role="img" aria-label="신문을 물고 있는 뚜이" />
              <figcaption>편집 보조견 뚜이. 원고료는 간식으로 받는다.</figcaption>
            </figure>
            <article>
              <span>EDITORIAL / 오늘의 사설</span>
              <h3>10년이면 승인 도장 찍을 때도 됐다</h3>
              <p className="dropcap">본지는 2016년부터 두 사람을 지켜봤다. 십 년이면 표본도 충분하다. 저녁 메뉴는 아직 합의하지 못하지만 함께 먹겠다는 결론은 늘 같았다.</p>
              <blockquote>“연애 10년이면 기사도 충분하다. 편집국의 결론은 결혼 승인.”</blockquote>
            </article>
          </>
        )}
      </div>
    </div>
  );
}

function WeddingNewspaper() {
  const [copyStatus, setCopyStatus] = useState("");
  const address = "서울 성동구 연무장길 17";

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopyStatus("주소를 복사했어요.");
    } catch {
      setCopyStatus("아래 주소를 길게 눌러 복사해 주세요.");
    }
  }

  return (
    <>
      <NewspaperDelivery />
      <main className="edition" aria-label="한원영과 이나경의 웨딩 신문">
        <article className="paper-page cover-page" id="top">
          <div className="cover-utility">
            <span>The Grand Hall</span>
            <a href="#details" onClick={(event) => {
              event.preventDefault();
              window.dispatchEvent(new Event("wedding:show-details"));
              window.history.replaceState(window.history.state, "", "#details");
            }}>가족식 안내 ↘</a>
          </div>
          <div className="double-rule" aria-hidden="true" />
          <header className="cover-masthead">
            <span className="cover-the">The</span>
            <h1>Wedding News</h1>
          </header>
          <div className="issue-line">
            <span>ISSUE VOL. 1</span>
            <span>SATURDAY, OCTOBER 17, 2026</span>
            <span>PRICE: ONE BLESSING</span>
          </div>
          <div className="cover-announcement">
            <p>CELEBRATING THE UNION OF</p>
            <h2>한원영 <i>&amp;</i> 이나경</h2>
            <span>10년의 연애 끝, 가족 앞에서 결혼합니다.</span>
          </div>
          <CoverCarousel />
          <article className="cover-reaction">
            <span>BRIDE &amp; GROOM / 단독 소감</span>
            <h3>GD와 결혼하지 못한 신부의 한탄,<br />어이없어하는 남편의 소감</h3>
            <div className="cover-reaction-copy">
              <p className="dropcap">신부 이나경은 오랫동안 꿈꿔 온 GD와의 결혼이 끝내 무산된 데 대해 “계획에 없던 결과라 유감스럽다”며 깊은 아쉬움을 표했다.</p>
              <p>신부는 “어쩌다 보니 한원영과 식장까지 잡았다”고 한탄했지만, 취재진은 말끝마다 웃음을 참지 못한 점을 확인했다.</p>
              <p>신랑 한원영은 “그 얘기를 왜 청첩장에까지 쓰는지 모르겠다”며 어이없어했다. 다만 결혼식은 예정대로 진행된다.</p>
            </div>
          </article>
          <PageBottom next="CONTINUED ON PAGE 02" />
        </article>

        <CenterfoldGallery />

        <section className="paper-page details-page" id="details">
          <PageTop page="03" section="SERVICE DESK · FAMILY CEREMONY" />
          <header className="details-heading">
            <span>날짜와 장소는 이 면에서 확인하세요.</span>
            <h2>THE DAY,<br />THE PLACE</h2>
          </header>
          <div className="date-address-grid">
            <time dateTime="2026-10-17">
              <span>OCT</span>
              <strong>17</strong>
              <i>SATURDAY</i>
            </time>
            <div>
              <span>WHEN</span>
              <h3>2026년 10월 17일<br />토요일 오후 2시</h3>
              <p>식전 사진 촬영은 오후 1시 20분부터 시작합니다.</p>
            </div>
            <div>
              <span>WHERE</span>
              <h3>서울 아카이브 홀 2층</h3>
              <p>서울 성동구 연무장길 17<br />성수역 3번 출구 도보 7분</p>
            </div>
          </div>
          <div className="service-map" role="img" aria-label="서울 아카이브 홀 약도 예시">
            <span className="map-label station-label">성수역 3번 출구</span>
            <span className="map-label hall-label">SEOUL<br />ARCHIVE HALL</span>
            <span className="map-north">N ↑</span>
            <span className="map-road map-road-a" />
            <span className="map-road map-road-b" />
            <span className="map-road map-road-c" />
          </div>
          <div className="travel-notes">
            <article><span>SUBWAY</span><h3>성수역 3번 출구</h3><p>출구에서 연무장길 방향으로 약 7분 걸어오세요.</p></article>
            <article><span>PARKING</span><h3>주차 2시간 지원</h3><p>건물 주차장이 좁아 가능하면 대중교통을 권합니다.</p></article>
          </div>
          <div className="venue-actions">
            <a href={`https://map.naver.com/p/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">네이버지도 ↗</a>
            <a href={`https://map.kakao.com/link/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">카카오맵 ↗</a>
            <button type="button" onClick={copyAddress}>주소 복사</button>
          </div>
          <p className="address-feedback">{copyStatus || "지도에서 위치를 확인해 주세요."}</p>
          {copyStatus.startsWith("아래") && <p className="address-copy-fallback">{address}</p>}
          <PageBottom next="END OF EDITION" />
        </section>
      </main>
    </>
  );
}

export default function Home() {
  return (
    <AssetGate assets={INVITATION_ASSETS}>
      <WeddingNewspaper />
    </AssetGate>
  );
}
