# .env.local 설정 & 할일 순서 (비개발자용)

아래 순서대로만 하면 됨. 이미 된 건 건너뛰기.

---

## 1단계: .env.local 파일 만들기

1. 프로젝트 폴더(`mit-challenge`) 안에 **`.env.example`** 파일이 있음.
2. 이 파일을 **복사**해서 이름을 **`.env.local`** 로 바꿔서 같은 폴더에 둠.
3. `.env.local` 을 메모장/VS Code 등으로 열고, 아래 2~4단계에서 설명한 대로 **값만 채우면** 됨.  
   (키 이름은 건드리지 말고, `=` 뒤에 있는 부분만 본인 값으로 수정.)

---

## 2단계: Gate.io (UID 인증)

- **이미 잘 되고 있으면** → 아무것도 안 해도 됨. `.env.local` 에 이미 `GATEIO_API_KEY`, `GATEIO_SECRET_KEY` 가 들어 있을 것.
- **처음이면** → 테더겟 프로젝트의 `.env.local` 에 있는  
  `GATEIO_API_KEY`, `GATEIO_SECRET_KEY` 값을 **그대로 복사**해서  
  이 프로젝트(mit-challenge)의 `.env.local` 에 같은 이름으로 넣으면 됨.

---

## 3단계: Discord 링크

- **이미 버튼 잘 눌리면** → `.env.local` 에 `NEXT_PUBLIC_DISCORD_LINK` 가 이미 설정된 상태. 수정 안 해도 됨.
- **아직이면** → Discord 서버 초대 링크(예: `https://discord.gg/xxxx`)를 만들어서  
  `.env.local` 에 아래처럼 넣기:
  ```env
  NEXT_PUBLIC_DISCORD_LINK=https://discord.gg/실제초대코드
  ```
  저장 후 **개발 서버 다시 실행**해야 반영됨.

---

## 4단계: Supabase — 프로젝트 하나 더 파야 함

- **결론: 우리 사이트(mit-challenge) 전용으로 쓰려면 “새 프로젝트” 하나 만드는 게 좋음.**
- 테더겟이랑 **같은 Supabase 프로젝트**를 써도 되지만, 그럼 `funnel_tracker` 테이블에 **테더겟 + 우리 사이트** 데이터가 같이 들어감. 나중에 구분하기 번거로울 수 있음.
- 그래서 **따로 새 Supabase 프로젝트** 만드는 걸 권장함. (테더겟 Supabase 롤키랑 **다른** 프로젝트 = 다른 URL, 다른 service_role 키.)

**Supabase 할 일 요약:**

1. [supabase.com](https://supabase.com) 로그인 → **New project** 로 mit-challenge 전용 프로젝트 하나 생성.
2. 프로젝트 들어가서:
   - **Settings → API** 에서  
     - **Project URL** → `.env.local` 의 `NEXT_PUBLIC_SUPABASE_URL`  
     - **service_role (secret) 키** → `.env.local` 의 `SUPABASE_SERVICE_ROLE_KEY`  
     에 넣기. (anon 키 말고 **service_role** 키 써야 함.)
3. **SQL Editor** 열고 → 프로젝트 안에 있는 **`supabase/funnel_tracker.sql`** 파일 내용 **전부 복사**해서 SQL Editor에 붙여넣기 → **Run** 으로 실행.  
   (이렇게 해야 어드민 대시보드에서 퍼널 숫자가 읽혀 들어감.)

---

## 5단계: 설문 URL — 왜 필요한지 / 필요한지

- **우리 사이트는 메인 → /survey(사이트 내 설문) → /onboarding** 로만 쓰면 됨.
- **외부 설문(예: Google 폼)** 을 쓰지 않으면 **`NEXT_PUBLIC_SURVEY_URL` 은 안 넣어도 됨.**  
  코드에 예시 URL 이 있어도, 실제로 그 주소를 쓰는 버튼이 없으면 동작에는 영향 없음.  
  → **“굳이 실제 설문 URL 이 왜 필요함?”** → **필요 없음.** 자체 /survey 만 쓰면 됨.

---

## 6단계: Master DM 링크 (디스코드)

- Step 5 “Buka DM Master MIT_ZUN” 버튼은 **디스코드 DM** 으로 연결되도록 이미 코드 수정해 둠.  
  (예: `https://discordapp.com/users/364799578291306496` — 본인 디스코드 유저 ID 로 바꾸고 싶으면 개발자에게 “이 링크만 바꿔줘” 하면 됨.)
- **텔레그램 주소는 더 이상 안 씀.** 디스코드로만 열리게 되어 있음.

---

## 7단계: 퍼널 트레커 — 사람 들어와야 검증 가능한지

- **맞음.** 퍼널 숫자(방문자, 단계별 이탈 등)는 **실제로 사람이 들어와서** 설문/온보딩을 진행해야 쌓임.
- 지금은 **어드민이 Supabase 에서 숫자를 “읽기”만** 하고, **사이트 쪽에서 “단계 도달 시 Supabase 에 넣는 코드”** 는 아직 없을 수 있음.  
  그 코드가 없으면 숫자는 0 으로 나옴.  
  → **검증하려면:**  
  1) Supabase + `.env.local` 설정까지 끝낸 뒤,  
  2) (가능하면) 퍼널 이벤트 넣는 기능이 추가되면, 실제로 몇 번 들어와서 설문/온보딩 진행해 보면 어드민에서 숫자 올라가는지 확인하면 됨.

---

## 할일 체크리스트 (순서대로)

| 순서 | 할 일 | 확인 |
|------|--------|------|
| 1 | `.env.example` 복사해서 `.env.local` 만들기 |  |
| 2 | Gate.io: 이미 잘 되면 스킵. 아니면 테더겟에서 키 복사해서 `.env.local` 에 넣기 |  |
| 3 | Discord: 버튼 이미 잘 되면 스킵. 아니면 `NEXT_PUBLIC_DISCORD_LINK` 넣고 서버 재시작 |  |
| 4 | Supabase: **새 프로젝트** 하나 만들기 (테더겟이랑 다른 거 권장) |  |
| 5 | Supabase 에서 Project URL, **service_role 키** 복사 → `.env.local` 에 넣기 |  |
| 6 | Supabase SQL Editor 에서 `funnel_tracker.sql` 실행 |  |
| 7 | 어드민: `ADMIN_ID`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` 본인 값으로 넣기 |  |
| 8 | (선택) 외부 설문 안 쓰면 `NEXT_PUBLIC_SURVEY_URL` 은 비워두기 |  |
| 9 | 저장 후 `npm run dev` 다시 실행해서 확인 |  |

---

- **Supabase 롤키:** 테더겟이랑 **다른 프로젝트** 쓰면 당연히 **다른** URL, **다른** service_role 키 써야 함.  
- **Gate.io:** 이미 잘 되고 있으면 그대로 두면 됨.  
- **디스코드:** 이미 잘 눌리면 그대로 두면 됨.  
- **Master DM:** 디스코드로 열리게 수정해 둠. 텔레그램 아님.
