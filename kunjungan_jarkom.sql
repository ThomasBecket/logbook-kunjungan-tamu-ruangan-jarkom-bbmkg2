-- =========================================================
-- kunjungan_jarkom
-- Riwayat revisi:
--   1. Tabel `pengunjung`: tambah kolom `status`, `waktu_keluar` jadi NULLable
--   2. Tabel baru `pengunjung_nama`: relasi 1-ke-banyak untuk tamu rombongan
--   3. Tabel baru `nomor_kunjungan`: generator id_pengunjung format DDMMYYYY-NNN
--   4. Tabel `pengunjung`: tambah kolom `nama_petugas_verifikasi`
--      (mencatat petugas yang approve/reject kunjungan)
--   5. Tabel `admin`: id_admin jadi VARCHAR(3) (001, 002, dst — tanpa
--      AUTO_INCREMENT, slot yang dihapus akan dipakai ulang oleh admin
--      berikutnya), tambah kolom `role` ('utama' / 'petugas') dan
--      `status` ('Menunggu Persetujuan' / 'Diterima' / 'Ditolak')
-- =========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Tabel: admin
-- id_admin format 3 digit ("001", "002", dst), di-generate manual oleh
-- backend (lihat models/adminModel.js -> cariIdBerikutnya()), BUKAN
-- AUTO_INCREMENT — supaya slot yang kosong (admin dihapus) bisa dipakai
-- ulang oleh admin yang dibuat berikutnya.
--
-- role:   'utama'   -> cuma bisa approve/reject admin baru, TIDAK bisa
--                      approve/reject kunjungan tamu (lihat saja)
--         'petugas' -> approve/reject kunjungan tamu seperti biasa,
--                      TIDAK bisa approve/reject admin baru
--
-- status: 'Menunggu Persetujuan' -> baru daftar, belum bisa login
--         'Diterima'             -> sudah disetujui admin utama, bisa login
--         'Ditolak'              -> pendaftaran ditolak, tidak bisa login
--
-- Admin PERTAMA (id_admin = '001', role = 'utama') wajib dibuat manual
-- lewat phpMyAdmin, karena belum ada admin utama yang bisa approve dia.
-- Gunakan hashPassword.js untuk generate hash bcrypt-nya, contoh:
--
--   INSERT INTO admin (id_admin, username, password, nama_petugas, role)
--   VALUES ('001', 'admin', '$2b$10$...hasil_hash_bcrypt...', 'Nama Anda', 'utama');
-- --------------------------------------------------------
CREATE TABLE `admin` (
  `id_admin` VARCHAR(3) NOT NULL,               -- contoh: 001, 002, 003
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,             -- simpan hash bcrypt, jangan plaintext
  `nama_petugas` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'petugas',       -- 'utama' | 'petugas'
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `uq_username` (`username`)
);

-- --------------------------------------------------------
-- Tabel: pengunjung
-- Satu baris = satu kunjungan (bisa untuk rombongan)
-- --------------------------------------------------------
CREATE TABLE `pengunjung` (
  `id_pengunjung` VARCHAR(12) NOT NULL,          -- contoh: 09022026-001
  `unit_kerja_instansi` VARCHAR(255) NOT NULL,
  `keperluan` TEXT NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'Menunggu Persetujuan',
  `nama_petugas_verifikasi` VARCHAR(255) NULL DEFAULT NULL, -- diisi otomatis dari sesi login saat approve/reject
  `waktu_masuk` DATETIME NOT NULL,
  `waktu_keluar` DATETIME NULL DEFAULT NULL,     -- baru terisi saat tamu keluar
  `alasan_ditolak` TEXT NULL,
  PRIMARY KEY (`id_pengunjung`)
);

-- --------------------------------------------------------
-- Tabel: pengunjung_nama
-- Menyimpan nama-nama tamu dalam satu kunjungan (rombongan)
-- --------------------------------------------------------
CREATE TABLE `pengunjung_nama` (
  `id_nama` INT(11) NOT NULL AUTO_INCREMENT,
  `id_pengunjung` VARCHAR(12) NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_nama`),
  KEY `idx_id_pengunjung` (`id_pengunjung`),
  CONSTRAINT `fk_pengunjung_nama_pengunjung`
    FOREIGN KEY (`id_pengunjung`) REFERENCES `pengunjung` (`id_pengunjung`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- --------------------------------------------------------
-- Tabel: nomor_kunjungan
-- Menyimpan nomor urut kunjungan per tanggal
-- Nomor urut digenerate ke id_pengunjung dengan format DDMMYYYY-NNN (contoh: 09022026-001)
-- --------------------------------------------------------
CREATE TABLE `nomor_kunjungan` (
  `tanggal` VARCHAR(8) NOT NULL,   -- format DDMMYYYY
  `nomor` INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tanggal`)
);

COMMIT;
