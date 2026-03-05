# Final Deployment Readiness Check

배포 전 아래 순서대로 점검하면 됨.

---

## 1. Environment Linkage (env 인식 여부)

서버가 `.env.local` 의 Supabase·Admin 변수를 읽는지 확인:

1. 로컬에서 `npm run dev` 실행.
2. 브라우저 또는 터미널에서:
   ```bash
   curl http://localhost:3000/api/deploy-check
   ```
3. 응답 예시:
   ```json
   {
     "ok": true,
     "supabaseConfigured": true,
     "supabaseConnected": true,
     "adminConfigured": true
   }
   ```
   - `supabaseConfigured`: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 가 설정되어 있는지.
   - `supabaseConnected`: 위 설정으로 Supabase `funnel_tracker` 테이블에 접근 가능한지 (실제 쿼리 1회 수행).
   - `adminConfigured`: `ADMIN_ID`, `ADMIN_PASSWORD` 가 설정되어 있는지.

값이 `false` 이면 해당 항목의 env를 `.env.local` 에 넣고 서버 재시작 후 다시 호출.

---

## 2. Funnel Tracking (랜딩 뷰 기록)

메인페이지 접속 시 `funnel_tracker` 에 **`landing`** 단계가 자동으로 들어가는지 확인:

1. 메인페이지 (`/`) 한 번 열기.
2. 어드민 로그인 후 `/admin` 대시보드에서 **Traffic / Conversion Funnel** 숫자가 올라갔는지 확인.
   - 또는 Supabase 대시보드 → Table Editor → `funnel_tracker` 에서 `stage = 'landing'` 인 행이 새로 생겼는지 확인.

**동작 방식:**

- 메인(`/`) 마운트 시 `POST /api/funnel/track` 에 `{ stage: "landing", session_id }` 전송.
- `session_id` 는 브라우저 `sessionStorage` 에 저장되어 설문/온보딩에서 같은 세션으로 이어서 찍을 수 있음.
- DB에는 스테이지 이름 **`landing`** 으로 저장됨 (admin 대시보드와 동일).

---

## 3. Admin Access (/admin 로그인)

`.env.local` 에 넣은 `ADMIN_ID`, `ADMIN_PASSWORD` 로 로그인되는지 확인:

1. 브라우저에서 `http://localhost:3000/admin` 접속.
2. 로그인 폼에 **ADMIN_ID** 값 입력, **ADMIN_PASSWORD** 값 입력.
3. 로그인 버튼 클릭 → 대시보드(트래픽, 퍼널, UID 테이블)가 보이면 성공.
4. 503 "Admin belum dikonfigurasi" → env 미설정. `.env.local` 확인 후 서버 재시작.
5. 401 "ID atau kata sandi salah" → ID/비번이 env 와 다름. env 값과 입력값 확인.

---

## 요약 체크리스트

| 항목 | 확인 방법 |
|------|-----------|
| Env 연동 | `GET /api/deploy-check` → `supabaseConfigured`, `supabaseConnected`, `adminConfigured` 모두 true |
| 랜딩 퍼널 | 메인 접속 후 Supabase 또는 어드민에서 `landing` 행/숫자 증가 확인 |
| 어드민 로그인 | `/admin` 에서 ADMIN_ID / ADMIN_PASSWORD 로 로그인 후 대시보드 표시 확인 |
