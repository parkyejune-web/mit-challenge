# MIT Challenge 랜딩 페이지 점검 (TWS 레퍼런스 + 토스 UX)

## 1. Trade With Suli 레퍼런스 대조

| TWS 요소 | 우리 구현 | 상태 |
|----------|-----------|------|
| Hero: 큰 헤드라인 + 서브 + CTA "Gabung Sekarang" | H1 + HOOK_SUBHEADLINE + "Gabung Sekarang" 버튼 | ✅ |
| Stats: 120.000+ / Portofolio +53% 스타일 | $30,000+ / Real-time·Sistem MIT terbukti | ✅ |
| 섹션별 H2 + 본문 + CTA | 설문·Gate·UID·KYC·Discord 각각 H2 + 설명 + 1 CTA | ✅ |
| 증명/테스티모니 블록 후 디스클레이머 | 수익 캐러셀 하단 DISCLAIMER_TRADING | ✅ |
| 라이트 배경, 카드형, 여백 충분 | globals.css 라이트 테마, section-block, shadow-card | ✅ |
| 회원가입 플로우 후 최종 CTA | Survey → Gate → UID → KYC → Discord(마지막) | ✅ |

**배경·느낌 (추가 정리)**  
- 배경: 순백(#fff) 대신 **따뜻한 오프화이트** `#fafaf9` + `#f5f5f4` 그라데이션 (`body::before`)으로 TWS 느낌에 맞춤.  
- 카드: `--background-card: #ffffff`로 흰색 유지해 섹션과 대비.  
- 구조: Hero → Stats → 증명(총계좌·캐러셀·영상) → section-block 교차 → CTA.

**결론**: TWS의 Hero → Stats → 증명/콘텐츠 블록 → 가입 플로우 → 최종 CTA 구조를 따르고, 라이트 테마·배경 톤·카드·디스클레이머까지 반영됨.

---

## 2. 토스 UI/UX 관점 점검

| 원칙 | 적용 내용 | 상태 |
|------|-----------|------|
| **한 화면 한 가지 주 액션** | 랜딩: "Gabung Sekarang" 하나. 각 단계: 다음 단계로 가는 CTA 하나. | ✅ |
| **터치 타겟 44px+** | Button min-h-[52px], Input min-h-[48px], 진행 점·뒤로가기 min 44px | ✅ |
| **명확한 위계** | H1(히어로) → H2(섹션) → body, section-label(작은 캡션) | ✅ |
| **즉각 피드백** | UID 검증 시 "Memverifikasi...", 버튼 whileTap/whileHover | ✅ |
| **포스터의 법칙** | 유연한 입력(UID 공백 제거), 에러 메시지 명확 | ✅ |
| **피크-엔드** | 마지막 단계 "Satu langkah terakhir" + 디스코드 CTA로 끝 | ✅ |
| **미니멀** | 장식 최소, 여백·타이포·색상으로 구분 | ✅ |

---

## 3. 수익 증명 이미지 깨짐 방지

| 항목 | 구현 | 상태 |
|------|------|------|
| **비율 유지** | `ProofImage`: `object-contain`으로 비율 유지, 크롭 없음 | ✅ |
| **에러 처리** | `onError` 시 플레이스홀더(라벨) 표시, 레이아웃 유지 | ✅ |
| **LCP** | 히어로(총계좌) 이미지에 `priority` → `loading="eager"` | ✅ |
| **나머지** | 캐러셀 이미지는 `loading="lazy"`로 성능 고려 | ✅ |
| **컨테이너** | aspect-video(차트), aspect-[4/5](결과 카드)로 고정 비율, 내부는 contain | ✅ |

이미지 파일이 없어도 플레이스홀더로 깨지지 않고, 있으면 비율이 틀어지거나 잘리지 않음.

---

## 4. 설득 구조 (AIDA)

| 단계 | 구현 | 상태 |
|------|------|------|
| **Attention** | 헤드라인 "$30.000+ dalam Satu Tahun" + 서브라인 | ✅ |
| **Interest** | Stats ($30,000+, Real-time) → 총계좌 스크린샷 | ✅ |
| **Desire** | 수익 캐러셀(차트+결과) + 계좌 인증 영상(자동재생) | ✅ |
| **Action** | "Gabung Sekarang" → 설문 → Gate → UID → KYC → Discord CTA | ✅ |

증거(총계좌 → 주간 수익 → 영상) 순서로 보여주고, 디스클레이머로 신뢰 보완.

---

## 5. 적용한 수정 사항 (이번 점검)

- **디스클레이머**: 수익 캐러셀 섹션 하단에 `DISCLAIMER_TRADING` 추가 (TWS 스타일).
- **ProofImage**: `priority` prop 추가 — 히어로 이미지는 eager, 나머지는 lazy.
- **점검 문서**: 본 AUDIT.md 추가.

---

## 6. 파일별 요약

- **page.tsx**: 6단계 플로우, stage 0 랜딩 / 1~5 회원가입·디스코드.
- **HookSection**: Hero → Stats → 총계좌 → 캐러셀(+ 디스클레이머) → 영상 → 하단 CTA.
- **ProofSection**: 차트+결과 세트 캐러셀, 스와이프·드롯, ProofImage로 이미지 깨짐 방지.
- **ProofImage**: object-contain, onError 플레이스홀더, priority 시 eager 로드.
- **globals.css**: 라이트 테마, section-block, shadow-card, 토스/애플 계열 타이포.
