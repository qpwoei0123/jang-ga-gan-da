const questions = [
  {
    question: "고3의 상대와 지금의 상대, 무엇이 업그레이드됐고 무엇은 아직도 고3인가요?",
    groom: "제 눈에는 점점 이뻐지고요. 남자 초딩 같은 만화 취향은 그대로네요~!",
    bride: "이젠 가스라이팅이 안 통하지만, 그래도 여전히 다정해요.",
    groomFace: "groom-loving",
    brideFace: "bride-playful",
  },
  {
    question: "상대의 사용설명서 첫 줄에 반드시 적어야 할 주의사항은?",
    groom: "자주자주 사랑한다 해주시오. 장난이라도 장난을 적당히 치시오.",
    bride: "감정보단 팩트를, 분위기보단 논리를 우선으로…!",
    groomFace: "groom-warning",
    brideFace: "bride-logical",
  },
  {
    question: "“이 사람과 결혼해도 되겠다”를 확신한 순간은?",
    groom: "나를 항상 믿어준다! 음식을 대충 해 먹지 않는다! 추진력이 상당하다!",
    bride: "11년 동안 크고 작은 선택들을 할 때마다 항상 내 편에서 지지해 주는 모습이 한결같았다 ㅎㅎ",
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
        <div className="interview-answer"><dt><img className="interview-face" src={`/interview/${groomFace}.webp`} alt="신랑" width="44" height="44" decoding="async" /></dt><dd>{groom}</dd></div>
        <div className="interview-answer"><dt><img className="interview-face" src={`/interview/${brideFace}.webp`} alt="신부" width="44" height="44" decoding="async" /></dt><dd>{bride}</dd></div>
      </dl>
    </section>)}
  </article>;
}
