# 🎓 TOEFL ITP ITB Practice App — Frontend (React PWA)

Aplikasi web modern berbasis **React (Vite) + Tailwind CSS** yang didesain khusus sebagai media latihan intensif tes **TOEFL ITP (Section 2: Structure & Written Expression)** untuk persiapan masuk pascasarjana Institut Teknologi Bandung (ITB) dan beasiswa internasional.

Aplikasi ini mendukung mode **Progressive Web App (PWA)** penuh (dapat di-install di Android, iOS, maupun Desktop) dengan navigasi khusus smartphone, countdown timer resmi, dan pusat belajar **Tips & Trik**.

---

## 🌟 Fitur Utama Frontend

* **Progressive Web App (PWA)**:
  * Dukungan *Service Worker* & *Web App Manifest* (`public/manifest.json`).
  * Desain antarmuka responsif ramah jempol (*Thumb-friendly action bar*).
  * Bilah navigasi bawah (*PWA Bottom Navigation*) khusus mobile.
  * Tombol instalasi instan (*PWA Install Prompt*).
* **Ruang Latihan Interaktif (Practice Room)**:
  * Simulasi resmi 40 soal Section 2 dengan countdown timer (Pilihan: 45s standar ITB, 30s tantangan, atau Zen mode tanpa batas waktu).
  * Auto-render Part A (kalimat rumpang) dan Part B (deteksi kata bergaris bawah `[word](A)`).
  * Palet navigasi nomor soal & penanda ragu-ragu (*Flag for review*).
* **Pusat Belajar Tips & Trik (Formula Hub)**:
  * 15 rumus pasangan kata paten (*Correlative Conjunctions*).
  * Panduan kilat Part A (*Subject & Verb*, *Inversi*, *Appositives*, *Reduced Clauses*).
  * Panduan sistematis 5 langkah eliminasi Part B.
  * Pilihan tampilan Kartu Interaktif vs Tabel Ringkas (*compact cheat sheet*).
* **Hasil Skor & Pembahasan Mendalam (Results & Diagnostic)**:
  * Konversi skor resmi (Skala 31–68 Section 2, estimasi total ITP 310–677, iBT concordance).
  * Pembahasan lengkap berbahasa Indonesia untuk setiap butir soal.
  * Fitur **"Latih Soal Salah Saja"** untuk pengulangan instan (*Spaced Repetition*).
* **Panel Administrator**:
  * Impor massal bank soal via file Excel (`.xlsx`).
  * Generator soal otomatis berbasis Google Gemini AI.
  * Kelola akun & fasilitas reset password mahasiswa.

---

## 🛠️ Tech Stack

* **Framework**: React 18 (Vite)
* **Styling**: Tailwind CSS
* **Routing**: React Router DOM (v6)
* **Icons**: Lucide React
* **HTTP Client**: Axios (dengan interceptor token JWT)
* **PWA**: Service Worker (`sw.js`) & Web App Manifest

---

## 🚀 Panduan Menjalankan

### 1. Pasang Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi file `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Akses di browser pada: `http://localhost:5173`

### 4. Build Produksi
```bash
npm run build
```

---

## 📄 Lisensi
ISC License. Dikembangkan untuk persiapan TOEFL ITP resmi pascasarjana ITB.
