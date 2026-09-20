# Logbook Kunjungan Tamu Ruangan Jarkom BBMKG2

Aplikasi web untuk mencatat, memantau, dan mengelola kunjungan tamu ke Ruangan Jaringan Komunikasi BBMKG Wilayah II sebagai pengganti buku tamu manual.

Sistem terdiri dari halaman publik yang digunakan tamu untuk melakukan pencatatan kunjungan dan panel admin yang digunakan petugas untuk memverifikasi serta mengelola data kunjungan.

## Fitur

### Untuk Tamu

* **Form Masuk** — tamu mengisi nama tamu, unit kerja/instansi, dan keperluan. Form mendukung kunjungan rombongan.
* **Nomor Kunjungan Otomatis** — setiap kunjungan mendapatkan nomor unik dengan format `DDMMYYYY-NNN`.
* **Status Kunjungan** — tamu dapat melihat status kunjungannya melalui halaman `/status/:id`.
* **Status Menunggu Persetujuan** — setelah mengirim data, kunjungan menunggu verifikasi petugas.
* **Status Diterima** — apabila kunjungan diterima, tamu dapat melanjutkan ke Form Keluar.
* **Status Ditolak** — apabila kunjungan ditolak, tamu dapat melihat alasan penolakan apabila petugas memberikan alasan.
* **Form Keluar** — tamu melakukan konfirmasi ketika selesai berkunjung.
* **Penyimpanan Nomor Kunjungan** — nomor kunjungan terakhir disimpan pada browser untuk membantu mempertahankan akses ke kunjungan yang masih aktif.



### Untuk Petugas (Admin)

* **Login Admin** — autentikasi menggunakan username dan password.
* **Dashboard** — menampilkan ringkasan data kunjungan.
* **Tamu Menunggu Konfirmasi** — menampilkan kunjungan hari ini serta kunjungan dari hari sebelumnya yang masih berstatus `Menunggu Persetujuan`.
* **Konfirmasi Kunjungan** — petugas dapat menerima atau menolak kunjungan.
* **Alasan Penolakan** — ketika menolak kunjungan, petugas dapat memberikan alasan penolakan. Alasan bersifat opsional.
* **Detail Kunjungan** — data kunjungan dapat diklik untuk melihat informasi lengkap.
* **Tamu Hari Ini** — menampilkan seluruh kunjungan yang tercatat pada tanggal berjalan, termasuk waktu masuk, waktu keluar, dan status.
* **Riwayat Tamu** — menampilkan seluruh data kunjungan yang pernah tercatat.
* **Filter Riwayat** — riwayat dapat difilter berdasarkan rentang tanggal.
* **Pengurutan Data** — data riwayat dapat diurutkan dari terbaru ke terlama atau sebaliknya.
* **Pagination** — jumlah data per halaman dapat dipilih: 10, 50, 100, 250, 500, atau seluruh data.
* **Unduh Excel** — data riwayat dapat diekspor ke file Excel, termasuk informasi waktu masuk, waktu keluar, petugas verifikasi, dan alasan penolakan.
* **Profil Admin** — admin dapat melihat data akunnya, mengganti password, dan melakukan logout.



### Pengelolaan Admin

Sistem memiliki dua jenis role admin:

* **Admin Utama (`utama`)**

  * Dapat melihat seluruh data kunjungan.
  * Tidak dapat melakukan konfirmasi atau penolakan kunjungan.
  * Dapat melihat daftar seluruh admin.
  * Dapat menambahkan akun admin petugas.
  * Dapat menghapus akses admin petugas.
  * Tidak dapat menghapus akun Admin Utama.

* **Admin Petugas (`petugas`)**

  * Dapat melakukan konfirmasi kunjungan.
  * Dapat menolak kunjungan dan memberikan alasan penolakan.
  * Dapat melihat data kunjungan.
  * Dapat mengganti password akunnya sendiri.
  * Tidak dapat menambah atau menghapus akun admin lain.

Akun admin petugas dibuat langsung oleh Admin Utama dan dapat langsung digunakan untuk login tanpa proses persetujuan tambahan.



## Status Kunjungan

Sistem menggunakan beberapa status kunjungan:

| Status                 | Keterangan                                    |
| ---------------------- | --------------------------------------------- |
| `Menunggu Persetujuan` | Kunjungan baru dan belum diverifikasi petugas |
| `Diterima`             | Kunjungan telah diterima dan tamu dapat masuk |
| `Ditolak`              | Kunjungan ditolak oleh petugas                |
| `Kunjungan Selesai`    | Tamu telah melakukan konfirmasi keluar        |

