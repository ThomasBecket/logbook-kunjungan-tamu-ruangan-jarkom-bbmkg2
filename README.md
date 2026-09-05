# Logbook Kunjungan Tamu Ruangan Jarkom BBMKG2 — Versi Terpisah

Halaman pengunjung sengaja DIPISAH:
- form-masuk.jsx = khusus QR pintu masuk
- form-keluar.jsx = khusus QR pintu keluar

Tidak ada halaman yang menggabungkan tombol Masuk dan Keluar.

Alur:
QR Masuk -> masuk.jsx -> isi data -> menunggu -> admin konfirmasi -> boleh masuk
QR Keluar -> keluar.jsx -> masukkan nomor kunjungan -> data keluar tercatat

Ini masih demo frontend. Data menggunakan localStorage browser, belum database/backend.