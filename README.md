# AEGIS — AI Security Analysis & Self-Healing Platform

## Struktur Menu & Halaman

Platform ini dirancang dengan alur kerja bertahap (phases) yang mencakup analisis statis hingga pemantauan real-time.

- **Landing Page**: http://localhost:3000/
- **Login Page**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

### Pengembangan
Project web berada di dalam direktori `aegis-teaser/`.

---
(Konten asli di bawah)

Berikut adalah penjelasan singkat untuk masing-masing menu dan halaman di dalam platform AEGIS:

- **Landing Page**: Halaman awal yang menjelaskan fitur, fase, dan manfaat AEGIS secara umum sebelum login.
- **Login Page**: Halaman autentikasi pengguna menggunakan GitHub OAuth.
- **Dashboard**: Halaman utama sebagai pusat navigasi yang menampilkan ringkasan project, risk score, dan status monitoring.
- **Reports Page**: Halaman untuk melihat serta mengekspor seluruh laporan hasil analisis dan pemantauan (Phase 1, 2, 3).
- **Phase 0: Project Setup / Code Ingestion**: Tahap awal untuk memasukkan project (via GitHub/ZIP) beserta proses deteksi bahasa dan dependensi.
- **Human in the Loop: Review Project**: Titik kontrol pertama di mana pengguna memvalidasi project yang dimasukkan sudah sesuai sebelum dianalisis.
- **Phase 1: Static Analysis**: Tahap analisis statis pada source code untuk mendeteksi kerentanan (seperti OWASP Top 10, exposed secrets, dll).
- **Human in the Loop: Review Findings & Patch**: Titik keputusan bagi pengguna untuk meninjau temuan (findings), preview diff, serta menerapkan (apply) patch yang disarankan.
- **Phase 2: Active Pentest**: Tahap pengujian penetrasi secara aktif menggunakan AEGIS Agent terhadap target yang sudah berjalan.
- **Human in the Loop: Review Pentest Result**: Proses evaluasi hasil pentest dan rekomendasi perbaikan sebelum beralih ke tahap berikutnya.
- **Phase 3: Monitoring & Self-Healing**: Tahap pemantauan log dan traffic aplikasi secara real-time yang disertai dengan kemampuan pertahanan otomatis (self-healing).
- **Human in the Loop: Review Alert / Reverse Healing**: Titik kontrol pengguna saat sistem mengirimkan alert atau menerapkan healing, di mana pengguna dapat mempertahankan atau membatalkan (reverse) aksi tersebut.