Untuk kunjungan yang berstatus `Ditolak`, sistem dapat menyimpan `alasan_ditolak`. Alasan tersebut dapat ditampilkan pada detail kunjungan dan halaman status tamu.



## Teknologi

| Bagian             | Teknologi                                                                |
| ------------------ | ------------------------------------------------------------------------ |
| Frontend           | React.js, Vite, React Router, Axios, Recharts, React Datepicker, SheetJS |
| Backend            | Node.js, Express.js                                                      |
| Arsitektur Backend | MVC                                                                      |
| Database           | MySQL                                                                    |
| Autentikasi        | JWT + bcrypt                                                             |
| HTTP Client        | Axios                                                                    |
| Export Data        | SheetJS (`xlsx`)                                                         |



## Struktur Folder

```text
logbook-kunjungan-tamu-ruangan-jarkom-bbmkg2/
├── backend/
│   ├── src/
│   │   ├── controllers/       ← logika request & response
│   │   ├── middleware/        ← autentikasi & pembatasan akses
│   │   ├── models/            ← query database
│   │   ├── routes/             ← endpoint API
│   │   ├── utils/              ← fungsi bantuan
│   │   ├── database.js         ← koneksi pool MySQL
│   │   └── index.js            ← entry point Express
│   ├── .env                    ← konfigurasi database & JWT
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                ← komunikasi dengan backend
│   │   ├── components/         ← komponen antarmuka
│   │   ├── context/            ← context aplikasi & autentikasi
│   │   ├── hooks/              ← custom hooks
│   │   ├── pages/              ← halaman tamu & admin
│   │   ├── App.jsx             ← routing aplikasi
│   │   └── index.css           ← stylesheet utama
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── kunjungan_jarkom.sql        ← skema database
├── package.json
├── package-lock.json
└── README.md
```



## Instalasi

### Persiapan

Pastikan perangkat telah memiliki:

* **Node.js** versi 18 atau lebih baru
* **MySQL**
* **npm**

MySQL dapat dijalankan melalui XAMPP, Laragon, atau instalasi MySQL secara langsung.



### 1. Setup Database

1. Buat database baru melalui phpMyAdmin atau MySQL.
2. Import file `kunjungan_jarkom.sql` yang berada di root project.
3. Pastikan tabel berikut berhasil dibuat:

```text
admin
pengunjung
pengunjung_nama
nomor_kunjungan
```



### 2. Setup Backend

Masuk ke folder backend:

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/` dan isi konfigurasi sesuai database yang digunakan:

```env
DB_HOST=Host Database Anda
DB_USER=User Database Anda
DB_PASSWORD=Password Database Anda
DB_NAME=Nama Database Anda
PORT=3001
JWT_SECRET=ganti-dengan-random-string-panjang
```

Kemudian jalankan backend:

```bash
npm run dev
```

atau untuk menjalankan tanpa nodemon:

```bash
npm start
```

Backend secara default berjalan pada:

```text
http://localhost:3001
```

Untuk memeriksa koneksi server, buka:

```text
http://localhost:3001/api/ping
```

Jika berhasil, server akan mengembalikan:

```json
{
  "ok": true
}
```



### 3. Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
```

Jalankan development server:

```bash
npm run dev
```

Frontend secara default dapat diakses melalui:

```text
http://localhost:5173
```



### 4. Menjalankan Backend dan Frontend Bersamaan

Jika ingin menjalankan keduanya dari root project, gunakan `concurrently`:

```bash
npm install --save-dev concurrently
```

