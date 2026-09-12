// Mount below the cover reaction when the couple's hanbok photograph is supplied.
export default function HistoryReport({ photoSrc }: { photoSrc: string }) {
  return (
    <article className="history-report" aria-labelledby="history-report-title">
      <header>
        <span>HISTORY / 역사 · 단독 보도</span>
        <h3 id="history-report-title">“전생에도 부부였다”</h3>
        <p>국립중앙말티푸박물관서 혼인 사료 발견</p>
      </header>
      <div className="history-report-columns">
        <figure>
          <img src={photoSrc} alt="한복을 입고 함께 선 한원영과 이나경. 신랑은 모자를 쓰지 않았다." loading="lazy" />
          <figcaption>국립중앙말티푸박물관 소장<br />촬영 연도 미상</figcaption>
        </figure>
        <div className="history-report-copy">
          <p>국립중앙말티푸박물관이 공개한 옛 혼인 사진에서 한원영·이나경과 똑 닮은 부부가 발견됐다.</p>
          <p>박물관 측은 “신랑이 모자를 쓰지 않은 점으로 보아, 전생에도 모자가 안 어울렸던 것으로 추정된다”고 밝혔다.</p>
          <p>정확한 촬영 연도는 감정 중이다. 담당 학예견이 사진을 물고 달아나 조사가 잠시 중단됐다.</p>
        </div>
      </div>
    </article>
  );
}
