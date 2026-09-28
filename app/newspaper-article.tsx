import HistoryPhotoDisplay from "./history-photo-display";

export default function NewspaperArticle({ kind, photoSrc }: {
  kind: "reaction" | "history";
  photoSrc?: string;
}) {
  const history = kind === "history";

  return <article
    id={history ? "history-report" : undefined}
    className={`newspaper-article newspaper-article-${kind}`}
    data-ddui-tip={history ? "앗, 그 사진 물고 간 학예견… 저 아니에요!" : "GD 말고 우리 형도 꽤 괜찮아요~"}
  >
    <p className="article-kicker">{history ? "HISTORY / 역사 · 단독 보도" : "BRIDE & GROOM / 단독 소감"}</p>
    <h2>{history ? "“전생에도 부부였다”" : <>GD와 결혼하지 못한<br />신부의 한탄</>}</h2>
    <p className="article-deck">{history ? "국립중앙말티푸박물관서 혼인 사료 발견" : "어이없어하는 남편의 소감"}</p>
    {history && photoSrc && <figure className="article-photo">
      <HistoryPhotoDisplay photoSrc={photoSrc} />
      <figcaption>국립중앙말티푸박물관 소장 · 촬영 연도 미상</figcaption>
    </figure>}
    <p className="article-body">{history
      ? "국립중앙말티푸박물관이 오래된 혼인 사진 네 장을 새로 공개했다. 박물관 측은 “어디선가 본 듯한 수상한 부부다. 전생에도 키 차이는 어쩔 수 없나 보다ㅋ”라고 밝혔다. 정확한 감정을 하려 했으나 괴도 강아지가 사진을 물고 달아나 조사가 중단됐다."
      : "신부 이나경은 GD와의 결혼이 무산돼 유감을 표했다. “딱 하나 아쉬운 건, GD랑 결혼은 꿈도 못 꾼다는 것.” “어쩌다 식장까지 잡았다”는 신부는 말끝마다 웃음을 참지 못했다. 신랑은 “그걸 왜 청첩장에 쓰냐”며 어이없어했다."}</p>
  </article>;
}
