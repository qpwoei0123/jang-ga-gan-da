"use client";

import type { ReactNode } from "react";
import AssetGate from "./asset-loader";
import { INTERACTION_SOUNDS } from "./audio-bank";
import NewspaperDelivery from "./newspaper-delivery";

const INVITATION_ASSETS = [
  "/paper-crumple.png",
  "/dog-run-sprite-ddui-timid.webp",
  "/will-smith-original.png",
  "/couple-sample.webp",
  "/venue-sample.webp",
  ...INTERACTION_SOUNDS,
] as const;

const friendNotes = [
  ["친구 제보 01", "결혼 발표, 사실상 뒤늦은 신고", "둘은 이미 서로의 주문을 대신하고 메뉴판도 한 장만 본다. 결혼은 새 소식이다. 생활은 오래전부터 그랬다."],
  ["친구 제보 02", "한 명 웃으면 다른 한 명도 웃음", "원영이 먼저 웃어도 나경이 먼저 웃어도 잠시 뒤엔 둘 다 웃고 있다. 옆 사람만 영문을 모른다."],
  ["친구 제보 03", "축하보다 먼저 나온 말, ‘드디어’", "결혼 소식을 들은 지인들은 한 박자 쉬고 ‘드디어’라고 했다. 본지도 그대로 적는다."],
];

const extraDesk = [
  ["사설 / EDITORIAL", "10년이면 승인 도장 찍을 때도 됐다", "본지는 2016년부터 두 사람을 지켜봤다. 10년이면 기사는 충분하다. 편집국의 결론도 길지 않았다. 결혼 승인."],
  ["속보 / CITY DESK", "저녁 메뉴 결정권, 여전히 공동 소유", "‘아무거나’와 ‘진짜 아무거나’가 같은 말인지를 두고 협상은 계속됐다. 결론은 못 냈다. 관계에는 별문제 없다."],
  ["생활 / HOME FILE", "각자의 물건, 국경 없이 왕래 중", "충전기, 겉옷, 먹다 남긴 간식. 누구 것인지 따지기 시작하면 대화가 길어진다. 둘은 대체로 그냥 쓴다."],
  ["검증 / FACT CHECK", "‘드디어’는 과장된 표현인가", "가족과 친구에게 확인했다. 놀랐다는 사람보다 ‘이제 하네’라고 말한 사람이 많았다. ‘드디어’는 과장이 아니었다."],
];

