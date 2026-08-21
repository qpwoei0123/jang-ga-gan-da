"use client";

import AssetGate from "../asset-loader";
import styles from "./quality-guide.module.css";

const GUIDE_ASSETS = [
  "/paper-crumple.png",
  "/dog-run-sprite-ddui-timid.webp",
  "/will-smith-cutout.webp",
] as const;

const levels = [
  {
    id: 1,
    name: "원본 얹기",
    verdict: "초안 확인용",
    description: "크기만 맞춰 올린 상태. 에셋은 보이지만 같은 지면에 있다는 느낌은 없다.",
    rule: "배치와 크기만 확인할 때 여기까지.",
  },
  {
    id: 2,
    name: "일부러 대충",
    verdict: "기본값 · 추천",
    description: "약간 비뚤고, 잉크가 덜 맞고, 종이와 어설프게 붙는다. 지금 원하는 최신 콜라주 감각.",
    rule: "뚜이와 윌 스미스는 평소 이 수준으로.",
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
          <span>2단계 ‘일부러 대충’. 중요한 한 장면만 3단계, 클라이맥스 하나만 4단계.</span>
        </div>
      </header>

      <section className={styles.grid} aria-label="에셋 적용 품질 4단계">
        {levels.map((level) => (
          <article className={`${styles.card} ${styles[`level${level.id}`]}`} key={level.id}>
            <div className={styles.scene} aria-label={`${level.name} 예시`}>
              <span className={styles.sceneHeadline}>거절 버튼<br />현장서 도주</span>
              <span className={styles.dog} role="img" aria-label="신문을 물고 온 뚜이" />
              <img className={styles.will} src="/will-smith-cutout.webp" alt="거절 버튼을 잡으러 온 윌 스미스 패러디 컷아웃" width="800" height="1200" />
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
        <p>에셋의 선명함보다 지면 안에서의 태도가 중요하다. 잘라낸 흔적, 약간 어긋난 잉크, 비뚤어진 각도는 남기되 크기와 시선 방향은 정확히 맞춘다.</p>
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
