// The current photograph is temporary; replace it with the supplied hanbok portrait.
export default function HistoryReport({ photoSrc }: { photoSrc: string }) {
  return (
    <article className="history-report" id="history-report" aria-labelledby="history-report-title">
      <header>
        <span>HISTORY / 역사 · 단독 보도</span>
        <h3 id="history-report-title">“전생에도 부부였다”</h3>
        <p>국립중앙말티푸박물관서 혼인 사료 발견</p>
      </header>
      <div className="history-report-columns">
        <figure>
          <img src={photoSrc} alt="기사 배치 확인용 흑백 커플 사진" width="1200" height="1800" loading="lazy" />
          <figcaption>국립중앙말티푸박물관 소장<br />촬영 연도 미상</figcaption>
        </figure>
        <div className="history-report-copy">
          <p>국립중앙말티푸박물관의 옛 혼인 사진에서 두 사람과 닮은 부부가 발견됐다.</p>
          <p>박물관 측은 “모자 없는 신랑, 전생에도 안 어울렸던 듯”이라고 밝혔다.</p>
          <p>학예견이 사진을 물고 달아나 연도 감정은 중단됐다.</p>
        </div>
      </div>
    </article>
  );
}