const timeline = [
  ["2016. 04", "장기취재 시작", "같은 사진에 둘이 자주 찍히기 시작했다. 그때는 이 기사가 10년짜리일 줄 아무도 몰랐다."],
  ["2022. 08", "사진첩 과밀", "여행 사진을 넘기면 둘 중 한 명은 꼭 나온다. 정작 풍경만 찍힌 사진은 드물다."],
  ["2024. 12", "물건의 국경 소멸", "‘각자의 집’이라는 말이 슬슬 어색해졌다. 충전기는 사실상 공용이다."],
  ["2026. 06", "특종 확정", "결혼 소식을 전했다. 가족과 친구는 놀라는 대신 고개부터 끄덕였다."],
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

function WeddingNewspaper() {
  return (
    <>
      <NewspaperDelivery />
      <main className="invitation-shell">
        <div className="paper-grain" aria-hidden="true" />

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
          <strong>2016년 첫 만남, 2026년 결혼. 속보치고는 취재가 길었다.</strong>
          <span>한원영 &amp; 이나경의 결혼 소식</span>
        </div>
        <div className="breaking-strip">
          <span className="breaking-label">긴급속보</span>
          <div className="breaking-marquee">
            <div className="breaking-track">
              <span className="breaking-item">
                한원영·이나경, 10년 연애 끝 결혼 발표… 가족들 “이제야?”
                <small>14:00 UPDATED</small>
              </span>
              <span className="breaking-item" aria-hidden="true">
                한원영·이나경, 10년 연애 끝 결혼 발표… 가족들 “이제야?”
                <small>14:00 UPDATED</small>
              </span>
            </div>
          </div>
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
            <h2>한원영·이나경,<br /><em>진짜 결혼한다</em></h2>
            <p className="lead-summary">연애 10년. 더 미룰 명분은 없다. 두 사람은 올가을 가족 앞에서 결혼한다.</p>
            <Rule className="short-rule" />
            <p className="dense-copy">본지가 10년 동안 쫓던 한원영·이나경 소식이 드디어 마감됐다. 두 사람은 오는 10월 17일 결혼식을 올린다. 가족들은 “축하한다”와 “이제야”를 거의 동시에 말했다. 당사자들은 웃기만 했다.</p>
            <div className="article-byline">취재: 결혼일보 장기취재팀 · 사진: 초안용 샘플</div>
          </article>

          <figure className="front-page-photo">
            <img src="/couple-sample.webp" alt="서로 마주 보고 웃는 신랑 신부" width="1000" height="667" />
            <figcaption>▲ 보도용 샘플 사진. 주인공 사진이 들어오는 대로 바꾼다.</figcaption>
          </figure>

          <aside className="wire-column">
            <p className="article-label">장기취재 / LOCAL WIRE</p>
            <h3>가족들 첫 반응<br />축하보다 “이제야”</h3>
            <p className="wire-quote">“놀랍지는 않고 반갑다.”</p>
            <p className="tiny-note">가족과 주변인의 반응을 종합한 가상 패러디 기사.</p>
            <Rule />
            <p className="article-label">오늘의 핵심</p>
            <div className="index-row"><span>결혼식</span><strong>2026.10.17</strong></div>
            <div className="index-row"><span>신랑·신부</span><strong>한원영 &amp; 이나경</strong></div>
            <div className="index-row"><span>독자 행동요령</span><strong>웃고 축하하기</strong></div>
          </aside>
        </div>
      </section>

      <section className="people-page section-pad" id="people">
        <PageFolio page="2면" topics="PEOPLE / SOCIAL / PRIVATE FILE" />
        <SectionHead className="people-section-head" label="PEOPLE DESK / FIELD REPORT" title={<>제보는 많았고<br /><span>새로울 건 없었다</span></>} note={<>친구들 말을 모아봤다.<br />대체로 같은 얘기였다.</>} />
        <Rule className="people-rule" />
        <div className="people-layout">
          <div className="friend-report">
            <article className="friend-lead">
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
            <article className="gd-dream-story">
              <div>
                <p className="article-label">연예 / 단독 / 가상 패러디</p>
                <h3>이나경, ‘GD와 결혼’ 목표 무산… 아쉬움 감추지 못해</h3>
              </div>
              <p>이나경의 목표는 GD와 결혼하는 것이었다. 하지만 한원영과 결혼을 앞둔 지금, 이 목표는 접게 됐다. 나경은 못내 아쉬워하고 있다. 그렇다고 예식이 취소되는 건 아니다.</p>
              <div className="article-byline">결혼일보 연예부 확인 / 실제 보도 아님</div>
            </article>
          </div>

        </div>
        <div className="page-bottomline"><span>2면 끝</span><span>다음 면: 편집국의 과도한 편파보도</span></div>
      </section>

      <section className="extra-page section-pad" id="extra">
        <PageFolio page="2면 하단" topics="EDITORIAL / EXTRA / CRITIC" />
        <div className="extra-masthead">
          <div>
            <p className="article-label">EXTRA EDITION / 결혼일보 편집국</p>
            <h2>본지, 오늘도<br /><em>두 사람만 보도</em></h2>
          </div>
          <p className="extra-deck">사회·생활·평론면을 모두 동원했다.<br />다른 뉴스는 지면 사정으로 뺐다.</p>
        </div>
        <Rule className="extra-rule" />

        <div className="extra-layout">
          <article className="editorial-column">
            <p className="article-label">EDITORIAL / 오늘의 사설</p>
            <h3>{extraDesk[0][1]}</h3>
            <p className="editorial-quote">“연애 10년이면 표본도 충분하다.”</p>
            <p className="editorial-copy">{extraDesk[0][2]}</p>
            <div className="article-byline">결혼일보 편집국 만장일치 · 패러디 사설</div>
          </article>

          <div className="extra-briefs">
            {extraDesk.slice(1, 3).map(([label, title, copy], index) => (
              <article className={`extra-brief extra-brief-${index + 1}`} key={label}>
                <p className="article-label">{label}</p>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>

          <aside className="editorial-note">
            <p className="article-label">편집국 메모</p>
            <p>10년을 봤더니 이건 확실했다.</p>
            <strong>둘이 같이 있으면<br />둘 다 더 웃긴다.</strong>
            <span>현장 목격자 일동</span>
          </aside>
        </div>

        <section className="critic-column">
          <div className="critic-heading">
            <div>
              <p className="article-label">CRITIC'S NOTE / 가상 패러디</p>
              <h3>사랑은 완결이 아니라,<br /><em>반복을 견디는 형식에 가깝다</em></h3>
            </div>
            <p>이동진 칼럼을 요청받아 만든 가상 패러디다. 특정 문장이나 실제 원고를 흉내 내지 않았다.</p>
          </div>
          <div className="critic-body">
            <p className="critic-lede">십 년이라는 시간은 관계의 견고함을 입증하는 계량적 근거라기보다, 서로의 결핍을 더는 해명해야 할 사건으로 취급하지 않게 되는 완만한 이행에 가깝다. 한원영과 이나경은 서로를 완전히 이해해서 여기까지 온 것이 아니다. 이해되지 않는 부분을 성급히 오독하지 않는 법을 익혔고, 그 유예의 시간이 십 년이었다.</p>
            <blockquote>“사랑은 이해의 완성이 아니라, 오독을 유예하는 기술인지도 모른다.”</blockquote>
            <div className="critic-copy">
              <p>결혼은 연애의 종결점으로 오해되기 쉽다. 두 사람에게는 이미 반복되어 온 선택이 뒤늦게 제도적 문장을 얻는 장면에 더 가깝다. 일상의 사소한 불일치가 사라진 것은 아니다. 사라지지 않은 채 공존할 수 있다는 확신이 생겼다. 사랑의 지속은 합치보다 병치에 의존한다.</p>
              <p>식장에 들어선 뒤에도 달라지는 건 많지 않다. 호칭 하나와 날짜 하나가 생긴다. 완성이라 부르기엔 여전히 진행 중이고, 시작이라 부르기엔 이미 너무 오래 함께했다. 이 결혼은 그 모순을 없애지 않는다. 다만 둘이 같은 방향으로 들고 갈 수 있게 반듯이 접어 둔다.</p>
            </div>
          </div>
          <div className="article-byline critic-byline">글: 결혼일보 비평팀 / 이동진 평론가의 실제 원고 및 발언과 무관</div>
        </section>

        <div className="extra-bottom-grid">
          <article className="extra-brief extra-brief-standalone">
            <p className="article-label">{extraDesk[3][0]}</p>
            <h3>{extraDesk[3][1]}</h3>
            <p>{extraDesk[3][2]}</p>
          </article>
          <aside className="classified-strip">
            <p className="article-label">구인·구혼·구독 / CLASSIFIED</p>
            <h3>평생 동거인<br /><em>모집 마감</em></h3>
            <p>지원자: 한원영·이나경.<br />심사 기간: 10년. 결과: 둘 다 합격.</p>
            <span>재공고 예정 없음</span>
          </aside>
        </div>
        <div className="page-bottomline"><span>중간면 끝</span><span>다음 면: 사진과 연애 연표</span></div>
      </section>

      <section className="feature-page section-pad" id="feature">
        <PageFolio page="3면" topics="PHOTO / ARCHIVE / LONG READ" />
        <SectionHead className="feature-section-head" label="FEATURE / PHOTO JOURNAL" title={<>10년치 기록,<br /><span>아직 끝 안 남</span></>} note={<>사진첩과 기억을 뒤졌다.<br />삭제할 장면은 별로 없었다.</>} />
        <Rule className="feature-rule" />
        <div className="feature-layout">
          <article className="photo-story">
            <figure className="photo-feature">
              <img src="/venue-sample.webp" alt="결혼식장에 놓인 꽃과 의자" width="1100" height="733" />
              <figcaption>▲ 의자는 두 자리. 당일에도 둘은 붙어 앉는다.</figcaption>
            </figure>
            <div className="photo-story-copy">
              <div>
                <p className="article-label">PHOTO NOTE / FILE NO. 1017</p>
                <h3>꽃은 바뀌어도<br />주인공은 확정</h3>
              </div>
              <p>꽃과 좌석은 아직 바뀔 수 있다. 신랑 한원영과 신부 이나경은 확정이다. 지금 이 신문에서 가장 믿을 만한 정보다.</p>
            </div>
          </article>

          <aside className="archive-column">
            <p className="article-label">ARCHIVE / SAMPLE DATA</p>
            <h3>10년 장기취재<br /><em>요약 일지</em></h3>
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
              <div><strong>10년</strong><span>연애 취재 기간</span></div>
              <div><strong>1팀</strong><span>양측 최종 합의</span></div>
              <div><strong>50명</strong><span>가족식 예상 규모</span></div>
            </div>
          </aside>
        </div>
        <div className="page-bottomline"><span>3면 끝</span><span>다음 면: 가족이 꼭 확인할 예식 정보</span></div>
      </section>

      <section className="service-page section-pad" id="details">
        <PageFolio page="4면" topics="CITY DESK / FAMILY CEREMONY / NOTE" />
        <SectionHead className="service-section-head" label="SERVICE / CITY DESK" title={<>날짜·장소는<br /><span>여기서 확인</span></>} note={<>이 면부터는 농담을 줄였다.<br />길 잃으면 안 되니까.</>} />
        <Rule className="service-rule" />
        <div className="service-layout">
          <div className="venue-block">
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

          <aside className="family-note-panel" id="family-note">
            <div className="family-note-stamp">FAMILY<br />EDITION</div>
            <p className="article-label">FAMILY NOTE / 가족식 안내</p>
            <h3>가족끼리 모여<br /><em>밥 먹고 인사드릴게요.</em></h3>
            <p>예식은 50명 남짓한 가족식입니다. 참석 여부는 따로 받지 않습니다. 오시는 가족과 천천히 밥 먹고 인사 나누겠습니다.</p>
            <a className="family-note-button" href="mailto:hello@example.com?subject=한원영%20이나경%20결혼일보%20가족%20축하%20엽서">축하 엽서 보내기 <span>→</span></a>
          </aside>
        </div>
      </section>

      <footer className="footer section-pad">
        <Rule />
        <div className="footer-columns">
          <span>결혼일보 · THE COUPLE TIMES</span>
          <span>본지는 두 사람 편파보도를 원칙으로 합니다.</span>
          <span>MADE WITH LOVE / 2026</span>
        </div>
        <p className="footer-note">실존 인물을 언급한 지면은 모두 가상 패러디이며, 실제 원고나 발언 또는 지지를 의미하지 않습니다.</p>
        </footer>
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
