import { publicAsset } from "./public-asset.ts";
export default function FamilyDogNote() {
  return <div className="family-dog-reporter">
    <img src={publicAsset("/dog-family/reporter.webp")} alt="우리 집 강아지 뚜이" width="48" height="48" loading="lazy" decoding="async" />
    <p>원고료는 간식으로만 받습니다.</p>
    <span className="family-dog-stamp" aria-label="특별호 배달 완료">배달 완료</span>
  </div>;
}
