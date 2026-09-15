"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ImmediateContent } from "./asset-loader";
import CenterfoldGallery from "./centerfold-gallery";
import HistoryReport from "./history-report";
import NewspaperDelivery from "./newspaper-delivery";
import { ENABLE_DELIVERY_INTRO } from "./experience-config";

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

function CoverPhoto() {
  return (
    <figure className="cover-photo">
      <div className="cover-photo-print">
        <img src="/couple-main.webp" alt="창가에 나란히 앉아 꽃을 든 한원영과 이나경" width="1200" height="1800" fetchPriority="high" />
        <span className="cover-photo-mark" aria-hidden="true">FRONT PAGE <b>W × N</b></span>
      </div>
      <figcaption className="cover-photo-caption" aria-label="10년을 함께한 한원영과 이나경이 2026년 가을 가족 앞에서 결혼한다."><svg viewBox="0 0 600 24" aria-hidden="true"><text x="0" y="17" textLength="600" lengthAdjust="spacingAndGlyphs">10년을 함께한 한원영과 이나경이 2026년 가을 가족 앞에서 결혼한다.</text></svg></figcaption>
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
  return (
    <>
      {ENABLE_DELIVERY_INTRO && <NewspaperDelivery />}
      <main className="edition" aria-label="한원영과 이나경의 웨딩 신문">
        <article className="paper-page cover-page" id="top">
          <div className="cover-utility">
            <span>The Grand Hall</span>

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
          <CoverPhoto />
          <article className="cover-reaction">
            <span>BRIDE &amp; GROOM / 단독 소감</span>
            <h3>GD와 결혼하지 못한 신부의 한탄,<br />어이없어하는 남편의 소감</h3>
            <div className="cover-reaction-copy">
              <p>신부 이나경은 GD와의 결혼이 무산돼 “계획에 없던 결과라 유감”이라고 밝혔다.</p>
              <p>“어쩌다 한원영과 식장까지 잡았다”는 신부는 말끝마다 웃음을 참지 못했다.</p>
              <p>신랑은 “그걸 왜 청첩장에 쓰냐”며 어이없어했다. 결혼식은 예정대로 진행된다.</p>
            </div>
          </article>
          <HistoryReport photoSrc="/couple-main.webp" />
          <PageBottom next="CONTINUED ON PAGE 02" />
        </article>

        <CenterfoldGallery />

        <section className="paper-page details-page" id="details">
          <PageTop page="03" section="A NOTE OF THANKS" />
          <div className="announcement-note">
            <p>가족들과 함께 조용히 예식을 올립니다.</p>
            <p>오랜 시간 저희의 곁을 지켜주신<br />모든 분께 감사드립니다.<br />보내주시는 축하를 마음에 담고<br />서로 아끼며 잘 살겠습니다.</p>
            <div className="announcement-signature">
              <div>한동현 · 김현정의 아들 <strong>한원영</strong></div>
              <div>이광범 · 성호숙의 딸 <strong>이나경</strong></div>
            </div>
          </div>
          <PageBottom next="END OF EDITION" />
        </section>
      </main>
    </>
  );
}

export default function Home() {
  return (
    <ImmediateContent>
      <WeddingNewspaper />
    </ImmediateContent>
  );
}
