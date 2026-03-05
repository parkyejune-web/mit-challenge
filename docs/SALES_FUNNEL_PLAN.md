# Sales Funnel 플랜 — 입금까지 끌고 가는 고도화 퍼널

## 목표

유입자의 심리를 **완전히 개조**해서 입금까지 끌고 가는 **마케팅 퍼널**. 단순 입장 안내가 아님.

---

## 1. 메인 페이지: 압도적인 권위 설정 (The High-Authority Hook)

**목표:** 유입자가 페이지를 열자마자 **"이 사람은 진짜다"**라고 느끼게.

| 요소 | 구현 |
|------|------|
| 권위 뱃지 | `HOOK_AUTHORITY_BADGE`: "5+ tahun · Profit diverifikasi" — 상단 노출 |
| 헤드라인 | $30.000+ dalam Satu Tahun — 검증된 결과 |
| 서브라인 | "Bukan teori—bukti real, profit diverifikasi" — 전문가 프레이밍 |
| 스탯 | Total profit diverifikasi + Sistem MIT terbukti (숫자·시스템 강조) |
| 증거 | 총계좌 이미지, 수익 캐러셀, 인증 영상 — 세련된 UI로 배치 |

→ **자랑이 아니라 "검증된 전문가"라는 인지**를 주는 것이 목적.

---

## 2. 설문지: 자아 비판 및 문제 인지 (The Problem Recognition)

**목표:** 유입자가 스스로 **"내 매매 방식은 쓰레기였다"**를 뼈저리게 느끼게.

| 요소 | 구현 |
|------|------|
| 섹션 타이틀 | "Kenali Masalah Trading Anda" — 문제 인식 유도 |
| 서브 | "Jujurlah pada diri sendiri. ... kualifikasi untuk akses Sistem MIT." — 진지한 자격 심사 느낌 |
| 진행 라벨 | "Kualifikasi" — 단계별로 자격 심사를 받는다는 몰입감 |
| 질문 1 | FOMO/greedy로 loss 경험 — "Sering—saya akui ini kelemahan saya" |
| 질문 2 | Cut loss 없이 hold — "Saya sering hold dan berharap—saya tahu ini salah" |
| 질문 3 | 결과가 naik-turun/minus — "Saya butuh sistem yang benar" |
| 질문 4 | 방식 전환 의지 — "Saya siap ganti cara dan ikut Sistem MIT" |

→ **감정적 매매·원칙 없는 손실**을 직접 마주하게 하고, **Sistem MIT**를 유일한 탈출구로 연결.

---

## 3. 최종 전환: 해결책 제시 및 클로징 (The Final Conversion)

**목표:** 설문을 마친 유입자에게 **Sistem MIT**를 유일한 탈출구로 제시하고 티켓으로 유입.

| 단계 | 심리 | 카피·연출 |
|------|------|-----------|
| Gate 가입 | "문제 인정 → 이제 유일한 길은 MIT" | GATE_PASS_TITLE: "Anda Mengakui Masalah—Satu-Satunya Jalan Keluar: Sistem MIT." + KUALIFIKASI LULUS 배지 |
| UID 검증 | 물리적 필터 — 진짜로 따라오는 사람만 | "Verifikasi UID—Filter Terakhir Sebelum Akses 1:1" |
| KYC & Deposit | 마지막 단계 후 1:1 | "Langkah Terakhir Sebelum 1:1" → "buka tiket Discord untuk konsultasi langsung" |
| Discord 티켓 | 클로징: 1:1 상담 = 탈출구 | "Satu-Satunya Jalan Keluar: Mulai 1:1 dengan Sistem MIT." + "dapatkan konsultasi 1:1 dan akses penuh ke sistem yang sudah membukukan $30.000+" |

**로직:** 설문(심리적 자극) → UID 검증(물리적 필터링) → 디스코드 티켓(1:1 상담)으로 자연스럽게 이어짐.

---

## 상수·컴포넌트 매핑

- **권위:** `constants.ts` — HOOK_*, ProofBlock, HeroBlock
- **설문:** SURVEY_*, QualificationSurvey (Kualifikasi 라벨, 단계별 질문)
- **클로징:** GATE_*, VERIFY_*, KYC_*, DISCORD_* — StepsBlock, FinalCta

---

## 벤치마킹 랜딩 10 (참고 사이트·반영 포인트)

Part B(랜딩 요소) 및 새 디자인·구조 결정 시 아래 사이트를 참고한다.

| # | 사이트 | URL | 참고 포인트 (헤드라인·히어로·트러스트·CTA·모션 등) |
|---|--------|-----|--------------------------------------------------|
| 1 | **Linear** | linear.app | 다크·미니멀, 한 줄 헤드라인·단일 CTA, 여백·타이포 위계. "한 화면 한 메시지" |
| 2 | **Stripe** | stripe.com | 신뢰(로고/스탯), 정보 위계, 클라이언트 로고/숫자. CTA 명확 |
| 3 | **Raycast** | raycast.com | 볼드 히어로, 애니메이션/미세 모션, 스티키 네비, 다크+액센트 컬러 |
| 4 | **Vercel** | vercel.com | 개발자 타깃, 깔끔한 그리드·코드/터미널 비주얼, 속도·성능 강조 |
| 5 | **Notion** | notion.so | 제품 가치 한 문장, 위트·감성 카피, 스크롤 스토리텔링 |
| 6 | **Figma** | figma.com | 비주얼 퍼스트, 템플릿/갤러리형 섹션, 화이트 스페이스·CTA 반복 |
| 7 | **Apple** | apple.com | 타이포그래피·제품 히어로 비주얼, 섹션별 풀블리드, 스크롤 스냅 느낌 |
| 8 | **Gemini ActiveTrader** | gemini.com/activetrader | 트레이딩 퍼널: 가치 제안·트러스트·CTA, "Get started"·기능 하이라이트 |
| 9 | **Trade With Suli** | tradewithsuli.com | 트레이딩 랜딩: 수익 증거·총합·승률 노출, 증거 위주 레이아웃 |
| 10 | **v0 Premium SaaS** | v0.dev 템플릿 | 다크 프리미엄, 히어로·메트릭·테스티모니얼·CTA 구조, 반응형·섹션 구분 |

**디자인 톤 기준:** Linear / Raycast / v0 중 다크 베이스 + 단일 액센트, 또는 Stripe/Apple 라이트 + 강한 타이포 중 선택하여 일관 적용.
