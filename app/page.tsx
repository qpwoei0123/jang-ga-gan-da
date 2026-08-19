import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "결혼일보 — 박서준·한지우 특집호",
  description: "두 사람의 결혼 소식을 한 부의 신문으로 읽는 모바일 청첩장.",
};

const friendThreads = [
  {
    id: "01",
    author: "ㅇㅇ(118.235)",
    time: "2026.10.17 14:02",
    title: "이거 거의 부부였음",
    body: "커피 주문 서로 외우고 있음. 한 명이 ‘아아?’ 하면 다른 한 명이 이미 결제함. 이 정도면 결혼 발표가 제일 늦은 소식임.",
    recommendation: "28",
    replies: [
      ["ㅇㅇ(211.36)", "ㄹㅇ 이제야 하네", "14:05"],
      ["친구1", "둘이 같이 있으면 주변 사람까지 편해짐", "14:07"],
    ],
  },
  {
    id: "02",
    author: "현장목격자",
    time: "2026.10.17 14:11",
    title: "둘이 붙어 있으면 갑자기 유치해짐",
    body: "각자 있을 땐 멀쩡한데 같이 있으면 서로 놀리고 웃고 난리남. 근데 표정이 둘 다 너무 좋아서 아무도 말릴 생각이 없음.",
    recommendation: "41",
    replies: [
      ["ㅇㅇ(39.7)", "이런 커플 특: 본인들만 모름", "14:13"],
      ["목격자2", "아니 이미 다 알고 있었을 듯", "14:15"],
    ],
  },
  {
    id: "03",
    author: "지인A",
    time: "2026.10.17 14:23",
    title: "결혼한다는데 아무도 안 놀람",
    body: "다들 ‘드디어?’ 이 반응이었음. 축하하는데 놀라지는 않음. 오래 보고 있으면 이렇게 됨. 아무튼 두 분 행복하세요 ㅋㅋ",
    recommendation: "52",
    replies: [
      ["ㅇㅇ(223.62)", "이왜진 아니고 이왜이제진", "14:25"],
      ["친구B", "식장 가서도 드디어라고 할 예정", "14:29"],
    ],
  },
];

const celebrityDesk = [
  ["도널드 트럼프", "이 결혼은 역대급임. 아무튼 위대함."],
  ["테일러 스위프트", "Love Story 이왜진? 오래오래 가세요."],
  ["데이비드 베컴", "평생 원팀 선언. 이건 인정할 수밖에 없음."],
  ["BTS RM", "서로의 문장이 되길. 근데 이미 된 것 같음."],
  ["아이유", "좋은 날에 좋은 사람 둘이 만남. 보기 좋다 ㄹㅇ."],
  ["손흥민", "연장전 없이 평생 승리하시길. 행복 골인 ㄱㄱ."],
  ["유재석", "두 분 일단 행복하세요 ㅋㅋ 이 말이면 충분함."],
];

const timeline = [
  ["2021.04", "첫 만남", "친구들 사이에서 두 사람이 같은 장면에 처음 등장함."],
  ["2022.08", "여름 휴가", "사진 842장 중 서로를 찍은 사진이 811장으로 확인됨."],
  ["2024.12", "생활권 통합", "각자의 냉장고에서 상대방의 물건이 발견되기 시작함."],
  ["2026.06", "결혼 발표", "주변 지인 전원 ‘드디어’라고 말함. 예상된 수순."],
];

const schedule = [
  ["일시", "2026. 10. 17. (토) 오후 2시", "식전 사진 촬영은 1시 20분부터"],
  ["장소", "서울 아카이브 홀 2층", "서울 성동구 연무장길 17"],
  ["교통", "성수역 3번 출구 도보 7분", "주차 2시간 지원"],
];

