import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Wedding Edition — 박서준 & 한지우",
  description: "신문의 한 호처럼 기록한 박서준과 한지우의 모바일 청첩장.",
};

const schedule = [
  ["일시", "2026. 10. 17. SATURDAY", "오후 2시"],
  ["장소", "서울 아카이브 홀", "서울 성동구 연무장길 17"],
  ["드레스 코드", "AUTUMN / SOFT BLACK", "편한 마음으로 와주세요"],
];

function Rule({ className = "" }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

export default function Home() {
  return (
    <main className="invitation-shell">
      <div className="paper-grain" aria-hidden="true" />

      <header className="topbar">
        <span>THE WEDDING EDITION</span>
        <span>VOL. 01 / SEOUL</span>
        <a href="#rsvp">RSVP ↘</a>
      </header>

      <section className="masthead section-pad">
        <div className="issue-line">
          <span>토요일에 발행되는 아주 사적인 신문</span>
          <span>2026년 10월 17일</span>
        </div>
        <Rule />
        <div className="masthead-row">
          <p className="kicker">SPECIAL EDITION</p>
          <p className="edition-mark">NO. 001</p>
        </div>
        <h1>
          <span>우리,</span>
          <em>결혼합니다.</em>
        </h1>
        <div className="headline-meta">
          <span>박서준</span>
          <span className="ampersand">&amp;</span>
          <span>한지우</span>
        </div>
        <Rule />
        <div className="masthead-bottom">
          <p>
            오래 만나온 두 사람이
            <br />
            한 편의 생활을 시작합니다.
          </p>
          <a className="scroll-cue" href="#story">
            아래로 읽기 <span>↓</span>
          </a>
        </div>
      </section>

      <section className="cover-news section-pad" id="story">
        <div className="section-label">
          <span>01 / THE LEAD</span>
          <span>두 사람의 첫 페이지</span>
        </div>
        <Rule />
        <div className="cover-grid">
          <div className="cover-copy">
            <p className="eyebrow">BREAKING NEWS</p>
            <h2>5년 연애 끝에<br />한 집에서 만나요</h2>
            <p className="article-dek">
              서로의 하루를 가장 먼저 묻는 사람이 되어, 이제는 같은 주소로
              계절을 보내려 합니다.
            </p>
            <div className="byline">By. 우리의 오래된 친구들</div>
          </div>
          <figure className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
              alt="서로 마주 보고 웃는 신랑 신부"
            />
            <figcaption>▲ 2026년 어느 초가을 오후, 우리답게</figcaption>
          </figure>
        </div>
        <div className="ticker">
          <span>EXTRA!</span>
          <span>둘이 함께 고른 날, 당신에게 가장 먼저 알립니다.</span>
        </div>
      </section>

      <section className="story-section section-pad">
        <div className="section-label">
          <span>02 / OPINION</span>
          <span>편집부의 초대</span>
        </div>
        <Rule />
        <div className="opinion-grid">
          <div className="vertical-note">A LETTER TO YOU</div>
          <div>
            <p className="pull-quote">“서로를 닮아가는 일보다<br />서로의 다름을 좋아하는 일.”</p>
            <Rule className="short-rule" />
            <p className="body-copy">
              저희가 함께한 시간 동안 배운 것은 거창한 약속보다 작은 다정함이
              오래 남는다는 사실이었습니다. 기쁜 날에도, 서툰 날에도 곁을
              내어준 분들을 모시고 그 다음 장을 열고자 합니다.
            </p>
            <p className="body-copy">
              바쁘시더라도 잠시 들러 저희의 새로운 시작을 함께 축하해 주세요.
            </p>
            <p className="signature">서준 &amp; 지우 드림</p>
          </div>
        </div>
      </section>

      <section className="photo-spread section-pad">
        <div className="section-label">
          <span>03 / PHOTO DESK</span>
          <span>함께 모은 장면들</span>
        </div>
        <Rule />
        <div className="photo-grid">
          <figure className="photo-card photo-card-tall">
            <img
              src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=85"
              alt="부케를 들고 있는 신부"
            />
            <figcaption>01 / THE BRIDE</figcaption>
          </figure>
          <figure className="photo-card photo-card-wide">
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1100&q=85"
              alt="결혼식장에 놓인 꽃과 의자"
            />
            <figcaption>02 / A PLACE FOR US</figcaption>
          </figure>
          <div className="photo-note">
            <span>WE SAVE</span>
            <strong>THE<br />LITTLE<br />THINGS.</strong>
            <span>AND THIS DAY.</span>
          </div>
        </div>
      </section>

      <section className="details-section section-pad" id="details">
        <div className="section-label">
          <span>04 / CITY DESK</span>
          <span>예식 안내</span>
        </div>
        <Rule />
        <div className="details-grid">
          <div className="details-intro">
            <p className="eyebrow">SAVE THE DATE</p>
            <h2>가을의<br /><span>중간에서</span><br />만나요.</h2>
            <p>2026. 10. 17. SAT</p>
          </div>
          <div className="schedule-list">
            {schedule.map(([label, value, note]) => (
              <div className="schedule-row" key={label}>
                <span className="schedule-label">{label}</span>
                <div>
                  <strong>{value}</strong>
                  <small>{note}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="location-section section-pad" id="location">
        <div className="section-label">
          <span>05 / LOCAL NEWS</span>
          <span>오시는 길</span>
        </div>
        <Rule />
        <div className="location-grid">
          <div className="map-card" role="img" aria-label="서울 아카이브 홀 약도 예시">
            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />
            <div className="map-station">성수역</div>
            <div className="map-pin">서울<br />아카이브 홀</div>
            <div className="map-compass">N<br /><span>↑</span></div>
          </div>
          <div className="location-copy">
            <p className="eyebrow">SEOUL ARCHIVE HALL</p>
            <h2>서울 성동구<br />연무장길 17</h2>
            <p>성수역 3번 출구에서 도보 7분<br />건물 2층, 주차 2시간 지원</p>
            <div className="button-row">
              <a className="text-button" href="#location">지도 보기 ↗</a>
              <a className="text-button dark" href="tel:02-1234-5678">전화하기 ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="rsvp-section section-pad" id="rsvp">
        <div className="rsvp-stamp">PLEASE<br />JOIN US</div>
        <p className="eyebrow">THE LAST COLUMN</p>
        <h2>당신의 하루에<br /><em>저희를 초대해 주세요.</em></h2>
        <p className="rsvp-copy">
          참석 여부를 미리 알려주시면 정성껏 자리를 준비하겠습니다.
        </p>
        <a className="rsvp-button" href="mailto:hello@example.com?subject=박서준%20한지우%20결혼식%20참석%20여부">
          참석 여부 전하기 <span>→</span>
        </a>
      </section>

      <footer className="footer section-pad">
        <Rule />
        <div>
          <span>THE WEDDING EDITION</span>
          <span>MADE WITH LOVE, 2026</span>
        </div>
      </footer>
    </main>
  );
}
