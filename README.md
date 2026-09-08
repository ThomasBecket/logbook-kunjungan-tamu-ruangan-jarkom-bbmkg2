# Logbook Kunjungan Tamu Ruangan Jarkom BBMKG2

Aplikasi web untuk mencatat kunjungan tamu ke ruangan Jarkom BBMKG Wilayah II, menggantikan buku tamu manual. Terdiri dari halaman publik untuk tamu (scan QR di pintu masuk/keluar) dan panel admin untuk petugas memverifikasi kunjungan.

## Fitur

**Untuk Tamu**
- **Form Masuk** — isi nama (mendukung rombongan), unit kerja/instansi, dan keperluan. Setelah submit, tamu mendapat nomor kunjungan unik (format `DDMMYYYY-NNN`) dan diarahkan ke halaman status pribadinya.
- **Halaman Status Kunjungan** (`/status/:id`) — bisa dibuka ulang kapan saja lewat link/bookmark untuk cek status (Menunggu/Diterima/Ditolak). Begitu status "Diterima", muncul tombol langsung ke Form Keluar.
- **Form Keluar** — konfirmasi kepulangan dengan memasukkan nomor kunjungan.

**Untuk Petugas (Admin)**
- **Dashboard** — ringkasan statistik kunjungan, grafik kunjungan 7 hari terakhir, dan komposisi status.
- **Tamu Menunggu** — approve/reject kunjungan yang masuk.
- **Riwayat Tamu** — seluruh data kunjungan, dengan filter rentang tanggal (kalender interaktif), urutkan terbaru/terlama, atur jumlah data per halaman, dan tombol **Unduh Excel**.
- **Tamu Hari Ini** — otomatis menyaring kunjungan pada tanggal berjalan.
- **Menu Profil** — Ganti Password & Logout.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React.js (Vite), react-router-dom, axios, recharts, react-datepicker, xlsx |
| Backend | Node.js, Express.js, pola MVC |
| Database | MySQL |
| Autentikasi | JWT + bcrypt |

## Struktur Folder

```
logbook-kunjungan-tamu-ruangan-jarkom-bbmkg2/
├── backend/
│   ├── src/
│   │   ├── models/            ← query SQL (pengunjungModel.js)
│   │   ├── controllers/       ← validasi & response (pengunjungController.js)
│   │   ├── routes/            ← peta endpoint (pengunjung.js)
│   │   ├── utils/             ← buatIdKunjungan.js, formatTanggal.js
│   │   ├── db.js              ← koneksi pool MySQL
│   │   └── index.js           ← entry point Express
│   ├── .env                   ← kredensial (buat sendiri, lihat bagian instalasi)
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/              ← FormMasuk, FormKeluar, StatusKunjungan, Admin*
│   │   ├── components/         ← AdminLayout, ProfileMenu, StatusBadge, dll
│   │   ├── context/            ← ToastContext (notifikasi)
│   │   ├── hooks/               ← useDocumentTitle
│   │   ├── api/                 ← client.js (axios), storage.js (pemanggil API)
│   │   ├── App.jsx              ← routing
│   │   └── index.css
│   ├── vite.config.js          ← ada proxy /api ke backend
│   └── package.json
│
├── kunjungan_jarkom.sql        ← skema database, import ini duluan
└── README.md
```

## Instalasi

### Persiapan

- **Node.js** versi 18 ke atas ([nodejs.org](https://nodejs.org))
- **MySQL** (lewat XAMPP/Laragon/instalasi manual — yang penting phpMyAdmin atau akses MySQL bisa dipakai)

### 1. Setup Database

1. Buat database baru lewat phpMyAdmin.
2. Import file `kunjungan_jarkom.sql` yang ada di root project ini ke database tersebut.
3. Pastikan 4 tabel berhasil terbuat: `admin`, `pengunjung`, `pengunjung_nama`, `nomor_kunjungan`.

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/` (sejajar dengan `package.json`), isi:

```
DB_HOST= "Host Database anda"
DB_USER= "User Database anda"
DB_PASSWORD= "Password Database anda"
DB_NAME= "Nama Database anda"
PORT= "Port Database anda"
JWT_SECRET= "ganti-dengan-random-string-panjang"
```

Jalankan server:

```bash
npm run dev
```

Cek berhasil dengan buka `http://localhost:3001/api/ping` di browser — harus muncul `{"ok":true}`.

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Pastikan `frontend/vite.config.js` punya konfigurasi proxy berikut (supaya request `/api/...` diteruskan ke backend tanpa masalah CORS):

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

Jalankan dev server:

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### 4. Menjalankan Keduanya Sekaligus (opsional)

Dari folder root, bisa pakai `concurrently` supaya backend & frontend jalan dalam satu terminal:

```bash
npm install --save-dev concurrently
```

Tambahkan script di `package.json` root:

```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
}
```

Lalu cukup jalankan `npm run dev` dari root.

## Endpoint API

Base URL: `http://localhost:3001/api/pengunjung`

| Method | Path | Fungsi |
|---|---|---|
| `POST` | `/` | Tamu submit data masuk |
| `GET` | `/` | Ambil semua data kunjungan |
| `GET` | `/:id` | Cek status satu kunjungan |
| `PATCH` | `/:id/status` | Admin approve/reject |
| `POST` | `/:id/keluar` | Konfirmasi tamu keluar |

## Catatan Lain

- Package `xlsx` (untuk fitur Unduh Excel) sengaja di-install dari CDN resmi SheetJS, bukan npm registry biasa, karena versi di npm sudah lama tidak di-patch:
  ```bash
  npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
  ```