function Rule({ className = "" }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

function UserMark({ label, accent = "" }: { label: string; accent?: string }) {
  return <span className={`user-mark ${accent}`}>{label.slice(0, 1)}</span>;
}

function ReplyRow({
  author,
  copy,
  time,
  accent = "",
}: {
  author: string;
  copy: string;
  time: string;
  accent?: string;
}) {
  return (
    <div className="reply-row">
      <UserMark label={author} accent={accent} />
      <div>
        <div className="reply-meta"><strong>{author}</strong><time>{time}</time></div>
        <p>{copy}</p>
      </div>
    </div>
  );
}

function SectionBar({
  channel,
  title,
  note,
}: {
  channel: string;
  title: ReactNode;
  note: ReactNode;
}) {
  return (
    <div className="section-bar">
      <div>
        <p className="section-channel">{channel}</p>
        <h2>{title}</h2>
      </div>
      <p className="section-note">{note}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="invitation-shell">
      <div className="paper-grain" aria-hidden="true" />

      <header className="site-chrome">
        <div className="site-chrome-inner">
          <a className="site-logo" href="#top"><span className="logo-mark">결</span> 결혼일보</a>
          <nav className="chrome-nav" aria-label="페이지 메뉴">
            <a href="#friends">사회면</a>
            <a href="#reactions">국제면</a>
            <a href="#details">오시는 길</a>
          </nav>
          <a className="chrome-cta" href="#rsvp">독자 엽서 ↗</a>
        </div>
      </header>

      <section className="community-hero section-pad" id="top">
        <div className="newspaper-masthead">
          <div className="masthead-side">THE COUPLE<br />TIMES</div>
          <div className="masthead-title">결혼일보</div>
          <div className="masthead-side masthead-right">WEDDING EDITION<br />제1호 · 가격: 축복 한마디</div>
        </div>
        <div className="route-line">
          <span>SEOUL / 결혼일보 특집호</span>
          <span>2026.10.17 토요일</span>
          <span>실존 보도 아님 · 초안용 패러디</span>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="post-heading-meta"><span className="tag hot">속보</span><span>1면 톱기사 / 결혼 특집</span></div>
            <h1>박서준·한지우<br /><span>결혼함</span></h1>
            <p className="hero-deck">와 이 둘이 진짜 결혼을 한다고? 주변에서는 이미 부부 취급 중이었는데 이제 식까지 올린다고 함.</p>
            <div className="tag-row"><span>혼인 발표</span><span>지인 제보</span><span>가상 패러디</span></div>
            <div className="thread-stats"><span>조회 2,026</span><span>추천 99</span><span>댓글 34</span><span>공유 ↗</span></div>
            <div className="hero-actions">
              <a className="primary-link" href="#rsvp">독자 엽서 보내기 ↘</a>
              <a className="secondary-link" href="#friends">친구 제보 읽기 ↓</a>
            </div>
          </div>

          <figure className="hero-media">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85" alt="서로 마주 보고 웃는 신랑 신부" />
            <figcaption>▲ 샘플 사진입니다. 실제 커플 사진으로 교체해 주세요.</figcaption>
            <span className="image-note">사진 / 샘플</span>
          </figure>
        </div>

        <article className="lead-thread">
          <div className="post-topline"><span>취재: 결혼일보 공동취재단</span><span>2026.10.17 14:00</span><span>사진: 샘플 이미지</span></div>
          <p>두 사람이 오는 10월 17일 서울 아카이브 홀에서 결혼식을 올립니다. 단점이 뭐냐고 물어봤는데 7초 동안 웃기만 함. 아직 발견 못 한 듯.</p>
          <p>아무튼 둘이 같이 있으면 주변 사람까지 편해지는 효과가 있으니 참석해서 직접 확인 바람.</p>
          <div className="best-reply"><span className="best-label">독자 반응</span><strong>ㅇㅇ(211.36)</strong><p>이 정도면 결혼식이 아니라 정식 업데이트임 ㅋㅋ</p></div>
        </article>
      </section>

      <section className="thread-section section-pad" id="friends">
        <SectionBar channel="SOCIAL DESK / 친구 제보" title={<>친구들이 말하는 <em>두 사람</em></>} note={<>사회면 제보<br />구체적인 목격담</>} />
        <Rule />
        <div className="thread-list">
          {friendThreads.map((thread) => (
            <article className="community-post" key={thread.id}>
              <div className="post-meta">
                <UserMark label={thread.author} accent={thread.id === "02" ? "blue" : ""} />
                <div><strong>{thread.author}</strong><time>{thread.time}</time></div>
                <span className="post-number">#{thread.id}</span>
              </div>
              <h3>{thread.title}</h3>
              <p className="post-body">{thread.body}</p>
              <div className="post-footer"><span>추천 {thread.recommendation}</span><span>댓글 {thread.replies.length}</span><span>공감순</span></div>
              <div className="reply-list">
                {thread.replies.map(([author, copy, time], index) => (
                  <ReplyRow key={`${author}-${time}`} author={author} copy={copy} time={time} accent={index === 1 ? "lime" : ""} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reaction-section section-pad" id="reactions">
        <SectionBar channel="WORLD WIRE / 가상 패러디" title={<>유명인들의 <em>축복 릴레이</em></>} note={<>국제면 패러디<br />실제 메시지 아님</>} />
        <div className="notice-line"><span className="tag blue-tag">가상 축복</span><p>아래 문장은 실제 발언·초대·지지를 의미하지 않습니다. 이름만 빌린 한 줄 패러디입니다.</p></div>
        <div className="reaction-board">
          {celebrityDesk.map(([name, copy], index) => (
            <article className="public-reaction" key={name}>
              <span className="reaction-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="reaction-meta"><strong>{name}</strong><span>가상 계정 · 방금 전</span></div>
                <p>{copy}</p>
                <div className="reaction-footer"><span>좋아요 {index + 3}</span><span>답글 달기</span><span>가상 패러디</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="photo-section section-pad" id="photo">
        <SectionBar channel="PHOTO JOURNAL / 현장" title={<>현장 사진 한 장과 <em>독자 반응</em></>} note={<>사진은 샘플입니다.<br />실제 사진으로 교체해 주세요.</>} />
        <Rule />
        <div className="photo-thread">
          <figure className="photo-media">
            <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1100&q=85" alt="결혼식장에 놓인 꽃과 의자" />
            <figcaption>▲ 두 사람이 함께 앉을 자리. 이날의 가장 중요한 배경입니다.</figcaption>
          </figure>
          <article className="photo-post">
            <div className="post-meta"><UserMark label="현장" accent="red" /><div><strong>현장제보</strong><time>2026.10.17 15:04</time></div><span className="post-number">사진</span></div>
            <h3>[사진] 결혼식장 답사 갔다가 꽃만 봐도 웃김</h3>
            <p className="post-body">꽃이 놓이고 의자가 준비됨. 여기 앉아서 평생 같이 살 예정이라고 함. 갑자기 현실감 생겨서 제보함.</p>
            <div className="post-footer"><span>추천 37</span><span>댓글 8</span><span>사진 1장</span></div>
            <div className="reply-list">
              <ReplyRow author="ㅇㅇ(39.7)" copy="사진만 봐도 둘이 어디선가 웃고 있을 것 같음" time="15:07" />
              <ReplyRow author="친구A" copy="맞음. 식장에서도 서로 놀릴 예정" time="15:10" accent="lime" />
            </div>
          </article>
        </div>
      </section>

      <section className="archive-section section-pad" id="archive">
        <SectionBar channel="ARCHIVE / 연애 기록" title={<>두 사람의 연애 연표 <em>전부 이어져 있었다</em></>} note={<>자료실 샘플입니다.<br />실제 연표로 바꿔주세요.</>} />
        <Rule />
        <div className="archive-grid">
          <div className="activity-log">
            {timeline.map(([date, title, copy]) => (
              <article className="activity-row" key={date}>
                <time>{date}</time>
                <div>
                  <div className="activity-title"><strong>{title}</strong><span>기록 확인</span></div>
                  <p>{copy}</p>
                  <div className="activity-reply">ㅇㅇ &nbsp; 이때부터 이미 정해져 있었네</div>
                </div>
              </article>
            ))}
          </div>
          <aside className="archive-note">
            <p className="section-channel">한줄 요약</p>
            <h3>둘이 같이 있으면<br /><em>분위기가 이상하게 편해짐</em></h3>
            <Rule />
            <div className="archive-fact"><strong>5년</strong><span>함께한 시간</span></div>
            <div className="archive-fact"><strong>1팀</strong><span>앞으로의 생활</span></div>
            <div className="archive-fact"><strong>∞</strong><span>이어질 이야기</span></div>
          </aside>
        </div>
      </section>

      <section className="notice-section section-pad" id="details">
        <div className="notice-heading">
          <div><span className="notice-stamp">오시는 길</span><h2>예식 정보</h2></div>
          <p>이 면만큼은 진짜 정보입니다.<br />날짜·장소·교통을 확인해 주세요.</p>
        </div>
        <Rule className="notice-rule" />
        <div className="details-layout">
          <div className="map-card" role="img" aria-label="서울 아카이브 홀 약도 예시">
            <div className="map-grid-line map-grid-a" />
            <div className="map-grid-line map-grid-b" />
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
              <a className="text-button" href="#details">지도 위치 보기 ↗</a>
              <a className="text-button dark" href="tel:02-1234-5678">전화하기 ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="reply-section section-pad" id="rsvp">
        <div className="reply-layout">
          <div>
            <p className="section-channel">READER RESPONSE / 독자 엽서</p>
            <h2>마지막 문장에<br /><em>답해주세요.</em></h2>
          </div>
          <div className="reply-cta-box">
            <p>신문을 끝까지 읽어주셨다면 독자 엽서에 참석 여부와 축하 한마디를 남겨주세요.</p>
            <a className="reply-button" href="mailto:hello@example.com?subject=박서준%20한지우%20결혼일보%20독자%20엽서">축하 / 참석 엽서 보내기 ↗</a>
            <small>메일 주소와 내용은 샘플입니다. 실제 정보로 교체해 주세요.</small>
          </div>
        </div>
      </section>

      <footer className="footer section-pad">
        <Rule />
        <div className="footer-columns"><span>결혼일보 · THE COUPLE TIMES</span><span>본 신문은 두 사람 자랑으로 구성됩니다.</span><span>MADE WITH LOVE / 2026</span></div>
        <p className="footer-note">실존 인물의 이름을 사용한 문장은 모두 초안용 가상 패러디이며, 실제 발언이나 지지를 의미하지 않습니다.</p>
      </footer>
    </main>
  );
}
