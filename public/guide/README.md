# Gate.io KYC 가이드 이미지 (온보딩 2단계 모달용)

**테더겟과 동일한 KYC 가이드**를 쓰려면, 테더겟 프로젝트의 `public/guide/` 에서 아래 파일을 이 폴더로 **복사**하세요.

## 필요한 파일 (7장 → 3단계로 표시)

| 파일명 | 내용 |
|--------|------|
| `gateio-kyc-1.png` | User Center → KYC 메뉴 |
| `gateio-kyc-2.png` | Pusat Verifikasi, [Verify Now] |
| `gateio-kyc-3.png` | Pilih Kewarganegaraan (Indonesia, ID Card) |
| `gateio-kyc-4.png` | Instruksi Foto KTP |
| `gateio-kyc-5.png` | Konfirmasi Informasi Dasar |
| `gateio-kyc-6.png` | Verifikasi Alamat (Level 2) |
| `gateio-kyc-7.png` | Verifikasi Selesai (Verified) |

**복사 예시 (PowerShell):**
```powershell
Copy-Item "C:\Users\User\Desktop\tether-get\public\guide\gateio-kyc-*.png" "C:\Users\User\Desktop\mit-challenge\public\guide\"
```

이미지가 없으면 모달에서 "[Gambar]" 플레이스홀더만 보입니다.
