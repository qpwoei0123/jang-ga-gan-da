import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "결혼일보 — 박서준·한지우 특집호",
  description: "두 사람의 결혼을 대서특필한 부부 전용 패러디 신문.",
};

const schedule = [
  ["일시", "2026. 10. 17. (토) 오후 2시", "식전 사진 촬영은 1시 20분부터"],
  ["장소", "서울 아카이브 홀 2층", "서울 성동구 연무장길 17"],
  ["교통", "성수역 3번 출구 도보 7분", "주차 2시간 지원"],
];

const timeline = [
  ["2021. 04", "첫 만남", "친구들의 증언에 따르면 이날부터 이미 서로를 찾기 시작했다."],
  ["2022. 08", "여름 휴가", "사진 842장 중 서로 찍은 사진이 811장으로 확인됐다."],
  ["2024. 12", "동거 논의", "양가 냉장고의 김치 위치를 합의하며 사실상 한 팀이 됐다."],
  ["2026. 06", "결혼 전격 발표", "주변 지인 전원 ‘드디어’라는 반응을 보였다."],
];

const celebrityDesk = [
  ["도널드 트럼프", "이 결혼은 역사상 가장 위대하다. 두 사람 모두 아주 훌륭하다."],
  ["테일러 스위프트", "Love Story가 현실이 된 순간. 이제 이 노래의 주인공은 두 사람이다."],
  ["데이비드 베컴", "두 사람의 팀워크라면 어떤 연장전도 이겨낼 수 있다."],
  ["BTS RM", "서로의 문장이 되어, 오래도록 좋은 문장을 써 내려가길."],
  ["아이유", "좋은 날, 좋은 사람, 좋은 소식. 이보다 더 완벽한 조합은 없다."],
  ["손흥민", "평생 원팀으로 뛰는 두 분의 앞날을 진심으로 응원한다."],
  ["라이언 레이놀즈", "신랑의 유머가 제 유머를 이길 가능성은… 결혼을 축하합니다."],
  ["비욘세", "싱글 레이디 시대의 종료를 공식 선언합니다. 두 분은 이미 완벽한 듀오."],
  ["유재석", "두 분이 행복하면 저도 행복합니다. 이건 진짜 뉴스입니다."],
];

function Rule({ className = "" }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

function Article({
  label,
  title,
  children,
  className = "",
}: {
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`newspaper-article ${className}`}>
      <p className="article-label">{label}</p>
      <h3>{title}</h3>
      {children}
      <p className="article-byline">결혼일보 특별취재팀</p>
    </article>
  );
}