Kemudian tambahkan script berikut pada `package.json` root:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  }
}
```

Setelah itu jalankan dari root project:

```bash
npm run dev
```



## Routing Frontend

### Halaman Publik

| Path           | Fungsi                          |
| -------------- | ------------------------------- |
| `/form-masuk`  | Form pencatatan kunjungan masuk |
| `/form-keluar` | Form konfirmasi tamu keluar     |
| `/status/:id`  | Melihat status kunjungan        |
| `/login`       | Login admin                     |



### Halaman Admin

Seluruh halaman berikut berada di bawah `/admin` dan membutuhkan autentikasi:

| Path                              | Fungsi                                     |
| --------------------------------- | ------------------------------------------ |
| `/admin`                          | Dashboard admin                            |
| `/admin/admin-tamu-menunggu`      | Kunjungan yang menunggu/kunjungan hari ini |
| `/admin/admin-riwayat-tamu`       | Riwayat seluruh kunjungan                  |
| `/admin/admin-tamu-hari-ini`      | Kunjungan pada tanggal berjalan            |
| `/admin/admin-list-petugas-admin` | Pengelolaan admin petugas oleh Admin Utama |

Akses ke halaman admin dilindungi oleh autentikasi JWT.



## Endpoint API

### Pengunjung

Base URL:

```text
http://localhost:3001/api/pengunjung
```

| Method  | Path          | Akses         | Fungsi                             |
| ------- | ------------- | ------------- | ---------------------------------- |
| `POST`  | `/`           | Publik        | Membuat kunjungan baru             |
| `GET`   | `/:id`        | Publik        | Melihat data/status satu kunjungan |
| `POST`  | `/:id/keluar` | Publik        | Mencatat tamu keluar               |
| `GET`   | `/`           | Admin         | Mengambil seluruh data kunjungan   |
| `PATCH` | `/:id/status` | Admin Petugas | Menerima atau menolak kunjungan    |

Saat melakukan penolakan, endpoint status dapat menerima alasan penolakan. Nama petugas verifikasi diambil otomatis dari sesi login/JWT.



### Admin

Base URL:

```text
http://localhost:3001/api/admin
```

| Method   | Path              | Akses       | Fungsi                         |
| -------- | ----------------- | ----------- | ------------------------------ |
| `POST`   | `/login`          | Publik      | Login admin                    |
| `GET`    | `/saya`           | Admin       | Mengambil data sesi admin      |
| `PATCH`  | `/ganti-password` | Admin       | Mengganti password sendiri     |
| `GET`    | `/semua`          | Admin Utama | Mengambil seluruh daftar admin |
| `POST`   | `/tambah`         | Admin Utama | Membuat admin petugas baru     |
| `DELETE` | `/:id`            | Admin Utama | Menghapus akses admin petugas  |

Endpoint pengelolaan admin dilindungi oleh autentikasi JWT dan pembatasan role Admin Utama.



## Database

Database utama menggunakan MySQL.

### Tabel `admin`

Menyimpan akun pengguna panel admin.

Kolom utama:

```text
id_admin
username
password
nama_petugas
role
```

Role yang digunakan:

```text
utama
petugas
```

`id_admin` menggunakan format tiga digit seperti:

```text
001
002
003
```

ID dibuat oleh backend dan slot ID yang sudah kosong dapat digunakan kembali.

Password admin disimpan dalam bentuk hash menggunakan bcrypt.



### Tabel `pengunjung`

Menyimpan data utama setiap kunjungan:

```text
id_pengunjung
unit_kerja_instansi
keperluan
status
nama_petugas_verifikasi
waktu_masuk
waktu_keluar
alasan_ditolak
```


### Tabel `pengunjung_nama`

Menyimpan nama tamu yang terhubung dengan suatu kunjungan.

Struktur ini memungkinkan satu nomor kunjungan digunakan untuk beberapa orang dalam satu rombongan.



### Tabel `nomor_kunjungan`

Digunakan untuk menghasilkan nomor kunjungan berdasarkan tanggal dengan format:

```text
DDMMYYYY-NNN
```

Contoh:

```text
18092026-001
18092026-002
18092026-003
```



## Keamanan

Sistem menggunakan beberapa mekanisme keamanan:

* Password admin menggunakan hashing bcrypt.
* Autentikasi panel admin menggunakan JWT.
* Endpoint yang membutuhkan autentikasi dilindungi middleware.
* Fungsi pengelolaan akun admin dibatasi untuk Admin Utama.
* Admin Utama tidak dapat dihapus.
* Tamu tidak dapat mengakses endpoint data seluruh kunjungan.
* Validasi dilakukan pada backend sebelum data diproses.



## Export Excel

Halaman **Riwayat Tamu** menyediakan fitur **Unduh Excel**.

Data yang diekspor mencakup:

* Nomor Kunjungan
* Nama Tamu
* Unit Kerja / Instansi
* Keperluan
* Status
* Waktu Masuk
* Waktu Keluar
* Petugas Verifikasi
* Alasan Ditolak

Package `xlsx` menggunakan paket resmi SheetJS dari CDN:

```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```



## Catatan Pengembangan

* File `.env` tidak disertakan dalam repository dan harus dibuat sendiri pada komputer/server yang menjalankan backend.
* Jangan menyimpan password database atau `JWT_SECRET` secara langsung di source code.
* Untuk deployment pada jaringan internal, pembatasan akses terhadap panel admin sebaiknya dilakukan pada konfigurasi jaringan atau web server selain tetap menggunakan autentikasi aplikasi.
