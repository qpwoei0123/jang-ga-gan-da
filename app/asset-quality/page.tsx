"use client";

import AssetGate from "../asset-loader";
import styles from "./quality-guide.module.css";

const GUIDE_ASSETS = [
  "/paper-crumple.webp",
  "/dog-run-sprite-ddui-timid.webp",
  "/will-smith-original.png",
] as const;

const levels = [
  {
    id: 1,
    name: "원본 얹기",
    verdict: "기본값 · 선택됨",
    description: "색과 질감을 손대지 않고 크기만 맞춰 올린다. 합성보다 밈 원본의 낯선 존재감이 먼저 보인다.",
    rule: "뚜이와 윌 스미스는 평소 이 수준으로.",
  },
  {
    id: 2,
    name: "일부러 대충",
    verdict: "필요할 때만",
    description: "약간 비뚤고, 잉크가 덜 맞고, 종이와 어설프게 붙는다. 지금 원하는 최신 콜라주 감각.",
    rule: "신문 지면에 꼭 섞여야 할 때만 사용.",
  },
  {
    id: 3,
    name: "지면 연출",
    verdict: "중요 장면용",
    description: "사진·헤드라인·주석이 서로 물린다. 더 완성됐지만 장면 하나가 지면의 주인공이 된다.",
    rule: "한 면에 한 번, 핵심 농담에만 사용.",
  },
  {
    id: 4,
    name: "상황극 완성",
    verdict: "클라이맥스 전용",
    description: "크롭, 원근, 동선까지 장면처럼 설계한다. 강하지만 신문보다 이벤트가 먼저 보인다.",
    rule: "윌 스미스가 버튼을 잡는 순간처럼 한 번만.",
  },
] as const;

function QualityGuide() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.utility}>
          <span>결혼일보 편집국 내부 기준</span>
          <a href="/">실제 청첩장 보기 ↗</a>
        </div>
        <p className={styles.kicker}>ASSET INTEGRATION / FOUR LEVELS</p>
        <h1>대충 붙인 듯<br /><em>정확하게</em></h1>
        <p className={styles.deck}>같은 뚜이와 윌 스미스를 얼마나 지면에 섞을지 비교한다. 완성도가 높을수록 좋은 게 아니라, 농담의 크기에 맞는 단계가 맞다.</p>
        <div className={styles.defaultRule}>
          <strong>앞으로의 기본값</strong>
          <span>1단계 ‘원본 얹기’. 윌 스미스는 종이 질감과 흑백 필터 없이 컬러 원본 그대로 사용한다.</span>
        </div>
      </header>

      <section className={styles.grid} aria-label="에셋 적용 품질 4단계">
        {levels.map((level) => (
          <article className={`${styles.card} ${styles[`level${level.id}`]}`} key={level.id}>
            <div className={styles.scene} aria-label={`${level.name} 예시`}>
              <span className={styles.sceneHeadline}>거절 버튼<br />현장서 도주</span>
              <span className={styles.dog} role="img" aria-label="신문을 물고 온 뚜이" />
              <img className={styles.will} src="/will-smith-original.png" alt="거절 버튼을 잡으러 온 윌 스미스 패러디 컷아웃" width="348" height="542" />
              <span className={styles.noButton}>아니요</span>
              <span className={styles.pressMark}>THE COUPLE TIMES</span>
            </div>
            <div className={styles.caption}>
              <div className={styles.levelLine}>
                <span>LEVEL {level.id}</span>
                <strong>{level.verdict}</strong>
              </div>
              <h2>{level.name}</h2>
              <p>{level.description}</p>
              <small>{level.rule}</small>
            </div>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <strong>편집 원칙</strong>
        <p>원본의 색과 해상도는 먼저 보존한다. 종이 질감과 잉크 처리는 장면에 꼭 필요한 경우에만 한 단계씩 올리고, 크기와 시선 방향은 항상 정확히 맞춘다.</p>
      </footer>
    </main>
  );
}

export default function AssetQualityPage() {
  return (
    <AssetGate assets={GUIDE_ASSETS} label="에셋 적용 기준표 준비 중">
      <QualityGuide />
    </AssetGate>
  );
}
