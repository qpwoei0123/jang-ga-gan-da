# Design Direction

## Direction contract

**THESIS:** 결혼일보를 ‘결혼갤러리의 대형 개념글’로 바꾼다. 얌전한 브로드시트 기사 순서를 거부하고, 게시글 제목·작성자·조회수·추천·댓글이 곧 신문의 편집 문법이 되게 한다.

**OWN-WORLD:** 밝은 종이 바탕 위에 차콜 잉크, 코발트 블루, 라임 형광을 얹은 모바일 커뮤니티 UI. 둥근 카드 대신 1~2px 선, 촘촘한 목록, 사각 태그, 모노 메타데이터를 쓰고, 종이 주름은 화면 전체를 묶는 물성으로 남긴다.

**STORY:** 방문자는 ‘박서준·한지우 결혼함’이라는 개념글을 열고, 친구들의 제보·베스트 댓글·유명인 패러디 반응을 읽으며 둘의 관계를 웃음으로 이해한다. 마지막에는 ‘공지’로 전환해 실제 날짜·장소·RSVP를 놓치지 않는다.

**FIRST VIEWPORT:** 커뮤니티 상단바, 결혼갤러리 경로, 대형 게시글 제목, 조회·추천·댓글 메타, 샘플 사진, 베스트 댓글을 한 덩어리로 보여준다. 첫 화면만 봐도 무엇을 축하하는 페이지인지와 어디서 답해야 하는지가 보인다.

**FORM:** 게시판 스레드와 신문 1면의 하이브리드. 데스크톱에서는 글·댓글·반응을 나란히 펼치고, 모바일에서는 한 줄씩 이어지는 피드로 자연스럽게 접는다. 불규칙성은 문장 길이와 강조 위치에서만 만들고, 선과 메타 위치는 고정한다.

## System rules

- Surface: neutral paper with generated crumple texture and low-opacity ink grain; the outer canvas is cooler and more screen-like than the previous warm broadsheet.
- Palette: paper white, charcoal ink, cobalt blue, lime highlight, and one tomato red alert color.
- Type: heavy system sans for titles and Korean copy; compact monospace only for usernames, timestamps, counts, and route data.
- Layout: one continuous sheet, thread bars, reply rows, hard rules, and a few full-bleed color notices; no generic feature-card grid.
- Content: every post is a specific observation, reaction, or useful instruction. Filler statistics are out; sample facts are labeled and easy to replace.
- Voice: dry, short, self-aware community phrasing with restrained use of ㅋㅋ, ㄹㅇ, 이왜진, and 드디어. No direct quotation from a real post and no claim that a celebrity actually endorsed the couple.
- Responsive: desktop opens the thread into parallel evidence columns; mobile keeps the same order as a single readable feed and preserves large tap targets.

## Distillation decisions

The page keeps one reading path: community headline, specific friend reports, comment-style celebrity parody, photo thread, relationship archive, venue notice, and RSVP. Generic weather reports, invented percentages, fictional institutions, filler lifestyle articles, and duplicate praise blocks were removed because they added volume without making the invitation more personal. The new tone is derived from broad community mechanics—short posts, usernames, counters, reply timing, deadpan exaggeration—not from any identifiable user's writing.
