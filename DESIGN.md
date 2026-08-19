# Design Direction

## Direction contract

**THESIS:** 결혼식 초대장을 부부 특집의 한 호로 만든다. 신문 제호·다단 편집·기사 지면을 주인공으로 두고, 게시판식 농담은 기사 제목과 독자 반응에만 섞는다.

**OWN-WORLD:** 따뜻한 신문용지, 검은 잉크, 신호 빨강과 전신 파랑, 바랜 머스터드가 만드는 브로드시트. 세리프 제호와 큰 기사 제목, 얇은 규칙선, 작은 취재 캡션, 종이 주름이 전체 지면을 묶는다.

**STORY:** 방문자는 ‘박서준·한지우 결혼함’이라는 톱기사를 읽고, 친구들의 제보·독자 반응·유명인 패러디를 보며 둘의 관계를 웃음으로 이해한다. 마지막에는 파란 사실면에서 실제 날짜·장소·RSVP를 확인한다.

**FIRST VIEWPORT:** 얇은 발행 바, ‘결혼일보’ 제호, 날짜·특집호 정보, 대형 톱기사, 사진, 취재 메타와 독자 반응을 신문 1면처럼 보여준다. 첫 화면만 봐도 무엇을 축하하는지와 마지막에 어디로 답하는지가 보인다.

**FORM:** 모바일 브로드시트 콜라주. 데스크톱에서는 기사·사진·사이드 반응을 다단으로 펼치고, 모바일에서는 지면 순서를 유지하며 접는다. 불규칙성은 기사 높이와 사진 각도에서만 만들고, 선·캡션·여백은 일관되게 유지한다.

## System rules

- Surface: warm newsprint with generated crumple texture and low-opacity ink grain; the outer canvas is a muted tabletop.
- Palette: paper ivory, ink black, signal red, wire-service blue, and faded mustard. Bright color stays under 10% of the page.
- Type: expressive serif for the masthead, headlines, and article copy; narrow sans and compact monospace only for metadata, usernames, timestamps, and counts.
- Layout: one continuous newspaper sheet, dense columns, double rules, captions, photos, and one full-bleed fact-check page; no app-like dashboard chrome.
- Content: every post is a specific observation, reaction, or useful instruction. Filler statistics are out; sample facts are labeled and easy to replace.
- Voice: formal news framing carrying dry, short, self-aware community phrasing inside quotes and friend reports. ㅋㅋ, ㄹㅇ, 이왜진, and 드디어 are accents, not the page's identity. No direct quotation from a real post and no claim that a celebrity actually endorsed the couple.
- Responsive: desktop retains newspaper columns; mobile keeps the masthead, lead, photo, and fact page readable before collapsing secondary articles.

## Distillation decisions

The page keeps one reading path: newspaper masthead, lead article, specific friend reports, a compact parody celebrity desk, photo journal, relationship archive, venue facts, and RSVP. Generic weather reports, invented percentages, fictional institutions, filler lifestyle articles, and duplicate praise blocks were removed because they added volume without making the invitation more personal. Community mechanics remain as evidence inside the newspaper—short replies, usernames, counters, and deadpan exaggeration—not as the visual identity itself.
