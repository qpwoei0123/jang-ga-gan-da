# Design Direction

## Direction contract

**THESIS:** 결혼식 초대장을 부부 특집의 한 호로 바꾼다. 평범한 히어로-소개-장소 순서를 거부하고, 첫 화면부터 속보·특집·가상 국제면이 쏟아지는 과밀한 신문을 연다.

**OWN-WORLD:** 오래된 지역 일간지와 황색 주간지의 다단 규칙선, 기사 제목, 작은 데이터 캡션, 긴급 속보 띠를 모바일 폭에 맞게 압축한다. 종이 주름과 잉크 번짐은 모든 면을 연결하는 물성이다.

**STORY:** 방문자는 ‘이 부부가 결혼한다’에서 시작해 ‘이 정도로 사랑받는 사람들이구나’로 웃으며 이동하고, 마지막에 실제 예식 정보와 RSVP를 확인한다. 실존 인물·기관을 언급하는 기사는 모두 가상 패러디로 표시한다.

**FIRST VIEWPORT:** 상단 발행 정보, 신문 제호 ‘결혼일보’, 긴급 속보, 신랑신부의 대형 톱기사, 사진, 트럼프 축복 패러디 기사, 결혼 지수를 한 화면 안에 밀도 있게 배치한다.

**FORM:** 모바일 브로드시트 콜라주. 불규칙한 기사 높이와 사진 각도는 허용하되, 1px 규칙선·반복 캡션·2~3열 그리드가 질서를 만든다.

## System rules

- Surface: warm newsprint with generated crumple texture and low-opacity ink grain.
- Palette: paper ivory, ink black, signal red, wire-service blue, faded mustard, moss green.
- Type: condensed sans for metadata and labels; expressive serif for headlines; narrow body copy for article density.
- Layout: one continuous newspaper sheet, dense columns, hard edges, no floating dashboard cards.
- Content: every article, statistic, ad, quote, and alert is a love letter disguised as news.
- Responsive: retain two-column newspaper rhythm on small screens where possible; stack only the lead, map, and primary action when readability requires it.

## Distillation decisions

The page keeps one reading path: headline, specific friend reports, a compact parody celebrity list, photo, relationship archive, venue facts, and RSVP. Generic weather reports, invented percentages, fictional institutions, filler lifestyle articles, and duplicate praise blocks were removed because they added volume without making the invitation more personal. Celebrity names remain only as clearly labeled one-line parody placeholders for future real messages.

## Editorial topology

The long scroll is edited as four newspaper pages rather than a stack of equal sections. The front page carries the dominant lead, photo, wire column, and contents line. Page 2 groups the friend report with the parody celebrity file as a people spread. Page 3 combines the photo essay and relationship archive as one feature. The final page groups venue facts and RSVP as the service desk. Page folios, running topics, continuation lines, and bottom-of-page handoffs create the rhythm of a real issue.
