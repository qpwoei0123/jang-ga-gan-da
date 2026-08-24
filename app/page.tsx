"use client";

import AssetGate from "./asset-loader";
import { INTERACTION_SOUNDS } from "./audio-bank";
import NewspaperDelivery from "./newspaper-delivery";

const INVITATION_ASSETS = [
  "/dog-run-sprite-ddui-timid.webp",
  "/will-smith-original.png",
  "/couple-sample.webp",
  "/venue-sample.webp",
  ...INTERACTION_SOUNDS,
] as const;

const journey = [
  ["2016", "장기취재 시작", "같은 사진에 둘이 자주 등장하기 시작했다."],
  ["2022", "사진첩 과밀", "여행 사진마다 둘 중 한 명은 꼭 나왔다."],
  ["2024", "국경 소멸", "충전기와 겉옷의 소유권이 흐려졌다."],
  ["2026", "결혼 확정", "가족들은 놀라는 대신 고개부터 끄덕였다."],
];

const reports = [
  ["친구 제보 01", "결혼 발표, 사실상 뒤늦은 신고", "둘은 이미 서로의 주문을 대신하고 메뉴판도 한 장만 본다. 결혼은 새 소식이지만 생활은 오래전부터 그랬다."],
  ["친구 제보 02", "한 명 웃으면 다른 한 명도 웃음", "원영이 먼저 웃어도 나경이 먼저 웃어도 잠시 뒤엔 둘 다 웃고 있다. 옆 사람만 영문을 모른다."],
  ["친구 제보 03", "축하보다 먼저 나온 말, ‘드디어’", "소식을 들은 지인들은 한 박자 쉬고 ‘드디어’라고 했다. 편집국도 그대로 적었다."],
];

const puzzleRows = [
  "한원영사랑가족십년",
  "결혼뚜이나경웃음집",
  "서울사진신문약속꽃",
  "가족식간식여행반지",
  "원영이나경드디어밥",
  "십년추억축하예식장",
  "뚜이신문사랑가족식",
  "약속웃음사진결혼꽃",
  "반지여행서울간식집",
  "드디어한원영이나경",
];

const ceremony = [
  ["01", "13:20", "도착", "가족들과 먼저 사진을 찍습니다."],
  ["02", "13:40", "인사", "오랜만에 만난 얼굴들과 천천히 인사합니다."],
  ["03", "14:00", "예식", "한원영과 이나경이 가족 앞에서 약속합니다."],
  ["04", "14:30", "식사", "복잡한 순서 없이 함께 밥을 먹습니다."],
  ["05", "15:30", "사진", "마지막 단체 사진까지 남기고 마칩니다."],
];

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

