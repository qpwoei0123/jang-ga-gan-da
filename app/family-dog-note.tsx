export default function FamilyDogNote({ kind }: { kind: "history" | "reporter" | "thanks" }) {
  if (kind === "reporter") return <div className="family-dog-reporter">
    <img src="/dog-family/reporter.webp" alt="우리 집 강아지 뚜이" width="48" height="48" loading="lazy" decoding="async" />
    <p><span>현장 취재 · 우리 집 강아지 뚜이</span><small>원고료는 간식으로 받습니다.</small></p>
    <span className="family-dog-stamp" aria-label="특별호 배달 완료">배달 완료</span>
  </div>;

  if (kind === "history") return <aside className="family-dog-history" aria-label="현장에 다시 나타난 괴도 강아지">
    <div className="family-dog-peek"><img src="/dog-family/nose.webp" alt="코를 가까이 내민 뚜이" width="128" height="144" loading="lazy" decoding="async" /></div>
    <p><small>※ 현장에 다시 나타난 용의견</small><span>앗, 그 사진…<br />저 아니에요!</span></p>
  </aside>;

  return <div className="family-dog-thanks">
    <img src="/dog-family/thanks.webp" alt="가까이 다가와 인사하는 뚜이" width="160" height="200" loading="lazy" decoding="async" />
    <p>축하해 주셔서 감사하개.</p>
    <span>우리 가족의 소식을 전한 뚜이 드림</span>
  </div>;
}
