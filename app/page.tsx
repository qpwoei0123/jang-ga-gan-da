"use client";

import { publicAsset } from "./public-asset.ts";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { InvitationGate, usePreloadStarted } from "./asset-loader";
import CenterfoldGallery from "./centerfold-gallery";
import NewspaperArticle from "./newspaper-article";
import NewspaperInterview from "./newspaper-interview";
import NewspaperDelivery from "./newspaper-delivery";
import { ENABLE_DELIVERY_INTRO } from "./experience-config";
import FamilyDogNote from "./family-dog-note";
import WeddingSong from "./wedding-song";

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

function PageBottom({ next }: { next: string }) {
  return (
    <footer className="page-bottomline">
      <span>HAN WON-YOUNG · LEE NA-KYUNG</span>
      <span>{next}</span>
    </footer>
  );
}

function CoverPhoto() {
  const preloading = usePreloadStarted();
  return (
    <figure className="cover-photo" data-ddui-tip="둘이 제법 잘 어울리죠? 헤헤.">
      <div className="cover-photo-print">
        <img src={preloading ? publicAsset("/couple-main.webp") : undefined} alt="창가에 나란히 앉아 꽃을 든 한원영과 이나경" width="1200" height="1800" fetchPriority="high" />
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
              <h3>평생 동거인 모집,<br />11년 심사 끝에 둘 다 합격</h3>
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
              <h3>11년이면 승인 도장 찍을 때도 됐다</h3>
              <p className="dropcap">본지는 2016년부터 두 사람을 지켜봤다. 십 년이면 표본도 충분하다. 저녁 메뉴는 아직 합의하지 못하지만 함께 먹겠다는 결론은 늘 같았다.</p>
              <blockquote>“연애 11년이면 기사도 충분하다. 편집국의 결론은 결혼 승인.”</blockquote>
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
      <WeddingSong />
      <main className="wedding-site" aria-label="한원영과 이나경의 웨딩 신문">
        <article className="edition paper-page cover-page" id="top">
          <div className="double-rule" aria-hidden="true" />
          <header className="cover-masthead">
            <span className="cover-the">The</span>
            <h1>Wedding News</h1>
          </header>
          <div className="issue-line">
            <span>ISSUE VOL. 1</span>
            <span>SUNDAY, NOVEMBER 1, 2026</span>
          </div>
          <div className="cover-announcement" data-ddui-tip="오늘 신문 주인공은 우리 형누나예요~">
            <p>CELEBRATING THE UNION OF</p>
            <h2>한원영 <i>&amp;</i> 이나경</h2>
            <span>11년의 연애 끝, 결혼합니다.</span>
          </div>
          <CoverPhoto />
          <NewspaperArticle kind="reaction" />
          <NewspaperArticle kind="history" photoSrc={publicAsset("/history-hanbok.webp")} />
          <NewspaperInterview />
          <footer className="newspaper-footer">
            <p className="newspaper-closing">취재는 여기까지. 두 사람의 이야기는 계속됩니다.</p>
            <FamilyDogNote />
          </footer>
        </article>
        <CenterfoldGallery />
        <section className="paper-page details-page" id="details" aria-label="가족식 안내" data-ddui-tip="형누나가 결혼합니다! 많이 많이 축하해 주세요~" data-ddui-celebrate="true">
          <div className="announcement-note">
            <p>저희 두 사람은 2026년 11월 1일 결혼합니다.</p>
            <p>양가 가족을 중심으로<br />미리 초대드린 분들과 작은 예식을 올립니다.<br />많은 분을 모시지 못하는 점<br />너그러운 마음으로 이해해 주시면 감사하겠습니다.</p>
            <p>저희의 새로운 시작을 따뜻하게 축복해 주세요.<br />보내주신 마음 소중히 간직하며 잘 살겠습니다.</p>
          </div>
          <p className="gallery-signoff"><span>한동현 · 김현정의 아들 한원영</span><span>이광범 · 성호숙의 딸 이나경</span></p>
        </section>
      </main>
    </>
  );
}

export default function Home() {
  useEffect(() => {
    const preventImageMenu = (event: Event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };
    document.addEventListener("contextmenu", preventImageMenu, true);
    document.addEventListener("dragstart", preventImageMenu, true);
    return () => {
      document.removeEventListener("contextmenu", preventImageMenu, true);
      document.removeEventListener("dragstart", preventImageMenu, true);
    };
  }, []);

  return (
    <InvitationGate>
      <WeddingNewspaper />
    </InvitationGate>
  );
}
