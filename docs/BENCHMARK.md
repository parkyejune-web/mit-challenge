# 벤치마킹: Patreon · Apple · Toss 메인 페이지

## Patreon (patreon.com/ko-KR)
- **한 문장 히어로**: "Creativity powered by fandom" – 한 줄로 가치 전달
- **섹션 라벨**: 소문자/대문자 구분, 짧은 라벨 후 본문 (예: "진정한 커뮤니티 구축")
- **카드/블록**: 크리에이터 카드 그리드, 여백 넉넉
- **CTA**: "시작하기", "로그인" 등 명확한 1차 액션
- **10가지 연계**: Hick(선택 단순화), Von Restorff(CTA 강조), Peak-End(히어로·마무리)

## Apple (apple.com/kr/iphone-17)
- **히어로 타입**: 짧고 강한 헤드라인 ("오색. 찬란."), 서브 한 줄
- **섹션 위계**: "일단 핵심부터." → "디자인." → "카메라." – 짧은 제목 + 본문
- **여백**: 섹션 간 공간 크게, 스크롤 내러티브
- **폰트**: San Francisco, 굵은 제목(700), 본문 400~500
- **10가지 연계**: Miller(청킹), Aesthetic-Usability(정제된 타입), Fitts(터치 영역)

## Toss (toss.im)
- **한 섹션 한 메시지**: "내 돈 관리", "송금", "대출" – 블록당 한 가지 가치
- **신뢰 복문**: "평생 무료", "사기계좌 조회" 등 구체적 이점
- **타이포**: 제목 굵게, 본문 중간 굵기, 계층 분명
- **CTA**: 블록 내 "자세히 알아보기" 등 단일 액션
- **10가지 연계**: Jakob(익숙한 금융 UI), Peak-End(첫인상·마지막 CTA)

---

## 적용 방향 (10가지 Laws of UX + 벤치마크)
1. **Jakob**: 뒤로가기 왼쪽, 진행 가운데, 버튼 위치 예측 가능
2. **Fitts**: 터치 44~48px, 주 CTA 크게
3. **Hick**: 화면당 한 CTA, 설문 한 질문씩
4. **Miller**: 수익 4세트 청킹, 설문 4문항
5. **Postel**: UID 입력 유연(공백 제거)
6. **Peak-End**: 메인에 총계좌·수익·영상(피크), 마지막에 Discord CTA(엔드)
7. **Aesthetic-Usability**: Patreon/Apple/Toss 스타일 여백·타이포
8. **Von Restorff**: 메인 CTA만 액센트 색
9. **Tesler**: 복잡도는 시스템이 처리(UID 정규화)
10. **Doherty**: 로딩 즉시 피드백, 전환 0.25s

## 배경
- 고정 배경 없이 유연하게: 그라데이션은 스크롤 따라 이동(absolute), height 120vh

## 영상 (GIF형식)
- 계좌 인증 영상: `autoplay` + `muted` + `loop` + `playsInline` 로 자동재생·반복 (브라우저 정책상 소리는 기본 무음).
- 진짜 GIF로 쓰려면: `public/videos/0303.mp4` 대신 `public/videos/0303.gif` 또는 `.webp` 등으로 변환 후 같은 경로에 두고, `<video>` 대신 `<img src="/videos/0303.gif" alt="..." />` 로 교체하면 됨. 필요하면 말해 주세요.