export default function Home() {
  return (
    <main className="invitation-shell">
      <div className="paper-grain" aria-hidden="true" />

      <header className="utility-bar">
        <span>가상 패러디 특집 · 실제 보도 아님</span>
        <span>2026년 10월 17일 토요일</span>
        <a href="#rsvp">독자 엽서 보내기 ↘</a>
      </header>

      <section className="newspaper-header section-pad" id="top">
        <div className="weather-line">
          <span>SEOUL / 맑음 / 행복 확률 100%</span>
          <span>제1호 · 가격: 축복 한마디</span>
          <span>ISSN 2026-1017</span>
        </div>
        <Rule />
        <div className="masthead-lockup">
          <span className="masthead-side">THE COUPLE<br />TIMES</span>
          <h1>결혼일보</h1>
          <span className="masthead-side masthead-right">SPECIAL<br />WEDDING ISSUE</span>
        </div>
        <div className="paper-deck">
          <strong>두 사람이 만났고, 모두가 기다렸으며, 마침내 오늘의 1면이 완성됐다.</strong>
          <span>박서준 &amp; 한지우의 결혼을 둘러싼 모든 소식</span>
        </div>
        <div className="breaking-strip">
          <span>긴급속보</span>
          <strong>박서준·한지우, 5년 열애 끝 결혼 전격 발표… 지인들 “이제야?”</strong>
          <span className="breaking-time">14:00 UPDATED</span>
        </div>

        <div className="front-page-grid">
          <article className="lead-story">
            <p className="article-label">1면 톱기사 / EXCLUSIVE</p>
            <h2>박서준·한지우,<br /><em>결혼을 선언하다</em></h2>
            <p className="lead-summary">
              서로의 하루를 가장 먼저 묻던 두 사람이 이제 서로의 내일을 가장 먼저
              책임지기로 했다. 전문가들은 이를 “매우 적절하고 아름다운 결정”이라고 평가했다.
            </p>
            <Rule className="short-rule" />
            <p className="dense-copy">
              두 사람은 오는 10월 17일 서울 아카이브 홀에서 결혼식을 올린다. 관계자에 따르면
              신랑은 신부의 웃음소리를, 신부는 신랑의 성실함을 결혼 사유로 꼽았다. 취재진이
              “서로의 단점은 무엇이냐”고 묻자 두 사람은 7초간 웃은 뒤 “그런 건 아직 발견하지 못했다”고 답했다.
            </p>
            <div className="article-byline">취재: 결혼일보 공동취재단 · 사진: 샘플 이미지</div>
          </article>

          <figure className="front-page-photo">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
              alt="서로 마주 보고 웃는 신랑 신부"
            />
            <figcaption>▲ 결혼을 앞둔 박서준·한지우. 두 사람은 “평소처럼 웃고 있던 것”이라고 밝혔다.</figcaption>
          </figure>

          <aside className="wire-column">
            <p className="article-label">WORLD WIRE / 가상 패러디</p>
            <h3>도널드 트럼프가<br />신랑신부를 축복!</h3>
            <p className="wire-quote">“이 결혼은 역사상 가장 위대하다. 두 사람 모두 아주 훌륭하고, 정말 아름다운 결혼이다.”</p>
            <p className="tiny-note">※ 실제 발언이 아닌 결혼일보의 가상 패러디 기사입니다.</p>
            <Rule />
            <p className="article-label">오늘의 결혼 지수</p>
            <div className="index-row"><span>서로를 보는 눈빛</span><strong>∞%</strong></div>
            <div className="index-row"><span>친구들의 질투</span><strong>93%</strong></div>
            <div className="index-row"><span>웃음 발생 가능성</span><strong>100%</strong></div>
            <div className="index-row"><span>평생 함께할 확률</span><strong>확정</strong></div>
          </aside>
        </div>
      </section>

      <section className="news-desk section-pad">
        <div className="desk-heading">
          <div>
            <p className="article-label">NATION · SOCIETY · CULTURE</p>
            <h2>전국이 들썩인 <span>결혼 소식</span></h2>
          </div>
          <p>속보를 가장한 주접을<br />빠짐없이 전합니다.</p>
        </div>
        <Rule />
        <div className="three-column-grid">
          <Article label="사회 / 단독" title="친구들, ‘둘은 이미 오래전부터 부부였다’ 증언">
            <p>“같이 메뉴 고르는 데 40분, 서로의 남은 음식 양보하는 데 2초.” 친구들은 두 사람이 이미 생활의 모든 면에서 완벽한 팀이었다고 전했다.</p>
            <p>한 친구는 “결혼식이 늦게 열리는 바람에 오히려 우리가 기다렸다”고 덧붙였다.</p>
          </Article>
          <Article label="기상 / 특보" title="기상청, 예식 당일 ‘맑음’ 예보">
            <p>당일 서울은 대체로 맑고, 신랑신부가 등장하는 시간대에는 구름도 잠시 비켜갈 전망이다. 바람은 하객들의 박수에 밀려 약해질 수 있다.</p>
            <p className="red-note">행복 체감온도: 36.5℃ 이상</p>
          </Article>
          <Article label="국제 / 가상 패러디" title="UN 사랑위원회, 두 사람을 ‘올해의 커플’로 선정">
            <p>위원회는 “서로의 다름을 귀여워하는 태도가 국제 평화에 기여했다”며 만장일치로 선정 이유를 밝혔다.</p>
            <p className="tiny-note">※ 존재하지 않는 위원회와 가상 패러디 기사입니다.</p>
          </Article>
          <Article label="경제 / 분석" title="한지우의 미소, 주변 소비심리 4분기 연속 상승">
            <p>신부가 웃는 순간 주변 사람들의 축하 선물 구매 의향이 급증하는 현상이 관측됐다. 신랑의 다정한 대답 역시 시장에 긍정적 영향을 준 것으로 조사됐다.</p>
          </Article>
          <Article label="스포츠 / 현장" title="양가 대표 선수들, 결혼이라는 한 팀에 합류">
            <p>양가 가족은 “두 선수가 서로의 장점을 살려 장기전에서도 안정적인 경기력을 보여줄 것”이라고 전망했다. 주전 포지션은 사랑과 배려로 확인됐다.</p>
          </Article>
          <Article label="동물 / 목격담" title="옆집 강아지, 두 사람을 보자 꼬리 7회 흔들어">
            <p>현장에 있던 강아지는 별다른 설명 없이 두 사람 사이를 한 차례 왕복했다. 전문가들은 이를 “인간 사이의 좋은 기운을 감지한 행동”으로 해석했다.</p>
          </Article>
        </div>
        <div className="quote-ribbon">
          <span>속보</span>
          <strong>“둘이 결혼하면 주변 사람들까지 더 다정해진다” — 익명의 모든 하객</strong>
          <span>계속</span>
        </div>
      </section>

      <section className="opinion-desk section-pad">
        <div className="desk-heading compact-heading">
          <div>
            <p className="article-label">OPINION / EDITORIAL</p>
            <h2>편집국이 만난 <span>두 사람</span></h2>
          </div>
          <p>칭찬이 편파적일 수 있습니다.<br />그러나 사실에 가깝습니다.</p>
        </div>
        <Rule />
        <div className="opinion-grid">
          <article className="editorial-column">
            <h3>사설: 이 결혼을<br /><em>허락해야 하는 이유</em></h3>
            <p>첫째, 두 사람이 서로를 볼 때 주변 공기가 좋아진다. 둘째, 같이 있을 때 각자의 표정이 더 편안해진다. 셋째, 이 소식을 들은 우리 모두가 괜히 기분이 좋아진다.</p>
            <p>이는 결혼이 당사자 둘만의 사건이 아니라 가까운 사람들의 일상까지 조금 더 좋은 방향으로 움직이는 사회적 현상임을 의미한다.</p>
            <p>따라서 결혼일보 편집국은 두 사람의 결혼을 적극 지지하며, 앞으로도 매일의 작은 행복을 1면에 싣기로 결정한다.</p>
            <p className="signature">— 편집국장 겸 열렬한 친구 일동</p>
          </article>
          <div className="interview-stack">
            <div className="quote-interview">
              <p className="article-label">Q. 신랑의 가장 큰 장점은?</p>
              <p>“말보다 행동이 빠르고, 행동보다 마음이 더 빠른 사람입니다.”</p>
              <small>— 신부 한지우, 예비 배우자 인터뷰</small>
            </div>
            <div className="quote-interview red-paper">
              <p className="article-label">Q. 신부를 한 단어로 표현하면?</p>
              <p>“제가 매일 다시 좋아하게 되는 사람.”</p>
              <small>— 신랑 박서준, 질문 직후 0.4초 만에 답변</small>
            </div>
            <div className="quote-interview">
              <p className="article-label">Q. 하객에게 하고 싶은 말은?</p>
              <p>“와주시는 것만으로도 저희의 하루가 완성됩니다. 그리고 많이 웃어주세요.”</p>
            </div>
          </div>
        </div>
      </section>

      <section className="celebrity-desk section-pad">
        <div className="desk-heading compact-heading">
          <div>
            <p className="article-label">CELEBRITY DESK / 가상 패러디</p>
            <h2>세계 유명인들의 <span>축복 릴레이</span></h2>
          </div>
          <p>실제 축하 메시지가 아닙니다.<br />그러나 마음만큼은 진짜입니다.</p>
        </div>
        <Rule />
        <div className="celebrity-grid">
          {celebrityDesk.map(([name, quote], index) => (
            <article className={`celebrity-entry celebrity-entry-${index % 3}`} key={name}>
              <span className="celebrity-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{name}</h3>
                <p>“{quote}”</p>
                <small>가상 축하 코멘트 · 결혼일보 편집부 각색</small>
              </div>
            </article>
          ))}
        </div>
        <div className="celebrity-footer">다음 호 예고: 하객 명단에 오르고 싶다는 유명인들의 문의가 이어지고 있습니다.</div>
      </section>

      <section className="photo-desk section-pad">
        <div className="desk-heading compact-heading">
          <div>
            <p className="article-label">PHOTO JOURNAL</p>
            <h2>현장 사진부의 <span>단독 기록</span></h2>
          </div>
          <p>사진은 샘플입니다.<br />실제 사진으로 교체해 주세요.</p>
        </div>
        <Rule />
        <div className="photo-spread">
          <figure className="photo-feature">
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1100&q=85"
              alt="결혼식장에 놓인 꽃과 의자"
            />
            <figcaption>▲ 두 사람이 함께 앉을 자리. 취재진은 벌써부터 자리가 꽉 찰 것으로 예상했다.</figcaption>
          </figure>
          <div className="photo-copy">
            <p className="article-label">사진 옆 칼럼</p>
            <h3>좋은 소식은<br />자꾸 읽고 싶어진다</h3>
            <p>한 장의 사진 안에 두 사람의 지난 계절과 앞으로의 계절이 함께 들어 있다. 꽃은 피고, 의자는 준비되고, 하객의 휴대전화에는 벌써 축하 메시지가 쌓이는 중이다.</p>
            <p>결혼일보는 이 장면을 ‘아주 평범해서 더 오래 기억될 순간’으로 분류했다.</p>
            <div className="photo-caption-box">FILE NO. 1017<br />LOVE / ARCHIVE / A-01</div>
          </div>
        </div>
      </section>

      <section className="numbers-desk section-pad">
        <div className="desk-heading compact-heading">
          <div>
            <p className="article-label">DATA / ARCHIVE</p>
            <h2>숫자로 보는 <span>우리의 역사</span></h2>
          </div>
          <p>통계는 다정하게<br />편집되었습니다.</p>
        </div>
        <Rule />
        <div className="numbers-layout">
          <div className="timeline-list">
            {timeline.map(([date, title, copy]) => (
              <div className="timeline-row" key={date}>
                <time>{date}</time>
                <div><strong>{title}</strong><p>{copy}</p></div>
              </div>
            ))}
          </div>
          <div className="fact-sheet">
            <p className="article-label">오늘의 핵심 수치</p>
            <div className="fact-number"><strong>1</strong><span>평생 함께할 팀</span></div>
            <Rule />
            <div className="fact-number"><strong>2</strong><span>서로를 가장 잘 아는 사람</span></div>
            <Rule />
            <div className="fact-number"><strong>∞</strong><span>앞으로 쌓일 이야기</span></div>
          </div>
          <div className="classifieds">
            <p className="article-label">결혼일보 생활광고</p>
            <h3>구함: 오래 웃을 사람</h3>
            <p>조건: 서로의 편이 되어줄 것. 가끔 맛있는 것을 양보할 것. 바쁜 날에도 안부를 물을 것. 이미 구함 완료.</p>
            <Rule />
            <h3>판매완료: 싱글 라이프</h3>
            <p>상태 매우 양호. 두 사람의 새로운 생활로 무상 양도됨. 환불 및 교환 불가.</p>
          </div>
        </div>
      </section>

      <section className="details-desk section-pad" id="details">
        <div className="desk-heading compact-heading">
          <div>
            <p className="article-label">CITY DESK / INFORMATION</p>
            <h2>예식 정보 <span>정확히 읽기</span></h2>
          </div>
          <p>이 면만큼은<br />사실을 전합니다.</p>
        </div>
        <Rule />
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
            <p className="article-label">FACT CHECK</p>
            {schedule.map(([label, value, note]) => (
              <div className="schedule-row" key={label}>
                <span>{label}</span>
                <div><strong>{value}</strong><small>{note}</small></div>
              </div>
            ))}
            <div className="button-row">
              <a className="text-button" href="#details">지도 보기 ↗</a>
              <a className="text-button dark" href="tel:02-1234-5678">전화하기 ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="rsvp-section section-pad" id="rsvp">
        <div className="rsvp-stamp">PLEASE<br />JOIN US</div>
        <p className="article-label">READER RESPONSE / 독자 엽서</p>
        <h2>이 신문의<br /><em>마지막 문장을 함께 써주세요.</em></h2>
        <p className="rsvp-copy">참석 여부를 미리 알려주시면 두 사람과 편집국이 정성껏 자리를 준비하겠습니다.</p>
        <a className="rsvp-button" href="mailto:hello@example.com?subject=박서준%20한지우%20결혼일보%20독자%20엽서">
          축하 메시지와 참석 여부 보내기 <span>→</span>
        </a>
      </section>

      <footer className="footer section-pad">
        <Rule />
        <div className="footer-columns">
          <span>결혼일보 · THE COUPLE TIMES</span>
          <span>본 신문은 두 사람 자랑으로 가득 차 있습니다.</span>
          <span>MADE WITH LOVE / 2026</span>
        </div>
        <p className="footer-note">가상 패러디 기사에 등장하는 인물·기관·수치는 실제 사실이나 발언을 의미하지 않습니다.</p>
      </footer>
    </main>
  );
}
