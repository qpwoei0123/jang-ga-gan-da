# Design Direction

## Direction contract

**THESIS:** 결혼식 초대장을 부부 특집의 한 호로 바꾼다. 평범한 히어로-소개-장소 순서를 거부하고, 첫 화면부터 속보·특집·가상 국제면이 쏟아지는 과밀한 신문을 연다.

**OWN-WORLD:** 오래된 지역 일간지와 황색 주간지의 다단 규칙선, 기사 제목, 작은 데이터 캡션, 긴급 속보 띠를 모바일 폭에 맞게 압축한다. 종이 주름과 잉크 번짐은 모든 면을 연결하는 물성이다.

**STORY:** 방문자는 ‘이 부부가 결혼한다’에서 시작해 ‘이 정도로 사랑받는 사람들이구나’로 웃으며 이동하고, 마지막에 실제 가족식 정보와 가족 안내를 확인한다. 실존 인물·기관을 언급하는 기사는 모두 가상 패러디로 표시한다.

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

The page keeps one reading path: headline, specific friend reports, a compact parody celebrity list, photo, relationship archive, venue facts, and a family note. Generic weather reports, invented percentages, fictional institutions, filler lifestyle articles, and duplicate praise blocks were removed because they added volume without making the invitation more personal. Celebrity names remain only as clearly labeled one-line parody placeholders for future real messages.

## Editorial topology

The long scroll is edited as four newspaper pages rather than a stack of equal sections. The front page carries the dominant lead, photo, wire column, and contents line. Page 2 groups the friend report with the parody celebrity file as a people spread. Page 3 combines the photo essay and relationship archive as one feature. The final page groups venue facts and a family note as the service desk; it does not collect attendance responses because this is a small family ceremony for roughly 50 people. Page folios, running topics, continuation lines, and bottom-of-page handoffs create the rhythm of a real issue.

## Pattern variation

The page uses a shared editorial grid but changes the dominant composition per page: people is a report-plus-sidebar spread, feature is an archive rail beside a photo-led article, and service is a full-width venue bulletin followed by a horizontal family-note strip. Rules are treated as translucent warm ink rather than pure black, with red and blue lines reserved for section changes and factual/service moments.

## Motion direction

Motion is concentrated in one opening delivery scene rather than spread across the long scroll. The browser canvas, loading state, and opening stage remain pure black edge to edge; loading is marked only by a small white “로딩중...”. The warm beige outer ground begins to appear only when the newspaper starts opening. The stage contains only 뚜이 and one white-lined dialogue box; masthead copy, dispatch metadata, speed lines, panting labels, nameplates, and changing reaction text are deliberately absent. A four-frame sprite uses the actual dog 뚜이’s large black eyes, broad nose, tousled curls, soft low ears, and long slim legs while the outer layer brings it toward the reader. After arrival, the single fixed sentence types one character at a time with the short predecoded Sans voice sample, then reveals “예” and “아니요”. Pressing “예” starts a predecoded ta-da at the same moment the newspaper opens. Every real press of “아니요” gives supported devices one sharp 35ms haptic pulse, plays the Minecraft damage cue, and gives the button a 0.2-second red, stepped shake before it moves and shrinks. The layered extras escalate as none, classic hurt, gunshot, fahhhh, then gunshot and fahhhh together. After the fifth hit resolves, the full-color original Will Smith cutout collects the button and a final “get out” cue plays as he exits left; the narration never changes. Reduced-motion preferences show the full sentence immediately, retain the red damage state without the shake, show one still dog frame, move the evasive button without interpolation, and shorten the collection and fold reveals.

## Asset delivery

The invitation is a client-rendered experience. Every image and interaction sound used at runtime is stored with the site and decoded through one shared asset gate before the delivery scene mounts, so the dog run, Will Smith capture, and tap feedback never begin with a missing file. A failed file keeps the newspaper closed and offers a retry instead of revealing a broken or half-loaded page. Remote URLs may remain as source credits, but no visible image or sound depends on a third-party host.

## Asset integration scale

The default treatment is level 1, “original placement”: preserve the supplied asset’s color and texture, remove only a baked checkerboard when transparency is required, and control just its scale, position, and timing. Will Smith therefore keeps the full-color original rather than a newsprint conversion. Level 2 adds intentional crookedness and ink mismatch only when requested. Level 3 interlocks the cutout with a headline, rule, or annotation. Level 4 adds scene choreography and is reserved for a single climax. Higher levels are not inherently better; the joke decides the level.
