import type { Metadata } from "next";
import type { ReactNode } from "react";
import ScrollEffects from "./scroll-effects";

export const metadata: Metadata = {
  title: "결혼일보 — 한원영·이나경 특집호",
  description: "두 사람의 결혼을 한 부의 신문으로 기록한 모바일 청첩장.",
};

const friendNotes = [
  ["친구 제보 01", "이미 부부였다는 증거", "서로의 커피 주문을 외우고, 메뉴를 고를 때 늘 상대방 몫까지 생각한다. 결혼 발표만 오늘이었다."],
  ["친구 제보 02", "가장 자주 목격된 장면", "한 사람이 먼저 웃으면 다른 한 사람도 결국 웃는다. 이 장면은 장소와 시간에 관계없이 반복됐다."],
  ["친구 제보 03", "주변인의 최종 의견", "둘이 함께 있으면 각자일 때보다 더 편안해 보인다. 그러므로 계속 함께 있어야 한다."],
];

const celebrityDesk = [
  ["도널드 트럼프", "가장 위대한 결혼"],
  ["테일러 스위프트", "Love Story 현실화"],
  ["데이비드 베컴", "평생 원팀 선언"],
  ["BTS RM", "서로의 문장이 되길"],
  ["아이유", "좋은 날, 좋은 사람"],
  ["손흥민", "연장전 없는 승리"],
  ["유재석", "두 분 행복하세요"],
];

const extraDesk = [
  ["사설 / EDITORIAL", "이 결혼은 너무 오래 기다렸다", "결혼일보 편집국은 두 사람이 10년 동안 보여준 성실한 동행을 높이 평가한다. 이제는 같은 식탁의 의자를 공식적으로 배정할 때다."],
  ["속보 / CITY DESK", "한원영 씨, 이나경 씨의 표정만으로 하루를 판단", "현장 취재 결과 한 사람이 웃으면 다른 한 사람의 표정도 3초 안에 풀리는 것으로 확인됐다. 주변인들은 이를 ‘가장 믿을 만한 날씨’라고 부른다."],
  ["생활 / HOME FILE", "냉장고 안쪽에서 공동생활의 증거 발견", "서로의 취향을 고려한 간식과 상대방이 좋아하는 음료가 나란히 놓여 있었다. 냉장고는 이미 오래전부터 두 사람 편이었다."],
  ["검증 / FACT CHECK", "‘드디어’라는 반응, 사실인가", "친구와 가족에게 확인한 결과 결혼 소식을 들은 뒤 가장 먼저 나온 단어가 모두 같았다. 취재진은 이 반응을 충분히 납득할 수 있다고 판단했다."],
];

const celebrityPhotos = [
  {
    name: "도널드 트럼프",
    angle: "가장 위대한 결혼",
    image: "/celebs/trump.jpg",
    caption: "공식 초상 사진을 빌린 패러디 지면",
    credit: "White House / Shealah Craighead · Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Official_Presidential_Portrait_of_President_Donald_J._Trump_(2025).jpg",
  },
  {
    name: "테일러 스위프트",
    angle: "Love Story 현실화",
    image: "/celebs/taylor-swift.jpg",
    caption: "콘서트 현장 사진을 빌린 패러디 지면",
    credit: "Emazasm · CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Taylor_swift.jpg",
  },
  {
    name: "손흥민",
    angle: "연장전 없는 승리",
    image: "/celebs/son.jpg",
    caption: "경기장 사진을 빌린 패러디 지면",
    credit: "Crofab · CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Son_Heung-Min.jpg",
  },
];

const timeline = [
  ["2016. 04", "첫 만남", "친구들의 기억 속 두 사람이 처음 같은 장면에 등장한 달."],
  ["2022. 08", "여름 휴가", "사진 842장 중 서로를 찍은 사진이 811장으로 확인됨."],
  ["2024. 12", "다음 장 논의", "각자의 냉장고에서 상대방의 물건이 발견되기 시작함."],
  ["2026. 06", "결혼 발표", "주변 지인 전원 ‘드디어’라는 반응을 보임."],
];

const schedule = [
  ["일시", "2026. 10. 17. (토) 오후 2시", "식전 사진 촬영은 1시 20분부터"],
  ["장소", "서울 아카이브 홀 2층", "서울 성동구 연무장길 17"],
  ["교통", "성수역 3번 출구 도보 7분", "주차 2시간 지원"],
];