function WeddingNewspaper() {
  return (
    <>
      <NewspaperDelivery />
      <main className="edition" aria-label="한원영과 이나경의 웨딩 신문">
        <article className="paper-page cover-page" id="top">
          <div className="cover-utility">
            <span>The Grand Hall</span>
            <a href="#family-note">가족식 안내 ↘</a>
          </div>
          <div className="double-rule" aria-hidden="true" />
          <nav className="cover-sections" aria-label="이번 호 목차">
            <a href="#journey">CELEBRATION</a>
            <a href="#people">LOVE</a>
            <a href="#search">TOGETHERNESS</a>
            <a href="#views">FRIENDS</a>
            <a href="#schedule">HAPPINESS</a>
          </nav>
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
          <div className="breaking-wire">
            <strong>긴급속보</strong>
            <div className="breaking-window">
              <div className="breaking-track">
                <span>한원영·이나경, 10년 연애 끝 결혼 발표… 가족들 “이제야?”</span>
                <span aria-hidden="true">한원영·이나경, 10년 연애 끝 결혼 발표… 가족들 “이제야?”</span>
              </div>
            </div>
          </div>
          <figure className="cover-photo">
            <img src="/couple-sample.webp" alt="햇살 아래 부케를 든 신랑 신부" width="1000" height="667" />
            <figcaption><b>EXCLUSIVE</b> 10년을 함께한 두 사람이 2026년 가을 가족 앞에서 결혼한다. 사진은 초안용 샘플.</figcaption>
          </figure>
          <PageBottom next="CONTINUED ON PAGE 02" />
        </article>

        <section className="paper-page journey-page" id="journey">
          <PageTop page="02" section="THE JOURNEY OF US" />
          <figure className="journey-photo">
            <img src="/couple-sample.webp" alt="부케를 함께 든 신랑 신부" width="1000" height="667" />
            <figcaption>2016—2026 / 취재 기간 10년, 결론은 한 팀.</figcaption>
          </figure>
          <div className="journey-heading">
            <div>
              <span>THE</span>
              <h2>JOURNEY</h2>
              <i>of</i>
              <h2>US</h2>
            </div>
            <p>EVERY LOVE STORY IS BEAUTIFUL.<br />BUT OURS IS OUR FAVORITE.</p>
          </div>
          <div className="journey-layout">
            <article className="journey-copy">
              <p className="dropcap">본지가 한원영과 이나경을 처음 포착한 건 2016년이었다. 둘은 대단한 선언 대신 자주 만나고, 함께 먹고, 같은 장면에서 웃었다. 별일 없는 날이 쌓였고 어느새 십 년이 됐다.</p>
              <p>사랑은 처음의 선명한 사건보다 반복되는 작은 선택에 오래 남았다. 서로의 주문을 외우고, 필요한 물건을 챙기고, 대답이 없어도 기다리는 일이 둘의 기록 대부분을 차지한다.</p>
              <p>결혼은 갑작스러운 결론이 아니다. 이미 오래 해오던 선택에 날짜와 이름을 붙이는 일이다. 그래서 가족들의 첫 반응도 놀람보다 “드디어”에 가까웠다.</p>
            </article>
            <aside className="milestone-rail">
              <h3>Milestones<br />Along the Way</h3>
              {journey.map(([year, title, copy]) => (
                <div className="milestone" key={year}>
                  <time>{year}</time>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              ))}
            </aside>
          </div>
          <PageBottom next="PEOPLE & PRIVATE FILE →" />
        </section>

        <section className="paper-page people-page" id="people">
          <PageTop page="03" section="PEOPLE · PRIVATE FILE" />
          <header className="section-masthead compact-masthead">
            <span>The</span>
            <h2>Wedding News</h2>
          </header>
          <div className="people-title">
            <p>FIELD REPORT / 주변인 전언</p>
            <h2>제보는 많았고,<br />새로울 건 없었다</h2>
            <span>친구들 말을 모아봤다. 대체로 같은 얘기였다.</span>
          </div>
          <div className="people-lead-grid">
            <article className="lead-report">
              <span>{reports[0][0]}</span>
              <h3>{reports[0][1]}</h3>
              <p className="dropcap">{reports[0][2]}</p>
              <p>가족과 친구들은 두 사람의 결혼을 새로운 사건이라기보다 늦게 도착한 공식 발표로 받아들였다. 편집국은 이 반응을 “예상 범위 안”으로 분류했다.</p>
              <small>사회부 입수 자료 · 주변인 익명 제보</small>
            </article>
            <figure className="people-photo">
              <img src="/venue-sample.webp" alt="서로 포개진 두 개의 결혼반지" width="1100" height="733" />
              <figcaption>둘이 고른 반지. 소유권은 각자 하나씩이다.</figcaption>
            </figure>
          </div>
          <div className="brief-columns">
            {reports.slice(1).map(([label, title, copy]) => (
              <article key={label}>
                <span>{label}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <article className="culture-brief">
            <span>문화 / 단독 / 가상 패러디</span>
            <h3>이나경, ‘GD와 결혼’ 목표 무산… 아쉬움 감추지 못해</h3>
            <p>이나경의 목표는 GD와 결혼하는 것이었다. 하지만 한원영과 결혼을 앞둔 지금 이 목표는 접게 됐다. 못내 아쉬워하고 있으나, 그렇다고 예식이 취소되는 건 아니다.</p>
            <small>결혼일보 연예부 확인 / 실제 보도 아님</small>
          </article>
          <PageBottom next="THE WEDDING SEARCH →" />
        </section>

        <section className="paper-page search-page" id="search">
          <PageTop page="04" section="GAMES · EDITORIAL" />
          <header className="search-heading">
            <span>특별 부록 / 두 사람을 찾습니다</span>
            <h2>THE WEDDING SEARCH</h2>
            <p>아래 글자판에서 한원영, 이나경, 뚜이, 결혼, 가족, 십년을 찾아보세요.</p>
          </header>
          <div className="puzzle-layout">
            <div className="letter-grid" aria-label="결혼 낱말찾기">
              {puzzleRows.flatMap((row, rowIndex) => [...row].map((letter, columnIndex) => (
                <span key={`${rowIndex}-${columnIndex}`}>{letter}</span>
              )))}
            </div>
            <aside className="answer-bank">
              <h3>FIND</h3>
              <span>한원영</span><span>이나경</span><span>뚜이</span>
              <span>결혼</span><span>가족</span><span>십년</span>
              <p>정답은 두 사람의 사진첩 어딘가에 있습니다.</p>
            </aside>
          </div>
          <div className="search-lower">
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
          </div>
          <PageBottom next="VIEWS / LONG READ →" />
        </section>

        <section className="paper-page views-page" id="views">
          <PageTop page="05" section="VIEWS · LONG READ" />
          <header className="views-heading">
            <span>CRITIC&apos;S NOTE / 가상 패러디</span>
            <h2>사랑은 완결이 아니라,<br /><i>반복을 견디는 형식에 가깝다</i></h2>
          </header>
          <blockquote className="views-quote">“사랑은 이해의 완성이 아니라,<br />오독을 유예하는 기술인지도 모른다.”</blockquote>
          <div className="views-grid">
            <article className="views-copy">
              <p className="dropcap">십 년이라는 시간은 관계의 견고함을 입증하는 계량적 근거라기보다, 서로의 결핍을 더는 해명해야 할 사건으로 취급하지 않게 되는 완만한 이행에 가깝다.</p>
              <p>한원영과 이나경은 서로를 완전히 이해해서 여기까지 온 것이 아니다. 이해되지 않는 부분을 성급히 오독하지 않는 법을 익혔고, 그 유예의 시간이 십 년이었다.</p>
              <p>결혼은 연애의 종결점으로 오해되기 쉽다. 두 사람에게는 이미 반복되어 온 선택이 뒤늦게 제도적 문장을 얻는 장면에 더 가깝다.</p>
              <p>일상의 사소한 불일치가 사라진 것은 아니다. 사라지지 않은 채 공존할 수 있다는 확신이 생겼다. 사랑의 지속은 합치보다 병치에 의존한다.</p>
              <p>완성이라 부르기엔 여전히 진행 중이고, 시작이라 부르기엔 이미 너무 오래 함께했다. 이 결혼은 그 모순을 없애지 않는다. 다만 둘이 같은 방향으로 들고 갈 수 있게 반듯이 접어 둔다.</p>
            </article>
            <aside className="views-side">
              <figure>
                <img src="/couple-sample.webp" alt="햇살 속의 신랑 신부" width="1000" height="667" />
                <figcaption>FILE 1017 / 결혼일보 사진부</figcaption>
              </figure>
              <h3>평생 동거인<br /><i>모집 마감</i></h3>
              <p>지원자: 한원영·이나경<br />심사 기간: 10년<br />결과: 둘 다 합격</p>
            </aside>
          </div>
          <p className="views-disclaimer">이동진 평론가의 실제 원고 및 발언과 무관한 독자적 가상 패러디입니다.</p>
          <PageBottom next="WEDDING SCHEDULE →" />
        </section>

        <section className="paper-page schedule-page" id="schedule">
          <PageTop page="06" section="WEDDING SCHEDULE" />
          <header className="schedule-heading">
            <h2>WEDDING SCHEDULE</h2>
            <p>A FAMILY CEREMONY FOR HAN WON-YOUNG &amp; LEE NA-KYUNG</p>
          </header>
          <ol className="ceremony-flow">
            {ceremony.map(([number, time, title, copy]) => (
              <li key={number}>
                <span className="ceremony-number">{number}</span>
                <time>{time}</time>
                <strong>{title}</strong>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
          <div className="schedule-feature">
            <article>
              <span>TODAY WE CELEBRATE</span>
              <h3>가족끼리 모여<br />밥 먹고 인사드릴게요.</h3>
              <p>거창한 순서보다 서로 얼굴을 오래 보고 이야기하는 시간을 준비했습니다. 참석 여부는 따로 받지 않습니다.</p>
            </article>
            <figure>
              <img src="/couple-sample.webp" alt="예식을 앞둔 신랑 신부" width="1000" height="667" />
              <figcaption>Saturday · October 17 · 2026</figcaption>
            </figure>
          </div>
          <div className="number-strip" aria-label="예식 핵심 숫자">
            <div><strong>10</strong><span>YEARS<br />TOGETHER</span></div>
            <div><strong>50</strong><span>FAMILY<br />GUESTS</span></div>
            <div><strong>1</strong><span>TEAM<br />FOREVER</span></div>
            <div><strong>2</strong><span>PM<br />CEREMONY</span></div>
          </div>
          <PageBottom next="SERVICE DESK →" />
        </section>

        <section className="paper-page details-page" id="details">
          <PageTop page="07" section="SERVICE DESK · FAMILY CEREMONY" />
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
          <PageBottom next="FAMILY NOTE →" />
        </section>

        <section className="paper-page back-page" id="family-note">
          <PageTop page="08" section="FAMILY NOTE · BACK PAGE" />
          <div className="back-dog" role="img" aria-label="신문을 물고 온 뚜이" />
          <div className="back-copy">
            <span>FINAL EDITION / 뚜이 승인 완료</span>
            <h2>끝.<br />이제 밥 먹으러<br />오세요.</h2>
            <p>예식은 50명 남짓한 가족식입니다. 참석 여부는 따로 받지 않습니다. 오시는 가족과 천천히 밥 먹고 인사 나누겠습니다.</p>
            <a href="mailto:hello@example.com?subject=한원영%20이나경%20결혼일보%20가족%20축하%20엽서">축하 엽서 보내기 →</a>
          </div>
          <div className="back-colophon">
            <span>한원영 &amp; 이나경</span>
            <span>2016—2026—FOREVER</span>
            <p>실존 인물을 언급한 지면은 모두 가상 패러디이며 실제 원고·발언·보도와 무관합니다.</p>
          </div>
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
