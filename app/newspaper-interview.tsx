import { publicAsset } from "./public-asset.ts";
const questions = [
  {
    question: "고3 때보다 업그레이드된 점, 아직 그대로인 점은?",
    groom: "제 눈엔 갈수록 예뻐져요. 성격은 여전히 남자 초등학생 같고요. 동심이 있다는 거죠!",
    bride: "이젠 웬만한 말엔 예전처럼 순진하게 넘어가지 않아요. 그래도 여전히 다정해요.",
    groomFace: "groom-loving",
    brideFace: "bride-playful",
  },
  {
    question: "상대의 사용설명서 첫 줄에 적을 주의사항은?",
    groom: "사랑한다는 말은 자주 해주시오. 장난은 적정량만 쳐주시오.",
    bride: "감정보다 팩트, 분위기보다 논리. 근거를 갖춰 접근하시오.",
    groomFace: "groom-warning",
    brideFace: "bride-logical",
  },
  {
    question: "‘이 사람과 결혼해도 되겠다’고 확신한 순간은?",
    groom: "늘 저를 믿어주고, 추진력도 상당해요. 무엇보다 밥을 대충 해먹지 않습니다.",
    bride: "11년 동안 크고 작은 선택을 할 때마다 늘 제 편이었어요. 그 한결같은 모습에 확신이 생겼죠.",
    groomFace: "groom-proud",
    brideFace: "bride-tender",
  },
];

export default function NewspaperInterview() {
  return <article className="newspaper-article newspaper-interview" id="couple-interview" aria-labelledby="interview-title">
    <p className="article-kicker">INTERVIEW / 두 사람에게 물었다</p>
    <h2 id="interview-title">고3의 우리가,<br />서른의 부부가 되기까지</h2>
    {questions.map(({ question, groom, bride, groomFace, brideFace }, index) => <section className="interview-question" key={question} aria-labelledby={`interview-question-${index + 1}`}>
      <h3 id={`interview-question-${index + 1}`}><span className="interview-question-number" aria-hidden="true">Q{index + 1}.</span> {question}</h3>
      <dl>
        <div className="interview-answer"><dt><img className="interview-face" src={publicAsset(`/interview/${groomFace}.webp`)} alt="신랑" width="44" height="44" loading="lazy" decoding="async" /></dt><dd>{groom}</dd></div>
        <div className="interview-answer"><dt><img className="interview-face" src={publicAsset(`/interview/${brideFace}.webp`)} alt="신부" width="44" height="44" loading="lazy" decoding="async" /></dt><dd>{bride}</dd></div>
      </dl>
    </section>)}
  </article>;
}