function Rule({ className = "" }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

function PageFolio({ page, topics }: { page: string; topics: string }) {
  return (
    <div className="page-folio">
      <span>결혼일보 / {page}</span>
      <span>{topics}</span>
      <span>THE COUPLE TIMES · 2026</span>
    </div>
  );
}

function SectionHead({
  label,
  title,
  note,
  className = "",
}: {
  label: string;
  title: ReactNode;
  note: ReactNode;
  className?: string;
}) {
  return (
    <div className={`section-header ${className}`}>
      <div>
        <p className="article-label">{label}</p>
        <h2>{title}</h2>
      </div>
      <p>{note}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="invitation-shell">
      <div className="paper-grain" aria-hidden="true" />
      <ScrollEffects />

      <header className="utility-bar">
        <span>초안용 가상 패러디 · 실제 보도 아님</span>
        <span>2026년 10월 17일 토요일</span>
        <a href="#family-note">가족식 안내 보기 ↘</a>
      </header>

      <section className="newspaper-header section-pad" id="top">
        <div className="weather-line">
          <span>SEOUL / THE COUPLE TIMES</span>
          <span>제1호 · 가격: 축복 한마디</span>
        </div>
        <Rule />
        <div className="masthead-lockup">
          <span className="masthead-side">THE COUPLE<br />TIMES</span>
          <h1>결혼일보</h1>
          <span className="masthead-side masthead-right">SPECIAL<br />WEDDING ISSUE</span>
        </div>
        <div className="paper-deck">
          <strong>두 사람이 만났고, 모두가 기다렸으며, 오늘의 1면이 완성됐다.</strong>
          <span>한원영 &amp; 이나경의 결혼 소식</span>
        </div>
        <div className="breaking-strip">
          <span>긴급속보</span>
          <strong>한원영·이나경, 10년 연애 끝 결혼 발표… 가족들 “이제야?”</strong>
          <span className="breaking-time">14:00 UPDATED</span>
        </div>
        <nav className="front-index" aria-label="신문 섹션 바로가기">
          <span>이번 호 목차</span>
          <a href="#people">2면 사람들</a>
          <a href="#extra">중간면 EXTRA</a>
          <a href="#feature">3면 기록</a>
          <a href="#details">4면 예식 정보</a>
          <a href="#family-note">가족 안내</a>
        </nav>

        <div className="front-page-grid">
          <article className="lead-story">
            <p className="article-label">1면 톱기사 / EXCLUSIVE</p>
            <h2>한원영·이나경,<br /><em>결혼을 선언하다</em></h2>
            <p className="lead-summary">서로의 하루를 가장 먼저 묻던 두 사람이 이제 서로의 내일을 가장 먼저 책임지기로 했다.</p>
            <Rule className="short-rule" />
            <p className="dense-copy">두 사람은 오는 10월 17일 서울 아카이브 홀에서 결혼식을 올린다. 취재진이 “서로의 단점은 무엇이냐”고 묻자 7초간 웃은 뒤 “그런 건 아직 발견하지 못했다”고 답했다.</p>
            <div className="article-byline">취재: 결혼일보 공동취재단 · 사진: 샘플 이미지</div>
          </article>

          <figure className="front-page-photo">
            <img data-parallax="photo" src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85" alt="서로 마주 보고 웃는 신랑 신부" />
            <figcaption>▲ 결혼을 앞둔 두 사람. 실제 사진으로 교체할 자리입니다.</figcaption>
          </figure>

          <aside className="wire-column">
            <p className="article-label">가상 축복 / WORLD WIRE</p>
            <h3>유명인 축복 명단<br />곧 공개 예정</h3>
            <p className="wire-quote">“이 결혼은 아주 훌륭하다.”</p>
            <p className="tiny-note">실제 발언이 아닌 초안용 패러디 문구입니다.</p>
            <Rule />
            <p className="article-label">오늘의 핵심</p>
            <div className="index-row"><span>결혼식</span><strong>2026.10.17</strong></div>
            <div className="index-row"><span>신랑·신부</span><strong>한원영 &amp; 이나경</strong></div>
            <div className="index-row"><span>독자의 할 일</span><strong>축하하기</strong></div>
          </aside>
        </div>
      </section>

      <section className="people-page section-pad" id="people" data-reveal="page">
        <PageFolio page="2면" topics="PEOPLE / SOCIAL / CELEBRITY" />
        <SectionHead className="people-section-head" label="PEOPLE DESK / FIELD REPORT" title={<>사랑은 <span>제보로 확인된다</span></>} note={<>친구들의 관찰과<br />가상 축복을 한 면에 묶었습니다.</>} />
        <Rule className="people-rule" />
        <div className="people-layout">
          <div className="friend-report">
            <article className="friend-lead" data-reveal="column">
              <p className="article-label">{friendNotes[0][0]}</p>
              <h3>{friendNotes[0][1]}</h3>
              <p>{friendNotes[0][2]}</p>
              <div className="article-byline">사회부 입수 자료 · 주변인 1인 익명 제보</div>
            </article>
            <div className="friend-brief-grid">
              {friendNotes.slice(1).map(([label, title, copy]) => (
                <article className="friend-brief" key={label}>
                  <p className="article-label">{label}</p>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="celebrity-file" data-reveal="column">
            <div className="file-heading">
              <div>
                <p className="article-label">WORLD WIRE / PARODY FILE</p>
                <h3>유명인들의<br /><em>축복 릴레이</em></h3>
              </div>
              <span>별책<br />A-01</span>
            </div>
            <p className="tiny-note">실제 축하 메시지가 아닙니다. 이름만 빌린 한 줄 패러디입니다.</p>
            <div className="celebrity-list">
              {celebrityDesk.map(([name, angle], index) => (
                <article className="celebrity-entry" key={name}>
                  <span className="celebrity-number">{String(index + 1).padStart(2, "0")}</span>
                  <div><h4>{name}</h4><p>{angle}</p></div>
                </article>
              ))}
            </div>
          </aside>
        </div>
        <div className="page-bottomline"><span>2면 끝</span><span>다음 면: 사설·속보·유명인 포토 와이어</span></div>
      </section>

      <section className="extra-page section-pad" id="extra" data-reveal="page">
        <PageFolio page="2면 하단" topics="EDITORIAL / EXTRA / PHOTO WIRE" />
        <div className="extra-masthead">
          <div>
            <p className="article-label">EXTRA EDITION / 결혼일보 편집국</p>
            <h2>오늘도 두 사람을<br /><em>과하게 보도합니다</em></h2>
          </div>
          <p className="extra-deck">중요한 소식은 반복해서 읽어야 합니다.<br />특히 한원영·이나경에 관한 소식이라면.</p>
        </div>
        <Rule className="extra-rule" />

        <div className="extra-layout">
          <article className="editorial-column" data-reveal="column">
            <p className="article-label">EDITORIAL / 오늘의 사설</p>
            <h3>{extraDesk[0][1]}</h3>
            <p className="editorial-quote">“이제는 두 사람의 다음 장면을 독자들이 직접 목격해야 한다.”</p>
            <p className="editorial-copy">{extraDesk[0][2]}</p>
            <div className="article-byline">결혼일보 편집국 만장일치 · 패러디 사설</div>
          </article>

          <div className="extra-briefs" data-reveal="column">
            {extraDesk.slice(1, 3).map(([label, title, copy], index) => (
              <article className={`extra-brief extra-brief-${index + 1}`} key={label}>
                <p className="article-label">{label}</p>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>

          <aside className="editorial-note" data-reveal="column">
            <p className="article-label">편집국 메모</p>
            <p>이 지면에서 가장 객관적인 사실은 단 하나입니다.</p>
            <strong>둘이 함께 있으면<br />주변이 좋아진다.</strong>
            <span>— 현장 목격자 일동</span>
          </aside>
        </div>

        <section className="celebrity-photo-wire" data-reveal="column">
          <div className="photo-wire-heading">
            <div>
              <p className="article-label">PHOTO WIRE / WORLD DESK</p>
              <h3>축복의 표정들,<br /><em>사진으로 먼저 도착</em></h3>
            </div>
            <p>실제 축하·지지·연락이 아닙니다.<br />사진과 이름을 빌린 허구의 패러디입니다.</p>
          </div>
          <div className="photo-wire-grid">
            {celebrityPhotos.map((person, index) => (
              <figure className={`photo-wire-item photo-wire-item-${index + 1}`} key={person.name}>
                <div className="photo-wire-image"><img src={person.image} alt={`${person.name} 사진`} /></div>
                <figcaption>
                  <strong>{person.name} / {person.angle}</strong>
                  <span>{person.caption}</span>
                  <a href={person.source} target="_blank" rel="noreferrer">출처: {person.credit} ↗</a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="extra-bottom-grid">
          <article className="extra-brief extra-brief-standalone" data-reveal="column">
            <p className="article-label">{extraDesk[3][0]}</p>
            <h3>{extraDesk[3][1]}</h3>
            <p>{extraDesk[3][2]}</p>
          </article>
          <aside className="classified-strip" data-reveal="column">
            <p className="article-label">구인·구혼·구독 / CLASSIFIED</p>
            <h3>한원영·이나경<br /><em>평생 이용권</em></h3>
            <p>조건: 서로를 계속 좋아할 것.<br />혜택: 매일의 편, 평생의 동료, 가족식 초대.</p>
            <span>문의: 두 사람에게 직접</span>
          </aside>
        </div>
        <div className="page-bottomline"><span>중간면 끝</span><span>다음 면: 사진과 연애 연표</span></div>
      </section>

      <section className="feature-page section-pad" id="feature" data-reveal="page">
        <PageFolio page="3면" topics="PHOTO / ARCHIVE / LONG READ" />
        <SectionHead className="feature-section-head" label="FEATURE / PHOTO JOURNAL" title={<>다음 장면은 <span>기록된다</span></>} note={<>사진 한 장과 연애 연표를<br />하나의 특집 기사로 엮었습니다.</>} />
        <Rule className="feature-rule" />
        <div className="feature-layout">
          <article className="photo-story" data-reveal="column">
            <figure className="photo-feature">
              <img data-parallax="photo" src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1100&q=85" alt="결혼식장에 놓인 꽃과 의자" />
              <figcaption>▲ 두 사람이 함께 앉을 자리. 이날의 가장 중요한 배경이 됩니다.</figcaption>
            </figure>
            <div className="photo-story-copy">
              <div>
                <p className="article-label">PHOTO NOTE / FILE NO. 1017</p>
                <h3>좋은 소식은<br />자꾸 읽고 싶어진다</h3>
              </div>
              <p>꽃이 놓이고, 의자가 준비되고, 하객의 메시지가 쌓인다. 두 사람의 다음 장은 거창한 선언보다 이런 작은 장면들로 시작된다.</p>
            </div>
          </article>

          <aside className="archive-column" data-reveal="column">
            <p className="article-label">ARCHIVE / SAMPLE DATA</p>
            <h3>두 사람의<br /><em>연애 연표</em></h3>
            <div className="timeline-list">
              {timeline.map(([date, title, copy]) => (
                <div className="timeline-row" key={date}>
                  <time>{date}</time>
                  <div><strong>{title}</strong><p>{copy}</p></div>
                </div>
              ))}
            </div>
            <div className="fact-sheet">
              <p className="article-label">초안용 팩트 시트</p>
              <div><strong>10년</strong><span>함께한 시간</span></div>
              <div><strong>1팀</strong><span>앞으로의 생활</span></div>
              <div><strong>∞</strong><span>이어질 이야기</span></div>
            </div>
          </aside>
        </div>
        <div className="page-bottomline"><span>3면 끝</span><span>다음 면: 가족이 꼭 확인할 예식 정보</span></div>
      </section>

      <section className="service-page section-pad" id="details" data-reveal="page">
        <PageFolio page="4면" topics="CITY DESK / FAMILY CEREMONY / NOTE" />
        <SectionHead className="service-section-head" label="SERVICE / CITY DESK" title={<>예식 정보는 <span>마지막 면</span>에</>} note={<>이 면만큼은 패러디 없이<br />가족식 안내만 전합니다.</>} />
        <Rule className="service-rule" />
        <div className="service-layout">
          <div className="venue-block" data-reveal="column">
            <div className="venue-heading"><p className="article-label">VENUE / FACT CHECK</p><h3>오시는 길</h3><span>현장 안내 데스크</span></div>
            <div className="details-layout">
              <div className="map-card" role="img" aria-label="서울 아카이브 홀 약도 예시">
                <div className="map-road road-one" />
                <div className="map-road road-two" />
                <div className="map-road road-three" />
                <div className="map-station">성수역 3번 출구</div>
                <div className="map-pin">서울<br />아카이브 홀</div>
                <div className="map-compass">N<br /><span>↑</span></div>
              </div>
              <div className="schedule-sheet">
                {schedule.map(([label, value, note]) => (
                  <div className="schedule-row" key={label}>
                    <span>{label}</span>
                    <div><strong>{value}</strong><small>{note}</small></div>
                  </div>
                ))}
                <div className="button-row">
                  <a className="text-button" href="#details">지도 보기 ↗</a>
                  <a className="text-button light" href="tel:02-1234-5678">전화하기 ↗</a>
                </div>
              </div>
            </div>
          </div>

          <aside className="family-note-panel" id="family-note" data-reveal="column">
            <div className="family-note-stamp" data-reveal="stamp">FAMILY<br />EDITION</div>
            <p className="article-label">FAMILY NOTE / 가족식 안내</p>
            <h3>작은 식사를<br /><em>함께 나눠요.</em></h3>
            <p>50명 남짓한 가족식으로 조용히 진행합니다. 참석 여부를 따로 받지 않고, 오시는 가족에게 감사한 마음을 준비하겠습니다.</p>
            <a className="family-note-button" href="mailto:hello@example.com?subject=한원영%20이나경%20결혼일보%20가족%20축하%20엽서">가족에게 축하 한마디 보내기 <span>→</span></a>
          </aside>
        </div>
      </section>

      <footer className="footer section-pad">
        <Rule />
        <div className="footer-columns">
          <span>결혼일보 · THE COUPLE TIMES</span>
          <span>본 신문은 두 사람 자랑으로 구성됩니다.</span>
          <span>MADE WITH LOVE / 2026</span>
        </div>
        <p className="footer-note">실존 인물의 축하 문구는 모두 가상 패러디이며, 실제 발언이나 지지를 의미하지 않습니다.</p>
      </footer>
    </main>
  );
}
